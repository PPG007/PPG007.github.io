# 泛型(Go1.18)

## 在函数声明中使用泛型

```go
package main

import "fmt"

func main()  {
	fmt.Println(min(1, 2))
	fmt.Println(min[float64](1.2, 2.1))
}
func min[T int|float64](a, b T) T {
	if a < b {
		return a
	}

	return b
}
```

Go1.18 中使用中括号表示泛型，泛型类型 T 的可选类型在后面使用或运算符分割，调用函数时，也可以传入使用该函数的哪个类型（上面的`fmt.Println(min[float64](1.2, 2.1))`），也可以省略。

如果我们自定义类型（不是起别名），那么将自定义类型传入上面的 min 函数会报错，可以使用`~`符号，此符号声明的类型可以接收原类型与底层类型是此原类型的类型。

```go
package main

import "fmt"

type myFloat float64

const (
	a myFloat = 1.1
	b myFloat = 2.2
)

func main() {
	fmt.Println(min(a, b))
}
func min[T int | ~float64](a, b T) T {
	if a < b {
		return a
	}

	return b
}
```

如果需要限制一个方法是某些类型而又不想将中括号写的太长，可以使用自定义接口：

```go
package main

import "fmt"

func main() {
	fmt.Println(min(2, 2))
}

type minType interface {
	int8 | int | int16 | int32 | int64 | uint8 | uint | uint16 | uint32 | uint64 | float32 | float64
}

func min[T minType](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```

接口中的类型可以换行写，换行后表示要同时具有每一行的类型，例如：

```go
package main

import "fmt"

type myInt int

const (
	a myInt = 1
	b myInt = 2
)

func main() {
	fmt.Println(min(a, b))
}

type minType interface {
	int8 | ~int | int16 | int32 | int64 | uint8 | uint | uint16 | uint32 | uint64 | float32 | float64
	myInt
}

func min[T minType](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```

上面的 myInt 同时满足 `~int`以及 myInt 类型。

当然接口也可以同时具有方法：

```go
package main

type myInt int

type minStrct struct {
}

func (minStrct) demo() string {
	return "demo"
}

func main() {
	demo(minStrct{})
}

type demoType interface {
	minStrct
	demo() string
}

func demo[T demoType](a T) {

}
```

::: warning
如果接口里有类型，那么就不能用来作为变量类型声明变量了，只能用作类型约束。
:::

在 `golang.org/x/exp/constraints` 包中，已经定义了一些类型接口，可以直接使用：

```go
type minType interface {
	// int8 | ~int | int16 | int32 | int64 | uint8 | uint | uint16 | uint32 | uint64 | float32 | float64
	myInt
	constraints.Float|constraints.Signed|constraints.Unsigned|constraints.Integer|constraints.Ordered
}
```

::: warning
类型接口前不能使用`~`符号。
:::

::: tip
此外，`golang.org/x/exp/slices` 包及 `golang.org/x/exp/maps` 包中分别定义了一些使用泛型的切片及 map 的工具方法，例如：

```go
fmt.Println(slices.Equal([]int{1, 2}, []int{1, 2}))
```

:::

## 结构体泛型

```go
package main

import "fmt"

type myType int

type DemoStructType interface {
	int8 | ~int | int16 | int32 | int64 | uint8 | uint | uint16 | uint32 | uint64 | float32 | float64
}

type DemoStruct[T DemoStructType] struct {
	Data T
}

func main() {
	const m myType = 2
	d := DemoStruct[myType]{
		Data: m,
	}
	fmt.Println(d.Data)
}
```

::: warning
使用泛型结构体声明变量时，结构体的泛型类型不能省略。
:::

## any

any 是一个新的标识符，是 `interface{}` 的别名：

```go
// any is an alias for interface{} and is equivalent to interface{} in all ways.
type any = interface{}
```

可以使用 any 来代替原来的空接口类型。

## comparable

comparable 是一个接口，表示可以使用 `==` 或 `!=` 进行比较的所有类型的集合：

```go
package main

import "fmt"

func main() {
	fmt.Println(IsEqual(1, 2))
	fmt.Println(IsNotEqual("a", "b"))
}

func IsEqual[T comparable](a, b T) bool {
	return a == b
}

func IsNotEqual[T comparable](a, b T) bool {
	return a != b
}
```

::: warning
comparable 只能用来限制泛型类型。
:::

## 泛型切片

```go
package main

import "fmt"

type mySlice[T int | string] []T

func main() {
	var a mySlice[int] = []int{1, 2, 3}
	var b mySlice[string] = []string{"1", "2", "3"}
	fmt.Println(a)
	fmt.Println(b)
}
```

## 泛型 map

```go
package main

import "fmt"

type myMap [K int|string, V float32|float64] map[K]V

func main() {
	var m myMap[int, float32] = map[int]float32{
		1: 1.1,
		2: 2.2,
		3: 3.3,
	}
	fmt.Println(m)
}
```

## 泛型 channel

```go
package main

import "fmt"

type myChannel[T int|string|[]int] chan T

func main() {
	var m myChannel[[]int] = make(myChannel[[]int])
	defer close(m)
	go func ()  {
		select {
		case x := <- m:
			fmt.Println(x)
			break
		default:

		}
	}()
	m <- []int{1, 2, 3, 4, 5}

}
```

## Go1.18 其他内容

Go1.18 修改并增加了一些方法，引入了 workspace 及模糊测试，详见：[Go1.18 Release Notes](https://tip.golang.org/doc/go1.18)。
