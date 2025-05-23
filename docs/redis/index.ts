import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/redis': [
      {
        children: [
          '/redis/docs/command.md',
          '/redis/docs/transaction.md',
          '/redis/docs/jedis.md',
          '/redis/docs/redis_template.md',
          '/redis/docs/config.md',
          '/redis/docs/persistent.md',
          '/redis/docs/subscribe_publish.md',
          '/redis/docs/master_slave.md',
          '/redis/docs/cluster.md',
          '/redis/docs/distributed_lock.md',
        ],
        text: 'Redis',
      },
    ],
  },
  navbar: {
    text: 'Redis',
    link: '/redis',
    group: '数据库',
    icon: 'skill-icons:redis-light',
  },
};

export default config;
