import { defineConfig, type DefaultTheme } from 'vitepress'

// ---------------------------------------------------------------------------
// Project settings: edit these first. Everything else reads from here.
// ---------------------------------------------------------------------------
const project = {
  name: 'Acme Docs',
  description: 'Beautiful, fast documentation for your project.',
  // Public URL of the deployed site (used for the sitemap and social cards).
  url: 'https://docs.example.com',
  github: 'https://github.com/your-org/your-repo',
  // Branch + folder used by "Edit this page on GitHub".
  editBase: 'https://github.com/your-org/your-repo/edit/main/docs/',
  license: 'MIT',
  copyright: `© ${new Date().getFullYear()}-present Your Org`
}

// ---------------------------------------------------------------------------
// Navigation and sidebars, one per language.
// ---------------------------------------------------------------------------
function navEn(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    { text: 'Guide', link: '/guide/what-is', activeMatch: '/guide/' },
    { text: 'Reference', link: '/reference/configuration', activeMatch: '/reference/' }
  ]
}

function sidebarEn(): DefaultTheme.Sidebar {
  return {
    '/guide/': [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Acme?', link: '/guide/what-is' },
          { text: 'Quick Start', link: '/guide/quick-start' }
        ]
      },
      {
        text: 'Writing Docs',
        items: [
          { text: 'Markdown Features', link: '/guide/markdown' },
          { text: 'Deploy to Cloudflare', link: '/guide/deploy-cloudflare' }
        ]
      }
    ],
    '/reference/': [
      {
        text: 'Reference',
        items: [
          { text: 'Configuration', link: '/reference/configuration' },
          { text: 'FAQ', link: '/reference/faq' }
        ]
      }
    ]
  }
}

function navZh(): DefaultTheme.NavItem[] {
  return [
    { text: '首页', link: '/zh/' },
    { text: '指南', link: '/zh/guide/what-is', activeMatch: '/zh/guide/' },
    { text: '参考', link: '/zh/reference/configuration', activeMatch: '/zh/reference/' }
  ]
}

function sidebarZh(): DefaultTheme.Sidebar {
  return {
    '/zh/guide/': [
      {
        text: '简介',
        items: [
          { text: '什么是 Acme？', link: '/zh/guide/what-is' },
          { text: '快速开始', link: '/zh/guide/quick-start' }
        ]
      },
      {
        text: '编写文档',
        items: [
          { text: 'Markdown 扩展', link: '/zh/guide/markdown' },
          { text: '部署到 Cloudflare', link: '/zh/guide/deploy-cloudflare' }
        ]
      }
    ],
    '/zh/reference/': [
      {
        text: '参考',
        items: [
          { text: '配置', link: '/zh/reference/configuration' },
          { text: '常见问题', link: '/zh/reference/faq' }
        ]
      }
    ]
  }
}

// ---------------------------------------------------------------------------
// Site config
// ---------------------------------------------------------------------------
export default defineConfig({
  title: project.name,
  description: project.description,
  cleanUrls: true, // Cloudflare Pages serves /page for /page.html natively
  lastUpdated: true,
  sitemap: { hostname: project.url },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#faf9f5' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: project.name }],
  ],

  markdown: {
    lineNumbers: false,
    image: { lazyLoading: true }
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: navEn(),
        sidebar: sidebarEn(),
        editLink: { pattern: `${project.editBase}:path`, text: 'Edit this page on GitHub' }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      description: '为你的项目打造美观、快速的文档站。',
      themeConfig: {
        nav: navZh(),
        sidebar: sidebarZh(),
        editLink: { pattern: `${project.editBase}:path`, text: '在 GitHub 上编辑此页' },
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新' },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        langMenuLabel: '切换语言'
      }
    }
  },

  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg' },
    socialLinks: [{ icon: 'github', link: project.github }],
    footer: {
      message: `Released under the ${project.license} License.`,
      copyright: project.copyright
    },
    outline: { level: [2, 3] },
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    }
  }
})
