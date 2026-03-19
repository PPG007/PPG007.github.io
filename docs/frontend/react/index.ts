import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'hello.md',
        'jsx.md',
        'component.md',
        'state.md',
        'props.md',
        'ref.md',
        'lifecycle.md',
        'effect.md',
        'cli.md',
        'reducer.md',
        'context.md',
        'hooks.md',
        'router.md',
        'redux.md',
      ],
    },
  ],
  text: 'React',
  icon: 'material-icon-theme:react',
  dir: __dirname,
};

export default config;
