import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['start.md', 'election.md', 'shell.md', 'api.md', 'online_offline.md', 'distributed_lock.md'],
    },
  ],
  text: 'ZooKeeper',
  icon: 'logos:apache',
  dir: __dirname,
};

export default config;
