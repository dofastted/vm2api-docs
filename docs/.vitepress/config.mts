import { defineConfig, type DefaultTheme } from 'vitepress'

// ---------------------------------------------------------------------------
// Project settings: edit these first. Everything else reads from here.
// ---------------------------------------------------------------------------
const project = {
  name: 'vm2api',
  description:
    'Fully isolated VM-level gateway that turns Claude and ChatGPT subscriptions into standard APIs.',
  url: 'https://my-project-docs.pages.dev',
  github: 'https://github.com/dofastted/vm2api',
  editBase: 'https://github.com/dofastted/vm2api-docs/edit/main/docs/',
  license: 'Non-commercial',
  copyright: `© ${new Date().getFullYear()} vm2api`
}

function navEn(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    { text: 'Quick Start', link: '/guide/quick-start', activeMatch: '/guide/quick-start' },
    { text: 'Guide', link: '/guide/what-is', activeMatch: '/guide/' },
    { text: 'Reference', link: '/reference/configuration', activeMatch: '/reference/' }
  ]
}

function sidebarEn(): DefaultTheme.Sidebar {
  return {
    '/guide/': [
      {
        text: 'Start',
        items: [
          { text: 'What is vm2api?', link: '/guide/what-is' },
          { text: 'Quick Start', link: '/guide/quick-start' }
        ]
      },
      {
        text: 'Deploy',
        items: [
          { text: 'Install', link: '/guide/install' },
          { text: 'Console', link: '/guide/console' }
        ]
      },
      {
        text: 'Use',
        items: [
          { text: 'Call the API', link: '/guide/api' },
          { text: 'Slots and accounts', link: '/guide/slots' }
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
    { text: '快速开始', link: '/zh/guide/quick-start', activeMatch: '/zh/guide/quick-start' },
    { text: '指南', link: '/zh/guide/what-is', activeMatch: '/zh/guide/' },
    { text: '参考', link: '/zh/reference/configuration', activeMatch: '/zh/reference/' }
  ]
}

function sidebarZh(): DefaultTheme.Sidebar {
  return {
    '/zh/guide/': [
      {
        text: '开始',
        items: [
          { text: '什么是 vm2api', link: '/zh/guide/what-is' },
          { text: '快速开始', link: '/zh/guide/quick-start' }
        ]
      },
      {
        text: '部署',
        items: [
          { text: '安装', link: '/zh/guide/install' },
          { text: '管理台', link: '/zh/guide/console' }
        ]
      },
      {
        text: '接入',
        items: [
          { text: '调用 API', link: '/zh/guide/api' },
          { text: '槽位与账号', link: '/zh/guide/slots' }
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

export default defineConfig({
  title: project.name,
  description: project.description,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: project.url },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#faf9f5' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: project.name }]
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
      description: '全隔离虚拟机级网关，把 Claude 与 ChatGPT 订阅转成标准 API。',
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
      message: `Software use is ${project.license}. See the product license in the vm2api repository.`,
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
