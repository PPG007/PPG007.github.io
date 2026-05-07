import { GroupConfig } from '@/types';
import basic from './basic';
import fastapi from './fastapi';

const config: GroupConfig = {
  text: 'Python',
  icon: 'logos:python',
  dir: __dirname,
  children: [basic, fastapi],
};

export default config;
