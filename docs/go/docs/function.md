# 函数

## 函数定义

Go 中的函数：

- 无需声明原型。
- 支持不定变参。
- 支持多返回值。
- 支持命名返回函数。
- 支持匿名函数和闭包。
- 函数也是一种类型，一个函数可以赋值给变量。
- 一个包内不能有重名函数。
- 不支持重载。
- 不支持默认参数。

函数声明：

函数声明包含一个函数名，参数列表，返回值列表和函数体。

```go
// 没有返回值的函数。
func swap(x *int, y *int) {
  temp := *x
  *x = *y
  *y = temp
}
// 有一个返回值的函数。返回值类型声明在括号后面。
func getTime() int {
  return time.Now().Year()
}
// 命名返回值，卸载括号后面，相当于在函数中声明了一个变量，return 后也不需要显式指定返回变量名。如果函数体内重新声明了一个重名变量，则需要显式返回。
func getTime() (currentYear int) {
  currentYear = time.Now().Year()
  return
}
// 多返回值。
func getDate() (year int, month int, day int) {
  t := time.Now()
  year = t.Year()
  month = int(t.Month())
  day = t.Day()
  return
}
// 简写参数类型。
// 当多个连续参数或返回值类型相同时，可以省略前面的类型，只指出最后一个类型。
func getDate() (year, month, day int) {
  t := time.Now()
  year = t.Year()
  month = int(t.Month())
  day = t.Day()
  return
}
// 可变长参数。参数是切片。
func demo(msg string, y ...int) {
  fmt.Println(y)
}
```

## defer 延迟执行

- 关键字 defer 用于注册延迟调用。
- defer 声明的语句直到 return 前才被执行。
- 多个 defer 语句按现金后出的方式执行。
- defer 语句中的变量在 defer 声明时就决定了。

defer 用途：

- 关闭文件句柄。
- 锁资源释放。
- 数据库连接释放。

```go
// 先输出年、月、日，再输出年、最后输出最开始声明的 defer，打印 t。
func getDate() (year, month, day int) {
  t := time.Now()
  defer fmt.Println(t)
  year = t.Year()
  defer fmt.Println(year)
  month = int(t.Month())
  day = t.Day()
  fmt.Println(year, month,day)
  return
}
```

Go 语言中 return 不是原子的，分为两步：为返回变量赋值、返回。defer 声明的语句将会在这两步之间执行。

对于命名返回值，如果 defer 声明的语句对返回值作出了修改，将会影响最后的结果，如果不是命名返回值，修改将不会生效。

```go
func getYear() (int) {
  currentYear := time.Now().Year()
  defer func ()  {
    currentYear = 2000
  }()
  return currentYear // 2021
}
```

```go
func getYear() (currentYear int) {
  currentYear = time.Now().Year()
  defer func ()  {
    currentYear = 2000
  }()
  return currentYear // 2000
}
```

## 闭包

闭包：一个拥有许多变量和绑定了这些变量的环境的表达式。

```go
func a() func() int {
  i := 0
  b := func () int {
    i++
    return i
  }
  return b
}
func main() {
  c := a()
  fmt.Println(c()) // 1
  fmt.Println(c()) // 2
  fmt.Println(c()) // 3
}
```

## 异常处理

Go 语言中使用 `panic` 抛出错误，`recover` 捕获错误。

- 利用 recover 处理 panic 指令，defer 必须放在 panic 之前定义，recover 只有在 defer 中才有用，且必须是在 defer 函数中才有效。
- recover 处理异常后，逻辑不会恢复到 panic 那个点，函数跑到 defer 之后的那个点。

```go
func a() func() int {
  i := 0
  b := func() int {
    defer func() {
      err := recover()
      if err != nil {
        fmt.Println(err)
        fmt.Println(err.(string))
      }
    }()
    i++
    if i%2 == 0 {
      panic("出现偶数")
    }
    return i
  }
  return b
}
```

## 单元测试

TODO

## 压力测试

TODO
