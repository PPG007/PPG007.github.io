import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'init_main.md',
        'variable.md',
        'const.md',
        'under_line.md',
        'int.md',
        'float.md',
        'complex.md',
        'bool.md',
        'string.md',
        'array.md',
        'slice.md',
        'pointer.md',
        'map.md',
        'process_control.md',
        'function.md',
        'struct.md',
        'method.md',
        'interface.md',
        'type_convert.md',
        'generics.md',
        'io.md',
        'time.md',
        'concurrent_programming.md',
        'standard_libs.md',
        'reflect.md',
        'redis.md',
        'mongodb.md',
        'module.md',
        'traps.md',
        'web.md',
        'pprof.md',
      ],
    },
  ],
  text: 'Go',
  icon: 'devicon:go',
  dir: __dirname,
};

export default config;
