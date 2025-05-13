import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/netty': [
      {
        children: [
          '/netty/docs/io_model.md',
          '/netty/docs/thread_model.md',
          '/netty/docs/task_queue.md',
          '/netty/docs/netty_core.md',
          '/netty/docs/group_chat.md',
          '/netty/docs/heart_check.md',
          '/netty/docs/websocket.md',
          '/netty/docs/encode_decode.md',
          '/netty/docs/in_out.md',
          '/netty/docs/tcp_package.md',
          '/netty/docs/rpc.md',
        ],
        text: 'Netty',
      },
    ],
  },
  navbar: {
    text: 'Netty',
    link: '/netty',
    group: 'Java',
    icon: 'carbon:server-dns',
  },
};

export default config;
