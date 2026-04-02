# 枚举

在 Java 中，可以使用 `static final` 来定义常量，例如：

```java
public class Constants {
    public static final int MAX_VALUE = 100;
    public static final String DEFAULT_NAME = "Unknown";
}
```

但是这里有一个问题是即使使用没有定义的常量值也不会报错，因为它们都是同一个类型，所以编译器无法区分它们。这时候我们可以使用枚举（enum）来定义一组相关的常量，枚举是一种特殊的类，它可以包含一组固定的常量值，并且每个常量值都是枚举类型的一个实例。例如：

```java
public enum Color {
    RED, GREEN, BLUE
}
```

因为 enum 类型的每个常量在 JVM 中只有一个唯一实例，所以可以直接用 `==` 来比较是否相等。

## 与 class 的区别

- 继承 `java.lang.Enum`：枚举类型隐式地继承了 `java.lang.Enum`，同时不能被继承。
- 只能定义出 Enum 实例，无法通过 `new` 关键字创建枚举对象。
- 定义的每个实例都是引用类型的唯一实例。
- enum 可以用于 switch 语句。

## 带有值的枚举

枚举类型的每个实例都可以有自己的属性和方法。例如：

```java
public enum Color {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF");

    private final String hexCode;

    Color(String hexCode) {
        this.hexCode = hexCode;
    }

    public String getHexCode() {
        return hexCode;
    }
}
```
