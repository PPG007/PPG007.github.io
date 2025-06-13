import { NavbarGroup } from '../types';

const groups: Array<NavbarGroup> = [
  {
    text: '前端',
    icon: 'devicon-plain:devicon',
    childrenOrder: [
      'HTML',
      'CSS',
      'JavaScript',
      'ES6',
      'Axios',
      'Vue 2.X',
      'Vue 3',
      'TypeScript',
      'Koa',
      'i18next',
      'React',
      'Dart',
    ],
  },
  {
    text: 'Java',
    icon: 'material-icon-theme:java',
    childrenOrder: [
      'Java IO',
      'Java 注解和反射',
      'Java 多线程',
      'Java 网络通信',
      'Java 知识点',
      'Mybatis',
      'Netty',
      'Spring',
      'SpringMVC',
      'SpringBoot',
      'Dubbo',
      'SpringCloud',
    ],
  },
  {
    text: 'Go',
    icon: 'logos:go',
    childrenOrder: ['Go', 'Gin', 'gRPC&Protobuf'],
  },
  {
    text: 'PHP',
    icon: 'skill-icons:php-dark',
    childrenOrder: ['PHP', 'Yii', 'Laravel'],
  },
  {
    text: '云相关',
    icon: 'hugeicons:cloud-server',
    childrenOrder: [
      'Linux',
      'Docker',
      'ActiveMQ',
      'RocketMQ',
      'ZooKeeper',
      'OpenSSL',
      '域名获取及 CA 认证',
      'Kubernetes',
      'Istio',
    ],
  },
  {
    text: '数据库',
    icon: 'iconoir:database-tag-solid',
  },
  {
    text: 'others',
    icon: 'material-icon-theme:folder-other',
  },
];

export default groups;
