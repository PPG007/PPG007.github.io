import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/docker': [
      {
        children: [],
        text: 'Docker',
      },
    ],
  },
  navbar: {
    text: 'Docker',
    link: '/docker',
    group: '云相关',
  },
};

export default config;
