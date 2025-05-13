import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/SpringMVC': [
      {
        children: [
          '/SpringMVC/docs/servlet.md',
          '/SpringMVC/docs/controller.md',
          '/SpringMVC/docs/json.md',
          '/SpringMVC/docs/ajax.md',
          '/SpringMVC/docs/file.md',
          '/SpringMVC/docs/filter.md',
          '/SpringMVC/docs/ssm.md',
          '/SpringMVC/docs/java_config.md',
          '/SpringMVC/docs/others.md',
        ],
        text: 'Spring MVC',
      },
    ],
  },
  navbar: {
    text: 'SpringMVC',
    link: '/SpringMVC',
    group: 'Java',
    icon: 'logos:spring-icon',
  },
};

export default config;
