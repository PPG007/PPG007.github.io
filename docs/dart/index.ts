import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/dart': [
      {
        children: [
          '/dart/docs/start.md',
          '/dart/docs/importantConcept.md',
          '/dart/docs/variables.md',
          '/dart/docs/innerType.md',
          '/dart/docs/function.md',
          '/dart/docs/operator.md',
          '/dart/docs/processControl.md',
          '/dart/docs/exception.md',
          '/dart/docs/class.md',
          '/dart/docs/generics.md',
          '/dart/docs/async.md',
          '/dart/docs/generators.md',
          '/dart/docs/callableClass.md',
        ],
        text: 'Dart',
      },
    ],
  },
  navbar: {
    text: 'Dart',
    link: '/dart',
    group: '前端',
    icon: 'logos:dart',
  },
};

export default config;
