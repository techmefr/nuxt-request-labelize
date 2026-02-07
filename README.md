# nuxt-request-labelize

Module Nuxt pour ajouter des labels sur tous les appels reseau (`$fetch`, `useFetch`, `useLazyFetch`, `fetch` natif). Debug ultime : nom custom dans Network DevTools au lieu du nom d'endpoint.

## Fonctionnalites

- Intercepte tous les fetch Nuxt (composables + natif)
- Labels dynamiques : `power-{{index}}` ou `{{path}}` auto
- Controle par tableau d'environnements : `enabledEnvs: ['development']`
- Header personnalisable : `X-Request-Label`
- Zero overhead prod : desactive hors envs autorises
- TypeScript complet avec IntelliSense
- Templates integres : `{{index}}`, `{{path}}`

## Installation

```bash
npm install nuxt-request-labelize
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-request-labelize'],
  requestLabelize: {
    enabledEnvs: ['development'],
  }
})
```

## Utilisation

### Label simple

```ts
await $fetch('/api/power', {
  requestLabel: 'power-global'
})
// Network → X-Request-Label: power-global
```

### Boucle avec index

```ts
for (let i = 1; i <= 12; i++) {
  await $fetch(`/api/power/2026-0${i}`, {
    requestLabel: 'power-{{index}}-{{path}}',
    index: i
  })
}
// Network: power-1-/api/power/2026-01, power-2-/api/power/2026-02...
```

### Composables

```ts
const { data } = await useFetch('/api/notes', {
  requestLabel: 'notes-list'
})
```

### Fetch natif

```ts
const response = await fetch('/api/notes', {
  requestLabel: 'native-fetch'
})
```

## Options

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // NODE_ENV autorises (defaut: ['development'])
  headerName: 'X-MyLabel'                   // Header custom (defaut: 'X-Request-Label')
}
```

## Templates disponibles

| Template | Valeur |
|----------|--------|
| `{{path}}` | URL du fetch |
| `{{index}}` | Valeur de l'option `index`, ou auto-increment |

## Developpement

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # Build module
npm run test      # Tests
```

## Licence

[MIT](LICENSE)
