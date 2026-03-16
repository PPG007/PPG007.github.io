import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['basic.md', 'commands.md', 'ca.md'],
    },
  ],
  text: 'OpenSSL',
  icon: 'fa-brands:expeditedssl',
  dir: __dirname,
};

export default config;
