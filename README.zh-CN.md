# 文档站模板

基于 [VitePress](https://vitepress.dev) 的精美项目文档站模板，可免费部署到 [Cloudflare Pages](https://pages.cloudflare.com/)。

[English](./README.md)

**包含内容**

- 首页：居中主视觉、特性卡片、代码预览和行动号召区块
- 文档页：侧边栏、页内目录、上一页/下一页、“在 GitHub 上编辑”、最后更新时间
- 内置全文搜索（无需账号或 API Key）
- 两种风格，一行切换：**Editorial**（暖白纸感、衬线标题）和 **Apple**（纯净白底、系统字体、蓝色点缀）
- 浅色与深色模式
- 内置英文与简体中文
- 为 Cloudflare 准备好：简洁 URL、缓存响应头和 `wrangler.toml`

---

## 目录

1. [准备工作](#1-准备工作)
2. [获取模板并在本地运行](#2-获取模板并在本地运行)
3. [定制成你自己的站点](#3-定制成你自己的站点)
4. [上传到 GitHub](#4-上传到-github)
5. [部署到 Cloudflare Pages](#5-部署到-cloudflare-pages)
6. [绑定自己的域名](#6-绑定自己的域名)
7. [更新站点](#7-更新站点)
8. [常见问题排查](#8-常见问题排查)
9. [项目结构](#9-项目结构)

---

## 1. 准备工作

你需要：

| 项目 | 用途 | 获取地址 |
| --- | --- | --- |
| **Node.js 18 或更高版本** | 构建和预览站点 | <https://nodejs.org>（选择 LTS 版本） |
| **Git** | 把站点上传到 GitHub | <https://git-scm.com/downloads> |
| **GitHub 账号** | Cloudflare 从你的仓库构建站点 | <https://github.com/signup> |
| **Cloudflare 账号** | 托管站点（免费套餐即可） | <https://dash.cloudflare.com/sign-up> |

打开终端，运行以下命令确认 Node 和 Git 已安装：

```sh
node -v   # 应显示 v18.x 或更高
git --version
```

> 不想用 GitHub？可以跳过，直接从电脑上传。见 [方式二](#方式二从电脑直接上传不用-github)。

---

## 2. 获取模板并在本地运行

解压模板（或克隆仓库），在该目录打开终端：

```sh
cd docs-site-template
npm install       # 安装依赖，第一次需要一分钟左右
npm run dev       # 启动本地预览
```

在浏览器打开 <http://localhost:5173>。保存文件后页面会自动刷新。在终端按 `Ctrl + C` 停止预览。

部署前可以先检查生产构建：

```sh
npm run build     # 生成站点到 docs/.vitepress/dist
npm run preview   # 在 http://localhost:4173 预览构建结果
```

---

## 3. 定制成你自己的站点

| 要修改的内容 | 位置 |
| --- | --- |
| 站点名称、网址、GitHub 链接、页脚 | `docs/.vitepress/config.mts` 顶部的 `project` 配置 |
| 顶部菜单和侧边栏 | 同一文件中的 `navEn()`、`sidebarEn()`、`navZh()`、`sidebarZh()` |
| 风格（Editorial 或 Apple） | `docs/.vitepress/theme/index.ts` 中的预设导入 |
| 颜色、字体、圆角 | `docs/.vitepress/theme/presets/editorial.css` 或 `apple.css` 中的 `--t-*` 变量 |
| Logo 和浏览器图标 | `docs/public/logo.svg`（浅色）和 `docs/public/logo-dark.svg`（深色） |
| 首页文字、按钮、卡片 | `docs/index.md`（英文）和 `docs/zh/index.md`（中文） |
| 文档页面 | `docs/guide/` 和 `docs/reference/` 中的 Markdown 文件（中文在 `docs/zh/`） |

**切换风格。** 打开 `docs/.vitepress/theme/index.ts`，修改这一行导入：

```ts
import './presets/editorial.css'   // 暖白纸感、衬线标题（默认）
// import './presets/apple.css'    // 纯净白底、系统字体、蓝色点缀
```

**新增页面。** 新建 `.md` 文件，例如 `docs/zh/guide/install.md`，然后在 `config.mts` 的侧边栏中加入：

```ts
{ text: '安装', link: '/zh/guide/install' }
```

**只要中文？** 可以把中文设为默认语言：把 `docs/zh/` 中的内容移到 `docs/`，删除英文页面，并把 `config.mts` 中 `root` 的 `lang` 改为 `zh-CN`、菜单换成中文版本。

---

## 4. 上传到 GitHub

1. 打开 <https://github.com/new>，填写仓库名（例如 `my-docs`），点击 **Create repository**。不要勾选任何 “Add ...” 选项。
2. 在模板目录的终端中运行以下命令，把 `YOUR-NAME` 和 `my-docs` 换成你自己的：

```sh
git init
git add .
git commit -m "First version of the docs"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/my-docs.git
git push -u origin main
```

刷新 GitHub 页面，应该就能看到你的文件。

---

## 5. 部署到 Cloudflare Pages

以下两种方式**任选其一**。推荐方式一：之后每次推送代码，站点都会自动重新构建。

### 方式一：连接 GitHub（推荐）

1. 登录 <https://dash.cloudflare.com>。
2. 在左侧菜单打开 **Workers & Pages**（新版控制台中可能在 **Compute** 下）。
3. 点击 **Create application**，切换到 **Pages** 标签页，点击 **Import an existing Git repository**（部分账号显示为 **Connect to Git**）。
4. 点击 **Connect GitHub**，登录并授权 Cloudflare 访问你的仓库。可以只授权这一个仓库。
5. 选择你的仓库，点击 **Begin setup**。
6. 在 **Set up builds and deployments** 中严格按下表填写：

| 设置项 | 值 |
| --- | --- |
| Project name（项目名） | 随意，会成为 `<名称>.pages.dev` |
| Production branch（生产分支） | `main` |
| Framework preset（框架预设） | `None` |
| Build command（构建命令） | `npm run build` |
| Build output directory（输出目录） | `docs/.vitepress/dist` |
| Root directory（根目录） | 留空 |

> **重要：** 不要直接使用 *VitePress* 预设的默认值。它会填入 `npx vitepress build` 和 `.vitepress/dist`，而本模板的文档在 `docs/` 目录下，所以这两个默认值**是错的**。如果选了该预设，请把这两项改成上表中的值，否则会构建失败或站点显示 404。

7. 可选：展开 **Environment variables（环境变量）**，添加 `NODE_VERSION`，值为 `22`。模板已包含 Cloudflare 会读取的 `.node-version` 文件，这一步只是保险。
8. 点击 **Save and Deploy**。首次构建需要一两分钟，可以查看构建日志。
9. 显示 **Success** 后，点击 `https://<名称>.pages.dev` 链接，站点就上线了。

之后：

- 每次推送到 `main`，线上站点会自动更新。
- 其他分支和每个 Pull Request 都会获得独立的预览链接，可以先检查再上线。

### 方式二：从电脑直接上传（不用 GitHub）

适合不想用 GitHub、或希望手动部署的情况。

1. 打开 `wrangler.toml`，把 `name` 改成你的项目名：

```toml
name = "my-docs"
```

2. 登录 Cloudflare（会打开一次浏览器）：

```sh
npx wrangler login
```

3. 构建并上传：

```sh
npm run deploy
```

第一次运行时，Wrangler 会提示创建项目并询问生产分支，确认并输入 `main`。完成后会打印出你的 `https://my-docs.pages.dev` 链接。

以后需要发布更新时，再运行一次 `npm run deploy` 即可。

> 注意：用这种方式创建的项目，之后无法切换为 GitHub 自动部署。如果改变主意，请用方式一新建一个项目。

---

## 6. 绑定自己的域名

1. 在 Cloudflare 控制台打开 **Workers & Pages**，点击你的项目。
2. 打开 **Custom domains（自定义域）** 标签页，点击 **Set up a custom domain**。
3. 输入想要的地址，例如 `docs.example.com`，点击 **Continue**。
   - 如果域名已经使用 Cloudflare DNS，会自动添加记录，点击 **Activate domain** 即可。
   - 如果域名在其他服务商，Cloudflare 会显示一条 `CNAME` 记录。到你的域名服务商处添加该记录，把 `docs` 指向 `<名称>.pages.dev`。
4. 等待状态变为 **Active**。HTTPS 会自动配置。
5. 打开 `docs/.vitepress/config.mts`，把 `project.url` 改成新地址，然后重新发布（推送代码或运行 `npm run deploy`），让站点地图使用正确的域名。

> 提示：`*.pages.dev` 域名在中国大陆的访问可能不稳定。面向国内用户时，建议绑定自己的域名。

---

## 7. 更新站点

修改 Markdown 文件，用 `npm run dev` 检查后发布。

**方式一（GitHub）：**

```sh
git add .
git commit -m "Update docs"
git push
```

Cloudflare 会在一两分钟内自动构建并发布。

**方式二（从电脑上传）：**

```sh
npm run deploy
```

---

## 8. 常见问题排查

| 问题 | 解决方法 |
| --- | --- |
| 构建日志提示找不到输出目录，或线上站点显示 404 | 在项目的 **Settings → Build** 中确认 **Build command** 为 `npm run build`、**Build output directory** 为 `docs/.vitepress/dist`，然后重试部署。 |
| 构建失败并提示 `dead link(s) found` | 有页面链接到了不存在的页面，日志会给出文件名。修正或删除该链接。 |
| 构建失败并出现 Node 或语法错误 | 在 **Settings → Variables and Secrets** 中添加环境变量 `NODE_VERSION` = `22`，然后重试。 |
| `npm run deploy` 提示未登录 | 重新运行 `npx wrangler login`。 |
| 修改没有生效 | 在 **Deployments** 标签页检查是否有失败的构建，然后强制刷新浏览器（`Ctrl + Shift + R`，Mac 上为 `Cmd + Shift + R`）。 |
| 自定义域名一直显示 “Pending” | DNS 生效需要一些时间。检查域名服务商处的 `CNAME` 记录是否与 Cloudflare 显示的一致。 |
| `npm install` 很慢或失败 | 可以使用国内镜像：`npm config set registry https://registry.npmmirror.com`。 |

如需重试失败的部署，打开 **Deployments**，点击失败记录右侧的 `...` 菜单，选择 **Retry deployment**。

---

## 9. 项目结构

```
docs/
├─ .vitepress/
│  ├─ config.mts         # 站点名称、菜单、侧边栏、语言、搜索
│  └─ theme/
│     ├─ index.ts        # 选择风格（Editorial 或 Apple）
│     ├─ base.css        # 公共布局样式
│     ├─ presets/        # editorial.css、apple.css
│     └─ components/     # HomeShowcase.vue（首页代码预览）
├─ public/               # logo、网站图标、_headers（原样复制）
├─ index.md              # 英文首页
├─ guide/ reference/     # 英文文档
└─ zh/                   # 中文首页和文档
wrangler.toml            # `npm run deploy` 使用的 Cloudflare 配置
.node-version            # Cloudflare 构建时使用的 Node 版本
```

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地预览，实时刷新，地址 <http://localhost:5173> |
| `npm run build` | 构建站点到 `docs/.vitepress/dist` |
| `npm run preview` | 在 <http://localhost:4173> 预览构建结果 |
| `npm run deploy` | 构建并上传到 Cloudflare Pages（方式二） |

## 许可证

MIT
