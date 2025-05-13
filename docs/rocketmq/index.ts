import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/rocketmq': [
      {
        children: [
          '/rocketmq/docs/basic.md',
          '/rocketmq/docs/features.md',
          '/rocketmq/docs/start.md',
          '/rocketmq/docs/examples-java.md',
        ],
        text: 'RocketMQ',
      },
    ],
  },
  navbar: {
    text: 'RocketMQ',
    link: '/rocketmq',
    group: '云相关',
    icon: 'simple-icons:apacherocketmq',
  },
};

export default config;
