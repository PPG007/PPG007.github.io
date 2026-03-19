# Golang Traps

- 可变参数是空接口类型时，传入空接口的切片要注意参数展开问题：

  ```go
  var a = []interface{}{1, 2, 3}
  fmt.Println(a)
  fmt.Println(a...)
  ```

- 数组是值传递，如果数组做函数参数那么在函数中的修改将不起作用，可以使用切片。

- map 的遍历顺序是不固定的，每次遍历顺序可能都不一样。

- recover 必须在 defer 语句中，且这个语句是一个函数的执行。

- 并发时注意主线程退出导致其他线程结束。

- 不同 goroutine 之间不满足顺序一致性内存模型。

- 闭包错误地引用同一个变量。

  ```go
  func main() {
    for i := 0; i < 5; i++ {
      defer func ()  {
        fmt.Println(i)// 全部是 5，可以通过每轮循环生成一个局部变量或者通过函数参数传入解决。
      }()
    }
  }
  ```

- defer 语句在函数退出时才会执行，如果在循环体中使用 defer 语句将会在循环结束后执行，如果希望每次循环后执行可以去掉 defer 并将语句放在循环体最后或者将 defer 后语句封装为一个函数。

## 空接口和 nil 的区别

声明一个 interface{} 类型的变量但不进行初始化，这时这个变量值为 nil，本身也是 nil，如果将一个结构体的 nil 指针变量赋值给这个空接口变量，则这个空接口变量的值是 nil，但是本身不是 nil，所以如果打印这个变量会输出 nil，但是如果对其进行 `if != nil` 会返回 false。

一个 interface{} 变量包含了两个指针，一个指针指向值在编译时确定的类型，一个指针指向实际的值，所以值为 nil 不代表这个变量是 nil。

```go
package main

import (
	"log"
)

type DemoInterface interface{
	Demo() string
}

type DemoImpl struct {
	message string
}

func (d DemoImpl) Demo() string {
	return d.message
}

var di *DemoImpl
var d DemoInterface

func demoImplFunc() *DemoImpl {
	return di
}

func main() {
	d = demoImplFunc()
	if d != nil {
		log.Println(d.Demo())
	}
}
```

在上面的代码中，`d = di` 这行代码是将一个接口的为 nil 的实现赋值给这个接口的一个变量，此时 d 就是一个空接口，值为 nil 但是类型指针指向实现结构体所以 `if d != nil` 会返回 true，但是一旦调用接口的方法会由于值为 nil 出现空指针 panic。

但是如果是 `d := demoImplFunc()`，相当于新定义了一个临时变量，类型就是实现类，因此 `if d != nil` 会返回 false，也就不会 panic。

::: warning
只要涉及到实现和接口的转换就存在这个问题。
:::

::: tip 解决方法

- 在发生接口和实现转换时进行判空操作。例如上面的例子中可以使用一个临时变量接收函数的返回值，再判断这个返回值是否为空，再决定是否转换。
- 使用具体的实现变量从而杜绝实现和接口的转换。但是这么做会破坏代码的抽象性。

:::
