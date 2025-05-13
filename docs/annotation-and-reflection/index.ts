import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/annotation-and-reflection': [
      {
        text: '注解和反射',
        children: [
          '/annotation-and-reflection/docs/builtin_annotation.md',
          '/annotation-and-reflection/docs/meta_annotation.md',
          '/annotation-and-reflection/docs/annotation_attribute.md',
          '/annotation-and-reflection/docs/annotation_nature.md',
          '/annotation-and-reflection/docs/annotation_field_type.md',
          '/annotation-and-reflection/docs/annotation_field_set.md',
          '/annotation-and-reflection/docs/get_annotation_attribute.md',
          '/annotation-and-reflection/docs/annotation_set_param.md',
          '/annotation-and-reflection/docs/class.md',
          '/annotation-and-reflection/docs/reflection_method.md',
          '/annotation-and-reflection/docs/classloader.md',
        ],
      },
    ],
  },
  navbar: {
    text: 'Java 注解和反射',
    link: '/annotation-and-reflection',
    group: 'Java',
    icon: 'devicon:java',
  },
};

export default config;
