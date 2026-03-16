# 结构体

## 类型别名和自定义类型

自定义类型是定义了一个全新的类型，可以基于内置的基本类型定义，也可以通过结构体定义。

```go
// 自定义类型
type MyInt int

// 类型别名
type byte = uint8
```

## 定义结构体

```go
type user struct {
  username string
  password string
  age int
}
```

## 结构体实例化

```go
var user1 user
user1.username = "koston"
user1.password = "123456"
user1.age = 21
```

## 匿名结构体

```go
var ticket struct {
  destination string
  depature string
  date time.Time
}
ticket.destination = "A"
ticket.depature = "B"
ticket.date = time.Now()
```

## 指针类型结构体

Go 语言中可以直接通过指针操作成员，可以不使用星号（语法糖）。

```go
var user1 = new(user)
user1.age = 21
(*user1).username = "koston"
fmt.Println(*user1)
```

## 取结构体的地址实例化

用 `&` 取地址相当于进行了一次 new 操作。

```go
user1 := &user{}
user1.age = 21
```

## 使用键值对初始化

```go
// user1 是 user 类型。
user1 := user{
  username: "koston",
  password: "123456",
  age:      21,
}
fmt.Println(user1)
// user2 是 user 指针类型。
user2 := &user{
  username: "PPG007",
}
fmt.Println(*user2)
```

## 使用值的列表初始化

```go
user1 := &user{
  "koston",
  "123456",
  21,
}
fmt.Println(*user1)
```

- 必须初始化结构体的所有字段。
- 初始值的填充顺序必须与字段在结构体中的声明顺序一致。
- 该方式不能和键值初始化方式混用。

## 构造函数

Go 语言中结构体没有构造函数，但可以通过其他方式实现同样效果。

```go
func newUser(username, password string, age int) *user {
  return &user{
    username,
    password,
    age,
  }
}

func main() {
  user1 := newUser("koston", "123456", 21)
  fmt.Println(*user1)
}
```

## 结构体匿名字段

```go
type demo struct {
  string
  int
}
```

匿名字段默认采用类型名作为字段名，结构体要求字段名称必须唯一，一个结构体中同类型的匿名字段只能有一个。

## 继承

嵌套匿名结构体可以实现继承。

```go
type animal struct {
  name string
}

func (a *animal) move() {
  fmt.Printf("%s move\n", a.name)
}

type dog struct {
  *animal
}

func (d *dog) sound() {
  fmt.Printf("%s wang\n", d.name)
}
func main() {
  dog1 := dog{
    animal: &animal{
      name: "dog1",
    },
  }
  dog1.move()
  dog1.sound()
}
```

## 字段的可见性

结构体中字段大写开头表示可公开访问，小写表示私有，仅在定义当前结构体的包中可以访问。

## 结构体与 JSON 序列化

只有可公开访问的字段才会出现在 JSON 字符串中。

```go
user1 := newUser("koston", "123456", 21, "SD", "QD")
jsonString, err := json.Marshal(user1)
if err != nil {
  fmt.Println("JSON 序列化失败")
  return
}

fmt.Println(string(jsonString))

user2 := &user{}
json.Unmarshal([]byte(jsonString), user2)
fmt.Println(*user2)
```

## 结构体标签

结构体标签是结构体的元信息，可以在运行时通过反射读取。标签在结构体字段的后方定义，使用反引号，由一个或多个键值对构成，键值使用冒号分隔，值用双引号，键值对之间使用一个空格分隔。

```go
// 通过结构体标签指定转为 JSON 时的键
type address struct {
  Province string `json:"省份"`
  City string `json:"城市"`
}
```
