import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/php': [
      {
        children: [
          '/php/docs/install.md',
          '/php/docs/basic.md',
          '/php/docs/type.md',
          '/php/docs/variable.md',
          '/php/docs/const.md',
          '/php/docs/expression.md',
          '/php/docs/operator.md',
          '/php/docs/control.md',
          '/php/docs/function.md',
          '/php/docs/class.md',
          '/php/docs/namespace.md',
          '/php/docs/enum.md',
          '/php/docs/exception.md',
          '/php/docs/fiber.md',
          '/php/docs/generator.md',
        ],
        text: 'PHP',
      },
    ],
  },
  navbar: {
    text: 'PHP',
    link: '/php',
    group: 'PHP',
    icon: 'material-icon-theme:php-elephant',
  },
};

export default config;
