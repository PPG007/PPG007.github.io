# 函数式接口

::: tip
任何接口，如果只包含唯一一个抽象方法，那么它就是一个函数式接口，可以使用 lambda 表达式。
:::

## 示例

接口：

```java
public interface MyInterface {
    /**
     * 抽象方法
     * @param a 参数
     */
    void show(int a);
}
```

运行：

```java
public static void main(String[] args) {

    MyInterface myInterface = new MyInterface() {
        @Override
        public void show(int a) {
            System.out.println("匿名内部类，参数==> "+a);
        }
    };
    myInterface.show(1);

    MyInterface myInterface1= a -> System.out.println("lambda param is ==> "+a);
    myInterface1.show(2);
}
```

## 四大函数式接口

包：`java.util.function`。

### Function

```java
@FunctionalInterface
// 传入T类型，返回R类型
public interface Function<T, R> {

    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument
     * @return the function result
     */
    R apply(T t);
```

简单使用：

```java
Function<String, String> function=(s -> s+"??");
System.out.println(function.apply("test"));
```

### Predicate

::: tip
断言型接口，有一个输入参数，返回一个布尔值。
:::

```java
@FunctionalInterface
public interface Predicate<T> {

    /**
     * Evaluates this predicate on the given argument.
     *
     * @param t the input argument
     * @return {@code true} if the input argument matches the predicate,
     * otherwise {@code false}
     */
    boolean test(T t);
```

简单使用：

```java
Predicate<Integer> integerPredicate=integer -> integer >100;
System.out.println(integerPredicate.test(21));
System.out.println(integerPredicate.test(210));
```

### Consumer

::: tip
消费型接口，接收一个参数，没有返回值。
:::

```java
@FunctionalInterface
public interface Consumer<T> {

    /**
     * Performs this operation on the given argument.
     *
     * @param t the input argument
     */
    void accept(T t);
```

简单使用：

```java
Consumer<String> stringConsumer= System.out::println;
stringConsumer.accept("test");
```

### Supplier

::: tip
供给型接口，没有参数，只有返回值。
:::

```java
@FunctionalInterface
public interface Supplier<T> {

    /**
     * Gets a result.
     *
     * @return a result
     */
    T get();
}
```

简单使用：

```java
Supplier<String> stringSupplier=()->{
    StringBuilder stringBuilder = new StringBuilder();
    stringBuilder.append("t").append("e").append("s").append("t");
    return stringBuilder.toString();
};
System.out.println(stringSupplier.get());
```

## Stream 流式计算

简单使用：

```java
users.stream()
        .sorted(Comparator.comparingInt(User::getAge))
//                过滤年龄大于等于10
        .filter(user -> user.getAge() >= 10)
//                过滤ID是偶数的
        .filter(user -> user.getId()%2==0)
        .map(user -> user.getName().toUpperCase())
        // 限制输出数量
        .limit(3)
        .forEach(System.out::println);
```

并行计算：

```java
// DoubleStream IntStream ……
long reduce = LongStream.rangeClosed(0L, 100_0000_0000L)
                // 并行流
                .parallel()
                .reduce(0, Long::sum);
```
