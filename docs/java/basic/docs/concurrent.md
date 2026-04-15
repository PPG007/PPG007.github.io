# 并发编程

## 创建新线程

Java 中创建线程有多种方法，第一种是继承 `Thread` 类并重写 `run` 方法，然后调用 `start` 方法来启动线程：

::: code-tabs#ThreadTest

@tab ThreadTest

```java
public class ThreadTest extends Thread{
    @Override
    public void run() {
        System.out.println("Thread running...");
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ThreadTest threadTest = new ThreadTest();
        threadTest.start();
        Thread.sleep(2000);
    }
}
```

:::

第二种是实现 `Runnable` 接口并重写 `run` 方法，然后将其作为参数传递给 `Thread` 类的构造函数：

::: code-tabs#RunnableTest

@tab RunnableTest

```java
public class RunnableTest implements Runnable{
    @Override
    public void run() {
        System.out.println("Runnable running...");
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(new RunnableTest());
        thread.start();
        Thread.sleep(2000);
    }
}
```

:::

第三种是实现 `Callable` 接口并重写 `call` 方法，通过 `FutureTask` 或者线程池来执行：

::: code-tabs#CallableTest

@tab CallableTest

```java
import java.util.concurrent.Callable;

public class CallableTest implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        System.out.println("Callable running...");
        return null;
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        CallableTest task = new CallableTest();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        pool.submit(task);
        FutureTask<Integer> futureTask = new FutureTask<>(task);
        Thread thread = new Thread(futureTask);
        thread.start();
        Thread.sleep(3000);
        pool.close();
    }
}
```

:::

## 线程状态

Java 中的线程有以下几种状态：

- `New`：线程被创建但尚未启动。
- `Runnable`：线程正在运行，正在执行 `run` 方法。
- `Blocked`：运行中的线程因为一些原因被阻塞而挂起。
- `Waiting`：运行中的线程因为一些原因在等待中。
- `Timed Waiting`：运行中的线程因为执行 `sleep` 方法正在计时等待。
- `Terminated`：线程已经完成执行或者被终止。

当一个线程启动后，它可以在 `Runnable`、`Blocked`、`Waiting`、`Timed Waiting` 状态之间切换，直到最终进入 `Terminated` 状态。

线程终止的原因有：

- 线程正常执行完毕。
- 线程被其他线程调用 `stop` 方法强制终止。
- 线程因为未捕获的异常而终止。

通过 `getState` 方法可以获取线程的当前状态：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            System.out.println("Thread running...");
        });
        System.out.println(thread.getState()); // NEW
        thread.start();
        System.out.println(thread.getState()); // RUNNABLE
        Thread.sleep(2000);
        System.out.println(thread.getState()); // TERMINATED
    }
}
```

## 线程操作

### 线程退出

调用 `stop` 方法可以强制终止线程，但这种方法已经被废弃，因为它可能会导致资源泄漏和数据不一致。正确的做法是在线程中使用一个标志变量来控制线程的退出：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        thread.start();
        Thread.sleep(1000);
        thread.stop();
    }
}
```

### 休眠

通过 `Thread.sleep` 方法可以让当前线程休眠指定的时间：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(2000);
    }
}
```

Object 类的 `wait` 方法也可以让当前线程等待，但它必须在同步块中调用：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
        synchronized (lock) {
            lock.wait();
        }
    }
}
```

调用 `wait` 方法会释放锁并进入等待状态，直到其他线程调用 `notify` 或 `notifyAll` 方法来唤醒它：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
        Thread thread = new Thread(() -> {
            synchronized (lock) {
                try {
                    lock.wait();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                System.out.println("Thread resumed...");
            }
        });
        thread.start();
        Thread.sleep(2000);
        synchronized (lock) {
            lock.notify();
        }
    }
}
```

`wait` 和 `sleep` 的区别在于：

- `wait` 方法必须在同步块中调用，而 `sleep` 方法可以在任何地方调用。
- `wait` 方法会释放锁，而 `sleep` 方法不会。

### yield 和 join

`yield` 方法可以让当前线程让出 CPU 的执行权，允许其他线程执行，但它只是一个提示，并不保证当前线程一定会被切换：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            System.out.println("Thread running...");
            Thread.yield();
            System.out.println("Thread resumed...");
        });
        thread.start();
        Thread.sleep(2000);
    }
}
```

`join` 方法可以让当前线程等待另一个线程执行完毕：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            System.out.println("Thread running...");
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        thread.start();
        thread.join();
        System.out.println("Thread finished...");
    }
}
```

### 线程中断

通过调用 `interrupt` 方法可以中断线程，但这只是一个标志，线程需要在适当的时候检查这个标志并做出响应：

::: code-tabs#InterruptTest

@tab ThreadTest

```java
public class ThreadTest extends Thread{
    @Override
    public void run() {
        while (!this.isInterrupted()) {
            System.out.println("Thread is running...");
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                break;
            }
        }
        System.out.println("Thread finished...");
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ThreadTest threadTest = new ThreadTest();
        threadTest.start();
        Thread.sleep(2000);
        threadTest.interrupt();
        Thread.sleep(2000);
    }
}
```

::::

如果线程正在等待状态，例如 `sleep` 或者调用了 `join` 方法，那么调用 `interrupt` 方法会抛出 `InterruptedException` 异常，线程可以通过捕获这个异常来响应中断。

### 守护线程

如果还有线程没有结束，那么 JVM 就不会退出，所以，需要保证所有的线程都能及时结束。但是对于需要在程序运行的时间内一直保持运行的线程，例如定时任务线程等，可以通过将其设置为守护线程，这样当其他线程都结束了，JVM 就会自动退出：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ThreadTest threadTest = new ThreadTest();
        threadTest.setDaemon(true);
    }
}
```

### 线程优先级

