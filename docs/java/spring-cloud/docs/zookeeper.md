# Zookeeper

## 依赖引入

将上面的 eureka 依赖替换为 zookeeper 依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zookeeper-discovery</artifactId>
</dependency>
```

## Provider 模块

### 编写 SpringBoot 配置文件

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

其他内容与 Eureka 相同，修改主启动类注解，使用 `@EnableDiscoveryClient` 替换 Eureka 注解。

```java
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentStarter8004 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentStarter8004.class,args);
    }
}
```

## Consumer 模块

### 编写 SpringBoot 配置文件

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

主启动类与 Provider 相同。

### 注入 RestTemplate

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

### 修改 controller 的 url

```java
private static final String BASE_URL="http://payment-service";
```

修改为 ZooKeeper 中服务对应的节点名称，与 `spring.application.name` 相同。
