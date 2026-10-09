# FAQ

## Does it need a server?

No. The build produces static HTML, CSS and JS that any static host can serve.

## Can I use it on hosts other than Cloudflare?

Yes. Netlify, Vercel, GitHub Pages and any S3-style bucket work. Point them at `npm run build` and `docs/.vitepress/dist`.

## How do I add a page?

Create a Markdown file under `docs/`, then add a link to it in the sidebar in `config.mts`.

## How do I use Algolia search instead of local search?

Replace `search.provider: 'local'` with `'algolia'` and add your app ID, API key and index name. See the [VitePress search docs](https://vitepress.dev/reference/default-theme-search).
