import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/zookeeper': [
      {
        children: [
          '/zookeeper/docs/start.md',
          '/zookeeper/docs/election.md',
          '/zookeeper/docs/shell.md',
          '/zookeeper/docs/api.md',
          '/zookeeper/docs/online_offline.md',
          '/zookeeper/docs/distributed_lock.md',
        ],
        text: 'ZooKeeper',
      },
    ],
  },
  navbar: {
    text: 'ZooKeeper',
    link: '/zookeeper',
    group: '云相关',
  },
};

export default config;
