[English](../README.md) | [Francais](./README.fr.md) | [Italiano](./README.it.md) | [Espanol](./README.es.md) | [Portugues](./README.pt.md) | [中文](./README.zh.md) | [Deutsch](./README.de.md)

# nuxt-request-labelize

Modulo Nuxt che aggiunge etichette personalizzate alle tue richieste di rete, visibili direttamente nella colonna **Name** della scheda Network dei DevTools.

## Il problema

Hai una pagina che effettua più di 10 chiamate a `/api/power`. Nella scheda Network dei DevTools, vedi:

```
Name            Status
power           200
power           200
power           200
power           200
...
```

Buona fortuna a trovare quella che ti serve.

## La soluzione

Con `nuxt-request-labelize`, le stesse chiamate mostrano:

```
Name            Status
power-1         200
power-2         200
power-3         200
power-4         200
...
```

Ogni richiesta ottiene un nome unico e significativo nella scheda Network.

## Come funziona

Il modulo riscrive gli URL delle richieste etichettate attraverso un proxy locale:

```
Client (browser)                 Nuxt (Nitro)              Backend
  |                                |                         |
  |  /api/__label/power-1          |                         |
  |  ?_target=/api/power           |                         |
  | -----------------------------> |                         |
  |                                |  /api/power             |
  |                                | ----------------------> |
  |                                |                         |
  |  Risposta                      |  Risposta               |
  | <----------------------------- | <---------------------- |
```

Il browser vede `/api/__label/power-1` nella scheda Network (la colonna Name mostra `power-1`). Il backend riceve l'URL originale `/api/power` invariato.

## Installazione

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

## Utilizzo

### Etichetta semplice

```ts
await $fetch('/api/power', {
  requestLabel: 'power-global'
})
// Network Name: power-global
```

### Loop con template di indice

```ts
for (let i = 1; i <= 10; i++) {
  await $fetch('/api/power', {
    requestLabel: 'power-{{index}}',
    index: i
  })
}
// Network Name: power-1, power-2, ... power-10
```

### Con useFetch

```ts
const { data } = await useFetch('/api/notes', {
  requestLabel: 'notes-list'
})
```

### Template disponibili

| Template | Valore |
|----------|--------|
| `{{index}}` | Valore dell'opzione `index`, o auto-incremento |
| `{{path}}` | Percorso dell'URL della richiesta |

## Configurazione

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // Valori NODE_ENV consentiti (predefinito: ['development'])
  headerName: 'X-Request-Label'              // Nome dell'header bonus (predefinito: 'X-Request-Label')
}
```

Quando il `NODE_ENV` corrente non è in `enabledEnvs`, il modulo è completamente disabilitato: nessun plugin, nessuna route server, zero overhead.

## Roadmap

### v1 (attuale)
- [x] Riscrittura URL + proxy con etichetta visibile nella colonna Name di Network
- [x] Template dinamici (`{{index}}`, `{{path}}`)
- [x] Attivazione basata sull'ambiente
- [x] Header bonus `X-Request-Label`

### v2 (pianificata)
- [ ] Modalità offuscamento: nascondere i veri endpoint in produzione
  - Mappatura solo lato server, il client non vede mai l'URL reale
  - Il browser mostra un hash opaco invece dell'endpoint effettivo
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

## Sviluppo

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # Build del modulo
npm run test      # Test
```

## Licenza

[MIT](LICENSE)
