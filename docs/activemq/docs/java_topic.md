# Java 操作 Topic

一对多模型(发布订阅)中目的地称为主题 Topic。

## 消息生产者

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

## 消息消费者

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

## Topic 与 Queue 的区别

- 队列可以先发布消息，再由消费者调用，消费者可以收到此前发布的消息，主题如果先发布消息再调用会导致消费者无法收到此前发布的消息，即此前的消息变成了废消息。
- 主题模式是无状态的，队列模式中数据会在 MQ 服务器上以文件形式保存，也可以配置成数据库存储。
- 队列不会丢弃消息，主题会丢弃消息(如果没有订阅者的话)。
- 主题工作在*订阅-发布*模式，如果没有订阅者，消息会被丢掉，如果有多个订阅者，则所有的订阅者都能收到所有的消息，队列工作在*负载均衡*模式，如果当前没有消费者，消息也不会丢弃，如果有多个消费者，一条消息只会发送给一个消费者，并且要求消费者 ACK 信息。
- 主题模式中，由于消息要按照订阅者的数量进行复制,所以处理性能会随着订阅者的增加而明显降低,并且还要结合不同消息协议自身的性能差异。
- 队列模式中，由于一条消息只发送给一个消费者,所以就算消费者再多,性能也不会有明显降低,当然不同消息协议的具体性能也是有差异的。
