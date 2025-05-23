import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/ubuntu-20.04-init': [
      {
        children: [
          '/ubuntu-20.04-init/docs/git.md',
          '/ubuntu-20.04-init/docs/vscode.md',
          '/ubuntu-20.04-init/docs/zsh.md',
          '/ubuntu-20.04-init/docs/go.md',
          '/ubuntu-20.04-init/docs/php.md',
          '/ubuntu-20.04-init/docs/protoc.md',
          '/ubuntu-20.04-init/docs/mongodb.md',
          '/ubuntu-20.04-init/docs/redis.md',
          '/ubuntu-20.04-init/docs/java.md',
          '/ubuntu-20.04-init/docs/maven.md',
          '/ubuntu-20.04-init/docs/postman.md',
          '/ubuntu-20.04-init/docs/docker.md',
          '/ubuntu-20.04-init/docs/nodejs.md',
          '/ubuntu-20.04-init/docs/nginx.md',
          '/ubuntu-20.04-init/docs/mysql.md',
          '/ubuntu-20.04-init/docs/python.md',
          '/ubuntu-20.04-init/docs/sogou_input.md',
          '/ubuntu-20.04-init/docs/dart-flutter.md',
          '/ubuntu-20.04-init/docs/debian-wifi.md',
          '/ubuntu-20.04-init/docs/others.md',
          '/ubuntu-20.04-init/docs/rtc.md',
        ],
        text: 'Ubuntu20.04 Init',
      },
    ],
  },
  navbar: {
    text: 'Ubuntu20.04 Init',
    link: '/ubuntu-20.04-init',
    group: 'others',
    icon: 'logos:ubuntu',
  },
};

export default config;
