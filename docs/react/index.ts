import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/react': [
      {
        children: [
          '/react/docs/hello.md',
          '/react/docs/jsx.md',
          '/react/docs/component.md',
          '/react/docs/state.md',
          '/react/docs/props.md',
          '/react/docs/ref.md',
          '/react/docs/lifecycle.md',
          '/react/docs/effect.md',
          '/react/docs/cli.md',
          '/react/docs/reducer.md',
          '/react/docs/context.md',
          '/react/docs/hooks.md',
          '/react/docs/router.md',
          '/react/docs/redux.md',
        ],
        text: 'React',
      },
    ],
  },
  navbar: {
    text: 'React',
    link: '/react',
    group: '前端',
    icon: 'material-icon-theme:react',
  },
};

export default config;
