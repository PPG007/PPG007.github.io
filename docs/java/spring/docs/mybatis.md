# Mybatis

[Mybatis](/mybatis/)

## 相关依赖

```xml
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.21</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.5</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.9.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.5</version>
        </dependency>
```

## 整合Mybatis

要和 Spring 一起使用 MyBatis，需要在 Spring 应用上下文中定义至少两样东西：一个 **SqlSessionFactory** 和至少一个**数据映射器**类。

### 使用 xml 配置整合

配置数据源：

```xml
<bean id="datasource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="url" value="jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC"/>
    <property name="username" value="root"/>
    <property name="password" value="123456"/>
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
</bean>
```

配置 SqlSessionFactory，对应的 class 为 **SqlSessionFactoryBean**：

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="datasource"/>
    <property name="configLocation" value="mybatis-config.xml"/>
    <property name="mapperLocations" value="classpath:mapper/UserMapper.xml"/>
</bean>
```

配置 mapper 接口：

```xml
<bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
    <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    <property name="mapperInterface" value="zch.mapper.UserMapper"/>
</bean>
```

调用代码：

```java
@Test
public void test() throws Exception {
    ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
    UserMapper userMapper = context.getBean("userMapper", UserMapper.class);
    List<User> users = userMapper.queryUsers();
    users.forEach(System.out::println);
}
```

::: tip
也可以不使用 MapperFactoryBean 来注册 mapper 接口，首先构造 mapper 接口的实现类，实现类中设置一个 sqlsession 对象，通过 sqlSession 实现增删改查，并在 Spring 配置中使用 set 方法注入。

还可以直接在 Spring 中配置 sqlSession，sqlSession 对应的 class 为 **sqlSessionTemplate**。

```xml
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
    <constructor-arg index="0" ref="sqlSessionFactory"/>
</bean>
<bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
    <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    <property name="sqlSessionTemplate" ref="sqlSession"/>
    <property name="mapperInterface" value="zch.mapper.UserMapper"/>
</bean>
```

:::

#### 关于 SqlSessionFactoryBean

多数据库支持：设置 `databaseIdProvider` 属性。

```xml
<bean id="databaseIdProvider" class="org.apache.ibatis.mapping.VendorDatabaseIdProvider">
  <property name="properties">
    <props>
      <prop key="SQL Server">sqlserver</prop>
      <prop key="DB2">db2</prop>
      <prop key="Oracle">oracle</prop>
      <prop key="MySQL">mysql</prop>
    </props>
  </property>
</bean>
```

设置 `sqlSessionFactory` 属性：

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource" />
  <property name="mapperLocations" value="classpath*:sample/config/mappers/**/*.xml" />
  <property name="databaseIdProvider" ref="databaseIdProvider"/>
</bean>
```

通过 `configuration` 属性在没有对应的 MyBatis XML 配置文件的情况下，直接设置 `Configuration` 实例。

- 注意：`configLocation` 不能与 `configuration` 同时存在。

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="datasource"/>
<!--        <property name="configLocation" value="mybatis-config.xml"/>-->
    <property name="mapperLocations" value="classpath:mapper/UserMapper.xml"/>
    <property name="configuration">
        <bean class="org.apache.ibatis.session.Configuration">
            <!-- 配置标准日志 -->
            <property name="logImpl" value="org.apache.ibatis.logging.stdout.StdOutImpl"/>
            <!-- 开启驼峰命名转换 -->
            <property name="mapUnderscoreToCamelCase" value="true"/>
        </bean>
    </property>
</bean>
```

##### 关于SqlSession

- SqlSessionTemplate：

  SqlSessionTemplate 是线程安全的，是 SqlSession 的一个实现，可以被多个 DAO 或映射器所共享使用。

  ```xml
  <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
  <constructor-arg index="0" ref="sqlSessionFactory" />
  </bean>
  ```

  在 mapper 的实现类中实现注入：

  ```xml
  <bean id="userDao" class="org.mybatis.spring.sample.dao.UserDaoImpl">
  <property name="sqlSession" ref="sqlSession" />
  </bean>
  ```

- SqlSessionDaoSupport：

  SqlSessionDaoSupport 是一个抽象的支持类，用来为你提供 SqlSession。调用 getSqlSession() 方法你会得到一个 SqlSessionTemplate，之后可以用于执行 SQL 方法，就像下面这样:

  ```java
  public class UserDaoImpl extends SqlSessionDaoSupport implements UserDao {
  public User getUser(String userId) {
      return getSqlSession().selectOne("org.mybatis.spring.sample.mapper.UserMapper.getUser", userId);
  }
  }
  ```

  SqlSessionDaoSupport 需要通过属性设置一个 sqlSessionFactory 或 SqlSessionTemplate。如果两个属性都被设置了，那么 SqlSessionFactory 将被忽略。

  假设类 UserMapperImpl 是 SqlSessionDaoSupport 的子类，可以编写如下的 Spring 配置来执行设置：

  ```xml
  <bean id="userDao" class="org.mybatis.spring.sample.dao.UserDaoImpl">
  <property name="sqlSessionFactory" ref="sqlSessionFactory" />
  </bean>
  ```

### 使用 Java 注解进行配置

Java Config文件：

```java
@Configuration
public class Config {

    @Bean("user")
    public User getUser(){
        return new User();
    }

    @Bean("userMapper")
    public MapperFactoryBean<UserMapper> getUserMapper() throws Exception {
        MapperFactoryBean<UserMapper> userMapperMapperFactoryBean = new MapperFactoryBean<>(UserMapper.class);
        userMapperMapperFactoryBean.setSqlSessionFactory(getSqlSessionFactory());
        return userMapperMapperFactoryBean;
    }

    @Bean("sqlSessionFactory")
    public SqlSessionFactory getSqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(getDataSource());
        return sqlSessionFactoryBean.getObject();
    }

    @Bean("dataSource")
    public DriverManagerDataSource getDataSource(){
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC");
        driverManagerDataSource.setUsername("root");
        driverManagerDataSource.setPassword("123456");
        return driverManagerDataSource;
    }
}
```

mapper接口：

```java
public interface UserMapper {

    /**
     * get users
     * @return userList
     */
    @Select("select * from mydata.usertable")
    List<User> getUsers();
}
```

```java
@Test
public void test(){
    AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    UserMapper userMapper = annotationConfigApplicationContext.getBean("userMapper", UserMapper.class);
    List<User> users = userMapper.getUsers();
    users.forEach(System.out::println);
}
```

### 总结

1. 配置数据源
   - 数据源对应的Java Class为：DriverManagerDataSource
   - 通过注解配置时，要注意返回的类型是 DriverManagerDataSource
2. 配置SqlSessionFactory
   - 对应的Java Class为：SqlSessionFactoryBean
     通过注解配置时同样返回SqlSessionFactoryBean的getObject()
3. 直接利用SqlSessionFactory配置mapper
   - 对应的Java Class为：MapperFactoryBean
4. 或者在mapper接口的实现类中进行SqlSession的配置
   - 直接使用SqlSession实现CRUD，mapper注入SqlSessionTemplate，在SqlSessionTemplate中注入SqlSessionFactory
   - 通过继承SqlSessionDaoSupport，注入SqlSessionFactory
