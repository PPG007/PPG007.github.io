import { GroupConfig } from '@doc-types';
import go from './go';
import gin from './gin';
import grpc from './grpc-protobuf';

const config: GroupConfig = {
  text: 'Golang',
  icon: 'logos:go',
  children: [go, gin, grpc],
  dir: __dirname,
};

export default config;
