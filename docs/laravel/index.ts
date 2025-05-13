import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/laravel': [
      {
        children: ['/laravel/docs/start.md', '/laravel/docs/concepts.md', '/laravel/docs/deploy.md'],
        text: 'Laravel',
      },
    ],
  },
  navbar: {
    text: 'Laravel',
    link: '/laravel',
    group: 'PHP',
    icon: 'skill-icons:laravel-light',
  },
};
export default config;
