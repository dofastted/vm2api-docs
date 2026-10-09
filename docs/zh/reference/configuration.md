# 配置

几乎所有需要修改的内容都集中在两个文件中。

## 站点设置

打开 `docs/.vitepress/config.mts`。顶部的 `project` 对象控制站点名称、地址、GitHub 链接、许可证和版权信息：

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

其下方的 `navEn()` / `sidebarEn()` 与 `navZh()` / `sidebarZh()` 分别定义各语言的顶部导航和侧边栏。

## 风格预设

模板内置两种风格，在 `docs/.vitepress/theme/index.ts` 中选择：

```ts
import './presets/editorial.css' // 暖白纸感、衬线标题、陶土色点缀
// import './presets/apple.css'  // 纯净白底、系统字体、蓝色点缀
```

如需微调颜色、字体、圆角或阴影，修改预设文件中的 `--t-*` 变量，浅色与深色的值都在其中。

## Logo

替换 `docs/public/logo.svg`（浅色）和 `docs/public/logo-dark.svg`（深色），浅色版同时用作网站图标。

## 首页

编辑 `docs/zh/index.md`（以及 `docs/index.md`）的 front matter，修改主标题、按钮和特性卡片。

## 新增语言

1. 复制 `docs/zh/` 为新目录，例如 `docs/ja/`，并翻译页面。
2. 在 `config.mts` 的 `locales` 下参照 `zh` 新增 `ja` 条目。
3. 如需搜索界面翻译，在 `themeConfig.search.options.locales` 中添加。

## 移除语言

删除对应目录（如 `docs/zh/`）以及 `locales` 中的条目即可。
