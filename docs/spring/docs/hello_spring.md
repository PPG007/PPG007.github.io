# HelloSpring

## 最简单的Spring配置

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

## 修改第二部分中的代码

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
