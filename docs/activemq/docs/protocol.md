# ActiveMQ 传输协议

![image-20210821130437502](/ActiveMQ/image-20210821130437502.png)

## TCP 协议 （默认）

默认 Broker 协议，默认端口 61616。

在进行网络传输前，必须要序列化数据，消息是通过一个 wire protocol 来序列化成字节流即 openwire。

tcp 优点：

- 传输可靠性高，稳定性强。
- 高效性，字节流方式传递，效率很高。
- 有效性、可用性：应用广泛，支持任何平台。

TCP 协议可以在 URL 中携带配置参数，具体参考：

[TCP协议可选参数](https://activemq.apache.org/tcp-transport-reference)

## NIO 协议

NIO 协议更侧重于底层的访问操作。它允许开发人员对同一资源可有更多的 client 调用和服务端有更多的负载。

适合使用 NIO 协议的场景：

- 可能有大量的 Client 去连接到 Broker 上,一般情况下,大量的 Client 去连接 Broker 是被操作系统的线程所限制的。因此,NIO 的实现比 TCP 需要更少的线程去运行,所以建议使用 NIO 协议。
- 可能对于 Broker 有一个很迟钝的网络传输,NIO 比 TCP 提供更好的性能。

[NIO配置](https://activemq.apache.org/nio-transport-reference)

## AMQP 协议

AMQP（高级消息队列协议）是一个网络协议。它支持符合要求的客户端应用（application）和消息中间件代理（messaging middleware broker）之间进行通信。

## stomp 协议

简单(流)文本定向消息协议，它提供了一个可互操作的连接格式，允许 STOMP 客户端与任意 STOMP 消息代理（Broker）进行交互。STOMP 协议由于设计简单，易于开发客户端，因此在多种语言和多种平台上得到广泛地应用。

## SSL 协议

安全套接层。是由 Netscape 公司于 1990 年开发，用于保障 Word Wide Web（WWW）通讯的安全。主要任务是提供**私密性，信息完整性和身份认证**。SSL 是一个不依赖于平台和运用程序的协议，位于 TCP/IP 协议与各种应用层协议之间，为数据通信提高安全支持。

## mqtt 协议

MQTT（Message Queuing Telemetry Transport，消息队列遥测传输协议），是一种基于发布/订阅（publish/subscribe）模式的"轻量级"通讯协议，该协议构建于 TCP/IP 协议上，由 IBM 在 1999 年发布。MQTT 最大优点在于，可以以极少的代码和有限的带宽，为连接远程设备提供实时可靠的消息服务。作为一种低开销、低带宽占用的即时通讯协议，使其在物联网、小型设备、移动应用等方面有较广泛的应用。

## ws 协议

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

## NIO编码示例

修改 ActiveMQ 配置文件 `activemq.xml`，添加：

```xml
<transportConnector name="nio" uri="nio://0.0.0.0:61615?trace=true"/>
```

修改发送与接收 url：

```java
private static final String URL="nio://150.158.153.216:61615";
```

其他代码无需改动。

## NIO 加强

让一个端口既支持 NIO 网络 IO 模型又支持多个协议，以上配置还是 NIO+TCP，如果要修改成 NIO+TCP/MQTT……需要使用 `auto`。

修改 ActiveMQ 配置文件 `activemq.xml`：

```xml
<transportConnector name="auto+nio" uri="auto+nio://0.0.0.0:61615?trace=true"/>
```

这样，在进行访问时，对于 61615 端口，既可以使用 nio 协议，也可以使用 TCP 协议。

```java
private static final String URL="nio://150.158.153.216:61615";
private static final String URL="tcp://150.158.153.216:61615";
```
