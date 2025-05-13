import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/grpc-and-protobuf': [
      {
        children: [
          '/grpc-and-protobuf/docs/protobuf/protoFile.md',
          '/grpc-and-protobuf/docs/protobuf/installAndComplie.md',
          '/grpc-and-protobuf/docs/protobuf/customTag.md',
          '/grpc-and-protobuf/docs/protobuf/styleGuide.md',
        ],
        text: 'Protobuf',
      },
      {
        children: [
          '/grpc-and-protobuf/docs/grpc/start.md',
          '/grpc-and-protobuf/docs/grpc/unary.md',
          '/grpc-and-protobuf/docs/grpc/serverStream.md',
          '/grpc-and-protobuf/docs/grpc/clientStream.md',
          '/grpc-and-protobuf/docs/grpc/bothStream.md',
          '/grpc-and-protobuf/docs/grpc/metadataAndInterceptor.md',
          '/grpc-and-protobuf/docs/grpc/tls.md',
          '/grpc-and-protobuf/docs/grpc/loadBalance.md',
          '/grpc-and-protobuf/docs/grpc/gateway.md',
          '/grpc-and-protobuf/docs/grpc/validate.md',
        ],
        text: 'gRPC',
      },
    ],
  },
  navbar: {
    text: 'gRPC&Protobuf',
    link: '/grpc-and-protobuf',
    group: 'Go',
  },
};

export default config;
