import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'router.md',
        'data.md',
        'render.md',
        'middleware.md',
        'cookie_session.md',
        'validator.md',
        'log.md',
        'jwt.md',
      ],
    },
  ],
  text: 'Gin',
  icon: 'logos:gin',
  dir: __dirname,
};

export default config;
