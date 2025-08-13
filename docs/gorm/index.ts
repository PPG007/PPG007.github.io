import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/gorm': [
      {
        children: [
          '/gorm/docs/start.md'
        ],
        text: 'GORM'
      }
    ]
  },
  navbar: {
    text: 'GORM',
    link: '/gorm',
    group: 'Go',
    icon: 'iconoir:database-tag',
  },
};

export default config;
