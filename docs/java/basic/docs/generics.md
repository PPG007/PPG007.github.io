# 泛型

泛型是一种模板，通过使用泛型，我们可以在编译时检查类型安全，并且可以重用代码，避免强制类型转换。泛型允许我们定义类、接口和方法时使用类型参数，这些类型参数在实例化时被替换为具体的类型。

## 泛型的向上转型

这里以 Java 的 Collection 相关的类为例，`ArrayList<T>` 类是支持泛型的，同时这个类实现了 `List<T>` 接口，因此 `ArrayList<T>` 的对象可以向上转型为 `List<T>` 类型：

```java
List<String> list = new ArrayList<>();
```

`Interger` 是 `Number` 的子类，但是 `ArrayList<Integer>` 不是 `ArrayList<Number>` 的子类，因此不能直接进行向上转型：

```java
ArrayList<Integer> intList = new ArrayList<>();
// 下面的代码会编译错误，因为 ArrayList<Integer> 不是 ArrayList<Number> 的子类
// List<Number> numList = intList; // 编译错误
```

::: tip

当 `T` 不变时，可以向上转型，`T` 本身不能向上转型。

:::

## 使用泛型

这里以 `ArrayList` 为例。

如果不显式声明泛型，泛型实际上将会是 `Object` 类型，因此我们可以向 `ArrayList` 中添加任何类型的对象：

```java
ArrayList list = new ArrayList();
list.add("Hello");
list.add(123);
```

但是这样会丧失类型检查，而且后续在使用时需要进行强制类型转换，可能会导致运行时错误。

如果我们使用泛型来声明 `ArrayList`，例如 `ArrayList<String>`，那么我们只能向其中添加 `String` 类型的对象：

```java
ArrayList<String> list = new ArrayList<>();
list.add("Hello");
// list.add(123); // 编译错误，不能添加 Integer 类型的对象
```

### 泛型接口

除了在类中使用泛型，我们还可以在接口中使用泛型。例如 `Array.sort` 方法可以对任意数组进行排序，前提是待排序的类型实现了 `Comparable<T>` 接口，例如对于自定义类 `Student`，我们可以让他实现按照分数降序排列：

::: code-tabs#person

@tab Student

```java
public class Student implements Comparable<Student> {
    private int score;

    public Student(int score) {
        this.score = score;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    @Override
    public int compareTo(Student s) {
        return s.getScore() - this.getScore();
    }

    @Override
    public String toString() {
        return "Student{" +
                "score=" + score +
                '}';
    }
}
```

@tab Main

```java
import java.util.Arrays;

public class Main {

    static void main() throws Exception {
        Student[] students = {
                new Student(70),
                new Student(80),
                new Student(100),
                new Student(90),
        };
        Arrays.sort(students);
        System.out.println(Arrays.toString(students));
    }
}
```

:::

## 编写泛型

接下来我们来编写一个含有两个变量的泛型类 `Pair`，这个类可以存储两个变量，同时支持两种类型的泛型：

::: code-tabs#pair

@tab Pair

```java
public class Pair <T, K>{
    private T first;
    private K second;

    public K getSecond() {
        return second;
    }

    public void setSecond(K second) {
        this.second = second;
    }

    public T getFirst() {
        return first;
    }

    public void setFirst(T first) {
        this.first = first;
    }

    @Override
    public String toString() {
        return "Pair{" +
                "first=" + first +
                ", second=" + second +
                '}';
    }
}
```

@tab Main

```java
void main() {
    Pair<String, Integer> pair = new Pair<>();
    pair.setFirst("first");
    pair.setSecond(2);
    IO.println(pair);
}
```

:::

### 静态变量和方法的泛型

在 Java 中，静态变量不能使用类的泛型类型参数，因为静态成员属于类本身，而不是类的实例。泛型类型参数是在实例化时确定的，而静态成员在类加载时就已经存在了，因此无法使用实例化时确定的类型参数。

如果要在静态方法中使用泛型，需要在方法级别声明泛型类型参数。例如：

```java
public static <A, B> Pair<A, B> create() {
    return new Pair<>();
}
```

## 类型擦除

Java 中的泛型是通过类型擦除实现的，这意味着在编译时，所有的泛型类型参数都会被替换为它们的上界（如果没有显式指定上界，则默认为 `Object`）。因此，在运行时，泛型类型信息是不可用的。

基于这个实现原理，类型擦除会导致一些局限性：

- 局限一：`<T>` 不能是基本类型，例如 `int`，因为实际类型都是 `Object`，而 `Object` 不能存储基本类型。我们可以使用包装类来解决这个问题，例如使用 `Integer` 来代替 `int`。
- 局限二：无法取得带有泛型的 `Class`。例如下面的代码中，即使两个 `Pair` 对象的泛型不同，但是他们的 Class 都是 `Pair.class`：

    ```java
    Pair<String, Boolean> p1 = new Pair<>();
    Pair<String, Double> p2 = new Pair<>();
    System.out.println(p1.getClass() == p2.getClass());
    ```

