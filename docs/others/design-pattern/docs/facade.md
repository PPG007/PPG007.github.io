# 门面模式（外观模式）

## 定义

要求一个子系统的外部与其内部的通信必须通过一个统一的对象进行。门面模式提供一个高层次的接口，使得子系统更易于使用。

## 角色

- Facade 门面角色：客户端调用此角色的方法，此角色没有实际的业务逻辑，只是一个委托类。
- subsystem 子系统角色：可以同时有一个或者多个子系统。每一个子系统都是一个类的集合。

## 示例

子系统：

```java
public class Light {
    public void on(){
        System.out.println("打开了灯....");
    }

    public void off(){
        System.out.println("关闭了灯....");
    }
}
```

```java
public class Television {
    public void on(){
        System.out.println("打开了电视....");
    }

    public void off(){
        System.out.println("关闭了电视....");
    }
}
```

```java
public class AirCondition {
    public void on(){
        System.out.println("打开了空调....");
    }

    public void off(){
        System.out.println("关闭了空调....");
    }
}
```

门面类：

```java
public class Facade{

    Light light;
    Television television;
    AirCondition aircondition;

    public Facade(Light light,Television television,AirCondition aircondition){
        this.light = light;
        this.television  = television ;
        this.aircondition =aircondition;

    }
    public void on(){
        System.out.println("起床了");
        light.on();
        television.on();
        aircondition.on();
    }

    public void off(){
        System.out.println("睡觉了");
        light.off();
        television.off();
        aircondition.off();
    }

}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {

        Light light = new Light();
        Television television = new Television();
        AirCondition aircondition = new AirCondition();

        //传参
        Facade facade = new Facade(light,television,aircondition);

        //客户端直接与外观对象进行交互
        facade.on();

        facade.off();

    }
}
```

## 门面模式的优点

- 减少系统的相互依赖：不暴露子系统。
- 提高灵活性。
- 提高访问安全性：只有门面上使用的方法才能被访问。

## 门面模式的缺点

不符合开闭原则。

## 门面模式的使用场景

- 为一个复杂的模块或子系统提供一个供外界访问的接口。
- 子系统相对独立。
- 预防低水平人员带来的风险扩散。

## 门面模式的注意事项

一个子系统可以有多个门面。

多门面情况：

- 门面过于庞大。
- 子系统可以提供不同访问路径。
- 门面不参与子系统内的业务逻辑

上述示例中，门面类中的方法完成了子系统方法的组合，必须通过门面才能完成开关动作，也就是子系统需要依赖门面，违背了单一职责原则。

修改上述代码，增加封装类完成开关动作：

```java
public class Home {

    Light light;
    Television television;
    AirCondition aircondition;

    public Home(Light light,Television television,AirCondition aircondition){
        this.light = light;
        this.television  = television ;
        this.aircondition =aircondition;

    }

    public void on(){
        System.out.println("起床了");
        light.on();
        television.on();
        aircondition.on();
    }

    public void off(){
        System.out.println("睡觉了");
        light.off();
        television.off();
        aircondition.off();
    }
}
```

然后门面类只负责委托这个封装类即可。

::: tip
门面角色应该稳定、不经常变化，业务逻辑的变化封装在了子系统中，对外门面保持不变。
:::
