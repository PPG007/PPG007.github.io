# Spring

[Spring中文文档地址](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference)

[Spring英文文档地址](https://spring.io/projects/spring-framework#learn)

## Spring 组成

![Spring组成](/Spring/spring模块.jpg)

::: tip
Spring 核心是控制反转 IOC 和面向切面 AOP。
:::

### Spring Core 核心容器

核心容器提供 Spring 框架的基本功能。Spring 以 `bean` 的方式组织和管理 Java 应用中的各个组件及其关系。Spring 使用 BeanFactory 来产生和管理 Bean，它是工厂模式的实现。BeanFactory 使用 `控制反转IOC` 模式将应用的配置和依赖性规范与实际的应用程序代码分开。

### Spring Context 上下文

Spring 上下文是一个配置文件，向 Spring 框架提供上下文信息。Spring 上下文包括企业服务，如 JNDI、EJB、电子邮件、国际化、校验和调度功能。

### Spring AOP 面向切面编程

通过配置管理特性，Spring AOP 模块直接将面向方面的编程功能集成到了 Spring 框架中。所以，可以很容易地使 Spring 框架管理的任何对象支持 AOP。Spring AOP 模块为基于 Spring 的应用程序中的对象提供了事务管理服务。通过使用 Spring AOP，不用依赖 EJB 组件，就可以将声明性事务管理集成到应用程序中。

### Spring DAO

JDBC、DAO 的抽象层提供了有意义的异常层次结构，可用该结构来管理异常处理，和不同数据库供应商所抛出的错误信息。异常层次结构简化了错误处理，并且极大的降低了需要编写的代码数量，比如打开和关闭链接。

### Spring ORM

Spring 框架插入了若干个 ORM 框架，从而提供了 ORM 对象的关系工具，其中包括了 Hibernate、JDO 和 IBatis SQL Map 等，所有这些都遵从 Spring 的通用事务和 DAO 异常层次结构。

### Spring Web

Web 上下文模块建立在应用程序上下文模块之上，为基于 web 的应用程序提供了上下文。所以 Spring 框架支持与 Struts 集成，web 模块还简化了处理多部分请求以及将请求参数绑定到域对象的工作。

### Spring Web MVC

MVC 框架是一个全功能的构建 Web 应用程序的 MVC 实现。通过策略接口，MVC 框架变成为高度可配置的。MVC 容纳了大量视图技术，其中包括 JSP、POI 等，模型来有 JavaBean 来构成，存放于 M 当中，而视图是一个接口，负责实现模型，控制器表示逻辑代码Spring 框架的功能可以用在任何 J2EE 服务器当中，大多数功能也适用于不受管理的环境。Spring 的核心要点就是支持不绑定到特定 J2EE 服务的可重用业务和数据的访问的对象，毫无疑问这样的对象可以在不同的 J2EE 环境，独立应用程序和测试环境之间重用。

## IOC 理论

### IOC 基本原理与思想

```java
public class UserServiceImpl implements UserService {

    private UserDao userDao;
    //使用set实现了动态注入
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public void getUser() {
        userDao.getUser();
    }
}
```

- 若不使用 set 方法，程序主动创建对象，控制权在程序员手中。
- 使用后，程序不再具有主动性，转而被动接收对象，通过 set 实现了控制反转。

使用 set 方法的用户代码如下:

```java
public static void main(String[] args) {
        UserService userService=new UserServiceImpl();

        ((UserServiceImpl)userService).setUserDao(new UserDaoMysqlImpl());

        userService.getUser();
    }
```

若不使用 set 方法，则需要在 `UserServiceImpl` 中不停修改代码：

```java
//每个Dao层实现都要赋值
private UserDao userDao=new UserDaoMysqlImpl();

    public void getUser() {
        userDao.getUser();
    }
```

### IOC 本质

::: tip
控制反转 IOC 是一种设计思想，DI（依赖注入）是实现 IOC 的一种方法
:::

控制反转：对象的创建转移给第三方，获得依赖对象的方式反转了。
Spring 容器在初始化时先读取配置文件，根据配置文件或元数据创建与组织对象存入容器中，程序使用时再从 IOC 容器中取出需要的对象。

## HelloSpring

### 最简单的Spring配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--
    使用Spring创建对象
    bean标签相当于Hello hello=new Hello();
    property标签相当于调用了相应属性的set方法
    实现了控制反转
    控制：使用Spring后，对象是由Spring来创建的
    反转：程序本身不创建对象，而变成被动的接收对象
    依赖注入：利用set方法来进行注入
    -->
    <bean id="hello" class="pojo.Hello">
        <property name="name" value="Spring"/>
    </bean>
</beans>
```

### 修改第二部分中的代码

- 添加 `beans.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean class="dao.UserDaoImpl" id="userDao"/>
    <bean class="dao.UserDaoMysqlImpl" id="userDaoMysql"/>
    <bean class="dao.UserDaoOracleImpl" id="userDaoOracle"/>
    <!--
        由于UserServiceImpl中类成员是一个UserDao对象，所以要使用ref赋值,ref引用Spring中创建的类
    -->
    <bean class="service.UserServiceImpl" id="userService">
        <property name="userDao" ref="userDaoMysql"/>
    </bean>

</beans>
```

测试代码：

```java
public class MyTest2 {
    public static void main(String[] args) {
        ApplicationContext context=new ClassPathXmlApplicationContext("beans.xml");

        Object o=context.getBean("userService");
        ((UserServiceImpl)o).getUser();
    }
}
```

## IOC 创建对象的方式

- 默认使用无参构造。
- 配置文件加载时，bean 已被实例化。
- 若使用有参创建：
    - 使用下标赋值：

        ```xml
        <bean class="service.UserServiceImpl" id="userService">
                <constructor-arg index="0" ref="userDao"/>
        </bean>
        ```

    - 通过类型赋值（不建议使用，若有多个参数，无法使用）：

        ```xml
        <bean class="service.UserServiceImpl" id="userService">
                <constructor-arg type="dao.UserDao" ref="userDao"/>
        </bean>
        ```

    - 直接通过参数名设置：

        ```xml
        <bean class="service.UserServiceImpl" id="userService">
                <constructor-arg ref="userDaoOracle" name="userDao"/>
        </bean>
        ```

- 若参数是基本类型则使用value、name属性指定值即可。

## Spring 配置

- 别名。
    - 通过 alias 标签起：

        ```xml
        <alias name="userService" alias="userService2"/>
        ```

    - 通过 bean 标签中的 name 属性起别名，可以用逗号或者空格或者分号进行分割起多个别名：

    ```xml
    <bean class="service.UserServiceImpl" id="userService" name="userService2,userService3">
            <constructor-arg ref="userDaoOracle"/>
    </bean>
    ```

- scope 作用域：

    ![bean的作用域](/Spring/bean的作用域.jpg)

- import：

    一般用于团队开发，将多个配置文件导入合并为一个,允许多个相同别名。

    ```xml
    <!--在applicationContext.xml中添加import标签-->
    <import resource="beans.xml"/>
    ```

    ```java
    //测试代码只读取applicationContext.xml
    public class MyTest2 {
        public static void main(String[] args) {
            ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");

            Object o=context.getBean("userService3");
            ((UserServiceImpl)o).getUser();
        }
    }
    ```

## DI（依赖注入）

### 构造器注入

[构造器注入](/Spring.md#ioc-创建对象的方式)

### set 方式注入

- 依赖：bean 对象的创建依赖于容器。
- 注入：bean 对象中的所有属性，由容器来注入。

#### 例子

简单类：

```java
package pojo;

/**
 * @author ppg007
 * @date 2021/1/19 21:16
 */
public class Address {
    private String address;

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Address{" +
                "address='" + address + '\'' +
                '}';
    }
}
```

复杂类：

```java
package pojo;

import java.util.*;

/**
 * @author ppg007
 * @date 2021/1/19 21:16
 */
public class Student {
    private String name;
    private Address address;
    private String[] books;
    private List<String> hobbies;
    private Map<String, String> card;
    private Set<String> games;
    private Properties info;
    private String wife;

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String[] getBooks() {
        return books;
    }

    public void setBooks(String[] books) {
        this.books = books;
    }

    public List<String> getHobbies() {
        return hobbies;
    }

    public void setHobbies(List<String> hobbies) {
        this.hobbies = hobbies;
    }

    public Map<String, String> getCard() {
        return card;
    }

    public void setCard(Map<String, String> card) {
        this.card = card;
    }

    public Set<String> getGames() {
        return games;
    }

    public void setGames(Set<String> games) {
        this.games = games;
    }

    public Properties getInfo() {
        return info;
    }

    public void setInfo(Properties info) {
        this.info = info;
    }

    public String getWife() {
        return wife;
    }

    public void setWife(String wife) {
        this.wife = wife;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", address=" + address.toString() +
                ", books=" + Arrays.toString(books) +
                ", hobbies=" + hobbies +
                ", card=" + card +
                ", games=" + games +
                ", info=" + info +
                ", wife='" + wife + '\'' +
                '}';
    }
}
```

测试类：

```java
import com.sun.jnlp.AppletContainerCallback;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import pojo.Student;

/**
 * @author ppg007
 * @date 2021/1/19 21:20
 */
public class MyTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");
        Student student= (Student) applicationContext.getBean("student");
        System.out.println(student.toString());
    }
}
```

xml 文件配置：

```xml
    <!--普通值注入 value-->
    <property name="name" value="PPG007"/>
