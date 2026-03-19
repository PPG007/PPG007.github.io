import { BarConfig } from '@doc-types';

const config: BarConfig = {
  text: 'Dart',
  icon: 'logos:dart',
  sidebars: [
    {
      children: [
        'start.md',
        'importantConcept.md',
        'variables.md',
        'innerType.md',
        'function.md',
        'operator.md',
        'processControl.md',
        'exception.md',
        'class.md',
        'generics.md',
        'async.md',
        'generators.md',
        'callableClass.md',
      ],
    },
  ],
  dir: __dirname,
};

export default config;
