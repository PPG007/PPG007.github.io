---
prev:
  text: 首页
  link: /redis
---

# Redis 常用命令

## 基础命令

登录：

```sh
redis-cli -h [host] -p [port] -a [password]
```

判断 key 是否存在：

```sh
150.158.153.216:6379> exists name
(integer) 1
150.158.153.216:6379> exists p
(integer) 0
```

从当前数据库移动到指定数据库：

```sh
150.158.153.216:6379> move test 10
(integer) 1
```

设置过期时间，单位为秒：

```sh
150.158.153.216:6379> expire name 10
(integer) 1
```

查看剩余时间，负数表示已过期，单位为秒：

```sh
150.158.153.216:6379> ttl name
(integer) -2
```

查看剩余时间，单位为毫秒：

```sh
150.158.153.216:6379> pttl name
(integer) 96780
```

设置过期时间，单位为毫秒：

```sh
150.158.153.216:6379> pexpire name 5000
(integer) 1
```

查看 key 的类型：

```sh
150.158.153.216:6379> type name
string
```

删除 key：

```sh
150.158.153.216:6379> del name
(integer) 1
```

取消过期时间：

```sh
150.158.153.216:6379> expire name 100
(integer) 1
150.158.153.216:6379> ttl name
(integer) 97
150.158.153.216:6379> persist name
(integer) 1
150.158.153.216:6379> ttl name
(integer) -1
150.158.153.216:6379> get name
"ppg007"
```

随机获取一个 key：

```sh
150.158.153.216:6379> randomkey
"name"
```

重命名 key：

```sh
150.158.153.216:6379> rename name newname
OK
150.158.153.216:6379> keys *
1) "newname"
```

## String

获取字符串部分内容：

```sh
150.158.153.216:6379> getrange name 0 1
"pp"
```

先获取值再赋值：

```sh
150.158.153.216:6379> getset name PPG
"ppg"
```

通过键获取值：

```sh
150.158.153.216:6379> get name
"PPG"
```

获取字符串长度：

```sh
150.158.153.216:6379> strlen newname
(integer) 6
```

追加字符串，若 key 不存在则相当于 set：

```sh
150.158.153.216:6379> get name
"ppg"
150.158.153.216:6379> append name 007
(integer) 6
150.158.153.216:6379> get name
"ppg007"
```

自增、自减：

```sh
150.158.153.216:6379> set views 0
OK
# 自增
150.158.153.216:6379> incr views
(integer) 1
150.158.153.216:6379> get views
"1"
# 自减
150.158.153.216:6379> decr views
(integer) 0
150.158.153.216:6379> get views
"0"
# 根据步长自增
150.158.153.216:6379> incrby views 100
(integer) 100
150.158.153.216:6379> get views
"100"
# 根据步长自减
150.158.153.216:6379> decrby views 88
(integer) 12
150.158.153.216:6379> get views
"12"
```

使用指定内容替换部分字符：

```sh
150.158.153.216:6379> set key1 hello
OK
150.158.153.216:6379> get key1
"hello"
150.158.153.216:6379> setrange key1 2 tt
(integer) 5
150.158.153.216:6379> get key1
"hetto"
```

设置键值并添加过期时间，单位为秒：

```sh
150.158.153.216:6379> setex name 50 ppg
OK
150.158.153.216:6379> ttl name
(integer) 48
```

设置键值对并添加过期时间，单位为毫秒：

```sh
150.158.153.216:6379> psetex test 10000 test
OK
150.158.153.216:6379> ttl test
(integer) 8
150.158.153.216:6379> pttl test
(integer) 1845
```

set if not exist：

```sh
150.158.153.216:6379> setnx key1 ppp
(integer) 0
```

同时设置多个键值对：

```sh
150.158.153.216:6379> mset user1 ppg user2 eryuan
OK
150.158.153.216:6379> keys *
1) "user1"
2) "user2"
```

同时设置多个键值对，当且仅当所有键均不存在才会生效：

```sh
150.158.153.216:6379> msetnx user1 user1 user3 user3
(integer) 0
150.158.153.216:6379> keys *
1) "user1"
2) "user2"
150.158.153.216:6379> msetnx user3 s user4 e
(integer) 1
150.158.153.216:6379> keys *
1) "user1"
2) "user3"
3) "user2"
4) "user4"
```

同时获取多个值：

```sh
150.158.153.216:6379> mget user1 user2 user3 user4
1) "ppg"
2) "eryuan"
3) "s"
4) "e"
```

