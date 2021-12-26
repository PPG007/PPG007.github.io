---
prev:
  text: 首页
  link: /spring
---

# Spring 组成

![Spring组成](/Spring/spring模块.jpg)

::: tip
Spring 核心是控制反转 IOC 和面向切面 AOP。
:::

## Spring Core 核心容器

核心容器提供 Spring 框架的基本功能。Spring 以 `bean` 的方式组织和管理 Java 应用中的各个组件及其关系。Spring 使用 BeanFactory 来产生和管理 Bean，它是工厂模式的实现。BeanFactory 使用 `控制反转IOC` 模式将应用的配置和依赖性规范与实际的应用程序代码分开。

## Spring Context 上下文

Spring 上下文是一个配置文件，向 Spring 框架提供上下文信息。Spring 上下文包括企业服务，如 JNDI、EJB、电子邮件、国际化、校验和调度功能。

## Spring AOP 面向切面编程

通过配置管理特性，Spring AOP 模块直接将面向方面的编程功能集成到了 Spring 框架中。所以，可以很容易地使 Spring 框架管理的任何对象支持 AOP。Spring AOP 模块为基于 Spring 的应用程序中的对象提供了事务管理服务。通过使用 Spring AOP，不用依赖 EJB 组件，就可以将声明性事务管理集成到应用程序中。

## Spring DAO

JDBC、DAO 的抽象层提供了有意义的异常层次结构，可用该结构来管理异常处理，和不同数据库供应商所抛出的错误信息。异常层次结构简化了错误处理，并且极大的降低了需要编写的代码数量，比如打开和关闭链接。

## Spring ORM

Spring 框架插入了若干个 ORM 框架，从而提供了 ORM 对象的关系工具，其中包括了 Hibernate、JDO 和 IBatis SQL Map 等，所有这些都遵从 Spring 的通用事务和 DAO 异常层次结构。

## Spring Web

Web 上下文模块建立在应用程序上下文模块之上，为基于 web 的应用程序提供了上下文。所以 Spring 框架支持与 Struts 集成，web 模块还简化了处理多部分请求以及将请求参数绑定到域对象的工作。

## Spring Web MVC

MVC 框架是一个全功能的构建 Web 应用程序的 MVC 实现。通过策略接口，MVC 框架变成为高度可配置的。MVC 容纳了大量视图技术，其中包括 JSP、POI 等，模型来有 JavaBean 来构成，存放于 M 当中，而视图是一个接口，负责实现模型，控制器表示逻辑代码Spring 框架的功能可以用在任何 J2EE 服务器当中，大多数功能也适用于不受管理的环境。Spring 的核心要点就是支持不绑定到特定 J2EE 服务的可重用业务和数据的访问的对象，毫无疑问这样的对象可以在不同的 J2EE 环境，独立应用程序和测试环境之间重用。
