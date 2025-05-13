import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/javascript': [
      {
        text: 'JavaScript',
        children: [
          '/javascript/docs/basic.md',
          '/javascript/docs/data_type.md',
          '/javascript/docs/operator.md',
          '/javascript/docs/grammar.md',
          '/javascript/docs/builtin.md',
          '/javascript/docs/oop.md',
          '/javascript/docs/async.md',
          '/javascript/docs/event.md',
          '/javascript/docs/dom.md',
        ],
      },
    ],
  },
  navbar: {
    text: 'JavaScript',
    link: '/javascript',
    group: '前端',
    icon: 'skill-icons:javascript',
  },
};

export default config;
