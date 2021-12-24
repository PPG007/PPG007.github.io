# SpringCloud技术栈

![微服务技术栈](/SpringCloud/微服务技术栈.jpg)

# 基础环境搭建

### 项目基础结构搭建

创建一个Maven项目作为父项目，编辑pom文件

依赖管理：

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
    <lombok.version>1.18.20</lombok.version>
    <mysql.driver.version>8.0.26</mysql.driver.version>
    <druid.version>1.2.6</druid.version>
    <mybatisplus.version>3.4.3.4</mybatisplus.version>
</properties>

<dependencyManagement>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.4.2</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-dependencies -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2020.0.1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2021.1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.driver.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatisplus.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <fork>true</fork>
                <addResources>true</addResources>
            </configuration>

        </plugin>
    </plugins>
</build>
```
指定打包方式：
 ```xml
<packaging>pom</packaging>
 ```
- 三种打包方式的不同：
1. pom:
> 打出来的可以作为其他项目的maven依赖，在工程A中添加工程B的pom，A就可以使用B中的类。用在父级工程或聚合工程中。用来做jar包的版本控制。
2. jar
> 通常是开发时要引用通用类，打成jar包便于存放管理。当你使用某些功能时就需要这些jar包的支持，需要导入jar包。
3. war
> 是做好一个web网站后，打成war包部署到服务器。目的是节省资源，提供效率。
### 环境搭建-通用模块

创建一个子模块，修改pom文件

```xml
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
    </dependency>
</dependencies>
```

指定打包方式为pom

```xml
<packaging>pom</packaging>
```

编写通用实体类

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
@TableName(value = "payment",keepGlobalPrefix = true)
public class Payment implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;
    @TableField
    private String serial;
}
```

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class CommonResult<T> {

    private Integer code;

    private String message;

    private T data;
}
```

先执行maven clean，再执行maven install

### 环境搭建-支付模块

引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>top.ppg</groupId>
        <artifactId>api-commons</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

编写SpringBoot配置文件

```yaml
server:
  port: 8001
spring:
  application:
    name: payment-service-8001
  datasource:
    url: jdbc:mysql://192.168.3.14:3306?serverTimezone=UTC
    username: root
    password: 123456zch@ZCH
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
mybatis-plus:
  global-config:
    db-config:
      table-prefix: spring_cloud.
```

编写Dao接口

```java
@Mapper
@Repository
public interface PaymentMapper extends BaseMapper<Payment> {
}
```

编写服务层接口

```java
public interface IPaymentService extends IService<Payment> {

    /**
     * 创建支付记录
     * @param payment 支付对象
     * @return 是否创建成功
     */
    boolean createPayment(Payment payment);

    /**
     * 通过id查询支付记录
     * @param id 支付记录id
     * @return 支付对象
     */
    Payment getPaymentById(int id);

    /**
     * 获取所有支付记录
     * @return 支付记录列表
     */
    List<Payment> getPayments();

}
```

编写服务层接口实现类

```java
@Service
public class PaymentServiceImpl extends ServiceImpl<PaymentMapper, Payment> implements IPaymentService {
    @Override
    public boolean createPayment(Payment payment) {
        return this.save(payment);
    }

    @Override
    public Payment getPaymentById(int id) {
        QueryWrapper<Payment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id",id);
        return this.getOne(queryWrapper);
    }

    @Override
    public List<Payment> getPayments() {
        return this.list();
    }
}
```

编写controller

```java
@RestController
@Slf4j
@RequestMapping("/payment")
public class PaymentController {

    private IPaymentService paymentService;

