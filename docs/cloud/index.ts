import { GroupConfig } from '@doc-types';
import activemq from './activemq';
import rocketmq from './rocketmq';
import docker from './docker';
import domain from './domain';
import linux from './linux';
import zookeeper from './zookeeper';
import openssl from './openssl';
import kubernetes from './kubernetes';
import istio from './istio';

const config: GroupConfig = {
  text: '云相关',
  icon: 'hugeicons:cloud-server',
  children: [linux, docker, domain, openssl, activemq, rocketmq, zookeeper, kubernetes, istio],
  dir: __dirname,
};

export default config;
