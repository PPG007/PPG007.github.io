# Record

使用 Integer、String 等类型的时候，这些类型都是不变类，一个不变类有以下特点：

- 定义 class 时使用 final 修饰，无法被继承。
- 每个字段使用 final 修饰，保证创建实例后无法修改任何字段。

例如如果希望定义一个 `Point` 类来表示一个二维坐标点，可以这样定义：

```java
public final class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}
```

从 Java 14 开始，Java 引入了新的 `Record` 类，把上面的 `Point` 类改写成 Record 形式如下：

```java
public record Point(int x, int y) {
}
```

除了用 final 修饰 class 以及每个字段之外，编译器还会自动添加构造方法，和字段同名的方法，以及重写 `toString()`、`equals()` 和 `hashCode()` 方法。

如果需要给 Record 的构造器添加一些自定义逻辑，例如参数校验，可以在 Record 内部定义一个紧凑构造器（compact constructor），例如：

```java
public record Point(int x, int y) {
    public Point {
        if (x < 0 || y < 0) {
            throw new IllegalArgumentException("坐标不能为负数");
        }
    }
}
```

Record 类仍然支持创建静态方法，例如：

```java
public record Point(int x, int y) {
    public static Point origin() {
        return new Point(0, 0);
    }
}
```
