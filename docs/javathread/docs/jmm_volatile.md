# JMM 与 volatile

## 什么是 JMM

JMM 即为 JAVA **内存模型**（java memory model）。因为在不同的硬件生产商和不同的操作系统下，内存的访问逻辑有一定的差异，结果就是当你的代码在某个系统环境下运行良好，并且线程安全，但是换了个系统就出现各种问题。Java 内存模型，就是为了屏蔽系统和硬件的差异，让一套代码在不同平台下能到达相同的访问结果。

## 内存划分

JMM 规定了内存主要划分为**主内存**和**工作内存**两种。此处的主内存和工作内存跟 JVM 内存划分（堆、栈、方法区）是在不同的层次上进行的，如果非要对应起来，主内存对应的是 Java 堆中的对象实例部分，工作内存对应的是栈中的部分区域，从更底层的来说，*主内存对应的是硬件的物理内存，工作内存对应的是寄存器和高速缓存。*

JVM 在设计时候考虑到，如果 JAVA 线程每次读取和写入变量都直接操作主内存，对性能影响比较大，所以每条线程拥有各自的工作内存，*工作内存中的变量是主内存中的一份拷贝*，线程对变量的读取和写入，直接在**工作内存**中操作，而不能直接去操作主内存中的变量。但是这样就会出现一个问题，当一个线程修改了自己工作内存中变量，对其他线程是不可见的，会导致线程不安全的问题。因为JMM制定了一套标准来保证开发者在编写多线程程序的时候，能够控制什么时候内存会被同步给其他线程。

## 八种内存操作

1. lock（锁定）：作用于**主内存**的变量，把一个变量标识为线程独占状态。
2. unlock（解锁）：作用于**主内存**的变量，它把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
3. read（读取）：作用于**主内存**变量，它把一个变量的值从主内存传输到线程的工作内存中，以便随后的 load 动作使用。
4. load（载入）：作用于**工作内存**的变量，它把 read 操作从主存中变量放入工作内存中。
5. use（使用）：作用于**工作内存**中的变量，它把工作内存中的变量传输给执行引擎，每当虚拟机遇到一个需要使用到变量的值，就会使用到这个指令。
6. assign（赋值）：作用于**工作内存**中的变量，它把一个从执行引擎中接受到的值放入工作内存的变量副本中。
7. store（存储）：作用于**主内存**中的变量，它把一个从工作内存中一个变量的值传送到主内存中，以便后续的 write 使用。
8. write（写入）：作用于**主内存**中的变量，它把 store 操作从工作内存中得到的变量的值放入主内存的变量中。

## JMM 对八大内存操作的规则

- 不允许 read 和 load、store 和 write 操作之一单独出现。即使用了 read 必须 load，使用了 store 必须 write。
- 不允许线程丢弃他最近的 assign 操作，即工作变量的数据改变了之后，必须告知主存。
- 不允许一个线程将没有 assign的 数据从工作内存同步回主内存。
- 一个新的变量必须在主内存中诞生，不允许工作内存直接使用一个未被初始化的变量。就是怼变量实施 use、store 操作之前，必须经过 assign 和 load 操作。
- 一个变量同一时间只有一个线程能对其进行 lock。多次 lock 后，必须执行相同次数的 unlock 才能解锁。
- 如果对一个变量进行 lock 操作，会清空所有工作内存中此变量的值，在执行引擎使用这个变量前，必须重新 load 或 assign 操作初始化变量的值。
- 如果一个变量没有被 lock，就不能对其进行 unlock 操作。也不能 unlock 一个被其他线程锁住的变量。
- 对一个变量进行 unlock 操作之前，必须把此变量同步回主内存。

## JMM 模型特征

### 原子性

例如上面八项操作，在操作系统里面是不可分割的单元。被 synchronized 关键字或其他锁包裹起来的操作也可以认为是原子的。从一个线程观察另外一个线程的时候，看到的都是一个个原子性的操作。

### 可见性

