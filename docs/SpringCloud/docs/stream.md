# Stream

Stream 支持 RabbitMQ 和 Kafka。

## 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
</dependency>
```

## 消息生产者

修改配置文件：

::: tip
如果使用下面的配置方式配置 RabbitMQ，且如果 RabbitMQ 不在本地，程序将进行两次连接，第一次连接到远程服务器的消息队列，第二次连接本地消息队列，如果本地没有消息队列，则会抛出异常，要解决这个问题请参考消息消费者的配置方法。
:::

```yaml
server:
  port: 8801
spring:
  application:
    name: stream-provider
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
          environment:
            spring:
              rabbitmq:
                host: 192.168.3.14
                port: 5672
                username: rabbitmq
                password: ${spring.cloud.stream.binders.defaultRabbit.environment.spring.rabbitmq.username}
      bindings:
        output:
          destination: exchangeDemo
          content-type: application/json
          # binder: defaultRabbit 加不加没啥影响

eureka:
  client:
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
  instance:
    prefer-ip-address: true
    ip-address: 127.0.0.1
    non-secure-port: 8801
```

编写业务实现类：

```java
@EnableBinding({Source.class})
public class MessageProviderImpl implements IMessageProvider {


    @Autowired
    private MessageChannel output;

    @Override
    public String send(String message) {
        output.send(MessageBuilder.withPayload(message).build());
        return null;
    }
}
```

然后编写 controller 进行访问即可。

## 消息消费者

编写配置文件：

::: tip
将消息队列连接配置移到 spring 下就不会出现重连两次的问题。
:::

```yaml
server:
  port: 8802
spring:
  rabbitmq:
    host: 192.168.3.14
    port: 5672
    username: rabbitmq
    password: ${spring.rabbitmq.username}
  application:
    name: stream-consumer
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
      bindings:
        input:
          destination: exchangeDemo
          content-type: application/json
#          binder: defaultRabbit

eureka:
  client:
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
  instance:
    prefer-ip-address: true
    ip-address: 127.0.0.1
    non-secure-port: 8802
```

编写消息消费类：

```java
@EnableBinding(Sink.class)
@Component
public class ReceiveController {

    @Value("${server.port}")
    private String port;

    @StreamListener(Sink.INPUT)
    public void input(Message<String> message){
        System.out.println("消费者1号收到消息---------->"+message.getPayload()+"\t 端口号："+port);

    }
}
```

## 解决重复消费问题

通过*分组*实现解决重复消费问题。

::: tip分组
发送一条消息，同一个分组内的所有消费者中只有一个能消费这条消息，不同分组可以重复消费。
:::

修改消费者配置文件，指定分组：

```yaml
spring:
  rabbitmq:
    host: 192.168.3.14
    port: 5672
    username: rabbitmq
    password: ${spring.rabbitmq.username}
  application:
    name: stream-consumer
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
      bindings:
        input:
          destination: exchangeDemo
          content-type: application/json
          group: ppg
```

## 消息持久化

如果不显示指定分组，在消费者下线期间产生的消息不会被这个消费者消费，如果指定了分组，那么下线期间产生的消息也会被消费。
