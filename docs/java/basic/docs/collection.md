# 集合

集合与数组：

- 数组：初始化后大小不可变；可以通过索引访问元素。
- 集合：大小可变；提供丰富的操作方法，如添加、删除、查找等。

## Collection

Java 标准库中的 `java.util` 包提供了集合类 `Collection`，它是除 Map 外所有其他集合类的根接口。

`java.util` 包主要提供了三种类型的集合：

- `List`：一种有序列表的集合。
- `Map`：一种通过键值映射的集合。
- `Set`：一种不允许重复元素的集合。

一些不应该再使用的集合类：

- `Vector`：线程安全的动态数组，性能较差。
- `Hashtable`：线程安全的哈希表，性能较差。
- `Stack`：基于 Vector 实现的栈，性能较差。

此外还有 `Enumeration`，已被`Iterator` 取代，不建议使用。

## List

### 创建 List

```java
List<String> list = new ArrayList<>();
```

除了直接构造 `ArrayList` 和 `LinkedList` 之外，还可以使用 `List.of` 方法根据给定元素创建一个不可变的 List：

```java
List<String> list = List.of("a", "b", "c");
```

### 遍历 List

最好使用迭代器来遍历 List：

```java
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
list.add("peach");
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
```

Java 中可以使用 增强 for 循环来遍历 List：

```java
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
list.add("peach");
for (String s : list) {
    System.out.println(s);
}
```

### List 与数组的转换

可以通过 `toArray` 方法将 List 转换为数组：

```java
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
list.add("peach");
Object[] array = list.toArray();
System.out.println(Arrays.toString(array));
String[] array1 = list.toArray(new String[0]);
System.out.println(Arrays.toString(array1));
```

当不传入参数时，`toArray` 方法返回一个包含 List 中所有元素的 Object 数组。传入一个类型为 String 的数组参数时，`toArray` 方法会返回一个包含 List 中所有元素的 String 数组。

## equals

`List` 提供了 `contains`、`indexOf`、`lastIndexOf` 等方法来检查元素是否存在于 List 中，以及获取元素的索引位置。

List 中判断两个元素是否相同实际上时通过调用 `equals` 方法来判断的。

因此，对于非标准库的类，如果要正确使用 List 的这些方法，需要重写 `equals` 方法来定义元素之间的相等关系。

`equals` 方法需要满足的条件：

- 自反性：对于任何非 null 的引用值 x，x.equals(x) 应该返回 true。
- 对称性：对于任何非 null 的引用值 x 和 y，如果 x.equals(y) 返回 true，那么 y.equals(x) 也应该返回 true。
- 传递性：对于任何非 null 的引用值 x、y 和 z，如果 x.equals(y) 返回 true，并且 y.equals(z) 返回 true，那么 x.equals(z) 也应该返回 true。
- 一致性：对于任何非 null 的引用值 x 和 y，多次调用 x.equals(y) 应该始终返回相同的结果，除非其中一个对象被修改。
- 对 null 的比较：对于任何非 null 的引用值 x，x.equals(null) 应该返回 false。

`equals` 方法步骤：

- 先确定实例“相等”的逻辑，即哪些字段相等就认为实例相等。
- 用 `instanceof` 判断传入的对象是否是当前类的实例，如果是就继续比较，否则返回 false。
- 对引用类型用 `equals` 方法比较，对基本类型用 `==` 比较。

## Map

### 创建 Map

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 1);
map.put("banana", 2);
map.put("peach", 3);
```

### 遍历 Map

通过 `keySet` 方法可以遍历 Map 的键，通过 `entrySet` 方法可以遍历 Map 的键值对：

```java
map.put("apple", 1);
map.put("banana", 2);
map.put("peach", 3);
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

::: warning

在遍历 Map 时，不能期待或假定遍历是有顺序的。

:::

## hashcode

在 Map 的内部，对 key 做比较是通过 `equals()` 实现的，这一点和 List 查找元素需要正确覆写 `equals()` 是一样的，即正确使用 Map 必须保证：作为 key 的对象必须正确覆写 `equals()` 方法。

