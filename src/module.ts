import {
    defineNuxtModule,
    addPlugin,
    addTypeTemplate,
    addServerHandler,
    createResolver,
} from '@nuxt/kit'
import type { IModuleOptions } from './types'

export default defineNuxtModule<IModuleOptions>({
    meta: {
        name: 'nuxt-request-labelize',
        configKey: 'requestLabelize',
    },
    defaults: {
        enabledEnvs: ['development'],
        headerName: 'X-Request-Label',
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        addTypeTemplate({
            filename: 'types/request-labelize.d.ts',
            getContents: () =>
                [
                    "import 'ofetch'",
                    '',
                    "declare module 'ofetch' {",
                    '    interface FetchOptions {',
                    '        requestLabel?: string',
                    '        index?: number',
                    '    }',
                    '}',
                    '',
                    'declare global {',
                    '    interface RequestInit {',
                    '        requestLabel?: string',
                    '        index?: number',
                    '    }',
                    '}',
                    '',
                    'export {}',
                ].join('\n'),
        })

        const isEnabled = options.enabledEnvs.includes(process.env.NODE_ENV || 'development')
        if (!isEnabled) return

        nuxt.options.runtimeConfig.public.requestLabelize = {
            headerName: options.headerName,
        }

        addPlugin({
            src: resolver.resolve('./runtime/plugin.client'),
            mode: 'client',
        })

        addServerHandler({
            route: '/api/__label/**',
            handler: resolver.resolve('./runtime/server/proxy'),
        })
    },
})
