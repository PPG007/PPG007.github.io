import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/css': [
      {
        children: [
          '/css/docs/selector.md',
          '/css/docs/color.md',
          '/css/docs/background.md',
          '/css/docs/border.md',
          '/css/docs/box_model.md',
          '/css/docs/outline.md',
          '/css/docs/text.md',
          '/css/docs/font.md',
          '/css/docs/link.md',
          '/css/docs/layout.md',
          '/css/docs/flex.md',
          '/css/docs/pseudo-element.md',
          '/css/docs/pseudo_class.md',
        ],
        text: 'CSS',
      },
    ],
  },
  navbar: {
    text: 'CSS',
    link: '/css',
    group: '前端',
    icon: 'skill-icons:css',
  },
};

export default config;
