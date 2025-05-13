import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/html': [
      {
        children: [
          '/html/docs/meta.md',
          '/html/docs/URL.md',
          '/html/docs/element_attributes.md',
          '/html/docs/semantic_structure.md',
          '/html/docs/text.md',
          '/html/docs/list.md',
          '/html/docs/image.md',
          '/html/docs/link.md',
          '/html/docs/multimedia.md',
          '/html/docs/table.md',
          '/html/docs/form.md',
          '/html/docs/other.md',
        ],
        text: 'HTML',
      },
    ],
  },
  navbar: {
    text: 'HTML',
    link: '/html',
    group: '前端',
    icon: 'devicon:html5',
  },
};

export default config;
