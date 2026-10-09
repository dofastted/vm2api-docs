# Configuration

Almost everything you need to change lives in two files.

## Site settings

Open `docs/.vitepress/config.mts`. The `project` object at the top controls the name, URL, GitHub links, license and copyright:

```ts
const project = {
  name: 'Acme Docs',
  description: 'Beautiful, fast documentation for your project.',
  url: 'https://docs.example.com',
  github: 'https://github.com/your-org/your-repo',
  editBase: 'https://github.com/your-org/your-repo/edit/main/docs/',
  license: 'MIT',
  copyright: `© ${new Date().getFullYear()}-present Your Org`
}
```

Below it, `navEn()` / `sidebarEn()` and `navZh()` / `sidebarZh()` define the top navigation and sidebars for each language.

## Style preset

The template ships with two looks. Pick one in `docs/.vitepress/theme/index.ts`:

```ts
import './presets/editorial.css' // warm ivory, serif headlines, clay accent
// import './presets/apple.css'  // crisp white, system font, blue accent
```

To fine-tune colors, fonts, corner radii or shadows, edit the `--t-*` tokens in the preset file. Both light and dark values live there.

## Logo

Replace `docs/public/logo.svg` (light mode) and `docs/public/logo-dark.svg` (dark mode). The light one is also the favicon.

## Home page

Edit the front matter in `docs/index.md` (and `docs/zh/index.md`) to change the hero text, buttons and feature cards. The `<HomeShowcase>` block at the bottom controls the code preview and the closing call to action.

## Adding a language

1. Copy `docs/zh/` to a new folder, for example `docs/ja/`, and translate the pages.
2. Add a `ja` entry under `locales` in `config.mts`, modeled on the `zh` entry.
3. Add search translations under `themeConfig.search.options.locales` if you want them.

## Removing a language

Delete the folder (for example `docs/zh/`) and its entry under `locales`.