通过调用 `setPriority` 方法可以设置线程的优先级，优先级范围从 1 到 10，默认优先级为 5：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            System.out.println("Thread running...");
        });
        thread.setPriority(Thread.MAX_PRIORITY);
        thread.start();
        Thread.sleep(2000);
    }
}
```

JDK 中内置的优先级：

```java
// 优先级最小值
public final static int MIN_PRIORITY = 1;
// 优先级默认值
public final static int NORM_PRIORITY = 5;
// 优先级最大值
public final static int MAX_PRIORITY = 10;
```

操作系统对优先级更高的线程可能调度的更加频繁，但是这只是概率问题，并不保证优先级高的线程一定会先执行。

## 线程同步

### synchronized

考虑如下代码：

```java
class Counter {
    public static int count = 0;
}

public class Main {
    static void main() throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                Counter.count++;
            }
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                Counter.count--;
            }
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(Counter.count);
    }
}
```

多次执行上述代码会发现，最终的结果不一定是 0，这是因为上面的自增自减操作实际上是三步：

- 读取 `Counter.count` 的值。
- 对读取的值进行加 1 或者减 1 的操作。
- 将结果写回 `Counter.count`。

这样的话就会存在这种情况：线程 A 读取了 `Counter.count` 的值为 0，然后线程 B 也读取了 `Counter.count` 的值为 0，然后线程 A 将读到的值加一后写回 `Counter.count`，此时 `Counter.count` 的值为 1，然后线程 B 将读到的值减一后写回 `Counter.count`，此时 `Counter.count` 的值就会是 -1，而不是 0。

为了避免这种情况，可以使用 `synchronized` 关键字来对代码块进行同步：

```java
class Counter {
    public static final Object lock = new Object();
    public static int count = 0;
}

public class Main {
    static void main() throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                synchronized (Counter.lock) {
                    Counter.count++;
                }
            }
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                synchronized (Counter.lock) {
                    Counter.count--;
                }
            }
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(Counter.count);
    }
}
```

上面的代码中使用 `synchronized` 关键字对一个共享对象也就是 `Counter.lock` 对象进行加锁，这样就保证了同一时间只有一个线程能够执行加锁的代码块，从而避免了数据不一致的问题。

::: tip

使用 `synchronized` 关键字时，锁对象应该是一个共享的对象，通常是一个 `final` 的对象，这样可以避免锁对象被修改导致的线程安全问题。

在结束 `synchronized` 块时，锁会自动释放，所以不需要手动释放锁。同时即使在 `synchronized` 块中发生了异常，锁也会被自动释放。

:::

::: warning

为了正确的实现线程安全，必须保证所有访问共享资源的代码块都使用同一个锁对象进行加锁，如果多个线程之间使用了不同的锁对象，那么就无法保证线程安全。

:::

#### 不需要 synchronized 的情况

JVM 规范中定义了几种原子操作：

- 基本类型（long、double 除外）的赋值。
- 引用类型赋值。

long、double 是 64 位的，JVM 没有明确规定 64 位的赋值操作是不是原子操作，不过 x64 平台上是原子操作的。

因此，如果一个线程只是要给一个变量赋值，那么可以不加锁。

::: warning

如果一个线程要执行多个赋值操作，那么就需要加锁来保证这些操作的原子性，否则可能会出现数据不一致的问题。

:::

不可变对象无需同步，例如不可变的 `List`。

#### 同步方法

如果每次都需要手动选择锁住的对象，会比较麻烦，所以可以直接在方法上使用 `synchronized` 关键字来声明一个同步方法，这样就会自动使用当前对象作为锁对象：

```java
class Counter {
    public static int count = 0;

    public synchronized static void inc() {
        count++;
    }

    public synchronized static void dec() {
        count--;
    }
}
```

这就等价于：

```java
class Counter {
    public static int count = 0;

    public static void inc() {
        synchronized (Counter.class) {
            count++;
        }
    }

    public static void dec() {
        synchronized (Counter.class) {
            count--;
        }
    }
}
```

::: tip

对于实例方法，这等价于使用 `this` 作为锁对象。

:::

### 死锁

Java 的线程锁是可重入锁，例如下面的代码：

```java
public class Main {
    public static void main(String[] args) {
        Object lock = new Object();
        synchronized (lock) {
            synchronized (lock) {
                System.out.println("Reentrant lock...");
            }
        }
    }
}
```

JVM 允许同一个线程重复获取同一个锁，这种能被同一个线程反复获取的锁就叫做可重入锁。

一个线程获取一个锁后，还可以再继续获取其他的锁，对于下面的代码：

```java
public class Main {
    public static void main(String[] args) {
        Object lock1 = new Object();
        Object lock2 = new Object();
        Thread t1 = new Thread(() -> {
            synchronized (lock1) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                synchronized (lock2) {
                    System.out.println("Thread 1...");
                }
            }
        });
        Thread t2 = new Thread(() -> {
            synchronized (lock2) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                synchronized (lock1) {
                    System.out.println("Thread 2...");
                }
            }
        });
        t1.start();
        t2.start();
    }
}
```

上面的代码中，线程 t1 先获取了 lock1 锁，然后休眠了 1 秒钟，在这期间线程 t2 获取了 lock2 锁，然后也休眠了 1 秒钟，接着线程 t1 试图获取 lock2 锁，但是 lock2 锁已经被线程 t2 获取了，所以线程 t1 就会被阻塞在这里，而线程 t2 试图获取 lock1 锁，但是 lock1 锁已经被线程 t1 获取了，所以线程 t2 也会被阻塞在这里，这样就形成了死锁。

死锁发生后，没有任何机制能够恢复，只能强制终止程序，所以在编写多线程程序时需要特别注意避免死锁的发生。

为了避免这种情况，应该严格规范线程获取锁的顺序，例如所有线程都按照 lock1 -> lock2 的顺序获取锁，这样就不会出现死锁的问题。

### wait 和 notify

上面的 `synchronized` 关键字只能保证同一时间只有一个线程能够执行加锁的代码块，但是它并不能让线程之间进行通信，例如一个线程需要等待另一个线程完成某个任务后才能继续执行，这时候就可以使用 `wait` 和 `notify` 方法来实现线程之间的通信，例如一个经典的生产者消费者模型：

```java
class Factory {
    private final List<String> products = new ArrayList<>();
    private int count = 0;

