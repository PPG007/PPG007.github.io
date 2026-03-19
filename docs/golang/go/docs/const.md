# 常量

单独声明：

```go
const PI = 3.141592653
```

批量声明：

```go
const (
  OK = 200
  NOT_FOUND = 404
)
```

批量声明时，如果某一行声明后没有赋值，则取上一行的值：

```go
const (
  OK = 200
  NOT_FOUND = 404
  ALIAS // 404
)
```

## iota

iota 只能在常量表达式中使用，在 const 关键字出现时将被重置为0，每新增一行常量声明，iota 就向上计数一次。

```go
const (
  a = iota // 0
  b = iota // 1
  c // 2
)
const (
  d = iota // 0
)
```

使用 `_`可以跳过某个值：

```go
const (
  d = iota
  _
  e // 2
)
```

多个常量声明在一行：

```go
const (
  a, b = iota + 1, iota + 2 //1, 2
  c, d = iota + 1, iota + 2 // 2, 3
)
```
