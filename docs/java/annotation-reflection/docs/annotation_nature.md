# 注解的本质

注解的本质就是一个 Annotation 接口。

```java
/**Annotation接口源码*/
public interface Annotation {

    boolean equals(Object obj);

    int hashCode();

    Class<? extends Annotation> annotationType();
}
```

注解本身就是 Annotation 接口的子接口，也就是说注解中其实是可以有属性和方法，但是接口中的属性都是 static final 的，对于注解来说没什么意义，而我们定义接口的方法就相当于注解的属性，也就对应了前面说的为什么注解只有属性成员变量，其实他就是接口的方法，这就是为什么成员变量会有括号，不同于接口我们可以在注解的括号中给成员变量赋值。
