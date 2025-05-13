import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/mongodb': [
      {
        children: [
          '/mongodb/docs/database.md',
          '/mongodb/docs/collection.md',
          '/mongodb/docs/document.md',
          '/mongodb/docs/aggregation.md',
        ],
        text: 'MongoDB',
      },
    ],
  },
  navbar: {
    text: 'MongoDB',
    link: '/mongodb',
    group: '数据库',
  },
};

export default config;
