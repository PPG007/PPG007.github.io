# 变量

## 变量声明

使用关键字声明变量：

```dart
int a = nullAbleButNotNull()!;
dynamic b = "123";
Object c = 123;
var d = false;
```

## 默认值

所有允许为空的类型的默认值都是 null，对于不允许为 null 的类型，需要在使用前初始化。

```dart
int b;
print(b); // Error: Non-nullable variable 'b' must be assigned before it can be used.
```

如果你确定变量使用前已被初始化，可以在变量声明前添加 late，但是如果实际上没有初始化则会在运行期报错，late 关键字在 2.12 版本后引入。

```dart
late int a;
void main() {
  print(a); // 运行时报错
}
```

如果一个变量使用了 late 修饰且在声明时就进行了初始化，那么这个变量直到被使用时才会被赋值（懒加载）。

```dart
void init(){
  print("init");
}

void main(List<String> args) {
  late var x = init(); // not print
  var a = init(); // print
}
```

## final 和 const

使用 final 或 const 声明变量可以使变量不可变，这两个关键字可以替代 var 或者加在一个具体的类型前。

一个 final 变量只可以被赋值一次，可以先声明，再赋值，const 必须声明时就赋值。全局 final 或者类的 final 变量在第一次使用时才会初始化。

```dart
final demo = init(); // not print

void main(List<String> args) {

}
```

类的实例变量不能是 const，只能是 final，类的静态变量可以是 const，顺序必须是 `static const`。

如果 final 或 const 修饰的是对象，则 final 修饰的情况下对象属性仍然可变，但是 const 不行。
