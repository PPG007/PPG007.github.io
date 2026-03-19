import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['start.md', 'basic.md', 'advance.md'],
    },
  ],
  text: 'TypeScript',
  icon: 'skill-icons:typescript',
  dir: __dirname,
};

export default config;
