# 原子引用

## 使用原子引用解决 ABA 问题

```java
public class AtomicReferenceDemo {

    private static final AtomicStampedReference<Integer> atomicStampedReference=new AtomicStampedReference<>(0,1);

    public static void main(String[] args) {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
                Runtime.getRuntime().availableProcessors(),
                10,
                5,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.DiscardPolicy()
        );
        System.out.println(atomicStampedReference.compareAndSet(0, 1, 1, 2));
        threadPoolExecutor.execute(()->{
            System.out.println(atomicStampedReference.compareAndSet(1, 0, 2, 3));
        });
        threadPoolExecutor.shutdown();
        while (threadPoolExecutor.isTerminating()){
            Thread.yield();
        }
        // 由于记录戳被修改，这条语句会返回false，最终结果是0
        // 如果不使用原子引用，这里将修改成功
        System.out.println(atomicStampedReference.compareAndSet(0, 5, 2, 3));

        System.out.println(atomicStampedReference.getReference().intValue());
    }
}
```

## 关于 IntegerCache

如果 Integer 值在 -128~127 之间，Integer 对象在 IntegerCache.cache 中产生，这个区间中的 Integer 对象可以直接通过 `==` 进行判断，这个区间以外的所有数据都会在堆上产生，并不会复用已有对象，要使用 equals 方法判断：

```java
public class IntegerDemo {
    public static void main(String[] args) {
        Integer a=100;
        Integer b=100;
        Integer c=1000;
        Integer d=1000;
//        true
        System.out.println(a==b);
//        false
        System.out.println(c==d);
//        true
        System.out.println(a.equals(b));
//        true
        System.out.println(c.equals(d));
    }
}
```
