# Consul

## 安装 Consul

```sh
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install consul
```

## 启动 consul 并允许外网访问

```sh
consul agent -dev   -client 0.0.0.0 -ui
```

## Provider 注册到 Consul

添加依赖，将 Eureka 依赖替换：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-consul-discovery</artifactId>
</dependency>
```

主启动类添加注解 `@EnableDiscoveryClient`。

编写 SpringBoot 配置文件：

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

## Consumer 注册到 Consul

依赖与 Provider 相同。

主启动类添加注解 `@EnableDiscoveryClient`。

编写 SpringBoot 配置文件：

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