    public synchronized void produce() {
        this.count++;
        this.products.add(String.format("Product %d", this.count));
    }

    public synchronized void consume() throws InterruptedException {
        while (this.products.isEmpty()) {
            Thread.sleep(100);
        }
        String product = this.products.removeFirst();
        System.out.println(product);
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Factory factory = new Factory();
        Thread producer = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                factory.produce();
            }
            System.out.println("produce exit");
        });
        Thread consumer = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                try {
                    factory.consume();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
            System.out.println("consume exit");
        });
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
}
```

上面的代码中，生产者线程会先获取到锁，然后生产 100 个产品，生产完成后释放锁，消费者线程会获取到锁，然后消费掉所有的产品，消费完成后释放锁。要想实现边生产边消费，就需要使用 `wait` 和 `notify` 方法来实现线程之间的通信，例如：

```java
class Factory {
    private final List<String> products = new ArrayList<>();
    private int count = 0;

    public synchronized void produce() {
        this.count++;
        this.products.add(String.format("Product %d", this.count));
        this.notify();
    }

    public synchronized void consume() throws InterruptedException {
        while (this.products.isEmpty()) {
            this.wait();
        }
        String product = this.products.removeFirst();
        System.out.println(product);
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Factory factory = new Factory();
        Thread producer = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                factory.produce();
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
            System.out.println("produce exit");
        });
        Thread consumer = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                try {
                    factory.consume();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
            System.out.println("consume exit");
        });
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
}
```

`wait` 方法是 `Object` 类上的方法，此方法必须在当前获取的锁的对象上调用，这里锁的对象是 `Factory` 类的实例。`wait` 方法调用时会释放线程获得的锁，并且让线程进入等待状态，当 `wait` 方法返回时，线程又会尝试获取锁，如果获取到锁了，那么就可以继续执行后面的代码了。

`notify` 方法也是 `Object` 类上的方法，对一个对象调用此方法，会唤醒一个正在等待这个对象的线程，如果有多个线程在等待这个对象，那么会随机唤醒其中一个线程。

如果将上面的 `wait` 方法改成放在 `if` 而不是 `while` 中，那么就会存在一个问题：`if` 判断时的条件在 `wait` 方法返回时可能已经不满足了，如果有多个消费者的情况下会更明显，可能会抛出 `NoSuchElementException` 异常。

### ReentrantLock

JDK5 引入了 `java.util.concurrent` 包，其中提供了更丰富的线程同步工具，例如 `ReentrantLock` 类，它是一个可重入锁，比 `synchronized` 更轻量灵活，例如修改前面的代码：

```java
class Counter {
    public int count = 0;
    private final Lock lock = new ReentrantLock();

    public void inc() {
        try {
            this.lock.lock();
            this.count++;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.unlock();
        }
    }

    public void dec() {
        try {
            this.lock.lock();
            this.count--;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.unlock();
        }
    }
}
```

因为 `synchronized` 是语法实现的锁，所以不需要考虑异常也不需要手动释放锁，而 `ReentrantLock` 是一个普通的类，所以需要在 `finally` 块中手动释放锁来保证锁能够被正确释放。

另外，`ReentrantLock` 还提供了 `tryLock` 方法来尝试获取锁，如果获取不到锁了，那么就可以做一些其他的事情，而不是一直等待：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Lock lock = new ReentrantLock();
        Thread t1 = new Thread(() -> {
            try {
                lock.lock();
                Thread.sleep(3000);
            } catch (Exception e) {
                throw new RuntimeException(e);
            } finally {
                lock.unlock();
            }
        });
        Thread t2 = new Thread(() -> {
            boolean locked = false;
            try {
                locked = lock.tryLock(2, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                if (locked) {
                    lock.unlock();
                }
            }
            System.out.println("t2 exit");
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
    }
}
```

::: tip

`ReentrantLock` 有一个有参构造器，可以指定是否为公平锁，公平锁是指线程获取锁的顺序是按照线程请求锁的顺序来获取的，而非公平锁则不保证线程获取锁的顺序。

:::

### Condition

`synchronized` 可以配合 `wait` 和 `notify` 实现线程在条件不满足时等待，条件满足时唤醒，而 `ReentrantLock` 可以配合 `Condition` 来实现同样的功能，例如：

```java
class Factory {
    private final List<String> products = new ArrayList<>();
    private final Lock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();
    private int count = 0;

    public void produce() {
        try {
            this.lock.lock();
            this.count++;
            this.products.add(String.format("Product %d", this.count));
            this.condition.signalAll();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.unlock();
        }
    }

    public void consume() {
        try {
            this.lock.lock();
            while (this.products.isEmpty()) {
                this.condition.await();
            }
            String product = this.products.removeFirst();
            System.out.println(product);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.unlock();
        }
    }
}
```

可以看出，要使用 `Condition`，首先需要从 `Lock` 实例的 `newCondition` 方法中获取一个 `Condition` 实例，然后在需要等待的地方调用 `await` 方法，在需要唤醒的地方调用 `signal` 或者 `signalAll` 方法来唤醒等待的线程。

- `await` 方法会释放当前锁，进入等待状态。
- `signal` 方法会唤醒某个等待的线程。
- `signalAll` 方法会唤醒所有等待的线程。

此外，`await` 可以设置最大等待时间，如果超过了这个时间还没有被唤醒，那么就会自动返回：

```java
if (!condition.await(2, TimeUnit.SECONDS)) {
    System.out.println("wait timeout...");
}
```

::: warning

注意区分 `Condition` 的 `await` 和 `signal` 和 `Object` 的 `wait` 和 `notify`，前者是基于 `Lock` 实现的，而后者是基于 `synchronized` 实现的。

:::

### ReadWriteLock

