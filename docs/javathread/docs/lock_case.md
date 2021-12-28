# 锁的不同情况

## 标准情况

```java
public class EightLock {
    public static void main(String[] args) throws InterruptedException {
        先输出A再输出B
        Data data = new Data();
        new Thread(()->{
            data.a();
        }).start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(()->{
            data.b();
        }).start();
    }
}
class Data {
    public synchronized void a(){
        System.out.println("A");
    }
    public synchronized void b(){
        System.out.println("B");
    }
}
```

## a() 方法延迟 4 秒

synchronized 锁的是方法调用者，两个方法是同一个锁，谁先拿到谁执行。

```java
class Data {
    public synchronized void a() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("A");
    }
    public synchronized void b(){
        System.out.println("B");
    }
}
```

## 增加一个普通方法

```java
public class EightLock {
    public static void main(String[] args) throws InterruptedException {
        // 输出：C A
        Data data = new Data();
        new Thread(()->{
            try {
                data.a();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(()->{
            data.c();
        }).start();
    }
}
class Data {
    public synchronized void a() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("A");
    }
    public synchronized void b(){
        System.out.println("B");
    }
    // 非同步方法，不受锁的影响
    public void c(){
        System.out.println("C");
    }
}
```

## 两个对象，两个同步方法

```java
public class EightLock {
    public static void main(String[] args) throws InterruptedException {
        // 两个对象，两个调用者，两把锁
        // 输出：B A
        Data data = new Data();
        Data data1 = new Data();
        new Thread(()->{
            try {
                data.a();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(()->{
            data1.b();
        }).start();
    }
}
class Data {
    public synchronized void a() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("A");
    }
    public synchronized void b(){
        System.out.println("B");
    }

    public void c(){
        System.out.println("C");
    }
}
```

## 增加两个静态同步方法，只有一个对象

```java
public class EightLock {
    public static void main(String[] args) throws InterruptedException {
        // 输出：A B
        Data data = new Data();
        Data data1 = new Data();
        new Thread(()->{
            try {
                data.a();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(()->{
            data.b();
        }).start();
    }
}
class Data {
    // 静态方法在类加载时就被加载，锁的是Class对象，Class对象全局唯一
    public static synchronized void a() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("A");
    }
    public static synchronized void b(){
        System.out.println("B");
    }

    public void c(){
        System.out.println("C");
    }
}
```

## 两个对象，两个静态同步方法

```java
public class EightLock {
    public static void main(String[] args) throws InterruptedException {
        // 输出：A B
        Data data = new Data();
        Data data1 = new Data();
        new Thread(()->{
            try {
                data.a();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(()->{
            data1.b();
        }).start();
    }
}
```

## 一个静态同步方法，一个普通同步方法，一个对象

```java
public class EightLock {
    public static void main(String[] args) throws InterruptedException {
        // 输出：B A
        Data data = new Data();
        Data data1 = new Data();
        new Thread(()->{
            try {
                data.a();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(()->{
            data.b();
        }).start();
    }
}
class Data {
    public static synchronized void a() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("A");
    }
    public synchronized void b(){
        System.out.println("B");
    }

    public void c(){
        System.out.println("C");
    }
}
```

## 一个静态同步方法，一个普通同步方法，两个对象

```java
public class EightLock {
    public static void main(String[] args) throws InterruptedException {
        // 输出：B A
        Data data = new Data();
        Data data1 = new Data();
        new Thread(()->{
            try {
                data.a();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(()->{
            data1.b();
        }).start();
    }
}
class Data {
    public static synchronized void a() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("A");
    }
    public synchronized void b(){
        System.out.println("B");
    }

    public void c(){
        System.out.println("C");
    }
}
```
