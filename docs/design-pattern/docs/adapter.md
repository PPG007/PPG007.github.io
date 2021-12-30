# 适配器模式（变压器模式、包装模式 Wrapper）

## 定义

将一个类的接口变换成客户端所期待的另一种接口，从而使原本因接口不匹配而无法工作在一起的两个类能够在一起工作。

## 三个角色

- Target 目标角色：该角色定义把其他类转换为何种接口，即期望接口。
- Adaptee 源角色：被转换的角色，是已经存在的、运行良好的类或对象。
- Adapter 适配器角色：将源角色转换为目标角色，通过继承或类关联的方式实现。

## 示例

目标角色：

```java
public interface Target {

    /**
     * 所期待的方法
     */
    void request();
}
```

源角色：

```java
public class Adaptee {

    public void specificRequest(){
        System.out.println("源角色");
    }
}
```

目标角色实现类：

```java
public class ConcreteTarget implements Target{
    @Override
    public void request() {
        System.out.println("目标角色实现类");
    }
}
```

适配器角色：

```java
public class Adapter extends Adaptee implements Target{
    @Override
    public void request() {
        super.specificRequest();
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {

        //原有的业务逻辑
        new ConcreteTarget().request();

        //增加适配器后
        Target target=new Adapter();
        target.request();
    }
}
```

## 适配器模式的优点

- 适配器模式可以让两个没有任何关系的类在一起运行。
- 增加了类的透明性：访问的是 Target 目标角色，实际执行的是源角色。
- 提高了类的复用度。
- 灵活性好。

## 适配器模式的使用场景

有动机修改一个已经投入生产的接口时。

## 适配器模式的注意事项

不应当在详细设计阶段考虑适配器模式，适配器模式不应该解决开发阶段中的问题。

## 适配器模式的扩展

如果要适配的功能中接口不止一个可以修改适配器类，只实现目标角色接口，由上面的继承源角色改为持有要适配的多个接口的多个实现类对象，通过对象层次的关联实现，称为*对象适配器*，通过继承进行适配称为*类适配器*。

类适配器是*类间继承*，对象适配器是*对象的合成关系*。
