import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'meta_char.md',
        'qualifier.md',
        'char.md',
        'case.md',
        'antonym.md',
        'group.md',
        'back_reference.md',
        'zero_width_assertion.md',
        'reverse_zero_width_assertion.md',
        'greed_laziness.md',
      ],
    },
  ],
  text: '正则表达式',
  icon: 'skill-icons:regex-light',
  dir: __dirname,
};

export default config;
