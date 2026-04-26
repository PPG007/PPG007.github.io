import { GroupConfig } from '@/types';
import basic from './basic';

const config: GroupConfig = {
  text: 'Python',
  icon: 'logos:python',
  dir: __dirname,
  children: [basic],
};

export default config;
