import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'context.md',
        'request.md',
        'response.md',
        'middleware.md',
        'router.md',
        'error-handling.md',
      ],
    },
  ],
  text: 'Koa',
  icon: 'simple-icons:koa',
  dir: __dirname,
};

export default config;
