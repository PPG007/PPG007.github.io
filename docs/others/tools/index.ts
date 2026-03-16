import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'uuid.md',
        'objectId.md',
        'time.md',
        'base64.md',
        'url.md',
        'tax.md',
        'pointDistance.md',
        'json.md',
        'jwt.md',
        'ocr.md',
        'crypto.md',
      ],
    },
  ],
  text: '在线工具',
  icon: 'fa-solid:tools',
  dir: __dirname,
};

export default config;
