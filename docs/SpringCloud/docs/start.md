---
prev:
  text: 首页
  link: /SpringCloud
---

# 基础环境搭建

## 项目基础结构搭建

创建一个 Maven 项目作为父项目。

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

::: tip 三种打包方式的不同：

- pom：
    打出来的可以作为其他项目的 maven 依赖，在工程 A 中添加工程 B 的 pom，A 就可以使用 B 中的类。用在父级工程或聚合工程中。用来做 jar 包的版本控制。

- jar：

    通常是开发时要引用通用类，打成 jar 包便于存放管理。当你使用某些功能时就需要这些 jar 包的支持，需要导入 jar 包。

- war：

    是做好一个 web 网站后，打成 war 包部署到服务器。目的是节省资源，提供效率。

:::

## 环境搭建-通用模块

创建一个子模块，修改 pom 文件：

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

指定打包方式为 pom：

```xml
<packaging>pom</packaging>
```

编写通用实体类：

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

先执行 maven clean，再执行 maven install。

## 环境搭建-支付模块

引入依赖：

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

编写 SpringBoot 配置文件：

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

编写 Dao 接口：

```java
@Mapper
@Repository
public interface PaymentMapper extends BaseMapper<Payment> {
}
```

编写服务层接口：

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

编写服务层接口实现类：

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

编写 controller：

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

编写启动类：

```java
@SpringBootApplication
public class PaymentStarter {
    public static void main(String[] args) {
        SpringApplication.run(PaymentStarter.class,args);
    }
}
```

## 环境搭建-订单模块

编写 pom 文件：

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

编写 SpringBoot 配置文件：

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

编写启动类：

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

编写 controller：

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

## 关于 RestTemplate

RestTemplate 是从 Spring3.0 开始支持的一个 HTTP 请求工具，它提供了常见的REST请求方案的模版，例如 GET 请求、POST 请求、PUT 请求、DELETE 请求以及一些通用的请求执行方法 exchange 以及 execute。

- GET 请求：

    `getForEntity` 方法：

    此方法获取响应头、状态码、内容等在内的完整信息,第一个参数为URL，第二个参数为返回结果类型，第三个参数以 map 存储请求参数。

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

    `getForObject` 方法：

    此方法获取返回内容,第一个参数为URL，第二个参数为返回结果类型，第三个参数以 map 存储请求参数。

    ```java
    HashMap<String, String> stringStringHashMap = new HashMap<>();
    stringStringHashMap.put("id","id2");
    stringStringHashMap.put("name","name2");
    String forObject = restTemplate.getForObject(URL, String.class, stringStringHashMap);
    System.out.println(forObject);
    ```

    ::: tip
    get 请求要注意参数的拼接，需要占位符。
    :::

- POST 请求：

    `postForEntity` 和 `postForObject`：

    第一个参数为 URL，第二个参数为 map 或者对象实例，使用对象实例时，以 JSON 方式发送。

    ```java
    LinkedMultiValueMap<String, String> stringStringLinkedMultiValueMap = new LinkedMultiValueMap<>();
    restTemplate.postForEntity(URL_POST, stringStringLinkedMultiValueMap, String.class);
    ```

    若使用 KV 键值对传递请求参数，则必须使用 `LinkedMultiValueMap`。

    `postForLocation`：

    `postForLocation` 方法的返回值是一个 Uri 对象，返回跳转到的地址，可以先使用 `postForLocation` 获取 URI 再使用访问。

    ::: tip
    postForLocation 方法返回的 Uri 实际上是指响应头的 Location 字段，所以，provider 中 register 接口的响应头必须要有 Location 字段（即请求的接口实际上是一个重定向的接口），否则 postForLocation 方法的返回值为 null。
    :::