    @Autowired
    public void setPaymentService(IPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/createPayment")
    public CommonResult<String> createPayment(@RequestBody Payment payment){
        log.info("准备创建支付记录");
        log.info("要创建的支付记录信息为："+payment);
        boolean res = paymentService.createPayment(payment);
        log.info("创建结果为："+res);
        return res?
                new CommonResult<>(200, "创建支付记录成功", null)
                : new CommonResult<>(200, "创建支付记录失败", null);
    }

    @GetMapping("/getPaymentById")
    public CommonResult<Payment> getPaymentById(int id){
        log.info("准备根据ID查询支付记录");
        log.info("要查询的支付记录的ID为："+id);
        Payment res = paymentService.getPaymentById(id);
        log.info("查询结果为："+res);
        return res==null?
                new CommonResult<>(200,"未查询到结果", null)
                :new CommonResult<>(200,"查询成功",res);
    }

    @GetMapping("/getPayments")
    public CommonResult<List<Payment>> getPayments(){
        log.info("准备查询所有支付记录");
        List<Payment> payments = paymentService.getPayments();
        log.info("查询结果为："+payments);
        return new CommonResult<>(200,"查询成功",payments);
    }
}
```

编写启动类

```java
@SpringBootApplication
public class PaymentStarter {
    public static void main(String[] args) {
        SpringApplication.run(PaymentStarter.class,args);
    }
}
```



### 环境搭建-订单模块

编写pom文件

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
    </dependency>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>top.ppg</groupId>
        <artifactId>api-commons</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

编写SpringBoot配置文件

```yaml
server:
  port: 80
spring:
  application:
    name: order-service-80
  datasource:
    url: jdbc:mysql://192.168.3.14:3306?serverTimezone=UTC
    username: root
    password: 123456zch@ZCH
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
```

编写启动类

```java
@SpringBootApplication
public class OrderStarter {
    public static void main(String[] args) {
        SpringApplication.run(OrderStarter.class,args);
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

编写controller

```java
@RestController
@Slf4j
@RequestMapping("/order")
public class OrderController {

    private RestTemplate restTemplate;

    private static final String BASE_URL="http://127.0.0.1:8001";

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/createPayment")
    public CommonResult createPayment(Payment payment){
        return restTemplate.postForObject(BASE_URL + "/payment/createPayment", payment, CommonResult.class);
    }

    @GetMapping("/getPayments")
    public CommonResult getPayments(){
        return restTemplate.getForObject(BASE_URL + "/payment/getPayments", CommonResult.class);
    }

    @GetMapping("/getPaymentById")
    public CommonResult getPaymentById(int id){
        HashMap<String, Integer> map = new HashMap<>(3);
        map.put("id",id);
        return restTemplate.getForObject(BASE_URL + "/payment/getPaymentById?id={id}", CommonResult.class,map);
    }

}
```

### 关于RestTemplate

> RestTemplate 是从 Spring3.0 开始支持的一个 HTTP 请求工具，它提供了常见的REST请求方案的模版，例如 GET 请求、POST 请求、PUT 请求、DELETE 请求以及一些通用的请求执行方法 exchange 以及 execute。
- GET请求
1. getForEntity方法
此方法获取响应头、状态码、内容等在内的完整信息,第一个参数为URL，第二个参数为返回结果类型，第三个参数以map存储请求参数
```java
ResponseEntity<String> forEntity = restTemplate.getForEntity(URL, String.class,stringStringHashMap);
String body = forEntity.getBody();
HttpStatus statusCode = forEntity.getStatusCode();
HttpHeaders headers = forEntity.getHeaders();
int statusCodeValue = forEntity.getStatusCodeValue();
System.out.println("body==>"+body);
System.out.println("statusCode==>"+statusCode);
System.out.println("headers==>"+headers);
System.out.println("statusCodeValue==>"+statusCodeValue);
```
2. getForObject方法
此方法获取返回内容,第一个参数为URL，第二个参数为返回结果类型，第三个参数以map存储请求参数
```java
HashMap<String, String> stringStringHashMap = new HashMap<>();
stringStringHashMap.put("id","id2");
stringStringHashMap.put("name","name2");
String forObject = restTemplate.getForObject(URL, String.class, stringStringHashMap);
System.out.println(forObject);
```
==get请求要注意参数的拼接，需要占位符==

- POST请求
1. postForEntity和postForObject
第一个参数为URL，第二个参数为map或者对象实例，使用对象实例时，以JSON方式发送
```java
LinkedMultiValueMap<String, String> stringStringLinkedMultiValueMap = new LinkedMultiValueMap<>();
restTemplate.postForEntity(URL_POST, stringStringLinkedMultiValueMap, String.class);
```
若使用KV键值对传递请求参数，则必须使用**LinkedMultiValueMap**
2. postForLocation
postForLocation方法的返回值是一个Uri对象，返回跳转到的地址，可以先使用postForLocation获取URI再使用访问
> postForLocation 方法返回的 Uri 实际上是指响应头的 Location 字段，所以，provider 中 register 接口的响应头必须要有 Location 字段（即请求的接口实际上是一个重定向的接口），否则 postForLocation 方法的返回值为null
# Eureka

**[Eureka详细配置](https://www.cnblogs.com/april-chen/p/10617066.html)**

### Eureka Server

##### 依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
</dependencies>
```
##### 配置Eureka Server

```yml
server:
  port: 7001

eureka:
  instance:
    hostname: MailServer-RegisterCenter #服务注册中心实例的主机名
    ip-address: 1.15.147.218 #该实例的IP地址
    prefer-ip-address: true #该实例，相较于hostname是否优先使用IP
    non-secure-port: 7001 #http通信端口，https为secure-port
  client:
    register-with-eureka: false #实例是否在eureka服务器上注册自己的信息以供其他服务发现，默认为true
    fetch-registry: false #此客户端是否获取eureka服务器注册表上的注册信息，默认为true，false表示这是Eureka服务器
    service-url: #与Eureka注册服务中心的通信zone和url地址
      defaultZone: http://1.15.147.218:7001/eureka/
  server:
    #服务端开启自我保护模式。
    #无论什么情况，服务端都会保持一定数量的服务。
    #避免client与server的网络问题，而出现大量的服务被清除
    enable-self-preservation: false
```
##### 开启Eureka Server

在主启动类上添加@EnableEurekaServer注解
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaStart {
    public static void main(String[] args) {
        SpringApplication.run(EurekaStart.class,args);
    }
}
```
### Eureka Client配置

##### 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```
##### 配置Eureka Client

```yml
eureka:
  client:
    service-url:
      defaultZone: http://1.15.147.218:7001/eureka/
  instance:
    instance-id: CRUD-Provider
    ip-address: 1.15.147.218
    prefer-ip-address: true
    non-secure-port: 8001
info:
  app.name: CRUD服务提供者
```
#####  开启EurekaClient

在主启动类上添加@EnableEurekaClient注解

#####  Eureka注册中心集群配置

##### 配置Eureka Server集群

假设有三个Eureka注册中心192.168.1.2，192.168.1.3，192.168.1.4，只要在每一个的配置文件的service-url属性中添加另外两个的注册地址，以逗号分隔，==互相注册==

##### 配置Eureka Client注册到Eureka集群中

在配置文件中的service-url属性中添加所有的注册中心url即可，同样以逗号分隔

##### 配置Client集群

多个微服务保证`spring.application.name`和`eureka.instance.appname`分别对应相同即可，并注册到Eureka中

# Zookeeper

### 依赖引入

将上面的eureka依赖替换为zookeeper依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zookeeper-discovery</artifactId>
</dependency>
```

### Provider模块

##### 编写SpringBoot配置文件

```yaml
server:
  port: 8004
spring:
  application:
    name: payment-service
  datasource:
    url: jdbc:mysql://192.168.3.14:3306?serverTimezone=UTC
    username: root
    password: 123456zch@ZCH
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
  cloud:
    zookeeper:
      connect-string: 39.107.112.172:2181,115.28.211.227:2181,150.158.153.216:2181 # ZooKeeper集群
      discovery:
        instance-host: 192.168.3.55 # 本实例的IP地址
        instance-port: 8004 # 本实例的端口号
mybatis-plus:
  global-config:
    db-config:
      table-prefix: spring_cloud.
```

其他内容与Eureka相同，修改主启动类注解，使用`@EnableDiscoveryClient`替换Eureka注解

```java
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentStarter8004 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentStarter8004.class,args);
    }
}
```

### Consumer模块

##### 编写SpringBoot配置文件

```yaml
server:
  port: 80
spring:
  application:
    name: order-service-zk-80
  datasource:
    url: jdbc:mysql://192.168.3.14:3306?serverTimezone=UTC
    username: root
    password: 123456zch@ZCH
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
  cloud:
    zookeeper:
      connect-string: 39.107.112.172:2181,115.28.211.227:2181,150.158.153.216:2181
      discovery:
        instance-host: 192.168.3.14
        instance-port: 80
```

主启动类与Provider相同

##### 注入RestTemplate

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

##### 修改controller的url

```java
private static final String BASE_URL="http://payment-service";
```

修改为ZooKeeper中服务对应的节点名称，与`spring.application.name`相同

# Consul

### 安装Consul

```shell
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install consul
```

### 启动consul并允许外网访问

```shell
consul agent -dev   -client 0.0.0.0 -ui
```

### Provider注册到Consul

添加依赖，将Eureka依赖替换

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-consul-discovery</artifactId>
</dependency>
```

主启动类添加注解`@EnableDiscoveryClient`

编写SpringBoot配置文件

```yaml
server:
  port: 8003
spring:
  application:
    name: payment-service
  datasource:
    url: jdbc:mysql://192.168.3.14:3306?serverTimezone=UTC
    username: root
    password: 123456zch@ZCH
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
  cloud:
    consul:
      host: 192.168.3.14 # consul的IP
      port: 8500 # consul的端口
      discovery:
        hostname: 192.168.3.55 # 本服务的部署IP
        service-name: payment-service # 本服务的名字

mybatis-plus:
  global-config:
    db-config:
      table-prefix: spring_cloud.
```



### Consumer注册到Consul

依赖与Provider相同

主启动类添加注解`@EnableDiscoveryClient`

编写SpringBoot配置文件

```yaml
server:
  port: 80
spring:
  application:
    name: order-service-zk-80
  datasource:
    url: jdbc:mysql://192.168.3.14:3306?serverTimezone=UTC
    username: root
    password: 123456zch@ZCH
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
  cloud:
    consul:
      host: 192.168.3.14
      port: 8500
      discovery:
        hostname: 192.168.3.14
        service-name: order-service-consul-80
```

# Ribbon

### 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```
### 简单使用Ribbon

- 方式一：使用Ribbon配置RestTemplate
```java
@Configuration
public class Config {

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){

        return new RestTemplate();
    }
    // 负载均衡规则
    @Bean
    public IRule iRule(){
        return new RoundRobinRule();
    }
}
```
在要使用RestTemplate的地方直接注入调用即可
- 方式二：使用LoadBalancerClient 中的负载均衡策略获取一个可用的服务地址，然后再进行请求。
```java
@RestController
@RequestMapping("/api/v1/center")
public class MessageCenterController {
 
    @Autowired
    private LoadBalancerClient loadBalancer;

    @GetMapping("/msg/get")
    public Object getMsg() {
        ServiceInstance instance = loadBalancer.choose("message-service");
        URI url = URI.create(String.format("http://%s:%s/api/v1/msg/get", instance.getHost(), instance.getPort()));
        RestTemplate restTemplate = new RestTemplate();
        String msg = restTemplate.getForObject(url, String.class);
        return msg;
    }
}
```
可以通过yml来配置使用的策略：
```yml
message-service:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
<clientName>.ribbon.NFLoadBalancerClassName: 需实现 ILoadBalancer
<clientName>.ribbon.NFLoadBalancerRuleClassName: 需实现 IRule
<clientName>.ribbon.NFLoadBalancerPingClassName: 需实现 IPing
<clientName>.ribbon.NIWSServerListClassName: 需实现 ServerList
<clientName>.ribbon.NIWSServerListFilterClassName: 需实现 ServerListFilter
```
### 自定义策略

- 自定义的策略类必须继承AbstractLoadBalancerRule
```java
 public class RandomRule_ZY extends AbstractLoadBalancerRule
{
 // total = 0 // 当total==5以后，我们指针才能往下走，
 // index = 0 // 当前对外提供服务的服务器地址，
 // total需要重新置为零，但是已经达到过一个5次，我们的index = 1
 // 分析：我们5次，但是微服务只有8001 8002 8003 三台，OK？

 private int total = 0;    // 总共被调用的次数，目前要求每台被调用5次
 private int currentIndex = 0; // 当前提供服务的机器号

public Server choose(ILoadBalancer lb, Object key)
{
  if (lb == null) {
   return null;
  }
  Server server = null;
  while (server == null) {
   if (Thread.interrupted()) {
    return null;
   }

   List<Server> upList = lb.getReachableServers();
   List<Server> allList = lb.getAllServers();
   int serverCount = allList.size();
   if (serverCount == 0) {
    return null;
   }
 if(total < 5)
            {
             server = upList.get(currentIndex);
             total++;
            }else {
              total = 0;
             currentIndex++;
             if(currentIndex >= upList.size())
             {
               currentIndex = 0;
             }
            } 
 if (server == null) {
    Thread.yield();
    continue;
   }
 if (server.isAlive()) {
    return (server);
   }  
   server = null;
   Thread.yield();
   }
   return server;
   }
@Override
 public Server choose(Object key)
 {
  return choose(getLoadBalancer(), key);
 }

@Override
 public void initWithNiwsConfig(IClientConfig clientConfig)
 {
 }
 }             
```
- 编写对应配置类
```java
@Configuration
public class MySelfRules{
    @Bean
    public IRule myRule(){
        return new RandomRule_ZY();
    }
}
```
- 在主启动类上添加：
```java
@RibbonClient(name="服务名",configuration=MySelfRule.class)
```
**注意：MySelfRule配置类必须不能被Spring扫描到，否则所有的Ribbon客户端都会使用这个规则**

### 自定义Ribbon客户端

```java
import org.springframework.cloud.netflix.ribbon.RibbonClient;
import org.springframework.cloud.netflix.ribbon.ZonePreferenceServerListFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
 
import com.netflix.loadbalancer.IPing;
import com.netflix.loadbalancer.PingUrl;
import com.pengjunlee.TestConfiguration.MessageConfiguration;
 
@Configuration
@RibbonClient(name = "message-service", configuration = MessageConfiguration.class)
public class TestConfiguration {
 
	@Configuration
	protected static class MessageConfiguration {
		@Bean
		public ZonePreferenceServerListFilter serverListFilter() {
			ZonePreferenceServerListFilter filter = new ZonePreferenceServerListFilter();
			filter.setZone("myTestZone");
			return filter;
		}
 
		@Bean
		public IPing ribbonPing() {
			return new PingUrl();
		}
	}
}
```
**此类同样不能被Spring扫描**
- Ribbon的所有可选Bean：
![RibbonBean](/SpringCloud/RibbonBean.jpg)

# Feign

### 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
    <version>1.4.7.RELEASE</version>
</dependency>
```
### 使用Feign

一定要将服务注入Spring中

##### 编写服务接口

```java
@Component
@FeignClient(value = "SPRINGCLOUD-PROVIDER-DEPT")
public interface DeptService {

