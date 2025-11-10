import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/ubuntu-init': [
      {
        children: [
          '/ubuntu-init/docs/git.md',
          '/ubuntu-init/docs/vscode.md',
          '/ubuntu-init/docs/zsh.md',
          '/ubuntu-init/docs/go.md',
          '/ubuntu-init/docs/php.md',
          '/ubuntu-init/docs/protoc.md',
          '/ubuntu-init/docs/mongodb.md',
          '/ubuntu-init/docs/redis.md',
          '/ubuntu-init/docs/java.md',
          '/ubuntu-init/docs/maven.md',
          '/ubuntu-init/docs/postman.md',
          '/ubuntu-init/docs/docker.md',
          '/ubuntu-init/docs/nodejs.md',
          '/ubuntu-init/docs/nginx.md',
          '/ubuntu-init/docs/mysql.md',
          '/ubuntu-init/docs/python.md',
          '/ubuntu-init/docs/sogou_input.md',
          '/ubuntu-init/docs/dart-flutter.md',
          '/ubuntu-init/docs/debian-wifi.md',
          '/ubuntu-init/docs/others.md',
          '/ubuntu-init/docs/rtc.md',
        ],
        text: 'Ubuntu Init',
      },
    ],
  },
  navbar: {
    text: 'Ubuntu Init',
    link: '/ubuntu-init',
    group: 'others',
    icon: 'logos:ubuntu',
  },
};

export default config;
