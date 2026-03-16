import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'basic.md',
        'function_interface.md',
        'synchronized.md',
        'thread_method.md',
        'thread_pool.md',
        'lock.md',
        'collection.md',
        'lock_case.md',
        'util.md',
        'rwlock.md',
        'block_queue.md',
        'fork_join.md',
        'async_callback.md',
        'jmm_volatile.md',
        'singleton.md',
        'cas.md',
        'atomic.md',
        'spin.md',
      ],
    },
  ],
  text: '并发编程',
  icon: 'flat-color-icons:parallel-tasks',
  dir: __dirname,
};

export default config;
