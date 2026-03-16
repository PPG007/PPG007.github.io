# 读写锁

ReadWriteLock 维护一对关联的 locks ，一个用于只读操作，一个用于写入。 read lock 可以由多个阅读器线程同时进行，只要没有作者。 write lock 是独家的。

```java
public class ReadWriteLockDemo {
    public static void main(String[] args) {
        Cache cache = new Cache();
        for (int i = 0; i < 10; i++) {
            int finalI = i;
            new Thread(()->{
                cache.put(""+ finalI,""+ finalI);
            },String.valueOf(i)).start();
        }
        for (int i = 0; i < 10; i++) {
            int finalI = i;
            new Thread(()->{
                cache.read(""+ finalI);
            },String.valueOf(i)).start();
        }
    }
}
class Cache{
    private volatile HashMap<String, String> hashMap=new HashMap<>();
    // 自定义公平性
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock(true);

    public void put(String key,String value){
        // 写锁
        readWriteLock.writeLock().lock();
        try {
            System.out.println(Thread.currentThread().getName()+"写入"+key);
            hashMap.put(key, value);
            System.out.println(Thread.currentThread().getName()+"写入完成");
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            // 放开写锁
            readWriteLock.writeLock().unlock();
        }
    }

    public void read(String key){
        // 读锁
        readWriteLock.readLock().lock();
        try {
            System.out.println(Thread.currentThread().getName()+"读取"+key);
            System.out.println(hashMap.get(key));
            System.out.println(Thread.currentThread().getName()+"读取完成");
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            // 放开读锁
            readWriteLock.readLock().unlock();
        }
    }
}
```
