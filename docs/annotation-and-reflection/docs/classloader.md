# 类加载器

```java
public class ClassLoaderTest {
    public static void main(String[] args) throws ClassNotFoundException {
//        获取系统类的加载器
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        System.out.println(systemClassLoader);
//        获取系统类加载器的父类->扩展类加载器
        ClassLoader parent = systemClassLoader.getParent();
        System.out.println(parent);

//        获取扩展类加载器的父类->根加载器(C++编写，获取为null)
        ClassLoader parent1 = parent.getParent();
        System.out.println(parent1);

        Class<?> aClass = Class.forName("reflection.ClassLoaderTest");
        ClassLoader classLoader = aClass.getClassLoader();
        System.out.println(classLoader);

        Class<?> aClass1 = Class.forName("java.lang.Object");
        ClassLoader classLoader1 = aClass1.getClassLoader();
        System.out.println(classLoader1);

//        获取系统类加载器可以加载的路径
        String property = System.getProperty("java.class.path");
        System.out.println(property);
    }
}
```