- 局限三：无法判断带有泛型的类型，例如下面的代码中，无法判断 `p1` 和 `p2` 的泛型类型：

    ```java
    if (p1 instanceof Pair<String, Integer>) {
        // 这里将会编译错误
    }
    ```

- 局限四：不能实例化 `T` 类型，尝试使用 `new T()` 来创建一个 `T` 类型的对象会导致编译错误，因为在运行时，`T` 的类型信息已经被擦除。如果要实例化泛型类型，必须借助额外的 `Class<T>` 参数，例如：

    ```java
    public class Pair<T, K> {
        public Pair(Class<T> tClass, Class<K> kClass) throws Exception {
            this.first = tClass.getConstructor().newInstance();
            this.second = kClass.getConstructor().newInstance();
        }
    }
    ```

    然后在实例化时传入 `Class` 对象：

    ```java
    Pair<Base, Base> pair = new Pair<>(Base.class, Base.class);
    ```

### 方法重写问题

对于以下代码：

```java
public class Outer<T> {
    public boolean equals(T t) {
        return this == t;
    }
}
```

这个类中定义了一个 `equals` 方法，同时入参是泛型类型，由于类型擦除的原因，这个方法实际上会变成 `equals(Object t)`，这回导致存在两个相同签名的方法，注意这里不是重写，因此编译器将会报错。如果将 `equals(T t)` 方法改为 `equals(Object t)`，就不会有这个问题了，因为这会被认为是重写。

### 泛型继承

一个类可以继承自一个泛型类，例如定义一个 `IntPair` 类继承自 `Pair<Integer, Integer>`：

```java
public class Outer<T> {
    public boolean equals(T t) {
        return this == t;
    }
}
```

由于子类实际上没有泛型类型，因此可以和其他普通类一样构造对象：

```java
IntPair intPair = new IntPair();
```

前面已经提到，由于类型擦除的原因，运行时我们是无法获取一个泛型类的泛型信息的，但是在父类是泛型类型的情况下，编译器必须把类型 T、K 保存到子类的 class 文件中，不然编译器就不知道 `IntPair` 只能存取 `Integer`。

这种情况下，可以通过反射拿到类型了：

```java
void main() {
    IntPair pair = new IntPair();
    pair.setFirst(1);
    pair.setSecond(2);
    Class<? extends IntPair> clazz = pair.getClass();
    Type t = clazz.getGenericSuperclass();
    if (t instanceof ParameterizedType pt) {
        Type[] types = pt.getActualTypeArguments();
        for (Type type : types) {
            System.out.println(type.getTypeName());
        }
    }
}
```

这也引出了另一个问题，随着加入泛型，Java 中只用 `Class` 来标识类型已经不够了，Java 的类型系统结构如下：

```text
Type
├── Class<T> // 代表普通类和接口
├── ParameterizedType // 代表带有泛型的类型，例如 Pair<String, Integer>
├── TypeVariable<D> // 代表类型变量，例如 T、K
├── GenericArrayType // 代表带有泛型的数组类型，例如 T[]
└── WildcardType // 代表通配符类型，例如 ? extends Number、? super Integer
```

## extends

前面已经提到过，只有 T 不变的情况下泛型才能向上转型，例如 `ArrayList<String>` 可以向上转型为 `List<String>`，但是 `ArrayList<Integer>` 不能向上转型为 `List<Number>`。但是有些场景可能需要支持泛型的向上转型，这是可以使用通配符来实现，例如给 `Pair` 类添加一个限制，要求 T 和 K 必须是 `Number` 的子类，同时添加一个求和方法，只计算整数部分之和。

```java
import java.lang.reflect.InvocationTargetException;
import java.util.Objects;

public class Pair <T extends Number, K extends Number>{
    private T first;
    private K second;

    public K getSecond() {
        return second;
    }

    public void setSecond(K second) {
        this.second = second;
    }

    public T getFirst() {
        return first;
    }

    public void setFirst(T first) {
        this.first = first;
    }

    public Pair sum(Pair<? extends Number, ? extends Number> pair) {
        Pair<Number, Number> result = new Pair<>();
        result.setFirst(this.first.intValue() + pair.getFirst().intValue());
        result.setSecond(this.second.intValue() + pair.getSecond().intValue());
        return result;
    }

    @Override
    public String toString() {
        return "Pair{" +
                "first=" + first +
                ", second=" + second +
                '}';
    }
}
```

::: tip

如果一个方法中的参数使用了 `extends` 通配符的泛型，那么这个参数不能传入具体的子类，而必须是 `extends` 通配符指定的父类。

同时，通过 getter 拿到的类型也是父类，而不是具体的子类。

:::

### extends 的作用

考虑这样一个方法：

```java
void test(List<? extends Integer> list) {

}
```

由于我们限制了 list 中的元素类型必须是 Integer 的子类（虽然 Integer 是 final 修饰的，没有子类），这里编译器无法推断出到底是哪个子类，因此编译器会禁止向这个 list 添加任何类型的实例，`null` 除外。

