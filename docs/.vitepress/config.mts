import { defineConfig, type DefaultTheme } from 'vitepress'

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
    { text: 'Install', link: '/guide/install', activeMatch: '/guide/install' },
    { text: 'Update', link: '/guide/upgrade', activeMatch: '/guide/upgrade' },
    { text: 'Guide', link: '/guide/what-is', activeMatch: '/guide/' },
    { text: 'Reference', link: '/reference/configuration', activeMatch: '/reference/' }
  ]
}

function sidebarEn(): DefaultTheme.Sidebar {
  return {
    '/guide/': [
      {
        text: 'Start here',
        items: [
          { text: 'Install', link: '/guide/install' },
          { text: 'Update', link: '/guide/upgrade' },
          { text: 'What is vm2api?', link: '/guide/what-is' },
          { text: 'Quick Start', link: '/guide/quick-start' }
        ]
      },
      {
        text: 'Console',
        items: [
          { text: 'Page map', link: '/guide/console' },
          { text: 'Overview', link: '/guide/console/overview' },
          { text: 'Statistics', link: '/guide/console/statistics' },
          { text: 'Logs', link: '/guide/console/logs' },
          { text: 'Usage', link: '/guide/console/usage' },
          { text: 'Billing', link: '/guide/console/billing' },
          { text: 'Cluster', link: '/guide/console/cluster' },
          { text: 'Virtual machines', link: '/guide/console/vm' },
          { text: 'Import', link: '/guide/console/import' },
          { text: 'Proxy pool', link: '/guide/console/proxies' },
          { text: 'Models', link: '/guide/console/models' },
          { text: 'Risk audit', link: '/guide/console/risk' },
          { text: 'System prompts', link: '/guide/console/system' },
          { text: 'Keys', link: '/guide/console/keys' },
          { text: 'API endpoints', link: '/guide/console/endpoints' },
          { text: 'Database', link: '/guide/console/database' },
          { text: 'Users', link: '/guide/console/users' },
          { text: 'Kernel', link: '/guide/console/kernel' }
        ]
      },
      {
        text: 'Settings',
        items: [{ text: 'All settings tabs', link: '/guide/settings' }]
      },
      {
        text: 'Call',
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
    { text: '安装', link: '/zh/guide/install', activeMatch: '/zh/guide/install' },
    { text: '更新', link: '/zh/guide/upgrade', activeMatch: '/zh/guide/upgrade' },
    { text: '指南', link: '/zh/guide/what-is', activeMatch: '/zh/guide/' },
    { text: '参考', link: '/zh/reference/configuration', activeMatch: '/zh/reference/' }
  ]
}

function sidebarZh(): DefaultTheme.Sidebar {
  return {
    '/zh/guide/': [
      {
        text: '置顶',
        items: [
          { text: '安装', link: '/zh/guide/install' },
          { text: '更新', link: '/zh/guide/upgrade' },
          { text: '什么是 vm2api', link: '/zh/guide/what-is' },
          { text: '快速开始', link: '/zh/guide/quick-start' }
        ]
      },
      {
        text: '管理台',
        items: [
          { text: '页面一览', link: '/zh/guide/console' },
          { text: '总览', link: '/zh/guide/console/overview' },
          { text: '统计', link: '/zh/guide/console/statistics' },
          { text: '日志', link: '/zh/guide/console/logs' },
          { text: '用量', link: '/zh/guide/console/usage' },
          { text: '计费', link: '/zh/guide/console/billing' },
          { text: '集群', link: '/zh/guide/console/cluster' },
          { text: '虚拟机', link: '/zh/guide/console/vm' },
          { text: '导入', link: '/zh/guide/console/import' },
          { text: '代理池', link: '/zh/guide/console/proxies' },
          { text: '模型', link: '/zh/guide/console/models' },
          { text: '风险审计', link: '/zh/guide/console/risk' },
          { text: 'system 提示词', link: '/zh/guide/console/system' },
          { text: '密钥', link: '/zh/guide/console/keys' },
          { text: 'API 地址', link: '/zh/guide/console/endpoints' },
          { text: '数据库', link: '/zh/guide/console/database' },
          { text: '用户', link: '/zh/guide/console/users' },
          { text: '内核', link: '/zh/guide/console/kernel' }
        ]
      },
      {
        text: '设置',
        items: [{ text: '全部设置页', link: '/zh/guide/settings' }]
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
