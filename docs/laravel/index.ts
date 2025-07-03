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
          '/laravel/docs/session.md',
          '/laravel/docs/validation.md',
          '/laravel/docs/error.md',
          '/laravel/docs/log.md',
          '/laravel/docs/database.md',
          '/laravel/docs/eloquent.md',
          '/laravel/docs/artisan.md',
          '/laravel/docs/context.md',
          '/laravel/docs/security.md',
          '/laravel/docs/utils.md',
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