    @RequestMapping("/dept/queryAll")
    @ResponseBody
    List<Dept> queryAllDept();

    @PostMapping("/dept/add")
    @ResponseBody
    int addDept(String dName);

    @RequestMapping("/dept/queryById")
    @ResponseBody
    Dept queryDeptById(Long id);
}
```
##### 启动类开启Feign支持

```java
//确保被Spring扫描到即可
@EnableFeignClients(basePackages = "api")
```
### Feign原理简述

- 启动时，程序会进行包扫描，扫描所有包下所有@FeignClient注解的类，并将这些类注入到spring的IOC容器中。当定义的Feign中的接口被调用时，通过JDK的动态代理来生成RequestTemplate。
- RequestTemplate中包含请求的所有信息，如请求参数，请求URL等。
- RequestTemplate生成Request，然后将Request交给client处理，这个client默认是JDK的HTTPUrlConnection，也可以是OKhttp、Apache的HTTPClient等。
- 最后client封装成LoadBaLanceClient，结合ribbon负载均衡地发起调用。

### 开启GZIP压缩

```yml
feign:
  compression:
    request: #请求
      enabled: true #开启
      mime-types: text/xml,application/xml,application/json #开启支持压缩的MIME TYPE
      min-request-size: 2048 #配置压缩数据大小的下限
    response: #响应
      enabled: true #开启响应GZIP压缩
```
**由于开启GZIP压缩之后，Feign之间的调用数据通过二进制协议进行传输，返回值需要修改为ResponseEntity<byte[]>才可以正常显示，否则会导致服务之间的调用乱码**

### Feign开启OkHttp

```yml
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000
        loggerLevel: basic
  okhttp:
    enabled: true
  hystrix:
    enabled: true
```
# OpenFeign

### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

### 重构消费者

feign用法类似dubbo，但是是通过HTTP而非RPC实现调用，也是作用在服务接口上

客户端建立接口

```java
@FeignClient(value = "PAYMENT-SERVICE")
public interface IPaymentFeignService {

