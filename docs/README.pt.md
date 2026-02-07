[English](../README.md) | [Francais](./README.fr.md) | [Italiano](./README.it.md) | [Espanol](./README.es.md) | [Portugues](./README.pt.md) | [中文](./README.zh.md) | [Deutsch](./README.de.md)

# nuxt-request-labelize

Módulo Nuxt que adiciona etiquetas personalizadas às suas requisições de rede, visíveis diretamente na coluna **Name** da aba Network do DevTools.

## O problema

Você tem uma página que dispara mais de 10 chamadas para `/api/power`. Na aba Network do DevTools, você vê:

```
Name            Status
power           200
power           200
power           200
power           200
...
```

Boa sorte encontrando aquela que você precisa.

## A solução

Com `nuxt-request-labelize`, as mesmas chamadas mostram:

```
Name            Status
power-1         200
power-2         200
power-3         200
power-4         200
...
```

Cada requisição obtém um nome único e significativo na aba Network.

## Como funciona

O módulo reescreve as URLs das requisições etiquetadas através de um proxy local:

```
Client (navegador)               Nuxt (Nitro)              Backend
  |                                |                         |
  |  /api/__label/power-1          |                         |
  |  ?_target=/api/power           |                         |
  | -----------------------------> |                         |
  |                                |  /api/power             |
  |                                | ----------------------> |
  |                                |                         |
  |  Resposta                      |  Resposta               |
  | <----------------------------- | <---------------------- |
```

O navegador vê `/api/__label/power-1` na aba Network (a coluna Name mostra `power-1`). O backend recebe a URL original `/api/power` inalterada.

## Instalação

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

### Etiqueta simples

```ts
await $fetch('/api/power', {
  requestLabel: 'power-global'
})
// Network Name: power-global
```

### Loop com template de índice

```ts
for (let i = 1; i <= 10; i++) {
  await $fetch('/api/power', {
    requestLabel: 'power-{{index}}',
    index: i
  })
}
// Network Name: power-1, power-2, ... power-10
```

### Com useFetch

```ts
const { data } = await useFetch('/api/notes', {
  requestLabel: 'notes-list'
})
```

### Templates disponíveis

| Template | Valor |
|----------|-------|
| `{{index}}` | Valor da opção `index`, ou auto-incremento |
| `{{path}}` | Caminho da URL da requisição |

## Configuração

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // Valores NODE_ENV permitidos (padrão: ['development'])
  headerName: 'X-Request-Label'              // Nome do cabeçalho bônus (padrão: 'X-Request-Label')
}
```

Quando o `NODE_ENV` atual não está em `enabledEnvs`, o módulo é completamente desativado: sem plugin, sem rota de servidor, zero overhead.

## Roadmap

### v1 (atual)
- [x] Reescrita de URL + proxy com etiqueta visível na coluna Name do Network
- [x] Templates dinâmicos (`{{index}}`, `{{path}}`)
- [x] Ativação baseada no ambiente
- [x] Cabeçalho bônus `X-Request-Label`

### v2 (planejada)
- [ ] Modo ofuscação: ocultar os endpoints reais em produção
  - Mapeamento apenas no lado do servidor, o cliente nunca vê a URL real
  - O navegador mostra um hash opaco em vez do endpoint real
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

## Desenvolvimento

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # Build do módulo
npm run test      # Testes
```

## Licença

[MIT](LICENSE)
