# 1.Redis常用命令
### 1.1 基础命令
- 登录
```bash
redis-cli -h [host] -p [port] -a [password]
```
- 判断key是否存在
```bash
150.158.153.216:6379> exists name
(integer) 1
150.158.153.216:6379> exists p
(integer) 0
```
- 从当前数据库移动到指定数据库
```bash
150.158.153.216:6379> move test 10
(integer) 1
```
- 设置过期时间，单位为秒
```bash
150.158.153.216:6379> expire name 10
(integer) 1
```
- 查看剩余时间，负数表示已过期，单位为秒
```bash
150.158.153.216:6379> ttl name
(integer) -2
```
- 查看剩余时间，单位为毫秒
```bash
150.158.153.216:6379> pttl name
(integer) 96780
```
- 设置过期时间，单位为毫秒
```bash
150.158.153.216:6379> pexpire name 5000
(integer) 1
```
- 查看key的类型
```bash
150.158.153.216:6379> type name
string
```
- 删除key
```bash
150.158.153.216:6379> del name
(integer) 1
```
- 取消过期时间
```bash
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
- 随机获取一个key
```bash
150.158.153.216:6379> randomkey
"name"
```
- 重命名key
```bash
150.158.153.216:6379> rename name newname
OK
150.158.153.216:6379> keys *
1) "newname"
```
### 1.2 String
- 获取字符串部分内容
```shell
150.158.153.216:6379> getrange name 0 1
"pp"
```
- 先获取值再赋值
```shell
150.158.153.216:6379> getset name PPG
"ppg"
```
- 通过键获取值
```shell
150.158.153.216:6379> get name
"PPG"
```
- 获取字符串长度
```shell
150.158.153.216:6379> strlen newname
(integer) 6
```
- 追加字符串，若key不存在则相当于set
```shell
150.158.153.216:6379> get name
"ppg"
150.158.153.216:6379> append name 007
(integer) 6
150.158.153.216:6379> get name
"ppg007"
```
- 自增、自减
```shell
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
- 使用指定内容替换部分字符
```shell
150.158.153.216:6379> set key1 hello
OK
150.158.153.216:6379> get key1
"hello"
150.158.153.216:6379> setrange key1 2 tt
(integer) 5
150.158.153.216:6379> get key1
"hetto"
```
- 设置键值并添加过期时间，单位为秒
```shell
150.158.153.216:6379> setex name 50 ppg
OK
150.158.153.216:6379> ttl name
(integer) 48
```
- 设置键值对并添加过期时间，单位为毫秒
```shell
150.158.153.216:6379> psetex test 10000 test
OK
150.158.153.216:6379> ttl test
(integer) 8
150.158.153.216:6379> pttl test
(integer) 1845
```
- set if not exist
```shell
150.158.153.216:6379> setnx key1 ppp
(integer) 0
```
- 同时设置多个键值对
```shell
150.158.153.216:6379> mset user1 ppg user2 eryuan
OK
150.158.153.216:6379> keys *
1) "user1"
2) "user2"
```
- 同时设置多个键值对，当且仅当所有键均不存在才会生效
```shell
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
- 同时获取多个值
```shell
150.158.153.216:6379> mget user1 user2 user3 user4
1) "ppg"
2) "eryuan"
3) "s"
4) "e"
```
### 1.2 List
- 从左逐个推入list，先推入的在最后
```shell
150.158.153.216:6379> lpush list a b c d e f
(integer) 6
```
- 获取list中的所有值
```shell
150.158.153.216:6379> lrange list 0 -1
1) "f"
2) "e"
3) "d"
4) "c"
5) "b"
6) "a"
```
- 获取指定一部分的值
```shell
150.158.153.216:6379> lrange list 0 2
1) "f"
2) "e"
3) "d"
```
- 从右部逐个推入
```shell
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
- 获取列表长度
```shell
150.158.153.216:6379> llen list
(integer) 9
```
- 从列表左部移出一个元素
```shell
150.158.153.216:6379> lpop list
"f"
150.158.153.216:6379> llen list
(integer) 8
```
- 从列表右部移出一个元素
```shell
150.158.153.216:6379> rpop list
"3"
150.158.153.216:6379> llen list
(integer) 7
```
- 获取指定下标的值
```shell
150.158.153.216:6379> lindex list 5
"1"
```
- 移除指定列表的指定数量的值
```shell
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
- 修剪列表，让列表只保留指定区间的元素，删除其他元素
```shell
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
- 移出列表的最后一个元素，并将其添加到另一个列表
```shell
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
- 根据下标更改元素的值，列表必须已存在
```shell
150.158.153.216:6379> lset list 0 ee
OK
150.158.153.216:6379> lrange list 0 -1
1) "ee"
2) "d"
3) "c"
4) "b"
```
- 将某个值插入列表中某个元素的前面或后面
```shell
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
### 1.3 Set
- 创建并添加元素
```shell
150.158.153.216:6379> sadd set a b c
(integer) 3
150.158.153.216:6379> sadd set d e f
(integer) 3
```
- 查看所有的元素
```shell
150.158.153.216:6379> smembers set
1) "d"
2) "a"
3) "f"
4) "e"
5) "b"
6) "c"
```
- 判断是否是集合中的元素
```shell
150.158.153.216:6379> sismember set a
(integer) 1
```
- 获取元素个数
```shell
150.158.153.216:6379> scard set
(integer) 6
```
- 根据值删除元素
```shell
150.158.153.216:6379> srem set a b
(integer) 2
```
- 随机获取集合中的值
```shell
150.158.153.216:6379> srandmember set
"d"
150.158.153.216:6379> srandmember set 2
1) "f"
2) "e"
```
- 随机删除集合中的元素
```shell
150.158.153.216:6379> spop set
"f"
150.158.153.216:6379> spop set 2
1) "d"
2) "c"
150.158.153.216:6379> smembers set
1) "e"
```
- 将指定的元素移动到另一个集合
```shell
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
- 集合运算
```shell
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
### 1.4 Hash
- 向hash中添加键值对
```shell
150.158.153.216:6379> hset user name ppg
(integer) 1
150.158.153.216:6379> hset user age 21
(integer) 1
```
- 获取指定hash中的键对应的值
```shell
150.158.153.216:6379> hget user name
"ppg"
150.158.153.216:6379> hget user age
"21"
```
- 同时设置多个键值对
```shell
150.158.153.216:6379> hmset user f v f1 v1
OK
```
- 同时获取多个键对应的值
```shell
150.158.153.216:6379> hmget user f f1 name age
1) "v"
2) "v1"
3) "ppg"
4) "21"
```
- 获取指定hash中所有的键值对，上为键，下为值
```shell
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
- 删除一个或多个哈希表字段
```shell
150.158.153.216:6379> hdel user f f1
(integer) 2
150.158.153.216:6379> hgetall user
1) "name"
2) "ppg"
3) "age"
4) "21"
```
- 获取哈希表中字段的数量
```shell
150.158.153.216:6379> hlen user
(integer) 2
```
- 查看哈希表 key 中，指定的字段是否存在。
```shell
150.158.153.216:6379> hexists user name
(integer) 1
```
- 获取所有哈希表中的字段
```shell
150.158.153.216:6379> hkeys user
1) "name"
2) "age"
```
- 只有在字段 field 不存在时，设置哈希表字段的值。
```shell
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
- 获取哈希表中所有值。
```shell
150.158.153.216:6379> hvals user
1) "ppg"
2) "21"
3) "test"
```
- 为哈希表 key 中的指定字段的整数值加上增量 increment 。
```shell
150.158.153.216:6379> hincrby user age 2
(integer) 23
150.158.153.216:6379> hget user age
"23"
150.158.153.216:6379> hincrby user age -2
(integer) 21
```
- 为哈希表 key 中的指定字段的浮点数值加上增量 increment
```shell
150.158.153.216:6379> hget user money
"2.2"
150.158.153.216:6379> hincrbyfloat user money 1.8
"4"
150.158.153.216:6379> hincrbyfloat user money 1.1
"5.1"
150.158.153.216:6379> hincrbyfloat user money -4.1
"1"
```
### 1.5 ZSet
- 向有序集合添加一个或多个成员，或者更新已存在成员的分数
```shell
150.158.153.216:6379> zadd score 100 a 90 b 60 c
(integer) 3
```
- 返回有序集中，成员的分数值
```shell
150.158.153.216:6379> zscore score a
"100"
```
- 返回有序集合中指定成员的索引
```shell
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
- 查看元素个数
```shell
150.158.153.216:6379> zcard score
(integer) 2
```
- 获取指定区间的元素数量
```shell
150.158.153.216:6379> zcount score 0 100
(integer) 2
150.158.153.216:6379> zcount score 0 (100
(integer) 1
```
- 在有序集合中计算指定字典区间内成员数量
```shell
150.158.153.216:6379> zlexcount score - +
(integer) 2
150.158.153.216:6379> zlexcount score [a [z
(integer) 2
```
- 通过索引区间返回有序集合指定区间内的成员
```shell
150.158.153.216:6379> zrange score 0 -1
1) "b"
2) "a"
```
- 通过字典区间返回有序集合的成员
```shell
150.158.153.216:6379> zrangebylex score [a [z
1) "b"
2) "a"
```
- 通过分数顺序返回有序集合指定区间内的成员
```shell
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
- 移除一个元素
```shell
150.158.153.216:6379> zrem score c
(integer) 1
```
- 移除有序集合中给定的字典区间的所有成员
```shell
150.158.153.216:6379> zremrangebylex aset [a [z
(integer) 3
150.158.153.216:6379> zrange aset 0 -1
(empty list or set)
```
- 移除有序集合中给定的排名区间的所有成员
```shell
150.158.153.216:6379> zremrangebyrank bset 0 1
(integer) 2
150.158.153.216:6379> zrange bset 0 -1 withscores
1) "d"
2) "9"
```
- 移除有序集合中给定的分数区间的所有成员
```shell
150.158.153.216:6379> zremrangebyscore score 0 100
(integer) 2
```
- 有序集合中对指定成员的分数加上增量 increment
```shell
150.158.153.216:6379> zincrby score 5 b
"95"
```
- 计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 destination 中
```shell
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
- 计算给定的一个或多个有序集的并集，并存储在新的 key 中
```shell
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
### 1.6 Geospatial地理位置
- 添加地理位置的坐标。
>将一个或多个经度(longitude)、纬度(latitude)、位置名称(member)添加到指定的 key 中
```shell
150.158.153.216:6379> geoadd china 120.39629 36.30744 qingdao 116.75199 36.55358 jinan 116.23128 40.22077 beijing
(integer) 3
150.158.153.216:6379> geoadd china 121.48941 31.40527 shanghai
(integer) 1
```
- 获取地理位置的坐标。
```shell
150.158.153.216:6379> geopos china qingdao jinan
1) 1) "120.39629191160202026"
   2) "36.30744093841460796"
2) 1) "116.75199061632156372"
   2) "36.55358010603453778"
```
- 计算两个位置之间的距离。
```shell
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
- 根据用户给定的经纬度坐标来获取指定范围内的地理位置集合。
>georadius 以给定的经纬度为中心， 返回键包含的位置元素当中， 与中心的距离不超过给定最大距离的所有位置元素。
```shell
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
- 根据储存在位置集合里面的某个地点获取指定范围内的地理位置集合。
```shell
150.158.153.216:6379> georadiusbymember china jinan 500 km withdist count 3 asc
1) 1) "jinan"
   2) "0.0000"
2) 1) "qingdao"
   2) "327.2563"
3) 1) "beijing"
   2) "410.4039"
```
- 返回一个或多个位置对象的 geohash 值。
```shell
150.158.153.216:6379> geohash china qingdao jinan beijing shanghai
1) "wwmwe9tfhv0"
2) "ww7pby2hn90"
3) "wx4sucvncn0"
4) "wtw6st1uuq0"
```
### 1.7 Hyperloglog基数统计
- 添加指定元素到 HyperLogLog 中
```shell
150.158.153.216:6379> pfadd a 1 2 3 4 5
(integer) 1
150.158.153.216:6379> pfadd b 4 5 6 7 8 9 0
(integer) 1
```
- 返回给定 HyperLogLog 的基数估算值。
```shell
150.158.153.216:6379> pfcount a
(integer) 5
150.158.153.216:6379> pfcount b
(integer) 7
150.158.153.216:6379> pfcount a b
(integer) 10
```
- 将多个 HyperLogLog 合并为一个 HyperLogLog
```shell
150.158.153.216:6379> pfmerge dest a b
OK
150.158.153.216:6379> pfcount dest
(integer) 10
```
### 1.8 Bitmap位图
- 添加元素
```shell
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
- 获取值
```shell
150.158.153.216:6379> getbit sign 6
(integer) 1
```
- 统计1的个数
```shell
150.158.153.216:6379> bitcount sign
(integer) 3
```
# 2.Redis操作事务
==redis单条命令保证原子性==
==但是事务不保证原子性==
==一次性、顺序性、排他性==
### 2.1 Redis事务阶段
- 开启事务(MULTI)
- 命令入队
- 执行事务(EXEC)
### 2.2 基础命令
- 创建事务
```shell
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
- 执行事务
```shell
150.158.153.216:6379> exec
1) OK
2) OK
3) "key1"
4) OK
```
- 取消事务
```shell
150.158.153.216:6379> multi
OK
150.158.153.216:6379> set a a
QUEUED
150.158.153.216:6379> discard
OK
150.158.153.216:6379> get a
(nil)
```
### 2.3 事务中的异常
- 语法错误
```shell
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
- 操作错误(运行时异常)
```shell
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
### 2.4 乐观锁
==通过watch和unwatch命令开启/关闭对key的监视==
- 正常执行
```shell
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
- 异常执行

客户端1
```shell
150.158.153.216:6379> watch money out
OK
150.158.153.216:6379> multi
OK
150.158.153.216:6379> decrby money 5
QUEUED
150.158.153.216:6379> incrby out 5
QUEUED
```
客户端1的事务先不执行，此时插入客户端2的操作
客户端2
```shell
150.158.153.216:6379> decrby out 10
(integer) 10
```
然后客户端1再执行：
```shell
150.158.153.216:6379> exec
(nil)
150.158.153.216:6379> get money
"80"
```
==事务没有执行==
>如果希望再次执行事务，先用unwatch解锁再使用watch重新加锁
# 3.Jedis
### 3.1 相关依赖
```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.5.2</version>
</dependency>
```
### 3.2 使用Jedis操作Redis
##### 3.2.1 String类型
```java
public void stringTest(){
//        创建Jedis对象，连接Redis
   Jedis jedis = new Jedis("150.158.153.216",6379);
//        通过密码认证
   String auth = jedis.auth("123456");
//        打印认证结果
   System.out.println(auth);
//        连通性测试
   String pong = jedis.ping();
   System.out.println(pong);
//        增加键值对
   jedis.set("name","ppg");
//        获取value
   System.out.println(jedis.get("name"));
//        追加字符串
   jedis.append("name","007");
   System.out.println(jedis.get("name"));
//        查看所有的键
   System.out.println(jedis.keys("*"));
//        删除键值对
   System.out.println(jedis.del("name"));
//        存在性判断
   jedis.exists("name","test");
   jedis.set("name","name");
//        移动键值对到其他数据库
   jedis.move("name",10);
//        跳转数据库
   jedis.select(10);
//        设置过期时间
   jedis.expire("name",200);
//        查看剩余时间
   System.out.println(jedis.ttl("name"));
//        取消过期时间
   jedis.persist("name");
//        随机获取一个key
   System.out.println(jedis.randomKey());
//        重命名key
   jedis.set("old","rename");
   jedis.rename("old","new");
//        获取字符串部分内容
   jedis.getrange("name",0,1);
//        先获取值再赋值
   jedis.getSet("name","PPG");
//        设置键值并添加过期时间，单位为秒
   jedis.setex("setex",10,"setex");
//        设置键值对并添加过期时间，单位为毫秒
   jedis.psetex("psetex",100000,"psetex");
//        set if not exist
   jedis.setnx("name","name");
//        同时设置多个键值对
   jedis.mset("user1","user1","user2","user2");
//        同时设置多个键值对，当且仅当所有键均不存在才会生效
   jedis.msetnx("user1","user1","user2","user2");
//        同时获取多个值
   List<String> mget = jedis.mget("user1", "user2");
   mget.forEach(System.out::println);
   
//        查看value类型
   System.out.println(jedis.type("name"));
//        查看value长度
   System.out.println(jedis.strlen("name"));
//        使用指定内容替换部分字符
   jedis.setrange("name",1,"ssss");
   System.out.println(jedis.get("name"));
   jedis.set("age","20");
//        单步自增
   jedis.incr("age");
   System.out.println(jedis.get("age"));
//        批量自增
   jedis.incrBy("age",20);
   System.out.println(jedis.get("age"));
//        单步自减
   jedis.decr("age");
   System.out.println(jedis.get("age"));
//        批量自减
   jedis.decrBy("age",20);
   System.out.println(jedis.get("age"));
//        清空当前数据库
   jedis.flushDB();
//        清空所有数据
   jedis.flushAll();
      //  关闭连接
   jedis.close();
}
```
##### 3.2.2 List类型
```java
public void listTest(){
//        创建Jedis对象，连接Redis
   Jedis jedis = new Jedis("150.158.153.216",6379);
//        通过密码认证
   jedis.auth("123456");
//        从左逐个推入list，先推入的在最后
   jedis.lpush("list","a","b","c","d","e","f");
//        获取list中的所有值
   List<String> list = jedis.lrange("list", 0, -1);
   list.forEach(System.out::println);
//        获取指定一部分的值
   jedis.lrange("list",0,2).forEach(System.out::println);
//        从右部逐个推入
   jedis.rpush("list","1","2","3");
//        获取列表长度
   System.out.println(jedis.llen("list"));
//        从列表左部移出一个元素
   System.out.println(jedis.lpop("list"));
//        从列表右部移出一个元素
   System.out.println(jedis.rpop("list"));
//        获取指定下标的值
   System.out.println(jedis.lindex("list", 2));
//        移除指定列表的指定数量的值
   jedis.lrem("list",1,"b");
//        修剪列表，让列表只保留指定区间的元素，删除其他元素
   jedis.ltrim("list",1,5);
//        移出列表的最后一个元素，并将其添加到另一个列表
   jedis.rpoplpush("list","newList");
//        根据下标更改元素的值，列表必须已存在
   jedis.lset("list",0,"ee");
//        将某个值插入列表中某个元素的前面或后面
   jedis.linsert("list", ListPosition.BEFORE,"ee","ll");
//        清空当前数据库
   jedis.flushDB();
//        清空所有数据
   jedis.flushAll();
//        关闭连接
   jedis.close();
}
```
##### 3.2.3 Set类型
```java
public void setTest(){
//        创建Jedis对象，连接Redis
   Jedis jedis = new Jedis("150.158.153.216",6379);
//        通过密码认证
   jedis.auth("123456");
//        创建并添加元素
   jedis.sadd("set","a","b","c");
   jedis.sadd("set","d","e","f");
//        查看所有元素
   jedis.smembers("set").forEach(System.out::println);
//        判断是否是集合中的元素
   jedis.sismember("set","test");
//        获取元素个数
   jedis.scard("set");
//        根据值删除元素
   jedis.srem("set","a","b");
//        随机获取集合中的值
   jedis.srandmember("set");
   jedis.srandmember("set",2);
//        随机删除集合中的元素
   jedis.spop("set");
   jedis.spop("set",2);
//        将指定的元素移动到另一个集合
   jedis.sadd("char","a","b","c","d");
   jedis.sadd("int","1","2","3","4");
   jedis.smove("char","int","a");
//        求差集
   jedis.sdiff("char","int");
//        求差集并将结果存储在集合def中
   jedis.sdiffstore("def","char","int");
//        求交集
   jedis.sinter("char","int");
//        求交集并将结果存储在结合inter中
   jedis.sinterstore("inter","char","int");
//        求并集
   jedis.sunion("char","int");
//        求并集并将结果储存在集合union中
   jedis.sunionstore("union","char","int");
//        清空当前数据库
   jedis.flushDB();
//        清空所有数据
   jedis.flushAll();
//        关闭连接
   jedis.close();
}
```
##### 3.2.4 Hash类型
```java
public void hashTest(){
//        创建Jedis对象，连接Redis
   Jedis jedis = new Jedis("150.158.153.216",6379);
//        通过密码认证
   jedis.auth("123456");
//        向hash中添加键值对
   jedis.hset("user","name","ppg");
   jedis.hset("user","age","21");
   jedis.hset("user","money","20.2");
//        获取指定hash中的键对应的值
   jedis.hget("user","name");
//        同时设置多个键值对
   HashMap<String, String> stringStringHashMap = new HashMap<>();
   stringStringHashMap.put("f1","v1");
   stringStringHashMap.put("f2","v2");
   jedis.hmset("user",stringStringHashMap);
//        同时获取多个键对应的值
   jedis.hmget("user","name","age").forEach(System.out::println);
//        获取指定hash中所有的键值对
   Map<String, String> map = jedis.hgetAll("user");
   map.forEach((s, s2) -> System.out.println(s+" "+s2));
//        删除一个或多个哈希表字段
   jedis.hdel("user","f1","f2");
//        获取哈希表中字段的数量
   jedis.hlen("user");
//        查看哈希表 key 中，指定的字段是否存在。
   jedis.hexists("user","name");
//        获取所有哈希表中的字段
   jedis.hkeys("user");
//        只有在字段 field 不存在时，设置哈希表字段的值。
   jedis.hsetnx("user","test","test");
//        获取哈希表中所有值。
   jedis.hvals("user");
//        为哈希表 key 中的指定字段的整数值加上增量 increment 。
   jedis.hincrBy("user","age",2);
   jedis.hincrBy("user","age",-2);
//        为哈希表 key 中的指定字段的浮点数值加上增量 increment
   jedis.hincrByFloat("user","money",1.1);
   jedis.hincrByFloat("user","money",-2.2);
//        清空当前数据库
   jedis.flushDB();
//        清空所有数据
   jedis.flushAll();
//        关闭连接
   jedis.close();
}
```
##### 3.2.5 ZSet类型
```java
public void zSetTest(){
//        创建Jedis对象，连接Redis
   Jedis jedis = new Jedis("150.158.153.216",6379);
//        通过密码认证
   jedis.auth("123456");
//        向有序集合添加一个或多个成员，或者更新已存在成员的分数
   HashMap<String, Double> scoreMembers = new HashMap<>();
   scoreMembers.put("a", 100d);
   scoreMembers.put("b",99d);
   scoreMembers.put("c",60d);
   jedis.zadd("score",scoreMembers);
//        返回有序集中，成员的分数值
   jedis.zscore("score","a");
//        返回有序集合中指定成员的索引
   jedis.zrank("score","a");
//        有序集成员按分数值递减(从大到小)排序
   jedis.zrevrank("score","a");
//        查看元素个数
   jedis.zcard("score");
//        获取指定区间的元素数量,不能用[
   System.out.println(jedis.zcount("score", "0", "(100"));
//        在有序集合中计算指定字典区间内成员数量
   System.out.println(jedis.zlexcount("score", "-", "+"));
   System.out.println(jedis.zlexcount("score", "[a", "[z"));
//        通过索引区间返回有序集合指定区间内的成员
   jedis.zrange("score",0,-1);
//        通过字典区间返回有序集合的成员
   jedis.zrangeByLex("score","[a","[c").forEach(System.out::println);
//        通过分数顺序返回有序集合指定区间内的成员
   jedis.zrangeByScore("score","-inf","+inf").forEach(System.out::println);
   jedis.zrangeByScoreWithScores("score","-inf","+inf").forEach(System.out::println);
//        开区间
   jedis.zrangeByScore("score","(60","(100").forEach(System.out::println);
//        降序，通过索引
   jedis.zrevrange("score",0,-1);
//        降序，通过分数
   jedis.zrevrangeByScore("score","+inf","8").forEach(System.out::println);
//        移除一个元素
   jedis.zrem("score","c");
//        移除有序集合中给定的字典区间的所有成员
   jedis.zremrangeByLex("score","[a","[b");
//        移除有序集合中给定的排名区间的所有成员
   jedis.zremrangeByRank("score",0,1);
//        移除有序集合中给定的分数区间的所有成员
   jedis.zremrangeByScore("score",0,10);
//        有序集合中对指定成员的分数加上增量 increment
   jedis.zincrby("score",5d,"b");
//        计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 destination 中
   scoreMembers.clear();
   scoreMembers.put("a",0d);
   scoreMembers.put("b",1d);
   scoreMembers.put("c",2d);
   jedis.zadd("aset",scoreMembers);
   scoreMembers.clear();
   scoreMembers.put("d",9d);
   scoreMembers.put("e",8d);
   scoreMembers.put("f",7d);
   jedis.zadd("bset",scoreMembers);
   scoreMembers.clear();
   System.out.println(jedis.zinterstore("newset", "aset", "bset"));
//        计算给定的一个或多个有序集的并集，并存储在新的 key 中
   jedis.zunionstore("union","aset","bset");
//        清空当前数据库
   jedis.flushDB();
//        清空所有数据
   jedis.flushAll();
//        关闭连接
   jedis.close();
}
```
##### 3.2.6 Geospatial类型
```java
public void geospatialTest(){
//        创建Jedis对象，连接Redis
   Jedis jedis = new Jedis("150.158.153.216",6379);
//        通过密码认证
   jedis.auth("123456");
   jedis.geoadd("china",120.39629,36.30744,"qingdao");
   HashMap<String, GeoCoordinate> geoCoordinateHashMap = new HashMap<>();
   geoCoordinateHashMap.put("jinan",new GeoCoordinate(116.75199,36.55358));
   geoCoordinateHashMap.put("beijing",new GeoCoordinate(116.23128,40.22077));
   geoCoordinateHashMap.put("shanghai",new GeoCoordinate(121.48941,31.40527));
   jedis.geoadd("china",geoCoordinateHashMap);
//        获取地理位置的坐标。
   jedis.geopos("china","qingdao","jinan").forEach(System.out::println);
//        计算两个位置之间的距离。
//        米
   System.out.println(jedis.geodist("china", "qingdao", "jinan"));
//        千米
   System.out.println(jedis.geodist("china", "qingdao", "jinan", GeoUnit.KM));
//        根据用户给定的经纬度坐标来获取指定范围内的地理位置集合。
//        返回距离
   jedis.georadius("china",120.3,36.6,300,GeoUnit.KM, GeoRadiusParam.geoRadiusParam().withDist());
//        返回坐标
   jedis.georadius("china",120.3,36.6,300,GeoUnit.KM, GeoRadiusParam.geoRadiusParam().withCoord());
//        限定返回值数量
   jedis.georadius("china",120,36,1000,GeoUnit.KM,GeoRadiusParam.geoRadiusParam().count(3));
//        asc距离从近到远排序
   jedis.georadius("china",120,36,1000,GeoUnit.KM,GeoRadiusParam.geoRadiusParam().count(3).sortAscending());
//        desc距离从远到近排序
   jedis.georadius("china",120,36,1000,GeoUnit.KM,GeoRadiusParam.geoRadiusParam().count(3).sortDescending());
//        根据储存在位置集合里面的某个地点获取指定范围内的地理位置集合。
//        返回一个或多个位置对象的 geohash 值。
   jedis.geohash("china","qingdao","jinan","beijing","shanghai").forEach(System.out::println);
//        清空当前数据库
   jedis.flushDB();
//        清空所有数据
   jedis.flushAll();
//        关闭连接
   jedis.close();
}
```
##### 3.2.7 Hyperloglog类型
```java
public void hyperLogLogTest(){
//        创建Jedis对象，连接Redis
   Jedis jedis = new Jedis("150.158.153.216",6379);
//        通过密码认证
   jedis.auth("123456");
//        添加指定元素到 HyperLogLog 中
   jedis.pfadd("a","1","2","3","4","5");
   jedis.pfadd("b","4","5","6","7","8","9","0");
//        返回给定 HyperLogLog 的基数估算值
   System.out.println(jedis.pfcount("a"));
   System.out.println(jedis.pfcount("b"));
   System.out.println(jedis.pfcount("a", "b"));
//        将多个 HyperLogLog 合并为一个 HyperLogLog
   jedis.pfmerge("dest","a","b");
   System.out.println(jedis.pfcount("dest"));
//        清空当前数据库
   jedis.flushDB();
//        清空所有数据
   jedis.flushAll();
//        关闭连接
   jedis.close();
}
```
##### 3.2.8 Bitmap类型
```java
public void bitMapTest(){
   Jedis jedis = new Jedis("150.158.153.216", 6379);
   jedis.auth("123456");
//        添加元素
   jedis.setbit("sign",1,true);
   jedis.setbit("sign",2,false);
   jedis.setbit("sign",3,true);
   jedis.setbit("sign",4,false);
   jedis.setbit("sign",5,true);
   jedis.setbit("sign",6,false);
   jedis.setbit("sign",7,true);
//        获取值
   System.out.println(jedis.getbit("sign", 4));
   System.out.println(jedis.getbit("sign", 5));
//        统计1的个数
   System.out.println(jedis.bitcount("sign"));
   jedis.flushDB();
   jedis.flushAll();
   jedis.close();
}
```
### 3.3 使用Jedis操作事务
- 正常执行事务
```java
public static void main(String[] args) {
   Jedis jedis = new Jedis("150.158.153.216", 6379);
   jedis.auth("123456");
   jedis.set("money","100");
   jedis.set("spend","0");
   jedis.close();
   new Thread(()->{
      Jedis jedis1 = new Jedis("150.158.153.216", 6379);
      jedis1.auth("123456");
      jedis1.watch("money");
      Transaction multi = jedis1.multi();
      multi.decrBy("money",20);
      multi.incrBy("spend",20);
      try{
            Thread.sleep(3000);
            List<Object> exec = multi.exec();
            System.out.println(exec);
      }catch (Exception e){
            e.printStackTrace();
      }
      jedis1.close();
   }).start();
}
```
- 其他线程客户端操作数据导致事务没有执行
```java
public static void main(String[] args) {
   Jedis jedis = new Jedis("150.158.153.216", 6379);
   jedis.auth("123456");
   jedis.set("money","100");
   jedis.set("spend","0");
   jedis.close();
   new Thread(()->{
      Jedis jedis1 = new Jedis("150.158.153.216", 6379);
      jedis1.auth("123456");
      jedis1.watch("money");
      Transaction multi = jedis1.multi();
      multi.decrBy("money",20);
      multi.incrBy("spend",20);
      try{
            Thread.sleep(3000);
            List<Object> exec = multi.exec();
            System.out.println(exec);
      }catch (Exception e){
            e.printStackTrace();
      }
      jedis1.close();
   }).start();
   new Thread(()->{
      Jedis jedis2 = new Jedis("150.158.153.216", 6379);
      jedis2.auth("123456");
      jedis2.incr("money");
      jedis2.close();
   }).start();
}
```
# 4.SpringBoot RedisTemplate
### 4.1 相关依赖
```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```
### 4.2 properties设置
```properties
spring.redis.host=150.158.153.216
spring.redis.port=6379
spring.redis.password=123456
```
### 4.3 RedisTemplate和StringRedisTemplate
```java
@Bean
@ConditionalOnMissingBean(name = "redisTemplate")
@ConditionalOnSingleCandidate(RedisConnectionFactory.class)
public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
   RedisTemplate<Object, Object> template = new RedisTemplate<>();
   template.setConnectionFactory(redisConnectionFactory);
   return template;
}

