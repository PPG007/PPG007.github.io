import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['basic.md', 'expand.md', 'standard.md'],
    },
  ],
  text: 'Markdown',
  icon: 'skill-icons:markdown-light',
  dir: __dirname,
};

export default config;
