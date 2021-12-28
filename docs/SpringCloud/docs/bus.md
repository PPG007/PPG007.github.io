# BUS消息总线

Spring Cloud BUS 支持 RabbitMQ 和 Kafka。

## 引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

## 修改 Config Server 配置文件

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

## 修改 Config Client 3355 的配置文件

bootstrap.yml:

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

## 修改 Config Client 3366 配置文件

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

## 获取动态刷新的接口

访问 `http://192.168.3.55:3344/actuator/`，找到刷新的 url。

默认情况下，`http://192.168.3.55:3344/actuator/busrefresh/` 就是动态刷新的接口，使用 POST 方式访问即可。

## 只刷新某个 Client

访问 `http://192.168.3.55:3344/actuator/busrefresh/config-client:3366`

在全体通知接口后加上服务名:端口号即可。
