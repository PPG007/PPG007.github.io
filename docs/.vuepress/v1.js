const bars = require('./config/bar-v1.js')
const hope = require('vuepress-theme-hope');

module.exports.config = hope.config({
    title: "PPG007 的文档",
    description: "PPG007 的文档",
    themeConfig: {
        author: 'PPG007',
        nav: bars.navbar,
        sidebar: bars.sidebar,
        hostname: 'ppg007.github.io',
        repo: 'https://github.com/PPG007/PPG007.github.io',
        displayAllHeaders: true,
        logo: '/indexImage',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '编辑此页',
        pwa: false,
        comment: {
            visitor: false,
        },
        blog: false,
        sitemap: false,
        pageInfo: false
    },
    plugins: [
        [
            'vuepress-plugin-meilisearch',
            {
                hostUrl: 'https://ppg007.asia:7000',
                apiKey: '941543d947a75506fb223af0d3f04847330f2199e790438c8f63bd0705a41add',
                indexUid: 'docs',
                placeholder: 'press s to start search',
                maxSuggestions: 100,
                cropLength: 50,
                layout: 'simple',
            }
        ],
        [
            '@vuepress/google-analytics',
            {
              'ga': 'G-XFW9LG5M41'
            }
          ]
    ]
})
