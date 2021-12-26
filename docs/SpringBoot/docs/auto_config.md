---
prev:
  text: 首页
  link: /springboot
---

# SpringBoot 自动配置基本原理

依赖均在父项目中，要使用什么依赖，只需使用对应的 starter 启动器。

![SpringBoot原理](/SpringBoot/SpringBoot流程图.jpg)

## 配置文件中的配置名从何而来

在 `spring-boot-autoconfigure` 包下的 `\META-INF` 文件夹中有一个 `spring.factories` 文件，文件内容如下：

![spring.factories](/SpringBoot/spring.factories.jpg)

在 **Auto Configure** 中的所有类都具有 `@EnableConfigurationProperties` 注解(或者直接指向了配置文件而没有配置类，或者注解在内部类上)，这个注解的值指向的类就是我们在配置文件中的可选择的属性，如 `HttpEncodingAutoConfiguration` 自动配置类使用了 `ServerProperties.class`，在 `ServerProperties` 中有唯一一个注解 `@ConfigurationProperties(prefix = "server", ignoreUnknownFields = true)`，此注解就是 SpringBoot 通过配置文件向实体类赋值的注解，prefix 表示前缀，ServerProperties 中有一个 port 属性用于指定端口号，要在配置文件中配置时，可以使用 `server.port=xxx` 的方式指定它的值。

这些自动配置类都有多个 `@ConditionalOnxxx` 注解，用于根据注解中的条件是否成立决定是否生效。

![@Conditional](/SpringBoot/@Conditional.jpg)

::: tip 总结
配置文件中的属性都有 XxxProperties 类与其对应，且都有 XxxAutoConfiguration 类加载了 Properties 中的属性。
:::
