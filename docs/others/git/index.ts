import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['start.md', 'basic.md', 'remote.md', 'branch.md', 'tag.md', 'customize.md', 'code_review.md'],
    },
  ],
  text: 'Git',
  icon: 'devicon:git',
  dir: __dirname,
};

export default config;