前面的 `synchronized` 和 `ReentrantLock` 都是独占锁，也就是说同一时间只有一个线程能够获取到锁并执行代码块，但是有些场景下，多个线程同时读取共享资源是没有问题的，例如一个共享的配置对象，多个线程同时读取这个配置对象是没有问题的，但是如果有一个线程要修改这个配置对象，那么就需要独占锁来保证线程安全，这时候就可以使用 `ReadWriteLock` 来实现读写分离，例如：

```java
class Counter {
    private int count = 0;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final Lock wlock = lock.writeLock();
    private final Lock rlock = lock.readLock();

    public void inc() {
        try {
            this.wlock.lock();
            this.count++;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            this.wlock.unlock();
        }
    }

    public int getCount() {
        try {
            this.rlock.lock();
            return this.count;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            this.rlock.unlock();
        }
    }
}
```

要使用读写锁，需要首先创建一个 `ReadWriteLock` 实例，然后通过 `readLock` 方法获取读锁，通过 `writeLock` 方法获取写锁。然后分别使用读锁和写锁对读操作和写操作进行加锁。读取时，多个线程可以同时获取读锁，而写入时，只有一个线程能够获取写锁，并且在写锁被获取的期间，其他线程无法获取读锁和写锁。读写锁适用于读多写少的场景，可以提高系统的并发性能。

### StampedLock

上面通过 `ReadWriteLock` 实现了读写分离，但是它存在一个问题：如果有一个线程获取了读锁，那么其他线程就无法获取写锁了，也就是说，这是一种悲观的读锁，为了进一步提高效率，JDK8 引入了新的读写锁 `StampedLock`，这种锁在读取的时候也允许写入，但是这样就需要一些额外的逻辑来判断读的过程中是否有写入，例如：

```java
class Point {
    private final StampedLock stampedLock = new StampedLock();

    private double x;
    private double y;

    public void move(double deltaX, double deltaY) {
        long stamp = stampedLock.writeLock(); // 获取写锁
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            stampedLock.unlockWrite(stamp); // 释放写锁
        }
    }

    public double distanceFromOrigin() {
        long stamp = stampedLock.tryOptimisticRead(); // 获得一个乐观读锁
        // 注意下面两行代码不是原子操作
        // 假设x,y = (100,200)
        double currentX = x;
        // 此处已读取到x=100，但x,y可能被写线程修改为(300,400)
        double currentY = y;
        // 此处已读取到y，如果没有写入，读取是正确的(100,200)
        // 如果有写入，读取是错误的(100,400)
        if (!stampedLock.validate(stamp)) { // 检查乐观读锁后是否有其他写锁发生
            stamp = stampedLock.readLock(); // 获取一个悲观读锁
            try {
                currentX = x;
                currentY = y;
            } finally {
                stampedLock.unlockRead(stamp); // 释放悲观读锁
            }
        }
        return Math.sqrt(currentX * currentX + currentY * currentY);
    }
}
```

可以看到，`StampedLock` 提供了三种锁模式：

- 写锁：独占锁，获取写锁时，其他线程无法获取读锁和写锁。
- 乐观读锁：非独占锁，获取乐观读锁时，其他线程可以获取读锁和写锁，但是在读取数据时需要先获取一个乐观读锁的戳，如果在读取数据的过程中有其他线程获取了写锁，那么这个戳就会失效，此时需要重新获取一个悲观读锁来读取数据。
- 悲观读锁：非独占锁，获取悲观读锁时，其他线程可以获取读锁，但是无法获取写锁。

### Semaphore

如果需要限制一个资源的最大并发数，显然不能使用锁数组来实现，这会导致不必要的开销，可以使用 `Semaphore` 来实现。

`Semaphore` 是一个计数信号量，它维护了一个许可的计数器，线程可以通过 `acquire` 方法来获取许可，如果没有许可了，那么线程就会被阻塞，直到有其他线程释放了许可，通过 `release` 方法来释放许可，例如用来限制并发数：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Semaphore semaphore = new Semaphore(3);
        for (int i = 0; i < 10; i++) {
            final int index = i;
            new Thread(() -> {
                try {
                    semaphore.acquire();
                    System.out.println("Thread " + index + " is running...");
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } finally {
                    semaphore.release();
                }
            }).start();
        }
    }
}
```

### CountDownLatch

类似于 Go 中的 `WaitGroup`，`CountDownLatch` 也是一个计数器，线程可以通过 `await` 方法来等待计数器变为 0，通过 `countDown` 方法来将计数器减 1，例如：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(3);
        for (int i = 0; i < 3; i++) {
            final int index = i;
            new Thread(() -> {
                System.out.println("Thread " + index + " is running...");
                latch.countDown();
            }).start();
        }
        latch.await();
        System.out.println("All threads finished...");
    }
}
```

### CyclicBarrier

`CyclicBarrier` 是一个同步辅助类，它允许一组线程互相等待，直到所有线程都达到某个公共屏障点，例如：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        CyclicBarrier barrier = new CyclicBarrier(3, () -> {
            System.out.println("All threads reached the barrier...");
        });
        for (int i = 0; i < 3; i++) {
            final int index = i;
            new Thread(() -> {
                System.out.println("Thread " + index + " is running...");
                try {
                    barrier.await();
                } catch (InterruptedException | BrokenBarrierException e) {
                    throw new RuntimeException(e);
                }
            }).start();
        }
    }
}
```

这个辅助类可以用于实现一些需要多个线程协作完成的任务，例如分布式计算、并行处理等。

### Concurrent Collections

Java 中的集合可以分为两类：非线程安全的集合和线程安全的集合，非线程安全的集合在多线程环境下可能会出现数据不一致的问题，而线程安全的集合则通过内部的同步机制来保证线程安全，具体情况如下表：

|interface|non-thread-safe|thread-safe|
|---|---|---|
|List|ArrayList|CopyOnWriteArrayList|
|Map|HashMap|ConcurrentHashMap|
|Set|HashSet / TreeSet|CopyOnWriteArraySet|
|Queue|ArrayDeque / LinkedList|ArrayBlockingQueue / LinkedBlockingQueue / SynchronousQueue|
|Deque|ArrayDeque / LinkedList|LinkedBlockingDeque|

### Atomic

Atomic 原子类是通过无锁的方式来实现线程安全的，例如 `AtomicInteger`、`AtomicLong`、`AtomicReference` 等，这些类提供了一系列的原子操作方法，例如 `getAndIncrement`、`compareAndSet` 等，这些方法都是原子操作的，可以保证在多线程环境下的线程安全。

原子类的主要原理是通过 CAS（Compare And Swap）算法来实现的，CAS 是一种乐观锁的实现方式，它通过比较内存中的值和预期值来判断是否可以更新，如果内存中的值和预期值相同，那么就可以更新，否则就需要重新尝试。

例如使用原子类来实现一个线程安全的累加器：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        int threadCount = 10;
        CountDownLatch countDownLatch = new CountDownLatch(threadCount);
        AtomicInteger atomicInteger = new AtomicInteger();
        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                int id = atomicInteger.incrementAndGet();
                System.out.println(id);
                countDownLatch.countDown();
            }).start();
        }
        countDownLatch.await();
    }
}
```

