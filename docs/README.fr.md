[English](../README.md) | [Francais](./README.fr.md) | [Italiano](./README.it.md) | [Espanol](./README.es.md) | [Portugues](./README.pt.md) | [中文](./README.zh.md) | [Deutsch](./README.de.md)

# nuxt-request-labelize

Module Nuxt qui ajoute des labels personnalisés à vos requêtes réseau, visibles directement dans la colonne **Name** de l'onglet Network des DevTools.

## Le problème

Vous avez une page qui effectue plus de 10 appels vers `/api/power`. Dans l'onglet Network des DevTools, vous voyez :

```
Name            Status
power           200
power           200
power           200
power           200
...
```

Bonne chance pour trouver celle dont vous avez besoin.

## La solution

Avec `nuxt-request-labelize`, les mêmes appels affichent :

```
Name            Status
power-1         200
power-2         200
power-3         200
power-4         200
...
```

Chaque requête obtient un nom unique et significatif dans l'onglet Network.

## Comment ça fonctionne

Le module réécrit les URLs des requêtes labelisées via un proxy local :

```
Client (navigateur)              Nuxt (Nitro)              Backend
  |                                |                         |
  |  /api/__label/power-1          |                         |
  |  ?_target=/api/power           |                         |
  | -----------------------------> |                         |
  |                                |  /api/power             |
  |                                | ----------------------> |
  |                                |                         |
  |  Réponse                       |  Réponse                |
  | <----------------------------- | <---------------------- |
```

Le navigateur voit `/api/__label/power-1` dans l'onglet Network (la colonne Name affiche `power-1`). Le backend reçoit l'URL originale `/api/power` inchangée.

> **Note SSR :** Lorsqu'une requête est exécutée pendant le SSR (rendu côté serveur), elle n'apparaît pas dans l'onglet Network du navigateur, car elle ne passe jamais par le client. Les labels de requête ne sont donc visibles que pour les requêtes côté client (après hydratation, navigation, rafraîchissement, etc).

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
// Network Name: power-global
```

### Boucle avec template d'index

```ts
for (let i = 1; i <= 10; i++) {
  await $fetch('/api/power', {
    requestLabel: 'power-{{index}}',
    index: i
  })
}
// Network Name: power-1, power-2, ... power-10
```

### Avec useFetch

```ts
const { data } = await useFetch('/api/notes', {
  requestLabel: 'notes-list'
})
```

### Templates disponibles

| Template | Valeur |
|----------|--------|
| `{{index}}` | Valeur de l'option `index`, ou auto-incrémentation |
| `{{path}}` | Chemin de l'URL de la requête |

## Configuration

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // Valeurs NODE_ENV autorisées (défaut: ['development'])
  headerName: 'X-Request-Label'              // Nom du header bonus (défaut: 'X-Request-Label')
}
```

Lorsque le `NODE_ENV` actuel n'est pas dans `enabledEnvs`, le module est complètement désactivé : pas de plugin, pas de route serveur, zéro surcharge.

## Roadmap

### v1 (actuelle)
- [x] Réécriture d'URL + proxy avec label visible dans la colonne Name de Network
- [x] Templates dynamiques (`{{index}}`, `{{path}}`)
- [x] Activation basée sur l'environnement
- [x] Header bonus `X-Request-Label`

### v2 (planifiée)
- [ ] Mode obfuscation : masquer les vrais endpoints en production
  - Mapping côté serveur uniquement, le client ne voit jamais la vraie URL
  - Le navigateur affiche un hash opaque au lieu du vrai endpoint
  - Config :
```ts
requestLabelize: {
  mode: 'obfuscate',
  routes: {
    'a1b2': '/api/users',
    'c3d4': '/api/power',
  }
}
```

## Développement

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # Build du module
npm run test      # Tests
```

## Licence

[MIT](LICENSE)
