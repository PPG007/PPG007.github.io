# 流程控制

## if 语句

- 可省略条件表达式括号。
- 初始化语句可以定义代码块局部变量。
- 代码左括号必须在条件表达式尾部。

```go
if b := a+4; b > 10 {
  println(4)
} else if b > 3 {
  println(3)
} else {
  println("else")
}
```

## switch 语句

分支表达式可以是任意类型，不限于常量，可以省略 break，默认自动终止。

```go
score := 95
switch score {
case 90, 95:
  println(90)
case 60:
  println(60)
case 40:
  println(40)
}
```

## for

```go
// 带有初始化语句的 for 循环。
for i := 0; i < count; i++ {

}
// 只有条件的 for 循环。
n := 10
for n > 0 {
  println(n)
  n--
}
// 死循环
for {

}
```

## range

类似迭代器操作，返回*索引-值*或*键-值*。

range 可以对切片、map、数组、字符串等进行迭代:

| 类型       | 第一个返回值 | 第二个返回值 |
| ---------- | ------------ | ------------ |
| string     | 下标         | 下标对应的值 |
| 数组、切片 | 下标         | 下标对应的值 |
| map        | 键           | 值           |
| channel    | element      |

如果想忽略某个返回值可以使用下划线 `_` 占位。

```go
str := "李在赣神魔"
for _, v := range str {
  fmt.Printf("%c ", v)
}
fmt.Println()
array := [5]int{1, 2, 3, 4, 5}
for index, value := range array {
  fmt.Println(index, value)
}
fmt.Println()
slice := array[1:4]
for index, value := range slice {
  fmt.Println(index, value)
}
userMap := make(map[string]string, 5)
userMap["username"] = "koston"
userMap["password"] = "123456"
for key, v := range userMap {
  fmt.Println(key, v)
}
```

range 会复制对象，使用 range 获取的返回值是循环前的对象中的内容，如果循环中修改了源对象，返回值不变：

```go
array := [5]int{1, 2, 3, 4, 5}
for index, value := range array {
  if index == 0 {
    array[2] = 100
  }
  fmt.Println(index, value) // 不会输出 100
}
fmt.Println(array)
```

但是如果使用引用会受到影响：

```go
slice := []int{1, 2, 3, 4, 5} // 切片
for index, value := range slice {
  if index == 0 {
    slice[2] = 100
  }
  fmt.Println(index, value) // 会输出 100。
}
fmt.Println(slice)
```