@Bean
@ConditionalOnMissingBean
@ConditionalOnSingleCandidate(RedisConnectionFactory.class)
public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
   StringRedisTemplate template = new StringRedisTemplate();
   template.setConnectionFactory(redisConnectionFactory);
   return template;
}
```
### 4.4 RedisTemplate和StringRedisTemplate常用方法
- 基本命令
```java
public static void baseMethod(RedisTemplate redisTemplate){
   redisTemplate.opsForValue().set("test","test");
   System.out.println("判断key是否存在==>" + redisTemplate.hasKey("name"));
   System.out.println("从当前数据库移动到指定数据库==>"+redisTemplate.move("test", 2));
   System.out.println("=====切换数据库=======");
   redisTemplate.getConnectionFactory().getConnection().select(2);
   System.out.println("设置过期时间==>"+redisTemplate.expire("test", Duration.ofSeconds(20)));
   redisTemplate.expire("test",2,TimeUnit.MINUTES);
   System.out.println("查看剩余时间==>" + redisTemplate.getExpire("test", TimeUnit.MILLISECONDS));
   redisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
- 切换数据库
```java
LettuceConnectionFactory connectionFactory = (LettuceConnectionFactory) stringRedisTemplate.getConnectionFactory();
connectionFactory.setDatabase(6);
connectionFactory.afterPropertiesSet();
stringRedisTemplate.opsForValue().set("test","test");
```
- 通过BoundXxxOperations绑定一个key
```java
BoundValueOperations user1 = redisTemplate.boundValueOps("user");
System.out.println(user1.get());
```
##### 4.4.1 String

```java
public static void stringMethod(StringRedisTemplate stringRedisTemplate){
   ValueOperations<String, String> stringStringValueOperations = stringRedisTemplate.opsForValue();
   stringStringValueOperations.set("name","ppg");
   System.out.println(stringStringValueOperations.setIfAbsent("name", "test"));
   System.out.println(stringStringValueOperations.getAndSet("name", "PPG"));
   stringStringValueOperations.append("name","007");
   System.out.println(stringStringValueOperations.get("name"));
   System.out.println(stringStringValueOperations.get("name", 0, 1));
   System.out.println(stringStringValueOperations.size("name"));
   stringStringValueOperations.set("views","0");
   stringStringValueOperations.increment("views");
   System.out.println(stringStringValueOperations.get("views"));
   stringStringValueOperations.increment("views",10l);
   System.out.println(stringStringValueOperations.get("views"));
   stringStringValueOperations.decrement("views");
   System.out.println(stringStringValueOperations.get("views"));
   stringStringValueOperations.decrement("views",5);
   System.out.println(stringStringValueOperations.get("views"));
   stringStringValueOperations.set("name","new",4);
   System.out.println(stringStringValueOperations.get("name"));
   stringStringValueOperations.set("time","time",15, TimeUnit.SECONDS);
   System.out.println(stringRedisTemplate.getExpire("time", TimeUnit.MILLISECONDS));
   HashMap<String, String> stringStringHashMap = new HashMap<>();
   stringStringHashMap.put("eryuan","superman");
   stringStringHashMap.put("eryuan2","yyds");
   stringStringValueOperations.multiSet(stringStringHashMap);
   ArrayList<String> strings = new ArrayList<>();
   strings.add("eryuan");
   strings.add("eryuan2");
   System.out.println(stringStringValueOperations.multiSetIfAbsent(stringStringHashMap));
   stringStringValueOperations.multiGet(strings).forEach(System.out::println);
   stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
##### 4.4.2 List
```java
public static void listMethod(RedisTemplate redisTemplate){
   ListOperations listOperations = redisTemplate.opsForList();
   listOperations.leftPush("list","a");
   ArrayList<String> strings = new ArrayList<>();
   strings.add("b");
   strings.add("c");
   strings.add("d");
   strings.add("e");
   strings.add("f");
   listOperations.leftPushAll("list",strings);
   listOperations.rightPush("list","1");
   ArrayList<Integer> integers = new ArrayList<>();
   integers.add(2);
   integers.add(3);
   listOperations.rightPushAll("list",integers);
   System.out.println("=====初试列表=====");
   listOperations.range("list",0,-1).forEach(System.out::println);
   System.out.println(listOperations.size("list"));
   System.out.println("left出队==>"+listOperations.leftPop("list"));
   System.out.println("right出队==>"+listOperations.rightPop("list"));
   System.out.println(listOperations.index("list", 3));
   listOperations.remove("list",1,"d");
   listOperations.trim("list",2,5);
   System.out.println("=====修剪后列表=====");
   listOperations.range("list",0,-1).forEach(System.out::println);
   listOperations.set("list",0,"eee");
   listOperations.rightPopAndLeftPush("list","newList");
   System.out.println("=====新列表=====");
   listOperations.range("newList",0,-1).forEach(System.out::println);
   redisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
##### 4.4.3 Set
```java
public static void setMethod(RedisTemplate redisTemplate){
   SetOperations setOperations = redisTemplate.opsForSet();
   setOperations.add("set","a","b","c");
   setOperations.add("set","d","e","f");
   System.out.println("查看所有元素");
   setOperations.members("set").forEach(System.out::println);
   System.out.println("判断是否是集合中的元素");
   System.out.println(setOperations.isMember("set", "123"));
   System.out.println("获取元素个数");
   System.out.println(setOperations.size("set"));
   System.out.println("根据值删除元素");
   setOperations.remove("set","a","f");
   System.out.println("随机获取集合中的值");
   System.out.println(setOperations.randomMember("set"));
   setOperations.randomMembers("set",3).forEach(System.out::println);
   System.out.println("随机删除");
   System.out.println(setOperations.pop("set"));
   System.out.println(setOperations.pop("set", 2));
   System.out.println("将指定的元素移动到另一个集合");
   setOperations.add("char",'a','b','c');
   setOperations.add("int",1,2,3,4);
   setOperations.move("char",'a',"int");
   System.out.println("移动后的char集合");
   setOperations.members("char").forEach(System.out::println);
   System.out.println("移动后的int集合");
   setOperations.members("int").forEach(System.out::println);
   System.out.println("差集");
   setOperations.difference("char","int").forEach(System.out::println);
   System.out.println("得到差集并储存");
   setOperations.differenceAndStore("char","int","diff");
   setOperations.members("diff").forEach(System.out::println);
   System.out.println("得到交集");
   setOperations.intersect("char","int").forEach(System.out::println);
   System.out.println("得到交集并储存");
   setOperations.intersectAndStore("char","int","inter");
   setOperations.members("inter").forEach(System.out::println);
   System.out.println("获取并集");
   setOperations.union("char","int").forEach(System.out::println);
   System.out.println("得到并集并储存");
   setOperations.unionAndStore("char","int","union");
   setOperations.members("union").forEach(System.out::println);
   redisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
##### 4.4.4 ZSet
```java
public static void zSetMethod(StringRedisTemplate stringRedisTemplate){
   ZSetOperations<String, String> stringStringZSetOperations = stringRedisTemplate.opsForZSet();
   System.out.println("添加成员或修改分数");
   stringStringZSetOperations.add("score","a",99.9);
   Set<ZSetOperations.TypedTuple<String>> typedTuples = new TreeSet<>();
   typedTuples.add(new DefaultTypedTuple<>("b", 77.7));
   typedTuples.add(new DefaultTypedTuple<>("c", 55.5));
   stringStringZSetOperations.add("score",typedTuples);
   System.out.println("获取成员分数值");
   System.out.println(stringStringZSetOperations.score("score", "b"));
   System.out.println("返回集合中指定成员的索引");
   System.out.println(stringStringZSetOperations.rank("score", "c"));
   System.out.println("分值递减排序");
   System.out.println(stringStringZSetOperations.reverseRank("score", "c"));
   System.out.println("查看元素个数");
   System.out.println(stringStringZSetOperations.size("score"));
   System.out.println(stringStringZSetOperations.zCard("score"));
   System.out.println("获取指定区间的元素个数");
   System.out.println(stringStringZSetOperations.count("score", 55.5, 77.7));
   System.out.println(stringStringZSetOperations.lexCount("score", new RedisZSetCommands.Range().lte("c").gte("a")));
   System.out.println("通过索引区间返回有序集合指定区间内的成员");
   stringStringZSetOperations.range("score",0,-1).forEach(System.out::println);
   System.out.println("通过字典区间返回有序集合的成员");
   stringStringZSetOperations.rangeByLex("score",new RedisZSetCommands.Range().gte("a").lte("b")).forEach(System.out::println);
   System.out.println("通过分数返回");
   stringStringZSetOperations.rangeByScore("score",60,100).forEach(System.out::println);
   stringStringZSetOperations.rangeByScoreWithScores("score",60,100).forEach((stringTypedTuple -> System.out.println(stringTypedTuple.getScore()+" "+stringTypedTuple.getValue())));
   System.out.println("移除一个元素");
   stringStringZSetOperations.remove("score","a");
   stringStringZSetOperations.removeRangeByScore("score",0,8);
   System.out.println("增量");
   System.out.println("====增加前====");
   stringStringZSetOperations.rangeWithScores("score",0,-1).forEach((stringTypedTuple -> System.out.println(stringTypedTuple.getScore()+" "+stringTypedTuple.getValue())));
   stringStringZSetOperations.incrementScore("score","c",4.4);
   System.out.println("====增加后====");
   stringStringZSetOperations.rangeWithScores("score",0,-1).forEach((stringTypedTuple -> System.out.println(stringTypedTuple.getScore()+" "+stringTypedTuple.getValue())));
   System.out.println("求交集");
   typedTuples.add(new DefaultTypedTuple<>("d", 5.5));
   System.out.println("size==>"+typedTuples.size());
   stringStringZSetOperations.add("a",typedTuples);
   stringStringZSetOperations.intersectAndStore("score","a","inter");
   stringStringZSetOperations.rangeWithScores("inter",0,-1).forEach((stringTypedTuple -> System.out.println(stringTypedTuple.getScore()+" "+stringTypedTuple.getValue())));
   System.out.println("求并集");
   stringStringZSetOperations.unionAndStore("score","a","union");
   stringStringZSetOperations.rangeWithScores("union",0,-1).forEach((stringTypedTuple -> System.out.println(stringTypedTuple.getScore()+" "+stringTypedTuple.getValue())));
   stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
##### 4.4.5 Hash
```java
public static void hashMethod(StringRedisTemplate stringRedisTemplate){
   HashOperations hashOperations = stringRedisTemplate.opsForHash();
   hashOperations.put("user","name","ppg");
   HashMap<String, String> stringStringHashMap = new HashMap<>();
   stringStringHashMap.put("age","21");
   hashOperations.putAll("user",stringStringHashMap);
   System.out.println("获取指定hash中的键对应的值");
   System.out.println(hashOperations.get("user", "name"));
   System.out.println(hashOperations.get("user", "age"));
   ArrayList<String> keysList = new ArrayList<>();
   keysList.add("name");
   keysList.add("age");
   hashOperations.multiGet("user",keysList);
   System.out.println("获取指定hash中所有键值对");
   Map user = hashOperations.entries("user");
   user.forEach((key,value)->{
      System.out.println(key);
      System.out.println(value);
   });
   System.out.println("删除字段");
   hashOperations.put("user","test","test");
   hashOperations.delete("user","test");
   System.out.println("获取哈希表中字段的数量");
   System.out.println(hashOperations.size("user"));
   System.out.println("判断指定字段是否存在");
   System.out.println(hashOperations.hasKey("user", "name"));
   System.out.println("获取哈希表中所有的key");
   hashOperations.keys("user").forEach(System.out::println);
   System.out.println("字段不存在时，设置");
   hashOperations.putIfAbsent("user","name","newName");
   System.out.println("获取哈希表中所有的值");
   hashOperations.values("user").forEach(System.out::println);
   System.out.println("整数增量(可以是负数)");
   System.out.println("====增加前====");
   System.out.println(hashOperations.get("user", "age"));
   hashOperations.increment("user","age",2);
   System.out.println("====增加后====");
   System.out.println(hashOperations.get("user", "age"));
   System.out.println("浮点增量(可以是负数)");
   hashOperations.put("user","money","2.2");
   System.out.println("====增加前====");
   System.out.println(hashOperations.get("user", "money"));
   hashOperations.increment("user","money",-0.2d);
   System.out.println("====增加后====");
   System.out.println(hashOperations.get("user", "money"));
   stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
##### 4.4.6 Geospatial
```java
public static void geoMethod(StringRedisTemplate stringRedisTemplate){
   GeoOperations<String, String> stringStringGeoOperations = stringRedisTemplate.opsForGeo();
   stringStringGeoOperations.add("china",new Point(120.39629,36.30744),"qingdao");
   RedisGeoCommands.GeoLocation<String> stringGeoLocation = new RedisGeoCommands.GeoLocation<String>("jinan",new Point(116.75199,36.55358));
   stringStringGeoOperations.add("china",stringGeoLocation);
   HashMap<String, Point> pointHashMap = new HashMap<>();
   pointHashMap.put("beijing",new Point(116.23128,40.22077));
   pointHashMap.put("shanghai",new Point(121.48941,31.40527));
   stringStringGeoOperations.add("china",pointHashMap);
   System.out.println("获取地理位置的坐标");
   stringStringGeoOperations.position("china","qingdao","jinan").forEach(System.out::println);
   System.out.println("计算两个位置之间的距离");
   System.out.println(stringStringGeoOperations.distance("china", "qingdao", "jinan", Metrics.KILOMETERS));
   System.out.println("返回多个Geohash值");
   stringStringGeoOperations.hash("china","qingdao","jinan").forEach(System.out::println);
   System.out.println("根据经纬度获取指定范围内的地理位置");
   Circle circle = new Circle(new Point(120, 35), new Distance(500,Metrics.KILOMETERS));
   RedisGeoCommands.GeoRadiusCommandArgs limit = RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs().includeDistance().includeCoordinates().sortAscending().limit(3);
   stringStringGeoOperations.radius("china", circle, limit).forEach(System.out::println);
   System.out.println("集合中点为中心，返回一定范围内的点");
   stringStringGeoOperations.radius("china","jinan",new Distance(500,Metrics.KILOMETERS),limit).forEach(System.out::println);
   stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
##### 4.4.7 HyperLogLog
```java
public static void hyperLogLogMethod(StringRedisTemplate stringRedisTemplate){
   HyperLogLogOperations<String, String> stringStringHyperLogLogOperations = stringRedisTemplate.opsForHyperLogLog();
   stringStringHyperLogLogOperations.add("a","1","2","3","4","5");
   stringStringHyperLogLogOperations.add("b","4","5","6","7","8","9","0");
   System.out.println("返回基数估算值");
   System.out.println("a==>"+stringStringHyperLogLogOperations.size("a"));
   System.out.println("b==>" + stringStringHyperLogLogOperations.size("b"));
   System.out.println("a+b==>" + stringStringHyperLogLogOperations.size("a", "b"));
   System.out.println("合并");
   stringStringHyperLogLogOperations.union("merge","a","b");
   System.out.println(stringStringHyperLogLogOperations.size("merge"));
   stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
##### 4.4.8 BitMap
```java
public static void bitMapMethod(StringRedisTemplate stringRedisTemplate){
   ValueOperations<String, String> stringStringValueOperations = stringRedisTemplate.opsForValue();
   stringStringValueOperations.setBit("sign",1,true);
   stringStringValueOperations.setBit("sign",2,true);
   stringStringValueOperations.setBit("sign",3,false);
   stringStringValueOperations.setBit("sign",4,true);
   stringStringValueOperations.setBit("sign",5,true);
   stringStringValueOperations.setBit("sign",6,false);
   stringStringValueOperations.setBit("sign",7,true);
   System.out.println("获取指定偏移量的状态");
   System.out.println(stringStringValueOperations.getBit("sign", 2));
   System.out.println("统计true数量");
   System.out.println(stringRedisTemplate.execute((RedisCallback<Long>) con -> con.bitCount("sign".getBytes())));

   // 待测试
   System.out.println("使用bitfield来判断用户连续签到多少天");
   List<Long> execute = stringRedisTemplate.execute((RedisCallback<List<Long>>) con ->
            con.bitField("sign".getBytes(),
                  BitFieldSubCommands.create().get(BitFieldSubCommands.BitFieldType.unsigned(7)).valueAt(5)));
   execute.forEach(System.out::println);

   stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
}
```
### 4.5 事务
```java
public static void watch(StringRedisTemplate stringRedisTemplate) {
   stringRedisTemplate.opsForValue().set("rest","100");
   stringRedisTemplate.opsForValue().set("spend","0");
   // 事务必须写在SessionCallback中，否则不是同一个session不会被视为事务执行
   SessionCallback<Object> objectSessionCallback = new SessionCallback<Object>() {
      @SneakyThrows
      @Override
      public Object execute(RedisOperations operations) throws DataAccessException {

            stringRedisTemplate.multi();

            stringRedisTemplate.opsForValue().increment("spend",10);
            stringRedisTemplate.opsForValue().decrement("rest",10);
            return stringRedisTemplate.exec();
      }
   };
   new Thread(()->{
      // watch要写在session外
      stringRedisTemplate.watch("rest");
      stringRedisTemplate.watch("spend");
      try {
            Thread.sleep(3000);
      } catch (InterruptedException e) {
            e.printStackTrace();
      }
      stringRedisTemplate.execute(objectSessionCallback);
   }).start();
   new Thread(()->{
      stringRedisTemplate.opsForValue().increment("rest");
   }).start();
   try {
      Thread.sleep(10000);
   } catch (InterruptedException e) {
      e.printStackTrace();
   }
   System.out.println(stringRedisTemplate.opsForValue().get("rest"));
   System.out.println(stringRedisTemplate.opsForValue().get("spend"));
}
```
### 4.6 使用自定义的RedisTemplate
创建配置类，并配置RedisTemplate
```java
@Configuration
public class Config {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(RedisSerializer.string());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setEnableTransactionSupport(true);
        return template;
    }
}
```
RedisTemplate默认使用jdk序列化，存在乱码等问题，将value的序列化方式换为Jackson后，value中不再出现乱码
# 5. Redis Config文件解析
1. 包含其他配置文件
![include](/Redis/RedisConfig-include.jpg)
2. 网络
```shell
################################## NETWORK #####################################
# Examples:
# bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses
# bind 127.0.0.1 ::1              # listens on loopback IPv4 and IPv6
# bind * -::*                     # like the default, all available interfaces

# 绑定ip，只有被绑定的ip地址才能访问
#bind 127.0.0.1 -::1

# 保护模式，默认开启
protected-mode no

# 端口设置
port 6379

tcp-backlog 511

# 超时
timeout 0

tcp-keepalive 300
```
3. 通用设置
```shell
# 默认情况下，redis不是在后台运行的，如果需要在后台运行，把该项的值更改为yes
daemonize yes
# 当运行多个redis服务时，需要指定不同的pid文件和端口
pidfile /var/run/redis_6379.pid

# 指定日志记录级别
# Redis总共支持四个级别：debug、verbose、notice、warning
loglevel notice
# 配置log文件地址
# 若为空值，则是stdout，标准输出
logfile ""

# 指定可用数据库数量
databases 16

always-show-logo no

set-proc-title yes

proc-title-template "{title} {listen-addr} {server-mode}"
```
4. 快照
```shell
# Save the DB to disk.
# save <seconds> <changes>
save 3600 1
save 300 100
save 60 10000

# 持久化出错是否继续工作
stop-writes-on-bgsave-error yes

# 是否压缩rdb文件
rdbcompression yes

# 保存rdb时，进行错误校验
rdbchecksum yes

# 本地持久化数据库文件名
dbfilename dump.rdb

rdb-del-sync-files no
# 工作目录
# 数据库镜像备份的文件放置的路径。
# 这里的路径跟文件名要分开配置是因为redis在进行备份时，
# 先会将当前数据库的状态写入到一个临时文件中，
# 等备份完成时，再把该该临时文件替换为上面所指定的文件，
# 而这里的临时文件和上面所配置的备份文件都会放在这个指定的路径当中。
# AOF文件也会存放在这个目录下面
# 注意这里必须制定一个目录而不是文件
dir ./
```
5. 复制
```shell
#   +------------------+      +---------------+
#   |      Master      | ---> |    Replica    |
#   | (receive writes) |      |  (exact copy) |
#   +------------------+      +---------------+

replica-serve-stale-data yes

replica-read-only yes

repl-diskless-sync no

repl-diskless-sync-delay 5

repl-diskless-load disabled

repl-disable-tcp-nodelay no

replica-priority 100
```
6. 安全
```shell
acllog-max-len 128

# 设置密码
requirepass 123456
```
7. 限制
- 客户端限制
![限制客户端数量](/Redis/RedisConfig-maxclients.jpg)
- 内存限制
```shell
# 内存最大值
# maxmemory <bytes>

# 内存满后的操作
# maxmemory-policy noeviction

# 共8种选择
# volatile-lru 对设置了过期时间的key使用LRU算法
# allkeys-lru 所有key都使用LRU算法
# volatile-lfu 对设置了过期时间的key使用LFU算法
# allkeys-lfu 所有key都使用LFU算法
# volatile-random 对设置了过期时间的key随机移除
# allkeys-random 所有key都会被随机移除
# volatile-ttl 删除即将过期的
# noeviction 永不过期，返回错误
```
8. Append Only模式(AOF)
```shell
# 是否开启AOF，默认关闭，使用RDB
appendonly no

# 持久化文件名
appendfilename "appendonly.aof"

# 默认每秒都同步
appendfsync everysec
# appendfsync no 不执行同步，操作系统自行同步
# appendfsync always 每次修改都会同步
```
# 6.Redis持久化
### 6.1 RDB持久化
##### 6.1.1 进行持久化
- 文件
>dump.rdb
- RDB触发条件
>1. 满足save规则
>2. 执行flushall
>3. 退出redis
```shell
# 每经过六秒或六条更改就会触发RDB
save 6 6
```
- 手动保存
```shell
# 该命令会阻塞当前Redis服务器，执行save命令期间，Redis不能处理其他命令，直到RDB过程完成为止。
save
# 执行该命令时，Redis会在后台异步进行快照操作，快照同时还可以响应客户端请求。
# 具体操作是Redis进程执行fork操作创建子进程，RDB持久化过程由子进程负责，完成后自动结束。
# 阻塞只发生在fork阶段，一般时间很短。
bgsave
```
##### 6.1.2 从文件中恢复数据
1. 将数据文件放在redis启动目录即可
>获取启动目录：
```shell
150.158.153.216:6379> config get dir
1) "dir"
2) "/etc/cron.d" #启动目录
```
### 6.2 AOF持久化
>以日志形式记录所有写的操作，只许追加文件不可改写文件，redis重启时会读取AOF并依次执行所有操作
##### 6.2.1 开启AOF
```shell
appendonly yes
```
# 7.订阅发布
### 7.1 订阅频道
客户端在订阅后会一直监听
```shell
150.158.153.216:6379> subscribe ppg
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "ppg"
3) (integer) 1
```
### 7.2 向指定的频道发送信息
信息中不能有空格,加引号可以有空格
```shell
publish ppg whatareyoudoing
```
### 7.3 退订频道
```shell
150.158.153.216:6379> unsubscribe ppg
1) "unsubscribe"
2) "ppg"
3) (integer) 0
```
### 7.4 查看订阅与发布系统状态
```shell
150.158.153.216:6379> pubsub channels
(empty list or set)
```

# 8.Redis主从复制

### 8.1 什么是主从复制

主从复制，是指将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为主节点(master/leader)，后者称为从节点(slave/follower)；数据的复制是单向的，只能由主节点到从节点。

Master以写为主，Slave 以读为主。

默认情况下，每台Redis服务器都是主节点；且一个主节点可以有多个从节点(或没有从节点)，但一个从节点只能有一个主节点。

### 8.2 主从复制作用

1. 数据冗余：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式。
2. 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复；实际上是一种服务的冗余。
3. 负载均衡：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务（即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量。
4. 高可用基石：除了上述作用以外，主从复制还是哨兵和集群能够实施的基础，因此说主从复制是Redis高可用的基础。

### 8.3 集群配置

==只配置从库，不配置主库==

为简单起见，将redis配置文件拷贝三份，分别修改：

1. 端口号
2. rdb文件名
3. 后台运行
4. pid文件名
5. log文件名

依次使用这三个配置文件在同一台服务器中启动三个redis

这里使用==一主二从==

##### 8.3.1 临时配置

进入要配置的从机，执行命令

```bash
SLAVEOF host port
```

即可指定主机

##### 8.3.2 永久配置

修改从机配置文件

```bash
# replicaof <masterip> <masterport>
replicaof 127.0.0.1 6379
```

连接redis后，执行：

```shell
info replication
```

即可查看主从信息

### 8.4 主从复制原理

Slave启动成功连接到 master后会发送一个syn同步命令
Master接到命令,启动后台的存盘进程,同时收集所有接收到的用于修改数据集命令,在后台进程执行完毕之后, master将传送整个数据文件到save,并完成一次完全同步

- 全量复制：而save服务在接收到数据库文件数据后,将其存盘并加载到内存中
- 增量复制：Master继续将新的所有收集到的修改命令依次传给 slave,完成同步
- ==只要是重新连接 master,一次完全同步(全量复制)将被自动执行==

**注意：==只有主机才能写，从机只能读==**

### 8.5 层层链路

爷爷-儿子-孙子

第一个从机指定主机为master，第二台从机指定主机为第一台从机，依次向下

在master宕机后，在第一层节点上执行命令

```bash
SLAVEOF no one
```

这样第一层从机就成为了集群中的master

如果一段时间后原master重新上线，需要重新配置

### 8.6 哨兵模式

##### 8.6.1 什么是哨兵

哨兵模式是一种特殊的模式，首先Redis提供了哨兵的命令，哨兵是一个独立的进程，作为进程，它会独立运行。其原理是哨兵通过发送命令，等待Redis服务器响应，从而监控运行的多个Redis实例。类似于心跳检测

![image-20210822161938936](/Redis/image-20210822161938936.png)

单机哨兵可靠性依然很低，通常使用哨兵集群

![image-20210822162011978](/Redis/image-20210822162011978.png)

##### 8.6.2 哨兵的作用

- 通过发送命令，让Redis服务器返回监控其运行状态，包括主服务器和从服务器。

- 当哨兵监测到master宕机，会自动将slave切换成master，然后通过**发布订阅模式**通知其他的从服务器，修改配置文件，让它们切换主机。

##### 8.6.3 哨兵工作流程

假设主服务器宕机，哨兵1先检测到这个结果，系统并不会马上进行failover过程，仅仅是哨兵1主观的认为主服务器不可用，这个现象成为**==主观下线==**。当后面的哨兵也检测到主服务器不可用，并且数量达到一定值时，那么哨兵之间就会进行一次投票，投票的结果由一个哨兵发起，进行failover[故障转移]操作。

切换成功后，就会通过发布订阅模式，让各个哨兵把自己监控的从服务器实现切换主机，这个过程称为==**客观下线**==。

##### 8.6.4 配置启动哨兵

新建两个配置文件：sentinel1.conf、sentinel2.conf

写入配置

```bash
port 26379#哨兵启动端口，两个配置文件要不同
daemonize yes
pidfile /var/run/redis-sentinel.pid #pid文件
logfile "1.log"#日志文件
dir /tmp#哨兵工作目录
sentinel monitor mymaster 127.0.0.1 6379 1#监控的主机。最后的数字表示要多少个哨兵认为主机挂掉才切换master
sentinel down-after-milliseconds mymaster 30000#指定多少毫秒之后 主节点没有应答哨兵sentinel 此时 哨兵主观上认为主节点下线 默认30秒
sentinel parallel-syncs mymaster 1# 这个配置项指定了在发生failover主备切换时最多可以有多少个slave同时对新的master进行 同 步，
# 故障转移的超时时间 failover-timeout 可以用在以下这些方面： 
#1. 同一个sentinel对同一个master两次failover之间的间隔时间。 
#2. 当一个slave从一个错误的master那里同步数据开始计算时间。直到slave被纠正为向正确的 master那里同步数据时。
#3.当想要取消一个正在进行的failover所需要的时间。 
#4.当进行failover时，配置所有slaves指向新的master所需的最大时间。不过，即使过了这个超 时，slaves依然会被正确配置为指向master，但是就不按parallel-syncs所配置的规则来了 
# 默认三分钟
sentinel failover-timeout mymaster 180000

