# 线程池

## 使用 Executors 创建

单个线程的线程池:

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();
```

固定大小的线程池:

```java
// 参数为当前环境的CPU核心数
ExecutorService service = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
```

可变线程池:

```java
Executor executor = Executors.newCachedThreadPool();
```

使用示例:

```java
public class PoolTest {
    public static void main(String[] args) {
        ExecutorService service = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
        service.execute(new Test());
        service.execute(new Test());
        service.execute(new Test());
        service.execute(new Test());
        service.execute(new Test());
        // 关闭线程池
        service.shutdown();
    }
}
class Test implements Runnable{

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```

::: tip
FixedThreadPool 和 SingleThreadExecutor 底层都是用 LinkedBlockingQueue 实现的，这个队列最大长度为 Integer.MAX_VALUE，容易导致 OOM。所以实际生产一般自己通过 ThreadPoolExecutor 的 7 个参数，自定义线程池。
:::

## 手动创建线程池

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

```java
public class PoolTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService threadPool=new ThreadPoolExecutor(2,5,
                1L, TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(3),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy());
        threadPool.submit(new Test()).get();
        threadPool.shutdown();
    }
}
class Test implements Runnable{

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```

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

## 使用依赖包创建

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>r09</version>
</dependency>
```

```java
public class ThreadPool {
    public static void main(String[] args) {
        //获取系统处理器个数，作为线程池数量
        int nThreads = Runtime.getRuntime().availableProcessors();
        // 不使用JDK提供的线程创建工厂
        ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
                .setNameFormat("demo-pool-%d").build();

//Common Thread Pool
        ExecutorService pool = new ThreadPoolExecutor(5, 200,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>(1024), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());

        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.execute(new MyThread());
        pool.shutdown();
    }
}
class MyThread implements Runnable{

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName()+i);
        }
    }
}
```
