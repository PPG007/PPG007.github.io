import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['common_settings.md', 'common_keys.md'],
    },
  ],
  text: 'VsCode',
  icon: 'material-icon-theme:vscode',
  dir: __dirname,
};

export default config;
