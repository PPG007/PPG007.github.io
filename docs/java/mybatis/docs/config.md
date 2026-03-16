# Mybatis 配置解析

## Mybatis 配置文件：

- configuration（配置）。
- properties（属性）。
- settings（设置）。
- typeAliases（类型别名）。
- typeHandlers（类型处理器）。
- objectFactory（对象工厂）。
- plugins（插件）。
- environments（环境配置）。
- environment（环境变量）。
- transactionManager（事务管理器）。
- dataSource（数据源）。
- databaseIdProvider（数据库厂商标识）。
- mappers（映射器）。

## 各属性详解

### 环境配置及环境变量

尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。

### 事务管理器

默认 jdbc：

在 MyBatis 中有两种类型的事务管理器（也就是 type="[JDBC|MANAGED]"）：

如果你正在使用 Spring + MyBatis，则没有必要配置事务管理器，因为 Spring 模块会使用自带的管理器来覆盖前面的配置。

### 数据源

有三种内建的数据源类型（也就是 type="[UNPOOLED|POOLED|JNDI]"）：

- UNPOOLED：这个数据源的实现会每次请求时打开和关闭连接。虽然有点慢，但对那些数据库连接可用性要求不高的简单应用程序来说，是一个很好的选择。 性能表现则依赖于使用的数据库，对某些数据库来说，使用连接池并不重要，这个配置就很适合这种情形。
- POOLED：这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来，避免了创建新的连接实例时所必需的初始化和认证时间。 这种处理方式很流行，能使并发 Web 应用快速响应请求。（默认）
- JNDI：这个数据源实现是为了能在如 EJB 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个 JNDI 上下文的数据源引用。

### 属性

可以通过 properties 属性来实现引用配置文件：

这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置。

编写一个配置文件 db.properties：

```java
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC
username=root
password=123456
```

mybatis-config.xml 引入外部配置文件，若引用了外部文件，即使再添加 property 标签也优先使用外部配置：

```xml
<properties resource="db.properties">

</properties>
```

### 类型别名

给实体类起别名：

```xml
<typeAliases>
    <typeAlias type="pojo.User" alias="user"/>
</typeAliases>
```

扫描实体类的包，JavaBean 的默认别名就是类名的小写：

```xml
<package name="pojo.User"/>
```

可以在 JavaBean 中使用注解指定别名：

```java
@Alias("ttt")
public class User {
    private int id;
    private String username;
    private String password;
}
```

### 映射器

映射器的多种写法：

```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
<!-- 使用完全限定资源定位符（URL） -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>
<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```

最后两种方法通过 class 或 package 注册时，dao 层接口必须和配置文件同名，且接口和配置文件必须在同一个包下。

### 其他

[参考文档](https://mybatis.org/mybatis-3/zh/configuration.html#settings)
