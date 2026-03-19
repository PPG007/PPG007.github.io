import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'auto_config.md',
        'config.md',
        'web.md',
        'thymeleaf.md',
        'mvc_config.md',
        'i18n.md',
        'jdbc.md',
        'druid.md',
        'mybatis.md',
        'spring_security.md',
        'shiro.md',
        'async.md',
        'mail.md',
        'cron.md',
      ],
    },
  ],
  text: 'SpringBoot',
  icon: 'simple-icons:springboot',
  dir: __dirname,
};

export default config;
