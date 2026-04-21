# 面向对象

## 引用、对象、实例以及类

- 引用：引用是指向对象的变量。它存储了对象在内存中的地址，可以通过引用来访问和操作对象。
- 对象：对象是类的实例，是一个具体的实体，具有状态和行为
- 实例：实例是对象的一个具体实现，是类的一个具体对象。
- 类：类是对象的蓝图或模板，定义了对象的属性和行为。类是面向对象编程的核心概念，它描述了对象的结构和行为。

## 字段

字段是类中的变量，用于存储对象的状态。每个对象都有自己的字段值，可以通过对象来访问和修改这些字段。

```java
public class User {
    private String name;
    private int age;
}
```

当不使用访问修饰符时，字段默认为包级私有（package-private），只能在同一个包内访问。使用`private`修饰符可以将字段设置为私有，只有类内部可以访问。使用`public`修饰符可以将字段设置为公共，可以在任何地方访问。`protected`修饰符则允许在同一个包内以及子类中访问。

### 静态变量

静态变量（也称为类变量）是属于类的变量，而不是属于对象的变量。它们在内存中只有一份，并且可以通过类名直接访问，而不需要创建对象。

```java
public static String version = "1.0";
```

然后不需要进行实例化就能访问：

```java
public class Main {
    static void main() {
        System.out.println(User.version);
    }
}
```

## 构造方法

构造方法是一种特殊的方法，用于创建对象时初始化对象的状态。它与类同名，并且没有返回类型。构造方法可以有参数，也可以没有参数。

当不定义任何构造方法时，Java会提供一个默认的无参构造方法。但是一旦定义了任何构造方法，默认的无参构造方法就不再提供。

例如一个用户类：

