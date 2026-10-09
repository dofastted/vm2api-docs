# Deploy to Cloudflare

This template builds to plain static files, so it runs on [Cloudflare Pages](https://pages.cloudflare.com/) with no adapter.

## Option A: Git integration (recommended)

1. Push this project to GitHub or GitLab.
2. In the Cloudflare dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick your repository and use these build settings:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `docs/.vitepress/dist` |
| Node version | set by `.node-version` (22) |

::: warning
Don't keep the *VitePress* preset's defaults (`npx vitepress build` and `.vitepress/dist`). This template keeps its docs in a `docs/` folder, so those values make the build fail or the site show a 404.
:::

4. Click **Save and Deploy**. Every push to your main branch now redeploys the site, and every pull request gets a preview URL.

## Option B: Deploy from your terminal

```sh
npx wrangler login      # one time
npm run deploy          # builds, then uploads with wrangler
```

The project name comes from `wrangler.toml`. The first deploy creates the Pages project for you.

## Custom domain

In your Pages project, open **Custom domains → Set up a custom domain** and enter something like `docs.example.com`. If the domain is already on Cloudflare, DNS is configured automatically.

Then update `project.url` in `docs/.vitepress/config.mts` so the sitemap uses the right address.

## Caching and headers

`docs/public/_headers` is copied into the build and tells Cloudflare to cache hashed assets for a year and to send a few security headers. Edit it to add your own.
