# 常见问题

## 需要服务器吗？

不需要。构建产物是静态的 HTML、CSS 和 JS，任何静态托管都能部署。

## 能部署到 Cloudflare 以外的平台吗？

可以。Netlify、Vercel、GitHub Pages 以及任意 S3 类存储都可以，构建命令为 `npm run build`，输出目录为 `docs/.vitepress/dist`。

## 如何新增页面？

在 `docs/` 下创建 Markdown 文件，然后在 `config.mts` 的侧边栏中添加链接。

## 如何改用 Algolia 搜索？

把 `search.provider: 'local'` 改为 `'algolia'`，并填写 app ID、API key 和索引名。详见 [VitePress 搜索文档](https://vitepress.dev/zh/reference/default-theme-search)。
