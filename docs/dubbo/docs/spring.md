# Spring 整合 Dubbo

实际开发中往往存在很多接口，Dubbo 通过动态代理为接口生成代理对象，并在调用时利用 Netty 发送请求获取结果，调用的是服务提供者的接口实现类，因此消费者与提供者是面向接口交互的，为了开发方便，避免同一个接口在生产者消费者中多次重复定义的情况，将共用的接口、实体类全部放在一个工程中，并通过 Maven 管理在生产者消费者中引用。

## 定义接口模块

导入依赖

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.18</version>
</dependency>
```

定义一个实体类

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class User implements Serializable {

    static final long serialVersionUID = 114514L;

    private Integer id;

    private String username;

    private String password;

    private Date birthday;

}
```

定义两个接口，一个由生产者实现，一个由消费者实现

```java
public interface IUserService {

    /**
     * 获取用户年龄
     * @param user user 对象
     * @return 年龄
     */
    Integer getAge(User user);
}
```

```java
public interface IUserServiceConsumer {

    /**
     * 消费者调用提供者方法输出结果
     */
    void demo();
}
```

## 定义服务提供者

### 导入依赖，引入 API 接口模块及 Dubbo

依赖问题：

当前 Maven 仓库中包含 `com.alibaba.dubbo` 以及 `org.apache.dubbo`。

- 当引用阿里巴巴的 Dubbo 依赖时，需要再引入 Netty，且如果要使用 ZooKeeper 还要引入 ZooKeeper 依赖，这样引入 `curator-framework` 一个依赖即可：

```xml
<dependency>
    <artifactId>UserService-API</artifactId>
    <groupId>org.example</groupId>
    <version>1.0-SNAPSHOT</version>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>dubbo</artifactId>
    <version>2.6.10</version>
</dependency>

<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-framework</artifactId>
    <version>5.1.0</version>
</dependency>
```

- 当引用 Apache 的 Dubbo 时，不需要再引入 Netty 但要引入 ZooKeeper，Apache为我们提供了一个集成依赖：`dubbo-dependencies-zookeeper`：

```xml
<dependency>
    <artifactId>UserService-API</artifactId>
    <groupId>org.example</groupId>
    <version>1.0-SNAPSHOT</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.dubbo/dubbo -->
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo</artifactId>
    <version>2.7.13</version>
</dependency>
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-dependencies-zookeeper</artifactId>
    <version>2.7.13</version>
    <type>pom</type>
</dependency>
```

- 如果使用了阿里巴巴 Dubbo 同时使用了 Apache 的集成依赖，要再引入 Netty：

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.1.55.Final</version>
</dependency>
```

- 如果使用了 Apache 的 Dubbo 同时使用了 curator-framework，要再引入 curator-recipes。

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.0</version>
</dependency>
```

由于 curator-recipes 中包含了 curator-framework，所以可以不引入 curator-framework。

Dubbo 中包含了 Spring 所以不需要显式引入 Spring。

实现接口

```java
public class UserServiceImpl implements IUserService {

    @Override
    public Integer getAge(User user) {
        Calendar birthday = Calendar.getInstance();
        birthday.setTime(user.getBirthday());
        Calendar now= Calendar.getInstance();
        return now.get(Calendar.YEAR) - birthday.get(Calendar.YEAR);
    }

}
```

### 使用 xml 配置 Spring 并启动

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://dubbo.apache.org/schema/dubbo
       http://dubbo.apache.org/schema/dubbo/dubbo.xsd">
    <dubbo:application name="user-service-provider"/>
    <dubbo:registry address="127.0.0.1:2181" protocol="zookeeper"/>
    <dubbo:protocol name="dubbo" port="8848"/>
    <bean id="userService" class="service.impl.UserServiceImpl">

    </bean>
    <dubbo:monitor protocol="registry"/>
    <dubbo:service interface="service.IUserService" ref="userService"/>
</beans>
```

```java
public class Main {
    public static void main(String[] args) throws IOException {
        ClassPathXmlApplicationContext classPathXmlApplicationContext = new ClassPathXmlApplicationContext("beans.xml");
        classPathXmlApplicationContext.start();
        System.in.read();
    }
}
```

#### 注解配置（2.6.3 版本以上）

定义properties文件，内容就是xml的内容

```properties
dubbo.application.name=user-service-provider
dubbo.registry.address=zookeeper://127.0.0.1:2181
dubbo.protocol.name=dubbo
dubbo.protocol.port=20880
```

启动类

```java
public class Main {
    public static void main(String[] args) throws IOException {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(ProviderConfiguration.class);
        annotationConfigApplicationContext.start();
        System.in.read();
    }
}