```java
public class User {
    private String name;
    private int age;
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

在这个例子中，`User`类有一个带有两个参数的构造方法，用于初始化`name`和`age`字段。当创建一个新的`User`对象时，可以使用这个构造方法来设置初始值：

```java
public class Main {
    static void main() {
        User user = new User("koston", 26);
    }
}
```

构造方法可以重载，同时构造方法内也可以调用其他构造方法，这被称为构造方法的重用。例如：

```java
public class User {
    private String name;
    private int age;
    public User() {
        this("", 0);
    }
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

## Getter和Setter方法

Getter和Setter方法是用于访问和修改私有字段的公共方法。Getter方法用于获取字段的值，而Setter方法用于设置字段的值。

```java
public class User {
    private String name;
    private int age;
    public User() {
        this("", 0);
    }
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

## 方法

方法是类中的函数，用于定义对象的行为。方法可以有参数和返回值，也可以没有参数和返回值。方法可以访问和修改对象的字段，并且可以被其他对象调用。

定义方法的语法是：

```text
修饰符 方法返回类型 方法名(方法参数列表) {
    若干方法语句;
    return 方法返回值;
}
```

### this 关键字

在非静态方法中，`this`关键字指向当前对象的引用。它可以用来访问当前对象的字段和方法。当一个方法中不会出现名称冲突时，this 可以省略，否则需要使用 this 来区分，例如上面 Getter 中可以省略 this，但是 Setter 中由于入参名称与类字段同名，所以需要使用 this 进行区分。

### 可变参数

可变参数使用 `类型... 参数名` 的语法定义，允许方法接受任意数量的参数。可变参数在方法内部被视为一个数组，可以通过索引访问。

```java
public void test(String... args) {
    for (String arg : args) {
        System.out.println(arg);
    }
}
```

### 参数绑定

如果一个参数是基本类型，那么在传递参数时传入的是调用方值的复制，双方后续的修改互不影响。

如果一个参数是引用类型，如数组、对象等，那么在传递参数时传入的是调用方引用的复制，指向的是同一个对象，双方任一修改这个变量都会影响对方。

### 方法重载

方法名相同，参数列表不同的方法称为重载方法。

重载方法必须满足以下条件：

- 方法名相同。
- 参数列表不同（参数类型、参数个数或参数顺序不同）。
- 可以有不同的返回类型，但返回类型不能作为重载的唯一条件。

### 静态方法

与静态字段类似，静态方法（也称为类方法）是属于类的方法，而不是属于对象的方法。它们可以通过类名直接调用，而不需要创建对象。静态方法不能访问非静态字段和非静态方法，因为它们没有与任何对象关联。

## POJO

POJO（Plain Old Java Object）是一个简单的Java对象，通常用于表示数据模型。它通常具有以下特征：

- 具有私有字段。
- 具有公共的Getter和Setter方法。
- 没有业务逻辑或行为，仅用于存储数据。
- 可能具有一个或多个构造方法。

### Java Bean

Java Bean是一种特殊的POJO，具有以下特征：

- 具有一个无参构造方法。
- 具有私有字段。
- 具有公共的Getter和Setter方法。
- 实现了`Serializable`接口（可选，但常见）。

### Java Record

record 由 Java 14 引入，Java 16 正式发布。它是一种特殊的类，用于表示不可变的数据对象。record 具有以下特征：

- 只包含最基本的方法，例如构造函数和 getter 方法。
- 所有字段都是 private final 的，意味着它们的值在对象创建后不能改变
- 自动生成 equals()、hashCode() 和 toString() 方法。

例如，定义一个 record：

```java
public record User(
        String name,
        int age
) {
}
```

然后可以像普通类一样使用：

```java
public class Main {
    static void main() {
        User user = new User("John", 30);
        System.out.println(user);
    }
}
```

在 Record 中，字段通过构造方法参数定义，并且自动生成了 getter 方法，字段的访问修饰符默认为 private final，因此不需要显式声明。

Record 中的 Getter 方法的命名与字段名称相同，而不是以 get 开头。例如，对于字段 name，生成的 getter 方法也是 name()，而不是 getName()：

```java
public class Main {
    static void main() {
        User user = new User("John", 30);
        System.out.println(user.name());
    }
}
```

## 继承

继承是面向对象编程中的一个重要概念，它允许一个类（子类）继承另一个类（父类）的属性和方法。通过继承，子类可以重用父类的代码，并且可以添加自己的特性和行为。

在 Java 中，使用 `extends` 关键字来实现继承。例如：

```java
public class Animal {
    public void eat() {
        System.out.println("Animal is eating");
    }
}
public class Dog extends Animal {
    public void bark() {
        System.out.println("Dog is barking");
    }
}
```

::: tip

子类通过继承时，将自动获得父类的所有字段，因此禁止定义与父类字段同名的字段，否则会导致编译错误。

:::

在 Java 中，如果一个类没有显式地继承任何类，那么它会默认继承 `java.lang.Object` 类，这是所有类的根类。

Java 只允许一个类继承自另一个类，因此，一个类只会有一个父类，但一个父类可以有多个子类，这被称为单继承。

### protected

Java 中继承的特点是子类无法访问父类的 private 字段和方法，可以访问 public 字段和方法。为了解决子类访问父类的同时又不让其他类访问的问题，可以使用 `protected` 访问修饰符。被 `protected` 修饰的字段和方法可以被同一个包内的类以及子类访问，但不能被其他包中的类访问。

### super

`super` 关键字用于在子类中访问父类的成员（字段和方法）。它可以用来调用父类的构造方法、访问父类的字段和调用父类的方法。

在 Java 中，子类的构造方法默认会调用父类的无参构造方法，如果父类没有无参构造方法，子类必须显式调用父类的其他构造方法。

```java
public class Dog extends Animal {
    public Dog() {
        super(); // 调用父类的无参构造方法
    }
    public Dog(String name) {
        super(name); // 调用父类的带参构造方法
    }
}
```

这也引出了另一个问题，继承时，子类不会继承父类的构造方法，子类的默认构造方法是编译器自动生成的，不是继承的。

### 限制继承

在 JDK17 以后，可以通过 `sealed` 和 `permits` 关键字来限制哪些类可以继承某个类。例如：

```java
public sealed class Animal permits Dog, Cat {
    // ...
}
```

### 向上转型

Java 中允许将一个子类实例赋值给一个父类类型的变量，这被称为向上转型（upcasting）。向上转型是安全的，因为子类对象包含了父类的所有属性和方法。

```java
Animal animal = new Dog(); // 向上转型
```

### 向下转型

与向上转型相反，如果把一个父类类型强制转换为子类类型，就是向下转型。

向下转型需要进行强制类型转换，并且在运行时会进行类型检查，如果对象的实际类型不是目标类型，就会抛出 `ClassCastException`。

```java
Animal animal = new Dog(); // 向上转型
Dog dog = (Dog) animal; // 向下转型
```

如果要实现安全的向下转型，可以使用 `instanceof` 关键字来检查对象的实际类型：

```java
if (animal instanceof Dog) {
    Dog dog = (Dog) animal; // 安全的向下转型
}
```

::: tip

如果一个变量时 null，那么无论它的类型是什么，`instanceof` 都会返回 false。

:::

JDK 14 之后，使用 `instanceof` 时，可以直接在条件语句中声明一个新的变量来接收转换后的对象，这样就不需要再进行一次强制类型转换了：

```java
if (animal instanceof Dog dog) {
    // 在这个代码块中，dog 变量已经被声明并且是 Dog 类型
}
```

### 继承与组合

继承和组合是两种不同的代码复用方式。继承通过创建一个新的类来扩展现有类的功能，而组合则是通过在一个类中包含另一个类的实例来实现代码复用。

子类和父类的关系是 is-a 关系，而组合则是 has-a 关系。例如，`Dog` 是一个 `Animal`，所以 `Dog` 可以继承 `Animal`。但是一个 `Car` 不是一个 `Engine`，所以 `Car` 不应该继承 `Engine`，而应该通过组合来使用 `Engine` 的功能。

## 多态

在继承关系中，如果子类定义了和父类同名、同参数的方法，这称为重写（overriding）。重写的方法在运行时会根据对象的实际类型来调用，这就是多态（polymorphism）。多态允许我们通过父类的引用来调用子类的方法，从而实现动态绑定。

```java
Animal animal = new Dog(); // 向上转型
animal.eat(); // 调用 Dog 类中的 eat 方法
```

Java 中可以通过在方法上使用 `@Override` 注解来标识一个方法是重写父类的方法，这样可以帮助编译器检查是否正确地重写了父类的方法。如果方法签名不匹配，编译器会报错。这个注解在重写时不是必须的。

### 重载与重写

如果方法签名不同，那么就是重载；如果方法签名相同，并且返回值也相同，那么就是重写。

方法签名包括方法名和参数列表，不包括返回类型和访问修饰符。

### 重写 Object 类的方法

因为所有的类都继承自 `Object` 类，而 `Object` 类中定义了几个重要方法：

- `toString()`: 返回对象的字符串表示。
- `equals(Object obj)`: 判断两个对象是否相等。
- `hashCode()`: 返回对象的哈希码。

### 调用 super

在子类的重写方法中，如果要调用父类中被重写的方法，可以使用 `super` 关键字。例如：

```java
public class Dog extends Animal {
    @Override
    public void eat() {
        super.eat(); // 调用父类的 eat 方法
        System.out.println("Dog is eating");
    }
```

### final

继承允许子类重写父类的方法，如果一个父类希望禁止子类对某个方法的重写，可以使用 `final` 关键字来修饰该方法。例如：

```java
public class Animal {
    public final void eat() {
        System.out.println("Animal is eating");
    }
}
```

使用了 `final` 修饰的方法不能被子类重写，如果子类尝试重写这个方法，编译器会报错。

如果一个类不希望被任何类继承，那么可以使用 `final` 关键字来修饰该类。例如：

```java
public final class Utility {
    // ...
}
```

同样的，如果希望一个字段在初始化后不能被修改，同样可以使用 `final` 关键字来修饰该字段。例如：

```java
public class User {
    private final String name;
    public User(String name) {
        this.name = name;
    }
}
```

## 抽象类

如果一个父类并不需要实现任何功能，只是为了定义方法签名，让子类去重写它，那么可以将父类声明为抽象类，并且将方法声明为抽象方法。抽象类不能被实例化，必须通过子类来实现它。在 Java 中，使用 `abstract` 关键字来声明抽象类和抽象方法。例如：

```java
public abstract class Animal {
    public abstract void eat(); // 抽象方法
}
public class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("Dog is eating");
    }
}
```

## 接口

如果一个抽象类没有字段，并且所有的方法都是抽象方法，那么这个抽象类就可以被声明为接口。接口是一种特殊的抽象类，它只能包含常量和抽象方法。接口不能被实例化，必须通过实现类来实现它。在 Java 中，使用 `interface` 关键字来声明接口。例如：

```java
public interface Animal {
    void eat(); // 抽象方法
}
public class Dog implements Animal {
    @Override
    public void eat() {
        System.out.println("Dog is eating");
    }
}
```

接口中定义的方法都是 `public abstract` 的，因此在接口中定义的方法不需要显式地使用 `public` 和 `abstract` 修饰符。

Java 中一个具体的类去实现某个接口时，需要使用 `implements` 关键字，并且必须实现接口中定义的所有方法，否则这个类必须被声明为抽象类。

Java 中一个类不能继承多个类，但是可以实现多个接口。例如：

```java
public class Dog implements Animal, Serializable {
    @Override
    public void eat() {
        System.out.println("Dog is eating");
    }
}
```

接口中的字段是 `public static final` 的常量，因此在接口中定义的字段不需要显式地使用 `public static final` 修饰符。

接口同样可以定义静态方法，例如：

```java
public interface Animal {
    void eat(); // 抽象方法
    static void sleep() { // 静态方法
        System.out.println("Animal is sleeping");
    }
}
```

JDK9 之后，接口中还可以定义私有方法，这些方法只能在接口内部被调用，不能被实现类访问。例如：

```java
public interface Animal {
    void eat(); // 抽象方法
    private void sleep() { // 私有方法
        System.out.println("Animal is sleeping");
    }
}
```

### 接口继承

一个接口可以继承自另一个接口，同样使用 `extends` 关键字。例如：

```java
public interface Mammal extends Animal {
    void walk();
}
public class Dog implements Mammal {
    @Override
    public void eat() {
        System.out.println("Dog is eating");
    }
    @Override
    public void walk() {
        System.out.println("Dog is walking");
    }
}
```

### default 方法

在接口中，可以使用 `default` 关键字来定义一个默认方法，这个方法在接口中有一个默认的实现，所有实现这个接口的类都可以直接使用这个默认方法，而不需要自己实现它。例如：

```java
public interface Animal {
    void eat(); // 抽象方法
    default void sleep() { // 默认方法
        System.out.println("Animal is sleeping");
    }
}
public class Dog implements Animal {
    @Override
    public void eat() {
        System.out.println("Dog is eating");
    }
}
```

## 包

Java 中使用包 `package` 来组织类和接口，包是一种命名空间，可以避免类名冲突，并且可以控制访问权限。包的命名通常使用反向域名的方式，例如 `com.example.project`。

包没有父子关系，包之间是平级的。一个类只能属于一个包，但一个包可以包含多个类。

位于同一个包下的类，可以访问包作用域下的字段和方法，不用 `public`、`protected` 或 `private` 修饰符修饰的字段和方法就是包作用域。

### 导入

要引用一个类，有三种写法：

- 直接使用类的全限定名，例如 `com.example.project.User`。
- 使用 `import` 语句导入类，例如 `import com.example.project.User;`，然后直接使用类名 `User`。
- 使用 `import static` 语句导入类的静态成员，例如 `import static com.example.project.User.version;`，然后直接使用静态成员 `version`。

当编写 class 时，编译器会自动做两个 `import` 动作：

- 导入当前包下的所有类。
- 导入 `java.lang` 包下的所有类。

## 作用域

### public

定义为 public 的 class 和 interface 可以被任何其他类访问，无论它们位于哪个包中。

定义为 public 的 field、method 可以被其他类访问，前提是访问者必须具有访问该类的权限。

### private

定义为 private 的 field、method 只能在定义它们的类内部访问，其他类无法访问。

### protected

protected 作用于继承关系，定义为 protected 的字段和方法可以被子类访问，以及子类的子类。

### package

包作用域是指一个类允许访问同一个包内，没有使用 public、private 修饰的 class，以及没有 public、private、protected 修饰的字段和方法。

只要在同一个包，就可以访问 package 权限的 class、field 和 method。

### final

用 final 修饰 class 可以阻止继承。

用 final 修饰 method 可以阻止重写。

用 final 修饰 field 可以阻止修改。

## 内部类

### Inner Class

如果一个类定义在另一个类的内部，这个类就是 Inner Class，例如：

```java
public class Outer {
    private int outerField;
    public class Inner {
        public void accessOuter() {
            System.out.println(outerField); // 可以访问外部类的字段
        }
    }
}
```

Inner Class 的实例不能单独存在，必须依附于所属的外部类的实例，例如：

```java
public class Main {
    static void main() {
        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();
    }
}
```

Inner Class 中可以访问外部类的字段和方法，即使它们是 private 的。

### Anonymous Class

与 Inner Class 不同，Anonymous Class 是没有名字的类，通常用于实现接口或继承抽象类，例如：

```java
public class Main {
    static void main() {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("Running");
            }
        };
        runnable.run();
    }
}
```

### static Nested Class

静态内部类与 Inner Class 类似，使用 static 关键字修饰。

静态内部类不再需要依附于外部类的实例，而是一个完全独立的类，因此无法引用 Outer.this，但是可以访问外部类的静态字段和方法，例如：

```java
public class Outer {
    private static int staticField;
    public static class Nested {
        public void accessOuter() {
            System.out.println(staticField); // 可以访问外部类的静态字段
        }
    }
}
```
