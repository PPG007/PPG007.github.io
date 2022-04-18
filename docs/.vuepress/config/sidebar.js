const html = require('../../html/index.js')
const css = require('../../css/index.js')
const javascript = require('../../javascript/index.js')
const vue2 = require('../../vue2/index.js')
const vue3 = require('../../vue3/index.js')
const es6 = require('../../es6/index.js')
const axios = require('../../axios/index.js')
const go = require('../../go/index.js')
const gin = require('../../gin/index.js')
const gRPCAndProtobuf = require('../../grpc-and-protobuf/index.js')
const mongodb = require('../../mongodb/index.js')
const git = require('../../git/index.js')
const cleanCode = require('../../clean-code/index.js')
const vscode = require('../../vscode/index.js')
const spring = require('../../spring/index.js')
const springmvc = require('../../SpringMVC/index.js')
const springboot = require('../../SpringBoot/index.js')
const activemq = require('../../activemq/index.js')
const codingstyle = require('../../codingstyle/index.js')
const markdown = require('../../markdown/index.js')
const restful = require('../../restful/index.js')
const javaio = require('../../javaio/index.js')
const dubbo = require('../../dubbo/index.js')
const regex = require('../../regex/index.js')
const zookeeper = require('../../zookeeper/index.js')
const mybatis = require('../../mybatis/index.js')
const javanet = require('../../javanet/index.js')
const docker = require('../../docker/index.js')
const javaknowledge = require('../../javaknowledge/index.js')
const springcloud = require('../../SpringCloud/index.js')
const javathread = require('../../javathread')
const annotationAndReflection = require('../../annotation-and-reflection/index.js')
const redis = require('../../redis/index.js')
const designPattern = require('../../design-pattern/index.js')
const netty = require('../../netty/index.js')
const ubuntu2004Init = require('../../ubuntu-20.04-init/index.js')
const domain = require('../../domain/index.js')
const dart = require('../../dart/index.js')
const openwrt = require('../../openwrt/index.js')
const kubernetes = require('../../kubernetes/index.js')
const istio = require('../../istio/index.js')
const openssl = require('../../openssl/index.js')

const Sidebar = {
  ...html.HTMLSidebar,
  ...css.CssSidebar,
  ...javascript.JavaScriptSidebar,
  ...vue2.Vue2Sidebar,
  ...es6.ES6Sidebar,
  ...vue3.Vue3Sidebar,
  ...axios.AxiosSidebar,
  ...go.GoSidebar,
  ...gRPCAndProtobuf.gRPCAndProtobufSidebar,
  ...gin.GinSidebar,
  ...mongodb.MongoDBSidebar,
  ...git.GitSidebar,
  ...cleanCode.CleanCodeSidebar,
  ...vscode.VsCodeSidebar,
  ...spring.SpringSidebar,
  ...springmvc.SpringMVCSidebar,
  ...springboot.SpringBootSidebar,
  ...activemq.AvtiveMQSidebar,
  ...codingstyle.CodingStyleSidebar,
  ...markdown.MarkdownSidebar,
  ...restful.RestfulSidebar,
  ...javaio.JavaIOSidebar,
  ...dubbo.DubboSidebar,
  ...regex.RegexSidebar,
  ...zookeeper.ZooKeeperSidebar,
  ...mybatis.MybatisSidebar,
  ...javanet.JavaNetSidebar,
  ...docker.DockerSidebar,
  ...javaknowledge.JavaKnowledgeSidebar,
  ...springcloud.SpringCloudSidebar,
  ...javathread.JavaThreadSidebar,
  ...annotationAndReflection.AnnotationReflectionSidebar,
  ...redis.RedisSidebar,
  ...designPattern.DesignPatternSidebar,
  ...netty.NettySidebar,
  ...ubuntu2004Init.Ubuntu2004InitSidebar,
  ...domain.DomainSidebar,
  ...dart.DartSidebar,
  ...openwrt.OpenWrtSidebar,
  ...kubernetes.KubernetesSidebar,
  ...istio.IstioSidebar,
  ...openssl.OpenSSLSidebar,
}

module.exports.Sidebar = Sidebar
