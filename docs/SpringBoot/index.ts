import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/SpringBoot': [
      {
        children: [
          '/SpringBoot/docs/auto_config.md',
          '/SpringBoot/docs/config.md',
          '/SpringBoot/docs/web.md',
          '/SpringBoot/docs/thymeleaf.md',
          '/SpringBoot/docs/mvc_config.md',
          '/SpringBoot/docs/i18n.md',
          '/SpringBoot/docs/jdbc.md',
          '/SpringBoot/docs/druid.md',
          '/SpringBoot/docs/mybatis.md',
          '/SpringBoot/docs/spring_security.md',
          '/SpringBoot/docs/shiro.md',
          '/SpringBoot/docs/async.md',
          '/SpringBoot/docs/mail.md',
          '/SpringBoot/docs/cron.md',
        ],
        text: 'Spring Boot',
      },
    ],
  },
  navbar: {
    text: 'SpringBoot',
    link: '/SpringBoot',
    group: 'Java',
  },
};

export default config;