```

```xml
    <!--bean注入 ref-->
    <property name="address" ref="address"/>
```

```xml
    <!--数组注入 array-->
    <property name="books">
        <array>
            <value>test1</value>
            <value>test2</value>
            <value>test3</value>
            <value>test4</value>
            <value>test5</value>
        </array>
    </property>
```

```xml
    <!--List集合注入-->
    <property name="hobbies">
        <list>
            <value>ListTest1</value>
            <value>ListTest2</value>
            <value>ListTest3</value>
            <value>ListTest4</value>
            <value>ListTest5</value>
        </list>
    </property>
```

```xml
    <!--Map注入-->
    <property name="card">
        <map>
            <entry key="key1" value="MapTest1"/>
            <entry key="key2" value="MapTest2"/>
            <entry key="key3" value="MapTest3"/>
        </map>
    </property>
```

```xml
    <!--Set注入-->
    <property name="games">
        <set>
            <value>SetTest1</value>
            <value>SetTest2</value>
            <value>SetTest3</value>
            <value>SetTest4</value>
            <value>SetTest5</value>
        </set>
    </property>
```

```xml
    <!--Property注入-->
    <property name="info">
        <props>
            <prop key="学号">201801060431</prop>
            <prop key="性别">男</prop>
        </props>
    </property>
