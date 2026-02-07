[English](../README.md) | [Francais](./README.fr.md) | [Italiano](./README.it.md) | [Espanol](./README.es.md) | [Portugues](./README.pt.md) | [中文](./README.zh.md) | [Deutsch](./README.de.md)

# nuxt-request-labelize

为您的网络请求添加自定义标签的 Nuxt 模块，标签直接显示在 DevTools 网络选项卡的 **Name 列**中。

## 问题

您有一个页面向 `/api/power` 发起了 10 多个请求。在 DevTools 的网络选项卡中，您看到：

```
Name            Status
power           200
power           200
power           200
power           200
...
```

祝您好运找到您需要的那个请求。

## 解决方案

使用 `nuxt-request-labelize`，相同的请求会显示为：

```
Name            Status
power-1         200
power-2         200
power-3         200
power-4         200
...
```

每个请求在网络选项卡中都获得一个唯一且有意义的名称。

## 工作原理

该模块通过本地代理重写带标签的请求 URL：

```
客户端（浏览器）                 Nuxt (Nitro)              后端
  |                                |                         |
  |  /api/__label/power-1          |                         |
  |  ?_target=/api/power           |                         |
  | -----------------------------> |                         |
  |                                |  /api/power             |
  |                                | ----------------------> |
  |                                |                         |
  |  响应                          |  响应                   |
  | <----------------------------- | <---------------------- |
```

浏览器在网络选项卡中看到 `/api/__label/power-1`（Name 列显示 `power-1`）。后端接收到的是未更改的原始 URL `/api/power`。

## 安装

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

## 使用

### 简单标签

```ts
await $fetch('/api/power', {
  requestLabel: 'power-global'
})
// Network Name: power-global
```

### 带索引模板的循环

```ts
for (let i = 1; i <= 10; i++) {
  await $fetch('/api/power', {
    requestLabel: 'power-{{index}}',
    index: i
  })
}
// Network Name: power-1, power-2, ... power-10
```

### 与 useFetch 配合使用

```ts
const { data } = await useFetch('/api/notes', {
  requestLabel: 'notes-list'
})
```

### 可用模板

| 模板 | 值 |
|------|-----|
| `{{index}}` | `index` 选项的值，或自动递增 |
| `{{path}}` | 请求的 URL 路径 |

## 配置

```ts
requestLabelize: {
  enabledEnvs: ['development', 'staging'],  // 允许的 NODE_ENV 值（默认：['development']）
  headerName: 'X-Request-Label'              // 附加头名称（默认：'X-Request-Label'）
}
```

当前 `NODE_ENV` 不在 `enabledEnvs` 中时，模块完全禁用：没有插件，没有服务器路由，零开销。

## 路线图

### v1（当前版本）
- [x] URL 重写 + 代理，标签在网络选项卡的 Name 列中可见
- [x] 动态模板（`{{index}}`、`{{path}}`）
- [x] 基于环境的激活
- [x] 附加 `X-Request-Label` 头

### v2（计划中）
- [ ] 混淆模式：在生产环境中隐藏真实端点
  - 仅服务器端映射，客户端永远看不到真实 URL
  - 浏览器显示不透明的哈希值而不是实际端点
  - 配置：
```ts
requestLabelize: {
  mode: 'obfuscate',
  routes: {
    'a1b2': '/api/users',
    'c3d4': '/api/power',
  }
}
```

## 开发

```bash
git clone <repo>
cd nuxt-request-labelize
npm install
npm run dev       # Playground
npm run build     # 构建模块
npm run test      # 测试
```

## 许可证

[MIT](LICENSE)
