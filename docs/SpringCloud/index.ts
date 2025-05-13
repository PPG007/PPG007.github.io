import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/SpringCloud': [
      {
        children: [
          '/SpringCloud/docs/start.md',
          '/SpringCloud/docs/eureka.md',
          '/SpringCloud/docs/zookeeper.md',
          '/SpringCloud/docs/consul.md',
          '/SpringCloud/docs/ribbon.md',
          '/SpringCloud/docs/feign.md',
          '/SpringCloud/docs/open_feign.md',
          '/SpringCloud/docs/hystrix.md',
          '/SpringCloud/docs/gateway.md',
          '/SpringCloud/docs/zuul.md',
          '/SpringCloud/docs/config.md',
          '/SpringCloud/docs/bus.md',
          '/SpringCloud/docs/stream.md',
          '/SpringCloud/docs/sleuth.md',
          '/SpringCloud/docs/nacos.md',
        ],
        text: 'Spring Cloud',
      },
    ],
  },
  navbar: {
    text: 'SpringCloud',
    link: '/SpringCloud',
    group: 'Java',
    icon: 'line-md:cloud-up-twotone',
  },
};

export default config;
