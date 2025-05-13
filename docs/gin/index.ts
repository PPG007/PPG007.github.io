import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/gin': [
      {
        children: [
          '/gin/docs/start.md',
          '/gin/docs/router.md',
          '/gin/docs/data.md',
          '/gin/docs/render.md',
          '/gin/docs/middleware.md',
          '/gin/docs/cookie_session.md',
          '/gin/docs/validator.md',
          '/gin/docs/log.md',
          '/gin/docs/jwt.md',
        ],
        text: 'Gin',
      },
    ],
  },
  navbar: {
    text: 'Gin',
    link: '/gin',
    group: 'Go',
    icon: 'logos:gin',
  },
};

export default config;
