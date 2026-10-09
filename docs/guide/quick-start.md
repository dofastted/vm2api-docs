# Quick Start

Get the docs site running locally in under a minute.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm, pnpm, yarn or bun

## Install

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

## Run the dev server

```sh
npm run dev
```

Open `http://localhost:5173`. Pages reload instantly as you edit Markdown files under `docs/`.

## Build for production

```sh
npm run build
npm run preview
```

The static site is written to `docs/.vitepress/dist`.

## What's next

- Make it yours by editing the [configuration](../reference/configuration).
- Learn the [Markdown features](./markdown) available on every page.
- [Deploy to Cloudflare](./deploy-cloudflare) when you're ready.
