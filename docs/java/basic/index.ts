import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['types.md', 'operator.md', 'flow.md', 'oop.md', 'common-class.md'],
    },
  ],
  text: 'Java 基础',
  icon: 'logos:java',
  devMode: true,
  dir: __dirname,
};

export default config;
