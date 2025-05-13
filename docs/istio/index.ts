import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/istio': [
      {
        children: [
          '/istio/docs/basic.md',
          '/istio/docs/principle.md',
          '/istio/docs/trafficManagement.md',
          '/istio/docs/installation.md',
          '/istio/docs/examples.md',
        ],
        text: 'Istio',
      },
    ],
  },
  navbar: {
    text: 'Istio',
    link: '/istio',
    group: '云相关',
    icon: 'simple-icons:istio',
  },
};

export default config;
