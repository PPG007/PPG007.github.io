import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/yii': [
      {
        children: [
          '/yii/docs/start.md',
          '/yii/docs/structure.md',
          '/yii/docs/request.md',
          '/yii/docs/concepts.md',
          '/yii/docs/database.md',
          '/yii/docs/formatting.md',
          '/yii/docs/restful.md',
        ],
        text: 'Yii',
      },
    ],
  },
  navbar: {
    text: 'Yii',
    link: '/yii',
    group: 'PHP',
    icon: 'logos:yii',
  },
};

export default config;
