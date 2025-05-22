import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/laravel': [
      {
        children: [
          '/laravel/docs/start.md',
          '/laravel/docs/concepts.md',
          '/laravel/docs/deploy.md',
          '/laravel/docs/routing.md',
          '/laravel/docs/middleware.md',
          '/laravel/docs/controller.md',
          '/laravel/docs/request.md',
          '/laravel/docs/response.md',
        ],
        text: 'Laravel',
      },
    ],
  },
  navbar: {
    text: 'Laravel',
    link: '/laravel',
    group: 'PHP',
    icon: 'skill-icons:laravel-light',
  },
};
export default config;
