import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/mybatis': [
      {
        children: [
          '/mybatis/docs/jdbc.md',
          '/mybatis/docs/hello_mybatis.md',
          '/mybatis/docs/crud.md',
          '/mybatis/docs/config.md',
          '/mybatis/docs/life_cycle.md',
          '/mybatis/docs/resultmap.md',
          '/mybatis/docs/log.md',
          '/mybatis/docs/multi_table.md',
          '/mybatis/docs/dynamic_sql.md',
          '/mybatis/docs/cache.md',
        ],
        text: 'mybatis',
      },
    ],
  },
  navbar: {
    text: 'Mybatis',
    link: '/mybatis',
    group: 'Java',
    icon: 'material-symbols:database',
  },
};

export default config;