每个工作线程都有自己的工作内存，所以当某个线程修改完某个变量之后，在其他的线程中，未必能观察到该变量已经被修改。volatile 关键字要求被修改之后的变量要求立即更新到主内存，每次使用前从主内存处进行读取。因此 volatile 可以保证可见性。除了 volatile 以外，synchronized 和 final 也能实现可见性。synchronized 保证 unlock 之前必须先把变量刷新回主内存。final 修饰的字段在构造器中一旦完成初始化，并且构造器没有 this 逸出，那么其他线程就能看到 final 字段的值。

### 有序性

java 的有序性跟线程相关。如果在线程内部观察，会发现当前线程的一切操作都是有序的。如果在线程的外部来观察的话，会发现线程的所有操作都是无序的。因为 JMM 的工作内存和主内存之间存在延迟，而且 java 会对一些指令进行重新排序。volatile 和 synchronized 可以保证程序的有序性，很多程序员只理解这两个关键字的执行互斥，而没有很好的理解到 volatile 和 synchronized 也能保证指令不进行重排序。

## Happen-Before（先行发生规则）

在常规的开发中，如果我们通过上述规则来分析一个并发程序是否安全，估计脑壳会很疼。因为更多时候，我们是分析一个并发程序是否安全，其实都依赖 Happen-Before 原则进行分析。Happen-Before 被翻译成先行发生原则，意思就是当 A 操作先行发生于 B 操作，则在发生 B 操作的时候，操作 A 产生的影响能被 B 观察到，“影响”包括修改了内存中的共享变量的值、发送了消息、调用了方法等。

1. 程序次序规则（Program Order Rule）：在一个线程内，程序的执行规则跟程序的书写规则是一致的，从上往下执行。
2. 管程锁定规则（Monitor Lock Rule）：一个 Unlock 的操作肯定先于下一次 Lock 的操作。这里必须是同一个锁。同理我们可以认为在 synchronized 同步同一个锁的时候，锁内先行执行的代码，对后续同步该锁的线程来说是完全可见的。
3. volatile 变量规则（volatile Variable Rule）：对同一个 volatile 的变量，先行发生的写操作，肯定早于后续发生的读操作。
4. 线程启动规则（Thread Start Rule）：Thread 对象的 `start()` 方法先行发生于此线程的没一个动作。
5. 线程中止规则（Thread Termination Rule）：Thread对象的中止检测（如：`Thread.join()`，`Thread.isAlive()` 等）操作，必行晚于线程中所有操作。
6. 线程中断规则（Thread Interruption Rule）：对线程的 `interruption()` 调用，先于被调用的线程检测中断事件(`Thread.interrupted()`)的发生。
7. 对象中止规则（Finalizer Rule）：一个对象的初始化方法先于一个方法执行 `Finalizer()` 方法。
8. 传递性（Transitivity）：如果操作 A 先于操作 B、操作B先于操作 C,则操作 A 先于操作 C。

## volatile

::: tip
volatile 是 Java 虚拟机提供的轻量级同步机制。
:::

volatile 特性：

- 保证可见性。
- 不保证原子性。
- 禁止指令重排。

### 保证可见性

以下代码如果不使用 volatile 关键字，第一个线程将会不停循环，程序无法终止：

```java
public class VolatileDemo {
    private volatile static boolean flag=true;

    public static void main(String[] args) {
        new Thread(()->{
            // 这个线程对主存中flag的值的变化不知道
            while (flag){
            }
        }).start();
        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            flag=false;
        }).start();
    }
}
```

### 不保证原子性

以下代码不论是否在变量前使用 volatile，最后结果都不会始终是 5000：

```java
public class VolatileDemo {
    private volatile static int num=0;

    private static void incr(){
        ++num;
    }
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(()->{
                for (int j = 0; j < 500; j++) {
                    incr();
                }
            }).start();
        }
        while (Thread.activeCount()>2){
            Thread.yield();
        }
        // 理论结果应该是5000
        System.out.println(num);
    }
}
```

使用原子类解决原子性问题(java.util.concurrent.atomic)：

以下代码结果始终是 5000：

```java
public class VolatileDemo {

    private static AtomicInteger integer=new AtomicInteger(0);
    private static void incr(){
        integer.getAndIncrement();
    }
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(()->{
                for (int j = 0; j < 500; j++) {
                    incr();
                }
            }).start();
        }
        while (Thread.activeCount()>2){
            Thread.yield();
        }
        System.out.println(integer.get());
    }
}
```
