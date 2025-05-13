import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/vue2': [
      {
        children: [
          '/vue2/docs/start.md',
          '/vue2/docs/data_bind.md',
          '/vue2/docs/el_data.md',
          '/vue2/docs/MVVM.md',
          '/vue2/docs/data_proxy.md',
          '/vue2/docs/event.md',
          '/vue2/docs/computed.md',
          '/vue2/docs/watch.md',
          '/vue2/docs/class_style.md',
          '/vue2/docs/condition.md',
          '/vue2/docs/list.md',
          '/vue2/docs/filter.md',
          '/vue2/docs/builtin_command.md',
          '/vue2/docs/self_command.md',
          '/vue2/docs/life_cycle.md',
          '/vue2/docs/component.md',
          '/vue2/docs/vue_cli.md',
          '/vue2/docs/storage.md',
          '/vue2/docs/component_event.md',
          '/vue2/docs/event_bus.md',
          '/vue2/docs/publish_subscribe.md',
          '/vue2/docs/cli_proxy.md',
          '/vue2/docs/vue_resource.md',
          '/vue2/docs/slot.md',
          '/vue2/docs/vuex.md',
          '/vue2/docs/vue_router.md',
        ],
        text: 'Vue 2.X',
      },
    ],
  },
  navbar: {
    text: 'Vue 2.X',
    link: '/vue2',
    group: '前端',
    icon: 'logos:vue',
  },
};

export default config;
