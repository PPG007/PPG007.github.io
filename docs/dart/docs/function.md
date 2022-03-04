# 函数

在 Dart 中函数也是对象，是 Function 类型。

函数可以不指定返回值，这种情况下返回值为 dynamic 类型：

```dart
isOdd(int a) {
  return a.isOdd;
}
```

如果函数体中只有一个*表达式*，可以简写为箭头函数：

```dart
isOdd(int a) => a.isOdd;
```

## 参数

函数有两种形式的参数：*必要参数*和*可选参数*，必要参数定义在参数列表前面，可选参数定义在必要参数后面，可选参数可以是命名的或位置的。

### 命名参数

命名参数默认为可选参数，除非被标记为 required。

```dart
// 默认值 10
isOdd({int a = 10}) => print(a);

void main(List<String> args) {
  isOdd();
}
```

因为是可选参数所以如果参数类型不能为 null，需要指定默认值或者在类型后面加问号。

```dart
isOdd({required int a}) => print(a);

void main(List<String> args) {
  isOdd(a: 123);
}
```

但是如果是使用了 required 做了必填限制，那么可以不指定默认值。

### 可选的位置参数

使用 `[]` 将一系列参数包裹起来作为位置参数。

```dart
String Link(String a, String b, [String? c, String? d]){
  var result = a+b;
  if (c != null) {
    result = "$result$c";
  }
  if (d != null) {
    result = "$result$d";
  }
  return result;
}

void main(List<String> args) {
  print(Link("a", "b"));
  print(Link("a", "b", "c", "d"));
}
```

### 默认参数

在命名参数和位置参数后使用等号（老版本使用冒号）定义默认值，默认值必须是编译时常量，没有指定默认值的情况下默认值为 null。

## `main()` 函数

每个 Dart 程序都必须有一个 `main()` 顶级函数作为程序的入口， `main()` 函数返回值为 void 并且有一个 `List<String>` 类型的可选参数。

## 函数是一级对象

函数可以作为参数传递给另一个参数：

```dart
void hello(String a) {
  print(a);
}
void callHello(Function(String) f) {
  f.call("Hello World");
}
void main(List<String> args) {
  callHello(hello);
}
```

也可以赋值给一个变量：

```dart
void main(List<String> args) {
  var x = hello;
  //var x = (msg) => print(msg);
  x.call("test");
}
```

## 匿名函数

```dart
void main(List<String> args) {
  var x = (msg) => print(msg);
  var y = (int a, int b) {
    return a+b;
  };
  x.call("test");
  print(y(1, 2));
}
```

## 词法作用域

```dart
void main() {
  int a = 1000;
  if (true) {
    int a = 100;
    print(a); // 100
  }
  print(a); // 1000
}
```

## 词法闭包

```dart
Function(int) test(int a) {
  return (int b) {
    return a + b;
  };
}
void main(List<String> args) {
  var t1 = test(2);
  var t2 = test(100);
  print(t1.call(8)); // 10
  print(t2.call(5)); // 105
  t1 = test(-6);
  print(t1.call(8)); // 2
}
```

## 返回值

所有的函数都有返回值，没有显式返回语句的函数最后一行默认执行 `return null`。

## 函数相等

```dart
void foo() {} // A top-level function

class A {
  static void bar() {} // A static method
  void baz() {} // An instance method
}

void main() {
  Function x;

  // Comparing top-level functions.
  x = foo;
  assert(foo == x);

  // Comparing static methods.
  x = A.bar;
  assert(A.bar == x);

  // Comparing instance methods.
  var v = A(); // Instance #1 of A
  var w = A(); // Instance #2 of A
  var y = w;
  x = w.baz;

  // These closures refer to the same instance (#2),
  // so they're equal.
  assert(y.baz == x);

  // These closures refer to different instances,
  // so they're unequal.
  assert(v.baz != w.baz);
}
```
