# 客户端命令行

## 节点类型

- 持久节点：客户端与服务端断开连接后创建的节点不删除。
- 短暂节点：客户端与服务端断开连接后创建的节点会删除。
- 带序号节点，就像数据库主键自增一样。

创建无序号持久节点：

节点+描述：

```sh
create /sanguo "diaochan"
create /sanguo/shuguo "liubei"
```

获取节点信息：

```sh
get -s /sanguo
```

创建带序号持久节点：

```sh
create -s /sanguo/weiguo/zhangliao "zhangliao"
```

序号是自动生成的，创建带序号节点的语句可以重复执行，序号会递增，创建不带序号节点的语句不能重复执行。

创建临时节点：

```sh
create -e /sanguo/wuguo "zhouyu"
```

创建临时带序号节点：

```sh
create -e -s /sanguo/wuguo "zhouyu"
```

修改节点值：

```sh
set /sanguo/weiguo "simayi"
```

## 监听器及节点删除

### 节点值的监听

客户端：

```sh
get -w /sanguo#监听此节点的值
```

在另一个客户端修改这个节点的值：

```sh
set /sanguo "xishi"
```

监听客户端收到消息：

![image-20210823162822036](/ZooKeeper/image-20210823162822036.png)

::: warning 注意
注册一次只能监听一次变化，如果要再次监听，就要再次注册。
:::

### 节点子节点的监听

客户端：

```sh
ls -w /sanguo
```

另一个客户端修改节点：

```sh
create /sanguo/zhugeliang "zhugeliang"
```

![image-20210823163448114](/ZooKeeper/image-20210823163448114.png)

::: warning 注意
只有监听节点的直接子节点才会被监听，如果是子节点的子节点变化是监听不到的。
:::

### 节点删除及查看

删除单个节点：

```sh
delete /sanguo/zhugeliang
```

递归删除全部子节点：

```sh
deleteall /sanguo
```

查看节点信息：

```sh
stat /zookeeper
```
