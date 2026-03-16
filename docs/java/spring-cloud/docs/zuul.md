# Zuul

## 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

## 使用 Zuul

### 开启 Zuul 支持

在主启动类上添加 `@EnableZuulProxy` 注解。

### 配置 Zuul

```yaml
server:
  port: 9527
spring:
  application:
    name: Zuul
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7001/eureka/,http://localhost2:7002/eureka/
  instance:
    instance-id: Zuul
    prefer-ip-address: true
info:
  app.name: PPG-SpringCloud-Learn-Zuul
zuul:
  routes:
    springcloud-provider-dept: /dept/** #为服务指定URl
  ignored-services: '*'
 prefix: /dept
  host:
    connect-timeout-millis: 2000
    socket-timeout-millis: 10000
  strip-prefix: false
  #设置是否跳过前缀，这里是全局配置，既影响prefix也影响给服务指定的url前缀，
  # 默认为true，以此处为例，若设置为true，则访问时输入
  # localhost:9527/dept/dept/dept/queryAll才可以正常访问，
  # 第一个dept是prifix，第二个是为服务指定的前缀，第三个是微服务内部的前缀，
  # 由于设置为true，则这个请求的url被转换为localhost:8001/dept/queryAll，
  # 也就是忽略了两个prefix但微服务内部前缀依然保留
  # strip-prefix也可以为指定的微服务设置，例如：
  # routes:
  #   springcloud-provider-dept:
  #   path: /dept/**
  #   strip-prefix: false
```

## Zuul 与 Ribbon 和 Hystrix

Zuul 默认使用 Ribbon 和 Hystrix，为了防止访问超时，做如下配置：

```yaml
hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 60000
ribbon:
  ConnectTimeout: 3000
  ReadTimeout: 60000
```

可以自定义配置 Ribbon 的策略：

```java
@Bean
public IRule iRule(){
    return new RandomRule();
}
```

实现服务降级：

Zuul 网关中实现服务降级，只需要在 Zuul 网关的服务中，编写实现 `ZuulFallbackProvider` 接口的 java 类即可：

```java
@Component
public class ProductFallback implements ZuulFallbackProvider {
    /**
     * 指定需要托底处理的服务名
     */
    @Override
    public String getRoute() {
        return "e-book-product-provider";
    }

    /**
     * 服务无法使用时，返回的托底信息
     */
    @Override
    public ClientHttpResponse fallbackResponse() {
        return new ClientHttpResponse() {
            /**
             * ClientHttpResponse 的 fallback 的状态码 返回HttpStatus
             */
            @Override
            public HttpStatus getStatusCode() throws IOException {
                return HttpStatus.OK;
            }
            /**
             * ClientHttpResponse 的 fallback 的状态码 返回 int
             */
            @Override
            public int getRawStatusCode() throws IOException {
                return getStatusCode().value();
            }

            /**
             * ClientHttpResponse 的 fallback 的状态码 返回 String
             */
            @Override
            public String getStatusText() throws IOException {
                return getStatusCode().getReasonPhrase();
            }


            /**
             * 设置响应体
             */
            @Override
            public InputStream getBody() throws IOException {
                String msg = "当前服务不可用，请稍后再试";
                return new ByteArrayInputStream(msg.getBytes());
            }
            /**
             * 设置响应的头信息
             */
            @Override
            public HttpHeaders getHeaders() {
                HttpHeaders httpHeaders= new HttpHeaders();
                MediaType mediaType = new MediaType("application","json", Charset.forName("utf-8"));
                httpHeaders.setContentType(mediaType);
                return httpHeaders;
            }

            @Override
            public void close() {
            }
        };
    }
}
```

::: warning 注意
当前进行服务降级的服务，在注册中心必须存在，否则，会直接出 404,No message available 错误，不会进行降级。
:::

## Zuul 过滤器

[过滤器](https://www.jianshu.com/p/ff863d532767)。

例子：

```java
@Component
public class LoginFilter extends ZuulFilter {
    /**
     * 过滤器类型，前置过滤器
     * @return
     */
    @Override
    public String filterType() {
        return "pre";
    }

    /**
     * 过滤器的执行顺序
     * @return
     */
    @Override
    public int filterOrder() {
        return 1;
    }

    /**
     * 该过滤器是否生效
     * @return
     */
    @Override
    public boolean shouldFilter() {
        return true;
    }

    /**
     * 登陆校验逻辑
     * @return
     * @throws ZuulException
     */
    @Override
    public Object run() throws ZuulException {
        // 获取zuul提供的上下文对象
        RequestContext context = RequestContext.getCurrentContext();
        // 从上下文对象中获取请求对象
        HttpServletRequest request = context.getRequest();
        // 获取token信息
        String token = request.getParameter("access-token");
        // 判断
        if (StringUtils.isBlank(token)) {
            // 过滤该请求，不对其进行路由
            context.setSendZuulResponse(false);
            // 设置响应状态码，401
            context.setResponseStatusCode(HttpStatus.SC_UNAUTHORIZED);
            // 设置响应信息
            context.setResponseBody("{\"status\":\"401\", \"text\":\"request error!\"}");
        }
        // 校验通过，把登陆信息放入上下文信息，继续向后执行
        context.set("token", token);
        return null;
    }
}
```
