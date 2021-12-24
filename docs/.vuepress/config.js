module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: 'PPG007 的文档',
  description: 'PPG007 的站点',

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',
    sidebarDepth: 3,
    navbar: [
      '/',
      {
        text: '前端',
        children: [
          {
            text: 'HTML',
            link: '/HTML.html',
          },
          {
            text: 'CSS',
            link: '/CSS.html',
          },
          {
            text: 'JavaScript',
            link: '/JavaScript.html',
          },
          {
            text: 'ES6',
            link: '/ES6.html',
          },
          {
            text: 'Vue 2.X',
            link: '/Vue2.html',
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
    ],
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
}
