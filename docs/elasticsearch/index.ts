import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/elasticsearch': [
      {
        children: [
          '/elasticsearch/docs/basic.md',
          '/elasticsearch/docs/esindex.md',
          '/elasticsearch/docs/mapping.md',
          '/elasticsearch/docs/dsl.md',
          '/elasticsearch/docs/aggregation.md',
          '/elasticsearch/docs/monstache.md',
          '/elasticsearch/docs/others.md',
          '/elasticsearch/docs/go-client.md',
        ],
        text: 'Elasticsearch',
      },
    ],
  },
  navbar: {
    text: 'Elasticsearch',
    link: '/elasticsearch',
    group: '数据库',
  },
};

export default config;