### Java Memory Model 和 volatile

Java 内存模型是为了屏蔽不同平台的内存访问差异而设计的一套规范。

#### 内存划分

JMM 规定了内存主要划分为**主内存**和**工作内存**两种。此处的主内存和工作内存跟 JVM 内存划分（堆、栈、方法区）是在不同的层次上进行的，如果非要对应起来，主内存对应的是 Java 堆中的对象实例部分，工作内存对应的是栈中的部分区域，从更底层的来说，_主内存对应的是硬件的物理内存，工作内存对应的是寄存器和高速缓存。_

JVM 在设计时候考虑到，如果 JAVA 线程每次读取和写入变量都直接操作主内存，对性能影响比较大，所以每条线程拥有各自的工作内存，_工作内存中的变量是主内存中的一份拷贝_，线程对变量的读取和写入，直接在**工作内存**中操作，而不能直接去操作主内存中的变量。但是这样就会出现一个问题，当一个线程修改了自己工作内存中变量，对其他线程是不可见的，会导致线程不安全的问题。因为JMM制定了一套标准来保证开发者在编写多线程程序的时候，能够控制什么时候内存会被同步给其他线程。

#### 八种内存操作

1. lock（锁定）：作用于**主内存**的变量，把一个变量标识为线程独占状态。
2. unlock（解锁）：作用于**主内存**的变量，它把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
3. read（读取）：作用于**主内存**变量，它把一个变量的值从主内存传输到线程的工作内存中，以便随后的 load 动作使用。
4. load（载入）：作用于**工作内存**的变量，它把 read 操作从主存中变量放入工作内存中。
5. use（使用）：作用于**工作内存**中的变量，它把工作内存中的变量传输给执行引擎，每当虚拟机遇到一个需要使用到变量的值，就会使用到这个指令。
6. assign（赋值）：作用于**工作内存**中的变量，它把一个从执行引擎中接受到的值放入工作内存的变量副本中。
7. store（存储）：作用于**主内存**中的变量，它把一个从工作内存中一个变量的值传送到主内存中，以便后续的 write 使用。
8. write（写入）：作用于**主内存**中的变量，它把 store 操作从工作内存中得到的变量的值放入主内存的变量中。

#### JMM 对八大内存操作的规则

- 不允许 read 和 load、store 和 write 操作之一单独出现。即使用了 read 必须 load，使用了 store 必须 write。
- 不允许线程丢弃他最近的 assign 操作，即工作变量的数据改变了之后，必须告知主存。
- 不允许一个线程将没有 assign的 数据从工作内存同步回主内存。
- 一个新的变量必须在主内存中诞生，不允许工作内存直接使用一个未被初始化的变量。就是怼变量实施 use、store 操作之前，必须经过 assign 和 load 操作。
- 一个变量同一时间只有一个线程能对其进行 lock。多次 lock 后，必须执行相同次数的 unlock 才能解锁。
- 如果对一个变量进行 lock 操作，会清空所有工作内存中此变量的值，在执行引擎使用这个变量前，必须重新 load 或 assign 操作初始化变量的值。
- 如果一个变量没有被 lock，就不能对其进行 unlock 操作。也不能 unlock 一个被其他线程锁住的变量。
- 对一个变量进行 unlock 操作之前，必须把此变量同步回主内存。

#### JMM 模型特征

##### 原子性

例如上面八项操作，在操作系统里面是不可分割的单元。被 synchronized 关键字或其他锁包裹起来的操作也可以认为是原子的。从一个线程观察另外一个线程的时候，看到的都是一个个原子性的操作。

##### 可见性

每个工作线程都有自己的工作内存，所以当某个线程修改完某个变量之后，在其他的线程中，未必能观察到该变量已经被修改。volatile 关键字要求被修改之后的变量要求立即更新到主内存，每次使用前从主内存处进行读取。因此 volatile 可以保证可见性。除了 volatile 以外，synchronized 和 final 也能实现可见性。synchronized 保证 unlock 之前必须先把变量刷新回主内存。final 修饰的字段在构造器中一旦完成初始化，并且构造器没有 this 逸出，那么其他线程就能看到 final 字段的值。

##### 有序性

java 的有序性跟线程相关。如果在线程内部观察，会发现当前线程的一切操作都是有序的。如果在线程的外部来观察的话，会发现线程的所有操作都是无序的。因为 JMM 的工作内存和主内存之间存在延迟，而且 java 会对一些指令进行重新排序。volatile 和 synchronized 可以保证程序的有序性，很多程序员只理解这两个关键字的执行互斥，而没有很好的理解到 volatile 和 synchronized 也能保证指令不进行重排序。

#### Happen-Before（先行发生规则）

