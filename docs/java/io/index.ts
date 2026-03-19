import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'reader_writer.md',
        'buffer.md',
        'convert.md',
        'stdio.md',
        'print_stream.md',
        'data_stream.md',
        'object_stream.md',
        'random_file.md',
      ],
    },
  ],
  text: 'Java IO',
  icon: 'oui:input-output',
  dir: __dirname,
};

export default config;
