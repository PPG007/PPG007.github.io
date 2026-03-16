import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['tcp.md', 'udp.md', 'url.md'],
      text: '网络通信',
    },
  ],
  text: '网络通信',
  icon: 'tabler:network',
  dir: __dirname,
};

export default config;
