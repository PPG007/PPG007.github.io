import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'meta.md',
        'URL.md',
        'element_attributes.md',
        'semantic_structure.md',
        'text.md',
        'list.md',
        'image.md',
        'link.md',
        'multimedia.md',
        'table.md',
        'form.md',
        'other.md',
      ],
    },
  ],
  text: 'HTML',
  icon: 'devicon:html5',
  dir: __dirname,
};

export default config;
