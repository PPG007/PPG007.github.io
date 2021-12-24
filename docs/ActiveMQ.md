# ActiveMQ

ActiveMQ功能配置文档：[ActiveMQ Feature](https://activemq.apache.org/features)

## 基本概念

### 什么是 MQ

消息队列就是一个转发器，且实现了异步非阻塞与解耦合，消费者不再需要直接面对生产者，也就是说，消息队列解决的还是生产者、消费者的通信问题。

![img](/ActiveMQ/v2-c38c2609bee9a1f9a638a38ef503d604_1440w.jpg)

### 消息队列模型的演化

::: tip
架构从来不是设计出来的，而是演进而来的。
:::

#### 队列模型

![img](/ActiveMQ/v2-7dfb814e3963cb9cdfdada13f64c703a_1440w.jpg)

这便是队列模型：它允许多个生产者往同一个队列发送消息。但是，如果有多个消费者，实际上是竞争的关系，也就是一条消息只能被其中一个消费者接收到，读完即被删除。

#### 发布-订阅模型

![img](/ActiveMQ/v2-b05d98e0c85c49fe366ff7f159f6fa91_1440w.jpg)

在发布-订阅模型中，存放消息的容器变成了 “主题”，订阅者在接收消息之前需要先 “订阅主题”。最终，每个订阅者都可以收到同一个主题的全量消息。生产者就是发布者，队列就是主题，消费者就是订阅者，无本质区别。唯一的不同点在于：一份消息数据是否可以被多次消费。

### MQ 的应用场景

#### MQ 与 RPC

![img](/ActiveMQ/v2-f9793a436f5983c7bac2c9cc7d7abfdb_1440w.jpg)

- 引入 MQ 后，由之前的一次 RPC 变成了现在的两次 RPC，而且生产者只跟队列耦合，它根本无需知道消费者的存在。
- 多了一个中间节点*队列*进行消息转储，相当于将同步变成了**异步**。

#### 举例：订单支付场景

![img](/ActiveMQ/v2-b0b81fcf533970cd71d23a85ec266e5b_1440w.jpg)

未引入消息队列前，订单支付需要一步一步的调用其他系统完成处理，引入MQ后，只需要聚焦于更新订单状态这一个流程即可，其他事务由MQ通知其他系统，这就完成了**解耦**，而且后续对业务再进行拓展也不涉及订单系统。

### MQ 的三大目标

- **系统解耦**：当新模块加入时，可以做到代码改动最小
- **削峰**：让后端系统按照自身吞吐能力进行消费，不被冲垮
- **异步**：将非关键调用链路的操作异步化并提升系统吞吐能力

### MQ 的关注点

- 发送和接收。
- 高可用。
- 集群和容错。
- 持久化。
- 延时发送/定时投递。
- 签收机制。

## Linux 中部署 ActiveMQ

### 安装并启动 ActiveMQ

下载对应压缩包：

[ActiveMQ](https://activemq.apache.org/components/classic/download/)

在 Linux 中解压并进入解压后的目录，进入其中的 bin 文件夹(首先需要安装 Java 环境)：

```shell
#启动
./activemq start
#重启
./activemq restart
#停止
./activemq stop
#查看状态
./activemq status
```

后台进程默认端口：`61616`。

控制台默认端口：`8161`，用户名：`admin`，密码：`admin`。

### 控制台访问

修改 conf 文件夹中的 `jetty.xml`，注释掉 `127.0.0.1` 才能使用公网访问：

```xml
<bean id="jettyPort" class="org.apache.activemq.web.WebConsolePort" init-method="start">
    <!-- the default port number for the web console -->
    <!--
    <property name="host" value="127.0.0.1"/>
	-->
    <property name="port" value="8161"/>
</bean>
```

## Java 编码实现 MQ 通讯(Queue)

一对一模型中目的地称为队列 Queue。

### 依赖

```xml
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
<!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-api -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.32</version>
</dependency>
<!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-classic -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.5</version>
    <scope>test</scope>
</dependency>
<!-- https://mvnrepository.com/artifact/junit/junit -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
<!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.20</version>
    <scope>provided</scope>
</dependency>
```

### 发送端

```java
private static final String URL="tcp://150.158.153.216:61616";

public static void main(String[] args) throws JMSException {
    //        创建连接工厂并传入URL
    ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
    //        建立连接
    Connection connection = activeMQConnectionFactory.createConnection();
    //        开启连接
    connection.start();
    //        创建会话
    Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
    //        点对点通信创建queue
    Queue queue = session.createQueue("ppg");
    //        创建这个queue对应的消息发送对象
    MessageProducer producer = session.createProducer(queue);
    //        循环发送三次消息
    for (int i = 0; i < 3; i++) {
        //            创建一个消息对象
        TextMessage textMessage = session.createTextMessage("msg--->" + i);
        //            发送消息
        producer.send(textMessage);
    }
    //        先开后关
    producer.close();
    session.close();
    connection.close();
}
```

### 接收端

```java
private static final String URL="tcp://150.158.153.216:61616";

public static void main(String[] args) throws JMSException {
    //        创建连接工厂并传入URL
    ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
    //        建立连接
    Connection connection = activeMQConnectionFactory.createConnection();
    //        开启连接
    connection.start();
    //        创建会话
    Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
    //        点对点通信创建queue
    Queue queue = session.createQueue("ppg");
    //        创建消费者
    MessageConsumer consumer = session.createConsumer(queue);
    while (true){
        //            接收与发送的类型要一致
        TextMessage receive = (TextMessage) consumer.receive();
        if (receive!=null){
            System.out.println("收到消息-->"+receive.getText());
        }else {
            break;
        }
    }
    //        先开后关
    consumer.close();
    session.close();
    connection.close();
}
```

查看 ActiveMQ 控制台：

![image-20210819143010106](/ActiveMQ/image-20210819143010106.png)

点击上方 Queues 进入 queue 队列的监控界面，name 表示 queue 的名字，此后紧跟着待消费的消息数量、已连接的消费者数量、消息入队数量、消息出队数量。

#### 接收端设置接收延迟，短阻塞

```java
TextMessage receive = (TextMessage) consumer.receive(1000);
```

#### MessageListener 消息监听器

```java
consumer.setMessageListener(message -> {

    try {
        TextMessage textMessage = (TextMessage) message;
        System.out.println("收到"+textMessage.getText());
    } catch (JMSException e) {
        e.printStackTrace();
    }
});
System.in.read();
```

## 消费者三大消费情况(Queue)

### 先生产，只启动一个消费者

毫无疑问，唯一的消费者会接收所有的消息。

### 先生产，先启动一个消费者再启动另一个消费者

第一个消费者先把消息消耗完毕，第二个消费者什么也没收到。

### 先启动两个消费者，再生产

两个消费者在生产后都能收到消息，若有 n 条消息，则每个消费者都能收到 n/2 条。

如果 n 是偶数，先启动的消费者会多一条，如果消费者不下线又来了奇数条消息，则和为偶数，仍然均分。

## Java 操作 Topic

一对多模型(发布订阅)中目的地称为主题 Topic。

### 消息生产者

```java
private static final String URL="tcp://150.158.153.216:61616";

public static void main(String[] args) throws JMSException, IOException {
    //        创建连接工厂并传入URL
    ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
    //        建立连接
    Connection connection = activeMQConnectionFactory.createConnection();
    //        开启连接
    connection.start();
    //        创建会话
    Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
    //        创建Topic
    Topic topic = session.createTopic("ppg007");
    MessageProducer producer = session.createProducer(topic);
    for (int i = 0; i < 5; i++) {
        producer.send(session.createTextMessage("第"+i+"次蚌埠住了"));
    }
    //        先开后关
    producer.close();
    session.close();
    connection.close();
}
```

### 消息消费者

```java
private static final String URL="tcp://150.158.153.216:61616";

private static final int INDEX=3;

public static void main(String[] args) throws JMSException, IOException {
    //        创建连接工厂并传入URL
    ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
    //        建立连接
    Connection connection = activeMQConnectionFactory.createConnection();
    //        开启连接
    connection.start();
    //        创建会话
    Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
    Topic topic = session.createTopic("ppg007");
    MessageConsumer consumer = session.createConsumer(topic);
    consumer.setMessageListener(message -> {
        try {
            System.out.println("服务端["+INDEX+"]收到消息："+ ((TextMessage) message).getText());
        } catch (JMSException e) {
            e.printStackTrace();
        }
    });
    System.in.read();
    //        先开后关
    consumer.close();
    session.close();
    connection.close();
}
```

先启动三个消费者，再启动生产者，所有的消费者都能收到全部的消息。

### Topic 与 Queue 的区别

- 队列可以先发布消息，再由消费者调用，消费者可以收到此前发布的消息，主题如果先发布消息再调用会导致消费者无法收到此前发布的消息，即此前的消息变成了废消息。
- 主题模式是无状态的，队列模式中数据会在 MQ 服务器上以文件形式保存，也可以配置成数据库存储。
- 队列不会丢弃消息，主题会丢弃消息(如果没有订阅者的话)。
- 主题工作在*订阅-发布*模式，如果没有订阅者，消息会被丢掉，如果有多个订阅者，则所有的订阅者都能收到所有的消息，队列工作在*负载均衡*模式，如果当前没有消费者，消息也不会丢弃，如果有多个消费者，一条消息只会发送给一个消费者，并且要求消费者 ACK 信息。
- 主题模式中，由于消息要按照订阅者的数量进行复制,所以处理性能会随着订阅者的增加而明显降低,并且还要结合不同消息协议自身的性能差异。
- 队列模式中，由于一条消息只发送给一个消费者,所以就算消费者再多,性能也不会有明显降低,当然不同消息协议的具体性能也是有差异的。

## JMS

### 什么是 JMS

JMS（JAVA Message Service,java消息服务）API 是一个消息服务的标准或者说是规范，允许应用程序组件基于 JavaEE 平台创建、发送、接收和读取消息。它使分布式通信耦合度更低，消息服务更加可靠以及异步性。

::: tip
JMS是java的消息服务，JMS的客户端之间可以通过JMS服务进行异步的消息传输。
:::

### JMS 四大元素

#### JMS provider

实现 JMS 接口和规范的消息中间件，即 MQ 服务器。

#### JMS producer

消息生产者，创建、发送 JMS 消息的客户端应用。

#### JMS consumer

消息消费者，接收和处理 JMS 消息的客户端应用。

#### JMS message

##### 消息头

- JMSDestination 目的地。
- JMSDeliveryMode 持久和非持久，持久模式中如果 JMS provider 出现故障，消息不会丢失，服务器恢复后再次传递。
- JMSExpiration 过期时间。
- JMSPriority 优先级，加急消息优先于普通消息。
- JMSMessageID。

```java
TextMessage textMessage = session.createTextMessage("第" + i + "次蚌埠住了");
textMessage.setJMSExpiration(1000);
textMessage.setJMSDeliveryMode(Message.DEFAULT_DELIVERY_MODE);
textMessage.setJMSPriority(Message.DEFAULT_PRIORITY);
producer.send(textMessage);
```

##### 消息体

- 封装具体的消息数据。
- 5种消息体格式：
    - TextMessage 普通字符串消息，包含一个String。
    - MapMessage 一个 Map 类型消息 key 为 String，value 为 Java 基本类型。
    - BytesMessage 二进制数组，包含一个 byte[]。
    - StreamMessage Java 数据流消息，用标准流操作来顺序的填充和读取。
    - ObjectMessage 对象消息，包含一个可序列化的 Java 对象。
- 发送和接收的消息体类型必须一致。

##### 发送方

```java
for (int i = 0; i < 5; i++) {
    TextMessage textMessage = session.createTextMessage("第" + i + "次蚌埠住了");
    producer.send(textMessage);

    MapMessage mapMessage = session.createMapMessage();
    mapMessage.setString("string","字符串消息");
    mapMessage.setInt("int",1);
    mapMessage.setDouble("double",2.3);
    mapMessage.setBoolean("boolean",false);
    producer.send(mapMessage);

    BytesMessage bytesMessage = session.createBytesMessage();
    bytesMessage.writeBytes("随着经济发展，蚌埠住的人越来越多了".getBytes(StandardCharsets.UTF_8));
    producer.send(bytesMessage);

    StreamMessage streamMessage = session.createStreamMessage();
    streamMessage.writeString("天怎么突然晴了，原来是你把我给整无雨了");
    producer.send(streamMessage);

    ObjectMessage objectMessage = session.createObjectMessage();
    objectMessage.setObject(new User(1,"PPG"));
    producer.send(objectMessage);
}
```

##### 接收方

```java
consumer.setMessageListener(message -> {
    try {
        if (message instanceof TextMessage){
            TextMessage textMessage = (TextMessage) message;
            System.out.println("消费者收到字符串消息：\n"+textMessage.getText());
        }else if (message instanceof MapMessage){
            MapMessage mapMessage = (MapMessage) message;
            System.out.println("消费者收到map消息：");
            System.out.println("String"+mapMessage.getString("string"));
            System.out.println("int"+mapMessage.getInt("int"));
            System.out.println("double"+mapMessage.getDouble("double"));
            System.out.println("boolean"+mapMessage.getBoolean("boolean"));
        }else if (message instanceof BytesMessage){
            BytesMessage bytesMessage = (BytesMessage) message;
            System.out.println("消费者收到字节消息：");
            byte[] buffer = new byte[10];
            int len;
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            while ((len=bytesMessage.readBytes(buffer))!=-1){
                byteArrayOutputStream.write(buffer,0,len);
            }
            System.out.println(new String(byteArrayOutputStream.toByteArray(), 0, byteArrayOutputStream.size(), StandardCharsets.UTF_8));
        }else if (message instanceof StreamMessage){
            StreamMessage streamMessage = (StreamMessage) message;
            System.out.println("消费者收到Stream流消息：");
            System.out.println(streamMessage.readString());
        }else if (message instanceof ObjectMessage){
            System.out.println("消费者收到对象消息：");
            ObjectMessage objectMessage = (ObjectMessage) message;
            User user = (User) objectMessage.getObject();
            System.out.println(user);
        }
        System.out.println("===================================================");
    }catch (Exception e){
        e.printStackTrace();
    }
});
```

##### 消息属性

- 如果需要除消息头字段以外的值,那么可以使用消息属性。
- 识别/去重/重点标注等操作非常有用的方法。
- 是属性名、属性值的键值对形式。

### JMS 的可靠性

#### PRESISTENT 持久性

##### 队列持久性

::: tip
队列的情况下默认持久化。
:::

持久化：

```java
producer.setDeliveryMode(DeliveryMode.PERSISTENT);
```

非持久化：

```java
producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
```

##### 主题持久性

发送端：

先设置持久化后再调用`connection.start()`方法。

```java
private static final String URL="tcp://150.158.153.216:61616";

public static void main(String[] args) throws JMSException {
    ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
    Connection connection = activeMQConnectionFactory.createConnection();
    Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);

    Topic topic = session.createTopic("persist");
    MessageProducer producer = session.createProducer(topic);
    producer.setDeliveryMode(DeliveryMode.PERSISTENT);
    connection.start();
    for (int i = 0; i < 3; i++) {
        TextMessage textMessage = session.createTextMessage("随着经济发展，蚌埠住的人越来越多了");
        producer.send(textMessage);
    }
    System.out.println("send complete");
    producer.close();
    session.close();
    connection.close();
}
```

消费者：

首先设置一个客户端 ID，然后不再使用 consumer 而是 subscriber 订阅者，就像是订阅了某个公众号，这样持久化的消息会在客户端可用时推送。

::: warning 注意
要先运行过一次订阅成功才能实现接收过去的持久化消息
:::

```java
private static final String URL="tcp://150.158.153.216:61616";

public static void main(String[] args) throws JMSException, IOException {
    ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
    Connection connection = activeMQConnectionFactory.createConnection();
    connection.setClientID("ppg");//ID需要唯一
    Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
    Topic topic = session.createTopic("persist");
    TopicSubscriber subscriber = session.createDurableSubscriber(topic, "demo");
    connection.start();
    subscriber.setMessageListener((message -> {
        if (message instanceof TextMessage){
            TextMessage textMessage = (TextMessage) message;
            try {
                System.out.println("消费者收到："+textMessage.getText());
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }));
    System.in.read();
    subscriber.close();
    session.close();
    connection.close();
}
```

#### 事务

```java
Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
```

对于生产者来说，如果第一个设置为false即不开启事务，只要执行send，消息就进入队列；如果设置为true即开启了事务，先执行send再执行commit才能将消息提交到队列中

```java
session.commit();
session.rollback();
```

对于消费者来说，如果第一个设置为 false 即不开启事务，只要执行接收，消息就出队列；如果设置为 true 即开启了事务，如果接收完毕不执行 commit，被消费的消息不会出队列，导致一条消息多次消费。

#### Acknowledge 签收

##### 非事务模式

- 自动签收(默认)：

```java
Session.AUTO_ACKNOWLEDGE
```

- 手动签收：

```java
Session.CLIENT_ACKNOWLEDGE
```

消费者要主动签收，否则同样存在多次消费的问题：

```java
textMessage.acknowledge();
```

- 允许重复消息：

```java
Session.DUPS_OK_ACKNOWLEDGE
```

不必必须签收，消息可能会重复发送。在第二次重新传递消息的时候，消息头的 JmsDelivered 会被置为 true 标示当前消息已经传送过一次，客户端需要进行消息的重复处理控制。类似 auto ack, 自动批量确认消息,具有延迟发送 ack 的特点,ActiveMq 内部实现积累一定数量自动确认。

##### 事务模式

开启事务后，是否签收取决于事务是否 commit。

##### 事务与签收的关系

- 在事务性会话中,当一个事务被成功提交则消息被自动签收。如果事务回滚,则消息会被再次传送。
- 非事务性会话中,消息何时被确认取决于创建会话时的应答模式

## ActiveMQ 的 Broker

### 什么是 Broker

相当于一个 ActiveMQ 实例。

Broker 其实就是实现了用代码的形式启动 ActiveMQ 将 MQ 嵌入到 Java 代码中，以便随时启动。

### 指定 ActiveMQ 使用的配置文件

```shell
./activemq start xbean:file/root/apache-activemq-5.16.3/conf/activemq.xml
```

### 嵌入式Broker

在上面依赖的基础上再导入 jackson。

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.12.4</version>
</dependency>
```

编写 Broker 启动程序：

```java
public class InsideBroker {
    public static void main(String[] args) throws Exception {
        BrokerService brokerService = new BrokerService();
        brokerService.setUseJmx(true);
//        指定绑定到的位置，填写本机ip
        brokerService.addConnector("tcp://localhost:61616");
//        启动
        brokerService.start();
//        在结束前阻塞，否则会立即结束
        brokerService.waitUntilStopped();

    }
}
```

## Spring 整合 ActiveMQ

### 导入依赖

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

### 编写配置

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

### 使用队列

#### 发送端

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    JmsTemplate jmsTemplate = annotationConfigApplicationContext.getBean(JmsTemplate.class);
    jmsTemplate.send(session -> session.createTextMessage("扎不多得嘞"));
    System.out.println("send success");
}
```

由于配置类中默认目的地就是队列，所以此处不需要指定。

#### 接收端

调用 receive 方法进行读取。

```java
public static void main(String[] args) throws JMSException {
    AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    JmsTemplate jmsTemplate = annotationConfigApplicationContext.getBean(JmsTemplate.class);
    TextMessage receive = (TextMessage) jmsTemplate.receive();
    System.out.println(receive.getText());
}
```

### 使用主题

#### 发送端

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

#### 接收端

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(Config.class);
    JmsTemplate jmsTemplate = context.getBean(JmsTemplate.class);
    ActiveMQTopic topic = context.getBean(ActiveMQTopic.class);
    jmsTemplate.setDefaultDestination(topic);
    System.out.println(jmsTemplate.receiveAndConvert());
}
```

### 持久化

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

### 事务

Spring 提供了一个 JmsTransactionManager 用于对 JMS ConnectionFactory 做事务管理。这将允许 JMS 应用利用 Spring 的事务管理特性。

使用消息监听器时，配置其 `sessionTransacted` 属性为 true 即可开启事务，如果 listener 中出现异常，自动回滚。

## SpringBoot 整合 ActiveMQ

### 导入依赖

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

### 编写配置文件

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

### 启动类修改

在主启动类上添加 `@EnableJms` 注解。

### 使用队列

SpringBoot中 使用 JmsMessagingTemplate 完成操作。

#### 发送端

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

#### 接收端

```java
System.out.println(jmsMessagingTemplate.receiveAndConvert("SpringBootQueue",String.class));
```

#### 设置监听器

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

### 使用主题

#### 修改配置

```yaml
jms:
  pub-sub-domain: true
```

#### 发送端

与队列用法一致。

```java
public void send(){
    jmsMessagingTemplate.convertAndSend(topic,"主题");
}
```

#### 接收端

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

## ActiveMQ 传输协议

![image-20210821130437502](/ActiveMQ/image-20210821130437502.png)

### TCP 协议 （默认）

默认 Broker 协议，默认端口 61616。

在进行网络传输前，必须要序列化数据，消息是通过一个 wire protocol 来序列化成字节流即 openwire。

tcp 优点：

- 传输可靠性高，稳定性强。
- 高效性，字节流方式传递，效率很高。
- 有效性、可用性：应用广泛，支持任何平台。

TCP 协议可以在 URL 中携带配置参数，具体参考：

[TCP协议可选参数](https://activemq.apache.org/tcp-transport-reference)

### NIO 协议

NIO 协议更侧重于底层的访问操作。它允许开发人员对同一资源可有更多的 client 调用和服务端有更多的负载。

适合使用 NIO 协议的场景：

- 可能有大量的 Client 去连接到 Broker 上,一般情况下,大量的 Client 去连接 Broker 是被操作系统的线程所限制的。因此,NIO 的实现比 TCP 需要更少的线程去运行,所以建议使用 NIO 协议。
- 可能对于 Broker 有一个很迟钝的网络传输,NIO 比 TCP 提供更好的性能。

[NIO配置](https://activemq.apache.org/nio-transport-reference)

### AMQP 协议

AMQP（高级消息队列协议）是一个网络协议。它支持符合要求的客户端应用（application）和消息中间件代理（messaging middleware broker）之间进行通信。

### stomp 协议

简单(流)文本定向消息协议，它提供了一个可互操作的连接格式，允许 STOMP 客户端与任意 STOMP 消息代理（Broker）进行交互。STOMP 协议由于设计简单，易于开发客户端，因此在多种语言和多种平台上得到广泛地应用。

### SSL 协议

安全套接层。是由 Netscape 公司于 1990 年开发，用于保障 Word Wide Web（WWW）通讯的安全。主要任务是提供**私密性，信息完整性和身份认证**。SSL 是一个不依赖于平台和运用程序的协议，位于 TCP/IP 协议与各种应用层协议之间，为数据通信提高安全支持。

### mqtt 协议

MQTT（Message Queuing Telemetry Transport，消息队列遥测传输协议），是一种基于发布/订阅（publish/subscribe）模式的"轻量级"通讯协议，该协议构建于 TCP/IP 协议上，由 IBM 在 1999 年发布。MQTT 最大优点在于，可以以极少的代码和有限的带宽，为连接远程设备提供实时可靠的消息服务。作为一种低开销、低带宽占用的即时通讯协议，使其在物联网、小型设备、移动应用等方面有较广泛的应用。

### ws 协议

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

### NIO编码示例

修改 ActiveMQ 配置文件 `activemq.xml`，添加：

```xml
<transportConnector name="nio" uri="nio://0.0.0.0:61615?trace=true"/>
```

修改发送与接收 url：

```java
private static final String URL="nio://150.158.153.216:61615";
```

其他代码无需改动。

### NIO 加强

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

## ActiveMQ 持久化

为了避免意外宕机以后丢失信息,需要做到重启后可以恢复消息队列,消息系统一般都会采用持久化机制。

ActiveMQ 的消息持久化机制有 JDBC,AMQ, KahaDB 和 LeveIDB,无论使用哪种持久化方式,消息的存储逻辑都是一致的。
就是在发送者将消息发送出去后,消息中心首先将消息存储到本地数据文件、内存数据库或者远程数据库等再试图将消息发送给接收
者,成功则将消息从存储中删除,失败则继续尝试发送。
消息中心启动以后首先要检査指定的存储位置,如果有未发送成功的消息,则需要把消息发送出去。

### AMQ

AMQ 是一种文件存储形式,它具有写入速度快和容易恢复的特点。消息存储在一个个文件中,文件的默认大小为 32M,当一个存储文件中的消息已经全部被消费,那么这个文件将被标识为可删除,在下一个清除阶段,这个文件被删除。AMQ 适用于 ActiveMQ5.3 之前的版本。

### KahaDB

基于日志文件,从 ActiveMQ5.4 开始默认的持久化插件。
消息存储使用一个*事务日志*和仅仅用一个*索引文件*来存储它所有的地址。KahaDB 是一个专门针对消息持久化的解决方案,它对典型的消息使用模式进行了优化，数据被追加到 data logs 中。当不再需要 log 文件中的数据的时候 log 文件会被丢弃。

KahaDB 的文件组成：

- db-i.log：kahaDB 存储消息到预定义大小的数据记录文件中,文件命名为 db-i.log。当数据文件已满时,一个新的文件会随之创建, i数值也会随之递增,它随着消息数量的增多,如每 32M 一个文件,文件名按照数字进行编号,如 db-1.log、db-2.log、db-3.log…。当不再有引用到数据文件中的任何消息时,文件会被删除或归档。
- db.data：该文件包含了持久化的 BTree索引,索引了消息数据记录中的消息,它是消息的索引文件,本质上是 B-Tree(B树),使用 B-Tree 作为索引指向 `db-< Number>.log` 里面存储的消息。
- db. free：当前 db.data 文件里哪些页面是空闲的,文件具体内容是所有空闲页的ID。
- db.redo：用来进行消息恢复，如果 KahaDB 消息存储在强制退出后启动，用于恢复BTree索引。
- lock：文件锁，表示当前获取 KahaDB 读写权限的 Broker。

KahaDB配置：[KahaDB](https://activemq.apache.org/kahadb)

### JDBC

#### 配置 ActiveMQ

将 `mysql-connector-java-8.0.21.jar` MySQL Java 驱动包存放到 ActiveMQ 的 lib 文件夹中。

修改 conf 目录下的 `activemq.xml`，将默认 KahaDB 注释，添加 jdbc 标签 dataSource 指定为接下来要创建的 bean 的 id。

默认情况下，启动 ActiveMQ 之后会自动创建表，如果在 jdbc 标签中指定 `createTableOnStartup` 为 false 将不会自动创建表，这个属性默认值为 true。

```xml
<persistenceAdapter>
<!--<kahaDB directory="${activemq.data}/kahadb"/>-->
	<jdbcPersistenceAdapter dataSource="#mysql"/>
</persistenceAdapter>
```

创建数据源bean：

在 `</broker>` 结束标签后添加：

```xml
<bean id="mysql" class="org.apache.commons.dbcp2.BasicDataSource" destroy-method="close">
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://39.107.112.172:3306/mq?relaxAutoCommit=true&amp;erverTimezone=UTC"/>
    <property name="username" value="root"/>
    <property name="password" value="123456"/>
    <property name="poolPreparedStatements" value="true"/>
</bean>
```

::: warning 注意
注意在xml文件中特殊字符的替换。
:::

- `&` 替换为 `&amp;`
- `>` 替换为 `&gt;`
- `<` 替换为 `&lt;`
- `"` 替换为 `&quot;`
- `'` 替换为 `&apos;`

::: warning 注意
后面的分号要加上去！
:::

#### 三个表说明

- ACTIVEMQ_MSGS：

```sql
create table ACTIVEMQ_MSGS
(
    ID         bigint       not null
        primary key,
    CONTAINER  varchar(250) not null,
    MSGID_PROD varchar(250) null,
    MSGID_SEQ  bigint       null,
    EXPIRATION bigint       null,
    MSG        blob         null,
    PRIORITY   bigint       null,
    XID        varchar(250) null
);
```

ID：数据库主键。

CONTAINER：消息的目的地。

MSGID_PROD：消息发送者的主键。

MSGID_SEQ：发送消息的顺序，MSGID_PROD+MSGID_SEQ 可以组成 JMS 的 MessageID。

EXPIRATION：消息的过期时间，存储的是 1970-01-01 到指定时间的毫秒数。

MSG：消息本体的 Java 序列化对象的二进制数据。

PRIORITY：优先级，从 0-9，数值越大优先级越高。

![image-20210821161810221](/ActiveMQ/image-20210821161810221.png)

队列模式中，如果 DeliveryMode 设置为 NON_PERSISTENT，发送的消息只会存储在内存中，如果设置为 PERSISTENT 则会存储在数据库表中，消费完成后会从表中删除。

- ACTIVEMQ_ACKS：

```sql
create table ACTIVEMQ_ACKS
(
    CONTAINER     varchar(250)     not null,
    SUB_DEST      varchar(250)     null,
    CLIENT_ID     varchar(250)     not null,
    SUB_NAME      varchar(250)     not null,
    SELECTOR      varchar(250)     null,
    LAST_ACKED_ID bigint           null,
    PRIORITY      bigint default 5 not null,
    XID           varchar(250)     null,
    primary key (CONTAINER, CLIENT_ID, SUB_NAME, PRIORITY)
);
```

ACTIVEMQ_ACKS 用于存储订阅关系。如果是持久化 Topic,订阅者和服务器的订阅关系在这个表保存。数据库字段如下:

- CONTAINER：消息的 Destination。
- SUB_DEST：如果是使用 Static 集群,这个字段会有集群其他系统的信息。
- CLIENT_ID：每个订阅者都必须有一个唯一的客户端 ID 用以区分。
- SUB_NAME：订阅者名称。
- SELECTOR：选择器,可以选择只消费满足条件的消息。条件可以用自定义属性实现,可支持多属性 AND 和 OR 操作。
- LAST_ACKED_ID：记录消费过的消息的 ID。

![image-20210821161323939](/ActiveMQ/image-20210821161323939.png)

- ACTIVEMQ_LOCK：

表 ACTIVEMQ_LOCK 在集群环境中才有用,只有一个 Broker 可以获得消息,称为 Master Broker,其他的只能作为备份等待 Master Broke 不可用,才可能成为下一个 Master Broker。这个表用于记录哪个 Broker 是当前的 MasterBroker。

#### 下划线报错问题

`java.lang.IllegalStateException: BeanFactory not initialized or already closed`。

这是因为操作系统的机器名中有`_`符号。请更改机器名并且重启后即可解决问题。

### JDBC with Journal

这种方式克服了 JDBC Store 的不足,JDBC 每次消息过来,都需要去写库和读库。
ActiveMQ Journal,使用高速缓存写入技术,大大提高了性能。
当消费者的消费速度能够及时跟上生产者消息的生产速度时, journal 文件能够大大减少需要写入到 DB 中的消息。

举个例子：

生产者生产了 1000 条消息,这 1000 条消息会保存到 journa 文件,如果消费者的消费速度很快的情况下,在 journal 文件还没有同步到 DB 之前,消费者已经消费了 90% 的以上的消息,那么这个时候只需要同步剩余的 10% 的消息到 DB。如果消费者的消费速度很慢,这个时候 journa 文件可以使消息以批量方式写到 DB。

修改 `activemq.xml`，将 persistenceAdapter 注释掉：

```xml
<persistenceFactory>
    <journalPersistenceAdapterFactory
                                      journalLogFiles="5"
                                      dataDirectory="${activemq.data}/journal"
                                      dataSource="#mysql"
                                      journalLogFileSize="32768"
                                      useJournal="true"
                                      useQuickJournal="true"
                                      />
</persistenceFactory>
```

参数分别为文件个数、数据文件目录、数据源、文件大小、是否使用 journal 与是否使用快速 journal。

![image-20210821165450592](/ActiveMQ/image-20210821165450592.png)

::: tip
发送消息后，一段时间后，没有消费的消息才会被写入 MySQL。
:::

## 集群

- 三种集群方式：
    - 基于 sharedFileSystem 共享文件系统。
    - 基于 JDBC。
    - 基于可复制的 LevelDB。

### 配置 ZooKeeper+LevelDB 集群

首先要有一个 ZooKeeper 集群，配置方法参考：[ZooKeeper](/ZooKeeper.md)

- 使用 ZooKeeper 集群注册所有的 ActiveMQ Broker 但只有其中的一个 Broker 可以提供服务它将被视为 Master,其他的 Broker 处于待机状态被视为 Slave。如果 Master 因故障而不能提供服务 ZooKeeper 会从 Slave 中选举出一个 Broker 充当 Master。
- Slave 连接 Master 并同步他们的存储状态, *Slave不接受客户端连接*。所有的存储操作都将被复制到连接至 Master 的 Slaves。如果 Master 宕机得到了最新更新的 Slave 会成为 Master。故障节点在恢复后会重新加入到集群中并接 Master 进入 Slave 模式。所有需要同步的消息操作都将等待存储状态被复制到其他法定节点的操作完成才能完成。所以,如果你配置了 replicas=3,那么法定大小是(3/2)+1=2。 Master 将会存储并更新然后等待(2-1)=1 个 Save 存储和更新完成才汇报 success。
- 有一个 node 要作为观察者存在。当一个新的 Master 被选中,你需要至少保障一个法定 node 在线以能够找到拥有最新状态的 node。这个 node 才可以成为新的 Master。
- 因此,推荐运行至少 3 个 replica nodes 以防止一个 node 失败后服务中断。

#### 修改配置文件

首先修改 `broker` 标签的 name 属性，集群中所有的 ActiveMQ 同名：

```xml
<broker xmlns="http://activemq.apache.org/schema/core" brokerName="ppgmq" dataDirectory="${activemq.data}">
```

修改持久化配置，这里所有 ActiveMQ 都相同：

```xml
<persistenceAdapter>
    <replicatedLevelDB
    directory="${activemq.data}/leveldb"
    replicas="3"
    bind="tcp://0.0.0.0:61619"
    zkAddress="150.158.153.216:2181,39.107.112.172:2181,115.28.211.227:2181"
    sync="local_disk"
    zkPath="/activemq/leveldb-stores"
    />
</persistenceAdapter>
```

- replicas：集群中将存在的节点数。至少 (replicas/2)+1 个节点必须在线以避免服务中断。
- bind：当这个节点成为主节点时，它将绑定配置的地址和端口来为复制协议提供服务。
- zkAddress：ZooKeeper 服务器的逗号分隔列表。
- zkPath： Zookeeper 上存放 MQServer 主从选举信息的节点位置。
- sync：MQ 节点间的数据同步策略。可选项如下：local_mem、local_disk、remote_mem、remote_disk、quorum_mem、quorum_disk；建议：quorum_mem。

[配置参考](https://activemq.apache.org/replicated-leveldb-store)

#### 启动集群

分别启动三台服务器上的 ActiveMQ 即可。

#### 使用集群

对于 Java 程序，只要修改访问URL即可

ActiveMQ 的客户端只能访问 Master 的 Broker，其他处于 Slave的Broker 不能访问，所以客户端连接的 Broker 应该使用 **failover 协议**(转移失败)

```java
private static final String URL="failover:(" +
        "tcp://39.107.112.172:61616" +
        ",tcp://150.158.153.216:61616" +
        ",tcp://115.28.211.227:61616)";
```

#### 问题

- ActiveMQ 的客户端只能访问 Master 的 Broker，其他处于 Slave 的 Broker 不能访问，所以客户端连接的 Broker 应该使用 **failover 协议**(转移失败)。
- 当一个 ActiveMQ 节点挂掉或者一个 Zookeeper 节点挂掉，ActiveMQ 服务依然正常运转，如果仅剩一个 ActiveMQ 节点，由于不能选举 Master，所以 ActiveMQ 不能正常运行。
- 同样的，如果 Zookeeper 仅剩一个节点活动，不管 ActiveMQ 各节点存活，ActiveMQ 也不能正常提供服务。(ActiveMQ 集群的高可用，依赖于 Zookeeper 集群的高可用)。
- 如果使用 sync 设置为 local_disk，如果向集群投递了消息，那么在停止集群又重启后集群将不可用，因为 levelDB 的脏数据问题，需要删除所有 ActiveMQ 的 data 目录下的 leveldb 文件夹。

## 高级特性

### 异步投递

#### 什么是异步投递

对于一个慢消费者，使用同步发送消息可能出现生产者阻塞的情况，慢消费者适合使用异步发送。

ActiveMQ 支持冋步、异步两种发送的模式将消息发送到 broker,模式的选择对发送延时有巨大的影响。 producer 能达到怎样的产出率(产出率=发送数据总量/时间)主要受发送延时的影响,使用异步发送可以显著的提高发送的性能。
ActiveMQ 默认使用异步发送的模式:除非**明确指定使用同步发送**的方式或者在**未使用事务的前提下发送持久化的消息**,这两种情况都是同步发送的。
如果你没有使用事务且发送的是持久化的消息,每一次发送都是同步发送的且会阻塞 producer 直到 broker 返回一个确认,表示消息己经被安全的持久化到磁盘。确认机制提供了消息安全的保障,但同时会阻塞客户端带来了很大的延时。
很多高性能的应用,允许在失败的情况下有少量的数据丢失。如果你的应用满足这个特点,你可以使用异步发送来提高生产率,即使发送的是持久化的消息。

异步发送：

它可以最大化 produer 端的发送效率。我们通常在发送消息量比较密集的情况下使用异步发送,它可以很大的提升 Producer 性能不过这也带来了额外的问题,就是需要消耗较多的 Client 端内存同时也会导致 broker 端性能消耗增加，此外它不能有效的确保消息的发送成功。在 `useAsyncSend=true` 的情况下客户端需要容忍消息丢失的可能。

#### 使用异步投递

方法一，修改URL：

```java
private static final String URL="tcp://150.158.153.216:61615?jms.useAsyncSend=true";
```

方法二，调用 `ActiveMQConnectionFactory` 的 `setUseAsyncSend` 方法传入 true：

```java
ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
activeMQConnectionFactory.setUseAsyncSend(true);
```

方法三，调用 `ActiveMQConnection` 的的 `setUseAsyncSend` 方法传入 true：

```java
((ActiveMQConnection) connection).setUseAsyncSend(true);
```

#### 确认发送成功

设置使用异步发送后，修改发送部分的代码：

```java
//            创建一个消息对象
TextMessage textMessage = session.createTextMessage("msg--->" + i);
//            设置头
String uuid = UUID.randomUUID().toString();
textMessage.setJMSMessageID(uuid);
//            异步发送，使用回调确认
((ActiveMQMessageProducer) producer).send(textMessage, new AsyncCallback() {
    @Override
    public void onSuccess() {
        System.out.println("发送成功，消息ID："+uuid);
    }

    @Override
    public void onException(JMSException e) {
        System.out.println("发送失败，错误信息："+e.getMessage());
    }
});
```

调用 `send()` 方法，第二个参数传入一个回调匿名内部类，这个类具有成功回调和异常回调。

### 延迟投递

修改 `activemq.xml`，为 broker 标签添加：`schedulerSupport="true"`开启定时、延时等功能。

发送端代码：

```java
long delay=5*1000L;
long period=4*1000L;
int repeat=3;
TextMessage textMessage = session.createTextMessage("msg--->" + i);
textMessage.setLongProperty(ScheduledMessage.AMQ_SCHEDULED_DELAY,delay);
textMessage.setLongProperty(ScheduledMessage.AMQ_SCHEDULED_PERIOD,period);
textMessage.setIntProperty(ScheduledMessage.AMQ_SCHEDULED_REPEAT,repeat);
producer.send(textMessage);
```

### 消费重试机制

#### 消息重发的情况

- 消费端开启了事务但是调用了回滚。
- 消费端开启了事务但是在 commit 之前程序终止或者根本没有 commit。
- 消费端在手动签收模式下调用了 session 的 recover 方法。
- 消费端连接超时。

#### 消息重发时间间隔和重发次数

间隔：1秒；次数：6次。

#### 有毒消息 Poison ACK

一个消息被重发超过默认最大次数 6 次时，消费端向 Broker 发送一个 poison ack，表示这个消息有毒，告诉 Broker 不要再发送了，这个时候 Broker 会把这个消息放到 DLQ 死信队列。

配置参考：[重发策略](https://activemq.apache.org/redelivery-policy)

- collisionAvoidanceFactor：设置防止冲突范围的正负百分比,只有启用 `useCollisionAvoidance` 参数时才生效。也就是在延迟时间上再加一个时间波动范围。默认值为 0.15。
- maximumRedeliveries：最大重传次数，达到最大重连次数后抛出异常。为 -1 时不限制次数,为 0 时表示不进行重传。默认值为 6。
- maximumRedeliveryDelay：最大传送延迟,只在 `useExponentialBackOff` 为 true 时有效(V5.5),假设首次重连间隔为 10ms,倍数为 2,那么第二次重连时间间隔为 20ms,第三次重连时间间隔为 40ms,当重连时间间隔大的最大重连时间间隔时,以后每次重连时间间隔都为最大重连时间间隔。默认为 -1。
- initialRedeliveryDelay：初始重发延迟时间,默认 1000L 毫秒。
- redeliveryDelay：重发延迟时间,当 `initialRedeliveryDelay=0` 时生效,默认 1000L。
- useCollisionAvoidance：启用防止冲突功能,默认 false。
- useExponentialBackOff：启用指数倍数递增的方式增加延迟时间,默认 false。
- backOffMultiplier：重连时间间隔递增倍数,只有值大于 1 和启用 `useExponentialBackOff` 参数时才生效，默认是 5。

示例程序：

```java
ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(URL);
RedeliveryPolicy redeliveryPolicy = new RedeliveryPolicy();
redeliveryPolicy.setMaximumRedeliveries(2);//设置最大重发次数
activeMQConnectionFactory.setRedeliveryPolicy(redeliveryPolicy);
```

这里我们使用消费者开启事务但是不 commit，运行之后，第一次收到消息，**但是第一次不算重发**，再执行两次此程序，均能正常接收，此时已经达到最大重发次数，再执行此程序会没有任何输出，且通过控制台可以看到消息已经进入 DLQ 死信队列。

Spring中的配置：

![image-20210821182852630](/ActiveMQ/image-20210821182852630.png)

### 死信队列

ActiveMQ 中默认的死信队列被称为 `ActiveMQ.DLQ`; 所有无法传递的消息都将发送到此队列，这可能难以管理。因此，可以在 `activemq.xml` 配置文件设置`individualDeadLetterStrategy`。

配置 `activemq.xml`，在 `destinationPolicy` 的子标签 `policyEntry` 中添加如下内容：

```xml
<deadLetterStrategy>
    <individualDeadLetterStrategy queuePrefix="DLQ." useQueueForQueueMessages="false"/>
</deadLetterStrategy>
```

上面的配置设置了死信队列的前缀，每个队列的死信队列都是前缀+原队列名。

`useQueueForQueueMessages` 表示是否将 topic 的死信保存在 queue 中，默认为 true。

#### 自动删除过期消息

```xml
<deadLetterStrategy>
    <sharedDeadLetterStrategy processExpired="false" />
</deadLetterStrategy>
```

`processExpired` 表示是否将过期消息放入死信队列，默认为 true。

#### 存放非持久消息到死信队列

默认情况下，ActiveMQ 不会将无法传递的**非持久**消息放在死信队列中。

```xml
<deadLetterStrategy>
    <sharedDeadLetterStrategy processNonPersistent="true" />
</deadLetterStrategy>
```

`processNonPersistent` 表示是否将非持久的消息放入死信队列。

配置参考：[死信队列配置](https://activemq.apache.org/message-redelivery-and-dlq-handling)

### 防止重复调用

网络延迟传输中,会造成进行 MQ 重试中,在重试过程中,可能会造成重复消费。

如果消息是做数据库的插入操作,给这个消息做一个唯一主键,那么就算出现重复消费的情况,就会导致主键冲突,避免数据库出现脏数据。

如果上面两种情况还不行,淮备一个第三服务方来做消费记录。以 redis 为例,给消息分配一个全局 id,只要消费过该消息,将 <id, message> 以
 KV 形式写入 redis。那消费者开始消费前,先去 redis 中查询有没消费记录即可。

::: tip 幂等性
**幂等性**指的是多次操作，结果是一致的。
:::

常见的解决幂等性的方式有以下：

- 唯一索引：保证插入的数据只有一条。
- token 机制：每次接口请求前先获取一个 token，然后再下次请求的时候在请求的 header 体中加上这个 token，后台进行验证，如果验证通过删除 token，下次请求再次判断 token。
- 悲观锁或者乐观锁：悲观锁可以保证每次 for update 的时候其他 sql 无法 update 数据(在数据库引擎是 innodb 的时候,select 的条件必须是唯一索引,防止锁全表)。
- 先查询后判断：首先通过查询数据库是否存在数据，如果存在证明已经请求过了，直接拒绝该请求，如果没有存在，就证明是第一次进来，直接放行。
