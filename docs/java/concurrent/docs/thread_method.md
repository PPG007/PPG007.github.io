# 线程操作

## 线程停止 stop

- 建议线程正常停止-->利用次数，不建议死循环。
- 建议使用标志位-->设置一个标志位。
- 不要使用 stop 或者 destroy 等过时的方法。

```java
public class ThreadStop implements Runnable{

    private Boolean flag=true;

    @Override
    public void run() {
        int i=1;
        while (flag){
            System.out.println("Thread is running ==> "+i++);
        }
    }

    public void stop(){
        this.flag=false;
    }

    public static void main(String[] args) {
        ThreadStop threadStop = new ThreadStop();
        new Thread(threadStop).start();
        for (int i = 0; i < 90000; i++) {

        }
        threadStop.stop();
    }
}
```

## 线程休眠 sleep

线程休眠存在异常 InterruptedException，且睡眠过程中不会释放锁。

```java
public class ThreadSleep{

    private int start=10000;
    public void show() throws InterruptedException {
        while (start>0){
            // 单位是毫秒
            Thread.sleep(1);
            System.out.println(start--);
        }
    }
    public static void main(String[] args) throws InterruptedException {
        new ThreadSleep().show();
    }
}
```

::: tip sleep 和 wait 的 区别

- wait 会释放锁，sleep 不会。
- wait 必须在同步代码块中，sleep 可以在任何地方。
- wait 不需要捕获异常。

:::

## 线程礼让 yield

当前线程暂停但是不阻塞，线程由运行态转为就绪态，由CPU重新调度，不一定能礼让成功。

```java
public class ThreadYield {
    public static void main(String[] args) {
        YieldTest yieldTest = new YieldTest();
        new Thread(yieldTest,"a").start();
        new Thread(yieldTest,"b").start();
    }
}
class YieldTest implements Runnable{
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName()+"线程开始执行");
        Thread.yield();
        System.out.println(Thread.currentThread().getName()+"线程结束执行");
    }
}
```

## 线程强制执行 join

等待此线程执行完毕后，其他线程继续执行，期间其他线程阻塞：

```java
public class ThreadJoin implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 1000; i++) {
            System.out.println("vip来了"+i);
        }
    }

    public static void main(String[] args) throws InterruptedException {
        ThreadJoin threadJoin = new ThreadJoin();
        Thread thread = new Thread(threadJoin);
        thread.start();
        for (int i = 0; i < 500; i++) {
            if (i==200){
                // main线程阻塞
                // 输出main200后，先输出所有的vip再输出剩下的main
                thread.join();
            }
            System.out.println("main"+i);
        }
    }
}
```

## 观测线程状态

- NEW：线程尚未启动。
- RUNNABLE：线程正在执行。
- TIMED_WAITING：等待另一个线程执行指定动作达到指定等待时间 `Thread.sleep()`。
- TERMINATED：结束的线程。
- BLOCKED：线程阻塞。
- WAITING：等待另一个线程执行特定动作。

```java
public class ThreadState {
    public static void main(String[] args) throws InterruptedException {
        Thread thread=new Thread(()->{
            for (int i = 0; i < 10; i++) {
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("//////////");
        });

        System.out.println(thread.getState());

        thread.start();
        System.out.println(thread.getState());

        while (thread.getState()!= Thread.State.TERMINATED){
            Thread.sleep(100);
            System.out.println(thread.getState());
        }
    }
}
```

## 守护线程

```java
public class DaemonTest {
    public static void main(String[] args) {
        Daemon daemon = new Daemon();
        Thread thread = new Thread(daemon, "daemon");
        // 开启守护线程，默认为false
        thread.setDaemon(true);
        thread.start();
        BeenDaemon beenDaemon = new BeenDaemon();
        new Thread(beenDaemon).start();
    }
}
class Daemon implements Runnable{
    @Override
    public void run() {
        while (true){
            System.out.println("守护线程");
        }
    }
}
class BeenDaemon implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 36600; i++) {
            System.out.println("living");
        }
        System.out.println("ending");
    }
}
```

## 线程优先级

JDK 中：

```java
// 优先级最小值
public final static int MIN_PRIORITY = 1;
// 优先级默认值
public final static int NORM_PRIORITY = 5;
// 优先级最大值
public final static int MAX_PRIORITY = 10;
```

设置优先级：

::: tip
优先级低只代表获取调度的概率低，优先级低的不一定会比优先级高的执行的慢或晚。
:::

```java
public class PriorityTest {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getPriority());
        MyPriority myPriority = new MyPriority();
        Thread thread = new Thread(myPriority, "t1");
        thread.setPriority(1);
        thread.start();
        Thread thread1 = new Thread(myPriority, "t2");
        thread1.setPriority(5);
        thread1.start();
        Thread thread2 = new Thread(myPriority, "t3");
        thread2.setPriority(10);
        thread2.start();
    }
}
class MyPriority implements Runnable{

    @Override
    public void run() {
        for (int i = 0; i < 214748364; i++) {

        }
        System.out.println(Thread.currentThread().getName()+" ===> "+Thread.currentThread().getPriority());
    }
}
```
