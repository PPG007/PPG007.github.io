# 异步回调

```java
public class CompletableFuture<T>
```

## 简单使用

无返回值：

```java
CompletableFuture<Void> completableFuture=CompletableFuture.runAsync(()->{
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    System.out.println(Thread.currentThread().getName());
});
completableFuture.get();
```

有返回值：

```java
CompletableFuture<Integer> completableFuture=CompletableFuture.supplyAsync(()->{
    int a=10/0;
    return 777;
});

System.out.println(completableFuture.whenComplete((integer, throwable) -> {
    // 正常结果
    System.out.println(integer);
    // 错误信息
    System.out.println(throwable.getMessage());
}).exceptionally(throwable -> {
    System.out.println(throwable.getMessage());
    // 出现异常返回值
    return 123;
}).get());
```
