# Docker 运行 RocketMQ

启动 nameserver：

```shell
docker run -dit --rm --net=host apache/rocketmq ./mqnamesrv
```

启动 broker：

```shell
docker run -dit --rm --net=host apache/rocketmq ./mqbroker -n localhost:9876
```

启动 DashBoard：

```shell
docker run -d --rm --net=host --name rocketmq-dashboard -e "JAVA_OPTS=-Drocketmq.namesrv.addr=127.0.0.1:9876" -t apacherocketmq/rocketmq-dashboard:latest
```
