# SpringBoot RedisTemplate

## 相关依赖

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## properties 设置

```properties
spring.redis.host=150.158.153.216
spring.redis.port=6379
spring.redis.password=123456
```

## RedisTemplate 和 StringRedisTemplate

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

## RedisTemplate 和 StringRedisTemplate 常用方法

基本命令：

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

切换数据库：

```java
LettuceConnectionFactory connectionFactory = (LettuceConnectionFactory) stringRedisTemplate.getConnectionFactory();
connectionFactory.setDatabase(6);
connectionFactory.afterPropertiesSet();
stringRedisTemplate.opsForValue().set("test","test");
```

通过 BoundXxxOperations 绑定一个 key：

```java
BoundValueOperations user1 = redisTemplate.boundValueOps("user");
System.out.println(user1.get());
```

### String

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

### List

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

### Set

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

### ZSet

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

### Hash

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

### Geospatial

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

### HyperLogLog

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

### BitMap

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

## 事务

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

## 使用自定义的 RedisTemplate

创建配置类，并配置 RedisTemplate：

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

RedisTemplate 默认使用 jdk 序列化，存在乱码等问题，将 value 的序列化方式换为 Jackson 后，value 中不再出现乱码。