```

```xml
<!--空值注入-->
        <property name="wife">
            <null/><!--null标签赋null-->
<!--<value></value> value为空赋空值-->
        </property>
    </bean>
```

### 拓展方式注入

- p 标签，相当于 property 标签：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--p命名空间注入 直接注入属性的值-->
    <bean id="user" class="pojo.User" p:name="PPG007" p:age="21"/>
</beans>
```

- c 标签，通过构造器注入（有参）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--c命名空间注入-->
    <bean id="user2" class="pojo.User" c:age="20" c:name="PPG"/>
</beans>
```

## Bean 的自动装配

- 自动装配是 Spring 满足 bean 依赖的一种方式！
- Spring 会在上下文中自动寻找，并自动给 bean 装配属性。
- Spring 中三种装配方式：
    - 在 xml 中显式的配置。
    - 在 Java 中显式的配置。
    - 隐式的自动装配。

### ByName 自动装配

- 自动在容器上下文中查找，和自己对象 set 方法后面的值对应的 bean id。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="dog" class="pojo.Dog"/>
    <bean id="cat" class="pojo.Cat"/>
    <bean id="man" class="pojo.Man" p:name="PPG007" autowire="byName"/>
</beans>
```

### ByType 自动装配

- 自动查找和对象属性类型相同的 bean，允许 id 与对象的属性名不同，允许注入的 bean 没有 id 属性，必须保证类型全局唯一。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="dog1" class="pojo.Dog"/>
    <bean id="cat" class="pojo.Cat"/>
    <bean id="man" class="pojo.Man" p:name="PPG007" autowire="byType"/>
</beans>
```

### 注解实现自动装配

- 导入约束：context 约束。
- 配置注解的支持：`<context:annotation-config/>`;

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

</beans>
```

#### @Autowired 注解实现自动装配

xml 代码如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">
    <bean id="dog" class="pojo.Dog"/>
    <bean id="cat" class="pojo.Cat"/>
    <bean id="man" class="pojo.Man"/>
    <!--必须开启注解支持才能实现-->
    <!--注解驱动-->
    <context:annotation-config/>
