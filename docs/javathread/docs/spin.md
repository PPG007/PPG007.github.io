# 可重入锁、自旋锁

## 可重入锁(递归锁)

在如下代码中，synchronized 的是方法调用者即 home 对象，在执行完 doorA 方法前，这个锁不会释放，所以始终是 A 线程执行完两个方法后，B 线程才开始执行：

```java
public class LocksDemo {
    public static void main(String[] args) {
        Home home = new Home();
        new Thread(()->{
            try {
                home.doorA();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"A").start();

        new Thread(()->{
            try {
                home.doorA();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"B").start();
    }
}
class Home{
    public synchronized void doorA() throws InterruptedException {
        System.out.println(Thread.currentThread().getName()+" enter doorA");
        TimeUnit.SECONDS.sleep(3);
        doorB();
    }
    public synchronized void doorB(){
        System.out.println(Thread.currentThread().getName()+" enter doorB");
    }
}
```

如下代码中，线程 A 执行完 doorA 方法后释放锁去获得 doorB 的锁，此时 B 线程可以获取 doorA 的锁并执行：

::: warning 注意
lock 与 unlock 必须成对出现，否则会出现程序无法继续执行。
:::

```java
public class LocksDemo {
    public static void main(String[] args) {
        Home home = new Home();
        new Thread(()->{
            try {
                home.doorA();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"A").start();

        new Thread(()->{
            try {
                home.doorA();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"B").start();
    }
}
class Home{

    private static final ReentrantLock lock = new ReentrantLock(true);

    public void doorA() throws InterruptedException {
        try {
            lock.lock();
            System.out.println(Thread.currentThread().getName()+" enter doorA");
            TimeUnit.SECONDS.sleep(3);
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
        doorB();
    }

    public void doorB(){
        try {
            lock.lock();
            System.out.println(Thread.currentThread().getName()+" enter doorB");
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }

    }
}
```

## 自旋锁

::: tip 自旋锁
是指当一个线程在获取锁的时候，如果锁已经被其它线程获取，那么该线程将循环等待，然后不断的判断锁是否能够被成功获取，直到获取到锁才会退出循环。
:::

自旋锁示例：

```java
public class SpinLock {

    private static final AtomicStampedReference<Integer> REFERENCE =new AtomicStampedReference<>(0,1);

    public static void main(String[] args) {
        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(10);
                REFERENCE.compareAndSet(0,1,1,2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"A").start();

        new Thread(()->{
            // 未满足条件前，线程B将会循环等待
            while (!REFERENCE.compareAndSet(1,2,2,3)){
                try {
                    TimeUnit.SECONDS.sleep(1);
                    System.out.println(Thread.currentThread().getName()+" is waiting");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"B").start();

        while (Thread.activeCount()>2){
            Thread.yield();
        }
        System.out.println(REFERENCE.getReference().intValue());
    }
}
```
