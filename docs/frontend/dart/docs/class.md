# 类

## 使用构造函数

```dart
import 'dart:math';

void main() {
  var p1 = new Point(2, 2);
}
```

::: tip
构造函数前的 new 关键字可以省略。
:::

一些类提供了常量构造函数。使用常量构造函数，在构造函数名之前加 const 关键字，来创建编译时常量时：

```dart
import 'dart:math';

void main() {
  var p1 = const Point(2, 2);
  var p2 = const Point(2, 2);
  print(identical(p1, p2)); // true
}
```

::: tip
两个使用相同构造函数、相同参数值构造的编译时常量是一个对象。
:::

## 获取对象的类型

```dart

import 'dart:math';

void main() {
  var p1 = const Point(2, 2);
  print("type of p1 is ${p1.runtimeType}");
}
```

使用 Object 对象的 runtimeType 属性在运行时获取一个对象的类型，该对象类型是 Type 的实例。

::: warning
不要使用类似`o.runtimeType==Type`这样表达式做条件语句，应当使用 is 运算符。
:::

## 实例变量

```dart
class User {
  String? name;
  String? password;
  int age = 0;
}
```

所有未初始化的实例变量都是 null，因此对于不能为 null 的类型的成员变量，必须制定初始值或者使用 late 关键字。

所有的实例变量都会隐式的声明一个 Getter 方法，非终值实例变量和 late final 声明但没有初始化的实例变量还会隐式的声明一个 Setter 方法。

## 构造函数

与大多数语言类似：

```dart
class User {
  String? name;
  String? password;
  User(String name, String password) {
    this.name = name;
    this.password = password;
  }
}

void main(List<String> args) {
  var x = new User("PPG", "123456");
}
```

::: tip
仅当命名冲突时使用 this 关键字才有意义，否则 Dart 会忽略 this 关键字。
:::

由于大多数情况下，构造函数的实例变量赋值过程都是一样的，所以 Dart 提供了语法糖：

```dart
class User {
  String? name;
  String? password;
  // User(this.name, this.password);
  User(this.name);
}

void main(List<String> args) {
  var x = new User("PPG");
  print(x.name);
  print(x.password);
}
```

### 默认构造函数

如果没有声明构造函数，Dart 会自动生成一个无参数的构造函数并且该构造函数会调用其父类的无参构造方法。

### 构造函数不被继承

子类不会继承父类的构造函数，如果子类没有声明构造函数，那么只会有一个默认无参数的构造函数。

### 命名式构造函数

可以为一个类声明多个命名式构造函数来表达更明确的意图。

```dart
class User {
  String? name;
  String? password;
  User(this.name, this.password);
  User.name(this.name);
  User.password(this.password);
}

void main(List<String> args) {
  print(User.name("name").name);
  print(User.password("password").password);
}
```

### 调用父类非默认构造函数

::: tip 构造函数相关的执行顺序

1. 初始化列表。
2. 父类的无参数构造函数。
3. 当前类的构造函数。

:::

如果父类没有匿名无参构造函数，那么子类必须调用父类的一个构造函数：

```dart
class father {
  String? name;
  father(this.name);
}

class son extends father {
  son(String x) : super(x) {}
}

void main(List<String> args) {
  son s = son("son");
  print(s.name);
}
```

::: warning
传递给父类构造函数的参数不能使用 this 关键字，因为这一步时，子类构造函数尚未执行，子类实例对象未初始化，因此所有实例成员都不能被访问。
:::

### 初始化列表

除了调用父类构造函数之外，还可以在函数体执行之前初始化实例变量，每个实例变量之间使用逗号分隔。

```dart
class User {
  String? name;
  String? password;
  User(Map<String, String> map)
      : name = map["name"],
        password = map["password"] {}
}

void main(List<String> args) {
  var user = User({"password": "password"});
  print(user.name);
  print(user.password);
}
```

::: warning
初始化列表右边的语句同样不能使用 this 关键字。
:::

### 重定向构造函数

