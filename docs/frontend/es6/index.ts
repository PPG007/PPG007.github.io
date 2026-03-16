import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'let_const.md',
        'variable_destructuring_assignment.md',
        'string_expansion.md',
        'function_expansion.md',
        'array_expansion.md',
        'object_expansion.md',
        'object_new_function.md',
        'operator_expansion.md',
        'map.md',
        'promise.md',
        'async.md',
        'class_basic.md',
        'class_extends.md',
        'module.md',
      ],
    },
  ],
  text: 'ES6',
  icon: 'arcticons:es-de-frontend',
  dir: __dirname,
};

export default config;
