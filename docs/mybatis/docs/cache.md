# 缓存

## 缓存简介

什么是缓存：

- 存在内存中的临时数据。
- 将用户经常查询的数据放在缓存中，从缓存中查询，提高查询效率，解决了高并发系统的性能问题。

为什么用缓存：

- 减少访问数据库的次数，减小系统开销，提高系统效率。

什么样的数据适合用缓存：

- 经常查询且不经常改变的数据。

## Mybatis 缓存

::: tip
MyBatis 内置了一个强大的事务性查询缓存机制，它可以非常方便地配置和定制。
:::

默认情况下，只启用了本地的会话缓存，它仅仅对一个会话中的数据进行缓存。(一级缓存，sqlsession 级别的缓存)。

二级缓存需要手动开启，基于 namespace 级别。

mybatis 提供了 cache 接口可以自定义缓存(二级)。

## Mybatis 缓存机制

- 映射语句文件中的所有 select 语句的结果将会被缓存。
- 映射语句文件中的所有 insert、update 和 delete 语句会刷新缓存。
- 缓存会使用最近最少使用算法（LRU, Least Recently Used）算法来清除不需要的缓存。
- 缓存不会定时进行刷新（也就是说，没有刷新间隔）。
- 缓存会保存列表或对象（无论查询方法返回哪种）的 1024 个引用。
- 缓存会被视为读/写缓存，这意味着获取到的对象并不是共享的，可以安全地被调用者修改，而不干扰其他调用者或线程所做的潜在修改。

## 一级缓存

实体类代码：

```java
@Data
@EqualsAndHashCode
public class User {
    private int id;
    private String username;
    private String password;
}
```

mapper.xml：

```xml
<update id="updateUser">
    update mydata.usertable set password=#{password} where id=#{id}
</update>

<select id="queryUsers" resultType="pojo.User">
    select * from mydata.usertable
</select>
<select id="queryUserById" resultType="pojo.User">
    select * from mydata.usertable where id=#{id}
</select>
```

- 测试一，两次查询同一记录(sqlsession 生命周期内):

  ```text
  Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  Opening JDBC Connection
  Created connection 293508253.
  Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  ==>  Preparing: select * from mydata.usertable where id=?
  ==> Parameters: 1(Integer)
  <==    Columns: id, username, password
  <==        Row: 1, 丛维仪, 110
  <==      Total: 1
  User(id=1, username=丛维仪, password=110)
  ==============================
  User(id=1, username=丛维仪, password=110)
  true
  Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  Returned connection 293508253 to pool.
  ```

  ::: tip
  由日志文件可以看出，两次查询同一记录只访问了一次数据库。
  :::

- 测试二，两次查询的不是同一记录：

  ```text
  Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  Opening JDBC Connection
  Created connection 293508253.
  Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  ==>  Preparing: select * from mydata.usertable where id=?
  ==> Parameters: 1(Integer)
  <==    Columns: id, username, password
  <==        Row: 1, 丛维仪, 110
  <==      Total: 1
  User(id=1, username=丛维仪, password=110)
  ==============================
  ==>  Preparing: select * from mydata.usertable where id=?
  ==> Parameters: 2(Integer)
  <==    Columns: id, username, password
  <==        Row: 2, 王海洋, 13573285937
  <==      Total: 1
  User(id=2, username=王海洋, password=13573285937)
  false
  Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  Returned connection 293508253 to pool.
  ```

  ::: tip
  由日志文件可以看出，两次查询不同记录访问了两次数据库。
  :::

- 测试三，查询完第一条记录后，更新数据库内任意记录，再次查询同一条记录：

  ```text
  Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  PooledDataSource forcefully closed/removed all connections.
  Opening JDBC Connection
  Created connection 293508253.
  Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  ==>  Preparing: select * from mydata.usertable where id=?
  ==> Parameters: 1(Integer)
  <==    Columns: id, username, password
  <==        Row: 1, 丛维仪, 110
  <==      Total: 1
  User(id=1, username=丛维仪, password=110)
  ==>  Preparing: update mydata.usertable set password=? where id=?
  ==> Parameters: test1(String), 2(Integer)
  <==    Updates: 1
  ==============================
  ==>  Preparing: select * from mydata.usertable where id=?
  ==> Parameters: 1(Integer)
  <==    Columns: id, username, password
  <==        Row: 1, 丛维仪, 110
  <==      Total: 1
  User(id=1, username=丛维仪, password=110)
  true
  Rolling back JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
  Returned connection 293508253 to pool.
  ```

  ::: tip
  由日志文件可以看出，更新数据库内容导致了缓存的更新。
  :::

