import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'environment.md',
        'spring.md',
        'config_tag.md',
        'finish_config.md',
        'springboot.md',
        'config_rule.md',
        'high_availability.md',
      ],
    },
  ],
  text: 'Dubbo',
  icon: 'streamline:interface-arrows-data-transfer-diagonal-arrows-arrow-server-data-diagonal-internet-transfer-network',
  dir: __dirname,
};

export default config;
