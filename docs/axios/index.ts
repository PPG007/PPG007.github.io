import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/axios': [
      {
        text: 'Axios',
        children: [
          '/axios/docs/start.md',
          '/axios/docs/common_apis.md',
          '/axios/docs/response_process.md',
          '/axios/docs/interceptor.md',
          '/axios/docs/default_settings.md',
          '/axios/docs/cancel_request.md',
        ],
      },
    ],
  },
  navbar: {
    text: 'Axios',
    link: '/axios',
    group: '前端',
    icon: 'material-icon-theme:http',
  },
};

export default config;