```dart
class User {
  String? name;
  String? password;
  User(Map<String, String> map)
      : name = map["name"],
        password = map["password"] {}
  User.alia(String name, String password):this({"name": name, "password": password});
}

void main(List<String> args) {
  var user = User.alia("name", "password");
  print(user.name);
  print(user.password);
}
```

### 常量构造函数

```dart
class User {
  final String name;
  final String password;
  const User(this.name, this.password);
}

void main(List<String> args) {
  const x = User("name", "password");
  const y = User("name", "password");
  print(identical(x, y));
}
```

### 工厂构造函数

使用 factory 关键字标识类的构造函数将会令该构造函数变为工厂构造函数，这将意味着使用该构造函数构造类的实例时并非总是会返回新的实例对象。例如，工厂构造函数可能会从缓存中返回一个实例，或者返回一个子类型的实例。

```dart
class User {
  String? name;
  static final Map<String, User> cache = {};
  factory User(String name) {
    return cache.putIfAbsent(name, () => User._internal(name));
  }
  User._internal(this.name);
}

void main(List<String> args) {
  var user1 = User("test");
  var user2 = User("test");
  print(identical(user1, user2)); // true
}
```

::: warning
在工厂构造函数中无法访问 this。
:::

## 方法

### 实例方法

```dart
import 'dart:math';

class Point {
  double x;
  double y;
  Point(this.x, this.y);
  double distanceTo(Point p) {
    var dx = this.x - p.x;
    var dy = this.y - p.y;
    return sqrt(pow(dx, 2) + pow(dy, 2));
  }
}

void main(List<String> args) {
  var p1 = Point(3, 4);
  var p2 = Point(5, 6);
  print(p1.distanceTo(p2));
}
```

### 运算符重载

```dart
import 'dart:math';

class Point {
  double x;
  double y;
  Point(this.x, this.y);
  double distanceTo(Point p) {
    var dx = this.x - p.x;
    var dy = this.y - p.y;
    return sqrt(pow(dx, 2) + pow(dy, 2));
  }

  operator +(Point p) => Point(this.x + p.x, this.y + p.y);
}

void main(List<String> args) {
  var p1 = Point(3, 4);
  var p2 = Point(5, 6);
  var p3 = p1 + p2;
  print(p3.x);
}
```

### Getter、Setter

使用 `get`、`set` 关键字添加 Getter、Setter 方法：

```dart
import 'dart:math';

class Point {
  double x;
  double y;
  Point(this.x, this.y);
  double get distenceToZero => sqrt(pow(this.x, 2) + pow(this.y, 2));
  set demo(double x) => this.x = x;
}

void main(List<String> args) {
  var p1 = Point(3, 4);
  p1.demo = 5;
  print(p1.x);
}
```

### 抽象方法

实例方法、Getter、Setter 都是可以抽象的，抽象方法只能存在于抽象类中。

## 抽象类

如果希望抽象类可以实例化，可以定义工厂构造函数。

```dart
import 'dart:math';

abstract class point {
  num x = 0;
  num y = 0;
  num distenctTo(point p);
  void hello() {
    print("hello");
  }

  point(this.x, this.y);
}

class intPoint extends point {
  @override
  num distenctTo(point p) {
    return sqrt(pow((this.x - p.x), 2) + pow((this.y - p.y), 2));
  }

  intPoint(int x, int y) : super(x, y);
}

void main(List<String> args) {
  var p1 = intPoint(3, 4);
  var p2 = intPoint(5, 6);
  print(p1.distenctTo(p2));
}
```

## 隐式接口

每个类都隐式的定义了一个接口并实现了这个接口，这个接口包含所有这个类的实例成员以及这个类所实现的其他接口。如果要创建一个 A 类支持调用 B 类的 API 但是不想继承 B 类，则可以实现 B 类的接口。

```dart
class A {
  void hello(String x) {
    print(x);
  }
}

class B implements A {
  @override
  void hello(String x) {
    for (var i = 0; i < x.length; i++) {
      print(x[i]);
    }
  }
}

void main(List<String> args) {
  A a = B();
  a.hello("test");
}
```

## 扩展一个类

