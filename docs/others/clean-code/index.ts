import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'meaningful_name.md',
        'function.md',
        'comment.md',
        'format.md',
        'object_and_data_struct.md',
        'error.md',
        'border.md',
        'unit_test.md',
        'class.md',
        'system.md',
        'concurrent_programming.md',
      ],
    },
  ],
  text: 'Clean Code',
  icon: 'carbon:clean',
  dir: __dirname,
};

export default config;
