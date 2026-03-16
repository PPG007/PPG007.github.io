import { GroupConfig } from '@doc-types';
import sql from './sql';
import redis from './redis';
import mongodb from './mongodb';
import elasticsearch from './elasticsearch';

const config: GroupConfig = {
  text: '数据库',
  icon: 'iconoir:database-tag-solid',
  children: [sql, redis, mongodb, elasticsearch],
  dir: __dirname,
};

export default config;
