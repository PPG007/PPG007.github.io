import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/domain': [
      {
        children: ['/domain/docs/domain.md', '/domain/docs/ca.md'],
        text: '域名申请及 CA 认证',
      },
    ],
  },
  navbar: {
    text: '域名获取及 CA 认证',
    link: '/domain',
    group: '云相关',
  },
};

export default config;
