import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'jdbc.md',
        'hello_mybatis.md',
        'crud.md',
        'config.md',
        'life_cycle.md',
        'resultmap.md',
        'log.md',
        'multi_table.md',
        'dynamic_sql.md',
        'cache.md',
      ],
    },
  ],
  text: 'Mybatis',
  icon: 'material-symbols:database',
  dir: __dirname,
};

export default config;
