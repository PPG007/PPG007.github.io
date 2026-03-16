import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'eureka.md',
        'zookeeper.md',
        'consul.md',
        'ribbon.md',
        'feign.md',
        'open_feign.md',
        'hystrix.md',
        'gateway.md',
        'zuul.md',
        'config.md',
        'bus.md',
        'stream.md',
        'sleuth.md',
        'nacos.md',
      ],
    },
  ],
  text: 'SpringCloud',
  icon: 'line-md:cloud-up-twotone',
  dir: __dirname,
};

export default config;
