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
    // [
    //   '@vuepress/plugin-search',
    //   {
    //     locales: {
    //       '/': {
    //         placeholder: 'Search',
    //       }
    //     },
    //     maxSuggestions: 10,
    //   },
    // ],
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
    [
      "@vuepress/plugin-docsearch", {
        appId: '9XKIL2OH35',
        apiKey: '4766eda2c8703a6185791c95a2edaf1e',
        indexName: 'PPG007',
        searchParameters: {
          facetFilters: ['tags:v2'],
        },
      }
    ]
  ],
};
