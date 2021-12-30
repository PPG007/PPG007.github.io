# 迭代器模式

## 定义

提供一种方法访问一个容器对象中各个元素而又不暴露该对象的内部细节。

## 角色

- Iterator 抽象迭代器：定义访问和遍历元素的接口。
- ConcreteIterator 具体迭代器：实现迭代器接口完成遍历。
- Aggregate 抽象容器：提供创建具体迭代器角色的接口。
- ConcreteAggregate 具体容器：实现容器接口定义的方法。

## 示例

抽象迭代器：

```java
public interface Iterator<E> {
    /**
     * 获取下一个元素
     * @return 元素
     */
    E next();

    /**
     * 是否还有元素
     * @return 布尔值
     */
    boolean hasNext();

    /**
     * 删除元素
     * @return 删除是否成功
     */
    boolean remove();

    /**
     * 复位
     */
    void reset();
}
```

具体迭代器：

```java
public class ConcreteIterator<E> implements Iterator<E>{

    private final LinkedList<E> linkedList;
    /**
     * 游标
     */
    private int cursor=0;

    public ConcreteIterator(LinkedList<E> linkedList) {
        this.linkedList = linkedList;
    }

    @Override
    public E next() {
        if (this.hasNext()){
            return this.linkedList.get(this.cursor++);
        }
        return null;
    }

    @Override
    public boolean hasNext() {
        return this.cursor != this.linkedList.size();
    }

    /**
     * 调用next方法后，游标已滑到下一个位置，
     * 调用删除方法，应当删除next调用返回的元素，
     * 也就是此时游标的前一个位置的元素，如果不进行自减
     * 可能存在下标越界问题
     * @return 是否删除成功
     */
    @Override
    public boolean remove() {
        return this.linkedList.remove(--this.cursor) != null;
    }

    @Override
    public void reset() {
        this.cursor=0;
    }
}
```

抽象容器：

```java
public interface Aggregate<T> {

    /**
     * 添加元素
     * @param t 元素
     */
    void add(T t);

    /**
     * 删除元素
     * @param t 要删除的对象
     */
    void remove(T t);

    /**
     * 获取迭代器对象
     * @return 迭代器对象
     */
    Iterator<T> iterator();
}
```

具体容器：

```java
public class ConcreteAggregate<T> implements Aggregate<T>{

    public ConcreteAggregate() {
        this.linkedList = new LinkedList<>();
    }

    private final LinkedList<T> linkedList;


    @Override
    public void add(T t) {
        this.linkedList.add(t);
    }

    @Override
    public void remove(T t) {
        this.linkedList.remove(t);
    }

    @Override
    public Iterator<T> iterator() {
        return new ConcreteIterator<>(this.linkedList);
    }
}
```

启动类：

```java
public class Client {

    public static void main(String[] args) {
        ConcreteAggregate<User> userConcreteAggregate = new ConcreteAggregate<>();
        Random random = new Random(System.currentTimeMillis());
        for (int i = 0; i < 10; i++) {
            userConcreteAggregate.add(
                    new User(
                            UUID.randomUUID().toString()
                            ,random.nextInt(30)
                            ,UUID.randomUUID().toString()
                            ,UUID.randomUUID().toString()
                    )
            );
        }
        Iterator<User> iterator = userConcreteAggregate.iterator();
        System.out.println("==========遍历==========");
        while (iterator.hasNext()){
            System.out.println(iterator.next());
        }

        iterator.reset();

        System.out.println("==========随机删除==========");
        while (iterator.hasNext()){
            User user = iterator.next();
            if (random.nextBoolean()){
                iterator.remove();
                System.out.println("删除了："+user);
            }
        }

        iterator.reset();

        System.out.println("==========遍历==========");
        while (iterator.hasNext()){
            System.out.println(iterator.next());
        }

    }
}
```

## 迭代器模式应用场景

JDK 中已经有很多类实现了 Iterator 与 Iterable 接口，现在已经不需要手动写迭代器模式了，也尽量不要去写，直接使用 JDK 提供的即可。
