import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'command.md',
        'transaction.md',
        'jedis.md',
        'redis_template.md',
        'config.md',
        'persistent.md',
        'subscribe_publish.md',
        'master_slave.md',
        'cluster.md',
        'distributed_lock.md',
      ],
    },
  ],
  text: 'Redis',
  icon: 'skill-icons:redis-light',
  dir: __dirname,
};

export default config;
