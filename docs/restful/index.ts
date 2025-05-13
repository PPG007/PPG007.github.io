import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/restful': [
      {
        children: ['/restful/docs/three_level.md', '/restful/docs/design.md', '/restful/docs/others.md'],
        text: 'Restful API',
      },
    ],
  },
  navbar: {
    text: 'Restful API',
    link: '/restful',
    group: 'others',
    icon: 'material-symbols:http',
  },
};

export default config;
