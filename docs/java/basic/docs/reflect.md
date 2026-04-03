# 反射

## Class 类

每加载一种类，JVM 就会为其创建一个 Class 对象的实例。

这个 Class 对象的构造方法时私有的，也就是说只有 JVM 才能创建 Class 对象的实例。

由于 JVM 为每个加载的类创建了对应的 Class 实例，并在实例中保存了该 class 的所有信息，包括类名、方法、属性、构造器等，所以我们可以通过 Class 对象来获取类的相关信息。

这种通过 Class 对象来获取类的相关信息的机制就叫做**反射**。

### 获取 Class 对象的方式

方法一：通过访问类的静态属性 `class` 来获取 Class 对象：

```java
Class<String> stringClass = String.class;
```

方法二：通过实例对象的 `getClass()` 方法来获取 Class 对象：

```java
String str = "";
Class<? extends String> aClass = str.getClass();
```

方法三：如果知道一个类的全限定名（包名 + 类名），可以通过 `Class.forName()` 方法来获取 Class 对象：

```java
Class<?> aClass = Class.forName("java.lang.String");
```

由于 Class 实例在 JVM 中是唯一的，所以无论通过哪种方式获取 Class 对象，得到的都是同一个实例。

### 获取实例的基本信息

通过 Class 对象的一系列方法，我们可以获取类的基本信息：

```java
public class Main {
    static void printClassInfo(Class c) {
        System.out.println("Class name: " + c.getName());
        System.out.println("Simple name: " + c.getSimpleName());
        if (c.getPackage() != null) {
            System.out.println("Package name: " + c.getPackage().getName());
        }
        System.out.println("is interface: " + c.isInterface());
        System.out.println("is enum: " + c.isEnum());
        System.out.println("is array: " + c.isArray());
        System.out.println("is primitive: " + c.isPrimitive());
    }
    static void main() {
        printClassInfo(String.class);
        printClassInfo(Integer.class);
    }
}
```

### 通过 Class 构造实例

如果获取到了一个 Class 实例，那么就可以通过它来创建该类的实例：

```java
Class<String> stringClass = String.class;
String s = stringClass.newInstance();
System.out.println(s);
```

`newInstance()` 方法会调用该类的无参构造器来创建实例，所以如果该类没有无参构造器，或者无参构造器不可访问，就会抛出异常。这个方法在 JDK 9 中被废弃了，推荐使用 `getDeclaredConstructor().newInstance()` 来创建实例：

```java
static void main() throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
    Class<String> stringClass = String.class;
    String s = stringClass.getDeclaredConstructor(String.class).newInstance("test");
    System.out.println(s);
}
```

### 动态加载

JVM 在执行程序时并不是一次性加载所有的类，而是当第一次使用一个类时才会加载。

利用这一个特性，可以实现在运行时根据不同的条件加载不同的实现类，例如 Log4j 和 Logback 都是日志框架的实现类，我们可以在运行时根据配置文件来加载不同的日志框架。

## 访问字段

Class 类提供了一系列方法来访问类的字段：

- `getField(String name)`：获取指定名称的公共字段，包括父类。
- `getFields()`：获取所有公共字段，包括父类。
- `getDeclaredField(String name)`：获取指定名称的字段（包括私有字段，但不包括父类）。
- `getDeclaredFields()`：获取所有字段（包括私有字段，但不包括父类）。

一个 Field 对象包含了一个字段的所有信息：

- `getName()`：获取字段的名称。
- `getType()`：获取字段的类型。
- `getModifiers()`：获取字段的修饰符。

例如，对于下面这么两个类：

```java
public class Base {
    private String privateBaseStr;
    public int publicBaseInt;
}

public class Extend extends Base{
    private boolean privateExtendBool;
     public double publicExtendDouble;
}
```

我们可以通过反射来获取它们的字段信息：

