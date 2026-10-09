---
layout: home

hero:
  name: Acme Docs
  text: Documentation, beautifully done.
  tagline: A fast, searchable, bilingual docs template built on VitePress and ready for Cloudflare Pages.
  actions:
    - theme: brand
      text: What is Acme?
      link: /guide/what-is
    - theme: alt
      text: Quick Start
      link: /guide/quick-start
    - theme: alt
      text: GitHub
      link: https://github.com/your-org/your-repo

features:
  - title: Fast by default
    details: Static pages with instant client-side navigation. Every page is pre-rendered for SEO.
  - title: Built-in search
    details: Full-text local search in every language, no third-party service or API key needed.
  - title: Light and dark
    details: A polished theme with a one-file brand color system and automatic dark mode.
  - title: Multilingual
    details: English and 简体中文 ship ready to go. Add another language with one folder and a few lines of config.
  - title: Deploys to Cloudflare
    details: Push to GitHub and Cloudflare Pages builds it, or deploy from your terminal with one command.
  - title: Just Markdown
    details: Write in Markdown with callouts, code groups, tabs and Vue components when you need them.
---

<script setup>
const code = `---
title: Quick Start
---

# Quick Start

Install the CLI and run your first command.

::: tip
Search, dark mode and translations
come built in.
:::`
</script>

<HomeShowcase
  eyebrow="Write"
  title="Plain Markdown in. A polished site out."
  body="Drop Markdown files into docs/ and they become fast, searchable pages with navigation, an outline and light and dark themes. No build config to learn."
  file="docs/guide/quick-start.md"
  :code="code"
  cta-title="Ready to ship your docs?"
  cta-text="Get started"
  cta-link="/guide/quick-start"
/>
