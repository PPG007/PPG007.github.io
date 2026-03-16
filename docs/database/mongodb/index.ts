import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['database.md', 'collection.md', 'document.md', 'aggregation.md'],
    },
  ],
  text: 'MongoDB',
  icon: 'skill-icons:mongodb',
  dir: __dirname,
};

export default config;
