import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/openwrt': [
      {
        children: [
          '/openwrt/docs/singleEth.md',
          '/openwrt/docs/vmware.md',
          '/openwrt/docs/doubleEth.md',
          '/openwrt/docs/smartDNS.md',
        ],
        text: '搭建软路由',
      },
    ],
  },
  navbar: {
    text: '搭建软路由',
    link: '/openwrt',
    group: 'others',
    icon: 'cbi:openwrt-logo',
  },
};

export default config;
