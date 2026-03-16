# CAS(乐观锁)

## 什么是 CAS

Compare And Swap。

CAS 机制当中使用了 3 个基本操作数：内存地址 V，旧的预期值 A，要修改的新值 B。

更新一个变量的时候，只有当变量的预期值 A 和内存地址 V 当中的实际值相同时，才会将内存地址 V 对应的值修改为 B。

## JDK 中的实例

AtomicInteger 类中自增方法:

```java
public final int getAndIncrement() {
    return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

Unsafe 类:

```java
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    do {
        // 不断获取内存中的值，C++实现
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

    return var5;
}
```

## 应用示例

```java
public class AtomicDemo {

    private static AtomicInteger num = new AtomicInteger(0);

    private static void incr(){
        num.getAndIncrement();
    }

    public static void main(String[] args) throws InterruptedException {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
                Runtime.getRuntime().availableProcessors(),
                10,
                5L,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(5),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.DiscardPolicy());

        for (int i = 0; i < 10; i++) {
            threadPoolExecutor.execute(()->{
                for (int j = 0; j < 5000; j++) {
                    incr();
                }
            });
        }

        threadPoolExecutor.shutdown();

        while (threadPoolExecutor.isTerminating()){
            TimeUnit.SECONDS.sleep(1);
        }
        System.out.println(num);
    }
}
```