而通过 key 计算出 hashcode 来定位存储位置是通过 `hashCode()` 方法实现的，因此正确使用 Map 还必须保证：作为 key 的对象必须正确覆写 `hashCode()` 方法。

`hashCode()` 方法需要满足的条件：

- 如果两个对象相等，则两个对象的 `hashCode()` 方法必须相等。
- 如果两个对象不相等，则两个对象的 `hashCode()` 尽量不相等。

## EnumMap

如果要构造一个 key 为枚举的 Map，那么可以直接使用 `EnumMap`，它是专门为枚举类型设计的 Map 实现，具有更高的性能和更小的内存占用：

```java
enum Color {
    RED, GREEN, BLUE
}
Map<Color, String> colorMap = new EnumMap<>(Color.class);
colorMap.put(Color.RED, "红色");
colorMap.put(Color.GREEN, "绿色");
colorMap.put(Color.BLUE, "蓝色");
```

## TreeMap

`HashMap` 的原理决定了遍历时的 key 是无序的，还有一种 Map 是有序的，也就是 `SortedMap`，它的实现类是 `TreeMap`，要用自定义类作为 key 的话，必须实现 `Comparable` 接口，或者在构造 `TreeMap` 时传入一个 `Comparator` 对象来指定排序规则：

```java
class Person implements Comparable<Person> {
    private String name;
    public Person(String name) {
        this.name = name;
    }
    @Override
    public int compareTo(Person other) {
        return this.name.compareTo(other.name);
    }
}
Map<Person, Integer> personMap = new TreeMap<>();
personMap.put(new Person("Alice"), 1);
personMap.put(new Person("Bob"), 2);
personMap.put(new Person("Charlie"), 3);
```

::: warning

compareTo 方法必须正确地实现大于、小于、等于判断，否则 TreeMap 的行为将不可预测。

:::

## Properties

`.properties` 文件是 Java 中常用的配置文件格式，而且这种文件都是键值对的形式，例如：

```properties
app.name=MyApp
app.version=1.0.0
app.author=John Doe
```

Java 中内置了 `Properties` 类来处理 `.properties` 文件，它是 `Hashtable` 的子类，可以通过 `load` 方法从输入流中加载属性：

```java
public static void main() throws Exception {
    FileInputStream stream = new FileInputStream("src/test.properties");
    Properties properties = new Properties();
    properties.load(stream);
    System.out.println(properties.get("app"));
    System.out.println(properties.getProperty("app.name"));
}
```

### 写入配置文件

可以通过 `setProperty` 方法设置属性，然后通过 `store` 方法将属性写入输出流：

```java
public static void main() throws Exception {
    Properties properties = new Properties();
    properties.setProperty("app.name", "MyApp");
    properties.setProperty("app.version", "1.0.0");
    properties.setProperty("app.author", "John Doe");
    FileOutputStream stream = new FileOutputStream("src/test.properties");
    properties.store(stream, "Application Properties");
}
```

### 编码

早期 Java 规定 `.properties` 文件必须使用 ISO-8859-1 编码，因此在 `.properties` 文件中使用非 ASCII 字符时，需要使用 Unicode 转义序列，例如：

```properties
app.name=MyApp
app.version=1.0.0
app.author=John Doe
app.description=\u4E00\u4E2A\u6D4B\u88C\u6587\u4EF6
```

从 JDK9 之后，`.properties` 文件支持使用 UTF-8 编码，但是由于 `load(InputStream)` 方法仍然使用 ISO-8859-1 编码，因此如果要使用 UTF-8 编码的 `.properties` 文件，必须使用 `load(Reader)` 方法：

```java
FileReader reader = new FileReader("src/test.properties", StandardCharsets.UTF_8);
Properties properties = new Properties();
properties.load(reader);
System.out.println(properties.get("app"));
System.out.println(properties.getProperty("app.name"));
```

## Set

