import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeShowcase from './components/HomeShowcase.vue'

// Pick a style preset. Swap this one line to change the whole look:
//   './presets/editorial.css'  warm ivory, serif headlines, clay accent
//   './presets/apple.css'      crisp white, system font, blue accent
import './presets/editorial.css'
import './base.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeShowcase', HomeShowcase)
  }
} satisfies Theme
