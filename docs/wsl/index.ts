import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/wsl': [
      {
        children: [],
        text: 'WSL',
      },
    ],
  },
  navbar: {
    text: 'WSL',
    link: '/wsl',
    group: 'others',
  },
};

export default config;
