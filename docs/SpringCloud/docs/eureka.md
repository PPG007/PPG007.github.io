# Eureka

[Eureka详细配置](https://www.cnblogs.com/april-chen/p/10617066.html)。

## Eureka Server 配置

### 依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
</dependencies>
```

### 配置 Eureka Server

```yaml
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

### 开启 Eureka Server

在主启动类上添加 `@EnableEurekaServer` 注解：

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaStart {
    public static void main(String[] args) {
        SpringApplication.run(EurekaStart.class,args);
    }
}
```

## Eureka Client 配置

### 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

### 配置 Eureka Client

```yaml
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

### 开启 EurekaClient

在主启动类上添加 `@EnableEurekaClient` 注解。

## Eureka 注册中心集群配置

### 配置 Eureka Server 集群

假设有三个 Eureka 注册中心 192.168.1.2，192.168.1.3，192.168.1.4，只要在每一个的配置文件的 service-url 属性中添加另外两个的注册地址，以逗号分隔，互相注册。

### 配置 Eureka Client 注册到 Eureka 集群中

在配置文件中的 service-url 属性中添加所有的注册中心 url 即可，同样以逗号分隔。

### 配置 Client 集群

多个微服务保证 `spring.application.name` 和 `eureka.instance.appname` 分别对应相同即可，并注册到 Eureka 中。
