# 快速开始

一分钟内在本地运行文档站。

## 环境要求

- [Node.js](https://nodejs.org/) 18 或更高版本
- npm、pnpm、yarn 或 bun

## 安装依赖

::: code-group

```sh [npm]
npm install
```

```sh [pnpm]
pnpm install
```

```sh [yarn]
yarn install
```

```sh [bun]
bun install
```

:::

## 启动开发服务器

```sh
npm run dev
```

打开 `http://localhost:5173`。编辑 `docs/` 下的 Markdown 文件，页面会即时刷新。

## 构建生产版本

```sh
npm run build
npm run preview
```

静态站点输出到 `docs/.vitepress/dist`。

## 接下来

- 修改 [配置](../reference/configuration)，打造你自己的站点。
- 了解每个页面都可用的 [Markdown 扩展](./markdown)。
- 准备好后 [部署到 Cloudflare](./deploy-cloudflare)。