</beans>
```

Java 代码：

```java
public class Man {
    @Autowired
    private Cat cat;
    @Autowired
    private Dog dog;
    private String name;
    ……………
```

- `@Autowired` 注解直接在属性上使用，也可以在 set 方法上使用。
- 使用 `@Autowired` 可以省略 set 方法，前提是要自动装配的属性在 IOC 容器中存在并且符合 ByType 自动装配的要求。
- 拓展：`@Nullable` 允许所被标记的字段为 null。

    例如如下代码允许 name 为空值而不会报错：

    ```java
    public void setName(@Nullable String name) {
        this.name = name;
    }
    ```

- 拓展：`@Autowired`具有如下用法

```java
@Autowired(required = false)
```

如果显式定义了 required 的属性值为 false，说明这个对象可以为 null，否则不允许为空。

- 拓展：`@Autowired` 与 `@Qualifier` 组合使用，可以指定某个确定的 bean 进行装配：

```java
@Autowired
@Qualifier(value = "cat")
```

::: warning 注意
如果 `@Autowired` 用作 field 注入会出现以下问题：

- 不允许声明不可变域。

    基于字段的依赖注入在声明为 final/immutable 的字段上不起作用，因为这些字段必须在类实例化时实例化。声明不可变依赖项的惟一方法是使用基于构造器的依赖注入。

- 容易违反单一职责原则。

    使用基于字段的依赖注入，高频使用的类随着时间的推移，我们会在类中逐渐添加越来越多的依赖项，我们用着很爽，很容易忽略类中的依赖已经太多了。但是如果使用基于构造函数的依赖注入，随着越来越多的依赖项被添加到类中，构造函数会变得越来越大，我们一眼就可以察觉到哪里不对劲。

    有一个有超过 10 个参数的构造函数是一个明显的信号，表明类已经转变一个大而全的功能合集，需要将类分割成更小、更容易维护的块。

    因此，尽管属性注入并不是破坏单一责任原则的直接原因，但它隐藏了信号，使我们很容易忽略这些信号。

- 与依赖注入容器紧耦合。

    使用基于字段的依赖注入的主要原因是为了避免 getter 和 setter 的样板代码或为类创建构造函数。最后，这意味着设置这些字段的唯一方法是通过 Spring 容器实例化类并使用反射注入它们，否则字段将保持 null。

    依赖注入设计模式将类依赖项的创建与类本身分离开来，并将此责任转移到类注入容器，从而允许程序设计解耦，并遵循单一职责和依赖项倒置原则(同样可靠)。因此，通过自动装配（autowiring）字段来实现的类的解耦，最终会因为再次与类注入容器(在本例中是Spring)耦合而丢失，从而使类在 Spring 容器之外变得无用。

    这意味着，如果您想在应用程序容器之外使用您的类，例如用于单元测试，您将被迫使用 Spring 容器来实例化您的类，因为没有其他可能的方法(除了反射)来设置自动装配字段。

- 隐藏依赖关系。

    在使用依赖注入时，受影响的类应该使用公共接口清楚地公开这些依赖项，方法是在构造函数中公开所需的依赖项，或者使用方法(setter)公开可选的依赖项。当使用基于字段的依赖注入时，实质上是将这些依赖对外隐藏了。
:::

#### @Resource 注解实现自动装配

```java
    @Resource
    private Dog dog;
```

同样允许使用指定的 bean。

```java
    @Resource(name="dag")
    private Dog dog;
```

#### @Resource 和 @Autowired 的区别

- `@Autowired` 通过 ByType 方式实现，而且要求被装配的对象必须存在于 IOC 容器。
- `@Resource` 默认通过 ByName 进行，若无法实现，则通过 ByType 实现，两种方式均不行则报错。
- `@Resource` 是 Java 原生注解。

## 使用注解开发

- 在 Spring4 以后，要想使用注解，必须保证 aop 包导入。
- 使用注解需要导入 context 约束，并且开启注解的支持。

### 常用注解

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

### 衍生注解

`@Component` 的相关注解：

在web开发中，依照MVC三层架构分层：

- DAO 层中，使用 `@Repository` 注解。
- Service 层中，使用 `@Service` 注解。
- controller 层中，使用 `@Controller` 注解。

上述注解功能一致，代表将某个类注册到 Spring 中。

## 使用 Java 方式配置 Spring

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

## 代理模式

### 静态代理

#### 角色

- 抽象角色：一般用抽象类或接口。
- 真实角色：被代理的角色。
- 代理角色：代理真实角色的角色，一般有附属操作。
- 客户：访问代理对象的人。

#### 代码过程

- 接口。
- 真实角色。
- 代理角色。
- 客户端访问代理角色。

#### 代理模式优点

- 使真实角色的操作更加纯粹，不用去关注一些公共的业务。
- 实现了业务的分工。
- 公共业务发生扩展时，便于集中管理。

#### 静态代理模式缺点

每个真实角色都会有一个代理角色，代码量翻倍，开发效率降低。

### 动态代理

- 动态代理的代理类是动态生成的。
- 动态代理分类：
    - 基于接口的动态代理：JDK动态代理。[InvocationHandler](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/InvocationHandler.html)
    - 基于类的动态代理：[CGLIB](https://www.runoob.com/w3cnote/cglibcode-generation-library-intro.html)。
    - Java字节码实现：[Javassist](https://www.javassist.org/)。

InvocationHandler 是由代理实例的调用处理程序实现的接口。

每个代理实例都有一个关联的调用处理程序。 当在代理实例上调用方法时，方法调用将被编码并分派到其调用处理程序的 **invoke** 方法。

实现类：Proxy.

```java
InvocationHandler handler = new MyInvocationHandler(...);
Class<?> proxyClass = Proxy.getProxyClass(Foo.class.getClassLoader(), Foo.class);
Foo f = (Foo) proxyClass.getConstructor(InvocationHandler.class).newInstance(handler);
```

或

```java
Foo f = (Foo) Proxy.newProxyInstance(Foo.class.getClassLoader(),new Class<?>[] { Foo.class },handler);
```

方法：
![Proxy](/Spring/Proxy.jpg)

#### 示例代码（中介租房）

- 要代理的接口：

```java
public interface Rent {

