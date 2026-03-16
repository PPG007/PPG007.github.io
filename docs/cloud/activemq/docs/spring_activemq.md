# Spring 整合 ActiveMQ

## 导入依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.3.6</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.springframework/spring-jms -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jms</artifactId>
    <version>5.3.9</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.activemq/activemq-pool -->
<dependency>
    <groupId>org.apache.activemq</groupId>
    <artifactId>activemq-pool</artifactId>
    <version>5.16.3</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.12.4</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.activemq/activemq-all -->
<dependency>
    <groupId>org.apache.activemq</groupId>
    <artifactId>activemq-all</artifactId>
    <version>5.16.3</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.xbean/xbean-spring -->
<dependency>
    <groupId>org.apache.xbean</groupId>
    <artifactId>xbean-spring</artifactId>
    <version>4.20</version>
</dependency>
```

## 编写配置

```java
@Configuration
@ComponentScan(basePackages = "service")
public class Config {

    @Bean
    public PooledConnectionFactory connectionFactory(){
        PooledConnectionFactory pooledConnectionFactory = new PooledConnectionFactory();
        pooledConnectionFactory.setConnectionFactory(mqConnectionFactory());
        pooledConnectionFactory.setMaxConnections(100);
        return pooledConnectionFactory;
    }

    private ActiveMQConnectionFactory mqConnectionFactory(){
        ActiveMQConnectionFactory mqConnectionFactory = new ActiveMQConnectionFactory();
        mqConnectionFactory.setBrokerURL("tcp://150.158.153.216:61616");
        return mqConnectionFactory;
    }

    @Bean
    public ActiveMQQueue queue(){
//        设置队列名字
        return new ActiveMQQueue("springActiveMQQueue-PPG");
    }

    @Bean
    public ActiveMQTopic topic(){
//        设置主题名字
        return new ActiveMQTopic("springActiveMQTopic-PPG");
    }

    @Bean
    public JmsTemplate jmsTemplate(){
        JmsTemplate jmsTemplate = new JmsTemplate();
//        设置连接工厂
        jmsTemplate.setConnectionFactory(connectionFactory());
//        设置默认目的地
        jmsTemplate.setDefaultDestination(queue());
//        设置消息转换器
        jmsTemplate.setMessageConverter(new SimpleMessageConverter());
        return jmsTemplate;
    }

    @Bean
    public DefaultMessageListenerContainer messageListenerContainer(){
        DefaultMessageListenerContainer messageListenerContainer = new DefaultMessageListenerContainer();
        messageListenerContainer.setConnectionFactory(connectionFactory());
        messageListenerContainer.setDestination(queue());
        messageListenerContainer.setSessionTransacted(true);
        messageListenerContainer.setMessageListener((MessageListener) message -> {

            if (message instanceof TextMessage) {
                TextMessage textMessage = (TextMessage) message;
                try {
                    System.out.println(textMessage.getText());
                }catch (Exception e){
                    e.printStackTrace();
                }
            }throw new RuntimeException();
        });
        return messageListenerContainer;
    }

}
```

在Spring中使用ActiveMQ步骤：

- 创建 ActiveMQ 的连接工厂，设置 URL。
- 创建池化连接工厂，传入上面的 ActiveMQ 连接工厂，设置最大连接数等参数，注册到容器。
- 创建队列或主题，注册到容器。
- 配置 JmsTemplate 指定连接工厂、默认目的地、消息转换器等其他配置，注册到容器。
- 配置消息监听器，指明监听器使用的连接工厂与监听的目的地，注入容器。

## 使用队列

### 发送端

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    JmsTemplate jmsTemplate = annotationConfigApplicationContext.getBean(JmsTemplate.class);
    jmsTemplate.send(session -> session.createTextMessage("扎不多得嘞"));
    System.out.println("send success");
}
```

由于配置类中默认目的地就是队列，所以此处不需要指定。

### 接收端

调用 receive 方法进行读取。

```java
public static void main(String[] args) throws JMSException {
    AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    JmsTemplate jmsTemplate = annotationConfigApplicationContext.getBean(JmsTemplate.class);
    TextMessage receive = (TextMessage) jmsTemplate.receive();
    System.out.println(receive.getText());
}
```

## 使用主题

### 发送端

通过 `setDefaultDestination` 方法指定目的地，或者使用 `convertAndSend` 的重载方法指定目的地。

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(Config.class);
    JmsTemplate jmsTemplate = context.getBean(JmsTemplate.class);
    ActiveMQTopic topic = context.getBean(ActiveMQTopic.class);
    jmsTemplate.setDefaultDestination(topic);
    jmsTemplate.convertAndSend("随着经济的发展，蚌埠住的人越来越多了");
}
```

### 接收端

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(Config.class);
    JmsTemplate jmsTemplate = context.getBean(JmsTemplate.class);
    ActiveMQTopic topic = context.getBean(ActiveMQTopic.class);
    jmsTemplate.setDefaultDestination(topic);
    System.out.println(jmsTemplate.receiveAndConvert());
}
```

## 持久化

队列默认持久化。

主题模式中，配置消息监听器，进行订阅。

```java
@Bean
public DefaultMessageListenerContainer messageListenerContainer(){
    DefaultMessageListenerContainer messageListenerContainer = new DefaultMessageListenerContainer();
    messageListenerContainer.setConnectionFactory(connectionFactory());
    messageListenerContainer.setDestination(topic());
    messageListenerContainer.setSessionTransacted(true);
    messageListenerContainer.setSubscriptionDurable(true);
    messageListenerContainer.setClientId("test");
    messageListenerContainer.setDurableSubscriptionName("123");
    messageListenerContainer.setMessageListener((MessageListener) message -> {

        if (message instanceof TextMessage) {
            TextMessage textMessage = (TextMessage) message;
            try {
                System.out.println(textMessage.getText());
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    });
    return messageListenerContainer;
}
```

不论主题的发送方是否设置持久化，消息监听器都会收到离线时的消息，同样要要先运行一次执行订阅操作。

## 事务

Spring 提供了一个 JmsTransactionManager 用于对 JMS ConnectionFactory 做事务管理。这将允许 JMS 应用利用 Spring 的事务管理特性。

使用消息监听器时，配置其 `sessionTransacted` 属性为 true 即可开启事务，如果 listener 中出现异常，自动回滚。