这就是 `extends` 的作用，即只允许读取，而不许写入，同时限制了读取的结果只能是指定的父类型而不是子类型。

## super

与 `extends` 通配符相反，`super` 通配符表示一个类型参数的下界，例如 `Pair<? super Integer, ? super Integer>` 表示这个 `Pair` 的类型参数必须是 `Integer` 的父类，例如 `Number` 或者 `Object`。

`super` 不能像 `extends` 那样在类声明上指定泛型限制，例如下面的代码会编译错误：

```java
public class Pair<? super Integer, ? super Integer> {
    // 编译错误，不能在类声明上使用 super 通配符
}
```

改造一下 Pair 类：

```java
public class Pair <T>{
    private T first;
    private T second;

    public T getFirst() {
        return first;
    }

    public T getSecond() {
        return second;
    }

    public void setSecond(T second) {
        this.second = second;
    }

    public void setFirst(T first) {
        this.first = first;
    }
}
```

接下来这样使用：

```java
Pair<? super Integer> pair = new Pair<>();
```

这时调用 setter 方法时会发现，编译器允许安全地传入 `Integer` 类型。调用 getter 方法时只能使用 `Object` 类型来接收，但是不能用 `Integer` 接收，这是因为如果实际上是 `Number` 类型（虽然 Number 是一个抽象类，无法实例化，这里只是为了找个父类说明），编译器无法进行向下转型，因此只能使用 `Object` 来接收。

### PECS 原则

回顾之前的 `extends` 和 `super` 作为方法参数类型的用法：

- `<? extends T>` 允许调用都方法获取 T 的引用，但是不允许调用 set 方法设置除了 null 之外的值。
- `<? super T>` 允许调用 set 方法设置 T 的引用，但是不允许调用 get 方法获取除了 Object 之外的值。

基于这两个原理，如果一个方法中对一个参数只需要读或写，那么通过这里的泛型约束，就可以实现编译时的检查，如果错误地调用 getter 或者 setter 将会导致编译报错。

PECS(Producer Extends, Consumer Super) 原则就是基于这个原理总结出来的，即如果一个参数是生产者，那么使用 `extends` 通配符；如果一个参数是消费者，那么使用 `super` 通配符。

### 无限定通配符

除了 `extends` 和 `super` 通配符之外，还有一个无限定通配符 `<?>`。

由于这个通配符既没有 `extends`，也没有 `super`，因此：

- 不允许调用 setter 方法设置除了 null 之外的值。
- 只能使用 `Object` 来接收 getter 方法的返回值。

同时 `<?>` 通配符是所有 `<T>` 的超类，例如：

```java
Pair<?> pair = new Pair<Integer>();
```

## 泛型数组

Java 中可以声明带泛型的数组，但是不能用 `new` 来创建一个带泛型的数组，例如下面的代码会编译错误：

```java
Pair<String>[] pairs = new Pair<String>[10]; // 编译错误，不能创建带泛型的数组
```

必须通过强制转换实现带有泛型的数组：

```java
@SuppressWarnings("unchecked")
Pair<String>[] pairs = (Pair<String>[]) new Pair[10];
```

由于类型擦除，数组在运行时实际上是没有泛型的，对于下面这样的代码：

```java
void main() {
    Pair[] arr = new Pair[2];
    Pair<String>[] pairs = (Pair<String>[]) arr;
    pairs[0] = new Pair<String>("", "");
    arr[1] = new Pair<Integer>(1, 2);
    System.out.println(pairs[1].getFirst());
}
```

由于 `pairs` 使用了泛型声明为字符串，因此编译器会检查 pairs，但是编译器不会检查 arr，因为 arr 不是泛型数组，因此当这两个变量指向同一个数组时，操作 arr 可能导致从 pairs 中获取元素时报错，上面的代码将会报错 `ClassCastException`。

因此要安全地使用泛型数组，必须保证这个数组只能被泛型类型访问。

## 泛型与可变参数

考虑下面这一段代码：

```java
public class Main {
    public static void main() {
        String[] arr = asArray("A", "B");
        System.out.println(arr);
        String[] picked = pick2("one", "two", "three");
        System.out.println(picked);
    }

    public static <K> K[] pick2(K k1, K k2, K k3) {
        return asArray(k1, k3);
    }

    public static <T> T[] asArray(T... args) {
        return args;
    }
}
```

这段代码实际运行时将会在调用 `pick2` 方法时抛出 `ClassCastException`。

这是因为 `pick2` 方法的返回类型是 `K[]`，而 `asArray` 方法的返回类型是 `T[]`，由于类型擦除的原因，这两个数组在运行时都是 `Object[]` 类型，因此当 `pick2` 方法试图将 `Object[]` 转换为 `K[]` 时就会抛出异常。

::: danger

综上所述，使用泛型和数组或者泛型和可变参数时需要格外小心，只有确保没有问题才可以使用 `@SafeVarargs` 注解来抑制编译器的警告。

:::
