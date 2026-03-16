import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['basic.md', 'principle.md', 'trafficManagement.md', 'installation.md', 'examples.md'],
    },
  ],
  text: 'Istio',
  icon: 'simple-icons:istio',
  dir: __dirname,
};

export default config;
