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
      'vuepress-plugin-clipboard', {
        // options...
      },
    ],
    [
      '@vuepress/plugin-docsearch', {
        appId: '9XKIL2OH35',
        apiKey: '4766eda2c8703a6185791c95a2edaf1e',
        indexName: 'PPG007',
        searchParameters: {
          facetFilters: ['tags:v2'],
        },
        locales: {
          '/': {
            placeholder: '在此搜索',
            translations: {
              button: {
                buttonText: '搜索',
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清空',
                  resetButtonAriaLabel: 'Clear the query',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: 'Cancel',
                },
                startScreen: {
                  recentSearchesTitle: '最近搜索',
                  noRecentSearchesText: '没有近期搜索记录',
                  saveRecentSearchButtonTitle: '保存此次搜索',
                  removeRecentSearchButtonTitle: '从搜索历史中删除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中删除',
                },
                errorScreen: {
                  titleText: '无法获取搜索结果',
                  helpText: '你可能需要检查你的网络连接',
                },
                footer: {
                  selectText: '进入',
                  selectKeyAriaLabel: 'Enter key',
                  navigateText: '选择',
                  navigateUpKeyAriaLabel: 'Arrow up',
                  navigateDownKeyAriaLabel: 'Arrow down',
                  closeText: '关闭搜索',
                  closeKeyAriaLabel: 'Escape key',
                  searchByText: 'Search by',
                },
                noResultsScreen: {
                  noResultsText: '没有匹配结果',
                  suggestedQueryText: '试试搜索',
                  reportMissingResultsText: '确信此次搜索应当返回结果？',
                  reportMissingResultsLinkText: '反馈',
                },
              },
            },
          },
        },
      }
    ]
  ],
};
