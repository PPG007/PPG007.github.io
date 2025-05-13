import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/openssl': [
      {
        text: 'OpenSSL',
        children: ['/openssl/docs/basic.md', '/openssl/docs/commands.md', '/openssl/docs/ca.md'],
      },
    ],
  },
  navbar: {
    text: 'OpenSSL',
    link: '/openssl',
    group: '云相关',
    icon: 'fa-brands:expeditedssl',
  },
};

export default config;
