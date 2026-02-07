import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { resolveLabel, rewriteUrl } from './utils'

interface RequestLabelizeConfig {
    headerName: string
}

interface LabeledOptions {
    requestLabel?: string
    index?: number
    headers?: HeadersInit
    [key: string]: unknown
}

export default defineNuxtPlugin(() => {
    const { headerName } = useRuntimeConfig().public.requestLabelize as RequestLabelizeConfig

    let autoIndex = 0

    function processLabel(template: string, path: string, index?: number): string {
        autoIndex++
        return resolveLabel(template, path, index ?? autoIndex)
    }

    function extractPath(input: string | URL | Request): string {
        if (typeof input === 'string') {
            const qIndex = input.indexOf('?')
            return qIndex === -1 ? input : input.substring(0, qIndex)
        }
        if (input instanceof URL) return input.pathname
        return new URL(input.url).pathname
    }

    function getOriginalUrl(input: string | URL | Request): string {
        if (typeof input === 'string') return input
        if (input instanceof URL) return input.pathname + input.search
        const parsed = new URL(input.url)
        return parsed.pathname + parsed.search
    }

    function isRelativeUrl(url: string): boolean {
        return url.startsWith('/')
    }

    function withLabelHeader(existing: HeadersInit | undefined, label: string): Headers {
        const headers = new Headers(existing)
        headers.set(headerName, label)
        return headers
    }

    function processRequest(
        input: string | URL | Request,
        opts: LabeledOptions,
    ): { url: string; cleanOpts: Record<string, unknown> } {
        const originalUrl = getOriginalUrl(input)
        const path = extractPath(input)
        const { requestLabel, index, ...rest } = opts
        const label = processLabel(requestLabel!, path, index)

        const url = isRelativeUrl(originalUrl) ? rewriteUrl(originalUrl, label) : originalUrl

        return {
            url,
            cleanOpts: {
                ...rest,
                headers: withLabelHeader(rest.headers, label),
            },
        }
    }

    const original$Fetch = globalThis.$fetch
    const originalRaw = original$Fetch.raw

    const patched$Fetch = ((
        request: Parameters<typeof original$Fetch>[0],
        opts?: LabeledOptions,
    ) => {
        if (!opts?.requestLabel) return original$Fetch(request, opts)
        const { url, cleanOpts } = processRequest(request as string | URL | Request, opts)
        return original$Fetch(url, cleanOpts)
    }) as typeof original$Fetch

    const patchedRaw = ((
        request: Parameters<typeof originalRaw>[0],
        opts?: LabeledOptions,
    ) => {
        if (!opts?.requestLabel) return originalRaw(request, opts)
        const { url, cleanOpts } = processRequest(request as string | URL | Request, opts)
        return originalRaw(url, cleanOpts)
    }) as typeof originalRaw

    globalThis.$fetch = Object.assign(patched$Fetch, {
        raw: patchedRaw,
        native: original$Fetch.native,
        create: original$Fetch.create,
    })

    const originalFetch = globalThis.fetch

    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
        const opts = init as LabeledOptions | undefined
        if (!opts?.requestLabel) return originalFetch(input, init)
        const { url, cleanOpts } = processRequest(input as string | URL | Request, opts)
        return originalFetch(url, cleanOpts as RequestInit)
    }) as typeof globalThis.fetch
})