    /**
     * 通过ID查询支付记录
     * @param id 支付记录ID
     * @return 指定的支付记录
     */
    @GetMapping("/payment/getPaymentById")
    CommonResult<Payment> getPaymentById(@RequestParam("id") int id);

    /**
     * 获取所有支付记录
     * @return 所有的支付记录
     */
    @GetMapping("/payment/getPayments")
    CommonResult<List<Payment>> getPayments();

    /**
     * 创建支付记录
     * @param payment 支付记录信息
     * @return 结果
     */
    @PostMapping("/payment/createPayment")
    CommonResult<String> createPayment(Payment payment);
}
```

> 注意：
>
> - 接口上要添加`@FeignClient`注解，并通过value属性指定Eureka中的要调用的服务名
> - 方法上要添加相关URL绑定注解，指明服务提供方对应路径的请求方式
> - 如果方法中有参数且不使用`@PathVariable`和`@RequestParam`注解，则请求将会以POST方法发出，即使使用`@GetMapping`
> - 如果是GET请求方式需要携带参数，应当使用`@RequestParam`注解作键值映射，或者使用占位符和`@PathVariable`注解完成映射，但是第二种方法由于是拼接为RestFul风格URL，需要服务提供端Controller同样使用占位符及`@PathVariable`注解

### OpenFeign超时设置

由于早期版本OpenFeign集成了Ribbon，因此需要在配置文件中配置Ribbon的超时时间

新版本OpenFeign不再集成Ribbon，修改超时配置如下

```yaml
feign:
  client:
    config:
      default:
        readTimeOut: 1000
        connectTimeout: 1000
```

### OpenFeign增强日志

##### 日志级别

- NONE：默认的，不显示任何日志
- BASIC：仅记录请求方法、URL、响应状态码及执行时间
- HEADERS：除了BASIC中定义的信息之外，还有请求和响应的头信息
- FULL：除了HEADERS中定义的信息之外，还有请求和响应的正文及元数据

##### 配置日志Bean

```java
@Bean
public Logger.Level level(){
    return Logger.Level.FULL;
}
```

##### 编写配置文件指定要打印日志的接口

```yaml
logging:
  level:
    top.ppg.service.IPaymentFeignService: debug
```

日志形式可以是info、debug、error等



# Hystrix

由于hystrix已经进入维护状态，hystrix被移出了Spring Cloud Netflix，而Hystrix作为CircuitBreaker服务降级、熔断目前的唯一实现，所以`@EnableCircuitBreaker`过时了，但是在feign的fallback配置中，由原来的`feign.hystrix.enabled=true`变成了`feign.circuitbreaker=true`，相当于OpenFeign也去除了与Hystrix的关系

###  相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
</dependency>
```
### 使用Hystrix

##### 服务提供者或消费者开启服务降级

在需要服务降级的方法上使用`@HystrixCommand`注解并进行配置

```java
@HystrixCommand(fallbackMethod = "getPaymentsOk",commandProperties = {
        @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds",value = "1500")
})
public List<Payment> getPayments() {
    int a=10/0;
    return this.list();
}

public List<Payment> getPaymentsOk() {
    log.info("进入备用方法");
    return this.list();
}
```

`@HystrixProperty`的可选配置项有：

```java
@HystrixCommand(fallbackMethod = "xxx_method",
        groupKey = "strGroupCommand",
        commandKey = "strCommarld",
        threadPoolKey = "strThreadPool",
        commandProperties = {
                //设置隔离策略，THREAD 表示线程她SEMAPHORE:信号他隔离
                @HystrixProperty(name = "execution.isolation.strategy", value = "THREAD"),
                //当隔离策略选择信号他隔离的时候，用来设置信号地的大小(最大并发数)
                @HystrixProperty(name = "execution.isolation.semaphore.maxConcurrentRequests", value = "10"),
                //配置命令执行的超时时间
                @HystrixProperty(name = "execution.isolation.thread.timeoutinMilliseconds", value = "10"),
                //是否启用超时时间
                @HystrixProperty(name = "execution.timeout.enabled", value = "true"),
                //执行超时的时候是否中断
                @HystrixProperty(name = "execution.isolation.thread.interruptOnTimeout", value = "true"),
                //执行被取消的时候是否中断
                @HystrixProperty(name = "execution.isolation.thread.interruptOnCancel", value = "true"),
                //允许回调方法执行的最大并发数
                @HystrixProperty(name = "fallback.isolation.semaphore.maxConcurrentRequests", value = "10"),
                //服务降级是否启用，是否执行回调函数
                @HystrixProperty(name = "fallback.enabled", value = "true"),
                @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),
                //该属性用来设置在滚动时间窗中，断路器熔断的最小请求数。例如，默认该值为20的时候，
                //如果滚动时间窗(默认10秒)内仅收到了19个请求，即使这19个请求都失败了， 断路器也不会打开。
                @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "20"),
                // 该属性用来设置在熔动时间窗中表示在滚动时间窗中，在请求数量超过
                // circuitBreaker.requestVolumeThreshold 的情况下,如果错误请求数的百分比超过50,
                //就把断路器设置为“打开”状态，否则就设置为“关闭”状态。
                @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "50"),
                // 该属性用来设置当断路器打开之后的休眠时间窗。休眠时间窗结束之后,
                //会将断路器置为"半开”状态，尝试熔断的请求命令，如果低然失败就将断路器继续设置为"打开”状态，
                //如果成功就设置为"关闭”状态。
                @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "5009"),
                //断路器强制打开
                @HystrixProperty(name = "circuitBreaker.force0pen", value = "false"),
                // 断路器强制关闭
                @HystrixProperty(name = "circuitBreaker.forceClosed", value = "false"),
                //滚动时间窗设置，该时间用于断路器判断健康度时需要收集信息的持续时间
                @HystrixProperty(name = "metrics.rollingStats.timeinMilliseconds", value = "10000"),
                //该属性用来设置滚动时间窗统计指标信息时划分”桶"的数量，断路器在收集指标信息的时候会根据设置的时间窗长度拆分成多个"相"来累计各度量值，每个”桶"记录了-段时间内的采集指标。
                //比如10秒内拆分成10个”桶"收集这样，所以timeinMilliseconds 必须能被numBuckets 整除。否则会抛异常
                @HystrixProperty(name = "metrics.rollingStats.numBuckets", value = "10"),
                //该属性用来设置对命令执行的延迟是否使用百分位数来跟踪和计算。如果设置为false,那么所有的概要统计都将返回-1.
                @HystrixProperty(name = "metrics .rollingPercentile.enabled", value = "false"),
                //该属性用来设置百分位统计的滚动窗口的持续时间， 单位为毫秒。
                @HystrixProperty(name = "metrics.rollingPercentile.timeInMilliseconds", value = "60000"),
                //该属性用来设置百分位统计演动窗口中使用“桶”的数量。
                @HystrixProperty(name = "metrics.rollingPercentile.numBuckets", value = "60000"),
                // 该属性用来设置在执行过程中每个 “桶”中保留的最大执行次数。如果在滚动时间窗内发生超过该设定值的执行次数，就从最初的位置开始重写。例如，将该值设置为100,燎动窗口为10秒， 若在10秒内一 一个“桶 ” 中发生7500次执行，
                //那么该“桶”中只保留最后的100次执行的统计。另外,增加该值的大小将会增加内存量的消耗， 并增加排序百分位数所需的计算
                @HystrixProperty(name = "metrics.rollingPercentile.bucketSize", value = "100"),
                //该属性用来设置采集影响断路器状态的健康快照(请求的成功、错误百分比) 的间隔等待时间。
                @HystrixProperty(name = "metrics.healthSnapshot.intervalinMilliseconds", value = "500"),
                //是否开启请求缓存
                @HystrixProperty(name = "requestCache.enabled", value = "true"),
                // HystrixCommand的执行和时间是否打印日志到HystrixRequestLog中
                @HystrixProperty(name = "requestLog.enabled", value = "true"),
        },
        threadPoolProperties = {
                //该参数用来设置执行命令线程他的核心线程数，该值 也就是命令执行的最大并发量
                @HystrixProperty(name = "coreSize", value = "10"),
                //该参数用来设置线程她的最大队列大小。当设置为-1时，线程池将使用SynchronousQueue 实现的队列，
                // 否则将使用LinkedBlocakingQueue实现队列
                @HystrixProperty(name = "maxQueueSize", value = "-1"),
                // 该参数用来为队列设置拒绝阀值。 通过该参数， 即使队列没有达到最大值也能拒绝请求。
                //該参数主要是対linkedBlockingQueue 队列的朴充,因为linkedBlockingQueue
                //队列不能动态修改它的对象大小，而通过该属性就可以调整拒绝请求的队列大小了。
                @HystrixProperty(name = "queueSizeRejectionThreshold", value = "5"),
        }
)

```

或者参考`HystrixCommandProperties`类

主启动类上添加`@EnableHystrix`注解，此注解集成了`@EnableCircuitBreaker`注解（新版）

##### 使用DefaultFallback

在要开启服务熔断的类上使用`@DefaultProperties`注解并配置`defaultFallback`属性指定默认备用方法

```java
@Service
@Slf4j
@DefaultProperties(defaultFallback = "defaultMethod")
public class PaymentServiceImpl extends ServiceImpl<PaymentMapper, Payment> implements IPaymentService {
    @Override
    public boolean createPayment(Payment payment) {
        return this.save(payment);
    }

    @Override
    @HystrixCommand
    public Payment getPaymentById(int id) throws Exception {
        QueryWrapper<Payment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id",id);
        Payment one = this.getOne(queryWrapper);
        if (one==null){
            throw new Exception("null");
        }
        return one;
    }

    @Override
    @HystrixCommand(fallbackMethod = "getPaymentsOk",commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds",value = "1500")
    })
    public List<Payment> getPayments() {
        int a=10/0;
        return this.list();
    }

    public List<Payment> getPaymentsOk() {
        log.info("进入备用方法");
        return this.list();
    }

    public Payment defaultMethod(){
        log.info("进入默认熔断方法");
        return new Payment(1, "熔断");
    }
}
```

**注意：需要开启熔断的方法还要使用`@HystrixCommand`，且==返回值必须是原方法的返回类型或其子类==**



##### 基于Feign的降级

```java
@FeignClient(name = "microservice-provider-user", fallback = HystrixClientFallback.class)
public interface UserFeignClient {
  @RequestMapping(value = "/simple/{id}", method = RequestMethod.GET)
  public User findById(@PathVariable("id") Long id);
}
```
```java
@Component
public class HystrixClientFallback implements UserFeignClient {

  @Override
  public User findById(Long id) {
    User user = new User();
    user.setId(0L);
    return user;
  }
}
```
修改配置文件：

```yaml
feign:
  circuitbreaker: # 老版本这里是hystrix
    enabled: true
```

##### 使用FallbackFactory降级

```java
@FeignClient(name = "microservice-provider-user", fallbackFactory = HystrixClientFactory.class)
public interface UserFeignClient {
  @RequestMapping(value = "/simple/{id}", method = RequestMethod.GET)
  public User findById(@PathVariable("id") Long id);
}
```
```java
@Component
public class HystrixClientFactory implements FallbackFactory<UserFeignClient> {

  private static final Logger LOGGER = LoggerFactory.getLogger(HystrixClientFactory.class);

  @Override
  public UserFeignClient create(Throwable cause) {
    HystrixClientFactory.LOGGER.info("fallback; reason was: {}", cause.getMessage());
    return new UserFeignClientWithFactory() {
      @Override
      public User findById(Long id) {
        User user = new User();
        user.setId(-1L);
        return user;
      }
    };
  }
}
```
```java
public interface UserFeignClientWithFactory extends UserFeignClient {

}
```
##### 配置服务熔断

修改业务类代码

```java
@HystrixCommand(fallbackMethod = "breakFallbackMethod",commandProperties = {
        @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),// 开启服务熔断
        @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"),// 一个窗口期中，达到熔断的最小请求次数
        @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "50"),// 失败的百分比
        @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "20000")// 窗口期事件
})
public String breakTest(int a) throws Exception {
    if (a%2==0){
        throw new Exception("熔断异常");
    }
    return "请求成功，随机号："+ UUID.randomUUID()+",id:"+a;
}

public String breakFallbackMethod(int a){
    return "寄了，id："+a;
}
```

##### 查看Hystrix信息及状态

**[IPAddress]:[Port]/actuator/hystrix.stream**
**[IPAddress]:[Port]/actuator/health**

### HystrixDashBoard

##### 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
</dependency>
```

##### 修改配置文件

监控面板配置：

```yml
server:
  port: 9001
hystrix:
  dashboard:
    proxy-stream-allow-list: "127.0.0.1" # 将此IP加入允许监控的列表
```
被监控配置：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

##### 开启DashBoard

在启动类上添加：
```java
@EnableHystrixDashboard
```
##### 访问DashBoard

**[IPAddress]:[Port]/hystrix**
在其中填写要监控的Hystrix微服务
**[IPAddress]:[Port]/actuator/hystrix.stream**

# Gateway

### 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

### 编写配置文件

```yaml
server:
  port: 9527
spring:
  application:
    name: gateway
eureka:
  client:
    register-with-eureka: true
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
    fetch-registry: true
  instance:
    ip-address: 127.0.0.1 # 192.168.3.55
    prefer-ip-address: true
    non-secure-port: 8001
    appname: gateway
    instance-id: gateway-9527
info:
  app.name: gateway-9527
```

### 配置路由-配置文件配置

修改配置文件

```yaml
spring:
  application:
    name: gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
      routes:
        - id: payment_routh # 一个唯一id，最好与服务名一致
          uri: http://localhost:8001  # 路由目的地
          predicates: # 断言，都为真才能路由
            - Path=/payment/** # 只有这个请求路径才路由
```

### 配置路由-编码配置

```java
@Bean
public RouteLocator routes(RouteLocatorBuilder builder){
    RouteLocatorBuilder.Builder routes = builder.routes();
    return routes.route("payment_routh", predicateSpec -> predicateSpec.path("/payment/**").uri("http://localhost:8001")).build();
}
```

### 可选断言配置

##### After

限制只有某个时间之后的请求才能通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: https://example.org
        predicates:
        - After=2017-01-20T17:42:47.789-07:00[America/Denver]
```

对应的是Java8中的`ZonedDateTime`类

```java
System.out.println(ZonedDateTime.now());
```

##### Before

与After相对应，只有某个时间之前的请求才能通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: before_route
        uri: https://example.org
        predicates:
        - Before=2017-01-20T17:42:47.789-07:00[America/Denver]
```

##### Between

两个时间之间发生的请求才能通过，用逗号分隔

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: between_route
        uri: https://example.org
        predicates:
        - Between=2017-01-20T17:42:47.789-07:00[America/Denver], 2017-01-21T17:42:47.789-07:00[America/Denver]
```

##### Cookie

通过两个参数：名字和值的正则表达式进行匹配，如果cookie中携带了指定名字的键且值符合这个正则表达式才能通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: cookie_route
        uri: https://example.org
        predicates:
        - Cookie=chocolate, ch.p # 第一个参数是name，逗号后面是正则表达式
```

##### Header

与Cookie类似，只有请求头中存在对应字段且字段值满足正则表达式才通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: header_route
        uri: https://example.org
        predicates:
        - Header=X-Request-Id, \d+
```

##### Host

接受一个参数作为主机列表，如果请求头中含有host属性且值符合定义的主机列表则通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: host_route
        uri: https://example.org
        predicates:
        - Host=**.somehost.org,**.anotherhost.org
```

##### Method

限制请求方式

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: method_route
        uri: https://example.org
        predicates:
        - Method=GET,POST
```

##### Path

请求路径符合限制才通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: path_route
        uri: https://example.org
        predicates:
        - Path=/red/{segment},/blue/{segment}
```

##### Query

接收两个参数，一个是query参数名，一个是正则表达式，满足要求才通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: query_route
        uri: https://example.org
        predicates:
        - Query=red, gree.
```

##### RemoteAddr

匹配请求的远程地址，在一个子网下才通过

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: remoteaddr_route
        uri: https://example.org
        predicates:
        - RemoteAddr=192.168.1.1/24
```

##### Weight

接收两个参数，第一个参数是一个字符串，代表分组，第二个参数是比例

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: weight_high
        uri: https://weighthigh.org
        predicates:
        - Weight=group1, 8
      - id: weight_low
        uri: https://weightlow.org
        predicates:
        - Weight=group1, 2
```

80%的请求进入https://weighthigh.org，20%进入https://weightlow.org

### 结合注册中心实现负载均衡

配置文件：

```yaml
spring:
  application:
    name: gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
      routes:
        - id: payment_routh
          uri: lb://payment-service
          predicates:
            - Path=/payment/**
            - Method=POST,GET
```

Java Config

```java
@Bean
public RouteLocator routes(RouteLocatorBuilder builder){
    RouteLocatorBuilder.Builder routes = builder.routes();

    return routes.route("payment_routh", predicateSpec -> {
        predicateSpec.path("/payment/**");
        predicateSpec.alwaysTrue();
        return predicateSpec.uri("lb://payment-service");
    }).build();
}
```

### 过滤器Filter

自带过滤器参见：[Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/3.0.3/reference/html/#gatewayfilter-factories)

### 自定义过滤器

创建一个类，实现`GlobalFilter, Ordered`这两个接口，然后注入到Spring中

```java
@Component
public class MyFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        System.out.println("进入自定义过滤器");
        ServerHttpRequest request = exchange.getRequest();
        String name = request.getQueryParams().getFirst("name");
        if (name == null) {
            System.out.println("用户名为null");
            exchange.getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```

# Zuul

### 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```
### 使用Zuul

##### 开启Zuul支持

在主启动类上添加@EnableZuulProxy注解

##### 配置Zuul

```yml
server:
  port: 9527
spring:
  application:
    name: Zuul
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7001/eureka/,http://localhost2:7002/eureka/
  instance:
    instance-id: Zuul
    prefer-ip-address: true
info:
  app.name: PPG-SpringCloud-Learn-Zuul
zuul:
  routes:
    springcloud-provider-dept: /dept/** #为服务指定URl
  ignored-services: '*'
 prefix: /dept
  host:
    connect-timeout-millis: 2000
    socket-timeout-millis: 10000
  strip-prefix: false 
  #设置是否跳过前缀，这里是全局配置，既影响prefix也影响给服务指定的url前缀，
  # 默认为true，以此处为例，若设置为true，则访问时输入
  # localhost:9527/dept/dept/dept/queryAll才可以正常访问，
  # 第一个dept是prifix，第二个是为服务指定的前缀，第三个是微服务内部的前缀，
  # 由于设置为true，则这个请求的url被转换为localhost:8001/dept/queryAll，
  # 也就是忽略了两个prefix但微服务内部前缀依然保留
  # strip-prefix也可以为指定的微服务设置，例如：
  # routes:
  #   springcloud-provider-dept: 
  #   path: /dept/**
  #   strip-prefix: false
```
### Zuul与Ribbon和Hystrix

Zuul默认使用Ribbon和Hystrix，为了防止访问超时，做如下配置
```yml
hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 60000
ribbon:
  ConnectTimeout: 3000
  ReadTimeout: 60000
```
可以自定义配置Ribbon的策略
```java
@Bean
public IRule iRule(){
    return new RandomRule();
}
```
- 实现服务降级

Zuul网关中实现服务降级，只需要在Zuul网关的服务中，编写实现ZuulFallbackProvider接口的java类即可
```java
@Component
public class ProductFallback implements ZuulFallbackProvider {
    /**
     * 指定需要托底处理的服务名
     */
    @Override
    public String getRoute() {
        return "e-book-product-provider";
    }

