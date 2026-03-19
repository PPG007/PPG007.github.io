import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['basic.md'],
    },
  ],
  text: 'Linux',
  icon: 'logos:linux-tux',
  dir: __dirname,
};

export default config;
