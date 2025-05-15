import { BarConfig } from '../.vuepress/types';
const config: BarConfig = {
  sidebar: {
    '/tools': [
      {
        children: [
          '/tools/docs/uuid.md',
          '/tools/docs/objectId.md',
          '/tools/docs/time.md',
          '/tools/docs/base64.md',
          '/tools/docs/url.md',
          '/tools/docs/tax.md',
          '/tools/docs/pointDistance.md',
          '/tools/docs/json.md',
          '/tools/docs/ocr.md',
          '/tools/docs/crypto.md',
        ],
        text: '在线工具',
      },
    ],
  },
  navbar: {
    text: '在线工具',
    link: '/tools',
    group: 'others',
    icon: 'fa-solid:tools',
  },
}

export default config;
