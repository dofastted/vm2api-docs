---
layout: home

hero:
  name: Acme Docs
  text: 文档，本该如此优雅。
  tagline: 基于 VitePress 的快速、可搜索、多语言文档模板，可直接部署到 Cloudflare Pages。
  actions:
    - theme: brand
      text: 什么是 Acme？
      link: /zh/guide/what-is
    - theme: alt
      text: 快速开始
      link: /zh/guide/quick-start
    - theme: alt
      text: GitHub
      link: https://github.com/your-org/your-repo

features:
  - title: 默认极速
    details: 静态页面配合客户端即时导航，每个页面都预渲染，利于 SEO。
  - title: 内置搜索
    details: 支持多语言的本地全文搜索，无需第三方服务或 API Key。
  - title: 浅色与深色
    details: 精致的主题，一个文件即可调整品牌色，自动适配深色模式。
  - title: 多语言
    details: 内置英文与简体中文。新增语言只需一个目录和几行配置。
  - title: 部署到 Cloudflare
    details: 推送到 GitHub 即由 Cloudflare Pages 自动构建，或在终端一条命令部署。
  - title: 只需 Markdown
    details: 用 Markdown 写作，支持提示块、代码组，需要时还可使用 Vue 组件。
---

<script setup>
const code = `---
title: 快速开始
---

# 快速开始

安装 CLI 并运行第一条命令。

::: tip
内置搜索、深色模式与多语言。
:::`
</script>

<HomeShowcase
  eyebrow="写作"
  title="写下 Markdown，得到精致的文档站。"
  body="把 Markdown 文件放进 docs/，即可生成带导航、目录、搜索以及浅色与深色主题的高速页面，无需学习构建配置。"
  file="docs/zh/guide/quick-start.md"
  :code="code"
  cta-title="准备好发布你的文档了吗？"
  cta-text="开始使用"
  cta-link="/zh/guide/quick-start"
/>