    /**
     * 服务无法使用时，返回的托底信息
     */
    @Override
    public ClientHttpResponse fallbackResponse() {
        return new ClientHttpResponse() {
            /**
             * ClientHttpResponse 的 fallback 的状态码 返回HttpStatus
             */
            @Override
            public HttpStatus getStatusCode() throws IOException {
                return HttpStatus.OK;
            }
            /**
             * ClientHttpResponse 的 fallback 的状态码 返回 int
             */
            @Override
            public int getRawStatusCode() throws IOException {
                return getStatusCode().value();
            }

            /**
             * ClientHttpResponse 的 fallback 的状态码 返回 String
             */
            @Override
            public String getStatusText() throws IOException {
                return getStatusCode().getReasonPhrase();
            }


            /**
             * 设置响应体
             */
            @Override
            public InputStream getBody() throws IOException {
                String msg = "当前服务不可用，请稍后再试";
                return new ByteArrayInputStream(msg.getBytes());
            }
            /**
             * 设置响应的头信息
             */
            @Override
            public HttpHeaders getHeaders() {
                HttpHeaders httpHeaders= new HttpHeaders();
                MediaType mediaType = new MediaType("application","json", Charset.forName("utf-8"));
                httpHeaders.setContentType(mediaType);
                return httpHeaders;
            }

            @Override
            public void close() {
            }
        };
    }
}
```
**注意，当前进行服务降级的服务，在注册中心必须存在，否则，会直接出404,No message available错误，不会进行降级**

### Zuul过滤器

[过滤器](https://www.jianshu.com/p/ff863d532767)
例子：
```java
@Component
public class LoginFilter extends ZuulFilter {
    /**
     * 过滤器类型，前置过滤器
     * @return
     */
    @Override
    public String filterType() {
        return "pre";
    }

