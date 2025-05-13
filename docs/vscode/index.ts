import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/vscode': [
      {
        children: ['/vscode/docs/common_settings.md', '/vscode/docs/common_keys.md'],
        text: 'VsCode',
      },
    ],
  },
  navbar: {
    text: 'VsCode',
    link: '/vscode',
    group: 'others',
    icon: 'material-icon-theme:vscode',
  },
};

export default config;
