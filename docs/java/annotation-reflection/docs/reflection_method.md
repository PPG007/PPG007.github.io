# 反射常用方法

```java
//        含包名
System.out.println(testClass.getName());

//        不含包名
System.out.println(testClass.getSimpleName());

//        获取类修饰符
//        getModifiers返回一个int，使用Modifier类的方法可以进行判断
System.out.println(testClass.getModifiers());
System.out.println(Modifier.isPublic(testClass.getModifiers()));

//        获取包信息
System.out.println(testClass.getPackage());

//        获取父类的class对象
System.out.println(testClass.getSuperclass());

//        获取接口信息，不包含父类实现的接口
for (Class<?> anInterface : testClass.getInterfaces()) {
    System.out.println(anInterface);
}

//        获取构造函数,只能获取到public修饰的构造函数。需要捕获NoSuchMethodException异常。
for (Constructor<?> constructor : testClass.getConstructors()) {
    System.out.println(constructor);
}

//        通过无参构造器创建对象，没有无参构造器会报错
User user = (User) aClass.newInstance();
System.out.println(user);

// 有参构造器创建对象
Constructor<?> declaredConstructor = aClass.getDeclaredConstructor(String.class, int.class);
Object ppg = declaredConstructor.newInstance("ppg", 123);
System.out.println(ppg);

//        通过反射调用普通方法
//        通过反射获取一个方法
//        如果调用的是static方法，invoke()方法第一个参数就用null代替：
Method getName = aClass.getDeclaredMethod("getName");
Method getId = aClass.getMethod("getId");
Object invoke = getName.invoke(ppg);
Object invoke1 = getId.invoke(ppg);
System.out.println("ppg==>"+invoke+invoke1);

//        通过反射设置属性
Field id = aClass.getDeclaredField("id");
//        设置允许修改private属性
id.setAccessible(true);
// 对象名，值
id.set(ppg,1);
System.out.println("ppg==>"+ppg);

// 泛型
public void fx(Map<String, String> map, List<Boolean> booleans) {
        System.out.println("success");
}
Class<Fx> fxClass = Fx.class;
Method fx = fxClass.getMethod("fx", Map.class,List.class);
//        获得泛型的参数类型
Type[] genericParameterTypes = fx.getGenericParameterTypes();
for (Type genericParameterType : genericParameterTypes) {
    System.out.println("泛型的参数类型："+genericParameterType);
    //泛型的参数类型是否等于参数化类型
    if (genericParameterType instanceof ParameterizedType){
        //getActualTypeArguments获得真实的参数类型信息
        Type[] actualTypeArguments = ((ParameterizedType) genericParameterType).getActualTypeArguments();
        for (Type actualTypeArgument : actualTypeArguments) {
            System.out.println(actualTypeArgument);
        }

    }
}
```