    /**
     * 过滤器的执行顺序
     * @return
     */
    @Override
    public int filterOrder() {
        return 1;
    }

    /**
     * 该过滤器是否生效
     * @return
     */
    @Override
    public boolean shouldFilter() {
        return true;
    }

    /**
     * 登陆校验逻辑
     * @return
     * @throws ZuulException
     */
    @Override
    public Object run() throws ZuulException {
        // 获取zuul提供的上下文对象
        RequestContext context = RequestContext.getCurrentContext();
        // 从上下文对象中获取请求对象
        HttpServletRequest request = context.getRequest();
        // 获取token信息
        String token = request.getParameter("access-token");
        // 判断
        if (StringUtils.isBlank(token)) {
            // 过滤该请求，不对其进行路由
            context.setSendZuulResponse(false);
            // 设置响应状态码，401
            context.setResponseStatusCode(HttpStatus.SC_UNAUTHORIZED);
            // 设置响应信息
            context.setResponseBody("{\"status\":\"401\", \"text\":\"request error!\"}");
        }
        // 校验通过，把登陆信息放入上下文信息，继续向后执行
        context.set("token", token);
        return null;
    }
}
```
# Config

### 相关依赖

```xml
<!-- 服务端 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
</dependency>
<!-- 客户端 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
<!-- 2020版本SpringCloud读取bootstrap.yml -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```
### 不使用Eureka使用配置中心

##### 服务端配置

```yml
server:
    port: 8848
