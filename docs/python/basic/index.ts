import { BarConfig } from '@/types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['types.md', 'operator.md', 'flow.md', 'function.md', 'oop.md'],
    },
  ],
  text: 'Python 基础',
  icon: 'material-icon-theme:python',
  dir: __dirname,
  devMode: true,
};

export default config;
