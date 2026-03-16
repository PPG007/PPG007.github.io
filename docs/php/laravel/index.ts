import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'concepts.md',
        'deploy.md',
        'routing.md',
        'middleware.md',
        'controller.md',
        'request.md',
        'response.md',
        'session.md',
        'validation.md',
        'error.md',
        'log.md',
        'database.md',
        'eloquent.md',
        'artisan.md',
        'context.md',
        'security.md',
        'utils.md',
      ],
    },
  ],
  text: 'Laravel',
  icon: 'skill-icons:laravel-light',
  dir: __dirname,
};
export default config;
