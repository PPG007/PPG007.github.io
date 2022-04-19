const bars = require('./config/bars.js')

module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: 'PPG007 的文档',
  description: 'PPG007 的站点',

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: 'indexImage',
    repo: 'https://github.com/PPG007/PPG007.github.io',
    editLink: false,
    sidebarDepth: 3,
    contributors: true,
    lastUpdated: true,
    navbar: bars.navbar,
    sidebar: bars.sidebar,
  },
  public: 'docs/images',
  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search',
          },
          '/zh/': {
            placeholder: '搜索',
          },
        },
        maxSuggestions: 10,
      },
    ],
    [
      '@vuepress/plugin-google-analytics',
      {
        id: 'G-XFW9LG5M41',
      },
    ],
    [
      "vuepress-plugin-clipboard", {
        // options...
      },
    ],
  ],
};
