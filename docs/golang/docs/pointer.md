# 指针

Go 语言中的指针只能取值赋值，不能用来运算，是安全指针。

交换函数：

```go
func swap(x *int, y *int) {
  temp := *x
  *x = *y
  *y = temp
}
```

当一个指针定以后不指向任何变量时，值为 `nil`。

## new 和 make

new 和 make 用来分配内存空间。

new 是一个内置的函数，只接受一个参数，这个参数是一个类型，返回一个指向该类型内存地址的指针。该指针对应的值为该类型的零值。

```go
a := new(string)
b := new(bool)
fmt.Println(*a, *b) // "" false
*a = "100"
*b = true
fmt.Println(*a, *b)
```

make 只能用于切片、map、以及管道 chan 的内存创建，返回类型就是这三个类型本身而不是它们的指针，因为这三个类型就是引用类型。