### 缓存失效的情况

1. 查询不同的记录。
2. 增删改操作后，必定刷新缓存。
3. 查询不同的 mapper.xml。
4. 手动清理缓存。

手动清理缓存方法：

```java
sqlSession.clearCache();
```

## 二级缓存

### 开启二级缓存

在映射器 xml 中添加：

```xml
<cache/>
```

::: warning 注意
缓存只作用于 cache 标签所在的**映射文件**中的语句。如果你混合使用 Java API 和 XML 映射文件，在共用接口中的语句将不会被默认缓存。你需要使用 `@CacheNamespaceRef` 注解指定缓存作用域。
:::

### cache 元素的属性

```xml
<cache
  eviction="FIFO"
  flushInterval="60000"
  size="512"
  readOnly="true"/>
```

- eviction：指定清除策略，默认的清除策略是 **LRU**。

  可用的清除策略有：

  - LRU：最近最少使用：移除最长时间不被使用的对象。
  - FIFO：先进先出：按对象进入缓存的顺序来移除它们。
  - SOFT：软引用：基于垃圾回收器状态和软引用规则移除对象。
  - WEAK：弱引用：更积极地基于垃圾收集器状态和弱引用规则移除对象。

- flushInterval：可以被设置为任意的正整数，设置的值应该是一个以毫秒为单位的合理时间量。 默认情况是不设置，也就是没有刷新间隔，缓存仅仅会在调用语句时刷新。
- size：（引用数目）可以被设置为任意正整数，要注意欲缓存对象的大小和运行环境中可用的内存资源。默认值是 1024。
- readOnly：（只读）可以被设置为 true 或 false。只读的缓存会给所有调用者返回缓存对象的相同实例。 因此这些对象不能被修改。这就提供了可观的性能提升。而可读写的缓存会（通过序列化）返回缓存对象的拷贝。 速度上会慢一些，但是更安全，因此默认值是 false。

::: tip
二级缓存是事务性的。这意味着，当 SqlSession 完成并提交时，或是完成并回滚，但没有执行 flushCache=true 的 insert/delete/update 语句时，缓存会获得更新。
:::

### 使用二级缓存的步骤

开启全局缓存：

```xml
<settings>
    <setting name="cacheEnabled" value="true"/>
</settings>
```

在要开启二级缓存的 mapper.xml 中开启二级缓存：

```xml
<cache
        eviction="FIFO"
        flushInterval="30000"
        size="512"
        readOnly="false"
/>
```

::: warning 注意
若 readOnly 属性设置为 false，可能会抛出实体类的序列化异常。
:::

测试：

- 只有当会话提交或者关闭时，才会提交到二级缓存。
- 所有的数据都会先放在以及惠存。

异常分析：

为什么要实现序列化：

- 缓存机制：将查询结果保存到内存中。
- 内存饱满，需要移出时，MyBatis 就会自动将内存中的内容进行移除，但是文件很重要，不能，此时就需要进行序列化，以文件的形式将内容从内存保存到硬盘上，一个内容保存成文件的读写，必须实现序列化。

解决方法：

- 实体类实现 Serializable 序列化接口。
- 将 cache 元素的 readOnly 属性设置为 true。

### 二级缓存工作机制

- 一个会话查询一条记录，这个记录就会被放在当前会话的**一级缓存**中。
- 如果当前会话关闭了，一级缓存会消失，一级缓存中的数据被保存到二级缓存中。
- 新的会话查询信息，就可以从二级缓存中获取内容。
- 不同的 mapper 查出的数据会放在自己对应的缓存(map)中。

## 自定义缓存

除了上述缓存的方式，也可以通过实现你己的缓存，或为其他第三方缓存方案创建适配器，来完全覆盖缓存行为。

Ehcache 是一种广泛使用的开源 Java 分布式缓存。
