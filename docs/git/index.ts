import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/git': [
      {
        children: [
          '/git/docs/start.md',
          '/git/docs/basic.md',
          '/git/docs/remote.md',
          '/git/docs/branch.md',
          '/git/docs/tag.md',
          '/git/docs/customize.md',
          '/git/docs/code_review.md',
        ],
        text: 'Git',
      },
    ],
  },
  navbar: {
    text: 'Git',
    link: '/git',
    group: 'others',
    icon: 'devicon:git',
  },
};

export default config;
