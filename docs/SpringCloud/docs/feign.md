# Feign

## 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
    <version>1.4.7.RELEASE</version>
</dependency>
```

## 使用 Feign

::: tip
一定要将服务注入 Spring 中。
:::

### 编写服务接口

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

### 启动类开启 Feign 支持

```java
//确保被Spring扫描到即可
@EnableFeignClients(basePackages = "api")
```

## Feign 原理简述

- 启动时，程序会进行包扫描，扫描所有包下所有 `@FeignClient` 注解的类，并将这些类注入到 Spring 的 IOC 容器中。当定义的 Feign 中的接口被调用时，通过 JDK 的动态代理来生成 RequestTemplate。
- RequestTemplate 中包含请求的所有信息，如请求参数，请求 URL 等。
- RequestTemplate 生成 Request，然后将 Request 交给 client 处理，这个 client 默认是 JDK 的 HTTPUrlConnection，也可以是 OKhttp、Apache的HTTPClient 等。
- 最后 client 封装成 `LoadBaLanceClient`，结合 ribbon 负载均衡地发起调用。

## 开启 GZIP 压缩

```yaml
feign:
  compression:
    request: #请求
      enabled: true #开启
      mime-types: text/xml,application/xml,application/json #开启支持压缩的MIME TYPE
      min-request-size: 2048 #配置压缩数据大小的下限
    response: #响应
      enabled: true #开启响应GZIP压缩
```

由于开启 GZIP 压缩之后，Feign 之间的调用数据通过二进制协议进行传输，返回值需要修改为 `ResponseEntity<byte[]>` 才可以正常显示，否则会导致服务之间的调用乱码。

## Feign 开启 OkHttp

```yaml
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
