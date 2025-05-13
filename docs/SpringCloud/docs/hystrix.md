# Hystrix

由于 hystrix 已经进入维护状态，hystrix 被移出了 Spring Cloud Netflix，而 Hystrix 作为 CircuitBreaker 服务降级、熔断目前的唯一实现，所以 `@EnableCircuitBreaker` 过时了，但是在 feign 的 fallback 配置中，由原来的 `feign.hystrix.enabled=true` 变成了 `feign.circuitbreaker=true`，相当于 OpenFeign 也去除了与 Hystrix 的关系。

## 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
</dependency>
```

## 使用Hystrix

### 服务提供者或消费者开启服务降级

在需要服务降级的方法上使用 `@HystrixCommand` 注解并进行配置：

```java
@HystrixCommand(fallbackMethod = "getPaymentsOk",commandProperties = {
        @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds",value = "1500")
})
public List<Payment> getPayments() {
    int a=10/0;
    return this.list();
}

public List<Payment> getPaymentsOk() {
    log.info("进入备用方法");
    return this.list();
}
```

`@HystrixProperty` 的可选配置项有：

```java
@HystrixCommand(fallbackMethod = "xxx_method",
        groupKey = "strGroupCommand",
        commandKey = "strCommarld",
        threadPoolKey = "strThreadPool",
        commandProperties = {
                //设置隔离策略，THREAD 表示线程她SEMAPHORE:信号他隔离
                @HystrixProperty(name = "execution.isolation.strategy", value = "THREAD"),
                //当隔离策略选择信号他隔离的时候，用来设置信号地的大小(最大并发数)
                @HystrixProperty(name = "execution.isolation.semaphore.maxConcurrentRequests", value = "10"),
                //配置命令执行的超时时间
                @HystrixProperty(name = "execution.isolation.thread.timeoutinMilliseconds", value = "10"),
                //是否启用超时时间
                @HystrixProperty(name = "execution.timeout.enabled", value = "true"),
                //执行超时的时候是否中断
                @HystrixProperty(name = "execution.isolation.thread.interruptOnTimeout", value = "true"),
                //执行被取消的时候是否中断
                @HystrixProperty(name = "execution.isolation.thread.interruptOnCancel", value = "true"),
                //允许回调方法执行的最大并发数
                @HystrixProperty(name = "fallback.isolation.semaphore.maxConcurrentRequests", value = "10"),
                //服务降级是否启用，是否执行回调函数
                @HystrixProperty(name = "fallback.enabled", value = "true"),
                @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),
                //该属性用来设置在滚动时间窗中，断路器熔断的最小请求数。例如，默认该值为20的时候，
                //如果滚动时间窗(默认10秒)内仅收到了19个请求，即使这19个请求都失败了， 断路器也不会打开。
                @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "20"),
                // 该属性用来设置在熔动时间窗中表示在滚动时间窗中，在请求数量超过
                // circuitBreaker.requestVolumeThreshold 的情况下,如果错误请求数的百分比超过50,
                //就把断路器设置为“打开”状态，否则就设置为“关闭”状态。
                @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "50"),
                // 该属性用来设置当断路器打开之后的休眠时间窗。休眠时间窗结束之后,
                //会将断路器置为"半开”状态，尝试熔断的请求命令，如果低然失败就将断路器继续设置为"打开”状态，
                //如果成功就设置为"关闭”状态。
                @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "5009"),
                //断路器强制打开
                @HystrixProperty(name = "circuitBreaker.force0pen", value = "false"),
                // 断路器强制关闭
                @HystrixProperty(name = "circuitBreaker.forceClosed", value = "false"),
                //滚动时间窗设置，该时间用于断路器判断健康度时需要收集信息的持续时间
                @HystrixProperty(name = "metrics.rollingStats.timeinMilliseconds", value = "10000"),
                //该属性用来设置滚动时间窗统计指标信息时划分”桶"的数量，断路器在收集指标信息的时候会根据设置的时间窗长度拆分成多个"相"来累计各度量值，每个”桶"记录了-段时间内的采集指标。
                //比如10秒内拆分成10个”桶"收集这样，所以timeinMilliseconds 必须能被numBuckets 整除。否则会抛异常
                @HystrixProperty(name = "metrics.rollingStats.numBuckets", value = "10"),
                //该属性用来设置对命令执行的延迟是否使用百分位数来跟踪和计算。如果设置为false,那么所有的概要统计都将返回-1.
                @HystrixProperty(name = "metrics .rollingPercentile.enabled", value = "false"),
                //该属性用来设置百分位统计的滚动窗口的持续时间， 单位为毫秒。
                @HystrixProperty(name = "metrics.rollingPercentile.timeInMilliseconds", value = "60000"),
                //该属性用来设置百分位统计演动窗口中使用“桶”的数量。
                @HystrixProperty(name = "metrics.rollingPercentile.numBuckets", value = "60000"),
                // 该属性用来设置在执行过程中每个 “桶”中保留的最大执行次数。如果在滚动时间窗内发生超过该设定值的执行次数，就从最初的位置开始重写。例如，将该值设置为100,燎动窗口为10秒， 若在10秒内一 一个“桶 ” 中发生7500次执行，
                //那么该“桶”中只保留最后的100次执行的统计。另外,增加该值的大小将会增加内存量的消耗， 并增加排序百分位数所需的计算
                @HystrixProperty(name = "metrics.rollingPercentile.bucketSize", value = "100"),
                //该属性用来设置采集影响断路器状态的健康快照(请求的成功、错误百分比) 的间隔等待时间。
                @HystrixProperty(name = "metrics.healthSnapshot.intervalinMilliseconds", value = "500"),
                //是否开启请求缓存
                @HystrixProperty(name = "requestCache.enabled", value = "true"),
                // HystrixCommand的执行和时间是否打印日志到HystrixRequestLog中
                @HystrixProperty(name = "requestLog.enabled", value = "true"),
        },
        threadPoolProperties = {
                //该参数用来设置执行命令线程他的核心线程数，该值 也就是命令执行的最大并发量
                @HystrixProperty(name = "coreSize", value = "10"),
                //该参数用来设置线程她的最大队列大小。当设置为-1时，线程池将使用SynchronousQueue 实现的队列，
                // 否则将使用LinkedBlocakingQueue实现队列
                @HystrixProperty(name = "maxQueueSize", value = "-1"),
                // 该参数用来为队列设置拒绝阀值。 通过该参数， 即使队列没有达到最大值也能拒绝请求。
                //該参数主要是対linkedBlockingQueue 队列的朴充,因为linkedBlockingQueue
                //队列不能动态修改它的对象大小，而通过该属性就可以调整拒绝请求的队列大小了。
                @HystrixProperty(name = "queueSizeRejectionThreshold", value = "5"),
        }
)

