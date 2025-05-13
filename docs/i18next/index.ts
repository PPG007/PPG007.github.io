import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/i18next': [
      {
        children: ['/i18next/docs/basic.md'],
        text: 'i18next',
      },
    ],
  },
  navbar: {
    text: 'i18next',
    link: '/i18next',
    group: '前端',
    icon: 'material-icon-theme:folder-i18n-open',
  },
};

export default config;
