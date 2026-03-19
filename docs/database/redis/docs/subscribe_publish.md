# 订阅发布

## 订阅频道

客户端在订阅后会一直监听。

```sh
150.158.153.216:6379> subscribe ppg
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "ppg"
3) (integer) 1
```

## 向指定的频道发送信息

信息中不能有空格,加引号可以有空格。

```sh
publish ppg whatareyoudoing
```

## 退订频道

```sh
150.158.153.216:6379> unsubscribe ppg
1) "unsubscribe"
2) "ppg"
3) (integer) 0
```

## 查看订阅与发布系统状态

```sh
150.158.153.216:6379> pubsub channels
(empty list or set)
```
