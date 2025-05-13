import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/javaio': [
      {
        children: [
          '/javaio/docs/reader_writer.md',
          '/javaio/docs/buffer.md',
          '/javaio/docs/convert.md',
          '/javaio/docs/stdio.md',
          '/javaio/docs/print_stream.md',
          '/javaio/docs/data_stream.md',
          '/javaio/docs/object_stream.md',
          '/javaio/docs/random_file.md',
        ],
        text: 'Java IO',
      },
    ],
  },
  navbar: {
    text: 'Java IO',
    link: '/javaio',
    group: 'Java',
  },
};

export default config;
