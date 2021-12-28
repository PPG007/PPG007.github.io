# 集合不安全

## List 不安全

解决方案：

- Vector：

    ```java
    Vector<String> strings = new Vector<>();
    ```

    Vector 的 add 方法安全的原因：

    使用了synchronized关键字。

    ```java
    public synchronized boolean add(E e) {
        modCount++;
        ensureCapacityHelper(elementCount + 1);
        elementData[elementCount++] = e;
        return true;
    }
    ```

- Collections.synchronizedList：

    ```java
    List<Object> objects = Collections.synchronizedList(new ArrayList<>());
    ```

- CopyOnWriteArrayList写入时复制：

    ```java
    CopyOnWriteArrayList<String> strings = new CopyOnWriteArrayList<>();
    ```

## Set 不安全

解决方案：

- Collections.synchronizedSet：

    ```java
    Set<Object> objects = Collections.synchronizedSet(new HashSet<>());
    ```

- CopyOnWriteArraySet：

    ```java
    CopyOnWriteArraySet<String> strings = new CopyOnWriteArraySet<>();
    ```

::: tip
HashSet 通过 HashMap 的键确保不会重复：

```java
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}
```

:::

## Map 不安全

### HashMap 的扩容机制和加载因子

默认加载因子、默认初始容量、最大容量：

```java
public class HashMap<K,V>extends AbstractMap<K,V>implements Map<K,V>, Cloneable, Serializable{
    //  默认的初始容量（容量为HashMap中桶的数目）是16，且实际容量必须是2的整数次幂。
    static final int DEFAULT_INITIAL_CAPACITY = 16;
    // 最大容量（必须是2的幂且小于2的30次方，传入容量过大将被这个值替换）
    static final int MAXIMUM_CAPACITY = 1 << 30;
    // 默认加载因子
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
    //... 省略
}
```

最大容量等于默认加载因子和初始容量的乘积，是用来预警的，如果 HashMap 中的容量超过这个阀值了，那就会执行扩容操作，低于则没事。

加载因子存在的原因，还是因为减缓哈希冲突，如果初始桶为 16，等到满 16 个元素才扩容，某些桶里可能就有不止一个元素了。所以加载因子默认为 0.75，也就是说大小为 16 的 HashMap，到了第 13 个元素，就会扩容成 32。

所以如果你心目中有明确的 Map 大小，设定时一定要考虑加载因子的存在。

扩容阈值就是初始桶大小(默认 16)乘以加载因子

HashMap 含参构造器：

```java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                            initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                            loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
```
