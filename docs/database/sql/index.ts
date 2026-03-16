import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['select.md', 'insert.md', 'update.md', 'delete.md', 'database.md'],
    },
  ],
  text: 'SQL',
  icon: 'hugeicons:sql',
  dir: __dirname,
};

export default config;
