# 阻塞队列

::: tip
写入：如果队列满了，就必须阻塞等待。

取：如果队列为空，就必须阻塞等待生产。

阻塞队列使用场景：多线程并发、线程池。
:::

## 阻塞队列的四组API

| 方式         | 抛出异常  | 有返回值，不抛出异常 | 阻塞、等待 | 超时等待                                |
| ------------ | --------- | -------------------- | ---------- | --------------------------------------- |
| 添加         | add()     | offer()              | put()      | offer(E e, long timeout, TimeUnit unit) |
| 移除         | remove()  | poll()               | take()     | poll(long timeout, TimeUnit unit)       |
| 获取队首元素 | element() | peek()               | -          | -                                       |

- 抛出异常：

  ```java
  ArrayBlockingQueue<Object> objects = new ArrayBlockingQueue<>(5);
  for (int i = 0; i < 5; i++) {
  //            队列满会报异常
      System.out.println(objects.add(i));
  }
  System.out.println("=========================");
  for (int i = 0; i < 5; i++) {
  //            队列空会报异常
      System.out.println(objects.remove());
  }
  // 获取队首元素，队空则异常
  System.out.println(objects.element());
  ```

- 有返回值，不抛异常：

  ```java
  ArrayBlockingQueue<Object> objects = new ArrayBlockingQueue<>(5);
  for (int i = 0; i < 6; i++) {
      // 队满返回false
      System.out.println(objects.offer(i));
  }
  System.out.println("=========================");
  for (int i = 0; i < 6; i++) {
      // 队空返回null
      System.out.println(objects.poll());
  }
  // 队空返回null
  System.out.println(objects.peek());
  ```

- 阻塞等待：

  ```java
  ArrayBlockingQueue<Object> objects = new ArrayBlockingQueue<>(5);
  for (int i = 0; i < 6; i++) {
      // 队满，则一直等待
      objects.put(i);
  }
  System.out.println("=========================");
  for (int i = 0; i < 6; i++) {
      // 队空，则一直等待
      System.out.println(objects.take());
  }
  ```

- 超时等待：

  ```java
  ArrayBlockingQueue<Object> objects = new ArrayBlockingQueue<>(5);
  for (int i = 0; i < 6; i++) {
      // 队满，则等待到指定时间后退出
      System.out.println(objects.offer(i, 3, TimeUnit.SECONDS));
  }
  System.out.println("=========================");
  for (int i = 0; i < 6; i++) {
      // 队空，则等待到指定时间后退出
      System.out.println(objects.poll(3, TimeUnit.SECONDS));
  }
  ```

## SynchronousQueue 同步队列

其中每个插入操作必须等待另一个线程相应的删除操作，反之亦然。 同步队列没有任何内部容量，甚至没有一个容量。

::: tip
添加元素后，必须先取出才能继续添加。
:::

仍然可以使用之前的 offer、poll 等方法，但是 offer 和 poll 只能实时。

```java
public class SynchronousQueueDemo {
    public static void main(String[] args) {
        SynchronousQueue<String> strings = new SynchronousQueue<>(true);
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                System.out.println(Thread.currentThread().getName()+"放入了第"+i+"个元素");
                try {
                    strings.put(i + "");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

        },"线程一").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    TimeUnit.SECONDS.sleep(3);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName()+"获取了第"+i+"个元素");
                try {
                    System.out.println(strings.take());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"线程二").start();
    }
}
```
