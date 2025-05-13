import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/go': [
      {
        children: [
          '/go/docs/init_main.md',
          '/go/docs/variable.md',
          '/go/docs/const.md',
          '/go/docs/under_line.md',
          '/go/docs/int.md',
          '/go/docs/float.md',
          '/go/docs/complex.md',
          '/go/docs/bool.md',
          '/go/docs/string.md',
          '/go/docs/array.md',
          '/go/docs/slice.md',
          '/go/docs/pointer.md',
          '/go/docs/map.md',
          '/go/docs/process_control.md',
          '/go/docs/function.md',
          '/go/docs/struct.md',
          '/go/docs/method.md',
          '/go/docs/interface.md',
          '/go/docs/type_convert.md',
          '/go/docs/generics.md',
          '/go/docs/io.md',
          '/go/docs/time.md',
          '/go/docs/concurrent_programming.md',
          '/go/docs/standard_libs.md',
          '/go/docs/reflect.md',
          '/go/docs/redis.md',
          '/go/docs/mongodb.md',
          '/go/docs/module.md',
          '/go/docs/traps.md',
          '/go/docs/web.md',
          '/go/docs/pprof.md',
        ],
        text: 'Go',
      },
    ],
  },
  navbar: {
    text: 'Go',
    link: '/go',
    group: 'Go',
  },
};

export default config;