在常规的开发中，如果我们通过上述规则来分析一个并发程序是否安全，估计脑壳会很疼。因为更多时候，我们是分析一个并发程序是否安全，其实都依赖 Happen-Before 原则进行分析。Happen-Before 被翻译成先行发生原则，意思就是当 A 操作先行发生于 B 操作，则在发生 B 操作的时候，操作 A 产生的影响能被 B 观察到，“影响”包括修改了内存中的共享变量的值、发送了消息、调用了方法等。

1. 程序次序规则（Program Order Rule）：在一个线程内，程序的执行规则跟程序的书写规则是一致的，从上往下执行。
2. 管程锁定规则（Monitor Lock Rule）：一个 Unlock 的操作肯定先于下一次 Lock 的操作。这里必须是同一个锁。同理我们可以认为在 synchronized 同步同一个锁的时候，锁内先行执行的代码，对后续同步该锁的线程来说是完全可见的。
3. volatile 变量规则（volatile Variable Rule）：对同一个 volatile 的变量，先行发生的写操作，肯定早于后续发生的读操作。
4. 线程启动规则（Thread Start Rule）：Thread 对象的 `start()` 方法先行发生于此线程的没一个动作。
5. 线程中止规则（Thread Termination Rule）：Thread对象的中止检测（如：`Thread.join()`，`Thread.isAlive()` 等）操作，必行晚于线程中所有操作。
6. 线程中断规则（Thread Interruption Rule）：对线程的 `interruption()` 调用，先于被调用的线程检测中断事件(`Thread.interrupted()`)的发生。
7. 对象中止规则（Finalizer Rule）：一个对象的初始化方法先于一个方法执行 `Finalizer()` 方法。
8. 传递性（Transitivity）：如果操作 A 先于操作 B、操作B先于操作 C,则操作 A 先于操作 C。

#### volatile 关键字

`volatile` 关键字是 Java 中的一个轻量级同步机制，具有以下特性：

- 保证可见性：当一个线程修改了一个 `volatile` 变量的值，其他线程能够立即看到这个修改。
- 不保证原子性：对 `volatile` 变量的复合操作（例如自增、自减）不是原子操作，可能会导致线程安全问题。
- 禁止指令重排序：编译器和处理器在执行代码时可能会进行指令重排序，使用 `volatile` 可以禁止这种重排序，保证代码的执行顺序。

下面是一个使用 `volatile` 来解决可见性的示例：

```java
public class Main {
    private static volatile boolean flag = false;

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            while (!flag) {
                // 等待 flag 变为 true
            }
            System.out.println("Flag is true, thread t1 is exiting...");
        });
        Thread t2 = new Thread(() -> {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            flag = true; // 修改 flag 的值
            System.out.println("Flag is set to true by thread t2...");
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
    }
}
```

上面的代码如果不使用 `volatile` 关键字，那么线程 t1 可能永远无法看到线程 t2 修改的 `flag` 的值，导致线程 t1 永远在循环中等待。而使用了 `volatile` 之后，线程 t1 能够立即看到线程 t2 修改的 `flag` 的值，从而正确地退出循环。

## 线程池

为了提高线程的复用性和系统的性能，Java 提供了线程池机制，线程池可以管理和复用线程，避免了频繁创建和销毁线程带来的开销。

Java 中提供了以下几种线程池：

- `FixedThreadPool`：固定大小的线程池。
- `CachedThreadPool`：根据需要创建线程的线程池。
- `SingleThreadExecutor`：单线程的线程池。
- `ScheduledThreadPool`：可以执行定时任务的线程池。

