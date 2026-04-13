# 函数式编程

::: tip 函数式编程

函数式编程（Functional Programming）是一种编程范式，强调使用纯函数和不可变数据来构建程序，允许把函数作为参数传递和返回。Java 8 引入了 lambda 表达式，使得 Java 也可以支持函数式编程。

:::

## Lambda 表达式

Java 中有很多接口只有一个抽象方法，例如 `Comparable` 接口，之前的实现方式是使用匿名内部类：

```java
public class Main {
    public static void main(String[] args) {
        Comparator<Integer> comparator = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o1 - o2;
            }
        };
        System.out.println(comparator.compare(1, 2));
    }
}
```

在 JDK8 以后，可以使用 lambda 表达式来实现：

```java
public class Main {
    public static void main(String[] args) {
        Comparator<Integer> comparator = (o1, o2) -> o1 - o2;
        System.out.println(comparator.compare(1, 2));
     }
}
```

### 函数式接口

任何接口，如果只包含唯一一个抽象方法，那么它就是一个函数式接口。这种接口上可以使用 `@FunctionalInterface` 注解来标记，编译器会检查接口是否满足函数式接口的要求。

## 方法引用

除了 lambda 表达式之外，Java 8 还引入了方法引用（Method Reference），它是 lambda 表达式的一种简化形式，可以直接引用已有的方法来实现函数式接口。例如：

```java
public static void main(String[] args) {
    String[] arr = new String[]{
            "banana",
            "peach",
            "apple",
    };
    Arrays.sort(arr, Main::cmp);
    System.out.println(Arrays.toString(arr));
}
```

::: tip

使用方法引用的前提是方法签名必须与函数式接口的抽象方法的签名兼容。

:::

对于非静态方法，在作为方法引用时，方法签名等价于第一个参数是调用者类型的静态方法，例如 `String::compareTo` 方法签名如下：

```java
public int compareTo(String b)
```

这就等价于：

```java
public static int compareTo(String a, String b)
```

因此也可以作为 `Arrays.sort()` 的方法引用：

```java
public static void main(String[] args) {
    String[] arr = new String[]{
            "banana",
            "peach",
            "apple",
    };
    Arrays.sort(arr, String::compareTo);
    System.out.println(Arrays.toString(arr));
}
```

除了静态方法和实例方法之外，还可以引用构造方法，例如将一个整数数组转为 `Student` 对象数组：

```java
public static void main(String[] args) {
    int [] arr = new int[]{
            10,
            20,
            90
    };
    Arrays.stream(arr).mapToObj(Student::new).forEach(System.out::println);
}
```

## Stream

JDK8 除了引入 lambda 表达式和方法引用之外，还引入了 Stream API，提供了一种高效、简洁的方式来处理集合数据。Stream API 支持链式调用，可以对集合进行过滤、映射、排序等操作。

### 创建 Stream

最简单的方法是使用 `Stream.of()` 方法：

```java
Stream<String> stream = Stream.of("banana", "peach", "apple");
```

但是这样基本没什么实际作用，因此另一种方法是基于数组或者 `Collection` 来创建 Stream：

```java
String[] arr = new String[]{
        "banana",
        "peach",
        "apple",
};
Stream<String> stream = Arrays.stream(arr);
```

还可以使用 `Supplier` 来创建 Stream，基于此创建的 Stream 会不断调用 `Supplier.get` 方法产生下一个元素，这种 Stream 保存的不是元素，而是算法，因此可以用来表示无限序列：

```java
Stream<Integer> stream = Stream.generate(new Random()::nextInt);
stream.limit(100).forEach(System.out::println);
```

::: tip

打印一个无限序列时，必须使用 `limit` 方法来限制输出的元素数量，否则会导致程序一直运行下去。

:::

由于 Java 泛型不支持基本类型，因此 Stream API 提供了 `IntStream`、`LongStream` 和 `DoubleStream` 来处理基本类型的流，这些流提供了专门的方法来处理基本类型的数据，例如：

