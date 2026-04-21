# 异常处理

Java 内置了一套异常处理机制，总是使用异常来表示错误。

异常本身是一种 class，因此它本身带有类型信息。

异常可以在任意位置抛出，但只需要在上层捕获。

异常的继承关系如下：

```text
Object
  | Throwable
    |-- Error
    |-- Exception
```

Throwable 有两个体系，Error 和 Exception。

Error 表示严重错误，程序对此一般无能为力，例如：

- OutOfMemoryError：内存不足
- StackOverflowError：栈溢出
- NoClassDefFoundError：找不到类定义

Exception 表示运行时的错误，可以被捕获并被处理，例如：

- NullPointerException：空指针异常
- ArrayIndexOutOfBoundsException：数组越界异常
- IOException：输入输出异常

Exception 又分为两大类：

- RuntimeException 及其子类。
- 其他 Exception 及其子类。

Java 规定：

- 必须捕获的异常，包括 Exception 及其子类，但不包括 RuntimeException 及其子类，这种类型的异常称为受检异常（Checked Exception）。
- 不需要捕获的异常，包括 Error 及其子类，RuntimeException 及其子类。

当方法进行定义时，可以使用 throws 关键字声明该方法可能抛出的受检异常：

```java
public void myMethod() throws IOException {
    // 可能抛出 IOException 的代码
}
```

调用这种方法的地方必须捕获该异常，或者继续声明抛出此异常。

## 捕获异常

Java 中使用 try-catch-finally 语句来捕获异常：

```java
try {
    // 可能抛出异常的代码
} catch (ExceptionType1 e1) {
    // 处理 ExceptionType1 类型的异常
} catch (ExceptionType2 e2) {
    // 处理 ExceptionType2 类型的异常
} finally {
    // 无论是否发生异常，都会执行的代码
}
```

当存在多个 catch 语句时，每个 catch 分别捕获对应的 Exception 及其子类，JVM 在捕获到异常后，会从上到下匹配 catch 语句，匹配到某个 catch 之后，执行对应的代码块，并跳过剩余的 catch 语句。

因此，catch 语句的顺序非常重要，应该从最具体的异常类型到最一般的异常类型进行排列。

如果多个 catch 语句中的处理逻辑是相同的，可以使用 Java 7 引入的 multi-catch 语法：

```java
try {
    // 可能抛出异常的代码
} catch (ExceptionType1 | ExceptionType2 e) {
    // 处理 ExceptionType1 和 ExceptionType2 类型的异常
}
```

## 抛出异常

Java 中使用 throw 关键字来抛出异常：

```java
throw new ExceptionType("异常信息");
```

catch 和 finally 语句块中也可以使用 throw 来抛出异常：

```java
try {
    // 可能抛出异常的代码
} catch (ExceptionType e) {
    // 处理异常
    throw new AnotherException("新的异常信息");
} finally {
    // 无论是否发生异常，都会执行的代码
    throw new FinallyException("finally 中抛出的异常");
}
```

如果 finally 块中抛出异常，那么它会覆盖 catch 块中抛出的异常，最终抛出的异常是 finally 块中抛出的异常。这称为异常屏蔽（Exception Suppression）。

## 自定义异常

通过继承 Exception 类或 RuntimeException 类，可以创建自定义异常：

```java
public class MyException extends Exception {
    public MyException(String message) {
        super(message);
    }
}
```

## 断言

断言是一种调试程序的方式，Java 中使用 assert 关键字来进行断言：

```java
assert condition : "断言失败时的错误信息";
```

断言失败时，会抛出 AssertionError 异常并导致程序退出。断言通常用于检查程序中的不变量、前置条件和后置条件等。

对于可恢复的程序错误，不应该使用断言。

JVM 默认情况下是禁用断言的，可以通过命令行参数 -ea 来启用断言：

```bash
java -ea MyClass
```
