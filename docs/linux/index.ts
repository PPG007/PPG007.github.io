import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/linux': [
      {
        children: ['/linux/docs/basic.md'],
        text: 'Linux',
      },
    ],
  },
  navbar: {
    text: 'Linux',
    link: '/linux',
    group: '云相关',
    icon: 'logos:linux-tux',
  },
};

export default config;
