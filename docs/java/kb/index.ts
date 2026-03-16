import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'execution_order_in_extend.md',
        'transfer.md',
        'interface_and_abstract_class.md',
        'is_like_has.md',
        'ternary_operator.md',
        'switch_param.md',
        'thread_local.md',
        'jvm_data.md',
        'index_design.md',
        'mysql_lock.md',
        'transaction.md',
        'mysql_index.md',
      ],
    },
  ],
  text: 'Java 知识点',
  icon: 'hugeicons:knowledge-02',
  dir: __dirname,
};

export default config;
