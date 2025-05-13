import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/javathread': [
      {
        children: [
          '/javathread/docs/basic.md',
          '/javathread/docs/function_interface.md',
          '/javathread/docs/synchronized.md',
          '/javathread/docs/thread_method.md',
          '/javathread/docs/thread_pool.md',
          '/javathread/docs/lock.md',
          '/javathread/docs/collection.md',
          '/javathread/docs/lock_case.md',
          '/javathread/docs/util.md',
          '/javathread/docs/rwlock.md',
          '/javathread/docs/block_queue.md',
          '/javathread/docs/fork_join.md',
          '/javathread/docs/async_callback.md',
          '/javathread/docs/jmm_volatile.md',
          '/javathread/docs/singleton.md',
          '/javathread/docs/cas.md',
          '/javathread/docs/atomic.md',
          '/javathread/docs/spin.md',
        ],
        text: 'Java 多线程',
      },
    ],
  },
  navbar: {
    text: 'Java 多线程',
    link: '/javathread',
    group: 'Java',
    icon: 'flat-color-icons:parallel-tasks',
  },
};

export default config;
