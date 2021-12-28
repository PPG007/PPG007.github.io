# Gateway

## 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

## 编写配置文件

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

## 配置路由-配置文件配置

修改配置文件：

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

## 配置路由-编码配置

```java
@Bean
public RouteLocator routes(RouteLocatorBuilder builder){
    RouteLocatorBuilder.Builder routes = builder.routes();
    return routes.route("payment_routh", predicateSpec -> predicateSpec.path("/payment/**").uri("http://localhost:8001")).build();
}
```

## 可选断言配置

### After

限制只有某个时间之后的请求才能通过：

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

对应的是 Java8 中的 `ZonedDateTime` 类：

```java
System.out.println(ZonedDateTime.now());
```

### Before

与 After 相对应，只有某个时间之前的请求才能通过：

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

### Between

两个时间之间发生的请求才能通过，用逗号分隔：

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

### Cookie

通过两个参数：名字和值的正则表达式进行匹配，如果 cookie 中携带了指定名字的键且值符合这个正则表达式才能通过：

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

### Header

与 Cookie 类似，只有请求头中存在对应字段且字段值满足正则表达式才通过：

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

### Host

接受一个参数作为主机列表，如果请求头中含有 host 属性且值符合定义的主机列表则通过：

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

### Method

限制请求方式：

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

### Path

请求路径符合限制才通过：

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

### Query

接收两个参数，一个是 query 参数名，一个是正则表达式，满足要求才通过：

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

### RemoteAddr

匹配请求的远程地址，在一个子网下才通过：

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

### Weight

接收两个参数，第一个参数是一个字符串，代表分组，第二个参数是比例：

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

80% 的请求进入 `https://weighthigh.org`，20% 进入 `https://weightlow.org`。

## 结合注册中心实现负载均衡

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

Java Config：

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

## 过滤器 Filter

自带过滤器参见：[Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/3.0.3/reference/html/#gatewayfilter-factories)。

## 自定义过滤器

创建一个类，实现 `GlobalFilter, Ordered` 这两个接口，然后注入到 Spring 中：

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
