# Sleuth

Sleuth 用于链路监控，结合 zipkin 搭建可视化监控面板。

## 下载 Zipkin

从 SpringCloud F 版本后不再需要单独搭建 Zipkin，直接在 Zipkin 下载 jar 包即可。

执行命令：`java -jar zipkin-server-2.23.4-exec.jar` 启动 Zipkin。

## 引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
    <version>2.2.8.RELEASE</version>
</dependency>
```

## 修改配置文件

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

无论是生产者还是消费者配置都相同。