```

引用阿里巴巴dubbo时：

配置类

```java
@Configuration//com.alibaba.dubbo.config.spring.context.annotation.EnableDubbo
@EnableDubbo(scanBasePackages = "service.impl")
@PropertySource("classpath:dubbo-provider.properties")
public class ProviderConfiguration {


}
```

接口实现类

```java
@Service//com.alibaba.dubbo.config.annotation.Service
public class UserServiceImpl implements IUserService {

    @Override
    public Integer getAge(User user) {
        Calendar birthday = Calendar.getInstance();
        birthday.setTime(user.getBirthday());
        Calendar now= Calendar.getInstance();
        return now.get(Calendar.YEAR) - birthday.get(Calendar.YEAR);
    }

}
```

引入Apache dubbo时：

配置类

```java
@Configuration
//引入的是org.apache.dubbo.config.spring.context.annotation.EnableDubbo
@EnableDubbo(scanBasePackages = "service.impl")
@PropertySource("classpath:dubbo-provider.properties")
public class ProviderConfiguration {


}
```

接口实现类

使用DubboService注解

```java
@DubboService
public class UserServiceImpl implements IUserService {

    @Override
    public Integer getAge(User user) {
        Calendar birthday = Calendar.getInstance();
        birthday.setTime(user.getBirthday());
        Calendar now= Calendar.getInstance();
        return now.get(Calendar.YEAR) - birthday.get(Calendar.YEAR);
    }

}
```

## 定义消费者

### 导入依赖

依赖关系与生产者相同

### 使用 xml 配置 Spring 并调用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xmlns:context="http://www.springframework.org/schema/context"

       xsi:schemaLocation="
       http://www.springframework.org/schema/beans

       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://dubbo.apache.org/schema/dubbo
       http://dubbo.apache.org/schema/dubbo/dubbo.xsd">

    <dubbo:application name="user-service-consumer"/>
    <dubbo:registry address="zookeeper://127.0.0.1:2181"/>
    <dubbo:reference interface="service.IUserService" id="userService"/>
    <!--直连-->
    <dubbo:monitor address="localhost:8888"/>

<!--    <dubbo:monitor protocol="registry"/>-->
    <context:component-scan base-package="service"/>
    <context:annotation-config/>

</beans>
```

接口实现类

```java
@Service//spring
public class UserServiceConsumerImpl implements IUserServiceConsumer{


    private IUserService userService;

    @Autowired//会报错但是没问题
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public void demo() {
        User user = new User();
        Calendar instance = Calendar.getInstance();
        instance.set(Calendar.YEAR,2000);
        Date bir = instance.getTime();
        user.setBirthday(bir);
        System.out.println(userService.getAge(user));
    }
}
```

启动类

```java
public class Main {
    public static void main(String[] args) throws IOException {
        ClassPathXmlApplicationContext classPathXmlApplicationContext = new ClassPathXmlApplicationContext("beans.xml");
        classPathXmlApplicationContext.start();
        IUserServiceConsumer bean = classPathXmlApplicationContext.getBean(IUserServiceConsumer.class);
        bean.demo();
        System.in.read();
    }
}
```

#### 使用注解配置

启动类：

```java
public class Main {
    public static void main(String[] args) throws IOException {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(ConsumerConfiguration.class);
        IUserServiceConsumer serviceConsumer = annotationConfigApplicationContext.getBean(IUserServiceConsumer.class);
        serviceConsumer.demo();

        System.in.read();
    }
}
```

properties文件

```properties
dubbo.application.name=user-service-consumer
dubbo.registry.address=zookeeper://127.0.0.1:2181
```

使用阿里巴巴dubbo

配置类

```java
@Configuration
@PropertySource("classpath:dubbo-consumer.properties")
@EnableDubbo(scanBasePackages = "service")
@ComponentScan(basePackages = "service")
public class ConsumerConfiguration {
}
```

消费者接口实现类

```java
@Service//spring
public class UserServiceConsumerImpl implements IUserServiceConsumer{


    private IUserService userService;

    @Reference//dubbo
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public void demo() {
        User user = new User();
        Calendar instance = Calendar.getInstance();
        instance.set(Calendar.YEAR,2000);
        Date bir = instance.getTime();
        user.setBirthday(bir);
        System.out.println(userService.getAge(user));
    }
}
```

使用Apache dubbo

配置类

```java
@Configuration
@PropertySource("classpath:dubbo-consumer.properties")
@EnableDubbo(scanBasePackages = "service")//org.apache.dubbo.config.spring.context.annotation.EnableDubbo
@ComponentScan(basePackages = "service")
public class ConsumerConfiguration {
}
```

消费者接口实现类

```java
@Service
public class UserServiceConsumerImpl implements IUserServiceConsumer{


    private IUserService userService;

    @DubboReference
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public void demo() {
        User user = new User();
        Calendar instance = Calendar.getInstance();
        instance.set(Calendar.YEAR,2000);
        Date bir = instance.getTime();
        user.setBirthday(bir);
        System.out.println(userService.getAge(user));
    }
}
```
