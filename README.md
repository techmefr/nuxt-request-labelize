[English](./README.md) | [Francais](./docs/README.fr.md) | [Italiano](./docs/README.it.md) | [Espanol](./docs/README.es.md) | [Portugues](./docs/README.pt.md) | [中文](./docs/README.zh.md) | [Deutsch](./docs/README.de.md)

# nuxt-request-labelize

Nuxt module that adds custom labels to your network requests, visible directly in the **Name column** of DevTools Network tab.

## The problem

You have a page that fires 10+ calls to `/api/power`. In DevTools Network, you see:

```
Name            Status
power           200
power           200
power           200
power           200
...
```

Good luck finding the one you need.

## The solution

With `nuxt-request-labelize`, the same calls show:

```
Name            Status
power-1         200
power-2         200
power-3         200
power-4         200
...
```

Each request gets a unique, meaningful name in the Network tab.

## How it works

The module rewrites labeled request URLs through a local proxy:

```
Client (browser)                 Nuxt (Nitro)              Backend
  |                                |                         |
  |  /api/__label/power-1          |                         |
  |  ?_target=/api/power           |                         |
  | -----------------------------> |                         |
  |                                |  /api/power             |
  |                                | ----------------------> |
  |                                |                         |
  |  Response                      |  Response               |
  | <----------------------------- | <---------------------- |
```

The browser sees `/api/__label/power-1` in the Network tab (Name column shows `power-1`). The backend receives the original `/api/power` URL unchanged.

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

## Usage

### Simple label

```ts
await $fetch('/api/power', {
  requestLabel: 'power-global'
})
// Network Name: power-global
```

### Loop with index template

```ts
for (let i = 1; i <= 10; i++) {
  await $fetch('/api/power', {
    requestLabel: 'power-{{index}}',
    index: i
  })
}
// Network Name: power-1, power-2, ... power-10
```

### With useFetch

```ts
const { data } = await useFetch('/api/notes', {
  requestLabel: 'notes-list'
})
```

### Available templates

| Template | Value |
|----------|-------|
| `{{index}}` | Value of the `index` option, or auto-increment |
| `{{path}}` | URL path of the request |

## Configuration

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // Allowed NODE_ENV values (default: ['development'])
  headerName: 'X-Request-Label'              // Bonus header name (default: 'X-Request-Label')
}
```

When the current `NODE_ENV` is not in `enabledEnvs`, the module is completely disabled: no plugin, no server route, zero overhead.

## Roadmap

### v1 (current)
- [x] URL rewriting + proxy with label visible in Network tab Name column
- [x] Dynamic templates (`{{index}}`, `{{path}}`)
- [x] Environment-based activation
- [x] Bonus `X-Request-Label` header

### v2 (planned)
- [ ] Obfuscate mode: hide real endpoints in production
  - Server-side mapping only, client never sees the real URL
  - Browser shows an opaque hash instead of the actual endpoint
  - Config:
```ts
requestLabelize: {
  mode: 'obfuscate',
  routes: {
    'a1b2': '/api/users',
    'c3d4': '/api/power',
  }
}
```

## Development

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # Build module
npm run test      # Tests
```

## License

[MIT](LICENSE)
