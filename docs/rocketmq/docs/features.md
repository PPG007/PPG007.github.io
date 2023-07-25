# 特性

## 订阅与发布

消息的发布是指某个生产者向某个 topic 发送消息；消息的订阅是指某个消费者关注了某个 topic 中带有某些 tag 的消息，进而从该 topic 消费数据。

## 消息顺序

消息有序指的是一类消息消费时，能按照发送的顺序来消费。例如：一个订单产生了三条消息分别是订单创建、订单付款、订单完成。消费时要按照这个顺序消费才能有意义，但是同时订单之间是可以并行消费的。RocketMQ 可以严格的保证消息有序。

顺序消息分为全局顺序消息与分区顺序消息，全局顺序是指某个 Topic 下的所有消息都要保证顺序；部分顺序消息只要保证每一组消息被顺序消费即可。

- 全局顺序：

    对于指定的一个 Topic，所有消息按照严格的先入先出（FIFO）的顺序进行发布和消费。
    适用场景：性能要求不高，所有的消息严格按照 FIFO 原则进行消息发布和消费的场景。

- 分区顺序：

    对于指定的一个 Topic，所有消息根据 sharding key 进行区块分区。 同一个分区内的消息按照严格的 FIFO 顺序进行发布和消费。 Sharding key 是顺序消息中用来区分不同分区的关键字段，和普通消息的 Key 是完全不同的概念。
    适用场景：性能要求高，以 sharding key 作为分区字段，在同一个区块中严格的按照 FIFO 原则进行消息发布和消费的场景。

## 消息过滤

RocketMQ 的消费者可以根据 Tag 进行消息过滤，也支持自定义属性过滤。消息过滤目前是在 Broker 端实现的，优点是减少了对于 Consumer 无用消息的网络传输，缺点是增加了 Broker 的负担、而且实现相对复杂。

## 消息可靠性

RocketMQ支持消息的高可靠，影响消息可靠性的几种情况：

1. Broker 非正常关闭。
1. Broker 异常 Crash。
1. OS Crash。
1. 机器掉电，但是能立即恢复供电情况。
1. 机器无法开机（可能是 cpu、主板、内存等关键设备损坏）。
1. 磁盘设备损坏。

前四种情况都属于硬件资源可立即恢复情况，RocketMQ 在这四种情况下能保证消息不丢，或者丢失少量数据（依赖刷盘方式是同步还是异步）。

后两种属于单点故障，且无法恢复，一旦发生，在此单点上的消息全部丢失。RocketMQ 在这两种情况下，通过异步复制，可保证 99% 的消息不丢，但是仍然会有极少量的消息可能丢失。通过同步双写技术可以完全避免单点，同步双写势必会影响性能，适合对消息可靠性要求极高的场合，例如与 Money 相关的应用。注：RocketMQ 从 3.0 版本开始支持同步双写。

## 至少一次

至少一次(At least Once)指每个消息必须投递一次。Consumer 先 Pull 消息到本地，消费完成后，才向服务器返回 ack，如果没有消费一定不会 ack 消息，所以 RocketMQ 可以很好的支持此特性。

## 回溯消费

回溯消费是指 Consumer 已经消费成功的消息，由于业务上需求需要重新消费，要支持此功能，Broker 在向 Consumer 投递成功消息后，消息仍然需要保留。并且重新消费一般是按照时间维度，例如由于 Consumer 系统故障，恢复后需要重新消费 1 小时前的数据，那么 Broker 要提供一种机制，可以按照时间维度来回退消费进度。RocketMQ 支持按照时间回溯消费，时间维度精确到毫秒。

## 事务消息

RocketMQ 事务消息（Transactional Message）是指应用本地事务和发送消息操作可以被定义到全局事务中，要么同时成功，要么同时失败。RocketMQ 的事务消息提供类似 X/Open XA 的分布事务功能，通过事务消息能达到分布式事务的最终一致。

## 定时消息

定时消息（延迟队列）是指消息发送到 broker 后，不会立即被消费，等待特定时间投递给真正的 topic。
broker 有配置项 messageDelayLevel，默认值为“1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h”，18 个 level。可以配置自定义 messageDelayLevel。注意，messageDelayLevel 是 broker 的属性，不属于某个 topic。发消息时，设置 delayLevel 等级即可：msg.setDelayLevel(level)。level 有以下三种情况：

- level == 0，消息为非延迟消息。
- 1<=level<=maxLevel，消息延迟特定时间，例如 level==1，延迟 1s。
- level > maxLevel，则 level== maxLevel，例如 level==20，延迟 2h。

定时消息会暂存在名为SCHEDULE_TOPIC_XXXX的topic中，并根据delayTimeLevel存入特定的queue，queueId = delayTimeLevel – 1，即一个queue只存相同延迟的消息，保证具有相同发送延迟的消息能够顺序消费。broker会调度地消费SCHEDULE_TOPIC_XXXX，将消息写入真实的topic。

