import { GroupConfig } from '@doc-types';
import php from './php';
import yii from './yii';
import laravel from './laravel';

const config: GroupConfig = {
  text: 'PHP',
  icon: 'skill-icons:php-dark',
  children: [php, yii, laravel],
  dir: __dirname,
};

export default config;
