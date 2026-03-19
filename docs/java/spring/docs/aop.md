# AOP

## AOP 在 Spring 中的作用

提供声明式事务，允许用户自定义切面。

- 横切关注点：跨越应用程序多个模块的方法或功能。如日志、安全、缓存、事务等。
- 切面：是一个类，横切关注点被模块化的特殊对象。
- 通知：切面必须要完成的工作，类中的一个方法。
- 目标：被通知对象。
- 代理：向目标对象应用通知之后创建的对象。
- 切入点：切面通知执行的地点的定义。
- 连接点：与切入点匹配的执行点。

## 使用 Spring 实现 AOP

依赖：

```xml
<dependency>
    <groupId>aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.5.4</version>
</dependency>
```

方式一：使用Spring的接口（xml配置）。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--注册bean-->
    <bean id="userService" class="demo.service.UserServiceImpl"/>
    <bean id="log" class="demo.Log.Log"/>
    <bean id="afterLog" class="demo.Log.AfterLog"/>

    <aop:config>
        <!--切入点-->
        <!--修饰符  返回值  包名.类名/接口名.方法名(参数列表)-->
        <aop:pointcut id="pointcut" expression="execution(* demo.service.UserServiceImpl.*(..))"/>
        <!--执行环绕增加-->
        <aop:advisor advice-ref="log" pointcut-ref="pointcut"/>
        <aop:advisor advice-ref="afterLog" pointcut-ref="pointcut"/>
    </aop:config>

</beans>
```

前置通知：

```java
public class Log implements MethodBeforeAdvice {

    /**
     *
     * @param method 要执行的目标对象的方法
     * @param args 参数
     * @param target 目标对象
     * @throws Throwable 异常
     */
    public void before(Method method, Object[] args, Object target) throws Throwable {
        assert target != null;
        System.out.println(target.getClass().getName()+"的"+method.getName()+"被执行了");
    }
}
```

后置通知：

```java
public class AfterLog implements AfterReturningAdvice {
    public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {

        System.out.println("执行了"+method.getName()+"返回结果为"+returnValue);
    }
}
```

测试代码如下：

```java
public void test(){
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        //代理的是接口，所以要调用接口才能运行
        UserService userService = context.getBean("userService", UserService.class);
        userService.add();
    }
```

方式二：自定义类实现AOP（xml）。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <bean id="userService" class="demo.service.UserServiceImpl"/>
    <bean id="log" class="demo.Log.Log"/>
    <bean id="afterLog" class="demo.Log.AfterLog"/>

    <!--方式2-->
    <bean id="diy" class="demo.zch.MyPointCut"/>
    <aop:config>
        <!--自定义切面-->
        <aop:aspect ref="diy">
            <aop:pointcut id="point" expression="execution(* demo.service.UserServiceImpl.*(..))"/>
            <!--前置通知-->
            <aop:before method="before" pointcut-ref="point"/>
            <!--后置通知-->
            <aop:after-returning method="after" pointcut-ref="point"/>
        </aop:aspect>
    </aop:config>
</beans>
```

自定义类代码：

```java
public class MyPointCut {

    public void before(){
        System.out.println("=====方法执行前=====");
    }
    public void after(){
        System.out.println("=====方法执行后=====");
    }
}
```

方式三：注解实现。

```java
@Configuration
@ComponentScan("demo")
@EnableAspectJAutoProxy
//开启自动代理功能
//相当于xml中的<aop:aspectj-autoproxy/>
public class Config {
    //注册bean
    @Bean(name = "userService")
    public UserServiceImpl getUserServiceImpl(){
        return new UserServiceImpl();
    }

}
```

定义切面类代码如下：

```java
@Aspect
@Component//切面也必须是Spring管理的一个bean
public class AnnoPointCut {

    @Before(value = "execution(* demo.service.UserServiceImpl.*(..))")
    public void before(){
        System.out.println("=====方法执行前=====");
    }

    @AfterReturning(value = "execution(* demo.service.UserServiceImpl.*(..))")
    public void after(){
        System.out.println("=====方法执行后=====");
    }

    @Around(value = "execution(* demo.service.UserServiceImpl.*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("=====环绕前=====");
        Object o=pjp.proceed();
        System.out.println("=====环绕后=====");
        return o;
    }
}
```

定义切点（可选）：

```java
@Pointcut("execution(* demo.service.UserServiceImpl.*(..))")
public void test(){//方法名就是切点名

}
```

定义通知：

- `@Before`：在目标方法执行前执行通知。
- `@After`：在目标方法执行后执行通知。
- `@AfterReturning`：在目标方法执行完成后执行通知。
- `@AfterThrowing`：在目标方法抛出异常后执行通知。
- `@Around`：可在目标方法执行前后自定义通知行为。

```java
@Before("test()")//引用已定义的切点
    public void before(){
        System.out.println("=====方法执行前=====");
    }

    @AfterReturning(value = "execution(* demo.service.UserServiceImpl.*(..))")//直接定义切点
    public void after(){
        System.out.println("=====方法执行后=====");
    }

    @Around(value = "execution(* demo.service.UserServiceImpl.*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("=====环绕前=====");
        Object o=pjp.proceed();
        System.out.println("=====环绕后=====");
        return o;
    }
```

测试代码：

```java
    @Test
    public void test(){
        ApplicationContext context = new AnnotationConfigApplicationContext(Config.class);
        UserService userService = context.getBean("userService", UserService.class);
        userService.add();
    }
```
