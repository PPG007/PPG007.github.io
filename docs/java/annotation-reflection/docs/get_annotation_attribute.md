# 获取注解属性

通过反射获取注解的属性。

基本方法：

```java
/**是否存在对应 Annotation 对象*/
public boolean isAnnotationPresent(Class<? extends Annotation> annotationClass) {
    return GenericDeclaration.super.isAnnotationPresent(annotationClass);
}

/**获取 Annotation 对象*/
public <A extends Annotation> A getAnnotation(Class<A> annotationClass) {
    Objects.requireNonNull(annotationClass);

    return (A) annotationData().annotations.get(annotationClass);
}
/**获取所有 Annotation 对象数组*/
public Annotation[] getAnnotations() {
    return AnnotationParser.toArray(annotationData().annotations);
}
```

示例：

::: tip
在获取之前我们自定义的注解必须使用元注解 `@Retention(RetentionPolicy.RUNTIME)`。
:::

```java
public class GetValueTest {
    public static void main(String[] args) throws Exception {
        Class<?> aClass = Class.forName("annotation.Test");

        MyTestAnnotation myTestAnnotation = aClass.getAnnotation(MyTestAnnotation.class);
        System.out.println("annotation.name==>"+myTestAnnotation.name());
        System.out.println("annotation.sex==>"+myTestAnnotation.sex());

        Field test = aClass.getDeclaredField("test");
        test.setAccessible(true);
        Age age = test.getAnnotation(Age.class);
        System.out.println("age.value==>"+age.value());

        Method show = aClass.getDeclaredMethod("show", int.class);
        MethodAnnotation methodAnnotation = show.getAnnotation(MethodAnnotation.class);
        System.out.println("method name==>"+methodAnnotation.methodName());
        Parameter[] parameters = show.getParameters();
        for (Parameter parameter : parameters) {
            Param param = parameter.getAnnotation(Param.class);
            System.out.println(param.value());
        }

        java.lang.reflect.Constructor<?> declaredConstructor = aClass.getDeclaredConstructor();
        Constructor constructor = declaredConstructor.getAnnotation(Constructor.class);
        System.out.println(constructor.constructor());

    }
}

/**
 * @author 16582
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface Age{
    int value();
}

/**
 * @author 16582
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface MyTestAnnotation{
    String name();
    String sex();
}

/**
 * @author 16582
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface MethodAnnotation{
    String methodName();
}

/**
 * @author 16582
 */
@Target(ElementType.CONSTRUCTOR)
@Retention(RetentionPolicy.RUNTIME)
@interface Constructor{
    String constructor();
}

/**
 * @author 16582
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@interface Param{
    String value();
}

@MyTestAnnotation(name = "ppg",sex = "man")
class Test{
    @Age(21)
    private String test;

    @MethodAnnotation(methodName = "show")
    public void show(@Param("show方法有一个a参数")int a){

    }

    @Constructor(constructor = "Test的构造函数")
    public Test() {
    }
}
```
