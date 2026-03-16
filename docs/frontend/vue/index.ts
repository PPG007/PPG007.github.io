import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'data_bind.md',
        'el_data.md',
        'MVVM.md',
        'data_proxy.md',
        'event.md',
        'computed.md',
        'watch.md',
        'class_style.md',
        'condition.md',
        'list.md',
        'filter.md',
        'builtin_command.md',
        'self_command.md',
        'life_cycle.md',
        'component.md',
        'vue_cli.md',
        'storage.md',
        'component_event.md',
        'event_bus.md',
        'publish_subscribe.md',
        'cli_proxy.md',
        'vue_resource.md',
        'slot.md',
        'vuex.md',
        'vue_router.md',
      ],
      prefix: 'vue2',
      text: 'Vue 2',
    },
    {
      children: ['start.md', 'common_composition.md', 'other_composition.md', 'new_component.md', 'others.md'],
      prefix: 'vue3',
      text: 'Vue 3',
    },
  ],
  text: 'Vue',
  icon: 'logos:vue',
  dir: __dirname,
};

export default config;