要想存储一些不重复的元素，可以使用 Map 的 key 唯一性来实现，但是入宫不需要进行 value 映射，那么就可以使用 Set。

常用的 Set 实现类有 `HashSet` 和 `TreeSet`，它们分别基于 `HashMap` 和 `TreeMap` 实现，因此它们的性能和特性也与 Map 类似。因此，HashSet 是无序的，而 TreeSet 是有序的。

使用 Set：

```java
Set<String> set = new HashSet<>();
set.add("apple");
set.add("banana");
set.add("peach");
set.add("apple"); // 不会添加重复元素
for (String s : set) {
    System.out.println(s);
}
```

## Queue

队列实际上时一个先进先出的有序列表，它和 List 的区别在于 List 可以在任意位置添加和删除元素，而 Queue 只能在队尾添加元素，在队头删除元素。

队列的方法：

|操作|throw Exception|返回false或null|
|---|---|---|
|添加元素到队尾|add(E e)|boolean offer(E e)|
|取队首元素并删除|E remove()|E poll()|
|取队首元素但不删除|E element()|E peek()|

::: tip

不要将 `null` 放到队列里，因为 `null` 可能被用来表示队列为空。

:::

## PriorityQueue

优先级队列和队列的区别在于，优先级队列的出队顺序和优先级有关。当调用 `remove` 或 `poll` 方法时，返回的总是优先级最高的元素。

为了实现优先级的比较，放入其中的内容必须实现 `Comparable` 接口，或者在构造 `PriorityQueue` 时传入一个 `Comparator` 对象来指定优先级的比较规则：

```java
class Task implements Comparable<Task> {
    private String name;
    private int priority;
    public Task(String name, int priority) {
        this.name = name;
        this.priority = priority;
    }
    @Override
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
}
PriorityQueue<Task> queue = new PriorityQueue<>();
queue.add(new Task("Task1", 3));
queue.add(new Task("Task2", 1));
queue.add(new Task("Task3", 2));
while (!queue.isEmpty()) {
    Task task = queue.poll();
    System.out.println(task.name + ": " + task.priority);
}
```

## Deque

队列只允许一头进、一头出，如果需要两头进出，那么就可以使用双端队列 `Deque`。

双端队列与普通队列方法对比：

|操作|Queue|Deque|
|---|---|---|
|添加元素到队尾|add(E e) / offer(E e)|addLast(E e) / offerLast(E e)|
|取队首元素并删除|E remove() / E poll()|E removeFirst() / E pollFirst()|
|取队首元素但不删除|E element() / E peek()|E getFirst() / E peekFirst()|
|添加元素到队首|无|addFirst(E e) / offerFirst(E e)|
|取队尾元素并删除|无|E removeLast() / E pollLast()|
|取队尾元素但不删除|无|E getLast() / E peekLast()|

例如：

```java
Deque<String> deque = new ArrayDeque<>();
deque.addLast("apple");
deque.addLast("banana");
deque.addLast("peach");
deque.addFirst("grape");
while (!deque.isEmpty()) {
    String s = deque.pollFirst();
    System.out.println(s);
}
```

## Stack

与队列相反，栈是一种先进后出的有序列表。

要在 Java 中创建一个栈，可以使用 `Stack` 类，或者更推荐使用 `Deque` 来实现栈，因为`Stack` 类是基于 `Vector` 实现的，性能较差：

```java
Deque<String> stack = new ArrayDeque<>();
stack.push("apple");
stack.push("banana");
stack.push("peach");
while (!stack.isEmpty()) {
    String s = stack.pop();
    System.out.println(s);
}
```

## Iterator

Java 的集合类都可以使用 `for each` 循环，`List`、`Set` 和 `Queue` 会迭代每个元素，`Map` 会迭代每个 key。

实际上，Java 编译器并不知道如何遍历集合类，之所以能遍历，是因为编译器会把 `for each` 循环转换成使用 `Iterator` 的循环：

```java
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
list.add("peach");
for (String s : list) {
    System.out.println(s);
}
```

