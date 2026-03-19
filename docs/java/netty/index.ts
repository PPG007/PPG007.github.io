import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'io_model.md',
        'thread_model.md',
        'task_queue.md',
        'netty_core.md',
        'group_chat.md',
        'heart_check.md',
        'websocket.md',
        'encode_decode.md',
        'in_out.md',
        'tcp_package.md',
        'rpc.md',
      ],
    },
  ],
  text: 'Netty',
  icon: 'carbon:server-dns',
  dir: __dirname,
};

export default config;
