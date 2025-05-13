import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/vue3': [
      {
        children: [
          '/vue3/docs/start.md',
          '/vue3/docs/common_composition.md',
          '/vue3/docs/other_composition.md',
          '/vue3/docs/new_component.md',
          '/vue3/docs/others.md',
        ],
        text: 'Vue3',
      },
    ],
  },
  navbar: {
    text: 'Vue 3',
    link: '/vue3',
    group: '前端',
    icon: 'logos:vue',
  },
};

export default config;
