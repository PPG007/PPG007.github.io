import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: ['protoFile.md', 'installAndComplie.md', 'customTag.md', 'styleGuide.md'],
      text: 'Protobuf',
      prefix: 'protobuf',
      icon: 'vscode-icons:file-type-protobuf',
    },
    {
      children: [
        'start.md',
        'unary.md',
        'serverStream.md',
        'clientStream.md',
        'bothStream.md',
        'metadataAndInterceptor.md',
        'tls.md',
        'loadBalance.md',
        'gateway.md',
        'validate.md',
      ],
      text: 'gRPC',
      prefix: 'grpc',
      icon: 'devicon:grpc',
    },
  ],
  text: 'gRPC&Protobuf',
  icon: 'material-icon-theme:google',
  dir: __dirname,
};

export default config;
