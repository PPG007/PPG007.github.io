# 引用传递与值传递

Java中处理 8 种基本的数据类型用的是*值传递*，其他所有类型都用的是*引用传递*。

::: tip
按引用传递的实质是将地址值的副本作为实参代替方法中的形参
:::

例如下面的代码：

```java
@Test
public void test1(){
    Integer integer = new Integer(11);
    System.out.println(integer.intValue());
    change(integer);
    System.out.println(integer.intValue());
}

public void change(Integer integer){
    integer=new Integer(123);
}
```

两次输出都是 11，因为 change 方法中修改的是引用副本的指向，源引用不变，如果对引用的内部成员进行操作，则会直接影响到原对象，但是如果直接把此引用指向了其他对象，这个引用从此以后，便与之前的对象没有任何关系，当前代表的仅仅是新指向的对象。
