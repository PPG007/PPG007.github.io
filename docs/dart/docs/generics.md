# 泛型

## 使用泛型

```dart
class Cache<T> {
  Map<String, T> cache = {};
  T? get(String key) => this.cache[key];
  void set(String key, T data) {
    cache[key] = data;
  }
}

void main(List<String> args) {
  var stringCache = Cache<String>();
  var intCache = Cache<int>();
  stringCache.set("cache1", "data");
  intCache.set("cache1", 123);
  print(stringCache.get("cache1"));
  print(intCache.get("cache"));
}
```

## 使用集合字面量

```dart
void main(List<String> args) {
  var strings = <String>["s1", "s2"];
  var ints = <int>[1,2,3];
  var map = <String, int>{
    "a": 100,
    "b": 90,
  };
}
```

## 使用类型参数化的构造函数

```dart
class Demo<T> {
  T? data;
  Demo(this.data);
}

void main(List<String> args) {
  var d = Demo<String>("test");
  print(d.data);
}
```

## 泛型集合

Dart 中的泛型类型是固化的，即使在运行时也会保持类型信息。

这与 Java 的类型擦除不同，在 Java 中只能判断一个对象是不是 `List`，但不能判断一个对象是不是 `List<String>`。

## 限制参数化类型

```dart
class A {

}

class B extends A{

}

class C<T extends A> {
  T? data;
}

void main(List<String> args) {
  var c = C<B>();
}
```

## 使用泛型方法

```dart
T hello<T>(T data) {
  print(data);
  return data;
}

void main(List<String> args) {
  var intFunc = hello<int>;
  print(intFunc(123));
}
```

::: tip 泛型方法中的泛型标志 T 可以在以下位置使用：

- 返回值类型。
- 参数类型。
- 局部变量类型。

:::
