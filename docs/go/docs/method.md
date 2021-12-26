# 方法

Go 语言中方法总是绑定对象实例，并隐式地将实例作为第一实参。

- 只能为当前包内命名类型定义方法。
- 参数 receiver 可任意命名。
- 参数 receiver 类型可以是 T 或 *T。T 不能是接口或指针。
- 不支持方法重载，receiver 只是参数签名的组成部分。
- 可用实例 value 或 pointer 调用全部方法，编译器自动转换。

方法定义格式：

```text
func (接收者变量 接收者类型) 方法名(参数列表) (返回参数) {
  函数体
}
```

```go
func (u user) getBirthYear() (birthYear int) {
  birthYear = time.Now().Year() - u.age
  return
}

func main() {
  user1 := &user{
    username: "koston",
    password: "123456",
    age:      21,
  }
  fmt.Println(user1.getBirthYear())
}
```

## 指针类型接收者

类似于 this，所有的修改都会生效。

```go
func (u *user) grow(step int) {
  u.age += step
}

func main() {
  user1 := &user{
    username: "koston",
    password: "123456",
    age:      21,
  }
  user1.grow(5)
  fmt.Println(user1.age)
}
```

使用指针接收者的场景：

- 需要修改接收者中的值。
- 接收者是拷贝代价比较大的对象。
- 保证一致性。

## 方法集

方法集规则：

- 类型 T 方法集包含全部 receiver T 方法。
- 类型 \*T 方法集包含全部 receiver T + \*T 方法。
- 如类型 S 包含匿名字段 T，则 S 和 *S 方法集包含 T 方法。
- 如类型 S 包含匿名字段 \*T，则 S 和 \*S 方法集包含 T + \*T 方法。
- 不管嵌入 T 或 \*T，\*S 方法集总是包含 T + \*T 方法。
