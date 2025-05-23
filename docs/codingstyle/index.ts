import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/codingstyle': [
      {
        children: [
          '/codingstyle/docs/start.md',
          '/codingstyle/docs/alibaba_java.md',
          '/codingstyle/docs/html.md',
          '/codingstyle/docs/css.md',
          '/codingstyle/docs/javascript.md',
        ],
        text: 'Coding Style',
      },
    ],
  },
  navbar: {
    text: 'Coding Style',
    link: '/codingstyle',
    group: 'others',
    icon: 'vscode-icons:file-type-style',
  },
};

export default config;
