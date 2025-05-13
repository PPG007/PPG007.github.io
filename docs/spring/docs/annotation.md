# 使用注解开发

- 在 Spring4 以后，要想使用注解，必须保证 aop 包导入。
- 使用注解需要导入 context 约束，并且开启注解的支持。

## 常用注解

- @Autowired：

  自动装配注解，通过ByType实现。

- @Resource：

  自动装配注解，默认ByName，也会ByType。

- @Nullable：

  可为空注解。

- @Component：

  组件注解，需要在配置文件中开启组件扫描，相当于在配置文件中注册bean，默认名字是类名的小写。

  ```xml
  <context:component-scan base-package="pojo"/>
  ```

- @Value：

  加在类属性或方法上，为简单类型的成员赋值，不适用于复杂类型如 List。

  ```java
  @Component
  public class User {
      @Value("test")
      public String name;
  }
  ```

- @Scope：

  设置作用域（单例、原型）

  ```java
  @Scope(value = "singleton")
  ```

## 衍生注解

`@Component` 的相关注解：

在web开发中，依照MVC三层架构分层：

- DAO 层中，使用 `@Repository` 注解。
- Service 层中，使用 `@Service` 注解。
- controller 层中，使用 `@Controller` 注解。

上述注解功能一致，代表将某个类注册到 Spring 中。