例如，使用一个固定大小的线程池执行若干任务：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
        for (int i = 0; i < 10; i++) {
            pool.execute(() -> {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            });
        }
        pool.shutdown();
        pool.close();
    }
}
```

::: tip

`FixedThreadPool` 和 `SingleThreadExecutor` 底层都是用 `LinkedBlockingQueue` 实现的，这个队列最大长度为 `Integer.MAX_VALUE`，容易导致 OOM。所以实际生产一般自己通过 `ThreadPoolExecutor` 的 7 个参数，自定义线程池。

:::

### 手动创建线程池

JDK 中创建线程池源码：

```java
public ThreadPoolExecutor(int corePoolSize,
                            int maximumPoolSize,
                            long keepAliveTime,
                            TimeUnit unit,
                            BlockingQueue<Runnable> workQueue,
                            ThreadFactory threadFactory,
                            RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

七大参数解释：

- corePoolSize：线程池的基本大小。

  当新任务在方法 execute(java.lang.Runnable) 中提交时，如果运行的线程少于 corePoolSize，则创建新线程来处理请求，即使其他辅助线程是空闲的。如果运行的线程多于 corePoolSize 而少于 maximumPoolSize，则仅当队列满时才创建新线程。如果设置的 corePoolSize 和 maximumPoolSize 相同，则创建了固定大小的线程池。如果将 maximumPoolSize 设置为基本的无界值（如 Integer.MAX_VALUE），则允许池适应任意数量的并发任务。

- maximumPoolSize：能容纳的最大线程数(池子的最大容量)，如果使用了无界的任务队列 `PriorityBlockingQueue` 这个参数就没什么效果，此值与 CPU 核心数和有关。
- keepAliveTime：空闲线程存活时间，超时不用会释放。

  如果池中当前有多于 corePoolSize 的线程，则这些多出的线程在空闲时间超过 keepAliveTime 时将会终止。

- unit：存活的时间单位。
- workQueue：存放提交但未执行任务的队列，阻塞队列。
- threadFactory：创建线程的工厂类。
- handler：等待队列满后的拒绝策略。

::: tip

最大并发：能容纳的最大线程数(池子的最大容量)+阻塞队列大小。

:::

四大拒绝策略：

```java
// 多余不处理，抛出异常
public static class AbortPolicy implements RejectedExecutionHandler
// 哪里来回哪去,交由原线程处理
public static class CallerRunsPolicy implements RejectedExecutionHandler
// 队列满了，去和最久的任务竞争，没有异常
public static class DiscardOldestPolicy implements RejectedExecutionHandler
// 丢掉任务，没有异常
public static class DiscardPolicy implements RejectedExecutionHandler
```

## Future

要使用线程池执行多个任务，提交的任务只需要实现 `Runnable` 接口，就可以交给线程池运行：

```java
class Task implements Runnable {
    @Override
    public void run() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println("task finished");
    }
}

public class Main {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(3);
        try {
            pool.submit(new Task());
        } finally {
            pool.shutdown();
            pool.close();
        }
    }
}
```

但是 `Runnable` 接口的 `run` 方法没有返回值，所以无法获取任务的执行结果，如果需要获取任务的执行结果，可以使用 `Callable` 接口，`Callable` 接口的 `call` 方法是有返回值的，例如：

```java
class Task implements Callable<String> {

    @Override
    public String call() throws Exception {
        Thread.sleep(3000);
        return "call() method executed";
    }
}

public class Main {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(3);
        try {
            Future<String> future = pool.submit(new Task());
            System.out.println(future.get());
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            pool.shutdown();
            pool.close();
        }
    }
}
```

将 `Callable` 任务提交给线程池后，会返回一个 `Future` 对象，`Future` 对象可以用来获取任务的执行结果，调用 `get` 方法会阻塞当前线程，直到任务执行完成并返回结果。

将 `Runnable` 任务提交给线程池后，也会返回一个 `Future` 对象，但是 `Future` 对象的 `get` 方法会返回 `null`，因为 `Runnable` 任务没有返回值。

`Future` 主要有以下几个方法：

- `get()`：获取任务的执行结果，如果任务没有执行完成，那么会阻塞当前线程，直到任务执行完成并返回结果。
- `get(long timeout, TimeUnit unit)`：获取任务的执行结果，如果任务没有执行完成，那么会阻塞当前线程，直到任务执行完成并返回结果或者超时。
- `cancel(boolean mayInterruptIfRunning)`：取消任务的执行，如果任务已经执行完成或者已经被取消了，那么返回 `false`，否则返回 `true`。
- `isCancelled()`：判断任务是否被取消了。
- `isDone()`：判断任务是否已经执行完成了。

## CompletableFuture

在使用 `Future` 获取任务的执行结果时，要么调用 `get` 方法阻塞当前线程等待结果，要么使用 `isDone` 方法轮询任务是否执行完成了，这样的方式比较麻烦，Java 8 引入了 `CompletableFuture` 类，它是 `Future` 的改进，可以传入回调对象，自动调用回调对象的回调方法来获取任务的执行结果，例如：

```java
class Task implements Callable<String> {
    @Override
    public String call() throws Exception {
        Thread.sleep(3000);
        return "call() method executed";
    }
}

public class Main {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(3);
        try {
            CompletableFuture.supplyAsync(() -> {
                try {
                    return new Task().call();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }, pool).thenAccept(System.out::println);
        } finally {
            pool.shutdown();
            pool.close();
        }
    }
}
```

通过 `CompletableFuture.supplyAsync` 方法可以创建一个 `CompletableFuture` 对象，并且传入一个 `Supplier` 函数式接口来执行任务，任务执行完成后会自动调用 `thenAccept` 方法来获取任务的执行结果。同时，还可以通过 `exceptionally` 方法来处理任务执行过程中抛出的异常，例如：

```java
class Task implements Callable<String> {
    @Override
    public String call() throws Exception {
        Thread.sleep(3000);
        throw new RuntimeException("Exception in call() method");
    }
}

public class Main {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(3);
        try {
            CompletableFuture.supplyAsync(() -> {
                try {
                    return new Task().call();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }, pool).thenAccept(System.out::println).exceptionally((e) -> {
                System.out.println("exception!");
                e.printStackTrace();
                return null;
            });
        } finally {
            pool.shutdown();
            pool.close();
        }
    }
}
```

除了这几个简单的用法之外，`CompletableFuture` 还提供了很多其他的方法，例如 `thenApply`、`thenCombine`、`thenCompose`、`allOf`、`anyOf` 等，这些方法可以用来实现更复杂的异步编程，例如通过 `thenCombine` 方法可以将两个 `CompletableFuture` 的结果进行组合、通过 `allOf` 方法可以等待多个 `CompletableFuture` 都执行完成了再继续执行后续的代码等等。

## ForkJoin

ForkJoin 是 Java 7 引入的一种并行计算框架，它基于分治算法来实现的，如果一个任务足够小，那么就直接计算，否则将大任务拆分若干小任务分开计算。

例如，实现一个从 1 加到 20000 的任务：

::: code-tabs#ForkJoin

@tab SumTask

```java
public class SumTask extends RecursiveTask<Long> {
    private static final int THRESHOLD = 1000;
    private final long start;
    private final long end;
    public SumTask(long start, long end) {
        this.start = start;
        this.end = end;
    }
    @Override
    protected Long compute() {
        if (end - start <= THRESHOLD) {
            long sum = 0;
            for (long i = start; i <= end; i++) {
                sum += i;
            }
            return sum;
        } else {
            long mid = (start + end) / 2;
            SumTask left = new SumTask(start, mid);
            SumTask right = new SumTask(mid + 1, end);
            left.fork();
            right.fork();
            return left.join() + right.join();
        }
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        SumTask task = new SumTask(1, 20000);
        long result = ForkJoinPool.commonPool().invoke(task);
        System.out.println(result);
    }
}
```

:::

可以看到，要想使用 ForkJoin，首先需要创建一个继承自 `ForkJoinTask` 的任务类，并且实现 `compute` 方法，在 `compute` 方法中判断任务是否足够小，如果足够小了就直接计算，否则就将大任务拆分成若干个小任务，然后通过 `fork` 方法或者 `invokeAll` 方法来异步执行这些小任务，最后通过 `join` 方法来获取这些小任务的执行结果并进行合并。

ForkJoin 的特点是工作窃取算法，线程池中的线程在执行任务时，如果发现自己没有任务可执行了，那么就会去其他线程的任务队列中窃取任务来执行，这样就可以提高线程的利用率和系统的性能。

## ThreadLocal

在代码中使用 `Thread.currentThread()` 可以获取当前线程的引用：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            System.out.println(Thread.currentThread().threadId());
        });
        thread.start();
        thread.join();
        System.out.println(Thread.currentThread().threadId());
    }
}
```

有时候我们需要在一个线程中存储一些数据，并且这个数据对于其他线程来说是不可见的，这时候就可以使用 `ThreadLocal` 来实现，例如在后端应用中传递用户身份信息、租户信息、请求 id 等等，例如：

```java
public class Main {
    private static final ThreadLocal<String> threadLocal = new ThreadLocal<>();
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            threadLocal.set("Thread 1");
            System.out.println(threadLocal.get());
        });
        Thread t2 = new Thread(() -> {
            threadLocal.set("Thread 2");
            System.out.println(threadLocal.get());
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
    }
}
```

`ThreadLocal` 通常是以一个静态变量的形式存在的，这样就可以在任何地方通过 `ThreadLocal` 的 `get` 方法来获取当前线程的变量值了。

`ThreadLocal` 可以看作是一个全局的 `Map<Thread, Object>`，每个线程获取 `ThreadLocal` 的值时，实际上是通过当前线程的引用来作为 Map 的 key，所以每个线程都可以有自己独立的变量副本，互不干扰。

特别的，`ThreadLocal` 在使用后一定要调用 `remove` 方法来清除线程中的变量值，否则可能会导致内存泄漏的问题，尤其是在使用线程池的场景下，因为线程池中的线程是复用的，如果不清除变量值，那么就可能会导致不同任务之间的数据污染。

## 虚拟线程

在 JDK19 中引入了虚拟线程（Virtual Thread，JDK21 正式发布），它是一种轻量级的线程实现，虚拟线程的创建和销毁的开销非常小，可以支持大量的并发线程，适用于 I/O 密集型的场景，实际上是协程类似物。

创建虚拟线程有多种方式，最简单的方式是通过 `Thread.startVirtualThread` 方法来创建一个虚拟线程并立即运行，例如：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = Thread.startVirtualThread(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("Hello from virtual thread!");
        });
        thread.join();
    }
}
```

