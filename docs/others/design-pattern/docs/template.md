# 模板方法模式

::: tip 定义
定义一个操作中的算法的框架，而将一些步骤延迟到子类中。使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
:::

::: tip
一般模板方法都加上 final 关键字防止覆写。
:::

```java
public abstract class AbstractClass {
    /**
     * 定义一个抽象行为，由子类实现
     */
    protected abstract void operation1();

    /**
     * 定义一个抽象行为
     */
    protected abstract void operation2();

    /**
     * 不变的行为，去除子类中的重复代码
     */
    public void templateMethod(){
        operation1();
        operation2();
        System.out.println("模板方法");
    }
}
```

## 模板方法模式的优点

- 封装不变部分、扩展可变部分。
- 提取公共部分代码，便于维护。
- 行为由父类控制，子类实现。

## 模板方法模式的缺点

抽象类定义了部分方法，子类的覆写会影响父类方法的结果，在复杂项目中阅读性下降。

## 模板方法模式使用场景

- 多个子类有共有的方法并且逻辑基本相同。
- 重要、复杂的算法，可以把核心算法设计为模板方法，周边的相关细节由各个子类实现。
- 重构时，把相同的代码抽取到父类中，通过钩子函数约束其行为。

## 模板方法模式的扩展

钩子函数：

定义一个带返回类型的函数，父类要将其实现且要设置默认返回值，子类在需要的时候进行覆写，控制这个钩子函数的返回值，公共代码中通过这个返回值判断哪些语句要执行，哪些不要执行，这样就能够实现子类的公共部分执行结果不同。

父类：

```java
public abstract class AbstractClass {
    /**
     * 定义一个抽象行为，由子类实现
     */
    protected abstract void operation1();

    /**
     * 定义一个抽象行为
     */
    protected abstract void operation2();

    /**
     * 不变的行为，去除子类中的重复代码
     */
    public void templateMethod(){
        operation1();
        if (isOperation2()){
            operation2();
        }
        System.out.println("模板方法");
    }

    protected boolean isOperation2(){
        return true;
    }
}
```

子类：

```java
public class ConcreteClass extends AbstractClass{

    private boolean flag=true;

    public void setFlag(boolean flag) {
        this.flag = flag;
    }

    @Override
    protected boolean isOperation2() {
        return flag;
    }


    @Override
    protected void operation1() {
        System.out.println("具体类A实现方法1");
    }

    @Override
    protected void operation2() {
        System.out.println("具体类A实现方法2");
    }
}
```
