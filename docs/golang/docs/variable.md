# 变量

单独声明：

`var ${变量名} ${变量类型}`。

批量声明：

```go
var(
  name string
  password string
  age int
)
```

Go 语言中非全局变量声明就必须使用，否则无法编译。

声明同时赋值：`var hello string = "Hello"`。

类型推导：`var hello = "Hello"`。根据变量值判断是什么类型。

简短变量声明（只能在函数内部使用）：

```go
hello := "Hello"
x :=int(2)
```

匿名变量：使用多重赋值时，如果想要忽略某个值，可以使用匿名变量占位，匿名变量不占用命名空间，不会分配内存，匿名变量之间不存在重复声明。

```go
_, a := 1, 2
```
