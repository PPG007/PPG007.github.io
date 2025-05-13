import { BarConfig } from "../.vuepress/types";

const config: BarConfig = {
  sidebar: {
    '/tools': [
      {
        text: '工具',
        children: [
          '/tools/docs/uuid.md',
          '/tools/docs/objectId.md',
        ]
      }
    ]
  },
  navbar: {
    text: '在线工具',
    link: '/tools',
    group: '在线工具'
  }
}

export default config;