第二种方法是创建虚拟线程但是不运行：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = Thread.ofVirtual().unstarted(() -> {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("Hello from virtual thread!");
        });
        thread.start();
        thread.join();
    }
}
```

第三种方法是通过 `ThreadFactory` 来创建虚拟线程：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ThreadFactory factory = Thread.ofVirtual().factory();

        Thread thread = factory.newThread(() -> {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("Hello from virtual thread!");
        });
        thread.start();
        thread.join();
    }
}
```

当调用虚拟线程的 `start` 实际上是将线程交给了 `ForkJoinPool` 来调度执行的，也可以手动指定执行器，然后运行：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor();
        pool.submit(() -> {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("Hello from virtual thread!");
        });
        pool.shutdown();
        pool.close();
    }
}
```

虚拟线程的优势在于它的创建和销毁的开销非常小，可以支持大量的并发线程，适用于 I/O 密集型的场景，例如在一个 Web 服务器中，每个请求都可以分配一个虚拟线程来处理，这样就可以大大提高服务器的并发性能。

虚拟线程的调度是由 Java 来调度的，虚拟线程和平台线程之间是多对一的关系，JDK21 中使用了一个大小等于 CPU 核数的 `ForkJoinPool` 来调度和运行虚拟线程。可以引发虚拟线程调度的情况如下：

- 文件 IO。
- 网络 IO。
- 使用 `Concurrent` 库引发的等待。
- `Thread.sleep`。

这是因为 JDK 对这些情况的底层进行了修改，因此，还有的情况不会触发调度，例如：

- 绕过 JDK 的 IO 接口。
- 直接通过 JNI 调用系统的 IO 接口。
- `synchronized` 块也无法触发调度。

### 虚拟线程与 ThreadLocal

由于可以轻松创建大量虚拟线程，因此 `ThreadLocal` 可能会变得很重，同时更加容易内存泄漏。

因此 JDK21 中引入了 `ScopedValue`，允许在特定代码块中定义和访问线程范围内的值，值的生命周期和代码块绑定，而不是和线程绑定。同时也更加适合虚拟线程，性能更高。

`ScopedValue` 的基础使用：

```java
public class Main {
    static final ScopedValue<String> ACCOUNT_ID = ScopedValue.newInstance();
    public static void main(String[] args) throws InterruptedException {
        ScopedValue.where(ACCOUNT_ID, "test").run(() -> {
            System.out.println("Current Account ID: " + ACCOUNT_ID.get());
        });
        System.out.println(ACCOUNT_ID.get());
    }
}
```

上述代码中，由于 `System.out.println(ACCOUNT_ID.get());` 语句不在 `ScopedValue.where` 定义的代码块中，因此会抛出异常。

在虚拟线程中使用：

```java
public class Main {
    static final ScopedValue<String> ACCOUNT_ID = ScopedValue.newInstance();
    public static void main(String[] args) throws InterruptedException {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 5; i++) {
                int id = i;
                executor.submit(() -> {
                    ScopedValue.where(ACCOUNT_ID, "Aid-" + id).run(() -> {
                        System.out.println("Thread: " + Thread.currentThread() + ", Aid: " + ACCOUNT_ID.get());
                    });
                });
            }
        }
    }
}
```

`ScopedValue` 还支持嵌套，内层的值将覆盖外层的值：

```java
public class Main {
    static final ScopedValue<String> ACCOUNT_ID = ScopedValue.newInstance();
    public static void main(String[] args) throws InterruptedException {
        ScopedValue.where(ACCOUNT_ID, "32").run(() -> {
            System.out.println("Outer scope aid: " + ACCOUNT_ID.get());

            ScopedValue.where(ACCOUNT_ID, "64").run(() -> {
                System.out.println("Inner scope aid: " + ACCOUNT_ID.get());
            });

            System.out.println("Back to outer scope aid: " + ACCOUNT_ID.get());
        });
    }
}
```