## List

从左逐个推入 list，先推入的在最后：

```sh
150.158.153.216:6379> lpush list a b c d e f
(integer) 6
```

获取list中的所有值：

```sh
150.158.153.216:6379> lrange list 0 -1
1) "f"
2) "e"
3) "d"
4) "c"
5) "b"
6) "a"
```

获取指定一部分的值：

```sh
150.158.153.216:6379> lrange list 0 2
1) "f"
2) "e"
3) "d"
```

从右部逐个推入：

```sh
150.158.153.216:6379> rpush list 1 2 3
(integer) 9
150.158.153.216:6379> lrange list 0 -1
1) "f"
2) "e"
3) "d"
4) "c"
5) "b"
6) "a"
7) "1"
8) "2"
9) "3"
```

获取列表长度：

```sh
150.158.153.216:6379> llen list
(integer) 9
```

从列表左部移出一个元素：

```sh
150.158.153.216:6379> lpop list
"f"
150.158.153.216:6379> llen list
(integer) 8
```

从列表右部移出一个元素：

```sh
150.158.153.216:6379> rpop list
"3"
150.158.153.216:6379> llen list
(integer) 7
```

获取指定下标的值：

```sh
150.158.153.216:6379> lindex list 5
"1"
```

移除指定列表的指定数量的值：

```sh
150.158.153.216:6379> lrange test 0 -1
1) "b"
2) "b"
3) "a"
150.158.153.216:6379> lrem test 1 b
(integer) 1
150.158.153.216:6379> lrange test 0 -1
1) "b"
2) "a"
```

修剪列表，让列表只保留指定区间的元素，删除其他元素：

```sh
150.158.153.216:6379> lrange list 0 -1
1) "hh"
2) "e"
3) "d"
4) "c"
5) "b"
6) "a"
7) "1"
8) "2"
150.158.153.216:6379> ltrim list 1 5
OK
150.158.153.216:6379> lrange list 0 -1
1) "e"
2) "d"
3) "c"
4) "b"
5) "a"
```

移出列表的最后一个元素，并将其添加到另一个列表：

```sh
150.158.153.216:6379> rpoplpush list newlist
"a"
150.158.153.216:6379> lrange list 0 -1
1) "e"
2) "d"
3) "c"
4) "b"
150.158.153.216:6379> lrange newlist 0 -1
1) "a"
```

根据下标更改元素的值，列表必须已存在：

```sh
150.158.153.216:6379> lset list 0 ee
OK
150.158.153.216:6379> lrange list 0 -1
1) "ee"
2) "d"
3) "c"
4) "b"
```

将某个值插入列表中某个元素的前面或后面：

```sh
150.158.153.216:6379> linsert list before ee ll
(integer) 5
150.158.153.216:6379> lrange list 0 -1
1) "ll"
2) "ee"
3) "d"
4) "c"
5) "b"
150.158.153.216:6379> linsert list after ee ff
(integer) 6
150.158.153.216:6379> lrange list 0 -1
1) "ll"
2) "ee"
3) "ff"
4) "d"
5) "c"
6) "b"
```

## Set

创建并添加元素：

```sh
150.158.153.216:6379> sadd set a b c
(integer) 3
150.158.153.216:6379> sadd set d e f
(integer) 3
```

查看所有的元素：

```sh
150.158.153.216:6379> smembers set
1) "d"
2) "a"
3) "f"
4) "e"
5) "b"
6) "c"
```

判断是否是集合中的元素：

```sh
150.158.153.216:6379> sismember set a
(integer) 1
```

获取元素个数：

```sh
150.158.153.216:6379> scard set
(integer) 6
```

根据值删除元素：

```sh
150.158.153.216:6379> srem set a b
(integer) 2
```

随机获取集合中的值：

```sh
150.158.153.216:6379> srandmember set
"d"
150.158.153.216:6379> srandmember set 2
1) "f"
2) "e"
```

随机删除集合中的元素：

```sh
150.158.153.216:6379> spop set
"f"
150.158.153.216:6379> spop set 2
1) "d"
2) "c"
150.158.153.216:6379> smembers set
1) "e"
```

将指定的元素移动到另一个集合：

```sh
150.158.153.216:6379> sadd char a b c d
(integer) 4
150.158.153.216:6379> sadd int 1 2 3 4
(integer) 4
150.158.153.216:6379> smove char int a
(integer) 1
150.158.153.216:6379> smembers char
1) "c"
2) "b"
3) "d"
150.158.153.216:6379> smembers int
1) "2"
2) "4"
3) "3"
4) "1"
5) "a"
```