    /**
     * test
     */
    void rent();
}
```

- 被代理的真实角色（要实现被代理的接口）：

```java
public class Host implements Rent{

    public void rent() {
        System.out.println("房东出租");
    }
}
```

- 代理类：

```java
public class ProxyInvocationHandler implements InvocationHandler {

    //要被代理的真实角色
    private Object target;

    public void setTarget(Object target) {
        this.target = target;
    }

    //动态生成代理类
    public Object getProxy(){
        return Proxy.newProxyInstance(this.getClass().getClassLoader(),target.getClass().getInterfaces(),this);
    }

    //处理代理的实例，返回结果
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        see();
        System.out.println(method.getName());
        return method.invoke(target,args);
    }

    //自定义的方法
    public void see(){
        System.out.println("看房");
    }
}
```

- 入口方法：

```java
public class Client {
    public static void main(String[] args) {
        //要代理的真实角色
        Host host=new Host();
        //创建代理类对象
        ProxyInvocationHandler proxyInvocationHandler = new ProxyInvocationHandler();
        //设置要代理的对象
        proxyInvocationHandler.setTarget(host);
        //动态生成代理类
        Rent proxy= (Rent) proxyInvocationHandler.getProxy();
        //调用相关方法
        proxy.rent();
    }
}
```

## AOP

### AOP 在 Spring 中的作用

提供声明式事务，允许用户自定义切面。

- 横切关注点：跨越应用程序多个模块的方法或功能。如日志、安全、缓存、事务等。
- 切面：是一个类，横切关注点被模块化的特殊对象。
- 通知：切面必须要完成的工作，类中的一个方法。
- 目标：被通知对象。
- 代理：向目标对象应用通知之后创建的对象。
- 切入点：切面通知执行的地点的定义。
- 连接点：与切入点匹配的执行点。

### 使用 Spring 实现 AOP

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

## Mybatis

[Mybatis](/MyBatis.md)

### 相关依赖

```xml
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.21</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.5</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.9.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.5</version>
        </dependency>
```

### 整合Mybatis

要和 Spring 一起使用 MyBatis，需要在 Spring 应用上下文中定义至少两样东西：一个 **SqlSessionFactory** 和至少一个**数据映射器**类。

#### 使用 xml 配置整合

配置数据源：

```xml
<bean id="datasource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="url" value="jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC"/>
    <property name="username" value="root"/>
    <property name="password" value="123456"/>
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
</bean>
```

配置 SqlSessionFactory，对应的 class 为 **SqlSessionFactoryBean**：

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="datasource"/>
    <property name="configLocation" value="mybatis-config.xml"/>
    <property name="mapperLocations" value="classpath:mapper/UserMapper.xml"/>
</bean>
```

