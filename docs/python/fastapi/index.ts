import { BarConfig } from '@/types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['start.md', 'params.md'],
    },
  ],
  text: 'FastAPI',
  icon: 'devicon:fastapi',
  dir: __dirname,
  devMode: true,
};

export default config;
