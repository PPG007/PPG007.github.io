# 完善此前例子的配置

这里都使用 Apache Dubbo。

## 服务提供者

```java
@Configuration
@EnableDubbo(scanBasePackages = "service.impl")
public class ProviderConfiguration {


    @Bean
    public ApplicationConfig applicationConfig(){
        ApplicationConfig applicationConfig = new ApplicationConfig();
        applicationConfig.setName("user-service-provider");
        applicationConfig.setVersion("1.0");
        applicationConfig.setOwner("PPG");
        applicationConfig.setOrganization("BBZL");
        applicationConfig.setEnvironment("test");
        return applicationConfig;
    }

    @Bean
    public RegistryConfig registryConfig(){
        RegistryConfig registryConfig = new RegistryConfig();
        registryConfig.setId("ppg");
        registryConfig.setAddress("localhost");
        registryConfig.setPort(2181);
        registryConfig.setProtocol("zookeeper");
        registryConfig.setTimeout(10000);
        registryConfig.setCheck(false);
        return registryConfig;
    }

    @Bean
    public ProtocolConfig protocolConfig(){
        ProtocolConfig protocolConfig = new ProtocolConfig();
        protocolConfig.setId("PPG");
        protocolConfig.setName("dubbo");
        protocolConfig.setPort(20880);
        protocolConfig.setHost("localhost");
        return protocolConfig;
    }
}
```

```java
@DubboService(delay = -1,loadbalance = "roundrobin",registry = "ppg",protocol = "PPG",version = "1.0",weight = 2)
public class UserServiceImpl implements IUserService {

    @Override
    public Integer getAge(User user) {
        Calendar birthday = Calendar.getInstance();
        birthday.setTime(user.getBirthday());
        Calendar now= Calendar.getInstance();
        return now.get(Calendar.YEAR) - birthday.get(Calendar.YEAR);
    }

}
```

## 服务消费者

```java
@Configuration
@EnableDubbo(scanBasePackages = "service")
@ComponentScan(basePackages = "service")
public class ConsumerConfiguration {

    @Bean
    public ApplicationConfig applicationConfig(){
        ApplicationConfig applicationConfig = new ApplicationConfig();
        applicationConfig.setName("user-service-consumer");
        applicationConfig.setVersion("1.0");
        applicationConfig.setOwner("PPG");
        applicationConfig.setOrganization("BBZL");
        applicationConfig.setEnvironment("test");
        return applicationConfig;
    }

    @Bean
    public RegistryConfig registryConfig(){
        RegistryConfig registryConfig = new RegistryConfig();
        registryConfig.setId("ppg007");
        registryConfig.setAddress("localhost");
        registryConfig.setPort(2181);
        registryConfig.setProtocol("zookeeper");
        registryConfig.setTimeout(10000);
        registryConfig.setCheck(false);
        return registryConfig;
    }
}
```

```java
@Service
public class UserServiceConsumerImpl implements IUserServiceConsumer{


    private IUserService userService;

    @DubboReference(version = "1.0",timeout = 1000,retries = 5,loadbalance = "roundrobin",check = false)
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public void demo() {
        User user = new User();
        Calendar instance = Calendar.getInstance();
        instance.set(Calendar.YEAR,2000);
        Date bir = instance.getTime();
        user.setBirthday(bir);
        System.out.println(userService.getAge(user));
    }
}
```