配置 mapper 接口：

```xml
<bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
    <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    <property name="mapperInterface" value="zch.mapper.UserMapper"/>
</bean>
```

调用代码：

```java
@Test
public void test() throws Exception {
    ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
    UserMapper userMapper = context.getBean("userMapper", UserMapper.class);
    List<User> users = userMapper.queryUsers();
    users.forEach(System.out::println);
}
```

::: tip
也可以不使用 MapperFactoryBean 来注册 mapper 接口，首先构造 mapper 接口的实现类，实现类中设置一个 sqlsession 对象，通过 sqlSession 实现增删改查，并在 Spring 配置中使用 set 方法注入。

还可以直接在 Spring 中配置 sqlSession，sqlSession 对应的 class 为 **sqlSessionTemplate**。

```xml
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
    <constructor-arg index="0" ref="sqlSessionFactory"/>
</bean>
<bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
    <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    <property name="sqlSessionTemplate" ref="sqlSession"/>
    <property name="mapperInterface" value="zch.mapper.UserMapper"/>
</bean>
```

:::

##### 关于SqlSessionFactoryBean

多数据库支持：设置 `databaseIdProvider` 属性。

```xml
<bean id="databaseIdProvider" class="org.apache.ibatis.mapping.VendorDatabaseIdProvider">
  <property name="properties">
    <props>
      <prop key="SQL Server">sqlserver</prop>
      <prop key="DB2">db2</prop>
      <prop key="Oracle">oracle</prop>
      <prop key="MySQL">mysql</prop>
    </props>
  </property>
</bean>
```

设置 `sqlSessionFactory` 属性：

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource" />
  <property name="mapperLocations" value="classpath*:sample/config/mappers/**/*.xml" />
  <property name="databaseIdProvider" ref="databaseIdProvider"/>
</bean>
```

通过 `configuration` 属性在没有对应的 MyBatis XML 配置文件的情况下，直接设置 `Configuration` 实例。

- 注意：`configLocation` 不能与 `configuration` 同时存在。

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="datasource"/>
<!--        <property name="configLocation" value="mybatis-config.xml"/>-->
    <property name="mapperLocations" value="classpath:mapper/UserMapper.xml"/>
    <property name="configuration">
        <bean class="org.apache.ibatis.session.Configuration">
            <!-- 配置标准日志 -->
            <property name="logImpl" value="org.apache.ibatis.logging.stdout.StdOutImpl"/>
            <!-- 开启驼峰命名转换 -->
            <property name="mapUnderscoreToCamelCase" value="true"/>
        </bean>
    </property>
</bean>
```

##### 关于SqlSession

- SqlSessionTemplate：

    SqlSessionTemplate 是线程安全的，是 SqlSession 的一个实现，可以被多个 DAO 或映射器所共享使用。

    ```xml
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
    <constructor-arg index="0" ref="sqlSessionFactory" />
    </bean>
    ```

    在 mapper 的实现类中实现注入：

    ```xml
    <bean id="userDao" class="org.mybatis.spring.sample.dao.UserDaoImpl">
    <property name="sqlSession" ref="sqlSession" />
    </bean>
    ```

- SqlSessionDaoSupport：

    SqlSessionDaoSupport 是一个抽象的支持类，用来为你提供 SqlSession。调用 getSqlSession() 方法你会得到一个 SqlSessionTemplate，之后可以用于执行 SQL 方法，就像下面这样:

    ```java
    public class UserDaoImpl extends SqlSessionDaoSupport implements UserDao {
    public User getUser(String userId) {
        return getSqlSession().selectOne("org.mybatis.spring.sample.mapper.UserMapper.getUser", userId);
    }
    }
    ```

    SqlSessionDaoSupport 需要通过属性设置一个 sqlSessionFactory 或 SqlSessionTemplate。如果两个属性都被设置了，那么 SqlSessionFactory 将被忽略。

    假设类 UserMapperImpl 是 SqlSessionDaoSupport 的子类，可以编写如下的 Spring 配置来执行设置：

    ```xml
    <bean id="userDao" class="org.mybatis.spring.sample.dao.UserDaoImpl">
    <property name="sqlSessionFactory" ref="sqlSessionFactory" />
    </bean>
    ```

