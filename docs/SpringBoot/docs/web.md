# SpringBoot Web 开发

## 静态资源可用位置

在 `WebMvcAutoConfiguration` 类中存在 `addResourceHandlers` 方法：

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
  // 根据if中的条件可知，若自定义了静态资源的路径，默认静态资源配置将会失效，方法将会直接返回，
  if (!this.resourceProperties.isAddMappings()) {
    logger.debug("Default resource handling disabled");
    return;
  }
  Duration cachePeriod = this.resourceProperties.getCache().getPeriod();
  CacheControl cacheControl = this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl();
  // 由第二个if及其中的代码可知，存在这样一个访问静态资源路径即webjars中的所有资源，例如localhost:8080/wabjars/jquery.js,
  // 且这个访问路径会被映射到classpath:/META-INF/resources/webjars/
  // 也就是说在浏览器输入的webjars等价于实际结构中的classpath:/META-INF/resources/webjars/
  if (!registry.hasMappingForPattern("/webjars/**")) {
    customizeResourceHandlerRegistration(registry.addResourceHandler("/webjars/**")
        .addResourceLocations("classpath:/META-INF/resources/webjars/")
        .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl)
        .setUseLastModified(this.resourceProperties.getCache().isUseLastModified()));
  }
  // 以下代码通过读取默认的路径设置获取静态资源路径，这个配置存在于WebMvcProperties中
  String staticPathPattern = this.mvcProperties.getStaticPathPattern();
  if (!registry.hasMappingForPattern(staticPathPattern)) {
    customizeResourceHandlerRegistration(registry.addResourceHandler(staticPathPattern)
        .addResourceLocations(getResourceLocations(this.resourceProperties.getStaticLocations()))
        .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl)
        .setUseLastModified(this.resourceProperties.getCache().isUseLastModified()));
  }
}
```

`isAddMappings()` 方法定义在 `WebProperties` 类中，这个类上有一个 `@ConfigurationProperties("spring.web")` 注解，说明这个类可以通过 `spring.web` 前缀的配置进行设置，在 `application.yml` 中输入如下内容，所有默认静态资源路径都会失效：

```yaml
spring:
  web:
    resources:
      add-mappings: false
```

关于 webjars：

进入 webjars 官网即可获取对应的依赖。

![webjars](/SpringBoot/webjars.jpg)

webjars 实现了使用 jar 包依赖引入 web 资源。

以 jQuery 为例，首先在 Maven 中添加依赖：

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.5.1</version>
</dependency>
```

![webjars在项目中的位置](/SpringBoot/webjars在项目中的位置.jpg)

根据对源代码的分析，要想访问 jQuery，只需要在浏览器输入 `localhost:8080/webjars/jquery/3.5.1/jquery.js`。

默认静态资源路径：

`WebMvcProperties` 的 `getStaticPathPattern()` 方法返回一个 String 字符串。

```java
private String staticPathPattern = "/**";
```

if 中的代码中有：

```java
this.resourceProperties.getStaticLocations()
```

此方法在 WebProperties 中的内部静态类 Resources 中定义，返回一个 String 数组：

```java
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { "classpath:/META-INF/resources/",
				"classpath:/resources/", "classpath:/static/", "classpath:/public/" };
```

说明访问 `/**` 的资源会被转换为项目中的四个 CLASSPATH_RESOURCE_LOCATION，且优先级为 resources > static > public，例如访问 `localhost:8080/test.js` 会根据优先级访问 resources、static、public 中的 test.js。

可以通过配置文件的方式改变映射路径 `/**` 为其他路径，例如：

```yaml
spring:
  mvc:
    static-path-pattern: /hello/**
```

配置后，访问 `/hello` 下的资源才会被映射，例如原先访问 `localhost:8080/test.js` 要更改为 `localhost:8080/hello/test.js`。

## 首页和图标定制

### 首页

在 `WebMvcAutoConfiguration` 类中存在 `welcomePageHandlerMapping` 方法：

```java
@Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext,
    FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
  WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
      new TemplateAvailabilityProviders(applicationContext), applicationContext, getWelcomePage(),
      this.mvcProperties.getStaticPathPattern());
  welcomePageHandlerMapping.setInterceptors(getInterceptors(mvcConversionService, mvcResourceUrlProvider));
  welcomePageHandlerMapping.setCorsConfigurations(getCorsConfigurations());
  return welcomePageHandlerMapping;
}
```

其中调用了 `getWelcomePage`：

```java
private Optional<Resource> getWelcomePage() {
  String[] locations = getResourceLocations(this.resourceProperties.getStaticLocations());
  return Arrays.stream(locations).map(this::getIndexHtml).filter(this::isReadable).findFirst();
}
```

这个方法又调用了 `getStaticLocations` 方法，返回一个 location 字符串数组：

```java
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { "classpath:/META-INF/resources/",
    "classpath:/resources/", "classpath:/static/", "classpath:/public/" };

/**
  * Locations of static resources. Defaults to classpath:[/META-INF/resources/,
  * /resources/, /static/, /public/].
  */
private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;
```

可以看到，这个值就是上面提到的四个静态资源路径：

此外，`welcomePageHandlerMapping` 方法还调用了 `WebMvcProperties` 的 `getStaticPathPattern()` 方法，返回值默认就是上面提到的 `/**`。

`getWelcomePage` 还调用了 `getIndexHtml` 方法,并且传入的参数就是上面的四个 location：

```java
private Resource getIndexHtml(String location) {
  return this.resourceLoader.getResource(location + "index.html");
}
```

:: tip
首页名称必须是 index.html，且必须放在默认静态资源路径下，默认访问路径如：localhost:8080，若修改了 static-path-pattern 为其他路径，则无法访问 index。
:::

### 图标定制

最新版本 SpringBoot 中已经移除了图标的设置，若使用老版本，在静态资源文件夹中放置一个 favicon.ico 文件，并修改配置文件,关闭默认图标：

```yaml
spring:
  mvc:
    favicon:
      enabled: false
```
