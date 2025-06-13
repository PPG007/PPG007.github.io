import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/typescript': [
      {
        children: ['/typescript/docs/start.md', '/typescript/docs/basic.md', '/typescript/docs/advance.md'],
        text: 'TypeScript',
      },
    ],
  },
  navbar: {
    text: 'TypeScript',
    link: '/typescript',
    group: '前端',
    icon: 'skill-icons:typescript',
  },
};

export default config;