# 当在Redis实例中开启了requirepass foobared 授权密码 这样所有连接Redis实例的客户端都 要提供密码 
# 设置哨兵sentinel 连接主从的密码 注意必须为主从设置一样的验证密码 
# sentinel auth-pass <master-name> <password>

#配置当某一事件发生时所需要执行的脚本，可以通过脚本来通知管理员，例如当系统运行不正常时发邮 件通知相关人员。
#对于脚本的运行结果有以下规则： 
#若脚本执行后返回1，那么该脚本稍后将会被再次执行，重复次数目前默认为10 
#若脚本执行后返回2，或者比2更高的一个返回值，脚本将不会重复执行。 
#如果脚本在执行过程中由于收到系统中断信号被终止了，则同返回值为1时的行为相同。
#一个脚本的最大执行时间为60s，如果超过这个时间，脚本将会被一个SIGKILL信号终止，之后重新执 行。
#通知型脚本:当sentinel有任何警告级别的事件发生时（比如说redis实例的主观失效和客观失效等 等），将会去调用这个脚本，这时这个脚本应该通过邮件，SMS等方式去通知系统管理员关于系统不正常 运行的信息。调用该脚本时，将传给脚本两个参数，一个是事件的类型，一个是事件的描述。如果 sentinel.conf配置文件中配置了这个脚本路径，那么必须保证这个脚本存在于这个路径，并且是可执 行的，否则sentinel无法正常启动成功。
#通知脚本 
# sentinel notification-script <master-name> <script-path> 

