import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['start.md', 'structure.md', 'request.md', 'concepts.md', 'database.md', 'formatting.md', 'restful.md'],
    },
  ],
  text: 'Yii',
  icon: 'logos:yii',
  dir: __dirname,
};

export default config;
