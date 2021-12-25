const html = require('../html/index.js')
const css = require('../css/index.js')
const javascript = require('../javascript/index.js')
const vue2 = require('../vue2/index.js')

module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: 'PPG007 的文档',
  description: 'PPG007 的站点',

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: 'logo.png',
    repo: 'https://github.com/PPG007/PPG007.github.io',
    editLink: false,
    sidebarDepth: 3,
    contributors: true,
    lastUpdated: true,
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '前端',
        children: [
          {
            text: 'HTML',
            link: '/html',
          },
          {
            text: 'CSS',
            link: '/css',
          },
          {
            text: 'JavaScript',
            link: '/javascript',
          },
          {
            text: 'ES6',
            link: '/ES6.html',
          },
          {
            text: 'Vue 2.X',
            link: '/vue2',
          },
          {
            text: 'Vue 3',
            link: 'Vue3.html',
          },
          {
            text: 'Axios',
            link: 'Axios.html',
          },
        ],
      },
      {
        text: 'Java',
        children: [
          {
            text: 'Java IO',
            link: '/JavaIO.html',
          },
          {
            text: 'Java 知识点',
            link: '/Java知识点.html',
          },
          {
            text: 'Java 网络通信',
            link: '/Java网络通信.html',
          },
          {
            text: 'ActiveMQ',
            link: '/ActiveMQ.html',
          },
          {
            text: 'Mybatis',
            link: '/Mybatis.html',
          },
          {
            text: 'Spring',
            link: '/Spring.html',
          },
          {
            text: 'SpringMVC',
            link: '/SpringMVC.html',
          },
          {
            text: 'SpringBoot',
            link: '/SpringBoot.html',
          },
          {
            text: 'SpringCloud',
            link: '/SpringCloud.html',
          },
          {
            text: 'Dubbo',
            link: '/Dubbo.html',
          },
          {
            text: 'Docker',
            link: '/Docker.html',
          },
        ],
      },
      {
        text: 'Go',
        children: [
          {
            text: 'Go',
            link: '/Go.html',
          },
          {
            text: 'gRPC&Protobuf',
            link: '/gRPC&Protobuf.html',
          },
          {
            text: 'Gin',
            link: '/gin.html',
          },
        ],
      },
      {
        text: '数据库',
        children: [
          {
            text: 'MongoDB',
            link: '/MongoDB.html',
          }
        ],
      },
      {
        text: 'Git',
        children: [
          {
            text: 'Git',
            link: '/Git.html',
          }
        ],
      },
      {
        text: 'Be Professional',
        children: [
          {
            text: 'Coding Style',
            link: '/CodingStyle.html',
          }
        ],
      },
      {
        text: 'others',
        children: [
          {
            text: 'Markdown',
            link: '/Markdown.html',
          }
        ],
      },
    ],
    sidebar: {
      ...html.HTMLSidebar,
      ...css.CssSidebar,
      ...javascript.JavaScriptSidebar,
      ...vue2.Vue2Sidebar,
    },
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
      },
    ],
  ],
};
