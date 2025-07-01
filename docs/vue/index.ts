import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/vue': [
      {
        children: [
          '/vue/docs/vue2/start.md',
          '/vue/docs/vue2/data_bind.md',
          '/vue/docs/vue2/el_data.md',
          '/vue/docs/vue2/MVVM.md',
          '/vue/docs/vue2/data_proxy.md',
          '/vue/docs/vue2/event.md',
          '/vue/docs/vue2/computed.md',
          '/vue/docs/vue2/watch.md',
          '/vue/docs/vue2/class_style.md',
          '/vue/docs/vue2/condition.md',
          '/vue/docs/vue2/list.md',
          '/vue/docs/vue2/filter.md',
          '/vue/docs/vue2/builtin_command.md',
          '/vue/docs/vue2/self_command.md',
          '/vue/docs/vue2/life_cycle.md',
          '/vue/docs/vue2/component.md',
          '/vue/docs/vue2/vue_cli.md',
          '/vue/docs/vue2/storage.md',
          '/vue/docs/vue2/component_event.md',
          '/vue/docs/vue2/event_bus.md',
          '/vue/docs/vue2/publish_subscribe.md',
          '/vue/docs/vue2/cli_proxy.md',
          '/vue/docs/vue2/vue_resource.md',
          '/vue/docs/vue2/slot.md',
          '/vue/docs/vue2/vuex.md',
          '/vue/docs/vue2/vue_router.md',
        ],
        text: 'Vue 2',
      },
      {
        children: [
          '/vue/docs/vue3/start.md',
          '/vue/docs/vue3/common_composition.md',
          '/vue/docs/vue3/other_composition.md',
          '/vue/docs/vue3/new_component.md',
          '/vue/docs/vue3/others.md',
        ],
        text: 'Vue 3',
      },
    ],
  },
  navbar: {
    text: 'Vue',
    link: '/vue',
    group: '前端',
    icon: 'logos:vue',
  },
};

export default config;