spring:
    cloud:
        config:
            server:
                git:
                    password: 06050704zxl
                    uri: https://gitee.com/pidehen2/spring-cloud-config-learn.git
                    username: 1658272229@qq.com
    application:
        name: config-server
```
在主启动类上添加 **@EnableConfigServer**注解开启服务

##### 查看仓库中配置文件内容的可选路径

![查看路径](/SpringCloud/SpringCloudConfig路径.jpg)

application是yml中定义的spring.application.name的值，profile是yml中定义的spring.config.active.on-profile，label为分支

##### 客户端配置

application.yml(用户级配置，优先级低于bootstrap.yml)
```yml
spring:
  application:
    name: config-client
```
bootstrap.yml(系统级配置，优先级高于application.yml低于git仓库)
```yml
spring:
  cloud:
    config:
      uri: http://localhost:8848 #Config服务地址
      label: master #分支
      name: application #git仓库中文件名
      profile: dev #选择环境
server:
  port: 90 # 端口号，若git中没有配置端口号，这里才会生效
```
编写Controller测试
```java
@RestController
@RefreshScope
public class TestController {

    @Value("${teacher.name}")
    private String name;

    @RequestMapping("/test")
    public String test(){
        return name;
    }
}
```
### 使用Eureka

##### 服务端配置

```yml
server:
    port: 8848
spring:
    cloud:
        config:
            server:
                git:
                    password: 06050704zxl
                    uri: https://gitee.com/pidehen2/spring-cloud-config-learn.git
                    username: 1658272229@qq.com
    application:
        name: config-server
eureka:
    client:
        service-url:
            defaultZone: http://localhost:7001/eureka/,http://localhost2:7002/eureka/
    instance:
        instance-id: config-server
        prefer-ip-address: true
info:
    app.name: config-server

```
##### 客户端配置

- bootstrap.yml
```yml
spring:
  cloud:
    config:
      label: master
      discovery:
        enabled: true
        service-id: config-server
  application:
    name: application
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7001/eureka/,http://localhost2:7002/eureka/
  instance:
    instance-id: config-client
    prefer-ip-address: true
info:
  app.name: config-client
```

### 手动刷新

##### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

##### 修改bootstrap.yml

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*" # 类似Hystrix，将刷新接口暴露
```

##### 修改要刷新的类

在需要刷新的类上使用`@RefreshScope`注解

##### 刷新

修改Git中的配置文件后，向`[IP]:[port]/actuator/refresh`发送==POST==请求，即可实现手动刷新

# BUS消息总线

Spring Cloud BUS支持RabbitMQ和Kafka

### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

### 修改Config Server配置文件