集合运算：

```sh
150.158.153.216:6379> smembers char
1) "2"
2) "c"
3) "b"
4) "d"
150.158.153.216:6379> smembers int
1) "4"
2) "3"
3) "1"
4) "2"
5) "d"
6) "a"
# 得到差集
150.158.153.216:6379> sdiff char int
1) "b"
2) "c"
# 得到差集并将差集存储在集合def中
150.158.153.216:6379> sdiffstore def char int
(integer) 2
150.158.153.216:6379> smembers def
1) "b"
2) "c"
# 得到交集
150.158.153.216:6379> sinter int char
1) "2"
2) "d"
# 得到交集并将其存储在集合inter中
150.158.153.216:6379> sinterstore inter int char
(integer) 2
150.158.153.216:6379> smembers inter
1) "2"
2) "d"
# 获取并集
150.158.153.216:6379> sunion int char
1) "2"
2) "3"
3) "d"
4) "b"
5) "c"
6) "1"
7) "a"
8) "4"
# 获取并集并将其存储在集合union中
150.158.153.216:6379> sunionstore union int char
(integer) 8
150.158.153.216:6379> smembers union
1) "2"
2) "3"
3) "d"
4) "b"
5) "c"
6) "1"
7) "a"
8) "4"
```

## Hash

向hash中添加键值对：

```sh
150.158.153.216:6379> hset user name ppg
(integer) 1
150.158.153.216:6379> hset user age 21
(integer) 1
```

获取指定hash中的键对应的值：

```sh
150.158.153.216:6379> hget user name
"ppg"
150.158.153.216:6379> hget user age
"21"
```

同时设置多个键值对：

```sh
150.158.153.216:6379> hmset user f v f1 v1
OK
```

同时获取多个键对应的值：

```sh
150.158.153.216:6379> hmget user f f1 name age
1) "v"
2) "v1"
3) "ppg"
4) "21"
```

获取指定hash中所有的键值对，上为键，下为值：

```sh
150.158.1532.16:6379> hgetall user
1) "name"
2) "ppg"
3) "age"
4) "21"
5) "f"
6) "v"
7) "f1"
8) "v1"
```

删除一个或多个哈希表字段：

```sh
150.158.153.216:6379> hdel user f f1
(integer) 2
150.158.153.216:6379> hgetall user
1) "name"
2) "ppg"
3) "age"
4) "21"
```

获取哈希表中字段的数量：

```sh
150.158.153.216:6379> hlen user
(integer) 2
```

查看哈希表 key 中，指定的字段是否存在：

```sh
150.158.153.216:6379> hexists user name
(integer) 1
```

获取所有哈希表中的字段：

```sh
150.158.153.216:6379> hkeys user
1) "name"
2) "age"
```

只有在字段 field 不存在时，设置哈希表字段的值：

```sh
150.158.153.216:6379> hsetnx user test test
(integer) 1
150.158.153.216:6379> hgetall user
1) "name"
2) "ppg"
3) "age"
4) "21"
5) "test"
6) "test"
```

获取哈希表中所有值：

```sh
150.158.153.216:6379> hvals user
1) "ppg"
2) "21"
3) "test"
```

为哈希表 key 中的指定字段的整数值加上增量 increment：

```sh
150.158.153.216:6379> hincrby user age 2
(integer) 23
150.158.153.216:6379> hget user age
"23"
150.158.153.216:6379> hincrby user age -2
(integer) 21
```

为哈希表 key 中的指定字段的浮点数值加上增量 increment：

```sh
150.158.153.216:6379> hget user money
"2.2"
150.158.153.216:6379> hincrbyfloat user money 1.8
"4"
150.158.153.216:6379> hincrbyfloat user money 1.1
"5.1"
150.158.153.216:6379> hincrbyfloat user money -4.1
"1"
```

## ZSet

向有序集合添加一个或多个成员，或者更新已存在成员的分数：

```sh
150.158.153.216:6379> zadd score 100 a 90 b 60 c
(integer) 3
```

返回有序集中，成员的分数值：

```sh
150.158.153.216:6379> zscore score a
"100"
```

返回有序集合中指定成员的索引：

```sh
150.158.153.216:6379> zrank score a
(integer) 1
150.158.153.216:6379> zrank score b
(integer) 0
150.158.153.216:6379> zrank score s
(nil)
# 有序集成员按分数值递减(从大到小)排序
150.158.153.216:6379> zrevrank score a
(integer) 0
```