```java
static void main() throws Exception {
    Extend extend = new Extend();
    Class<? extends Extend> extendClass = extend.getClass();
    Field[] fields = extendClass.getFields();
    for (Field field : fields) {
        System.out.println(field.getName());
        System.out.println(field.getType());
        System.out.println(field.getModifiers());
    }
}
```

### 获取字段值

通过 Field 对象的 `get(Object obj)` 方法可以获取字段的值：

```java
static void main() throws Exception {
    Extend extend = new Extend(true, 2.2);
    Class<? extends Extend> extendClass = extend.getClass();
    Field[] fields = extendClass.getFields();
    for (Field field : fields) {
        field.setAccessible(true);
        System.out.println(field.get(extend));
    }
}
```

注意如果访问私有字段时，必须先调用 `setAccessible(true)` 来取消 Java 语言访问检查，否则会抛出 `IllegalAccessException` 异常。

### 设置字段值

与获取字段值类似，通过 Field 对象的 `set` 系列方法可以设置字段的值：

```java
static void main() throws Exception {
    Extend extend = new Extend(true, 2.2);
    Class<? extends Extend> extendClass = extend.getClass();
    Field field = extendClass.getDeclaredField("privateExtendBool");
    field.setAccessible(true);
    field.setBoolean(extend, false);
    field = extendClass.getDeclaredField("publicExtendDouble");
    field.setDouble(extend, 3.3);
    System.out.println(extend);
}
```

## 调用方法

与获取字段类似，Class 类也提供了一系列方法来访问类的方法：

- `getMethod(String name, Class<?>... parameterTypes)`：获取指定名称和参数类型的公共方法，包括父类。
- `getMethods()`：获取所有公共方法，包括父类。
- `getDeclaredMethod(String name, Class<?>... parameterTypes)`：获取指定名称和参数类型的方法（包括私有方法，但不包括父类）。
- `getDeclaredMethods()`：获取所有方法（包括私有方法，但不包括父类）。

当我们拿到 Method 对象之后，就可以进行调用，例如：

::: code-tabs#method

@tab Main.class

```java
public class Main {
    static void main() throws Exception {
        Class<Calculator> clazz = Calculator.class;
        Method sum = clazz.getMethod("sum", int.class, int.class);
        int sumValue = (int)sum.invoke(new Calculator(), 1, 2);
        Method min = clazz.getMethod("min", int.class, int.class);
        int minValue = (int)min.invoke(new Calculator(), 1, 2);
        System.out.println("Sum: " + sumValue);
        System.out.println("Min: " + minValue);
    }
}
```

@tab Calculator.class

```java
public class Calculator {
    public int sum(int a, int b) {
        return a + b;
    }
    public int min(int a, int b) {
        return Math.min(a, b);
    }
}
```

:::

### 调用静态方法

调用静态方法时，`invoke` 方法的第一个参数可以传入 `null`：

```java
static void main() throws Exception {
    Class<Math> clazz = Math.class;
    Method max = clazz.getMethod("max", int.class, int.class);
    int maxValue = (int)max.invoke(null, 1, 2);
    System.out.println("Max: " + maxValue);
}
```

### 调用私有方法

调用私有方法时，必须先调用 `setAccessible(true)` 来取消 Java 语言访问检查，否则会抛出 `IllegalAccessException` 异常：

```java
static void main() throws Exception {
    Class<Calculator> clazz = Calculator.class;
    Method privateMethod = clazz.getDeclaredMethod("privateMethod");
    privateMethod.setAccessible(true);
    String result = (String)privateMethod.invoke(new Calculator());
    System.out.println(result);
}
```

### 多态

反射调用方法时，仍然遵循多态原则，即总是调用实际类型的覆写方法。

## 调用构造方法

与获取字段和方法类似，Class 类也提供了一系列方法来访问类的构造方法：

- `getConstructor(Class<?>... parameterTypes)`：获取指定参数类型的公共构造方法。
- `getConstructors()`：获取所有公共构造方法。
- `getDeclaredConstructor(Class<?>... parameterTypes)`：获取指定参数类型的构造方法（包括私有构造方法）。
- `getDeclaredConstructors()`：获取所有构造方法（包括私有构造方法）。