#### 使用 Java 注解进行配置

Java Config文件：

```java
@Configuration
public class Config {

    @Bean("user")
    public User getUser(){
        return new User();
    }

    @Bean("userMapper")
    public MapperFactoryBean<UserMapper> getUserMapper() throws Exception {
        MapperFactoryBean<UserMapper> userMapperMapperFactoryBean = new MapperFactoryBean<>(UserMapper.class);
        userMapperMapperFactoryBean.setSqlSessionFactory(getSqlSessionFactory());
        return userMapperMapperFactoryBean;
    }

    @Bean("sqlSessionFactory")
    public SqlSessionFactory getSqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(getDataSource());
        return sqlSessionFactoryBean.getObject();
    }

    @Bean("dataSource")
    public DriverManagerDataSource getDataSource(){
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC");
        driverManagerDataSource.setUsername("root");
        driverManagerDataSource.setPassword("123456");
        return driverManagerDataSource;
    }
}
```

mapper接口：

```java
public interface UserMapper {

    /**
     * get users
     * @return userList
     */
    @Select("select * from mydata.usertable")
    List<User> getUsers();
}
```

```java
@Test
public void test(){
    AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    UserMapper userMapper = annotationConfigApplicationContext.getBean("userMapper", UserMapper.class);
    List<User> users = userMapper.getUsers();
    users.forEach(System.out::println);
}
```

#### 总结

1. 配置数据源
    - 数据源对应的Java Class为：DriverManagerDataSource
    - 通过注解配置时，要注意返回的类型是                DriverManagerDataSource
2. 配置SqlSessionFactory
    - 对应的Java Class为：SqlSessionFactoryBean
    通过注解配置时同样返回SqlSessionFactoryBean的getObject()
3. 直接利用SqlSessionFactory配置mapper
    - 对应的Java Class为：MapperFactoryBean
4. 或者在mapper接口的实现类中进行SqlSession的配置
    - 直接使用SqlSession实现CRUD，mapper注入SqlSessionTemplate，在SqlSessionTemplate中注入SqlSessionFactory
    - 通过继承SqlSessionDaoSupport，注入SqlSessionFactory

## 事务

### 声明式事务：AOP

MyBatis-Spring 借助了 Spring 中的 DataSourceTransactionManager 来实现事务管理。

- 配置对应的 Java Class为：DataSourceTransactionManager。

    - xml 方式方式配置：

        ```xml
        <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <constructor-arg ref="dataSource" />
        </bean>
        ```

    - Java 方式：

        ```java
        @Configuration
        public class DataSourceConfig {
            @Bean
            public DataSourceTransactionManager transactionManager() {
                return new DataSourceTransactionManager(dataSource());
            }
        }
        ```

::: warning 注意
为事务管理器指定的 DataSource 必须和用来创建 SqlSessionFactoryBean 的是同一个数据源，否则事务管理器就无法工作了。
:::

#### 纯Java Config配置实现事务

要开启事务，必须在配置类上使用 `@EnableTransactionManagement` 注解开启事务：

```java
@Configuration
@EnableTransactionManagement
public class Config {

    @Bean("user")
    public User getUser(){
        return new User();
    }

    @Bean("userMapper")
    public MapperFactoryBean<UserMapper> getUserMapper() throws Exception {
        MapperFactoryBean<UserMapper> userMapperMapperFactoryBean = new MapperFactoryBean<>(UserMapper.class);
        userMapperMapperFactoryBean.setSqlSessionFactory(getSqlSessionFactory());
        return userMapperMapperFactoryBean;
    }

    @Bean("sqlSessionFactory")
    public SqlSessionFactory getSqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(getDataSource());
        return sqlSessionFactoryBean.getObject();
    }
    @Bean("dataSource")
    public DriverManagerDataSource getDataSource(){
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC");
        driverManagerDataSource.setUsername("root");
        driverManagerDataSource.setPassword("123456");
        return driverManagerDataSource;
    }
    // 配置事务管理器
    @Bean
    public DataSourceTransactionManager transactionManager() {
        return new DataSourceTransactionManager(getDataSource());
    }
    @Bean("userMapperImpl")
    public UserMapper getUserMapperImpl() throws Exception {
        UserMapperImpl userMapper = new UserMapperImpl();
        userMapper.setSqlSessionFactory(getSqlSessionFactory());
        return userMapper;
    }
}
```

