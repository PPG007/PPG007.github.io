# 整合 SpringBoot

## 导入依赖

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

## 服务提供者

编写配置文件：

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

编写接口实现类：

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

主启动类上添加 `@EnableDubbo`。

## 服务消费者

编写配置文件：

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

编写消费者接口实现类：

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

编写controller：

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

主启动类上添加 `@EnableDubbo`。
