# Redis持久化

## RDB 持久化

### 进行持久化

文件：`dump.rdb`。

RDB 触发条件：

- 满足 save规则。
- 执行 flushall。
- 退出 redis。

```sh
# 每经过六秒或六条更改就会触发RDB
save 6 6
```

手动保存

```sh
# 该命令会阻塞当前Redis服务器，执行save命令期间，Redis不能处理其他命令，直到RDB过程完成为止。
save
# 执行该命令时，Redis会在后台异步进行快照操作，快照同时还可以响应客户端请求。
# 具体操作是Redis进程执行fork操作创建子进程，RDB持久化过程由子进程负责，完成后自动结束。
# 阻塞只发生在fork阶段，一般时间很短。
bgsave
```

### 从文件中恢复数据

将数据文件放在 redis 启动目录即可。

获取启动目录：

```sh
150.158.153.216:6379> config get dir
1) "dir"
2) "/etc/cron.d" #启动目录
```

## AOF 持久化

以日志形式记录所有写的操作，只许追加文件不可改写文件，redis 重启时会读取 AOF 并依次执行所有操作。

### 开启 AOF

```sh
appendonly yes
```
