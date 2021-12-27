# SpringBoot 整合 ActiveMQ

## 导入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.4.5</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>2.4.5</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
    <version>2.4.5</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>2.4.5</version>
</dependency>
```

## 编写配置文件

```yaml
server:
  port: 8848
spring:
  activemq:
    broker-url: tcp://150.158.153.216:61616
    user: admin
    password: admin
  jms:
  	#设置为false表示使用队列，否则表示使用主题
    pub-sub-domain: false

queueName: SpringBootQueue
topicName: SpringBootTopic
```

## 启动类修改

在主启动类上添加 `@EnableJms` 注解。

## 使用队列

SpringBoot中 使用 JmsMessagingTemplate 完成操作。

### 发送端

```java
@SpringBootTest(classes = SpringBootStarter.class)
public class MyTest {

    @Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;

    @Autowired
    private Queue queue;//自定义一个队列对象


    @Test
    public void sender() {
        jmsMessagingTemplate.convertAndSend(queue,"蚌埠住了");
    }
}
```

### 接收端

```java
System.out.println(jmsMessagingTemplate.receiveAndConvert("SpringBootQueue",String.class));
```

### 设置监听器

注册一个组件，在方法上添加 `@JmsListener` 注解并制定目的地，template 会监听消息。

```java
@Component
public class Receiver {
    @JmsListener(destination = "${queueName}")
    public void receive(Message message) throws JMSException {
        if (message instanceof TextMessage){
            TextMessage textMessage = (TextMessage) message;
            System.out.println(textMessage.getText());
        }
    }
}
```

## 使用主题

### 修改配置

```yaml
jms:
  pub-sub-domain: true
```

### 发送端

与队列用法一致。

```java
public void send(){
    jmsMessagingTemplate.convertAndSend(topic,"主题");
}
```

### 接收端

接收端同样使用注解创建监听器。

```java
@JmsListener(destination = "${topicName}")
public void topicReceive(Message message) throws JMSException {
    if (message instanceof TextMessage){
        TextMessage textMessage = (TextMessage) message;
        System.out.println(textMessage.getText());
    }
}
```