# 客户端重新配置主节点参数脚本 
# 当一个master由于failover而发生改变时，这个脚本将会被调用，通知相关的客户端关于master 地址已经发生改变的信息。 
# 以下参数将会在调用脚本时传给脚本: # <master-name> <role> <state> <from-ip> <from-port> <to-ip> <to-port> 
# 目前<state>总是“failover”,
# <role>是“leader”或者“observer”中的一个。 
# 参数 from-ip, from-port, to-ip, to-port是用来和旧的master和新的master(即旧的 slave)通信的
# 这个脚本应该是通用的，能被多次调用，不是针对性的。 
# sentinel client-reconfig-script <master-name> <script-path> 
```

启动后如果master宕机会自动切换到剩余的一台从服务器

### 8.7 缓存穿透、缓存击穿和雪崩

### 8.7.1 缓存穿透

##### 概念

缓存穿透的概念很简单，用户想要查询一个数据，发现redis内存数据库没有，也就是缓存没有命中，于是向持久层数据库查询。发现也没有，于是本次查询失败。当用户很多的时候，缓存都没有命中，于是都去请求了持久层数据库。这会给持久层数据库造成很大的压力，这时候就相当于出现了缓存穿透。

##### 解决方案

1. 缓存空对象

当请求数据库没有查询到结果时，即查询结果为空，将这个空结果也缓存起来，设置空结果的过期时间很短，不超过5min

2. 设置可访问白名单

使用bitmaps类型定义一个可以访问的名单，名单id作为bitmaps的偏移量，每次访问和bitmap里的id进行比较如果访问id不在bitmaps中就进行拦截

3. 布隆过滤器

布隆过滤器是一种数据结构，对所有可能查询的参数以hash形式存储，在控制层先进行校验，不符合则丢弃，从而避免了对底层存储系统的查询压力；

### 8.7.2 缓存击穿

##### 概念

缓存击穿，是指一个key非常热点，在不停的扛着大并发，大并发集中对这一个点进行访问，当这个key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个屏障上凿开了一个洞。

当某个key在过期的瞬间，有大量的请求并发访问，这类数据一般是热点数据，由于缓存过期，会同时访问数据库来查询最新数据，并且回写缓存，会导使数据库瞬间压力过大。

##### 解决方案

1. **设置热点数据永不过期**
2. **加互斥锁**

分布式锁：使用分布式锁，保证对于每个key同时只有一个线程去查询后端服务，其他线程没有获得分布式锁的权限，因此只需要等待即可。这种方式将高并发的压力转移到了分布式锁，因此对分布式锁的考验很大。

#### 8.7.3 缓存雪崩

##### 概念

缓存雪崩，是指在某一个时间段，大量缓存集中过期失效。

##### 解决方案

1. 构建多级缓存
2. 使用锁或队列
3. 分散缓存失效时间

# 9.集群

去中心化集群

### 9.1 集群搭建

创建六个配置文件，每个文件端口号不同，且均作出如下配置：

```shell
cluster-enabled yes

