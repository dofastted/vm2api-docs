# 部署到 Cloudflare

本模板构建产物是纯静态文件，可直接运行在 [Cloudflare Pages](https://pages.cloudflare.com/) 上，无需适配器。

## 方式一：Git 集成（推荐）

1. 将项目推送到 GitHub 或 GitLab。
2. 在 Cloudflare 控制台打开 **Workers & Pages → 创建 → Pages → 连接到 Git**。
3. 选择仓库，并使用以下构建设置：

| 设置 | 值 |
| --- | --- |
| 框架预设 | None |
| 构建命令 | `npm run build` |
| 构建输出目录 | `docs/.vitepress/dist` |
| Node 版本 | 由 `.node-version` 指定（22） |

::: warning
不要直接使用 *VitePress* 预设的默认值（`npx vitepress build` 和 `.vitepress/dist`）。本模板的文档位于 `docs/` 目录，使用这些默认值会导致构建失败或站点显示 404。
:::

4. 点击 **保存并部署**。之后每次推送到主分支都会自动重新部署，每个 PR 都会获得预览地址。

## 方式二：在终端部署

```sh
npx wrangler login      # 仅需一次
npm run deploy          # 构建并通过 wrangler 上传
```

项目名称来自 `wrangler.toml`，首次部署会自动创建 Pages 项目。

## 自定义域名

在 Pages 项目中打开 **自定义域 → 设置自定义域**，输入如 `docs.example.com`。如果域名已托管在 Cloudflare，DNS 会自动配置。

然后修改 `docs/.vitepress/config.mts` 中的 `project.url`，确保站点地图使用正确的地址。

## 缓存与响应头

`docs/public/_headers` 会被复制到构建产物中，让 Cloudflare 对带哈希的静态资源缓存一年，并发送若干安全响应头。可按需修改。
