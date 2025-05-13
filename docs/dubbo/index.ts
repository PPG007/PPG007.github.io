import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/dubbo': [
      {
        children: [
          '/dubbo/docs/start.md',
          '/dubbo/docs/environment.md',
          '/dubbo/docs/spring.md',
          '/dubbo/docs/config_tag.md',
          '/dubbo/docs/finish_config.md',
          '/dubbo/docs/springboot.md',
          '/dubbo/docs/config_rule.md',
          '/dubbo/docs/high_availability.md',
        ],
        text: 'Dubbo',
      },
    ],
  },
  navbar: {
    text: 'Dubbo',
    link: '/dubbo',
    group: 'Java',
    icon: 'streamline:interface-arrows-data-transfer-diagonal-arrows-arrow-server-data-diagonal-internet-transfer-network',
  },
};

export default config;
