import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/markdown': [
      {
        children: [
          '/markdown/docs/basic.md',
          '/markdown/docs/expand.md',
          '/markdown/docs/standard.md',
        ],
        text: 'Markdown',
      },
    ],
  },
  navbar: {
    text: 'Markdown',
    link: '/markdown',
    group: 'others',
  },
};

export default config;
