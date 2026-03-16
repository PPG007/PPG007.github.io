import { BarConfig } from '@doc-types';

const config: BarConfig = {
  text: 'CSS',
  icon: 'skill-icons:css',
  sidebars: [
    {
      children: [
        'selector.md',
        'color.md',
        'background.md',
        'border.md',
        'box_model.md',
        'outline.md',
        'text.md',
        'font.md',
        'link.md',
        'layout.md',
        'flex.md',
        'pseudo-element.md',
        'pseudo_class.md',
      ],
    },
  ],
  dir: __dirname,
};

export default config;