子类可以重写父类的实例方法、操作符、Getter、Setter，使用 `@override` 注解表示重写了一个成员：

```dart
class A {
  num hello(int a) {
    return 1;
  }
}

class B extends A {
  @override
  double hello(Object x) {
    return 2.5;
  }
}

void main(List<String> args) {
  A a = B();
  print(a.hello(123));
}
```

::: warning 重写方法声明必须满足下面的条件：

- 返回类型必须与被覆盖的方法的类型相同或者是其子类。
- 参数类型必须与被覆盖的方法的类型相同或者是其父类。
- 覆盖与被覆盖的两个方法的参数个数必须相等。
- 泛型方法不能覆盖非泛型方法，非泛型方法不能覆盖泛型方法。

:::

如果调用了对象上不存在的方法或实例变量会触发 noSuchMethod 方法，可以重写这个方法来追踪和记录这个行为：

```dart
class A{
  @override
  void noSuchMethod(Invocation invocation) {
    print("你执行了一个不存在的方法或实例变量：${invocation.memberName}");
  }
}

void main(List<String> args) {
  dynamic a = A();
  print(a.test);
}
```

::: warning 只有下面任意一个条件成立时才能调用未实现的方法

- 接收方是静态的 dynamic 类型。
- 接收方具有动态类型，定义了为实现的方法（也可以是抽象方法），并且接收方的动态类型实现了 noSuchMethod 方法且具体的实现与 Object 中不同。

:::

## 扩展方法

扩展方法可以向现有库中添加方法：

```dart
class A {
  String x = "";
  A(this.x);
}

extension B on A {
  void hello() {
    print(this.x);
  }
}

void main(List<String> args) {
  A a = A("test");
  B(a).hello();
}
```

::: warning
扩展 B 调用时必须穿入一个被扩展对象的实例充当 this。
:::

## 枚举类型

```dart
enum Level {
  A,
  B,
  C,
  D,
}

void main(List<String> args) {
  print(Level.A.index); // 获取枚举值的索引
  print(Level.values); // 获取枚举值列表
}
```

::: warning
如果将枚举类用在 switch 语句中，则必须覆盖每一个枚举值。
:::

::: tip 枚举具有以下限制：

- 枚举不能成为子类，也不能 mix in，也不可以被实现。
- 不能显式地实例化一个枚举类。

:::

## 使用 Mixin

```dart
class A {
  String a = "";
  void helloA() {
    print(this.a);
  }
}

class B {
  String b = "";
  void helloB() {
    print(this.b);
  }
  B(this.b);
}

class C extends B with A {
  C(String b) : super(b);
}

void main(List<String> args) {
  var c = new C("B");
  c.helloB();

}
```

使用 `with` 关键字使用 Mixin 模式，`with` 后可以 Mixin 多个类，用逗号分隔。

::: warning

- Mixin 类不能声明任何构造器。
- extends 关键字必须在 with 关键字前。

:::

::: tip

- 如果上面的例子中继承的类 B 和 Mixin 类 A 中具有同名方法，那么会执行 Mixin 类 A 的方法。
- 如果上面的例子改为类 A 和 类 B 都是 Mixin 类且具有同名方法，则谁最后被 Mixin（在 with 的最后），就执行谁的方法。

:::

如果一个类只是用来 Mixin，应该使用 `mixin` 关键字代替 `class` 关键字。而且可以对于使用 `mixin` 声明的 Mixin 类，可以在后面再使用 `on` 关键字限制可以被混入的类：

```dart
class A {
  String a = "";
  void hello() {
    print(this.a);
  }
}

mixin B on A {
  String b = "";
  void hello() {
    print(this.b);
  }
}

class C extends A with B {}
```

上面的代码中，B 只能被 Mixin 入 A 类，因此 C 必须继承 A 才能 Mixin B。

## 静态变量和静态方法

```dart
class A {
  static int x = 100;
  String a = "";
  static void hello() {
    print(x);
  }
}

void main(List<String> args) {
  A.hello();
}
```

::: tip

- 静态方法不能访问实例成员，但是实例方法可以访问静态成员。
- 实例对象不能调用静态方法。

:::
