# 流程控制

## if

```java
if (condition) {
    // code to be executed if condition is true
} else if (anotherCondition) {
    // code to be executed if anotherCondition is true
} else {
    // code to be executed if both conditions are false
}
```

## switch

基础用法：

```java
switch (expression) {
    case value1:
        // code to be executed if expression equals value1
        break;
    case value2:
        // code to be executed if expression equals value2
        break;
    // you can have any number of case statements
    default:
        // code to be executed if expression doesn't match any case
}
```

::: warning

case 具有穿透性，如果没有 break 语句，那么当一个被匹配的 case 执行完后，会继续执行后续的 case 直到遇到 break 或 switch 结束。

switch 只能用于 byte、short、char、int、枚举类型、String 和包装类（Byte、Short、Character、Integer）。不能用于 long、float、double 和 boolean。

:::

如果有多个 case 的代码相同，可以将它们合并：

```java
switch (expression) {
    case value1:
    case value2:
        // code to be executed if expression equals value1 or value2
        break;
    // other cases
}
```

### switch 表达式

从 Java 12 开始，switch 也可以作为表达式使用，允许直接返回值：

```java
String result = switch (expression) {
    case value1 -> "Result for value1";
    case value2 -> "Result for value2";
    default -> "Default result";
};
```

::: tip

新语法没有 fall-through 的问题，每个 case 都必须明确指定要执行的代码块。如果代码块有多行，需要使用大括号 `{}` 包裹。

:::

如果在需要 switch 返回值的情况下，代码块又比较复杂，可以使用 `yield` 关键字来返回值：

```java
String result = switch (expression) {
    case value1 -> {
        // some complex code
        yield "Result for value1";
    }
    case value2 -> {
        // some complex code
        yield "Result for value2";
    }
    default -> {
        // some complex code
        yield "Default result";
    }
};
```

## for 循环

for 循环基于一个计数器变量，每次循环前检测循环条件，每次循环后，更新计数器变量。

```java
for (initialization; condition; update) {
    // code to be executed
}
```

除了传统的 for 循环，Java 还提供了增强的 for 循环（也称为 for-each 循环），用于遍历数组或集合：

```java
for (type element : collection) {
    // code to be executed for each element
}
```

`for-each` 循环支持遍历所有实现了 `Iterable` 接口的集合类，以及数组。

## while 循环

while 循环在每次循环前检测条件，如果条件为 true，则执行循环体：

```java
while (condition) {
    // code to be executed
}
```

## do-while 循环

与 while 循环不同，do-while 循环在每次循环后检测条件，因此至少会执行一次循环体：

```java
do {
    // code to be executed
} while (condition);
```

## break 和 continue

break 语句可以跳出当前所在最近的一层循环，而 continue 语句则会跳过当前循环的剩余部分，直接进入下一次循环。
