import { BarConfig } from '@doc-types';

const config: BarConfig = {
  text: 'Axios',
  icon: 'material-icon-theme:http',
  sidebars: [
    {
      children: [
        'start.md',
        'common_apis.md',
        'response_process.md',
        'interceptor.md',
        'default_settings.md',
        'cancel_request.md',
      ],
    },
  ],
  dir: __dirname,
};

export default config;
