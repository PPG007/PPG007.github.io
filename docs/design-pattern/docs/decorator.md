# 装饰器模式

## 定义

动态的给一个对象添加一些额外的职责，就增加功能来说，装饰器模式比生成子类更加灵活.

## 角色

- Component抽象构件：定义最原始的对象，未经装饰。
- ConcreteComponent 具体构件：最核心、最原始、最基本的接口或抽象类的实现，也就是被装饰对象。
- Decorator装饰角色：一般是一个抽象类， 继承抽象构件，且持有一个抽象构件的对象引用。
- 具体装饰角色：把具体构件进行装饰。

## 示例

抽象构件类：

```java
public abstract class Component {

    /**
     * 操作
     */
    public abstract void operation();
}
```

具体构件类：

```java
public class ConcreteComponent extends Component{
    @Override
    public void operation() {
        System.out.println("具体的操作");
    }
}
```

抽象装饰器类：

```java
public abstract class Decorator extends Component{

    private Component component=null;

    public Decorator(Component component) {
        this.component = component;
    }

    @Override
    public void operation() {
        if (component!=null){
            component.operation();
        }
    }
}
```

具体装饰器类：

```java
public class ConcreteDecoratorA extends Decorator{
    public ConcreteDecoratorA(Component component) {
        super(component);
    }
    private void methodA(){
        System.out.println("methodA");
    }

    @Override
    public void operation() {
        this.methodA();
        super.operation();
    }
}
```

```java
public class ConcreteDecoratorB extends Decorator{
    public ConcreteDecoratorB(Component component) {
        super(component);
    }
    private void methodB(){
        System.out.println("methodB");
    }

    @Override
    public void operation() {
        super.operation();
        this.methodB();
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        Component component=new ConcreteComponent();
        component=new ConcreteDecoratorA(component);
        component=new ConcreteDecoratorB(component);
        component.operation();
    }
}
```

首先创建了一个具体构件类对象，将此对象传入第一个装饰器的构造函数中，并将构件的引用指向构造器返回的第一个装饰器实例对象，此时 component 对象是经过一个装饰的装饰类对象，持有一个原生对象引用，再次将装饰后的对象传入第二个装饰器的构造器此时 component 指向的是经过两次装饰的装饰器对象，持有一个装饰器 A（相当于套娃），最后执行第二个装饰器的 operation 方法，首先执行父类的 operation 方法，此时装饰器 B 中的 component 是装饰器A实例，所以又去执行装饰器 A 的 operation 方法，然后在 A 中执行父类的 operation 方法，装饰器 A 的 component 是原始构件，所以此时执行了原始构件的 operation 方法，此时再次回到装饰器B中，再执行 B 中的 methodB 方法。

::: tip 执行顺序
methodA、原始构件的 operation 方法、methodB。
:::

## 装饰器模式的优点

- 装饰类和被装饰类可以独立发展，不会耦合。
- 装饰模式是继承的替代方案。
- 装饰模式可以动态的扩展一个实现类的功能。

## 装饰器模式的缺点

多层装饰比较复杂。

## 装饰器模式使用场景

- 需要扩展一个类的功能，或者给一个类增加附加功能。
- 需要动态的给一个对象增加功能，这些功能可以动态的撤销。
- 需要为一批的兄弟类进行改装或加装功能。
