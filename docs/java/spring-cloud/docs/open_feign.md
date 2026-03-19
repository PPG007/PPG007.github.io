# OpenFeign

## 引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

## 重构消费者

feign 用法类似 dubbo，但是是通过 HTTP 而非 RPC 实现调用，也是作用在服务接口上。

客户端建立接口：

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

::: warning 注意

- 接口上要添加 `@FeignClient` 注解，并通过 value 属性指定 Eureka 中的要调用的服务名。
- 方法上要添加相关 URL 绑定注解，指明服务提供方对应路径的请求方式。
- 如果方法中有参数且不使用 `@PathVariable` 和 `@RequestParam` 注解，则请求将会以 POST 方法发出，即使使用 `@GetMapping`。
- 如果是 GET 请求方式需要携带参数，应当使用 `@RequestParam` 注解作键值映射，或者使用占位符和 `@PathVariable` 注解完成映射，但是第二种方法由于是拼接为 RestFul 风格 URL，需要服务提供端 Controller 同样使用占位符及 `@PathVariable` 注解。

:::

## OpenFeign 超时设置

由于早期版本 OpenFeign 集成了 Ribbon，因此需要在配置文件中配置 Ribbon 的超时时间。

新版本 OpenFeign 不再集成 Ribbon，修改超时配置如下：

```yaml
feign:
  client:
    config:
      default:
        readTimeOut: 1000
        connectTimeout: 1000
```

## OpenFeign 增强日志

### 日志级别

- NONE：默认的，不显示任何日志。
- BASIC：仅记录请求方法、URL、响应状态码及执行时间。
- HEADERS：除了 BASIC 中定义的信息之外，还有请求和响应的头信息。
- FULL：除了 HEADERS 中定义的信息之外，还有请求和响应的正文及元数据。

### 配置日志 Bean

```java
@Bean
public Logger.Level level(){
    return Logger.Level.FULL;
}
```

### 编写配置文件指定要打印日志的接口

```yaml
logging:
  level:
    top.ppg.service.IPaymentFeignService: debug
```

日志形式可以是 info、debug、error 等。
