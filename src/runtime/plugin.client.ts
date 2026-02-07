import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { resolveLabel } from './utils'

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

    function processLabel(label: string, url: string, index?: number): string {
        autoIndex++
        return resolveLabel(label, url, index ?? autoIndex)
    }

    function extractPath(input: string | URL | Request): string {
        if (typeof input === 'string') return input
        if (input instanceof URL) return input.pathname
        return new URL(input.url).pathname
    }

    function withLabelHeader(existing: HeadersInit | undefined, label: string): Headers {
        const headers = new Headers(existing)
        headers.set(headerName, label)
        return headers
    }

    function buildLabeledOptions(
        url: string,
        opts: LabeledOptions,
    ): Record<string, unknown> {
        const { requestLabel, index, ...rest } = opts
        const label = processLabel(requestLabel!, url, index)
        return { ...rest, headers: withLabelHeader(rest.headers, label) }
    }

    const original$Fetch = globalThis.$fetch
    const originalRaw = original$Fetch.raw

    const patched$Fetch = ((
        request: Parameters<typeof original$Fetch>[0],
        opts?: LabeledOptions,
    ) => {
        if (!opts?.requestLabel) return original$Fetch(request, opts)
        const path = extractPath(request as string | URL | Request)
        return original$Fetch(request, buildLabeledOptions(path, opts))
    }) as typeof original$Fetch

    const patchedRaw = ((
        request: Parameters<typeof originalRaw>[0],
        opts?: LabeledOptions,
    ) => {
        if (!opts?.requestLabel) return originalRaw(request, opts)
        const path = extractPath(request as string | URL | Request)
        return originalRaw(request, buildLabeledOptions(path, opts))
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
        const path = extractPath(input as string | URL | Request)
        return originalFetch(input, buildLabeledOptions(path, opts) as RequestInit)
    }) as typeof globalThis.fetch
})
