# Bean 的自动装配

- 自动装配是 Spring 满足 bean 依赖的一种方式！
- Spring 会在上下文中自动寻找，并自动给 bean 装配属性。
- Spring 中三种装配方式：
  - 在 xml 中显式的配置。
  - 在 Java 中显式的配置。
  - 隐式的自动装配。

## ByName 自动装配

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

## ByType 自动装配

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

## 注解实现自动装配

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

### @Autowired 注解实现自动装配

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

### @Resource 注解实现自动装配

```java
    @Resource
    private Dog dog;
```

同样允许使用指定的 bean。

```java
    @Resource(name="dag")
    private Dog dog;
```

### @Resource 和 @Autowired 的区别

- `@Autowired` 通过 ByType 方式实现，而且要求被装配的对象必须存在于 IOC 容器。
- `@Resource` 默认通过 ByName 进行，若无法实现，则通过 ByType 实现，两种方式均不行则报错。
- `@Resource` 是 Java 原生注解。
