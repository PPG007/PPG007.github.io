import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'basic.md',
        'esindex.md',
        'mapping.md',
        'dsl.md',
        'aggregation.md',
        'monstache.md',
        'others.md',
        'go-client.md',
      ],
    },
  ],
  text: 'Elasticsearch',
  icon: 'skill-icons:elasticsearch-light',
  dir: __dirname,
};

export default config;