查看元素个数：

```sh
150.158.153.216:6379> zcard score
(integer) 2
```

获取指定区间的元素数量：

```sh
150.158.153.216:6379> zcount score 0 100
(integer) 2
150.158.153.216:6379> zcount score 0 (100
(integer) 1
```

在有序集合中计算指定字典区间内成员数量：

```sh
150.158.153.216:6379> zlexcount score +
(integer) 2
150.158.153.216:6379> zlexcount score [a [z
(integer) 2
```

通过索引区间返回有序集合指定区间内的成员：

```sh
150.158.153.216:6379> zrange score 0 -1
1) "b"
2) "a"
```

通过字典区间返回有序集合的成员：

```sh
150.158.153.216:6379> zrangebylex score [a [z
1) "b"
2) "a"
```

通过分数顺序返回有序集合指定区间内的成员：

```sh
# 升序
150.158.153.216:6379> zrangebyscore score -inf +inf
1) "c"
2) "b"
3) "a"
150.158.153.216:6379> zrangebyscore score -inf +inf withscores
1) "c"
2) "60"
3) "b"
4) "90"
5) "a"
6) "100"
# 开区间
150.158.153.216:6379> zrangebyscore score (60 (100
1) "b"
# 降序，通过索引
150.158.153.216:6379> zrevrange score 0 -1
1) "a"
2) "b"
# 降序，通过分数
150.158.153.216:6379> zrevrangebyscore bset +inf 8
1) "d"
```

移除一个元素：

```sh
150.158.153.216:6379> zrem score c
(integer) 1
```

移除有序集合中给定的字典区间的所有成员：

```sh
150.158.153.216:6379> zremrangebylex aset [a [z
(integer) 3
150.158.153.216:6379> zrange aset 0 -1
(empty list or set)
```

移除有序集合中给定的排名区间的所有成员：

```sh
150.158.153.216:6379> zremrangebyrank bset 0 1
(integer) 2
150.158.153.216:6379> zrange bset 0 -1 withscores
1) "d"
2) "9"
```

移除有序集合中给定的分数区间的所有成员：

```sh
150.158.153.216:6379> zremrangebyscore score 0 100
(integer) 2
```

有序集合中对指定成员的分数加上增量 increment：

```sh
150.158.153.216:6379> zincrby score 5 b
"95"
```

计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 destination 中：

```sh
# 其中给定 key 的数量必须以 numkeys 参数指定
# 默认情况下，结果集中某个成员的分数值是所有给定集下该成员分数值之和。
150.158.153.216:6379> zadd aset 0 a 1 b 2 c
(integer) 3
150.158.153.216:6379> zadd bset 9 d 8 e 7 f
(integer) 3
150.158.153.216:6379> zinterstore newset 3 aset bset
(error) ERR syntax error
150.158.153.216:6379> zinterstore newset 2 aset bset
(integer) 0
```

计算给定的一个或多个有序集的并集，并存储在新的 key 中：

```sh
150.158.153.216:6379> zadd aset 1 one 2 two
(integer) 2
150.158.153.216:6379> zadd bset 2 two 3 three
(integer) 2
150.158.153.216:6379> zunionstore union 2 aset bset
(integer) 5
150.158.153.216:6379> zrange union 0 -1
1) "one"
2) "three"
3) "two"
4) "ppg"
5) "d"
```

## Geospatial 地理位置

添加地理位置的坐标，将一个或多个经度(longitude)、纬度(latitude)、位置名称(member)添加到指定的 key 中：

```sh
150.158.153.216:6379> geoadd china 120.39629 36.30744 qingdao 116.75199 36.55358 jinan 116.23128 40.22077 beijing
(integer) 3
150.158.153.216:6379> geoadd china 121.48941 31.40527 shanghai
(integer) 1
```

获取地理位置的坐标：

```sh
150.158.153.216:6379> geopos china qingdao jinan
1) 1) "120.39629191160202026"
   1) "36.30744093841460796"
2) 1) "116.75199061632156372"
   1) "36.55358010603453778"
```

计算两个位置之间的距离：

```sh
# 默认单位：米
150.158.153.216:6379> geodist china qingdao jinan
"327256.3444"
# 千米
150.158.153.216:6379> geodist china qingdao jinan km
"327.2563"
# 英里
150.158.153.216:6379> geodist china qingdao jinan mi
"203.3482"
# 英尺
150.158.153.216:6379> geodist china qingdao jinan ft
"1073675.6708"
```

