import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/regex': [
      {
        children: [
          '/regex/docs/meta_char.md',
          '/regex/docs/qualifier.md',
          '/regex/docs/char.md',
          '/regex/docs/case.md',
          '/regex/docs/antonym.md',
          '/regex/docs/group.md',
          '/regex/docs/back_reference.md',
          '/regex/docs/zero_width_assertion.md',
          '/regex/docs/reverse_zero_width_assertion.md',
          '/regex/docs/greed_laziness.md',
        ],
        text: '正则表达式',
      },
    ],
  },
  navbar: {
    text: '正则表达式',
    link: '/regex',
    group: 'others',
    icon: 'skill-icons:regex-light',
  },
};

export default config;
