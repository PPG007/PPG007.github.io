import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['srp.md', 'lsp.md', 'dip.md', 'interface_isolation.md', 'demeter.md', 'open_close.md'],
      text: '六大设计原则',
    },
    {
      children: [
        'singleton.md',
        'factory.md',
        'abstract_factory.md',
        'template.md',
        'builder.md',
        'proxy.md',
        'prototype.md',
        'mediator.md',
        'command.md',
        'responsibility_chain.md',
        'decorator.md',
        'strategy.md',
        'adapter.md',
        'iterator.md',
        'compose.md',
        'observe.md',
        'facade.md',
        'memento.md',
        'visitor.md',
        'state.md',
        'expression.md',
        'fly_weight.md',
      ],
      text: '23 种设计模式',
    },
  ],
  text: '设计模式',
  icon: 'icon-park-outline:bydesign',
  dir: __dirname,
};

export default config;
