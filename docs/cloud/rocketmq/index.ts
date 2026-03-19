import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['basic.md', 'features.md', 'start.md', 'examples-java.md'],
    },
  ],
  text: 'RocketMQ',
  icon: 'simple-icons:apacherocketmq',
  dir: __dirname,
};

export default config;