使用迭代器的好处在于调用方总是以统一的方式遍历各种集合类型，而不必关心其内部实现。

如果我们自己编写一个集合类，想要使用 `for each` 循环来遍历它，那么就需要实现 `Iterable` 接口，并且实现 `iterator()` 方法来返回一个 `Iterator` 对象：

::: code-tabs#MyList

@tab MyList

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class MyList<T> implements Iterable<T>{
    private final List<T> list = new ArrayList<>();

    @Override
    public Iterator<T> iterator() {
        return new MyIterator(this.list.size());
    }

    public void add(T element) {
        list.add(element);
    }

    class MyIterator implements Iterator<T> {
        int index;

        public MyIterator(int index) {
            this.index = index;
        }

        @Override
        public boolean hasNext() {
            return index > 0;
        }

        @Override
        public T next() {
            index--;
            return MyList.this.list.get(index);
        }
    }
}
```

@tab Main

```java
MyList<String> list = new MyList<>();
list.add("one");
list.add("two");
list.add("three");
for (String s : list) {
    System.out.println(s);
}
```

:::

## Collections

`Collections` 是 JDK 提供的工具类，位于 `java.util` 包中，提供了一系列静态方法，能更方便的操作集合类。

### 创建空集合

```java
List<String> emptyList = Collections.emptyList();
Set<String> emptySet = Collections.emptySet();
Map<String, String> emptyMap = Collections.emptyMap();
```

::: tip

JDK9 之后，可以使用 `List.of()`、`Set.of()` 和 `Map.of()` 来创建不可变的空集合。

:::

::: warning

这些方法返回的集合都是不可变的，不能添加、删除或修改元素，否则会抛出 `UnsupportedOperationException` 异常。

:::

### 创建单元素集合

```java
List<String> singletonList = Collections.singletonList("one");
Set<String> singletonSet = Collections.singleton("one");
Map<String, String> singletonMap = Collections.singletonMap("key", "value");
```

::: tip

对于 JDK9 之后的版本，可以使用 `List.of(T...)`、`Set.of(T...)` 和 `Map.of(T)` 来创建任意元素的不可变的单元素集合。

:::

### 排序

```java
List<String> list = new ArrayList<>();
list.add("banana");
list.add("apple");
list.add("peach");
Collections.sort(list);
System.out.println(list);
```

::: warning

由于排序会修改原集合，因此传入的集合不能是不可变集合。

:::

### 洗牌

`Collections` 提供了 `shuffle` 方法来随机打乱集合中的元素：

```java
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
list.add("peach");
Collections.shuffle(list);
System.out.println(list);
```

### 不可变集合

`Collections` 还提供了一系列方法把可变集合封装为不可变集合：

- 封装成不可变 List：`Collections.unmodifiableList(List<? extends T> list)`
- 封装成不可变 Set：`Collections.unmodifiableSet(Set<? extends T> set)`
- 封装成不可变 Map：`Collections.unmodifiableMap(Map<? extends K,? extends V> m)`

这种封装实际上是通过创建一个代理对象拦截掉所有的修改方法来实现的。

但是，如果将一个 List 封装成不可变 List，那么这个 List 中的元素仍然是可变的，如果修改了其中的元素，那么这个不可变 List 也会发生变化：

```java
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
list.add("peach");
List<String> unmodifiableList = Collections.unmodifiableList(list);
System.out.println(unmodifiableList); // [apple, banana, peach]
list.set(0, "grape");
System.out.println(unmodifiableList); // [grape, banana, peach]
```

因此，当调用封装为不可变集合方法后，最好将原集合的引用置空，以避免误修改。

### 线程安全的集合

`Collections` 还提供了一系列方法把非线程安全的集合封装为线程安全的集合：

- 封装成线程安全 List：`Collections.synchronizedList(List<T> list)`
- 封装成线程安全 Set：`Collections.synchronizedSet(Set<T> s)`
- 封装成线程安全 Map：`Collections.synchronizedMap(Map<K,V> m)`
