# Lock锁

## Lock接口

Lock 实现提供比使用 synchronized 方法和语句可以获得的更广泛的锁定操作。 它们允许更灵活的结构化，可能具有完全不同的属性，并且可以支持多个相关联的对象 Condition 。

实现类：

- ReentrantLock：可重入锁。
- ReentrantReadWriteLock.ReadLock：读锁。
- ReentrantReadWriteLock.WriteLock：写锁。

## 公平锁和非公平锁

- 公平锁：可以先来后到。
- 非公平锁：可以插队。

创建可重入锁对象时，可以通过构造器指定是公平锁还是非公平锁，无参构造器返回非公平锁。

## Demo

```java
public class LockTest {
    public static void main(String[] args) {
        TestLock testLock = new TestLock();
        new Thread(testLock).start();
        new Thread(testLock).start();
        new Thread(testLock).start();
    }
}
class TestLock implements Runnable{

    private static int num=10;
    // 创建Lock对象
    private final ReentrantLock lock=new ReentrantLock();
    @Override
    public void run() {
        for (;;){
            // 锁【lock.lock】必须紧跟try代码块，且unlock要放到finally第一行。
            try {
                // 加锁
                lock.lock();
                if (num>0){
                    System.out.println("ticket number==>"+num--);
                    Thread.sleep(1000);
                }else {
                    break;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 解锁
                lock.unlock();
            }


        }
    }
}
```

## Lock 和 synchronized 的区别

- synchronized 是 Java 关键字，Lock 是一个接口。。
- synchronized 无法判断获取锁的状态，Lock 可以判断是否获取到了锁(`isLocked()`)。
- synchronized 会自动释放锁，Lock 需要手动释放锁。
- synchronized 会让其他线程一直等待，Lock 不一定。
- synchronized 可重入，不可中断，非公平。Lock 可重入锁，可以判断锁，公平性可设置。
- synchronized 适于少量代码同步问题，Lock 适合大量代码。
