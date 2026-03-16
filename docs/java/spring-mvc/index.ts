import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'servlet.md',
        'controller.md',
        'json.md',
        'ajax.md',
        'file.md',
        'filter.md',
        'ssm.md',
        'java_config.md',
        'others.md',
      ],
    },
  ],
  text: 'SpringMVC',
  icon: 'logos:spring-icon',
  dir: __dirname,
};

export default config;
