# 深入单例模式

## 饿汉式

```java
public class Hungry {

//    饿汉式，开始时就分配全部空间，可能浪费空间
    byte[][] bytes = new byte[1024][1024];


    private Hungry(){

    }
    private static final Hungry HUNGRY =new Hungry();

    public static Hungry getInstance(){
        return HUNGRY;
    }
}
```

## 懒汉式

普通懒汉式未实现线程安全：

```java
public class LazyMan {

    private LazyMan(){
        System.out.println(Thread.currentThread().getName()+" run");
    }

    private static LazyMan lazyMan;

    public static LazyMan getInstance(){
        if (lazyMan==null){
            lazyMan=new LazyMan();
        }
        return lazyMan;
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(()->{
                LazyMan.getInstance();
            }).start();
        }
    }
}
```

双重检测的懒汉式(DCL)：

存在指令重排可能的代码：

```java
public class LazyMan {

    private LazyMan(){
        System.out.println(Thread.currentThread().getName()+" run");
    }

    private static LazyMan lazyMan;

    public static LazyMan getInstance(){
        if (lazyMan==null){
            synchronized (LazyMan.class){
                if (lazyMan==null){
                    lazyMan=new LazyMan();//非原子性操作
                    // 1.分配内存空间
                    // 2.执行构造方法
                    // 3.把结果赋值给这个引用
                    // 期望执行顺序：1 2 3
                    // 现在有一个线程A，由于指令重排，导致1 3 2
                    // 此时有一个线程B，在A执行完1 3后进入，由于引用已被赋值
                    // 线程B会直接返回还没有被创建的对象引用
                }
            }
        }

        return lazyMan;
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(()->{
                LazyMan.getInstance();
            }).start();
        }
    }
}
```

使用volatile消除指令重排：

```java
private volatile static LazyMan lazyMan;
```

静态内部类：

```java
public class Holder {
    private Holder(){

    }
    public static Holder getInstance(){
        return InnerClass.holder;
    }
    public static class InnerClass{
        private static Holder holder=new Holder();
    }
}
```

枚举类可以禁止使用反射创建实例：

```java
public enum EnumDemo {

    INSTANCE;

    private EnumDemo getInstance(){
        return INSTANCE;
    }

}
class Test{
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        EnumDemo instance = EnumDemo.INSTANCE;
        System.out.println(instance.hashCode());
        Class<EnumDemo> enumDemoClass = EnumDemo.class;
        // 通过jad反编译获取真实的构造器
        Constructor<EnumDemo> declaredConstructor = enumDemoClass.getDeclaredConstructor(String.class, int.class);
        declaredConstructor.setAccessible(true);
        // Cannot reflectively create enum objects
        EnumDemo enumDemo = declaredConstructor.newInstance();
    }
}
```
