# 元注解

元注解顾名思义我们可以理解为注解的注解，它是作用在注解中，方便我们使用注解实现想要的功能。元注解分别有 `@Retention`、 `@Target`、 `@Document`、 `@Inherited` 和 `@Repeatable`（JDK1.8 加入）五种。

## @Retention

Retention 英文意思有保留、保持的意思，它表示注解存在阶段是保留在源码（编译期），字节码（类加载）或者运行期（JVM 中运行）。在 `@Retention` 注解中使用**枚举 RetentionPolicy**来表示注解保留时期。

```java
/**
 * @author 16582
 */
@Retention(RetentionPolicy.CLASS)
@interface annotation1{
//    默认的保留策略，注解在class字节码文件中存在，但运行时无法获得
}

/**
 * @author 16582
 */
@Retention(RetentionPolicy.RUNTIME)
@interface annotation2{
//    注解会在class字节码文件中存在，在运行时可以通过反射获取到
}

/**
 * @author 16582
 */
@Retention(RetentionPolicy.SOURCE)
@interface annotation3{
    //注解只存在于源码中，class字节码文件中不包含
}
```

## @Target

Target 的英文意思是目标，这也很容易理解，使用 `@Target` 元注解表示我们的注解作用的范围就比较具体了，可以是类，方法，方法参数变量等，同样也是通过**枚举类 ElementType**表达作用类型。

```java
@Target(ElementType.TYPE)
@interface annotation4{
//    作用接口、类、枚举、注解
}

@Target(ElementType.FIELD)
@interface annotation5{
//    作用属性字段、枚举的常量
}

@Target(ElementType.METHOD)
@interface annotation6{
//    作用方法
}

@Target(ElementType.PARAMETER)
@interface annotation7{
//    作用方法参数
}

@Target(ElementType.CONSTRUCTOR)
@interface annotation8{
//    作用构造函数
}

@Target(ElementType.LOCAL_VARIABLE)
@interface annotation9{
//    作用局部变量
}

@Target(ElementType.ANNOTATION_TYPE)
@interface annotation10{
//    作用于注解
//    @Retention注解中就使用该属性
}

@Target(ElementType.PACKAGE)
@interface annotation11{
//    作用于包
}

@Target(ElementType.TYPE_PARAMETER)
@interface annotation12{
//    作用于类型泛型，即泛型方法、泛型类、泛型接口 （jdk1.8加入）
}

@Target(ElementType.TYPE_USE)
@interface annotation13{
//    可以用于标注任意类型除了 class （jdk1.8加入）
}
```

## @Document

Document的英文意思是文档。它的作用是能够将注解中的元素包含到 Javadoc 中去。

## @Inherited

Inherited 的英文意思是继承，但是这个继承和我们平时理解的继承大同小异，一个被 `@Inherited` 注解了的注解修饰了一个父类，它的子类也会继承父类的注解。

```java
@Target(ElementType.TYPE)
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@interface InheritedTest{

}

@InheritedTest
class Father{

}

class Son extends Father{

}
public class MetaAnnotation {
    public static void main(String[] args) {
        Class<Son> sonClass = Son.class;
        Annotation[] annotations = sonClass.getAnnotations();
        for (Annotation annotation : annotations) {
            System.out.println(annotation);
        }

    }
}
```

## @Repeatable

Repeatable 的英文意思是可重复的。顾名思义说明被这个元注解修饰的注解可以同时作用一个对象多次，但是每次作用注解又可以代表不同的含义。

```java
/**
 * 一个人喜欢玩游戏，他喜欢玩英雄联盟，绝地求生，极品飞车，尘埃4等，
 * 则我们需要定义一个人的注解，
 * 他属性代表喜欢玩游戏集合，
 * 一个游戏注解，游戏属性代表游戏名称
 * @author 16582*/
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface People {
    Game[] value() ;
}
/**游戏注解
 * @author 16582*/
@Repeatable(People.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Game {
    String value() default "";
}
/**玩游戏类*/
@Game(value = "LOL")
@Game(value = "PUBG")
@Game(value = "NFS")
@Game(value = "Dirt4")
class PlayGame {
}
```
