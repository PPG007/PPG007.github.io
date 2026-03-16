import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'start.md',
        'ioc.md',
        'hello_spring.md',
        'ioc_create_object.md',
        'spring_config.md',
        'di.md',
        'autowired.md',
        'annotation.md',
        'java_config.md',
        'proxy.md',
        'aop.md',
        'mybatis.md',
        'transaction.md',
      ],
    },
  ],
  text: 'Spring',
  icon: 'devicon:spring-wordmark',
  dir: __dirname,
};

export default config;
