import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/es6': [
      {
        children: [
          '/es6/docs/let_const.md',
          '/es6/docs/variable_destructuring_assignment.md',
          '/es6/docs/string_expansion.md',
          '/es6/docs/function_expansion.md',
          '/es6/docs/array_expansion.md',
          '/es6/docs/object_expansion.md',
          '/es6/docs/object_new_function.md',
          '/es6/docs/operator_expansion.md',
          '/es6/docs/map.md',
          '/es6/docs/promise.md',
          '/es6/docs/async.md',
          '/es6/docs/class_basic.md',
          '/es6/docs/class_extends.md',
          '/es6/docs/module.md',
        ],
        text: 'ES6',
      },
    ],
  },
  navbar: {
    text: 'ES6',
    link: '/es6',
    group: '前端',
    icon: 'arcticons:es-de-frontend',
  },
};

export default config;
