import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['three_level.md', 'design.md', 'others.md'],
      text: 'Restful API',
    },
  ],
  text: 'Restful API',
  icon: 'material-symbols:http',
  dir: __dirname,
};

export default config;
