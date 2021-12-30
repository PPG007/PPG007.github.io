# 状态模式

## 定义

当一个对象内在状态改变时允许其改变行为，这个对象看起来像改变了其类。

核心是**封装**，状态的变更引起行为的变更，从外部看起来就好像这个对象对应的类发生了改变一样。

## 角色

- State 抽象状态角色：接口或抽象类，负责对象状态定义，并且封装环境角色以实现状态切换。
- ConcreteState 具体状态角色：每一个具体状态必须完成两个职责，本状态的行为管理以及趋向状态处理，即本状态要做的事和如何过渡到其他状态。
- Context 环境角色：定义客户端需要的接口，并且负责具体状态的切换。

## 示例

抽象状态角色：

```java
public abstract class State {

    protected Context context;

    public void setContext(Context context) {
        this.context = context;
    }

    /**
     * 行为1
     */
    public abstract void handle1();

    /**
     * 行为2
     */
    public abstract void handle2();
}
```

抽象环境角色：

```java
public class Context{

    public final static State STATE_1=new ConcreteState1();

    public final static State STATE_2=new ConcreteState2();

    private State currentState;

    public State getCurrentState() {
        return currentState;
    }

    public void setCurrentState(State currentState) {
        this.currentState = currentState;
        //每个状态都绑定当前环境对象
        this.currentState.setContext(this);
    }

    public void handle1() {
        this.currentState.handle1();
    }

    public void handle2() {
        this.currentState.handle2();
    }
}
```

具体状态角色：

```java
public class ConcreteState1 extends State{
    @Override
    public void handle1() {
        System.out.println(this.getClass().getName()+"is handling");
    }

    @Override
    public void handle2() {
        this.context.setCurrentState(Context.STATE_2);
        this.context.handle2();
    }
}
```

```java
public class ConcreteState2 extends State{
    @Override
    public void handle1() {
        this.context.setCurrentState(Context.STATE_1);
        this.context.handle1();
    }

    @Override
    public void handle2() {
        System.out.println(this.getClass().getName()+"is handling");
    }
}
```

在调用自己无法完成的方法时，进行状态切换并调用可用实现。

启动类：

```java
public class Client {
    public static void main(String[] args) {
        Context context = new Context();
        context.setCurrentState(new ConcreteState1());
        context.handle1();
        context.handle2();
    }
}
```

## 状态模式的优点

- 结构清晰，避免了过多的分支语句。
- 遵循设计原则，很好的体现了开闭原则和单一职责原则。
- 封装性好，状态变换发生在类的内部。

## 状态模式的缺点

子类太多容易出现类膨胀。

## 状态模式的使用场景

- 行为随状态改变而改变的场景,例如权限设计。
- 条件、分支判断语句的替代者。

## 状态模式注意事项

使用时对象的状态最好不要超过五个。
