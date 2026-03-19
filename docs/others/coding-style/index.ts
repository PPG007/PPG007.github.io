import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['start.md', 'alibaba_java.md', 'html.md', 'css.md', 'javascript.md'],
    },
  ],
  text: 'Coding Style',
  icon: 'vscode-icons:file-type-style',
  dir: __dirname,
};

export default config;
