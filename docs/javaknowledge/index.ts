import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/javaknowledge': [
      {
        children: [
          '/javaknowledge/docs/execution_order_in_extend.md',
          '/javaknowledge/docs/transfer.md',
          '/javaknowledge/docs/interface_and_abstract_class.md',
          '/javaknowledge/docs/is_like_has.md',
          '/javaknowledge/docs/ternary_operator.md',
          '/javaknowledge/docs/switch_param.md',
          '/javaknowledge/docs/thread_local.md',
          '/javaknowledge/docs/jvm_data.md',
          '/javaknowledge/docs/index_design.md',
          '/javaknowledge/docs/mysql_lock.md',
          '/javaknowledge/docs/transaction.md',
          '/javaknowledge/docs/mysql_index.md',
        ],
        text: '',
      },
    ],
  },
  navbar: {
    text: 'Java 知识点',
    link: '/javaknowledge',
    group: 'Java',
    icon: 'hugeicons:knowledge-02',
  },
};

export default config;
