import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'git.md',
        'vscode.md',
        'zsh.md',
        'go.md',
        'php.md',
        'protoc.md',
        'mongodb.md',
        'redis.md',
        'java.md',
        'maven.md',
        'postman.md',
        'docker.md',
        'nodejs.md',
        'nginx.md',
        'mysql.md',
        'python.md',
        'sogou_input.md',
        'dart-flutter.md',
        'debian-wifi.md',
        'others.md',
        'rtc.md',
      ],
    },
  ],
  text: 'Ubuntu Init',
  icon: 'logos:ubuntu',
  dir: __dirname,
};

export default config;
