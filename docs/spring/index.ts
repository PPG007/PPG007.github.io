import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/spring': [
      {
        children: [
          '/spring/docs/start.md',
          '/spring/docs/ioc.md',
          '/spring/docs/hello_spring.md',
          '/spring/docs/ioc_create_object.md',
          '/spring/docs/spring_config.md',
          '/spring/docs/di.md',
          '/spring/docs/autowired.md',
          '/spring/docs/annotation.md',
          '/spring/docs/java_config.md',
          '/spring/docs/proxy.md',
          '/spring/docs/aop.md',
          '/spring/docs/mybatis.md',
          '/spring/docs/transaction.md',
        ],
        text: 'Spring',
      },
    ],
  },
  navbar: {
    text: 'Spring',
    link: '/spring',
    group: 'Java',
    icon: 'devicon:spring-wordmark',
  },
};

export default config;