根据用户给定的经纬度坐标来获取指定范围内的地理位置集合：

georadius 以给定的经纬度为中心， 返回键包含的位置元素当中， 与中心的距离不超过给定最大距离的所有位置元素。

```sh
# 返回距离
150.158.153.216:6379> georadius china 120.39629191160202026 36.30744093841460796 600 km withdist
1) 1) "jinan"
   2) "327.2563"
2) 1) "qingdao"
   2) "0.0000"
3) 1) "beijing"
   2) "567.0876"
4) 1) "shanghai"
   2) "554.5067"
# 返回坐标
150.158.153.216:6379> georadius china 120.39629191160202026 36.30744093841460796 600 km withcoord
1) 1) "jinan"
   2) 1) "116.75199061632156372"
      2) "36.55358010603453778"
2) 1) "qingdao"
   2) 1) "120.39629191160202026"
      2) "36.30744093841460796"
3) 1) "beijing"
   2) 1) "116.23128265142440796"
      2) "40.22076905438526495"
4) 1) "shanghai"
   2) 1) "121.48941010236740112"
      2) "31.40526993848380499"
# 以 52 位有符号整数的形式， 返回位置元素经过原始 geohash 编码的有序集合分值
150.158.153.216:6379> georadius china 120.39629191160202026 36.30744093841460796 600 km withhash
1) 1) "jinan"
   2) (integer) 4065925327244128
2) 1) "qingdao"
   2) (integer) 4067559165114427
3) 1) "beijing"
   2) (integer) 4069896088584598
4) 1) "shanghai"
   2) (integer) 4054807796443227
# 限定返回值数量，asc距离从近到远排序
150.158.153.216:6379> georadius china 120.39629191160202026 36.30744093841460796 600 km withdist count 3 asc
1) 1) "qingdao"
   2) "0.0000"
2) 1) "jinan"
   2) "327.2563"
3) 1) "shanghai"
   2) "554.5067"
# 限定返回数量，desc距离从远到近排序
150.158.153.216:6379> georadius china 120.39629191160202026 36.30744093841460796 600 km withdist count 3 desc
1) 1) "beijing"
   2) "567.0876"
2) 1) "shanghai"
   2) "554.5067"
3) 1) "jinan"
   2) "327.2563"
```

根据储存在位置集合里面的某个地点获取指定范围内的地理位置集合：

```sh
150.158.153.216:6379> georadiusbymember china jinan 500 km withdist count 3 asc
1) 1) "jinan"
   1) "0.0000"
2) 1) "qingdao"
   1) "327.2563"
3) 1) "beijing"
   1) "410.4039"
```

返回一个或多个位置对象的 geohash 值：

```sh
150.158.153.216:6379> geohash china qingdao jinan beijing shanghai
1) "wwmwe9tfhv0"
2) "ww7pby2hn90"
3) "wx4sucvncn0"
4) "wtw6st1uuq0"
```

## Hyperloglog 基数统计

添加指定元素到 HyperLogLog 中：

```sh
150.158.153.216:6379> pfadd a 1 2 3 4 5
(integer) 1
150.158.153.216:6379> pfadd b 4 5 6 7 8 9 0
(integer) 1
```

返回给定 HyperLogLog 的基数估算值：

```sh
150.158.153.216:6379> pfcount a
(integer) 5
150.158.153.216:6379> pfcount b
(integer) 7
150.158.153.216:6379> pfcount a b
(integer) 10
```

将多个 HyperLogLog 合并为一个 HyperLogLog：

```sh
150.158.153.216:6379> pfmerge dest a b
OK
150.158.153.216:6379> pfcount dest
(integer) 10
```

## Bitmap 位图

添加元素：

```sh
150.158.153.216:6379> setbit sign 1 0
(integer) 0
150.158.153.216:6379> setbit sign 2 1
(integer) 0
150.158.153.216:6379> setbit sign 3 1
(integer) 0
150.158.153.216:6379> setbit sign 4 0
(integer) 0
150.158.153.216:6379> setbit sign 5 0
(integer) 0
150.158.153.216:6379> setbit sign 6 1
(integer) 0
150.158.153.216:6379> setbit sign 7 0
```

获取值：

```sh
150.158.153.216:6379> getbit sign 6
(integer) 1
```

统计 1 的个数：

```sh
150.158.153.216:6379> bitcount sign
(integer) 3
```
