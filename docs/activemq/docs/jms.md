# JMS

## 什么是 JMS

JMS（JAVA Message Service,java消息服务）API 是一个消息服务的标准或者说是规范，允许应用程序组件基于 JavaEE 平台创建、发送、接收和读取消息。它使分布式通信耦合度更低，消息服务更加可靠以及异步性。

::: tip
JMS是java的消息服务，JMS的客户端之间可以通过JMS服务进行异步的消息传输。
:::

## JMS 四大元素

### JMS provider

实现 JMS 接口和规范的消息中间件，即 MQ 服务器。

### JMS producer

消息生产者，创建、发送 JMS 消息的客户端应用。

### JMS consumer

消息消费者，接收和处理 JMS 消息的客户端应用。

### JMS message

#### 消息头

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

#### 消息体

- 封装具体的消息数据。
- 5种消息体格式：
  - TextMessage 普通字符串消息，包含一个String。
  - MapMessage 一个 Map 类型消息 key 为 String，value 为 Java 基本类型。
  - BytesMessage 二进制数组，包含一个 byte[]。
  - StreamMessage Java 数据流消息，用标准流操作来顺序的填充和读取。
  - ObjectMessage 对象消息，包含一个可序列化的 Java 对象。
- 发送和接收的消息体类型必须一致。

#### 发送方

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

#### 接收方

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

#### 消息属性

- 如果需要除消息头字段以外的值,那么可以使用消息属性。
- 识别/去重/重点标注等操作非常有用的方法。
- 是属性名、属性值的键值对形式。

## JMS 的可靠性

### PRESISTENT 持久性

#### 队列持久性

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

#### 主题持久性

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

### 事务

```java
Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
```

对于生产者来说，如果第一个设置为false即不开启事务，只要执行send，消息就进入队列；如果设置为true即开启了事务，先执行send再执行commit才能将消息提交到队列中

```java
session.commit();
session.rollback();
```

对于消费者来说，如果第一个设置为 false 即不开启事务，只要执行接收，消息就出队列；如果设置为 true 即开启了事务，如果接收完毕不执行 commit，被消费的消息不会出队列，导致一条消息多次消费。

### Acknowledge 签收

#### 非事务模式

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

#### 事务模式

开启事务后，是否签收取决于事务是否 commit。

#### 事务与签收的关系

- 在事务性会话中,当一个事务被成功提交则消息被自动签收。如果事务回滚,则消息会被再次传送。
- 非事务性会话中,消息何时被确认取决于创建会话时的应答模式
