# 访问者模式

## 定义

封装一些作用域某种数据结构的各元素的操作，它可以在不改变数据结构的前提下定义作用于这些元素的新的操作。

## 角色

- Visitor 抽象访问者：抽象类或者接口，声明访问者可以访问那些元素。
- ConcreteVisitor 具体访问者。
- Element抽象元素：接口或抽象类，声明接收哪一类访问者访问。
- ConcreteElement 具体元素：实现 accept 方法，接受一个访问者。
- ObjectStruture 结构对象：元素生产者，一般容纳在多个不同类、不同接口的容器，如 List 等，项目中一般很少抽象出这个角色。

## 示例

抽象访问者：

```java
public interface IVisitor {

    void visit(ConcreteElementA elementA);

    void visit(ConcreteElementB elementB);

}
```

具体访问者：

```java
public class Visitor implements IVisitor{
    @Override
    public void visit(ConcreteElementA elementA) {
        elementA.process();
    }

    @Override
    public void visit(ConcreteElementB elementB) {
        elementB.process();
    }
}
```

抽象元素：

```java
public abstract class Element {

    private final String id;

    public abstract void process();

    public abstract void accept(IVisitor visitor);

    public Element(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}
```

具体元素：

```java
public class ConcreteElementA extends Element{
    public ConcreteElementA(String id) {
        super(id);
    }

    @Override
    public void process() {
        System.out.println(this.getClass().getName());
        System.out.println(super.getId());
        System.out.println();
    }

    @Override
    public void accept(IVisitor visitor) {
        visitor.visit(this);
    }
}
```

```java
public class ConcreteElementB extends Element{
    public ConcreteElementB(String id) {
        super(id);
    }

    @Override
    public void process() {
        System.out.println(this.getClass().getName());
        System.out.println(super.getId());
        System.out.println();
    }

    @Override
    public void accept(IVisitor visitor) {
        visitor.visit(this);
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        for (Element element : elements(9)) {
            element.accept(new Visitor());
        }
    }

    private static LinkedList<Element> elements(int n){
        LinkedList<Element> elements = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            elements.add(new ConcreteElementA(UUID.randomUUID().toString()));
            elements.add(new ConcreteElementB(UUID.randomUUID().toString()));
        }
        return elements;
    }
}
```

## 访问者模式的优点

- 符合单一职责原则：元素角色负责数据加载，访问者角色负责数据的展示。
- 扩展性好： 如果还要增加对数据的操作，直接在 Visitor 中添加一个方法。
- 灵活性高：对不同的元素可以将不同的操作封装在 Visitor 中。

## 访问者模式的缺点

- 具体元素对访问者公布细节，违背了迪米特法则。
- 具体元素变更比较困难：修改具体元素的成员变量。
- 违背了依赖倒转原则。

## 访问者模式的使用场景

- 一个对象结构包含很多类对象，它们有不同的接口，需要为这些对象进行一些依赖具体类的操作，迭代器模式无法完成。
- 需要对一个对象结构中的对象进行很多不同并且不相关的操作，且不想这些操作污染这些对象的类。

业务要求要遍历多个不同的对象时考虑访问者模式。

访问者模式是对迭代器模式的扩充。

访问者模式还能充当拦截器。

## 访问者模式的扩展

### 统计功能

在 IVisitor 接口中定义一个用于统计的方法，然后在实现类中的每个访问方法中将要统计的属性（例如求和）记录在一个成员变量中，这个统计的方法将这个成员变量返回，这样就可以统计不同对象、甚至可以使用不同的规则例如加权等统计方式。

### 多访问者

定义多个访问者，这些访问者可能存在不同的逻辑，这样我们可以为每个功能抽象一个接口，这些接口都继承 IVisitor 接口，这样通过访问不同的访问者就可以达到不同的目的。

### 双分派

::: tip
单分派：

单分派语言处理一个操作是根据请求者的名称和接收到的参数决定的，在 Java 中有静态绑定和动态绑定，依据重载和重写实现。

双分派：

得到执行的操作决定于请求的种类和两个接收者的类型，是多分派的一个特例，Java 是支持双分派的单分派语言。
:::

场景：演员演戏。

定义演员抽象类：

```java
public abstract class AbstractActor {

    public void act(Role role){
        System.out.println("扮演任意角色");
    }

    public void act(KungFuRoleImpl role){
        System.out.println("功夫角色");
    }
}
```

定义年轻演员类：

```java
public class YoungActor extends AbstractActor{
    @Override
    public void act(KungFuRoleImpl role) {
        System.out.println("年轻演员扮演功夫角色");
    }
}
```

定义角色接口及实现类：

```java
public interface Role {

}
```

```java
public class KungFuRoleImpl implements Role{
}
```

启动类如下：

```java
public class Client {
    public static void main(String[] args) {
        AbstractActor actor = new YoungActor();
        Role role = new KungFuRoleImpl();
        actor.act(role);
        actor.act(new KungFuRoleImpl());
    }
}
```

输出为：

```sh
扮演任意角色
年轻演员扮演功夫角色
```

原因分析：

role 表面类型是 Role 接口抽象类，编译时就由此决定了 act 调用的是哪个重载，，第二个 act 是由实际类型决定的，属于动态绑定。

下面使用访问者模式来解决这个问题。

修改角色接口，增加 accept 方法：

```java
public interface Role {
    void accept(AbstractActor abstractActor);
}
```

实现这个方法：

```java
public class KungFuRoleImpl implements Role {
    @Override
    public void accept(AbstractActor abstractActor) {
        abstractActor.act( this);
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        AbstractActor actor = new YoungActor();
        Role role = new KungFuRoleImpl();
        role.accept(actor);
        new KungFuRoleImpl().accept(actor);
    }
}
```

这样第一次调用就不会调用父类的方法。

不管演员类和角色类怎么变化，都能找到期望的方法执行，就是双分派。
