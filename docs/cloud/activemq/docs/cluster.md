# 集群

- 三种集群方式：
  - 基于 sharedFileSystem 共享文件系统。
  - 基于 JDBC。
  - 基于可复制的 LevelDB。

## 配置 ZooKeeper+LevelDB 集群

首先要有一个 ZooKeeper 集群，配置方法参考：[ZooKeeper](/zookeeper/)

- 使用 ZooKeeper 集群注册所有的 ActiveMQ Broker 但只有其中的一个 Broker 可以提供服务它将被视为 Master,其他的 Broker 处于待机状态被视为 Slave。如果 Master 因故障而不能提供服务 ZooKeeper 会从 Slave 中选举出一个 Broker 充当 Master。
- Slave 连接 Master 并同步他们的存储状态, _Slave不接受客户端连接_。所有的存储操作都将被复制到连接至 Master 的 Slaves。如果 Master 宕机得到了最新更新的 Slave 会成为 Master。故障节点在恢复后会重新加入到集群中并接 Master 进入 Slave 模式。所有需要同步的消息操作都将等待存储状态被复制到其他法定节点的操作完成才能完成。所以,如果你配置了 replicas=3,那么法定大小是(3/2)+1=2。 Master 将会存储并更新然后等待(2-1)=1 个 Save 存储和更新完成才汇报 success。
- 有一个 node 要作为观察者存在。当一个新的 Master 被选中,你需要至少保障一个法定 node 在线以能够找到拥有最新状态的 node。这个 node 才可以成为新的 Master。
- 因此,推荐运行至少 3 个 replica nodes 以防止一个 node 失败后服务中断。

### 修改配置文件

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

### 启动集群

分别启动三台服务器上的 ActiveMQ 即可。

### 使用集群

对于 Java 程序，只要修改访问URL即可

ActiveMQ 的客户端只能访问 Master 的 Broker，其他处于 Slave的Broker 不能访问，所以客户端连接的 Broker 应该使用 **failover 协议**(转移失败)

```java
private static final String URL="failover:(" +
        "tcp://39.107.112.172:61616" +
        ",tcp://150.158.153.216:61616" +
        ",tcp://115.28.211.227:61616)";
```

### 问题

- ActiveMQ 的客户端只能访问 Master 的 Broker，其他处于 Slave 的 Broker 不能访问，所以客户端连接的 Broker 应该使用 **failover 协议**(转移失败)。
- 当一个 ActiveMQ 节点挂掉或者一个 Zookeeper 节点挂掉，ActiveMQ 服务依然正常运转，如果仅剩一个 ActiveMQ 节点，由于不能选举 Master，所以 ActiveMQ 不能正常运行。
- 同样的，如果 Zookeeper 仅剩一个节点活动，不管 ActiveMQ 各节点存活，ActiveMQ 也不能正常提供服务。(ActiveMQ 集群的高可用，依赖于 Zookeeper 集群的高可用)。
- 如果使用 sync 设置为 local_disk，如果向集群投递了消息，那么在停止集群又重启后集群将不可用，因为 levelDB 的脏数据问题，需要删除所有 ActiveMQ 的 data 目录下的 leveldb 文件夹。
