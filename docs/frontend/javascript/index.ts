import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'basic.md',
        'data_type.md',
        'operator.md',
        'grammar.md',
        'builtin.md',
        'oop.md',
        'async.md',
        'event.md',
        'dom.md',
      ],
    },
  ],
  text: 'JavaScript',
  icon: 'skill-icons:javascript',
  dir: __dirname,
};

export default config;
