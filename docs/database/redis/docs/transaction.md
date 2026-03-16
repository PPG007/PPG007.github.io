# Redis 操作事务

::: tip
redis 单条命令保证原子性。

但是事务不保证原子性。

一次性、顺序性、排他性。
:::

## Redis 事务阶段

- 开启事务(MULTI)。
- 命令入队。
- 执行事务(EXEC)。

## 基础命令

创建事务：

```sh
150.158.153.216:6379> multi
OK
150.158.153.216:6379> set key1 key1
QUEUED
150.158.153.216:6379> set key2 key2
QUEUED
150.158.153.216:6379> get key1
QUEUED
150.158.153.216:6379> set key3 key3
QUEUED
```

执行事务：

```sh
150.158.153.216:6379> exec
1) OK
2) OK
3) "key1"
4) OK
```

取消事务：

```sh
150.158.153.216:6379> multi
OK
150.158.153.216:6379> set a a
QUEUED
150.158.153.216:6379> discard
OK
150.158.153.216:6379> get a
(nil)
```

## 事务中的异常

语法错误：

```sh
# 所有命令都不会执行
150.158.153.216:6379> multi
OK
150.158.153.216:6379> set a a
QUEUED
150.158.153.216:6379> set b b
QUEUED
150.158.153.216:6379> asfafargq
(error) ERR unknown command `asfafargq`, with args beginning with:
150.158.153.216:6379> getset c
(error) ERR wrong number of arguments for 'getset' command
150.158.153.216:6379> set d d
QUEUED
150.158.153.216:6379> exec
(error) EXECABORT Transaction discarded because of previous errors.
150.158.153.216:6379> keys *
(empty list or set)
```

操作错误(运行时异常)：

```sh
# 正常命令依然正常执行
150.158.153.216:6379> multi
OK
150.158.153.216:6379> incr a
QUEUED
150.158.153.216:6379> set b b
QUEUED
150.158.153.216:6379> get b
QUEUED
150.158.153.216:6379> exec
1) (error) ERR value is not an integer or out of range
2) OK
3) "b"
```

## 乐观锁

通过 watch 和 unwatch 命令开启/关闭对 key 的监视。

正常执行：

```sh
150.158.153.216:6379> set money 100
OK
150.158.153.216:6379> set out 0
OK
150.158.153.216:6379> watch money
OK
150.158.153.216:6379> multi
OK
150.158.153.216:6379> decrby money 20
QUEUED
150.158.153.216:6379> incrby out 20
QUEUED
150.158.153.216:6379> exec
1) (integer) 80
2) (integer) 20
```

异常执行：

客户端 1：

```sh
150.158.153.216:6379> watch money out
OK
150.158.153.216:6379> multi
OK
150.158.153.216:6379> decrby money 5
QUEUED
150.158.153.216:6379> incrby out 5
QUEUED
```

客户端 1 的事务先不执行，此时插入客户端 2 的操作。

客户端 2：

```sh
150.158.153.216:6379> decrby out 10
(integer) 10
```

然后客户端 1 再执行：

```sh
150.158.153.216:6379> exec
(nil)
150.158.153.216:6379> get money
"80"
```

事务没有执行。

::: tip
如果希望再次执行事务，先用 unwatch 解锁再使用 watch 重新加锁。
:::
