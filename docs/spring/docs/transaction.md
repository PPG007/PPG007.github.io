# 事务

## 声明式事务：AOP

MyBatis-Spring 借助了 Spring 中的 DataSourceTransactionManager 来实现事务管理。

- 配置对应的 Java Class为：DataSourceTransactionManager。

    - xml 方式方式配置：

        ```xml
        <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <constructor-arg ref="dataSource" />
        </bean>
        ```

    - Java 方式：

        ```java
        @Configuration
        public class DataSourceConfig {
            @Bean
            public DataSourceTransactionManager transactionManager() {
                return new DataSourceTransactionManager(dataSource());
            }
        }
        ```

::: warning 注意
为事务管理器指定的 DataSource 必须和用来创建 SqlSessionFactoryBean 的是同一个数据源，否则事务管理器就无法工作了。
:::

### 纯Java Config配置实现事务

要开启事务，必须在配置类上使用 `@EnableTransactionManagement` 注解开启事务：

```java
@Configuration
@EnableTransactionManagement
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
    // 配置事务管理器
    @Bean
    public DataSourceTransactionManager transactionManager() {
        return new DataSourceTransactionManager(getDataSource());
    }
    @Bean("userMapperImpl")
    public UserMapper getUserMapperImpl() throws Exception {
        UserMapperImpl userMapper = new UserMapperImpl();
        userMapper.setSqlSessionFactory(getSqlSessionFactory());
        return userMapper;
    }
}
```

在要开启事务的类或方法上添加 `@Transactional` 注解：

```java
@Transactional(rollbackFor = RuntimeException.class,propagation = Propagation.REQUIRED)
public interface UserMapper {

    /**
     * get users
     * @return userList
     */
    @Select("select * from mydata.usertable")
    List<User> getUsers();

    /**
     * add user
     * @param user user
     */
    @Insert("insert into mydata.usertable(id,username,password) values(#{id},#{username},#{password})")
    void addUser(User user);

    /**
     * delete user
     * @param id id
     */
    @Delete("delete from mydata.usertable where id=#{id}")
    void deleteUser(int id);

    @Update("update usertable set password=#{password} where id=31")
    void update(String password);

    void test()throws RuntimeException;
}
```

mapperImpl.java：

```java
public class UserMapperImpl extends SqlSessionDaoSupport implements UserMapper{
    @Override
    public List<User> getUsers() {
        return getSqlSession().getMapper(UserMapper.class).getUsers();
    }

    @Override
    public void addUser(User user) {
        getSqlSession().getMapper(UserMapper.class).addUser(user);
    }

    @Override
    public void deleteUser(int id) {
        getSqlSession().getMapper(UserMapper.class).deleteUser(id);
    }

    @Override
    public void update(String password) {
        getSqlSession().getMapper(UserMapper.class).update(password);
    }

    @Override
    public void test(){
        update("www");
        throw new RuntimeException("手动异常");
    }
}
```

测试代码：

```java
AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    UserMapper userMapperImpl = annotationConfigApplicationContext.getBean("userMapperImpl", UserMapper.class);
    userMapperImpl.test();
```

结果：数据库未进行任何修改。

#### 关于 @Transactional

- 作用于类：当把 `@Transactional` 注解放在类上时，表示所有该类的public方法都配置相同的事务属性信息。
- 作用于方法：当类配置了 `@Transactional`，方法也配置了 `@Transactional`，方法的事务会覆盖类的事务配置信息。
- 作用于接口：不推荐这种使用方法，因为一旦标注在 Interface 上并且配置了 Spring AOP 使用 CGLib 动态代理，将会导致 `@Transactional` 注解失效。

#### @Transactional 失效的几种情况

- `@Transactional` 应用在非 public 修饰的方法上

::: warning 注意
protected、private 修饰的方法上使用 `@Transactional` 注解，虽然事务无效，但不会有任何报错，这是我们很容犯错的一点。
:::

- `@Transactional` 注解属性 propagation 设置错误。
- `@Transactional` 注解属性 rollbackFor 设置错误。
- 同一个类中方法调用，导致 `@Transactional` 失效。

::: tip
比如有一个类 Test，它的一个方法 A，A 再调用本类的方法 B（不论方法 B 是用 public 还是 private 修饰），但方法 A 没有声明注解事务，而 B 方法有。则外部调用方法 A 之后，方法 B 的事务是不会起作用的。这也是经常犯错误的一个地方。
:::

- 异常被你的 catch “吃了”导致 `@Transactional` 失效。
- 数据库引擎不支持事务。

### xml 配置实现事务

Spring xml 配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd
http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd
http://www.springframework.org/schema/tx
        https://www.springframework.org/schema/tx/spring-tx.xsd">
    <context:annotation-config/>
    <bean id="user" class="zch.pojo.User"/>
    <bean id="datasource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="url" value="jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    </bean>
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="datasource"/>
<!--        <property name="configLocation" value="mybatis-config.xml"/>-->
        <property name="mapperLocations" value="classpath:mapper/UserMapper.xml"/>
        <property name="configuration">
            <bean class="org.apache.ibatis.session.Configuration">
                <property name="logImpl" value="org.apache.ibatis.logging.stdout.StdOutImpl"/>
            </bean>
        </property>
    </bean>
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>
    <bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
        <property name="sqlSessionTemplate" ref="sqlSession"/>
        <property name="mapperInterface" value="zch.mapper.UserMapper"/>
    </bean>
    <bean id="userMapperImpl" class="zch.mapper.UserMapperImpl">
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="datasource"/>
    </bean>
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="*" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>

    <aop:config>
        <aop:pointcut id="txPointCut" expression="execution(* zch.mapper.UserMapperImpl.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointCut"/>
    </aop:config>
</beans>
```
