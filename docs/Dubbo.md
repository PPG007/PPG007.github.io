# Dubbo工作原理

![//imgs/architecture.png](/Dubbo/architecture.png)

- 服务提供者（Provider）：暴露服务的服务提供方，服务提供者在启动时，向注册中心注册自己提供的服务。
- 服务消费者（Consumer）: 调用远程服务的服务消费方，服务消费者在启动时，向注册中心订阅自己所需的服务，服务消费者，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。
- 注册中心（Registry）：注册中心返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。
- 监控中心（Monitor）：服务消费者和提供者，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心。

# 环境准备

### 注册中心ZooKeeper

下载地址：[ZooKeeper](http://zookeeper.apache.org/releases.html)

下载完成后解压，在conf目录下有zoo.cfg文件，其中保存着ZooKeeper的配置，例如端口号等，这里我们使用默认配置，端口号为2181

Windows环境下双击bin目录下的`zkServer.cmd`即可开启ZooKeeper

### Dubbo可视化面板

下载地址：[Dubbo-Admin](https://github.com/apache/dubbo-admin/tree/master-0.2.0)

以下命令需要配置Maven环境变量及Node.js环境变量

默认分支最新已经切换为Vue前后端分离版，master-0.2.0分支仍然是不分离版，此处方便起见使用不分离版本，如果要使用前后端分离，则将后台打包后启动，在前端中运行`npm install`下载依赖然后运行`npm run dev`启动前端，访问对应端口即可

进入dubbo-admin目录中，运行`mvn package`命令，生成一个target文件夹，使用`java -jar`命令运行其中jar包即可

进入dubbo-monitor-simple文件夹，运行`mvn package`命令生成target文件夹，解压其中生成的压缩包，进入解压后的目录，其中config文件中的配置文件配置了相关端口等，可自行修改，这里使用默认即可，进入bin目录运行`start.bat`即可

# Spring整合Dubbo

实际开发中往往存在很多接口，Dubbo通过动态代理为接口生成代理对象，并在调用时利用Netty发送请求获取结果，调用的是服务提供者的接口实现类，因此消费者与提供者是面向接口交互的，为了开发方便，避免同一个接口在生产者消费者中多次重复定义的情况，将共用的接口、实体类全部放在一个工程中，并通过Maven管理在生产者消费者中引用

### 定义接口模块

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

### 定义服务提供者

##### 导入依赖，引入API接口模块及Dubbo

依赖问题：

当前Maven仓库中包含`com.alibaba.dubbo`以及`org.apache.dubbo`

- 当引用阿里巴巴的dubbo依赖时，需要再引入netty，且如果要使用ZooKeeper还要引入ZooKeeper依赖，这样引入`curator-framework`一个依赖即可：

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

- 当引用Apache的dubbo时，不需要再引入Netty但要引入ZooKeeper，Apache为我们提供了一个集成依赖：`dubbo-dependencies-zookeeper`

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

- 如果使用了阿里巴巴dubbo同时使用了阿帕奇的集成依赖，要再引入netty

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.1.55.Final</version>
</dependency>
```

- 如果使用了Apache的dubbo同时使用了curator-framework，要再引入curator-recipes

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.2.0</version>
</dependency>
```

由于curator-recipes中包含了curator-framework，所以可以不引入curator-framework

Dubbo中包含了Spring所以不需要显式引入Spring

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

##### 使用xml配置Spring并启动

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

##### 注解配置（2.6.3版本以上）

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

### 定义消费者

##### 导入依赖

依赖关系与生产者相同

##### 使用xml配置Spring并调用

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

##### 使用注解配置

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

# 各配置项、标签说明

### dubbo:application

对应配置类==org.apache.dubbo.config.ApplicationConfig==

属性：

| 属性         | 类型   | 是否必填 | 描述                                                         | 默认值    |
| ------------ | ------ | -------- | ------------------------------------------------------------ | --------- |
| name         | String | ==必填== | 当前应用名称，用于注册中心计算应用间依赖关系，注意：消费者和提供者应用名不要一样 |           |
| version      | String |          | 当前应用的版本                                               |           |
| owner        | String |          | 应用负责人，用于服务治理，请填写负责人公司邮箱前缀           |           |
| organization | String |          | 组织名称(BU或部门)，用于注册中心区分服务来源，此配置项建议不要使用autoconfig，直接写死在配置中 |           |
| architecture | String |          | 用于服务分层对应的架构。如，intl、china。不同的架构使用不同的分层。 |           |
| environment  | String |          | 应用环境，如：develop/test/product，不同环境使用不同的缺省值，以及作为只用于开发测试功能的限制条件 |           |
| compiler     | String |          | Java字节码编译器，用于动态类的生成，可选：jdk或javassist     | javassist |
| logger       | String |          | 日志输出方式，可选：slf4j,jcl,log4j,log4j2,jdk               | slf4j     |

### dubbo:registry

注册中心配置

对应的配置类： ==org.apache.dubbo.config.RegistryConfig==

可以有多个

| 属性       | 类型    | 是否必填 | 描述                                                         | 默认值 |
| ---------- | ------- | -------- | ------------------------------------------------------------ | ------ |
| id         | string  |          | 注册中心引用BeanId，可以在<dubbo:service registry="">或<dubbo:reference registry="">中引用此ID |        |
| address    | string  | ==必填== | 注册中心服务器地址，如果地址没有端口缺省为9090，同一集群内的多个地址用逗号分隔，如：ip:port,ip:port，不同集群的注册中心，请配置多个<dubbo:registry>标签 |        |
| protocol   | string  |          | 注册中心地址协议，支持`dubbo`, `multicast`, `zookeeper`, `redis`, `consul(2.7.1)`, `sofa(2.7.2)`, `etcd(2.7.2)`, `nacos(2.7.2)`等协议 | dubbo  |
| port       | int     |          | 注册中心缺省端口，当address没有带端口时使用此端口做为缺省值  | 9090   |
| username   | string  |          | 登录注册中心用户名，如果注册中心不需要验证可不填             |        |
| password   | string  |          | 登录注册中心密码，如果注册中心不需要验证可不填               |        |
| transport  | string  |          | 网络传输方式，可选mina,netty                                 | netty  |
| timeout    | int     |          | 注册中心请求超时时间(毫秒)                                   | 5000   |
| session    | int     |          | 注册中心会话超时时间(毫秒)，用于检测提供者非正常断线后的脏数据，比如用心跳检测的实现，此时间就是心跳间隔，不同注册中心实现不一样。 | 60000  |
| file       | string  |          | 使用文件缓存注册中心地址列表及服务提供者列表，应用重启时将基于此文件恢复，注意：两个注册中心不能使用同一文件存储 |        |
| wait       | int     |          | 停止时等待通知完成时间(毫秒)                                 | 0      |
| check      | boolean |          | 注册中心不存在时，是否报错                                   | true   |
| register   | boolean |          | 是否向此注册中心注册服务，如果设为false，将只订阅，不注册    | true   |
| subscribe  | boolean |          | 是否向此注册中心订阅服务，如果设为false，将只注册，不订阅    | true   |
| dynamic    | boolean |          | 服务是否动态注册，如果设为false，注册后将显示为disable状态，需人工启用，并且服务提供者停止时，也不会自动取消注册，需人工禁用。 | true   |
| group      | string  |          | 服务注册分组，跨组的服务不会相互影响，也无法相互调用，适用于环境隔离 | dubbo  |
| simplified | boolean |          | 注册到注册中心的URL是否采用精简模式的（与低版本兼容）        | false  |
| extra-keys | string  |          | 在simplified=true时，extraKeys允许你在默认参数外将额外的key放到URL中，格式：“interface,key1,key2”。 |        |

### dubbo:protocol

服务提供者协议配置

对应的配置类：==org.apache.dubbo.config.ProtocolConfig==

可以有多个，在dubbo:service中通过protocol指定

| 属性          | 类型           | 是否必填 | 描述                                                         | 默认值                                                       |
| ------------- | -------------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| id            | string         |          | 协议BeanId，可以在<dubbo:service protocol="">中引用此ID，如果ID不填，缺省和name属性值一样，重复则在name后加序号 | dubbo                                                        |
| name          | string         | ==必填== | 协议名称                                                     | dubbo                                                        |
| port          | int            |          | 服务端口                                                     | dubbo协议缺省端口为20880，rmi协议缺省端口为1099，http和hessian协议缺省端口为80；如果**没有**配置port，则自动采用默认端口，如果配置为**-1**，则会分配一个没有被占用的端口。 |
| host          | string         |          |                                                              | 自动查找本机IP                                               |
| threadpool    | string         |          | 线程池类型，可选：fixed/cached                               | fixed                                                        |
| threads       | int            |          | 服务线程池大小(固定大小)                                     | 200                                                          |
| iothreads     | int            |          | io线程池大小(固定大小)                                       | cpu个数+1                                                    |
| payload       | int            |          | 请求及响应数据包大小限制，单位：字节                         | 8388608(=8M)                                                 |
| accepts       | int            |          | 服务提供方最大可接受连接数                                   | 0                                                            |
| codec         | string         |          | 协议编码方式                                                 | dubbo                                                        |
| serialization | string         |          | 协议序列化方式，当协议支持多种序列化方式时使用，比如：dubbo协议的dubbo,hessian2,java,compactedjava，以及http协议的json等 | dubbo协议缺省为hessian2，rmi协议缺省为java，http协议缺省为json |
| accesslog     | string/boolean |          | 设为true，将向logger中输出访问日志，也可填写访问日志文件路径，直接把访问日志输出到指定文件 |                                                              |
| path          | string         |          | 提供者上下文路径，为服务path的前缀                           |                                                              |
| transporter   | string         |          | 协议的服务端和客户端实现类型，比如：dubbo协议的mina,netty等，可以分拆为server和client配置 | dubbo协议缺省为netty                                         |

| 属性        | 类型    | 是否必填 | 描述                                                         | 默认值                                      |
| ----------- | ------- | -------- | ------------------------------------------------------------ | ------------------------------------------- |
| server      | string  |          | 协议的服务器端实现类型，比如：dubbo协议的mina,netty等，http协议的jetty,servlet等 | dubbo协议缺省为netty，http协议缺省为servlet |
| client      | string  |          | 协议的客户端实现类型，比如：dubbo协议的mina,netty等          | dubbo协议缺省为netty                        |
| dispatcher  | string  |          | 协议的消息派发方式，用于指定线程模型，比如：dubbo协议的all, direct, message, execution, connection等 | dubbo协议缺省为all                          |
| queues      | int     |          | 线程池队列大小，当线程池满时，排队等待执行的队列大小，建议不要设置，当线程池满时应立即失败，重试其它服务提供机器，而不是排队，除非有特殊需求。 | 0                                           |
| charset     | string  |          | 序列化编码                                                   | UTF-8                                       |
| buffer      | int     |          | 网络读写缓冲区大小                                           | 8192                                        |
| heartbeat   | int     |          | 心跳间隔，对于长连接，当物理层断开时，比如拔网线，TCP的FIN消息来不及发送，对方收不到断开事件，此时需要心跳来帮助检查连接是否已断开 | 0                                           |
| telnet      | string  |          | 所支持的telnet命令，多个命令用逗号分隔                       |                                             |
| register    | boolean |          | 该协议的服务是否注册到注册中心                               | true                                        |
| contextpath | string  |          |                                                              | 缺省为空串                                  |

### dubbo:service

服务提供者暴露服务配置

对应的配置类：==org.apache.dubbo.config.ServiceConfig==

| 属性        | 类型           | 是否必填 | 描述                                                         | 默认值                     |
| ----------- | -------------- | -------- | ------------------------------------------------------------ | -------------------------- |
| interface   | class          | ==必填== | 服务接口名                                                   |                            |
| ref         | object         | ==必填== | 服务对象实现引用                                             |                            |
| version     | string         | 可选     | 服务版本，建议使用两位数字版本，如：1.0，通常在接口不兼容时版本号才需要升级 | 0.0.0                      |
| group       | string         | 可选     | 服务分组，当一个接口有多个实现，可以用分组区分               |                            |
| path        | string         | 可选     | 服务路径 (注意：1.0不支持自定义路径，总是使用接口名，如果有1.0调2.0，配置服务路径可能不兼容) | 缺省为接口名               |
| delay       | int            | 可选     | 延迟注册服务时间(毫秒) ，设为-1时，表示延迟到Spring容器初始化完成时暴露服务 | 0                          |
| timeout     | int            | 可选     | 远程服务调用超时时间(毫秒)                                   | 1000                       |
| retries     | int            | 可选     | 远程服务调用重试次数，不包括第一次调用，不需要重试请设为0    | 2                          |
| connections | int            | 可选     | 对每个提供者的最大连接数，rmi、http、hessian等短连接协议表示限制连接数，dubbo等长连接协表示建立的长连接个数 | 100                        |
| loadbalance | string         | 可选     | 负载均衡策略，可选值：random,roundrobin,leastactive，分别表示：随机，轮询，最少活跃调用 | random                     |
| async       | boolean        | 可选     | 是否缺省异步执行，不可靠异步，只是忽略返回值，不阻塞执行线程 | false                      |
| local       | class/boolean  | 可选     | 设为true，表示使用缺省代理类名，即：接口名 + Local后缀，已废弃，请使用stub | false                      |
| stub        | class/boolean  | 可选     | 设为true，表示使用缺省代理类名，即：接口名 + Stub后缀，服务接口客户端本地代理类名，用于在客户端执行本地逻辑，如本地缓存等，该本地代理类的构造函数必须允许传入远程代理对象，构造函数如：public XxxServiceStub(XxxService xxxService) | false                      |
| mock        | class/boolean  | 可选     | 设为true，表示使用缺省Mock类名，即：接口名 + Mock后缀，服务接口调用失败Mock实现类，该Mock类必须有一个无参构造函数，与Local的区别在于，Local总是被执行，而Mock只在出现非业务异常(比如超时，网络异常等)时执行，Local在远程调用之前执行，Mock在远程调用后执行。 | false                      |
| token       | string/boolean | 可选     | 令牌验证，为空表示不开启，如果为true，表示随机生成动态令牌，否则使用静态令牌，令牌的作用是防止消费者绕过注册中心直接访问，保证注册中心的授权功能有效，如果使用点对点调用，需关闭令牌功能 | false                      |
| registry    | string         | 可选     | 向指定注册中心注册，在多个注册中心时使用，值为<dubbo:registry>的id属性，多个注册中心ID用逗号分隔，如果不想将该服务注册到任何registry，可将值设为N/A | 缺省向所有registry注册     |
| provider    | string         | 可选     | 指定provider，值为<dubbo:provider>的id属性                   | 缺省使用第一个provider配置 |
| deprecated  | boolean        | 可选     | 服务是否过时，如果设为true，消费方引用时将打印服务过时警告error日志 | false                      |
| dynamic     | boolean        | 可选     | 服务是否动态注册，如果设为false，注册后将显示后disable状态，需人工启用，并且服务提供者停止时，也不会自动取消册，需人工禁用。 | true                       |
| accesslog   | string/boolean | 可选     | 设为true，将向logger中输出访问日志，也可填写访问日志文件路径，直接把访问日志输出到指定文件 | false                      |
| owner       | string         | 可选     | 服务负责人，用于服务治理，请填写负责人公司邮箱前缀           |                            |
| document    | string         | 可选     | 服务文档URL                                                  |                            |
| weight      | int            | 可选     | 服务权重                                                     |                            |
| executes    | int            | 可选     | 服务提供者每服务每方法最大可并行执行请求数                   | 0                          |
| proxy       | string         | 可选     | 生成动态代理方式，可选：jdk/javassist                        | javassist                  |
| cluster     | string         | 可选     | 集群方式，可选：failover/failfast/failsafe/failback/forking  | failover                   |
| filter      | string         | 可选     | 服务提供方远程调用过程拦截器名称，多个名称用逗号分隔         | default                    |
| listener    | string         | 可选     | 服务提供方导出服务监听器名称，多个名称用逗号分隔             | default                    |
| protocol    | string         | 可选     | 使用指定的协议暴露服务，在多协议时使用，值为<dubbo:protocol>的id属性，多个协议ID用逗号分隔 |                            |
| layer       | string         | 可选     | 服务提供者所在的分层。如：biz、dao、intl:web、china:acton。  |                            |
| register    | boolean        | 可选     | 该协议的服务是否注册到注册中心                               | true                       |

### dubbo:monitor

监控中心配置。

对应的配置类：==org.apache.dubbo.config.MonitorConfig==

| 属性     | 类型   | 是否必填 | 描述                                                         | 默认值 |
| -------- | ------ | -------- | ------------------------------------------------------------ | ------ |
| protocol | string | 可选     | 监控中心协议，如果为protocol=“registry”，表示从注册中心发现监控中心地址，否则直连监控中心。 | dubbo  |
| address  | string | 可选     | 直连监控中心服务器地址，address=“10.20.130.230:12080”        | N/A    |

### dubbo:reference

服务消费者引用服务配置。

对应的配置类：==org.apache.dubbo.config.ReferenceConfig==

| 属性        | 类型           | 是否必填 | 描述                                                         | 缺省值                                   |
| ----------- | -------------- | -------- | ------------------------------------------------------------ | ---------------------------------------- |
| id          | string         | ==必填== | 服务引用BeanId                                               |                                          |
| interface   | class          | ==必填== | 服务接口名                                                   |                                          |
| version     | string         | 可选     | 服务版本，与服务提供者的版本一致                             |                                          |
| group       | string         | 可选     | 服务分组，当一个接口有多个实现，可以用分组区分，必需和服务提供方一致 |                                          |
| timeout     | long           | 可选     | 服务方法调用超时时间(毫秒)                                   | 缺省使用<dubbo:consumer>的timeout        |
| retries     | int            | 可选     | 远程服务调用重试次数，不包括第一次调用，不需要重试请设为0    | 缺省使用<dubbo:consumer>的retries        |
| connections | int            | 可选     | 对每个提供者的最大连接数，rmi、http、hessian等短连接协议表示限制连接数，dubbo等长连接协表示建立的长连接个数 | 缺省使用<dubbo:consumer>的connections    |
| loadbalance | string         | 可选     | 负载均衡策略，可选值：random,roundrobin,leastactive，分别表示：随机，轮询，最少活跃调用 | 缺省使用<dubbo:consumer>的loadbalance    |
| async       | boolean        | 可选     | 是否异步执行，不可靠异步，只是忽略返回值，不阻塞执行线程     | 缺省使用<dubbo:consumer>的async          |
| generic     | boolean        | 可选     | 是否缺省泛化接口，如果为泛化接口，将返回GenericService       | 缺省使用<dubbo:consumer>的generic        |
| check       | boolean        | 可选     | 启动时检查提供者是否存在，true报错，false忽略                | 缺省使用<dubbo:consumer>的check          |
| url         | string         | 可选     | 点对点直连服务提供者地址，将绕过注册中心                     |                                          |
| stub        | class/boolean  | 可选     | 服务接口客户端本地代理类名，用于在客户端执行本地逻辑，如本地缓存等，该本地代理类的构造函数必须允许传入远程代理对象，构造函数如：public XxxServiceLocal(XxxService xxxService) |                                          |
| mock        | class/boolean  | 可选     | 服务接口调用失败Mock实现类名，该Mock类必须有一个无参构造函数，与Local的区别在于，Local总是被执行，而Mock只在出现非业务异常(比如超时，网络异常等)时执行，Local在远程调用之前执行，Mock在远程调用后执行。 |                                          |
| cache       | string/boolean | 可选     | 以调用参数为key，缓存返回结果，可选：lru, threadlocal, jcache等 |                                          |
| validation  | boolean        | 可选     | 是否启用JSR303标准注解验证，如果启用，将对方法参数上的注解进行校验 |                                          |
| proxy       | boolean        | 可选     | 选择动态代理实现策略，可选：javassist, jdk                   | javassist                                |
| client      | string         | 可选     | 客户端传输类型设置，如Dubbo协议的netty或mina。               |                                          |
| registry    | string         | 可选     | 从指定注册中心注册获取服务列表，在多个注册中心时使用，值为<dubbo:registry>的id属性，多个注册中心ID用逗号分隔 | 缺省将从所有注册中心获服务列表后合并结果 |
| owner       | string         | 可选     | 调用服务负责人，用于服务治理，请填写负责人公司邮箱前缀       |                                          |
| actives     | int            | 可选     | 每服务消费者每服务每方法最大并发调用数                       | 0                                        |
| cluster     | string         | 可选     | 集群方式，可选：failover/failfast/failsafe/failback/forking  | failover                                 |
| filter      | string         | 可选     | 服务消费方远程调用过程拦截器名称，多个名称用逗号分隔         | default                                  |
| listener    | string         | 可选     | 服务消费方引用服务监听器名称，多个名称用逗号分隔             | default                                  |
| layer       | string         | 可选     | 服务调用者所在的分层。如：biz、dao、intl:web、china:acton。  |                                          |
| init        | boolean        | 可选     | 是否在afterPropertiesSet()时饥饿初始化引用，否则等到有人注入或引用该实例时再初始化。 | false                                    |
| protocol    | string         | 可选     | 属性只调用指定协议的服务提供方，其它协议忽略。               | 对应URL参数                              |

### dubbo:config-center

配置中心。

对应的配置类：==org.apache.dubbo.config.ConfigCenterConfig==

| 属性               | 类型                | 是否必填 | 描述                                                         | 默认值           |
| ------------------ | ------------------- | -------- | ------------------------------------------------------------ | ---------------- |
| protocol           | string              | 可选     | 使用哪个配置中心：apollo、zookeeper、nacos等。 以zookeeper为例 1. 指定protocol，则address可以简化为`127.0.0.1:2181`； 2. 不指定protocol，则address取值为`zookeeper://127.0.0.1:2181` | zookeeper        |
| address            | string              | ==必填== | 配置中心地址。 取值参见protocol说明                          |                  |
| highest-priority   | boolean             | 可选     | 来自配置中心的配置项具有最高优先级，即会覆盖本地配置项。     | true             |
| namespace          | string              | 可选     | 通常用于多租户隔离，实际含义视具体配置中心而不同。 如： zookeeper - 环境隔离，默认值`dubbo`； apollo - 区分不同领域的配置集合，默认使用`dubbo`和`application` | dubbo            |
| cluster            | string              | 可选     | 含义视所选定的配置中心而不同。 如Apollo中用来区分不同的配置集群 |                  |
| group              | string              | 可选     | 含义视所选定的配置中心而不同。 nacos - 隔离不同配置集 zookeeper - 隔离不同配置集 | dubbo            |
| check              | boolean             | 可选     | 当配置中心连接失败时，是否终止应用启动。                     | true             |
| config-file        | string              | 可选     | 全局级配置文件所映射到的key zookeeper - 默认路径/dubbo/config/dubbo/dubbo.properties apollo - dubbo namespace中的dubbo.properties键 | dubbo.properties |
| timeout            | integer             |          | 获取配置的超时时间                                           | 3000ms           |
| username           | string              |          | 如果配置中心需要做校验，用户名 Apollo暂未启用                |                  |
| password           | string              |          | 如果配置中心需要做校验，密码 Apollo暂未启用                  |                  |
| parameters         | Map<string, string> |          | 扩展参数，用来支持不同配置中心的定制化配置参数               |                  |
| include-spring-env | boolean             | 可选     | 使用Spring框架时支持，为true时，会自动从Spring Environment中读取配置。 默认依次读取 key为dubbo.properties的配置 key为dubbo.properties的PropertySource | false            |

### dubbo:provider

服务提供者缺省值配置。

对应的配置类： ==org.apache.dubbo.config.ProviderConfig==。

同时该标签为 `<dubbo:service>` 和 `<dubbo:protocol>` 标签的缺省值设置。

| 属性            | 类型           | 是否必填 | 描述                                                         | 默认值                                                       |
| --------------- | -------------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| id              | string         | 可选     | 协议BeanId，可以在<dubbo:service proivder="">中引用此ID      | dubbo                                                        |
| protocol        | string         | 可选     | 协议名称                                                     | dubbo                                                        |
| host            | string         | 可选     | 服务主机名，多网卡选择或指定VIP及域名时使用，为空则自动查找本机IP，建议不要配置，让Dubbo自动获取本机IP | 自动查找本机IP                                               |
| threads         | int            | 可选     | 服务线程池大小(固定大小)                                     | 200                                                          |
| payload         | int            | 可选     | 请求及响应数据包大小限制，单位：字节                         | 8388608(=8M)                                                 |
| path            | string         | 可选     | 提供者上下文路径，为服务path的前缀                           |                                                              |
| server          | string         | 可选     | 协议的服务器端实现类型，比如：dubbo协议的mina,netty等，http协议的jetty,servlet等 | dubbo协议缺省为netty，http协议缺省为servlet                  |
| client          | string         | 可选     | 协议的客户端实现类型，比如：dubbo协议的mina,netty等          | dubbo协议缺省为netty                                         |
| codec           | string         | 可选     | 协议编码方式                                                 | dubbo                                                        |
| serialization   | string         | 可选     | 协议序列化方式，当协议支持多种序列化方式时使用，比如：dubbo协议的dubbo,hessian2,java,compactedjava，以及http协议的json,xml等 | dubbo协议缺省为hessian2，rmi协议缺省为java，http协议缺省为json |
| default         | boolean        | 可选     | 是否为缺省协议，用于多协议                                   | false                                                        |
| filter          | string         | 可选     | 服务提供方远程调用过程拦截器名称，多个名称用逗号分隔         |                                                              |
| listener        | string         | 可选     | 服务提供方导出服务监听器名称，多个名称用逗号分隔             |                                                              |
| threadpool      | string         | 可选     | 线程池类型，可选：fixed/cached/limit(2.5.3以上)/eager(2.6.x以上) | fixed                                                        |
| accepts         | int            | 可选     | 服务提供者最大可接受连接数                                   | 0                                                            |
| version         | string         | 可选     | 服务版本，建议使用两位数字版本，如：1.0，通常在接口不兼容时版本号才需要升级 | 0.0.0                                                        |
| group           | string         | 可选     | 服务分组，当一个接口有多个实现，可以用分组区分               |                                                              |
| delay           | int            | 可选     | 延迟注册服务时间(毫秒)- ，设为-1时，表示延迟到Spring容器初始化完成时暴露服务 | 0                                                            |
| timeout         | int            | 可选     | 远程服务调用超时时间(毫秒)                                   | 1000                                                         |
| retries         | int            | 可选     | 远程服务调用重试次数，不包括第一次调用，不需要重试请设为0    | 2                                                            |
| connections     | int            | 可选     | 对每个提供者的最大连接数，rmi、http、hessian等短连接协议表示限制连接数，dubbo等长连接协表示建立的长连接个数 | 0                                                            |
| loadbalance     | string         | 可选     | 负载均衡策略，可选值：random,roundrobin,leastactive，分别表示：随机，轮询，最少活跃调用 | random                                                       |
| async           | boolean        | 可选     | 是否缺省异步执行，不可靠异步，只是忽略返回值，不阻塞执行线程 | false                                                        |
| stub            | boolean        | 可选     | 设为true，表示使用缺省代理类名，即：接口名 + Local后缀。     | false                                                        |
| mock            | boolean        | 可选     | 设为true，表示使用缺省Mock类名，即：接口名 + Mock后缀。      | false                                                        |
| token           | boolean        | 可选     | 令牌验证，为空表示不开启，如果为true，表示随机生成动态令牌   | false                                                        |
| registry        | string         | 可选     | 向指定注册中心注册，在多个注册中心时使用，值为<dubbo:registry>的id属性，多个注册中心ID用逗号分隔，如果不想将该服务注册到任何registry，可将值设为N/A | 缺省向所有registry注册                                       |
| dynamic         | boolean        | 可选     | 服务是否动态注册，如果设为false，注册后将显示后disable状态，需人工启用，并且服务提供者停止时，也不会自动取消册，需人工禁用。 | true                                                         |
| accesslog       | string/boolean | 可选     | 设为true，将向logger中输出访问日志，也可填写访问日志文件路径，直接把访问日志输出到指定文件 | false                                                        |
| owner           | string         | 可选     | 服务负责人，用于服务治理，请填写负责人公司邮箱前缀           |                                                              |
| document        | string         | 可选     | 服务文档URL                                                  |                                                              |
| weight          | int            | 可选     | 服务权重                                                     |                                                              |
| executes        | int            | 可选     | 服务提供者每服务每方法最大可并行执行请求数                   | 0                                                            |
| actives         | int            | 可选     | 每服务消费者每服务每方法最大并发调用数                       | 0                                                            |
| proxy           | string         | 可选     | 生成动态代理方式，可选：jdk/javassist                        | javassist                                                    |
| cluster         | string         | 可选     | 集群方式，可选：failover/failfast/failsafe/failback/forking  | failover                                                     |
| deprecated      | boolean        | 可选     | 服务是否过时，如果设为true，消费方引用时将打印服务过时警告error日志 | false                                                        |
| queues          | int            | 可选     | 线程池队列大小，当线程池满时，排队等待执行的队列大小，建议不要设置，当线程池满时应立即失败，重试其它服务提供机器，而不是排队，除非有特殊需求。 | 0                                                            |
| charset         | string         | 可选     | 序列化编码                                                   | UTF-8                                                        |
| buffer          | int            | 可选     | 网络读写缓冲区大小                                           | 8192                                                         |
| iothreads       | int            | 可选     | IO线程池，接收网络读写中断，以及序列化和反序列化，不处理业务，业务线程池参见threads配置，此线程池和CPU相关，不建议配置。 | CPU + 1                                                      |
| telnet          | string         | 可选     | 所支持的telnet命令，多个命令用逗号分隔                       |                                                              |
| <dubbo:service> | String         | 可选     |                                                              | 缺省为空串                                                   |
| layer           | string         | 可选     | 服务提供者所在的分层。如：biz、dao、intl:web、china:acton。  |                                                              |

### dubbo:consumer

服务消费者缺省值配置。

配置类： ==org.apache.dubbo.config.ConsumerConfig==

同时该标签为 `<dubbo:reference>` 标签的缺省值设置。

| 属性        | 类型           | 是否必填 | 描述                                                         | 默认值                 |
| ----------- | -------------- | -------- | ------------------------------------------------------------ | ---------------------- |
| timeout     | int            | 可选     | 远程服务调用超时时间(毫秒)                                   | 1000                   |
| retries     | int            | 可选     | 远程服务调用重试次数，不包括第一次调用，不需要重试请设为0,仅在cluster为failback/failover时有效 | 2                      |
| loadbalance | string         | 可选     | 负载均衡策略，可选值：random,roundrobin,leastactive，分别表示：随机，轮询，最少活跃调用 | random                 |
| async       | boolean        | 可选     | 是否缺省异步执行，不可靠异步，只是忽略返回值，不阻塞执行线程 | false                  |
| connections | int            | 可选     | 每个服务对每个提供者的最大连接数，rmi、http、hessian等短连接协议支持此配置，dubbo协议长连接不支持此配置 | 100                    |
| generic     | boolean        | 可选     | 是否缺省泛化接口，如果为泛化接口，将返回GenericService       | false                  |
| check       | boolean        | 可选     | 启动时检查提供者是否存在，true报错，false忽略                | true                   |
| proxy       | string         | 可选     | 生成动态代理方式，可选：jdk/javassist                        | javassist              |
| owner       | string         | 可选     | 调用服务负责人，用于服务治理，请填写负责人公司邮箱前缀       |                        |
| actives     | int            | 可选     | 每服务消费者每服务每方法最大并发调用数                       | 0                      |
| cluster     | string         | 可选     | 集群方式，可选：failover/failfast/failsafe/failback/forking  | failover               |
| filter      | string         | 可选     | 服务消费方远程调用过程拦截器名称，多个名称用逗号分隔         |                        |
| listener    | string         | 可选     | 服务消费方引用服务监听器名称，多个名称用逗号分隔             |                        |
| registry    | string         | 可选     | 向指定注册中心注册，在多个注册中心时使用，值为<dubbo:registry>的id属性，多个注册中心ID用逗号分隔，如果不想将该服务注册到任何registry，可将值设为N/A | 缺省向所有registry注册 |
| layer       | string         | 可选     | 服务调用者所在的分层。如：biz、dao、intl:web、china:acton。  |                        |
| init        | boolean        | 可选     | 是否在afterPropertiesSet()时饥饿初始化引用，否则等到有人注入或引用该实例时再初始化。 | false                  |
| cache       | string/boolean | 可选     | 以调用参数为key，缓存返回结果，可选：lru, threadlocal, jcache等 |                        |
| validation  | boolean        | 可选     | 是否启用JSR303标准注解验证，如果启用，将对方法参数上的注解进行校验 |                        |

### dubbo:module

模块信息配置。

对应的配置类 ==org.apache.dubbo.config.ModuleConfig==

| 属性         | 类型   | 是否必填 | 描述                                                         |
| ------------ | ------ | -------- | ------------------------------------------------------------ |
| name         | string | ==必填== | 当前模块名称，用于注册中心计算模块间依赖关系                 |
| version      | string | 可选     | 当前模块的版本                                               |
| owner        | string | 可选     | 模块负责人，用于服务治理，请填写负责人公司邮箱前缀           |
| organization | string | 可选     | 组织名称(BU或部门)，用于注册中心区分服务来源，此配置项建议不要使用autoconfig，直接写死在配置中，比如china,intl,itu,crm,asc,dw,aliexpress等 |

### dubbo:method

方法级配置。

对应的配置类： ==org.apache.dubbo.config.MethodConfig==。

同时该标签为 `<dubbo:service>` 或 `<dubbo:reference>` 的子标签，用于控制到方法级。

| 属性        | 类型           | 是否必填 | 描述                                                         | 默认值                           |
| ----------- | -------------- | -------- | ------------------------------------------------------------ | -------------------------------- |
| name        | string         | ==必填== | 方法名                                                       |                                  |
| timeout     | int            | 可选     | 方法调用超时时间(毫秒)                                       | 缺省为的timeout                  |
| retries     | int            | 可选     | 远程服务调用重试次数，不包括第一次调用，不需要重试请设为0    | 缺省为<dubbo:reference>的retries |
| loadbalance | string         | 可选     | 负载均衡策略，可选值：random,roundrobin,leastactive，分别表示：随机，轮询，最少活跃调用 | 缺省为的loadbalance              |
| async       | boolean        | 可选     | 是否异步执行，不可靠异步，只是忽略返回值，不阻塞执行线程     | 缺省为<dubbo:reference>的async   |
| sent        | boolean        | 可选     | 异步调用时，标记sent=true时，表示网络已发出数据              | true                             |
| actives     | int            | 可选     | 每服务消费者最大并发调用限制                                 | 0                                |
| executes    | int            | 可选     | 每服务每方法最大使用线程数限制- -，此属性只在<dubbo:method>作为<dubbo:service>子标签时有效 | 0                                |
| deprecated  | boolean        | 可选     | 服务方法是否过时，此属性只在<dubbo:method>作为<dubbo:service>子标签时有效 | false                            |
| sticky      | boolean        | 可选     | 设置true 该接口上的所有方法使用同一个provider.如果需要更复杂的规则，请使用路由 | false                            |
| return      | boolean        | 可选     | 方法调用是否需要返回值,async设置为true时才生效，如果设置为true，则返回future，或回调onreturn等方法，如果设置为false，则请求发送成功后直接返回Null | true                             |
| oninvoke    | String         | 可选     | 方法执行前拦截                                               |                                  |
| onreturn    | String         | 可选     | 方法执行返回后拦截                                           |                                  |
| onthrow     | String         | 可选     | 方法执行有异常拦截                                           |                                  |
| cache       | string/boolean | 可选     | 以调用参数为key，缓存返回结果，可选：lru, threadlocal, jcache等 |                                  |
| validation  | boolean        | 可选     | 是否启用JSR303标准注解验证，如果启用，将对方法参数上的注解进行校验 |                                  |

### dubbo:argument

方法参数配置。

对应的配置类： org.apache.dubbo.config.ArgumentConfig。

该标签为 `<dubbo:method>` 的子标签，用于方法参数的特征描述

| 属性     | 类型    | 是否必填      | 描述                                                         |
| -------- | ------- | ------------- | ------------------------------------------------------------ |
| index    | int     | ==必填==      | 参数索引                                                     |
| type     | String  | 与index二选一 | 通过参数类型查找参数的index                                  |
| callback | boolean | 可选          | 参数是否为callback接口，如果为callback，服务提供方将生成反向代理，可以从服务提供方反向调用消费方，通常用于事件推送. |

# 完善此前例子的配置

这里都使用Apache dubbo

### 服务提供者

```java
@Configuration
@EnableDubbo(scanBasePackages = "service.impl")
public class ProviderConfiguration {


    @Bean
    public ApplicationConfig applicationConfig(){
        ApplicationConfig applicationConfig = new ApplicationConfig();
        applicationConfig.setName("user-service-provider");
        applicationConfig.setVersion("1.0");
        applicationConfig.setOwner("PPG");
        applicationConfig.setOrganization("BBZL");
        applicationConfig.setEnvironment("test");
        return applicationConfig;
    }

    @Bean
    public RegistryConfig registryConfig(){
        RegistryConfig registryConfig = new RegistryConfig();
        registryConfig.setId("ppg");
        registryConfig.setAddress("localhost");
        registryConfig.setPort(2181);
        registryConfig.setProtocol("zookeeper");
        registryConfig.setTimeout(10000);
        registryConfig.setCheck(false);
        return registryConfig;
    }

    @Bean
    public ProtocolConfig protocolConfig(){
        ProtocolConfig protocolConfig = new ProtocolConfig();
        protocolConfig.setId("PPG");
        protocolConfig.setName("dubbo");
        protocolConfig.setPort(20880);
        protocolConfig.setHost("localhost");
        return protocolConfig;
    }
}
```

```java
@DubboService(delay = -1,loadbalance = "roundrobin",registry = "ppg",protocol = "PPG",version = "1.0",weight = 2)
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

### 服务消费者

```java
@Configuration
@EnableDubbo(scanBasePackages = "service")
@ComponentScan(basePackages = "service")
public class ConsumerConfiguration {

    @Bean
    public ApplicationConfig applicationConfig(){
        ApplicationConfig applicationConfig = new ApplicationConfig();
        applicationConfig.setName("user-service-consumer");
        applicationConfig.setVersion("1.0");
        applicationConfig.setOwner("PPG");
        applicationConfig.setOrganization("BBZL");
        applicationConfig.setEnvironment("test");
        return applicationConfig;
    }

    @Bean
    public RegistryConfig registryConfig(){
        RegistryConfig registryConfig = new RegistryConfig();
        registryConfig.setId("ppg007");
        registryConfig.setAddress("localhost");
        registryConfig.setPort(2181);
        registryConfig.setProtocol("zookeeper");
        registryConfig.setTimeout(10000);
        registryConfig.setCheck(false);
        return registryConfig;
    }
}
```

```java
@Service
public class UserServiceConsumerImpl implements IUserServiceConsumer{


    private IUserService userService;

    @DubboReference(version = "1.0",timeout = 1000,retries = 5,loadbalance = "roundrobin",check = false)
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

# 整合SpringBoot

### 导入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
    <artifactId>UserService-API</artifactId>
    <groupId>org.example</groupId>
    <version>1.0-SNAPSHOT</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org.junit.vintage</groupId>
            <artifactId>junit-vintage-engine</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-spring-boot-starter</artifactId>
    <version>2.7.8</version>
</dependency>
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-dependencies-zookeeper</artifactId>
    <version>2.7.8</version>
    <type>pom</type>
</dependency>
```

### 服务提供者

编写配置文件

```yaml
spring:
  application:
    name: UserService-Provider-SpringBoot
dubbo:
  application:
    name: user-service-provider-spring-boot
    version: 1.0
    owner: PPG
    organization: BBZL
    environment: test
  registry:
    address: 127.0.0.1
    protocol: zookeeper
    id: ppg
    port: 2181
    check: false
    timeout: 10000
  protocol:
    name: dubbo
    port: 8848
    id: PPG
    host: localhost
  monitor:
    protocol: registry
```

编写接口实现类

```java
@Service
@DubboService(delay = -1,loadbalance = "roundrobin",registry = "ppg",protocol = "PPG",version = "1.0",weight = 2)
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

主启动类上添加`@EnableDubbo`

### 服务消费者

编写配置文件

```yaml
spring:
    application:
        name: UserService-Consumer-SpringBoot
server:
  port: 9999

dubbo:
  application:
    name: user-service-consumer-spring-boot
    version: 1.0
    owner: PPG
    organization: BBZL
    environment: test
  registry:
    address: 127.0.0.1
    port: 2181
    protocol: zookeeper
    id: ppg007
    timeout: 10000
    check: false
  monitor:
    protocol: registry
```

编写消费者接口实现类

```java
@Service
public class UserServiceConsumer implements IUserServiceConsumer {

    private IUserService userService;

    @DubboReference(version = "1.0",timeout = 1000,retries = 5,loadbalance = "roundrobin",check = false)
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public void demo() {

    }

    public String getUserDetail() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Calendar instance = Calendar.getInstance();
        instance.set(Calendar.YEAR,2000);
        User user = new User();
        user.setId(1)
                .setUsername("ppg")
                .setPassword("123")
                .setBirthday(instance.getTime());
        Integer age = userService.getAge(user);
        HashMap<String, Object> hashMap = new HashMap<>(2);
        hashMap.put("user",user);
        hashMap.put("age",age);
        return objectMapper.writeValueAsString(hashMap);
    }

}
```

编写controller

```java
@RestController
public class UserController {

    private UserServiceConsumer userServiceConsumer;

    @Autowired
    public void setUserServiceConsumer(UserServiceConsumer userServiceConsumer) {
        this.userServiceConsumer = userServiceConsumer;
    }

    @RequestMapping("/userDetail")
    public String userDetail() throws JsonProcessingException {
        return userServiceConsumer.getUserDetail();
    }
}
```

主启动类上添加`@EnableDubbo`

# Dubbo配置规则

### 配置覆盖优先级

从Dubbo支持的配置来源说起，默认有6种配置来源：

- JVM System Properties，JVM -D 参数
- System environment，JVM进程的环境变量
- Externalized Configuration，外部化配置，从配置中心读取
- Application Configuration，应用的属性配置，从Spring应用的Environment中提取"dubbo"打头的属性集
- API / XML /注解等编程接口采集的配置可以被理解成配置来源的一种，是直接面向用户编程的配置采集方式
- 从classpath读取配置文件 dubbo.properties

xml>properties

![覆盖关系](/Dubbo/configuration.jpg)

从虚拟机参数到本地文件优先级依次降低

### 配置原则

1. 作服务的提供者，比服务使用方更清楚服务性能参数，如调用的超时时间，合理的重试次数，等等
2. 在Provider配置后，Consumer不配置则会使用Provider的配置值，即Provider配置可以作为Consumer的缺省值。否则，Consumer会使用Consumer端的全局设置，这对于Provider不可控的，并且往往是不合理的

### 不同粒度配置的覆盖关系

![dubbo-config-override](/Dubbo/dubbo-config-override.jpg)

1. 方法级优先，接口级次之，全局配置再次之。
2. 如果级别一样，则消费方优先，提供方次之。

### 配置加载流程

![配置加载流程](/Dubbo/config-load.svg)

# Dubbo高可用

### 注册中心宕机

zookeeper注册中心宕机，还可以消费dubbo暴露的服务。

健壮性：

- 监控中心宕掉不影响使用，只是丢失部分采样数据
- 数据库宕掉后，注册中心仍能通过缓存提供服务列表查询，但不能注册新服务
- 注册中心对等集群，任意一台宕掉后，将自动切换到另一台
- 注册中心全部宕掉后，服务提供者和服务消费者仍能通过本地缓存通讯
- 服务提供者无状态，任意一台宕掉后，不影响使用
- 服务提供者全部宕掉后，服务消费者应用将无法使用，并无限次重连等待服务提供者恢复

dubbo直连：

指定reference的url属性为服务提供者的注册url即可绕过注册中心直接调用

### 负载均衡

默认均衡策略为随机请求

##### Random LoadBalance 基于权重的随机负载均衡机制

![在这里插入图片描述](/Dubbo/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

随机，按权重设置随机概率。 在一个截面上碰撞的概率高，但调用量越大分布越均匀，而且按概率使用权重后也比较均匀，有利于动态调整提供者权重。

##### RoundRobin LoadBalance 基于权重的轮询负载均衡机制

![在这里插入图片描述](/Dubbo/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

轮循，按公约后的权重设置轮循比率。 存在慢的提供者累积请求的问题，比如：第二台机器很慢，但没挂，当请求调到第二台时就卡在那，久而久之，所有请求都卡在调到第二台上。

##### LeastActive LoadBalance最少活跃数负载均衡机制

![在这里插入图片描述](/Dubbo/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

##### ConsistentHash LoadBalance一致性hash 负载均衡机制

![在这里插入图片描述](/Dubbo/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTU3NTg4,size_16,color_FFFFFF,t_70.png)

一致性 Hash，相同参数的请求总是发到同一提供者。 当某一台提供者挂时，原本发往该提供者的请求，基于虚拟节点，平摊到其它提供者，不会引起剧烈变动。

### 服务降级

在dubbo-admin面板中为对应消费者选择相应操作

屏蔽：

所有请求返回为null

容错：

出错返回空对象

### 服务容错

##### 集群容错

- Failover Cluster
  失败自动切换，当出现失败，重试其它服务器。通常用于读操作，但重试会带来更长延迟。可通过 retries=“2” 来设置重试次数(不含第一次)。
- Failfast Cluster
  快速失败，只发起一次调用，失败立即报错。通常用于非幂等性的写操作，比如新增记录。
- Failsafe Cluster
  失败安全，出现异常时，直接忽略。通常用于写入审计日志等操作。
- Failback Cluster
  失败自动恢复，后台记录失败请求，定时重发。通常用于消息通知操作。
- Forking Cluster
  并行调用多个服务器，只要一个成功即返回。通常用于实时性要求较高的读操作，但需要浪费更多服务资源。可通过 forks=“2” 来设置最大并行数。
- Broadcast Cluster
  广播调用所有提供者，逐个调用，任意一台报错则报错 [2]。通常用于通知所有提供者更新缓存或日志等本地资源信息。

具体选择使用cluster属性传入即可



