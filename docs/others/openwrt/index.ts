import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['singleEth.md', 'vmware.md', 'doubleEth.md', 'smartDNS.md'],
    },
  ],
  text: '搭建软路由',
  icon: 'cbi:openwrt-logo',
  dir: __dirname,
};

export default config;
