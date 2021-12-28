# Class 对象

```java
public class Test1 {
    public static void main(String[] args) throws ClassNotFoundException {
//        一个类在内存中只有一个Class对象
//        一个类被加载后，类的整个结构都会封装在Class对象中

//        方式一：通过对象.getClass()获得
        User user = new User();
        Class<? extends User> aClass1 = user.getClass();
        System.out.println(aClass1.hashCode());
//        方式二：forName,适用于运行时动态获取Class对象
        Class<?> aClass = Class.forName("reflection.entity.User");
        System.out.println(aClass.hashCode());
//        方式三：通过类名.Class
        Class<User> userClass = User.class;
        System.out.println(userClass.hashCode());
//        方式四：基本内置类型的包装类都有一个Type属性
        Class<Integer> type = Integer.TYPE;
        System.out.println(type.getName());
    }
}
```