cluster-config-file nodes-6379.conf#这里的配置文件会自动生成，名字也要不同

cluster-node-timeout 15000
```

分别启动六个redis进程，并确认启动成功且nodes.conf文件正确生成后执行命令：

```shell
redis-cli --cluster create --cluster-replicas 1 127.0.0.1:6379 127.0.0.1:6380 127.0.0.1:6381 127.0.0.1:6389 127.0.0.1:6390 127.0.0.1:6391
```

执行上述命令开启集群，不要使用域名

成功后输出结果：

![image-20210822183640441](/Redis/image-20210822183640441.png)

使用redis-cli添加-c参数，然后连接任意端口进程都能连接到进程中

```shell
redis-cli -c -p 6391
```

通过以下命令查看集群节点

```shell
127.0.0.1:6391> cluster nodes
```

==每个集群至少要有三个主节点==

### 9.2 slots

从结果图可知，redis集群有16384个插槽，每个redis都对应一个插槽范围，操作数据时，根据key值计算出插槽位置，在任意的redis中，执行操作会重定向到key所在的插槽所在的redis实例

##### 插入

在集群中插入map时要指定一个组

例如

```shell
mset name{user} ppg age{user} 20
```

这样会根据user计算插槽值

### 9.3 故障恢复

如果某段插槽的主从都挂掉,而cluster-require-full-coverage为yes,那么,整个集群都挂掉。
如果臬段插槽的主从都挂掉,而cluster-require-full-coverage为no,那么,该插槽数据全都不能使用,也无法存储
redis.conf中的参数cluster-require-full-coverage



# 10.分布式锁
