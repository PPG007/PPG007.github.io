# 样例-Go

## 添加依赖

```shell
go get github.com/apache/rocketmq-client-go/v2
```

::: danger 注意

如果使用 Go1.18 版本，会出现[这样的问题](https://github.com/apache/rocketmq-client-go/issues/794)，需要将 go.mod 中 `github.com/json-iterator/go` 的版本从 v1.1.9 修改为 v1.1.12，或者使用较低版本的 Go。

:::

## 基本样例

### 发送同步消息

同步消息发送比较可靠，会等待 Broker 的响应。

```go
const (
	nameserverAddr    = "127.0.0.1:9876"
	brokerAddr        = "127.0.0.1:10911"
	producerGroupName = "producer1"
	consumerGroupName = "consumer"
)

func main() {
	examples.InitProducer(func(p *rocketmq.Producer) {
		examples.SendSync(context.Background(), p, "Topic1")
	},
		producer.WithNsResolver(primitive.NewPassthroughResolver([]string{nameserverAddr})),
		producer.WithGroupName(producerGroupName),
	)
}
```

examples/producer.go:

```go
func InitProducer(f func(*rocketmq.Producer), opts ...producer.Option) {
	p, err := rocketmq.NewProducer(opts...)
	if err != nil {
		log.Fatalln("Failed to new producer:", err)
	}
	if err := p.Start(); err != nil {
		log.Fatalf("Failed to start producer, error: %v\n", err)
	}
	f(&p)
	if err := p.Shutdown(); err != nil {
		log.Fatalf("Failed to shutdown producer, error: %v\n", err)
	}
}

func SendSync(ctx context.Context, p *rocketmq.Producer, topic string) {
	sendResult, err := (*p).SendSync(ctx, primitive.NewMessage(topic, []byte("Hello")))
	if err != nil {
		log.Println("Failed to send message:", err)
		return
	}
	fmt.Println(sendResult)
}
```

### 发送异步消息

异步消息通常用在对响应时间敏感的业务场景，即发送端不能容忍长时间地等待 Broker 的响应。

```go
func SendAsync(ctx context.Context, p *rocketmq.Producer, topic string) {
	wg := sync.WaitGroup{}
	wg.Add(1)
	err := (*p).SendAsync(ctx, func(ctx context.Context, result *primitive.SendResult, err error) {
		if err != nil {
			log.Printf("Get respose from broker error: %v\n", err)
		} else {
			log.Printf("Get response from broker success, result: %v\n", result.String())
		}
		wg.Done()
	}, primitive.NewMessage(topic, []byte("SendAsync")))
	if err != nil {
		log.Println("Failed to send message:", err)
	}
	wg.Wait()
}
```

### 单向发送消息

单向发送中，发送者只负责发送，没有发送结果。

```go
func SendOneWay(ctx context.Context, p *rocketmq.Producer, topic string) {
	err := (*p).SendOneWay(ctx, primitive.NewMessage(topic, []byte("send one way")))
	if err != nil {
		log.Printf("Failed to send one way: %v\n", err)
	}
}
```

### 消费消息

```go
examples.InitPushConsumer("Topic1", func(ctx context.Context, msgs ...*primitive.MessageExt) (consumer.ConsumeResult, error) {
	for _, msg := range msgs {
		log.Println(string(msg.Message.Body))
	}
	return consumer.ConsumeSuccess, nil
},
	consumer.WithGroupName(consumerGroupName),
	consumer.WithNsResolver(primitive.NewPassthroughResolver([]string{nameserverAddr})),
)
```

## 顺序消息样例

消息有序指的是可以按照消息的发送顺序来消费(FIFO)。RocketMQ 可以严格的保证消息有序，可以分为分区有序或者全局有序。

顺序消费的原理解析，在默认的情况下消息发送会采取 Round Robin 轮询方式把消息发送到不同的 queue(分区队列)；而消费消息的时候从多个 queue 上拉取消息，这种情况发送和消费是不能保证顺序。但是如果控制发送的顺序消息只依次发送到同一个 queue 中，消费的时候只从这个 queue 上依次拉取，则就保证了顺序。当发送和消费参与的 queue 只有一个，则是全局有序；如果多个 queue 参与，则为分区有序，即相对每个 queue，消息都是有序的。

下面用订单进行分区有序的示例。一个订单的顺序流程是：创建、付款、推送、完成。订单号相同的消息会被先后发送到同一个队列中，消费时，同一个 OrderId 获取到的肯定是同一个队列。

::: tip

在 `apache/rocketmq-client-go` 中，一条消息进入哪个 queue 是通过 `QueueSelector` 接口中的 `Select` 方法实现的，此接口有四个实现：哈希、随机、轮询以及直接返回 Message 中设置的 queue 对象，要实现顺序消息，可以使用哈希实现。

:::

### 生产顺序消息

```go
func SendInOrder(ctx context.Context, p *rocketmq.Producer, topic string) {
	orderSteps := GenOrderSteps()
	for _, orderStep := range orderSteps {
		msg := &primitive.Message{
			Topic: topic,
			Body:  []byte(orderStep.String()),
		}
		msg.WithShardingKey(strconv.FormatInt(orderStep.Id, 10))
		_, err := (*p).SendSync(ctx, msg)
		if err != nil {
			log.Printf("Failed to send messages in order, error: %v\n", err)
		}
	}
}

type OrderStep struct {
	Id   int64
	Desc string
}

func GenOrderSteps() []OrderStep {
	result := []OrderStep{
		{
			Id:   15103111039,
			Desc: "创建",
		},
		{
			Id:   15103111065,
			Desc: "创建",
		},
		{
			Id:   15103111039,
			Desc: "付款",
		},
		{
			Id:   15103117235,
			Desc: "创建",
		},
		{
			Id:   15103111065,
			Desc: "付款",
		},
		{
			Id:   15103117235,
			Desc: "付款",
		},
		{
			Id:   15103111065,
			Desc: "完成",
		},
		{
			Id:   15103111039,
			Desc: "推送",
		},
		{
			Id:   15103117235,
			Desc: "完成",
		},
		{
			Id:   15103111039,
			Desc: "完成",
		},
	}
	return result
}

func (o OrderStep) String() string {
	b, err := json.Marshal(o)
	if err != nil {
		panic(fmt.Sprintf("Failed to get order step string, err: %v", err))
	}
	return string(b)
}

func main() {
	selector := producer.NewHashQueueSelector()
	examples.InitProducer(func(p *rocketmq.Producer) {
		examples.SendInOrder(context.Background(), p, "InOrderTopic")
	},
		producer.WithNsResolver(primitive.NewPassthroughResolver([]string{nameserverAddr})),
		producer.WithQueueSelector(selector),
		producer.WithGroupName(producerGroupName),
	)
}
```

还可以自行实现一个 QueueSelector：

```go
type idQueueSelector struct {
}

func NewIdQueueSelector() QueueSelector {
	return new(idQueueSelector)
}

func (f idQueueSelector) Select(message *primitive.Message, queues []*primitive.MessageQueue) *primitive.MessageQueue {
	qSize := len(queues)
	qIndex := message.Queue.QueueId
	if qIndex < 0 {
		qIndex = 0
		rlog.Warning("queue index out of range and has been reset", map[string]interface{}{
			"QueueSize":        qSize,
			"ChosenQueueIndex": qIndex,
		})
	} else if qIndex >= qSize {
		qIndex = qSize - 1
		rlog.Warning("queue index out of range and has been reset", map[string]interface{}{
			"QueueSize":        qSize,
			"ChosenQueueIndex": qIndex,
		})
	}
	return queues[qIndex]
}
```

此实现根据 Message 中的 Queue 字段的 QueueId 的值进行选择，但是如果在设置这个值的时候不知道 broker 中此 Topic 有多少个 Queue 可能会导致溢出，因此还需要知道到底有多少个 Queue，这通过 Fork 源仓库并修改 Producer 接口实现。

```go
func SendInOrder(ctx context.Context, p *rocketmq.Producer, topic string) {
	orderSteps := GenOrderSteps()
	qSize := len((*p).GetTopicQueueList(topic))
	for _, orderStep := range orderSteps {
		msg := &primitive.Message{
			Topic: topic,
			Body:  []byte(orderStep.String()),
			Queue: &primitive.MessageQueue{
				Topic:   topic,
				QueueId: int(orderStep.Id % int64(qSize)),
			},
		}
		_, err := (*p).SendSync(ctx, msg)
		if err != nil {
			log.Printf("Failed to send messages in order, error: %v\n", err)
		}
	}
}
```

经过修改的代码可以通过 `go get github.com/PPG007/rocketmq-client-go/v2@latest` 获得。

### 顺序消费消息

```go
func main() {
	examples.InitPushConsumer("InOrderTopic", func(ctx context.Context, msgs ...*primitive.MessageExt) (consumer.ConsumeResult, error) {
		for _, msg := range msgs {
			log.Println(string(msg.Message.Body))
		}
		return consumer.ConsumeSuccess, nil
	},
		consumer.WithGroupName(consumerGroupName),
		consumer.WithNsResolver(primitive.NewPassthroughResolver([]string{nameserverAddr})),
		consumer.WithConsumerOrder(true),
		consumer.WithConsumeFromWhere(consumer.ConsumeFromFirstOffset),
	)
}
func InitPushConsumer(topic string, f func(ctx context.Context, msgs ...*primitive.MessageExt) (consumer.ConsumeResult, error), opts ...consumer.Option) {
	c, err := rocketmq.NewPushConsumer(opts...)
	if err != nil {
		log.Fatalf("Failed to new push consumer, error: %v\n", err)
	}
	err = c.Subscribe(topic, consumer.MessageSelector{}, f)
	if err != nil {
		log.Fatalf("Failed to subscribe topic, error: %v\n", err)
	}
	if err := c.Start(); err != nil {
		log.Fatalf("Failed to start consumer, error %v\n", err)
	}
	time.Sleep(time.Hour)
	if err := c.Shutdown(); err != nil {
		log.Fatalf("Failed to shutdown consumer, error: %v\n", err)
	}
}
```

## 延时消息样例

延时消息的消费时间会比 broker 受到并存储消息的时间中存在间隔，在订单系统中，可以为下单事件发送一个延时消息，过一段时间后消息的消费者收到消息后去检查这个订单是否支付，如果没有可以取消。

首先启动一个消费者客户端等待传入消息：

```go
// TODO:
```

然后发送延时消息：

```go
// TODO:
```

::: warning

RocketMQ 不支持任意延时时间，存在着预设置的固定延时，具体可见 org/apache/rocketmq/store/config/MessageStoreConfig.java 文件中的定义：

`private String messageDelayLevel = "1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h";`

:::

## 批量消息样例

截止 2022 年 7 月 3 日，`apache/rocketmq-client-go` 最新稳定版本为 2.1.0，此版本中，`internal/request.go` 中 `SendMessageRequestHeader` 中的 DefaultTopicQueueNums 类型设置为了 string，这将导致在批量发送消息时，此字段没有设置值进而导致在 broker 中向整形转换出现空字符串问题，因此无法批量推送。v2.1.1-rc1 和 v2.1.1-rc2 这两个预发布版本中修复了这个问题，但是 `internal/client.go` 中的 `GetOrNewRocketMQClient` 方法的 `actual, loaded := clientMap.LoadOrStore(client.ClientID(), client)` 语句处没有判断是否 loaded 就进行了类型转换导致空指针问题。

批量发送消息能显著提高传递小消息的性能。限制是这些批量消息应该有相同的 topic，相同的 waitStoreMsgOK，而且不能是延时消息。此外，这一批消息的总大小不应超过 **4MB**。

### 发送批量消息

```go
// TODO:
```

上述代码中没有指定消息存储的 queue,所以消费时和上面的顺序可能不同。

### 批量消息分割

如果一批消息大小超过了 4MB，那么就需要对消息进行分割、分批发送。

利用迭代器实现对于一批消息的分割遍历：

```go
// TODO:
```

然后发送消息：

```go
// TODO:
```

## 过滤消息样例

### 利用 Tag 过滤消息

要利用 Tag 进行过滤只需要在消费端订阅 topic 时使用 `consumer.subscribe("FilterTest", "A || B");` 即可。

::: warning

用 tag 过滤时如果是批发送消息会导致实际的 tag 值与设置的不同，进而导致消费端过滤错误。

:::

### 使用 property 过滤消息

可以利用 `putUserProperty` 方法为消息设置属性，可以使用 SQL92 标准的 SQL 语句实现过滤。

RocketMQ 只定义了一些基本语法来支持这个特性：

- 数值比较，比如：>，>=，<，<=，BETWEEN，=；
- 字符比较，比如：=，<>，IN；
- IS NULL 或者 IS NOT NULL；
- 逻辑符号 AND，OR，NOT；

常量支持类型为：

- 数值，比如：123，3.1415；
- 字符，比如：'abc'，必须用单引号包裹起来；
- NULL，特殊的常量
- 布尔值，TRUE 或 FALSE

::: warning

只有使用 push 模式的消费者才能用使用 SQL92 标准的 sql 语句。

:::

发送带有属性的消息：

```go
// TODO:
```

消费端进行过滤：

```go
// TODO:
```

Docker 镜像中的 RocketMQ 默认是不开启对于使用自定义属性进行过滤的支持的，即 enablePropertyFilter 的值为 false，可以将 RocketMQ 的 conf 目录中的一个配置文件进行修改并挂载到容器中，例如可以使用下面的配置文件：

```properties
brokerClusterName=DefaultCluster
brokerName=broker-a
brokerId=0
deleteWhen=04
fileReservedTime=48
brokerRole=ASYNC_MASTER
flushDiskType=ASYNC_FLUSH
enablePropertyFilter=true
```

然后使用下面的命令挂载并使用这个配置文件启动 Broker：

```shell
docker run -dit --rm --mount type=bind,source=$(pwd)/custom-config,target=/home/custom-config --net=host apache/rocketmq ./mqbroker -n localhost:9876 -c /home/custom-config/broker-a.properties
```

其中 custom-config 是自定义配置文件所在的目录。

RocketMQ 中 SQL 的语法及示例如下图所示：

![RocketMQ SQL](/RocketMQ/SQLGrammar.png)

## 消息事务样例

### 概念介绍

- 事务消息：消息队列 RocketMQ 提供的分布式事务功能，通过消息队列 RocketMQ 事务消息能达到分布式事务的最终一致。
- 半事务消息：暂不能投递的消息，生产者已经成功地将消息发送到了消息队列 RocketMQ 版服务端，但是消息队列 RocketMQ 版服务端未收到生产者对该消息的二次确认，此时该消息被标记成“暂不能投递”状态，处于该种状态下的消息即半事务消息。
- 消息回查：由于网络闪断、生产者应用重启等原因，导致某条事务消息的二次确认丢失，消息队列 RocketMQ 版服务端通过扫描发现某条消息长期处于“半事务消息”时，需要主动向消息生产者询问该消息的最终状态（Commit 或是 Rollback），该询问过程即消息回查。

事务消息共有三种状态，提交状态、回滚状态、中间状态：

- TransactionStatus.CommitTransaction: 提交事务，它允许消费者消费此消息。
- TransactionStatus.RollbackTransaction: 回滚事务，它代表该消息将被删除，不允许被消费。
- TransactionStatus.Unknown: 中间状态，它代表需要检查消息队列来确定状态。

事务消息交互流程如图所示：

![transaction](/RocketMQ/transaction.png)

下面是消息生产者的代码示例：

```go
//TODO:
```

由上面的流程图我们可以知道，事务消息的生产者需要能够对消息回查做出响应且能够执行自身事务，因此需要一个 `TransactionListener` 接口的实现类，这个接口具有两个方法，其中 `executeLocalTransaction` 方法用来执行本地的事务并且返回事务消息的三种状态的其中一种，`checkLocalTransaction` 方法用于响应消息回查并且也返回一个状态。同时，这个接口的实现类的两个方法的执行需要一个线程池，于是就像上面那样创建一个线程池。

```go
//TODO:
```

::: tip 事务消息的一些限制

- 事务消息不支持延时消息和批量消息。
- 为了避免单个消息被检查太多次而导致半队列消息累积，默认将单个消息的检查次数限制为 15 次，但是用户可以通过 Broker 配置文件的 transactionCheckMax 参数来修改此限制。如果已经检查某条消息超过 N 次的话（ N = transactionCheckMax ） 则 Broker 将丢弃此消息，并在默认情况下同时打印错误日志。用户可以通过重写 AbstractTransactionalMessageCheckListener 类来修改这个行为。
- 事务消息将在 Broker 配置文件中的参数 transactionTimeout 这样的特定时间长度之后被检查。当发送事务消息时，用户还可以通过设置用户属性 CHECK_IMMUNITY_TIME_IN_SECONDS 来改变这个限制，该参数优先于 transactionTimeout 参数。
- 事务性消息可能不止一次被检查或消费。
- 提交给用户的目标主题消息可能会失败，目前这依日志的记录而定。它的高可用性通过 RocketMQ 本身的高可用性机制来保证，如果希望确保事务消息不丢失、并且事务完整性得到保证，建议使用同步的双重写入机制。
- 事务消息的生产者 ID 不能与其他类型消息的生产者 ID 共享。与其他类型的消息不同，事务消息允许反向查询、MQ 服务器能通过它们的生产者 ID 查询到消费者。

:::
