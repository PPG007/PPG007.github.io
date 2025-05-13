# 使用 Java 方式配置 Spring

- @Configuration：

  添加在配置类前，表示此 Java 类是一个配置文件。

  ```java
  @Configuration
  public class Config {
      …………
  }
  ```

- @ComponentScan：

  添加在配置类前，用于开启组件注册扫描，value 值为全包名。

  ```java
  @Configuration
  @ComponentScan(value = "pojo")
  public class Config {
      …………
  }
  ```

- @Import：

  与 xml 中 import 标签作用相同，参数为要引用的配置类的 class。

  ```java
  @Import(Config2.class)
  public class Config {
      …………
  }
  ```

- @Bean：

  添加在配置类的方法名上，表示注册一个 bean,方法名就是 bean 的名字，也可以通过 name 属性指定 bean 的名字。

  ```java
  @Configuration
  @ComponentScan(value = "pojo")
  @Import(Config2.class)
  public class Config {
      @Bean
      public User getUser(){
          return new User();
      }
  }
  ```

- 通过注解进行配置，获取容器时要调用注解对应的上下文：

  ```java
  ApplicationContext context=new AnnotationConfigApplicationContext(Config.class);
  User user= (User) context.getBean("getUser");
  System.out.println(user.toString());
  ```
