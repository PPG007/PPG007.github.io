import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/activemq': [
      {
        text: 'ActiveMQ',
        children: [
          '/activemq/docs/start.md',
          '/activemq/docs/linux_deploy.md',
          '/activemq/docs/java_queue.md',
          '/activemq/docs/queue_case.md',
          '/activemq/docs/java_topic.md',
          '/activemq/docs/jms.md',
          '/activemq/docs/broker.md',
          '/activemq/docs/spring_activemq.md',
          '/activemq/docs/springboot_activemq.md',
          '/activemq/docs/protocol.md',
          '/activemq/docs/persistent.md',
          '/activemq/docs/cluster.md',
          '/activemq/docs/advanced.md',
        ],
      },
    ],
  },
  navbar: {
    text: 'ActiveMQ',
    link: '/activemq',
    group: '云相关',
    icon: 'mdi:mq',
  },
};

export default config;
