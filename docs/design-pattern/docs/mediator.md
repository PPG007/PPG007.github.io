# 中介者模式（调停者模式）

## 定义

用一个中介对象封装一系列的对象交互，中介者使各对象不需要显式地相互作用，从而实现解耦合。

## 三部分

- Mediator 抽象中介者角色。
- Concrete Mediator 具体中介者角色。
- Colleague 同事角色。

## 示例

抽象中介者：

```java
public abstract class AbstractMediator {

    protected final List<AbstractColleague> colleagueList=new LinkedList<>();

    public void addColleague(AbstractColleague colleague){
        this.colleagueList.add(colleague);
    }


    public List<AbstractColleague> getColleagueList() {
        return colleagueList;
    }

    protected abstract void process(Class<? extends AbstractColleague> colleague,Object ...args) throws Exception;

}
```

底层抽象同事类：

```java
public abstract class AbstractColleague {

    protected AbstractMediator mediator;

    public AbstractColleague(AbstractMediator mediator) {
        this.mediator = mediator;
    }
}
```

抽象同事类的两个抽象子类，分别具有完成一个功能的方法：

```java
public abstract class AbstractInColleague extends AbstractColleague{

    public AbstractInColleague(AbstractMediator mediator) {
        super(mediator);
    }

    public abstract void in(int number);
}
```

```java
public abstract class AbstractOutColleague extends AbstractColleague{
    public AbstractOutColleague(AbstractMediator mediator) {
        super(mediator);
    }

    public abstract void out(int number);
}
```

实际中介者：

```java
public class Mediator extends AbstractMediator{
    @Override
    protected void process(Class<? extends AbstractColleague> colleague,Object ...args) throws Exception {
        List<AbstractColleague> colleagueList = this.colleagueList;
        boolean success=false;
        for (AbstractColleague abstractColleague : colleagueList) {
            if (abstractColleague.getClass().getName().equals(colleague.getName())){
                if (AbstractInColleague.class.isAssignableFrom(colleague)){
                    ((AbstractInColleague) abstractColleague).in(((int) args[0]));
                    success=true;
                    break;
                }else if (AbstractOutColleague.class.isAssignableFrom(colleague)){
                    ((AbstractOutColleague) abstractColleague).out(((int) args[0]));
                    success=true;
                    break;
                }
            }
        }
        if (!success) {
            throw new Exception("调用失败");
        }

    }
}
```

实际同事类：

```java
public class Colleague1 extends AbstractInColleague{

    public Colleague1(AbstractMediator mediator) {
        super(mediator);
        this.mediator.addColleague(this);
    }

    @Override
    public void in(int number) {
        System.out.println("Colleague1正在处理自己的事务，库存增加:"+number);
    }

    public void depMethod(int number) throws Exception {
        System.out.println("Colleague1正在申请减少库存:"+number);

        this.mediator.process(Colleague2.class,number);
    }
}
```

```java
public class Colleague2 extends AbstractOutColleague{

    public Colleague2(AbstractMediator mediator) {
        super(mediator);
        this.mediator.addColleague(this);
    }

    @Override
    public void out(int number) {
        System.out.println("Colleague2正在处理自己的事务，库存减少:"+number);
    }

    public void depMethod(int number) throws Exception {
        System.out.println("Colleague2申请增加库存:"+number);
        this.mediator.process(Colleague1.class,number);
    }
}
```

启动类：

```java
public class Client {

    public static void main(String[] args) throws Exception {
        Mediator mediator = new Mediator();
        Colleague1 colleague1 = new Colleague1(mediator);
        Colleague2 colleague2 = new Colleague2(mediator);
        colleague1.depMethod(1);
        colleague2.depMethod(10);
    }
}
```

## 中介模式的优点

减少类间的依赖，把原有的一对多的依赖变成了一对一的依赖，同事类只依赖中介者，减少了依赖，降低了耦合度。

## 中介模式的缺点

中介者可能会膨胀的很大，而且逻辑复杂，同事类越多，中介者就越复杂。

## 中介者模式的使用场景

::: tip
类间的依赖关系是必然存在的。
:::

中介者模式适用于多个对象之间紧密耦合的情况，例如类图中出现了网状结构时，可以使用中介者模式进行解耦。
