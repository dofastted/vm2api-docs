# Docs Site Template

A polished documentation site template built on [VitePress](https://vitepress.dev). It deploys for free on [Cloudflare Pages](https://pages.cloudflare.com/).

[简体中文说明](./README.zh-CN.md)

**What you get**

- A home page with a centered hero, feature cards, a code preview and a call-to-action band
- Docs pages with a sidebar, page outline, prev/next links, "Edit on GitHub" and last-updated dates
- Built-in full-text search (no account or API key)
- Two looks you switch with one line: **Editorial** (warm ivory, serif headlines) and **Apple** (crisp white, system font, blue accent)
- Light and dark mode
- English and 简体中文 out of the box
- Ready for Cloudflare: clean URLs, cache headers and a `wrangler.toml`

---

## Contents

1. [Before you start](#1-before-you-start)
2. [Get the template and run it locally](#2-get-the-template-and-run-it-locally)
3. [Make it yours](#3-make-it-yours)
4. [Put it on GitHub](#4-put-it-on-github)
5. [Deploy to Cloudflare Pages](#5-deploy-to-cloudflare-pages)
6. [Add your own domain](#6-add-your-own-domain)
7. [Update the site](#7-update-the-site)
8. [Troubleshooting](#8-troubleshooting)
9. [Project layout](#9-project-layout)

---

## 1. Before you start

You need:

| What | Why | Get it |
| --- | --- | --- |
| **Node.js 18 or newer** | Builds and previews the site | <https://nodejs.org> (pick the LTS version) |
| **Git** | Uploads your site to GitHub | <https://git-scm.com/downloads> |
| **A GitHub account** | Cloudflare builds the site from your repository | <https://github.com/signup> |
| **A Cloudflare account** | Hosts the site (the free plan is enough) | <https://dash.cloudflare.com/sign-up> |

Check that Node and Git are installed by opening a terminal and running:

```sh
node -v   # should print v18.x or higher
git --version
```

> Don't want to use GitHub? You can skip it and upload straight from your computer. See [Option B](#option-b-upload-from-your-computer-no-github).

---

## 2. Get the template and run it locally

Unzip the template (or clone it), then open a terminal in that folder:

```sh
cd docs-site-template
npm install       # downloads dependencies, takes a minute the first time
npm run dev       # starts a local preview
```

Open <http://localhost:5173> in your browser. The page reloads automatically whenever you save a file. Press `Ctrl + C` in the terminal to stop it.

To check the production build before deploying:

```sh
npm run build     # writes the finished site to docs/.vitepress/dist
npm run preview   # serves that build at http://localhost:4173
```

---

## 3. Make it yours

| What to change | Where |
| --- | --- |
| Site name, URL, GitHub links, footer | The `project` block at the top of `docs/.vitepress/config.mts` |
| Top menu and sidebar | `navEn()`, `sidebarEn()`, `navZh()`, `sidebarZh()` in the same file |
| Look (Editorial or Apple) | The preset import in `docs/.vitepress/theme/index.ts` |
| Colors, fonts, corner radius | `--t-*` values in `docs/.vitepress/theme/presets/editorial.css` or `apple.css` |
| Logo and browser icon | `docs/public/logo.svg` (light) and `docs/public/logo-dark.svg` (dark) |
| Home page text, buttons, cards | `docs/index.md` (English) and `docs/zh/index.md` (Chinese) |
| Docs pages | Markdown files in `docs/guide/` and `docs/reference/` (Chinese in `docs/zh/`) |

**Switch the look.** Open `docs/.vitepress/theme/index.ts` and change the one import line:

```ts
import './presets/editorial.css'   // warm ivory, serif headlines (default)
// import './presets/apple.css'    // crisp white, system font, blue accent
```

**Add a page.** Create a `.md` file, for example `docs/guide/install.md`, then add it to the sidebar in `config.mts`:

```ts
{ text: 'Install', link: '/guide/install' }
```

**English only?** Delete the `docs/zh/` folder and the `zh: { ... }` block under `locales` in `config.mts`.

---

## 4. Put it on GitHub

1. Go to <https://github.com/new>, enter a repository name (for example `my-docs`) and click **Create repository**. Leave every "Add ..." option unticked.
2. In your terminal, inside the template folder, run the following. Replace `YOUR-NAME` and `my-docs` with your own:

```sh
git init
git add .
git commit -m "First version of the docs"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/my-docs.git
git push -u origin main
```

Refresh the GitHub page and you should see your files.

---

## 5. Deploy to Cloudflare Pages

Pick **one** of the two options. Option A is recommended: the site rebuilds by itself every time you push a change.

### Option A: Connect GitHub (recommended)

1. Log in at <https://dash.cloudflare.com>.
2. In the left menu, open **Workers & Pages** (it may sit under **Compute** in newer dashboards).
3. Click **Create application**, open the **Pages** tab, then click **Import an existing Git repository** (some accounts show **Connect to Git**).
4. Click **Connect GitHub**, sign in, and allow Cloudflare to access your repository. You can grant access to just this one repository.
5. Select your repository and click **Begin setup**.
6. Fill in **Set up builds and deployments** exactly like this:

| Setting | Value |
| --- | --- |
| Project name | Anything you like. It becomes `<name>.pages.dev` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `docs/.vitepress/dist` |
| Root directory | leave empty |

> **Important:** don't keep the *VitePress* preset's defaults. It fills in `npx vitepress build` and `.vitepress/dist`, which are **wrong for this template** because the docs live in a `docs/` folder. If you pick that preset, overwrite both fields with the values above, or the build fails or the site shows a 404.

7. Optional: open **Environment variables** and add `NODE_VERSION` with the value `22`. The template already includes a `.node-version` file that Cloudflare reads, so this is only a fallback.
8. Click **Save and Deploy**. The first build takes a minute or two and you can watch the log.
9. When it says **Success**, click the `https://<name>.pages.dev` link. Your site is live.

From now on:

- Every push to `main` updates the live site automatically.
- Every other branch and every pull request gets its own preview link, so you can check changes before they go live.

### Option B: Upload from your computer (no GitHub)

Use this if you don't want to use GitHub, or prefer to deploy by hand.

1. Open `wrangler.toml` and change `name` to your project name:

```toml
name = "my-docs"
```

2. Log in to Cloudflare (this opens your browser once):

```sh
npx wrangler login
```

3. Build and upload:

```sh
npm run deploy
```

The first time, Wrangler offers to create the project and asks for the production branch. Confirm and enter `main`. When it finishes it prints your `https://my-docs.pages.dev` link.

Run `npm run deploy` again whenever you want to publish changes.

> Note: a project created this way can't be switched to GitHub auto-deploys later. If you change your mind, create a new project with Option A.

---

## 6. Add your own domain

1. In the Cloudflare dashboard, open **Workers & Pages** and click your project.
2. Open the **Custom domains** tab and click **Set up a custom domain**.
3. Enter the address you want, for example `docs.example.com`, and click **Continue**.
   - If the domain already uses Cloudflare DNS, the record is added for you. Click **Activate domain**.
   - If the domain is managed elsewhere, Cloudflare shows a `CNAME` record. Add it at your domain provider, pointing `docs` to `<name>.pages.dev`.
4. Wait until the status shows **Active**. HTTPS is set up automatically.
5. Open `docs/.vitepress/config.mts`, set `project.url` to your new address, then publish again (push, or `npm run deploy`) so the sitemap uses the right domain.

---

## 7. Update the site

Edit your Markdown files, check them with `npm run dev`, then publish.

**Option A (GitHub):**

```sh
git add .
git commit -m "Update docs"
git push
```

Cloudflare rebuilds and publishes within a minute or two.

**Option B (from your computer):**

```sh
npm run deploy
```

---

## 8. Troubleshooting

| Problem | Fix |
| --- | --- |
| Build log says the output directory was not found, or the live site shows 404 | In your project open **Settings → Build** and make sure **Build command** is `npm run build` and **Build output directory** is `docs/.vitepress/dist`. Then retry the deployment. |
| Build fails with `dead link(s) found` | A page links to a page that doesn't exist. The log names the file. Fix or remove the link. |
| Build fails with Node or syntax errors | Add the environment variable `NODE_VERSION` = `22` under **Settings → Variables and Secrets**, then retry. |
| `npm run deploy` says you're not logged in | Run `npx wrangler login` again. |
| Changes don't show up | Check the **Deployments** tab for a failed build. Then hard-refresh the browser (`Ctrl + Shift + R`, or `Cmd + Shift + R` on Mac). |
| Custom domain stuck on "Pending" | DNS changes can take a while. Check the `CNAME` record at your domain provider matches what Cloudflare showed. |

To retry a failed deployment, open **Deployments**, click the `...` menu on the failed one and choose **Retry deployment**.

---

## 9. Project layout

```
docs/
├─ .vitepress/
│  ├─ config.mts         # site name, menus, sidebars, languages, search
│  └─ theme/
│     ├─ index.ts        # picks the look (Editorial or Apple)
│     ├─ base.css        # shared layout styles
│     ├─ presets/        # editorial.css, apple.css
│     └─ components/     # HomeShowcase.vue (home page code preview)
├─ public/               # logo, favicon, _headers (copied as-is)
├─ index.md              # English home page
├─ guide/ reference/     # English docs
└─ zh/                   # Chinese home page and docs
wrangler.toml            # Cloudflare settings for `npm run deploy`
.node-version            # Node version Cloudflare uses to build
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview with live reload at <http://localhost:5173> |
| `npm run build` | Builds the finished site into `docs/.vitepress/dist` |
| `npm run preview` | Serves the finished build at <http://localhost:4173> |
| `npm run deploy` | Builds and uploads to Cloudflare Pages (Option B) |

## License

MIT
