import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/javanet': [
      {
        children: ['/javanet/docs/tcp.md', '/javanet/docs/udp.md', '/javanet/docs/url.md'],
        text: 'Java 网络通信',
      },
    ],
  },
  navbar: {
    text: 'Java 网络通信',
    link: '/javanet',
    group: 'Java',
    icon: 'tabler:network',
  },
};

export default config;
