import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/design-pattern': [
      {
        children: [
          '/design-pattern/docs/srp.md',
          '/design-pattern/docs/lsp.md',
          '/design-pattern/docs/dip.md',
          '/design-pattern/docs/interface_isolation.md',
          '/design-pattern/docs/demeter.md',
          '/design-pattern/docs/open_close.md',
        ],
        text: '六大设计原则',
      },
      {
        children: [
          '/design-pattern/docs/singleton.md',
          '/design-pattern/docs/factory.md',
          '/design-pattern/docs/abstract_factory.md',
          '/design-pattern/docs/template.md',
          '/design-pattern/docs/builder.md',
          '/design-pattern/docs/proxy.md',
          '/design-pattern/docs/prototype.md',
          '/design-pattern/docs/mediator.md',
          '/design-pattern/docs/command.md',
          '/design-pattern/docs/responsibility_chain.md',
          '/design-pattern/docs/decorator.md',
          '/design-pattern/docs/strategy.md',
          '/design-pattern/docs/adapter.md',
          '/design-pattern/docs/iterator.md',
          '/design-pattern/docs/compose.md',
          '/design-pattern/docs/observe.md',
          '/design-pattern/docs/facade.md',
          '/design-pattern/docs/memento.md',
          '/design-pattern/docs/visitor.md',
          '/design-pattern/docs/state.md',
          '/design-pattern/docs/expression.md',
          '/design-pattern/docs/fly_weight.md',
        ],
        text: '23 种设计模式',
      },
    ],
  },
  navbar: {
    text: '设计模式',
    link: '/design-pattern',
    group: 'others',
  },
};

export default config;
