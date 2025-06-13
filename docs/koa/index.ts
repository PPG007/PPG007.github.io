import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/koa': [
      {
        children: [
          '/koa/docs/start.md',
          '/koa/docs/context.md',
          '/koa/docs/request.md',
          '/koa/docs/response.md',
          '/koa/docs/middleware.md',
          '/koa/docs/router.md',
          '/koa/docs/error-handling.md',
        ],
        text: 'Koa',
      },
    ],
  },
  navbar: {
    text: 'Koa',
    link: '/koa',
    group: '前端',
    icon: 'simple-icons:koa',
  },
};

export default config;