需要注意的是，定时消息会在第一次写入和调度写入真实 topic 时都会计数，因此发送数量、tps 都会变高。

## 消息重试

Consumer 消费消息失败后，要提供一种重试机制，令消息再消费一次。Consumer 消费消息失败通常可以认为有以下几种情况：

- 由于消息本身的原因，例如反序列化失败，消息数据本身无法处理（例如话费充值，当前消息的手机号被注销，无法充值）等。这种错误通常需要跳过这条消息，再消费其它消息，而这条失败的消息即使立刻重试消费，99% 也不成功，所以最好提供一种定时重试机制，即过 10 秒后再重试。
- 由于依赖的下游应用服务不可用，例如 db 连接不可用，外系统网络不可达等。遇到这种错误，即使跳过当前失败的消息，消费其他消息同样也会报错。这种情况建议应用 sleep 30s，再消费下一条消息，这样可以减轻 Broker 重试消息的压力。

RocketMQ 会为每个消费组都设置一个 Topic 名称为“%RETRY%+consumerGroup”的重试队列（这里需要注意的是，这个 Topic 的重试队列是针对消费组，而不是针对每个Topic设置的），用于暂时保存因为各种异常而导致 Consumer 端无法消费的消息。考虑到异常恢复起来需要一些时间，会为重试队列设置多个重试级别，每个重试级别都有与之对应的重新投递延时，重试次数越多投递延时就越大。RocketMQ 对于重试消息的处理是先保存至 Topic 名称为“SCHEDULE_TOPIC_XXXX”的延迟队列中，后台定时任务按照对应的时间进行 Delay 后重新保存至“%RETRY%+consumerGroup”的重试队列中。

## 消息重投

生产者在发送消息时，同步消息失败会重投，异步消息有重试，oneway 没有任何保证。消息重投保证消息尽可能发送成功、不丢失，但可能会造成消息重复，消息重复在 RocketMQ 中是无法避免的问题。消息重复在一般情况下不会发生，当出现消息量大、网络抖动，消息重复就会是大概率事件。另外，生产者主动重发、consumer 负载变化也会导致重复消息。如下方法可以设置消息重试策略：

- retryTimesWhenSendFailed:同步发送失败重投次数，默认为 2，因此生产者会最多尝试发送 retryTimesWhenSendFailed + 1次。不会选择上次失败的 broker，尝试向其他 broker 发送，最大程度保证消息不丢。超过重投次数，抛出异常，由客户端保证消息不丢。当出现 RemotingException、MQClientException 和部分 MQBrokerException 时会重投。
- retryTimesWhenSendAsyncFailed:异步发送失败重试次数，异步重试不会选择其他 broker，仅在同一个 broker 上做重试，不保证消息不丢。
- retryAnotherBrokerWhenNotStoreOK:消息刷盘（主或备）超时或 slave 不可用（返回状态非 SEND_OK），是否尝试发送到其他 broker，默认 false。十分重要消息可以开启。

## 流量控制

生产者流控，因为 broker 处理能力达到瓶颈；消费者流控，因为消费能力达到瓶颈。

生产者流控：

- commitLog 文件被锁时间超过 osPageCacheBusyTimeOutMills 时，参数默认为 1000ms，返回流控。
- 如果开启 transientStorePoolEnable == true，且 broker 为异步刷盘的主机，且 transientStorePool 中资源不足，拒绝当前 send 请求，返回流控。
- broker 每隔 10ms 检查 send 请求队列头部请求的等待时间，如果超过 waitTimeMillsInSendQueue，默认 200ms，拒绝当前 send 请求，返回流控。
- broker 通过拒绝 send 请求方式实现流量控制。

::: warning
生产者流控，不会尝试消息重投。
:::

消费者流控：

- 消费者本地缓存消息数超过 pullThresholdForQueue 时，默认 1000。
- 消费者本地缓存消息大小超过 pullThresholdSizeForQueue 时，默认 100MB。
- 消费者本地缓存消息跨度超过 consumeConcurrentlyMaxSpan 时，默认 2000。

消费者流控的结果是降低拉取频率。

## 死信队列

死信队列用于处理无法被正常消费的消息。当一条消息初次消费失败，消息队列会自动进行消息重试；达到最大重试次数后，若消费依然失败，则表明消费者在正常情况下无法正确地消费该消息，此时，消息队列 不会立刻将消息丢弃，而是将其发送到该消费者对应的特殊队列中。

RocketMQ 将这种正常情况下无法被消费的消息称为死信消息（Dead-Letter Message），将存储死信消息的特殊队列称为死信队列（Dead-Letter Queue）。在 RocketMQ 中，可以通过使用 console 控制台对死信队列中的消息进行重发来使得消费者实例再次进行消费。