在要开启事务的类或方法上添加 `@Transactional` 注解：

```java
@Transactional(rollbackFor = RuntimeException.class,propagation = Propagation.REQUIRED)
public interface UserMapper {

    /**
     * get users
     * @return userList
     */
    @Select("select * from mydata.usertable")
    List<User> getUsers();

    /**
     * add user
     * @param user user
     */
    @Insert("insert into mydata.usertable(id,username,password) values(#{id},#{username},#{password})")
    void addUser(User user);

    /**
     * delete user
     * @param id id
     */
    @Delete("delete from mydata.usertable where id=#{id}")
    void deleteUser(int id);

    @Update("update usertable set password=#{password} where id=31")
    void update(String password);

    void test()throws RuntimeException;
}
```

mapperImpl.java：

```java
public class UserMapperImpl extends SqlSessionDaoSupport implements UserMapper{
    @Override
    public List<User> getUsers() {
        return getSqlSession().getMapper(UserMapper.class).getUsers();
    }

    @Override
    public void addUser(User user) {
        getSqlSession().getMapper(UserMapper.class).addUser(user);
    }

    @Override
    public void deleteUser(int id) {
        getSqlSession().getMapper(UserMapper.class).deleteUser(id);
    }

    @Override
    public void update(String password) {
        getSqlSession().getMapper(UserMapper.class).update(password);
    }

    @Override
    public void test(){
        update("www");
        throw new RuntimeException("手动异常");
    }
}
```

测试代码：

```java
AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Config.class);
    UserMapper userMapperImpl = annotationConfigApplicationContext.getBean("userMapperImpl", UserMapper.class);
    userMapperImpl.test();
```

结果：数据库未进行任何修改。

##### 关于 @Transactional

- 作用于类：当把 `@Transactional` 注解放在类上时，表示所有该类的public方法都配置相同的事务属性信息。
- 作用于方法：当类配置了 `@Transactional`，方法也配置了 `@Transactional`，方法的事务会覆盖类的事务配置信息。
- 作用于接口：不推荐这种使用方法，因为一旦标注在 Interface 上并且配置了 Spring AOP 使用 CGLib 动态代理，将会导致 `@Transactional` 注解失效。

##### @Transactional 失效的几种情况

- `@Transactional` 应用在非 public 修饰的方法上

::: warning 注意
protected、private 修饰的方法上使用 `@Transactional` 注解，虽然事务无效，但不会有任何报错，这是我们很容犯错的一点。
:::

- `@Transactional` 注解属性 propagation 设置错误。
- `@Transactional` 注解属性 rollbackFor 设置错误。
- 同一个类中方法调用，导致 `@Transactional` 失效。

::: tip
比如有一个类 Test，它的一个方法 A，A 再调用本类的方法 B（不论方法 B 是用 public 还是 private 修饰），但方法 A 没有声明注解事务，而 B 方法有。则外部调用方法 A 之后，方法 B 的事务是不会起作用的。这也是经常犯错误的一个地方。
:::

- 异常被你的 catch “吃了”导致 `@Transactional` 失效。
- 数据库引擎不支持事务。

#### xml 配置实现事务

Spring xml 配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd
http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd
http://www.springframework.org/schema/tx
        https://www.springframework.org/schema/tx/spring-tx.xsd">
    <context:annotation-config/>
    <bean id="user" class="zch.pojo.User"/>
    <bean id="datasource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="url" value="jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    </bean>
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="datasource"/>
<!--        <property name="configLocation" value="mybatis-config.xml"/>-->
        <property name="mapperLocations" value="classpath:mapper/UserMapper.xml"/>
        <property name="configuration">
            <bean class="org.apache.ibatis.session.Configuration">
                <property name="logImpl" value="org.apache.ibatis.logging.stdout.StdOutImpl"/>
            </bean>
        </property>
    </bean>
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>
    <bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
        <property name="sqlSessionTemplate" ref="sqlSession"/>
        <property name="mapperInterface" value="zch.mapper.UserMapper"/>
    </bean>
    <bean id="userMapperImpl" class="zch.mapper.UserMapperImpl">
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="datasource"/>
    </bean>
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="*" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>

    <aop:config>
        <aop:pointcut id="txPointCut" expression="execution(* zch.mapper.UserMapperImpl.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointCut"/>
    </aop:config>
</beans>
```
