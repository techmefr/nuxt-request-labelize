export default defineNuxtConfig({
    modules: ['../src/module'],
    requestLabelize: {
        enabledEnvs: ['development'],
    },
    devtools: { enabled: true },
})
