# 拓展 MVC 配置

## 注意事项

要想扩展 mvc 的配置，只要写一个类实现 `WebMvcConfigurer` 接口，并重写想要拓展的功能即可(这个接口就是 SpringMVC 使用注解配置时，对应于 mvc 标签的接口)。

此外，这个类要使用 `@Configuration` 注解，但是不能使用 `@EnableWebMvc` 注解，原因如下：

`WebMvcAutoConfiguration` 类上有这样一个注解，说明只有在容器中没有 `WebMvcConfigurationSupport` 这个类时，`WebMvcAutoConfiguration` 才会生效。

```java
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
```

`@EnableWebMvc` 注解中有这样一个注解：

```java
@Import({DelegatingWebMvcConfiguration.class})
```

此注解引用了 `DelegatingWebMvcConfiguration` 这个类，而这个类继承了 `WebMvcConfigurationSupport`，所以会使容器中出现了 `WebMvcConfigurationSupport` 这个类进而导致 WebMVC 自动配置失效：

```java
public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport
```

## 示例

```java
@Configuration
public class MyMVC implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/index").setViewName("index");
        registry.addViewController("/index.html").setViewName("index");
        registry.addRedirectViewController("/ss","https://www.baidu.com");
        registry.addStatusController("/bad", HttpStatus.BAD_GATEWAY);
    }
}
```

上述代码实现了 `addViewControllers` 方法，在访问 `/`, `/index`, `/index.html` 时均会指向 index 界面，在访问 `/ss` 时，会被重定向到百度，当访问 `/bad` 时，会返回一个错误码。
