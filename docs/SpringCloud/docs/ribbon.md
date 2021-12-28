# Ribbon

## 相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

## 简单使用 Ribbon

方式一，使用 Ribbon 配置 RestTemplate：

```java
@Configuration
public class Config {

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){

        return new RestTemplate();
    }
    // 负载均衡规则
    @Bean
    public IRule iRule(){
        return new RoundRobinRule();
    }
}
```

在要使用 RestTemplate 的地方直接注入调用即可。

方式二，使用 LoadBalancerClient 中的负载均衡策略获取一个可用的服务地址，然后再进行请求：

```java
@RestController
@RequestMapping("/api/v1/center")
public class MessageCenterController {

    @Autowired
    private LoadBalancerClient loadBalancer;

    @GetMapping("/msg/get")
    public Object getMsg() {
        ServiceInstance instance = loadBalancer.choose("message-service");
        URI url = URI.create(String.format("http://%s:%s/api/v1/msg/get", instance.getHost(), instance.getPort()));
        RestTemplate restTemplate = new RestTemplate();
        String msg = restTemplate.getForObject(url, String.class);
        return msg;
    }
}
```

可以通过 yaml 来配置使用的策略：

```yaml
message-service:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
<clientName>.ribbon.NFLoadBalancerClassName: 需实现 ILoadBalancer
<clientName>.ribbon.NFLoadBalancerRuleClassName: 需实现 IRule
<clientName>.ribbon.NFLoadBalancerPingClassName: 需实现 IPing
<clientName>.ribbon.NIWSServerListClassName: 需实现 ServerList
<clientName>.ribbon.NIWSServerListFilterClassName: 需实现 ServerListFilter
```

## 自定义策略

自定义的策略类必须继承 `AbstractLoadBalancerRule`：

```java
 public class RandomRule_ZY extends AbstractLoadBalancerRule
{
 // total = 0 // 当total==5以后，我们指针才能往下走，
 // index = 0 // 当前对外提供服务的服务器地址，
 // total需要重新置为零，但是已经达到过一个5次，我们的index = 1
 // 分析：我们5次，但是微服务只有8001 8002 8003 三台，OK？

 private int total = 0;    // 总共被调用的次数，目前要求每台被调用5次
 private int currentIndex = 0; // 当前提供服务的机器号

public Server choose(ILoadBalancer lb, Object key)
{
  if (lb == null) {
   return null;
  }
  Server server = null;
  while (server == null) {
   if (Thread.interrupted()) {
    return null;
   }

   List<Server> upList = lb.getReachableServers();
   List<Server> allList = lb.getAllServers();
   int serverCount = allList.size();
   if (serverCount == 0) {
    return null;
   }
 if(total < 5)
            {
             server = upList.get(currentIndex);
             total++;
            }else {
              total = 0;
             currentIndex++;
             if(currentIndex >= upList.size())
             {
               currentIndex = 0;
             }
            }
 if (server == null) {
    Thread.yield();
    continue;
   }
 if (server.isAlive()) {
    return (server);
   }
   server = null;
   Thread.yield();
   }
   return server;
   }
@Override
 public Server choose(Object key)
 {
  return choose(getLoadBalancer(), key);
 }

@Override
 public void initWithNiwsConfig(IClientConfig clientConfig)
 {
 }
 }
```

编写对应配置类：

```java
@Configuration
public class MySelfRules{
    @Bean
    public IRule myRule(){
        return new RandomRule_ZY();
    }
}
```

在主启动类上添加：

```java
@RibbonClient(name="服务名",configuration=MySelfRule.class)
```

::: warning 注意
MySelfRule 配置类必须不能被 Spring 扫描到，否则所有的 Ribbon 客户端都会使用这个规则。
:::

## 自定义 Ribbon 客户端

```java
import org.springframework.cloud.netflix.ribbon.RibbonClient;
import org.springframework.cloud.netflix.ribbon.ZonePreferenceServerListFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.netflix.loadbalancer.IPing;
import com.netflix.loadbalancer.PingUrl;
import com.pengjunlee.TestConfiguration.MessageConfiguration;

@Configuration
@RibbonClient(name = "message-service", configuration = MessageConfiguration.class)
public class TestConfiguration {

	@Configuration
	protected static class MessageConfiguration {
		@Bean
		public ZonePreferenceServerListFilter serverListFilter() {
			ZonePreferenceServerListFilter filter = new ZonePreferenceServerListFilter();
			filter.setZone("myTestZone");
			return filter;
		}

		@Bean
		public IPing ribbonPing() {
			return new PingUrl();
		}
	}
}
```

::: warning 注意
此类同样不能被 Spring 扫描。
:::

Ribbon 的所有可选 Bean：
![RibbonBean](/SpringCloud/RibbonBean.jpg)