```java
IntStream stream = Arrays.stream(new int[]{1});
```

### 使用 map

map 方法可以将一个 Stream 中的元素映射到另一个 Stream 中，例如：

```java
Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .forEach(System.out::println); // 打印
```

### 使用 filter

filter 可以用来过滤 Stream 中的元素，例如：

```java
Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .filter(s -> s.startsWith("b")) // 过滤以 b 开头的元素
        .forEach(System.out::println); // 打印
```

### 使用 reduce

reduce 是一个聚合方法，它可以把一个 Stream 的所有元素按照聚合函数聚合成一个结果。

例如，计算 1 到 100 的和：

```java
int sum = IntStream.rangeClosed(1, 100).reduce(0, Integer::sum);
System.out.println(sum);
```

### 输出集合

对于 Stream 的操作，大体上可以分为两类。一类是中间操作，例如 `map`、`filter` 和 `reduce`，这些操作会返回一个新的 Stream，可以继续进行链式调用；另一类是终止操作，例如 `forEach`、`collect` 和 `toArray`，这些操作会触发 Stream 的计算，并返回一个结果。

::: tip

转换操作不会进行任何计算。

:::

将 Stream 输出为 List：

```java
List<String> list = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .filter(s -> s.startsWith("b")) // 过滤以 b 开头的元素
        .collect(Collectors.toList()); // 输出为 List
System.out.println(list);
```

输出为数组：

```java
String[] arr = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .filter(s -> s.startsWith("b")) // 过滤以 b 开头的元素
        .toArray(String[]::new); // 输出为数组
System.out.println(Arrays.toString(arr));
```

输出为 Map：

```java
Map<String, Integer> map = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .filter(s -> s.startsWith("b")) // 过滤以 b 开头的元素
        .collect(Collectors.toMap(Function.identity(), String::length)); // 输出为 Map
System.out.println(map);
```

分组输出：

```java
Map<Integer, List<String>> map = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .filter(s -> s.startsWith("b")) // 过滤以 b 开头的元素
        .collect(Collectors.groupingBy(String::length)); // 分组输出
System.out.println(map);
```

### 其他

#### 排序

```java
Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .sorted() // 排序
        .forEach(System.out::println); // 打印
```

#### 截取

```java
Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .skip(1) // 跳过前一个元素
        .limit(2) // 只保留后两个元素
        .forEach(System.out::println); // 打印
```

#### 合并

```java
Stream<String> stream1 = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase); // 变小写
Stream<String> stream2 = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase); // 变小写
Stream<String> stream = Stream.concat(stream1, stream2); // 合并两个 Stream
stream.forEach(System.out::println); // 打印
```

#### flatMap

flatMap 可以把一个 Stream 中的每个元素映射成一个 Stream，然后把这些 Stream 合并成一个 Stream，例如：

```java
Stream<String> stream = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .flatMap(s -> Stream.of(s.split(""))); // 把每个字符串拆成一个个字符
stream.forEach(System.out::println); // 打印
```

#### 并行

```java
Stream<String> stream = Stream.of("  Apple ", " pear ", " ORANGE", " BaNaNa ")
        .map(String::trim) // 去空格
        .map(String::toLowerCase) // 变小写
        .parallel(); // 并行处理
stream.forEach(System.out::println); // 打印
```

#### 其他

除了 `reduce` 和 `collect` 之外，Stream 还有一些常用的聚合方法：

- `count`：计算 Stream 中元素的数量。
- `min` 和 `max`：计算 Stream 中元素的最小值和最大值。

对于 `IntStream`、`LongStream` 和 `DoubleStream`，还有一些专门的方法：

- `sum`：计算 Stream 中元素的和。
- `average`：计算 Stream 中元素的平均值。

还有一些方法可以用来判断 Stream 中的元素是否满足某些条件：

- `anyMatch`：判断 Stream 中是否有任何一个元素满足条件。
- `allMatch`：判断 Stream 中是否所有元素都满足条件。
