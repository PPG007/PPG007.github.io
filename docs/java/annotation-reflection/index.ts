import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'builtin_annotation.md',
        'meta_annotation.md',
        'annotation_attribute.md',
        'annotation_nature.md',
        'annotation_field_type.md',
        'annotation_field_set.md',
        'get_annotation_attribute.md',
        'annotation_set_param.md',
        'class.md',
        'reflection_method.md',
        'classloader.md',
      ],
    },
  ],
  text: '注解和反射',
  icon: 'devicon:java',
  dir: __dirname,
};

export default config;
