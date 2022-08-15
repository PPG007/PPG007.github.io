# Dubbo 高可用

## 注册中心宕机

zookeeper 注册中心宕机，还可以消费 dubbo 暴露的服务。

健壮性：

- 监控中心宕掉不影响使用，只是丢失部分采样数据。
- 数据库宕掉后，注册中心仍能通过缓存提供服务列表查询，但不能注册新服务。
- 注册中心对等集群，任意一台宕掉后，将自动切换到另一台。
- 注册中心全部宕掉后，服务提供者和服务消费者仍能通过本地缓存通讯。
- 服务提供者无状态，任意一台宕掉后，不影响使用。
- 服务提供者全部宕掉后，服务消费者应用将无法使用，并无限次重连等待服务提供者恢复。

dubbo 直连：

指定 reference 的 url 属性为服务提供者的注册 url 即可绕过注册中心直接调用。

## 负载均衡

默认均衡策略为随机请求。

### Random LoadBalance 基于权重的随机负载均衡机制

![Random LoadBalance](./images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

随机，按权重设置随机概率。 在一个截面上碰撞的概率高，但调用量越大分布越均匀，而且按概率使用权重后也比较均匀，有利于动态调整提供者权重。

### RoundRobin LoadBalance 基于权重的轮询负载均衡机制

![RoundRobin LoadBalance](./images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

轮循，按公约后的权重设置轮循比率。 存在慢的提供者累积请求的问题，比如：第二台机器很慢，但没挂，当请求调到第二台时就卡在那，久而久之，所有请求都卡在调到第二台上。

### LeastActive LoadBalance 最少活跃数负载均衡机制

![LeastActive LoadBalance](./images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

### ConsistentHash LoadBalance 一致性 hash 负载均衡机制

![ConsistentHash LoadBalance](./images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

一致性 Hash，相同参数的请求总是发到同一提供者。 当某一台提供者挂时，原本发往该提供者的请求，基于虚拟节点，平摊到其它提供者，不会引起剧烈变动。

## 服务降级

在 dubbo-admin 面板中为对应消费者选择相应操作

屏蔽：

所有请求返回为 null。

容错：

出错返回空对象。

## 服务容错

### 集群容错

- Failover Cluster：

  失败自动切换，当出现失败，重试其它服务器。通常用于读操作，但重试会带来更长延迟。可通过 retries=“2” 来设置重试次数(不含第一次)。

- Failfast Cluster：

  快速失败，只发起一次调用，失败立即报错。通常用于非幂等性的写操作，比如新增记录。

- Failsafe Cluster：

  失败安全，出现异常时，直接忽略。通常用于写入审计日志等操作。

- Failback Cluster：

  失败自动恢复，后台记录失败请求，定时重发。通常用于消息通知操作。

- Forking Cluster：

  并行调用多个服务器，只要一个成功即返回。通常用于实时性要求较高的读操作，但需要浪费更多服务资源。可通过 forks=“2” 来设置最大并行数。

- Broadcast Cluster：

  广播调用所有提供者，逐个调用，任意一台报错则报错 [2]。通常用于通知所有提供者更新缓存或日志等本地资源信息。

具体选择使用 cluster 属性传入即可。
