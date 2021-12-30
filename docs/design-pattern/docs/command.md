# 命令模式

## 定义

将一个请求封装为一个对象，从而使用不同的请求把客户端参数化，对请求排队或者记录请求日志，可以提供命令的撤销和恢复功能。

## 角色

- Receiver 接收者：干活的角色，命令传递到此处被执行。
- Command 命令角色：需要执行的所有命令都在这里声明。
- Invoker 调用者角色：接收到命令并执行命令。

## 示例

抽象命令类：可以在这里将各接收者直接作为成员变量。

```java
public abstract class AbstractCommand {
    public abstract void execute();
}
```

抽象接收者类：

```java
public abstract class AbstractReceiver {
    public abstract void process();
}
```

上述抽象类的实现类：

```java
public class Command1 extends AbstractCommand{

    private final AbstractReceiver receiver;

    public Command1(AbstractReceiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void execute() {
        this.receiver.process();
    }
}
```

```java
public class Command2 extends AbstractCommand{

    private final AbstractReceiver receiver;

    public Command2(AbstractReceiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void execute() {
        this.receiver.process();
    }
}
```

```java
public class Receiver1 extends AbstractReceiver{
    @Override
    public void process() {
        System.out.println("买瓶水");
    }
}
```

```java
public class Receiver2 extends AbstractReceiver{
    @Override
    public void process() {
        System.out.println("买块肉");
    }
}
```

Invoker 类：

```java
public class Invoker {
    private AbstractCommand command;

    public void setCommand(AbstractCommand command) {
        this.command = command;
    }

    public void execute(){
        this.command.execute();
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        Invoker invoker = new Invoker();
        invoker.setCommand(new Command1(new Receiver1()));
        invoker.execute();
        invoker.setCommand(new Command2(new Receiver2()));
        invoker.execute();
    }
}
```

## 命令模式的优点

- 类间解耦：调用者角色与接收者角色之间没有任何依赖关系。
- 可扩展性：Command 子类可以非常容易的扩展，调用者 Invoker 与 Client 不产生严重的耦合。
- 命令模式结合其他模式会更优秀：结合责任链模式实现命令族解析任务；结合模板方法模式，可以减少 Command 子类的膨胀问题。

## 命令模式的缺点

命令数量和 Command 子类数量一对一，容易出现类爆炸。

## 命令模式使用场景

认为是命令的地方都可以。

## 命令模式的扩展

### 增加需求

要增加一个命令的工作量，只要修改 execute 方法即可。

### 反悔问题

1. 结合备忘录模式还原最后状态，该方法适合接收者为状态的变更情况，而不适合事件处理。
2. 增加新命令，实现事件的回滚。
