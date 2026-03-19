# ThreadLocal 内存泄漏问题

## 引用类型

### 强引用

Strong Reference，例如 `Object o=new Object();`。

只要对象有强引用指向且 GC Roots 可达，即使内存即将溢出也不会回收这个对象。

### 软引用

Soft Reference，强度弱于强引用。

在即将 OOM 之前软引用指向的对象将被回收，一般用来缓存服务器中间计算结果以及不需要实时保存的用户行为等。

### 弱引用

Weak Reference，强度更弱，用来描述非必需对象。

如果指向的对象只有弱引用，则下次 YGC（新生代 GC，频率比较高）将会回收，但是 YGC 时间上具有不确定性，弱引用何时被回收也具有不确定性。弱引用主要用于指向某个易消失的对象，在强引用断开后，此引用不会劫持对象，调用 get 可能返回 null。

### 虚引用

Phantom Reference，强度最弱，定义完成后就无法通过该引用获取指向的对象。

为一个对象设置虚引用的唯一目的就是希望能在这个对象被回收时收到一个系统通知。虚引用必须与引用队列联合使用，在 GC 时，如果发现存在虚引用，就会在回收前将这个虚引用加入到引用队列中

## 内存泄漏问题

每个 Thread 线程内部都有一个 Map。

Map 里存储线程本地对象做 key，线程变量副本做 value。

Map 由 ThreadLocal 维护，ThreadLocal 负责向 map 获取和设置线程的变量值。

ThreadLocal 的内部类 ThreadLocalMap 的内部类 Entry 的 key 是弱引用，value 为强引用，ThreadLocal 在没有外部对象的强引用时，发生 GC 会回收 key，当线程没有结束，但 ThreadLocal 的 key 被回收时，存在 key 为 null 的键值对，造成内存泄漏。

## 解决方案

每次使用完 ThreadLocal 都调用 remove。
