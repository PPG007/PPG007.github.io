# 常用辅助类

## CountDownLatch

ountDownLatch 用给定的计数初始化。 `await` 方法阻塞，直到由于 `countDown()` 方法的调用而导致当前计数达到零，之后所有等待线程被释放，并且任何后续的 `await` 调用立即返回。 这是一个一次性的现象，计数无法重置。如果需要重置计数的版本，请考虑使用 CyclicBarrier 。

```java
public class Utils {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(5);
        for (int i = 0; i < 5; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"run");
                // 数量减一
                countDownLatch.countDown();
            },String.valueOf(i)).start();
        }
        // 等待计数器归零，再向下执行
        countDownLatch.await();
        System.out.println("all Thread Run");
    }
}
```

## CyclicBarrier

允许一组线程全部等待彼此达到共同屏障点的同步辅助。 循环阻塞在涉及固定大小的线程方的程序中很有用，这些线程必须偶尔等待彼此。 屏障被称为循环 ，因为它可以在等待的线程被释放之后重新使用。

```java
public class Utils {
    public static void main(String[] args) throws InterruptedException {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(5,()->{
            System.out.println("all Thread runn");
        });
        for (int i = 0; i < 5; i++) {
            // lambda表达式中不能直接访问i
            int finalI = i;
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"run");
                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            },String.valueOf(i)).start();
        }
    }
}
```

## Semaphore

一个计数信号量。 在概念上，信号量维持一组许可证。 如果有必要，每个 `acquire()` 都会阻塞，直到许可证可用，然后才能使用它。 每个 `release()` 添加许可证，潜在地释放阻塞获取方。但是，没有使用实际的许可证对象; Semaphore 只保留可用数量的计数，并相应地执行。

信号量通常用于限制线程数，而不是访问某些（物理或逻辑）资源。 例如，这是一个使用信号量来控制对一个项目池的访问的类：

```java
public class Utils {
    public static void main(String[] args) throws InterruptedException {
        Semaphore semaphore = new Semaphore(3);
        for (int i = 0; i < 6; i++) {
            new Thread(()->{
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName()+"get the position");
                    Thread.sleep(3000);
                    System.out.println(Thread.currentThread().getName()+"leave the position");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    semaphore.release();
                }
            },String.valueOf(i)).start();
        }
    }
}
```
