# 原型模式

## 定义

用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

实现 Cloneable 接口并重写 Object 类的 clone 方法。

## 原型模式的优点

- 性能优良：原型模式是在内存二进制流的拷贝（堆内存）。
- 逃避构造函数的约束：既是优点也是缺点，直接在内存中拷贝，构造函数不会执行，减少了约束，缺点也是减少了约束。

## 使用场景

- 资源优化场景：类初始化需要消耗非常多的资源`。
- 性能和安全要求的场景：通过 new 创建对象需要非常繁琐的数据准备或访问权限。
- 一个对象多个修改者的场景：一个对象需要提供给其他对象访问，各个调用者可能都需要修改其值，拷贝多个对象供使用。

::: tip
通常与工厂方法模式一起使用。
:::

## 注意事项

构造函数不会被执行。

::: tip 深拷贝与浅拷贝
浅拷贝：

Object 类提供的 clone 方法只拷贝本对象，对象中的数组、引用对象等都不拷贝，还是指向原生对象的内部元素地址，但是 String 会拷贝，此处应当视为基本类型。

引用的成员变量不会被拷贝的条件：

- 这个变量是类的成员变量而不是方法内变量。
- 必须是一个可变的引用对象而不是一个原始类型或不可变对象。

:::

::: warning
深拷贝不要和浅拷贝混合使用，要分开实现。
:::

浅拷贝示例：

```java
protected Object clone() throws CloneNotSupportedException {
    //        浅拷贝
    return super.clone();
}
```

深拷贝示例：

```java
protected Object clone() throws CloneNotSupportedException {

    PrototypeClass prototype = null;
    try{
        prototype = (PrototypeClass) super.clone();
        prototype.strings = (ArrayList<String>)this.strings.clone();
    }catch(CloneNotSupportedException e){
        e.printStackTrace();
    }
    return prototype;
}
```

::: tip clone 与 final
要使用 clone 方法，类成员变量就不要使用 final 关键字。
:::
