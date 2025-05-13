# 观察者模式（发布订阅模式）

## 定义

定义对象间一种一对多的依赖关系，是的每当一个对象改变状态，则所有依赖于它的对象都会得到通知并被自动更新。

## 角色

- Subject 被观察者：定义被观察者必须实现的职责，必须能够动态的增加、取消观察者、通知观察者。
- Observer 观察者：观察者接收到消息后就进行更新操作。
- ConcreteSubject 具体的被观察者。
- ConcreteObserver 具体的观察者。

## 示例

公司监视汇率。

抽象观察者（公司）：

```java
public interface Company {
    /**
     * 做出的反应
     * @param number 变化率
     */
    void response(int number);
}
```

抽象被观察者（汇率）：

```java
public abstract class Rate {
    protected List<Company> companies = new ArrayList<>();
    /**
     * 增加观察者方法
     */
    public void add(Company company) {
        companies.add(company);
    }

    /**
     * 删除观察者方法
     */
    public void remove(Company company) {
        companies.remove(company);
    }

    /**
     * 变化
     * @param number 变化率
     */
    public abstract void change(int number);
}
```

观察者的两个实现类，进口公司、出口公司：

```java
class ExportCompany implements Company {
    @Override
    public void response(int number) {
        if (number > 0) {
            System.out.println("人民币汇率升值" + number + "个基点，降低了出口产品收入，降低了出口公司的销售利润率。");
        } else if (number < 0) {
            System.out.println("人民币汇率贬值" + (-number) + "个基点，提升了出口产品收入，提升了出口公司的销售利润率。");
        }
    }
}
```

```java
class ImportCompany implements Company {
    @Override
    public void response(int number) {
        if (number > 0) {
            System.out.println("人民币汇率升值" + number + "个基点，降低了进口产品成本，提升了进口公司利润率。");
        } else if (number < 0) {
            System.out.println("人民币汇率贬值" + (-number) + "个基点，提升了进口产品成本，降低了进口公司利润率。");
        }
    }
}
```

具体的被观察者，人民币汇率：

```java
public class RmbRate extends Rate{
    @Override
    public void change(int number) {
        for (Company obs : companies) {
            ((Company) obs).response(number);
        }
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        Rate rate = new RmbRate();
        Company watcher1 = new ImportCompany();
        Company watcher2 = new ExportCompany();
        rate.add(watcher1);
        rate.add(watcher2);
        rate.change(10);
        rate.change(-9);
    }
}
```

## 观察者模式的优点

- 观察者和被观察者之间是抽象耦合。
- 建立了一套触发机制，实现了触发链条。

## 观察者模式的缺点

需要考虑开发效率和运行效率的问题，同步执行时容易出现阻塞。

## 观察者模式的使用场景

- 关联行为场景。关联行为是可拆分的，不是组合关系。
- 事件多级触发场景。
- 跨系统的信息交换场景（消息队列）。

## 观察者模式的注意事项

- 广播链问题：

  一个对象既可以是观察者，也可以是被观察者，这样就出现了消息传递链，当双重身份的类变多后，逻辑较为复杂不易维护，要求一个观察者模式中最多出现一个双重身份的类。

- 与责任链模式的区别：

  观察者广播链在传播过程中消息是随时更改的，相邻两个节点就能决定消息结构和内容，责任链模式消息一般不可变。

- 异步处理问题：

  需要考虑线程安全和队列问题。

## 观察者模式的扩展

### JDK 中的观察者模式

JDK 中提供了接口：`Observer` 以及一个可扩展的父类：`Observable`。

::: tip
观察者可以是实现接口 `Observer的` 任何对象。 在可观察到的实例发生变化之后，调用 `Observable` 的 `notifyObservers` 方法的应用程序会使其所有观察者通过调用其 `update` 方法通知更改。
:::

修改示例中的代码。

汇率类：

```java
public class RmbRate extends Observable {

    public void increase(int number) {
        System.out.println("人民币汇率提高:"+number+"个百分点");
        super.setChanged();
        HashMap<String, Object> args = new HashMap<>(2);
        args.put("method","increase");
        args.put("param",number);
        super.notifyObservers(args);
    }

    public void decrease(int number) {
        System.out.println("人民币汇率下降:"+number+"个百分点");
        super.setChanged();
        HashMap<String, Object> args = new HashMap<>(2);
        args.put("method","decrease");
        args.put("param",number);
        super.notifyObservers(args);
    }
}
```

公司抽象类：

```java
public abstract class Company implements Observer {
    @Override
    public void update(Observable o, Object arg) {
        if (arg instanceof HashMap){
            HashMap<?, ?> hashMap = (HashMap<?, ?>) arg;
            String method = (String) hashMap.get("method");
            if ("increase".equals(method)){
                int number = ((Integer) hashMap.get("param"));
                this.responseForIncrease(number);
            }else if ("decrease".equals(method)){
                int number = ((Integer) hashMap.get("param"));
                this.responseForDecrease(number);
            }
        }
    }

    protected abstract void responseForIncrease(int number);

    protected abstract void responseForDecrease(int number);
}
```

公司类：

```java
class ImportCompany extends Company {


    @Override
    protected void responseForIncrease(int number) {
        System.out.println("人民币汇率升值" + number + "个百分点，降低了进口产品成本，提升了进口公司利润率。");
    }

    @Override
    protected void responseForDecrease(int number) {
        System.out.println("人民币汇率贬值" + number + "个百分点，提升了进口产品成本，降低了进口公司利润率。");
    }
}
```

```java
class ExportCompany extends Company {


    @Override
    protected void responseForIncrease(int number) {
        System.out.println("人民币汇率升值" + number + "个百分点，降低了出口产品收入，降低了出口公司的销售利润率。");
    }

    @Override
    protected void responseForDecrease(int number) {
        System.out.println("人民币汇率贬值" + number + "个百分点，提升了出口产品收入，提升了出口公司的销售利润率。");
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) throws NoSuchMethodException {
        ExportCompany exportCompany = new ExportCompany();
        ImportCompany importCompany = new ImportCompany();
        RmbRate rmbRate = new RmbRate();
        rmbRate.addObserver(exportCompany);
        rmbRate.addObserver(importCompany);
        rmbRate.increase(5);

        rmbRate.decrease(10);
    }
}
```

### 真实的观察者模式

- 消息沟通一般使用约定的格式例如 XML、JSON 等。
- 观察者的响应方式：提高响应速度：多线程、缓存。
- 被观察者不一定要通知所有的变化。
