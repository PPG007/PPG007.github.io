import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['domain.md', 'ca.md'],
    },
  ],
  text: '域名获取及 CA 认证',
  icon: 'stash:domain',
  dir: __dirname,
};

export default config;
