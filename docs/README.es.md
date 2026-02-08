[English](../README.md) | [Francais](./README.fr.md) | [Italiano](./README.it.md) | [Espanol](./README.es.md) | [Portugues](./README.pt.md) | [中文](./README.zh.md) | [Deutsch](./README.de.md)

# nuxt-request-labelize

Módulo Nuxt que añade etiquetas personalizadas a tus peticiones de red, visibles directamente en la columna **Name** de la pestaña Network de DevTools.

## El problema

Tienes una página que realiza más de 10 llamadas a `/api/power`. En la pestaña Network de DevTools, ves:

```
Name            Status
power           200
power           200
power           200
power           200
...
```

Buena suerte encontrando la que necesitas.

## La solución

Con `nuxt-request-labelize`, las mismas llamadas muestran:

```
Name            Status
power-1         200
power-2         200
power-3         200
power-4         200
...
```

Cada petición obtiene un nombre único y significativo en la pestaña Network.

## Cómo funciona

El módulo reescribe las URLs de las peticiones etiquetadas a través de un proxy local:

```
Client (navegador)               Nuxt (Nitro)              Backend
  |                                |                         |
  |  /api/__label/power-1          |                         |
  |  ?_target=/api/power           |                         |
  | -----------------------------> |                         |
  |                                |  /api/power             |
  |                                | ----------------------> |
  |                                |                         |
  |  Respuesta                     |  Respuesta              |
  | <----------------------------- | <---------------------- |
```

El navegador ve `/api/__label/power-1` en la pestaña Network (la columna Name muestra `power-1`). El backend recibe la URL original `/api/power` sin cambios.

> **Nota SSR:** Cuando una petición se ejecuta durante el SSR (renderizado del lado del servidor), no aparece en la pestaña Network del navegador, ya que nunca pasa por el cliente. Las etiquetas de las peticiones solo son visibles para las peticiones del lado del cliente (después de la hidratación, navegación, refresco, etc).

## Instalación

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

## Uso

### Etiqueta simple

```ts
await $fetch('/api/power', {
  requestLabel: 'power-global'
})
// Network Name: power-global
```

### Bucle con plantilla de índice

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

### Plantillas disponibles

| Plantilla | Valor |
|-----------|-------|
| `{{index}}` | Valor de la opción `index`, o auto-incremento |
| `{{path}}` | Ruta de la URL de la petición |

## Configuración

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // Valores NODE_ENV permitidos (predeterminado: ['development'])
  headerName: 'X-Request-Label'              // Nombre del encabezado adicional (predeterminado: 'X-Request-Label')
}
```

Cuando el `NODE_ENV` actual no está en `enabledEnvs`, el módulo está completamente desactivado: sin plugin, sin ruta de servidor, cero sobrecarga.

## Roadmap

### v1 (actual)
- [x] Reescritura de URL + proxy con etiqueta visible en la columna Name de Network
- [x] Plantillas dinámicas (`{{index}}`, `{{path}}`)
- [x] Activación basada en el entorno
- [x] Encabezado adicional `X-Request-Label`

### v2 (planificada)
- [ ] Modo ofuscación: ocultar los endpoints reales en producción
  - Mapeo solo del lado del servidor, el cliente nunca ve la URL real
  - El navegador muestra un hash opaco en lugar del endpoint real
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

## Desarrollo

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # Compilar módulo
npm run test      # Tests
```

## Licencia

[MIT](LICENSE)