```

或者参考 `HystrixCommandProperties` 类。

主启动类上添加 `@EnableHystrix` 注解，此注解集成了 `@EnableCircuitBreaker` 注解（新版）。

### 使用 DefaultFallback

在要开启服务熔断的类上使用 `@DefaultProperties` 注解并配置 `defaultFallback` 属性指定默认备用方法:

```java
@Service
@Slf4j
@DefaultProperties(defaultFallback = "defaultMethod")
public class PaymentServiceImpl extends ServiceImpl<PaymentMapper, Payment> implements IPaymentService {
    @Override
    public boolean createPayment(Payment payment) {
        return this.save(payment);
    }

    @Override
    @HystrixCommand
    public Payment getPaymentById(int id) throws Exception {
        QueryWrapper<Payment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id",id);
        Payment one = this.getOne(queryWrapper);
        if (one==null){
            throw new Exception("null");
        }
        return one;
    }

    @Override
    @HystrixCommand(fallbackMethod = "getPaymentsOk",commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds",value = "1500")
    })
    public List<Payment> getPayments() {
        int a=10/0;
        return this.list();
    }

    public List<Payment> getPaymentsOk() {
        log.info("进入备用方法");
        return this.list();
    }

    public Payment defaultMethod(){
        log.info("进入默认熔断方法");
        return new Payment(1, "熔断");
    }
}
```

::: warning 注意
需要开启熔断的方法还要使用 `@HystrixCommand`，且*返回值必须是原方法的返回类型或其子类*。
:::

### 基于 Feign 的降级

```java
@FeignClient(name = "microservice-provider-user", fallback = HystrixClientFallback.class)
public interface UserFeignClient {
  @RequestMapping(value = "/simple/{id}", method = RequestMethod.GET)
  public User findById(@PathVariable("id") Long id);
}
```

```java
@Component
public class HystrixClientFallback implements UserFeignClient {

  @Override
  public User findById(Long id) {
    User user = new User();
    user.setId(0L);
    return user;
  }
}
```

修改配置文件：

```yaml
feign:
  circuitbreaker: # 老版本这里是hystrix
    enabled: true
```

### 使用 FallbackFactory 降级

```java
@FeignClient(name = "microservice-provider-user", fallbackFactory = HystrixClientFactory.class)
public interface UserFeignClient {
  @RequestMapping(value = "/simple/{id}", method = RequestMethod.GET)
  public User findById(@PathVariable("id") Long id);
}
```

```java
@Component
public class HystrixClientFactory implements FallbackFactory<UserFeignClient> {

  private static final Logger LOGGER = LoggerFactory.getLogger(HystrixClientFactory.class);

  @Override
  public UserFeignClient create(Throwable cause) {
    HystrixClientFactory.LOGGER.info("fallback; reason was: {}", cause.getMessage());
    return new UserFeignClientWithFactory() {
      @Override
      public User findById(Long id) {
        User user = new User();
        user.setId(-1L);
        return user;
      }
    };
  }
}
```

```java
public interface UserFeignClientWithFactory extends UserFeignClient {

}
```

### 配置服务熔断

修改业务类代码：

```java
@HystrixCommand(fallbackMethod = "breakFallbackMethod",commandProperties = {
        @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),// 开启服务熔断
        @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"),// 一个窗口期中，达到熔断的最小请求次数
        @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "50"),// 失败的百分比
        @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "20000")// 窗口期事件
})
public String breakTest(int a) throws Exception {
    if (a%2==0){
        throw new Exception("熔断异常");
    }
    return "请求成功，随机号："+ UUID.randomUUID()+",id:"+a;
}

public String breakFallbackMethod(int a){
    return "寄了，id："+a;
}
```

### 查看 Hystrix 信息及状态

两个接口：

`[IPAddress]:[Port]/actuator/hystrix.stream`。

`[IPAddress]:[Port]/actuator/health`。

## HystrixDashBoard

### 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
</dependency>
```

### 修改配置文件

监控面板配置：

```yaml
server:
  port: 9001
hystrix:
  dashboard:
    proxy-stream-allow-list: '127.0.0.1' # 将此IP加入允许监控的列表
```

被监控配置：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: '*'
```

### 开启 DashBoard

在启动类上添加：

```java
@EnableHystrixDashboard
```

### 访问 DashBoard

访问地址：

`[IPAddress]:[Port]/hystrix`。

在其中填写要监控的 Hystrix 微服务：

`[IPAddress]:[Port]/actuator/hystrix.stream`。
