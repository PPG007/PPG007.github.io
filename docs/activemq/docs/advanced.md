# 高级特性

## 异步投递

### 什么是异步投递

对于一个慢消费者，使用同步发送消息可能出现生产者阻塞的情况，慢消费者适合使用异步发送。

ActiveMQ 支持冋步、异步两种发送的模式将消息发送到 broker,模式的选择对发送延时有巨大的影响。 producer 能达到怎样的产出率(产出率=发送数据总量/时间)主要受发送延时的影响,使用异步发送可以显著的提高发送的性能。
ActiveMQ 默认使用异步发送的模式:除非**明确指定使用同步发送**的方式或者在**未使用事务的前提下发送持久化的消息**,这两种情况都是同步发送的。
如果你没有使用事务且发送的是持久化的消息,每一次发送都是同步发送的且会阻塞 producer 直到 broker 返回一个确认,表示消息己经被安全的持久化到磁盘。确认机制提供了消息安全的保障,但同时会阻塞客户端带来了很大的延时。
很多高性能的应用,允许在失败的情况下有少量的数据丢失。如果你的应用满足这个特点,你可以使用异步发送来提高生产率,即使发送的是持久化的消息。

异步发送：

它可以最大化 produer 端的发送效率。我们通常在发送消息量比较密集的情况下使用异步发送,它可以很大的提升 Producer 性能不过这也带来了额外的问题,就是需要消耗较多的 Client 端内存同时也会导致 broker 端性能消耗增加，此外它不能有效的确保消息的发送成功。在 `useAsyncSend=true` 的情况下客户端需要容忍消息丢失的可能。

### 使用异步投递

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

### 确认发送成功

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

## 延迟投递

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

## 消费重试机制

### 消息重发的情况

- 消费端开启了事务但是调用了回滚。
- 消费端开启了事务但是在 commit 之前程序终止或者根本没有 commit。
- 消费端在手动签收模式下调用了 session 的 recover 方法。
- 消费端连接超时。

### 消息重发时间间隔和重发次数

间隔：1秒；次数：6次。

### 有毒消息 Poison ACK

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

## 死信队列

ActiveMQ 中默认的死信队列被称为 `ActiveMQ.DLQ`; 所有无法传递的消息都将发送到此队列，这可能难以管理。因此，可以在 `activemq.xml` 配置文件设置`individualDeadLetterStrategy`。

配置 `activemq.xml`，在 `destinationPolicy` 的子标签 `policyEntry` 中添加如下内容：

```xml
<deadLetterStrategy>
    <individualDeadLetterStrategy queuePrefix="DLQ." useQueueForQueueMessages="false"/>
</deadLetterStrategy>
```

上面的配置设置了死信队列的前缀，每个队列的死信队列都是前缀+原队列名。

`useQueueForQueueMessages` 表示是否将 topic 的死信保存在 queue 中，默认为 true。

### 自动删除过期消息

```xml
<deadLetterStrategy>
    <sharedDeadLetterStrategy processExpired="false" />
</deadLetterStrategy>
```

`processExpired` 表示是否将过期消息放入死信队列，默认为 true。

### 存放非持久消息到死信队列

默认情况下，ActiveMQ 不会将无法传递的**非持久**消息放在死信队列中。

```xml
<deadLetterStrategy>
    <sharedDeadLetterStrategy processNonPersistent="true" />
</deadLetterStrategy>
```

`processNonPersistent` 表示是否将非持久的消息放入死信队列。

配置参考：[死信队列配置](https://activemq.apache.org/message-redelivery-and-dlq-handling)

## 防止重复调用

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
