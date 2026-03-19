import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'linux_deploy.md',
        'java_queue.md',
        'queue_case.md',
        'java_topic.md',
        'jms.md',
        'broker.md',
        'spring_activemq.md',
        'springboot_activemq.md',
        'protocol.md',
        'persistent.md',
        'cluster.md',
        'advanced.md',
      ],
    },
  ],
  text: 'ActiveMQ',
  icon: 'mdi:mq',
  dir: __dirname,
};

export default config;
