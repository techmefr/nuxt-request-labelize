[English](../README.md) | [Francais](./README.fr.md) | [Italiano](./README.it.md) | [Espanol](./README.es.md) | [Portugues](./README.pt.md) | [中文](./README.zh.md) | [Deutsch](./README.de.md)

# nuxt-request-labelize

Nuxt-Modul, das benutzerdefinierte Labels zu Ihren Netzwerkanfragen hinzufügt, die direkt in der **Name-Spalte** des DevTools Network-Tabs sichtbar sind.

## Das Problem

Sie haben eine Seite, die mehr als 10 Aufrufe an `/api/power` sendet. Im DevTools Network-Tab sehen Sie:

```
Name            Status
power           200
power           200
power           200
power           200
...
```

Viel Glück beim Finden der richtigen Anfrage.

## Die Lösung

Mit `nuxt-request-labelize` zeigen dieselben Aufrufe:

```
Name            Status
power-1         200
power-2         200
power-3         200
power-4         200
...
```

Jede Anfrage erhält einen eindeutigen, aussagekräftigen Namen im Network-Tab.

## Wie es funktioniert

Das Modul schreibt gelabelte Anfrage-URLs über einen lokalen Proxy um:

```
Client (Browser)                 Nuxt (Nitro)              Backend
  |                                |                         |
  |  /api/__label/power-1          |                         |
  |  ?_target=/api/power           |                         |
  | -----------------------------> |                         |
  |                                |  /api/power             |
  |                                | ----------------------> |
  |                                |                         |
  |  Antwort                       |  Antwort                |
  | <----------------------------- | <---------------------- |
```

Der Browser sieht `/api/__label/power-1` im Network-Tab (die Name-Spalte zeigt `power-1`). Das Backend erhält die ursprüngliche URL `/api/power` unverändert.

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

## Verwendung

### Einfaches Label

```ts
await $fetch('/api/power', {
  requestLabel: 'power-global'
})
// Network Name: power-global
```

### Schleife mit Index-Template

```ts
for (let i = 1; i <= 10; i++) {
  await $fetch('/api/power', {
    requestLabel: 'power-{{index}}',
    index: i
  })
}
// Network Name: power-1, power-2, ... power-10
```

### Mit useFetch

```ts
const { data } = await useFetch('/api/notes', {
  requestLabel: 'notes-list'
})
```

### Verfügbare Templates

| Template | Wert |
|----------|------|
| `{{index}}` | Wert der `index`-Option oder automatische Inkrementierung |
| `{{path}}` | URL-Pfad der Anfrage |

## Konfiguration

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // Erlaubte NODE_ENV-Werte (Standard: ['development'])
  headerName: 'X-Request-Label'              // Bonus-Header-Name (Standard: 'X-Request-Label')
}
```

Wenn der aktuelle `NODE_ENV` nicht in `enabledEnvs` enthalten ist, ist das Modul vollständig deaktiviert: kein Plugin, keine Server-Route, null Overhead.

## Roadmap

### v1 (aktuell)
- [x] URL-Umschreibung + Proxy mit sichtbarem Label in der Network-Tab Name-Spalte
- [x] Dynamische Templates (`{{index}}`, `{{path}}`)
- [x] Umgebungsbasierte Aktivierung
- [x] Bonus-Header `X-Request-Label`

### v2 (geplant)
- [ ] Verschleierungsmodus: Echte Endpunkte in der Produktion verbergen
  - Nur serverseitiges Mapping, der Client sieht niemals die echte URL
  - Der Browser zeigt einen undurchsichtigen Hash anstelle des tatsächlichen Endpunkts
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

## Entwicklung

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # Modul bauen
npm run test      # Tests
```

## Lizenz

[MIT](LICENSE)