Constructor 总是当前类定义的构造方法，和父类无关，也就不存在多态问题。

调用私有构造器前，同样需要先调用 `setAccessible(true)` 来取消 Java 语言访问检查，否则会抛出 `IllegalAccessException` 异常。

## 获取继承关系

### 获取父类的 Class 对象

通过 Class 对象的 `getSuperclass()` 方法可以获取父类的 Class 对象：

```java
Extend extend = new Extend(false, 0);
Class<?> superclass = extend.getClass().getSuperclass();
System.out.println(superclass);
```

除了 Object 类之外，任何非 `interface` 的 Class 都有一个父类类型。

### 获取实现的接口

通过 Class 对象的 `getInterfaces()` 方法可以获取该类实现的接口：

```java
Class<Integer> clazz = Integer.class;
for (Class<?> aClass : clazz.getInterfaces()) {
    System.out.println(aClass.getName());
}
```

::: tip

`getInterfaces()` 方法只会返回当前类直接实现的接口，如果父类也实现了接口，那么父类实现的接口不会被返回。

对所有的 interface 的 Class 调用 `getSuperclass()` 返回的是 null，获取接口的父接口要用 `getInterfaces()` 方法。

:::

### instanceof

反射中如果要判断一个类和另一个类是否构成向上转型关系，可以使用 `isAssignableFrom()` 方法：

```java
Class<Base> bClazz = Base.class;
Class<Extend> eClazz = Extend.class;
System.out.println(bClazz.isAssignableFrom(eClazz));
System.out.println(eClazz.isAssignableFrom(bClazz));
```

## 动态代理

在之前的代码中，如果要调用一个接口的方法，我们必须先创建一个实现了该接口的类，并创建该类的实例来调用方法。

但是有时我们并不想创建一个具体的类来实现接口，而是想在运行时动态地创建一个实现了该接口的类，并调用方法。例如在 RPC 中，我们需要在客户端中通过接口来定义方法，但是接口的实现位于服务器端，我们希望在客户端动态地创建一个实现了该接口的类来调用方法。

JDK 标准库中提供了一个包括 `Proxy` 类和 `InvocationHandler` 接口的动态代理机制，可以满足这个需求。

::: code-tabs#dynamic-proxy

@tab Main

```java
import java.lang.reflect.Proxy;

public class Main {
    static void main() throws Exception {
        IService service = (IService)Proxy.newProxyInstance(
                IService.class.getClassLoader(),
                new Class[]{IService.class},
                new ServiceProxyImpl()
        );
        service.run("test");
        System.out.println(service.getAccountId());
    }
}
```

@tab IService

```java
public interface IService {
    void run(String accountId);
    String getAccountId();
}
```

@tab ServiceProxyImpl

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.Arrays;

public class ServiceProxyImpl implements InvocationHandler {
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // may send rpc request here
        System.out.printf("method: %s, args: %s\n", method.getName(), Arrays.toString(args));
        Class<?> returnType = method.getReturnType();
        // check return type is void
        if (returnType == void.class) {
            System.out.println("return void method");
            return null;
        }
        if (returnType == String.class) {
            System.out.println("return string method");
            return "test";
        }
        throw new RuntimeException("unsupported return type: " + returnType);
    }
}
```

:::

实现动态代理的流程如下：

- 定义一个 InvocationHandler 接口的实现类，在 `invoke` 方法中编写调用逻辑。
- 通过 `Proxy.newProxyInstance()` 方法创建一个动态代理实例，这个方法需要三个参数：
    - 类加载器：通常使用接口的类加载器。
    - 接口数组：动态代理类需要实现的接口列表。
    - InvocationHandler 实现类的实例：当调用动态代理实例的方法时，会调用 InvocationHandler 的 `invoke` 方法。
- 将返回的 Object 强转为接口类型，就可以调用接口的方法了。
