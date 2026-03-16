# 接口

接口定义了一个对象的行为规范，只定义规范不实现，由具体的对象来实现规范的细节。

Go 语言中接口是一种类型，一种抽象的类型，接口是一组方法的集合。

定义接口：

```go
type Talk interface{
  say()
}
```

实现并使用接口：

```go
func (d *dog) say() {
  fmt.Printf("%s says: %s\n", d.name, d.sound)
}

func (c *cat) say() {
  fmt.Printf("%s says: %s\n", c.name, c.sound)
}
func main() {
  var talk Talk
  cat1 := &cat{
    &animal{
      name: "CAT1",
      sound: "MIAO",
    },
  }
  dog1 := &dog{
    &animal{
      name: "DOG1",
      sound: "WANG",
    },
  }
  talk = cat1
  talk.say()
  talk = dog1
  talk.say()
}
```

## 接口方法实现的接收者

如果接收者是指针类型，那么只能给接口变量传入指针类型，如果接收者是值类型，那么既可以传入值类型也可以传入指针类型。

## 空接口

任何类型都实现了空接口，空接口可以接受任意类型的函数参数。

_使用空接口作为函数的参数可以接受任意类型的函数参数。_

_空接口作为 map 的值可以保存任意值的字典。_
