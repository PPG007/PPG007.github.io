# DI（依赖注入）

## 构造器注入

[构造器注入](/Spring.md#ioc-创建对象的方式)

## set 方式注入

- 依赖：bean 对象的创建依赖于容器。
- 注入：bean 对象中的所有属性，由容器来注入。

### 例子

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

## 拓展方式注入

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
