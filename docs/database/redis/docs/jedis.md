# Jedis

## 相关依赖

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.5.2</version>
</dependency>
```

## 使用 Jedis 操作 Redis

### String 类型

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

### List 类型

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

### Set 类型

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

### Hash 类型

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

### ZSet 类型

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

### Geospatial 类型

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

### Hyperloglog 类型

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

### Bitmap 类型

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

## 使用 Jedis 操作事务

正常执行事务：

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

其他线程客户端操作数据导致事务没有执行：

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
