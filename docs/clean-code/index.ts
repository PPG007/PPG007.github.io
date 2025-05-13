import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/clean-code': [
      {
        children: [
          '/clean-code/docs/start.md',
          '/clean-code/docs/meaningful_name.md',
          '/clean-code/docs/function.md',
          '/clean-code/docs/comment.md',
          '/clean-code/docs/format.md',
          '/clean-code/docs/object_and_data_struct.md',
          '/clean-code/docs/error.md',
          '/clean-code/docs/border.md',
          '/clean-code/docs/unit_test.md',
          '/clean-code/docs/class.md',
          '/clean-code/docs/system.md',
          '/clean-code/docs/concurrent_programming.md',
        ],
        text: 'Clean Code',
      },
    ],
  },
  navbar: {
    text: 'Clean Code',
    link: '/clean-code',
    group: 'others',
    icon: 'carbon:clean',
  },
};

export default config;
