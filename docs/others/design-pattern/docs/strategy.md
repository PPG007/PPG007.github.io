# 策略模式

## 定义

定义一组算法，将每个算法都封装起来，并且使它们之间可以互换。

## 三个角色

- Context 封装角色：上下文角色，屏蔽高层模块对策略、算法的直接访问，封装可能存在的变化。
- Strategy 抽象策略角色：策略、算法家族的抽象，通常为接口，定义每个策略或算法必须具有的方法和属性。
- ConcreteStrategy 具体策略角色：实现抽象策略中的操作，含有具体的算法。

## 示例

抽象策略接口：

```java
public abstract class Strategy {
    /**
     * 抽象算法
     */
    public abstract void algorithmInterface();
}
```

封装角色：

```java
public class Context {
    private Strategy strategy;

    public Context(Strategy strategy) {
        this.strategy = strategy;
    }
    public void contextInterface(){
        strategy.algorithmInterface();
    }
}
```

具体策略角色：

```java
public class ConcreteStrategyA extends Strategy{
    @Override
    public void algorithmInterface() {
        System.out.println("算法A实现");
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        Context context;

        context=new Context(new ConcreteStrategyA());
        context.contextInterface();
    }
}
```

## 策略模式的优点

- 算法可以自由切换：只要实现抽象策略接口，就可以进行封装对外提供策略。
- 避免使用多重条件判断：其他模块决定使用何种策略。
- 扩展性好：增加策略只需要多一个实现抽象策略接口的类。

## 策略模式的缺点

- 策略类数量增多：每一个策略都是一个类，复用性降低。
- 所有的策略类都需要向外暴露：上层模块必须知道有哪些策略才能决定使用哪个策略，违背了迪米特法则，可以使用其他模式来修正这个问题，例如工厂方法模式、代理模式、享元模式等。

## 策略模式的使用场景

- 多个类只有在算法或行为上稍有不同的场景。
- 算法需要自由切换的场景。
- 需要屏蔽算法规则的场景。

## 策略模式注意事项

具体策略超过 4 个就需要考虑使用混合模式。

## 策略枚举

实现加减法，枚举类：

```java
public enum Calculator {
    /**
     * 加法
     */
    ADD("+"){
        @Override
        public int exec(int a, int b){
            return a+b;
        }
    },
    /**
     * 减法
     */
    SUB("-"){
        @Override
        public int exec(int a, int b){
            return a-b;
        }
    };
    String value;
    Calculator(String value){
        this.value=value;
    }
    public String getValue(){
        return this.value;
    }

    public abstract int exec(int a,int b);
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        String operator = scanner.next();
        int b = scanner.nextInt();
        if (Calculator.ADD.getValue().equals(operator)){
            System.out.println(Calculator.ADD.exec(a, b));
        }else if (Calculator.SUB.getValue().equals(operator)){
            System.out.println(Calculator.SUB.exec(a, b));
        }else {
            System.out.println("error");
        }
        scanner.close();
    }
}
```

::: warning 注意
策略枚举受枚举类型约束，每个枚举项都是public、final、static的，扩展性较弱，适用于不经常发生变化的场景。
:::
