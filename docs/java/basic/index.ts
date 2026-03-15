import { BarConfig } from '../../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/java/basic': [
      {
        children: ['types.md'],
        text: 'Java 基础',
      },
    ],
  },
  navbar: {
    text: 'Java 基础',
    link: '/java/basic',
    group: 'Java',
    icon: 'logos:java',
  },
  devMode: true,
};

export default config;