```yaml
spring:
  profiles:
    active: prod
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/pidehen2/spring-cloud-config-learn.git
          #          username: 1658272229@qq.com
          #          skip-ssl-validation: true
          #          password: 06050704zxl
          basedir: D://config
          search-paths:
            - SpringCloudConfigLearn
      label: master
  application:
    name: config-server
  rabbitmq: # 配置RabbitMQ消息队列
    host: 192.168.3.14
    port: 5672
    username: rabbitmq
    password: ${spring.rabbitmq.username}
eureka:
  client:
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
  instance:
    instance-id: config-server
    prefer-ip-address: true
    ip-address: 192.168.3.55
    non-secure-port: 3344
management:
  endpoints:
    web:
      exposure:
        include: "*" # 暴露出供动态刷新的接口
---
server:
  port: 3344
spring:
  config:
    activate:
      on-profile: prod

---

server:
  port: 8848
spring:
  config:
    activate:
      on-profile: dev
```

### 修改Config Client 3355的配置文件

- bootstrap.yml

```yaml
server:
  port: 3355
eureka:
  client:
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
  instance:
    prefer-ip-address: true
    ip-address: 127.0.0.1
    non-secure-port: 3355
management:
  endpoints:
    web:
      exposure:
        include: "*"
spring:
  application:
    name: config-client
  rabbitmq: # 配置RabbitMQ
    host: 192.168.3.14
    port: 5672
    username: rabbitmq
    password: ${spring.rabbitmq.username}
  cloud:
    config: # 设置Git的相关信息
      label: master
      profile: prod
      discovery:
        enabled: true

        service-id: config-server
      name: config # 如果不是名字为application需要指定
```

### 修改Config Client 3366配置文件

```yaml
server:
  port: 3366
eureka:
  client:
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
  instance:
    prefer-ip-address: true
    ip-address: 127.0.0.1
    non-secure-port: 3366
management:
  endpoints:
    web:
      exposure:
        include: "*"
spring:
  application:
    name: config-client
  rabbitmq:
    host: 192.168.3.14
    port: 5672
    username: rabbitmq
    password: ${spring.rabbitmq.username}
  cloud:
    config:
      label: master
      profile: dev
      discovery:
        enabled: true

        service-id: config-server
      name: config
```

### 获取动态刷新的接口

访问http://192.168.3.55:3344/actuator/，找到刷新的url

默认情况下，http://192.168.3.55:3344/actuator/busrefresh/就是动态刷新的接口，使用POST方式访问即可

### 只刷新某个Client

访问http://192.168.3.55:3344/actuator/busrefresh/config-client:3366

在全体通知接口后加上服务名:端口号即可

# Stream

Stream支持RabbitMQ和Kafka

### 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
</dependency>
```

### 消息生产者

修改配置文件

如果使用下面的配置方式配置RabbitMQ，且如果RabbitMQ不在本地，程序将进行两次连接，第一次连接到远程服务器的消息队列，第二次连接本地消息队列，如果本地没有消息队列，则会抛出异常，要解决这个问题请参考消息消费者的配置方法

```yaml
server:
  port: 8801
spring:
  application:
    name: stream-provider
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
          environment:
            spring:
              rabbitmq:
                host: 192.168.3.14
                port: 5672
                username: rabbitmq
                password: ${spring.cloud.stream.binders.defaultRabbit.environment.spring.rabbitmq.username}
      bindings:
        output:
          destination: exchangeDemo
          content-type: application/json
          # binder: defaultRabbit 加不加没啥影响

eureka:
  client:
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
  instance:
    prefer-ip-address: true
    ip-address: 127.0.0.1
    non-secure-port: 8801
```

编写业务实现类

```java
@EnableBinding({Source.class})
public class MessageProviderImpl implements IMessageProvider {


    @Autowired
    private MessageChannel output;

    @Override
    public String send(String message) {
        output.send(MessageBuilder.withPayload(message).build());
        return null;
    }
}
```

然后编写controller进行访问即可



### 消息消费者

编写配置文件

将消息队列连接配置移到spring下就不会出现重连两次的问题

```yaml
server:
  port: 8802
spring:
  rabbitmq:
    host: 192.168.3.14
    port: 5672
    username: rabbitmq
    password: ${spring.rabbitmq.username}
  application:
    name: stream-consumer
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
      bindings:
        input:
          destination: exchangeDemo
          content-type: application/json
#          binder: defaultRabbit

eureka:
  client:
    service-url:
      defaultZone: http://192.168.3.14:7001/eureka/,http://192.168.3.55:7002/eureka/
  instance:
    prefer-ip-address: true
    ip-address: 127.0.0.1
    non-secure-port: 8802
```

编写消息消费类

```java
@EnableBinding(Sink.class)
@Component
public class ReceiveController {

    @Value("${server.port}")
    private String port;

    @StreamListener(Sink.INPUT)
    public void input(Message<String> message){
        System.out.println("消费者1号收到消息---------->"+message.getPayload()+"\t 端口号："+port);

    }
}
```

### 解决重复消费问题

通过==分组==实现解决重复消费问题

> 分组：
>
> ​	发送一条消息，同一个分组内的所有消费者中只有一个能消费这条消息，不同分组可以重复消费

修改消费者配置文件，指定分组

```yaml
spring:
  rabbitmq:
    host: 192.168.3.14
    port: 5672
    username: rabbitmq
    password: ${spring.rabbitmq.username}
  application:
    name: stream-consumer
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
      bindings:
        input:
          destination: exchangeDemo
          content-type: application/json
          group: ppg
```

### 消息持久化

如果不显示指定分组，在消费者下线期间产生的消息不会被这个消费者消费，如果指定了分组，那么下线期间产生的消息也会被消费

# Sleuth

Sleuth用于链路监控，结合zipkin搭建可视化监控面板

### 下载Zipkin

从SpringCloud F版本后不再需要单独搭建Zipkin，直接在Zipkin下载jar包即可

执行命令：`java -jar zipkin-server-2.23.4-exec.jar`启动Zipkin

### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
    <version>2.2.8.RELEASE</version>
</dependency>
```

### 修改配置文件

```yaml
spring:
  application:
    name: payment-service
  zipkin:
    base-url: http://192.168.3.55:9411
  sleuth:
    sampler:
      probability: 1 # 0-1的Float值，1表示全部路径都监控
```

无论是生产者还是消费者配置都相同

### 进行访问，查看Zipkin



# Nacos

[官方文档](https://nacos.io/zh-cn/index.html)

### 单机Nacos部署



### 服务提供者注册到Nacos



### 服务消费者注册到Nacos



### Nacos配置中心



### Nacos DataID、Namespace、Group概念与配置



### Nacos持久化



### Nacos集群部署
