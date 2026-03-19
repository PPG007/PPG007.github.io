import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['basic.md'],
    },
  ],
  text: 'i18next',
  icon: 'material-icon-theme:folder-i18n-open',
  dir: __dirname,
};

export default config;
