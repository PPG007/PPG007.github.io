# 注解的属性

注解的属性其实和类中定义的变量有异曲同工之处，只是注解中的变量都是成员变量（属性），并且**注解中是没有方法**的，只有成员变量，变量名就是使用注解括号中对应的参数名，变量返回值注解括号中对应参数类型。相信这会你应该会对上面的例子有一个更深的认识。而 `@Repeatable` 注解中的变量则类型则是对应 Annotation（接口）的泛型 Class。

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Repeatable {
    /**
     * Indicates the <em>containing annotation type</em> for the
     * repeatable annotation type.
     * @return the containing annotation type
     */
    Class<? extends Annotation> value();
}
```
