# Go

## init 函数和 main 函数

main 函数是程序的默认入口

init 函数用于包的初始化，每个包可以有多个 init 函数，包的每个源文件也可以有多个 init 函数，init 函数不能被其他函数调用，在 main 之前、全局声明后调用。

## 变量

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

简短变量声明（只能在函数内部使用）

```go
hello := "Hello"
x :=int(2)
```

匿名变量：使用多重赋值时，如果想要忽略某个值，可以使用匿名变量占位，匿名变量不占用命名空间，不会分配内存，匿名变量之间不存在重复声明。

```go
_, a := 1, 2
```

## 常量

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

### iota

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

## 下划线

下划线的作用：忽略某个返回值、占位符、执行 init 函数，例如 `import _ "./hello"` 会执行 hello 包下的 init 函数。

## 整型

有符号整型：int8、int16、int32、int64。

无符号整型：uint8、uint16、uint32、uint64。

int 和 uint 在 32 位机器中是 int32 或 uint32，在 64 位机器中是 int64 或 uint64。

uintptr：无符号整型，存放一个指针。

## 浮点数

Go 语言中，浮点数分为 float32 和 float64 两种类型，如果不显式指定则默认是 float64。

## 复数

Go 中复数使用 complex64 或 complex128，前者实部和虚部为 32 位，后者实部和虚部为 64 位。`a := complex64(2 + 3i)`。

## 布尔值

布尔值只有 true 和 false，Go 语言中不允许整数向布尔值转换，默认为 false，不能参与运算。

## 字符串

字符串常用操作：

- len(str)：求长度。

    ```go
    fmt.Println("字符串的长度：", len(str))
    ```

- `+` 或 `fmt.Sprintf`：拼接字符串。

    ```go
    fmt.Println(fmt.Sprintf("%s%s", str, str))
    ```

- `strings.Split`：分割。

    ```go
    fmt.Println(strings.Split(str, ","))
    ```

- `strings.Contains`：判断是否包含。

    ```go
    fmt.Println(strings.Contains(str, "芜湖"))
    ```

- `strings.HasPrefix,strings.HasSuffix`：前缀后缀判断。

    ```go
    fmt.Println(strings.HasPrefix(str, "这"), strings.HasSuffix(str, ","))
    ```

- `strings.Index(),strings.LastIndex`：子串出现的位置。

    ```go
    fmt.Println(strings.Index(str, ","))
    ```

- `strings.Join`：符号连接。

    ```go
    fmt.Println(strings.Join(strings.Split(str, ","), "-"))
    ```

Go 语言中字符有两种：uint8 类型，代表 ASCII 的一个字符，rune 类型，代表一个 UTF-8 字符。

字符串底层是一个 byte 数组，字符串的长度就是 byte 字节的长度。

遍历字符串：

```go
for _, c := range str {
  fmt.Printf("%c\n", c)
}
```

如果字符串只有 ASCII 字符：

```go
for i := 0; i < len(str); i++ {
  fmt.Printf("%c\n", str[i])
}
```

修改字符串：要修改字符串需要先转为 rune 或 byte 数组，修改完成后再转换为 string，无论哪种转换都会重新分配内存并复制字节数组。

```go
str := string("这,是,一,段,字,符,串,")
runeArray := []rune(str)
runeArray[6] = '个'
fmt.Println(string(runeArray))
```

## 数组

一维数组：

```go
a := [...]int{1, 2, 3} // 通过初始值指定数组长度
b := [3]int{1, 2, 3}
c := [3]int{0:1} // 通过数组下标初始化
```

多维数组：

```go
a := [...][2]int{{1, 2}, {3, 4}, {5, 6}}
```

可以通过 len 和 cap 函数返回数组的元素数量，如果是多维数组，只返回最外层有多少元素。

## 切片

- 切片是数组的一个引用，是引用类型。如果修改切片的某个元素，则原数组的对应元素会被修改。
- 切片的长度可以改变，切片是可变的数组。
- 使用 cap 可以得到切片最大扩张容量，不超过所引用的数组的大小。

创建切片：

```go
a := [...][2]int{{1, 2}, {3, 4}, {5, 6}}

var slice1 []int // 只声明
slice2 := []int{} // 指向空数组
var slice3 []int = make([]int, 0)
var slice4 []int = make([]int, 0, 0)
var slice5 []int = a[0][0:1] // 截取数组的一部分，前闭后开
```

现有这样一个数组 `a := [...]int{1, 2, 3, 4, 5, 6}`，为切片赋值：

```go
slice = a[:] // 包含数组 a 的所有元素。
slice = a[3:] // 包含从数组指定下标开始的后续所有元素，包含指定下标元素。
slice = a[:3] // 包含从数组第一个元素到指定下标的所有元素，不包含指定下标元素。
slice = a[0:5] // 包含数组指定区间的所有元素，左闭右开。
```

切片追加：

```go
a := []int{1, 2, 3, 4, 5, 6}
slice := append(a, a...) // 第二个参数是一个元素，如果要传入数组要使用三个点拆分数组。
fmt.Println(slice)
```

append 向切片尾部添加数据返回新的切片对象。

如果超出最大扩张容量，会重新分配底层数组，即使原数组没有填满，即切片指向了另一个数组，后续修改切片不会影响原数组。

切片复制：

```go
slice2 := make([]int, 10, 20)
slice3 := make([]int, 20)
copy(slice2, slice)
copy(slice3, slice)
```

copy 函数在两个切片之间复制，源切片是第二个参数，复制长度以长度小的为准，如果源切片长度超过了后面切片的长度，即使有扩张容量也不会复制超出部分。

### 字符串和切片

字符串底层是数组，因此也可以进行切片操作。

```go
str := string("这是一个字符串")
slice := []rune(str)[1:3]
fmt.Println(string(slice))
```

## 指针

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

### new 和 make

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

## Map

map 是一种无序的基于键值对的数据结构，Go 语言中 map 是引用类型，必须初始化才能使用。

```go
userMap := make(map[string]string, 1)
userMap["username"] = "koston"
userMap["password"] = "123"
userMap["age"] = "21"
fmt.Println(userMap)
```

遍历 map：

```go
for k, v := range userMap {
  fmt.Printf("%s %s\n", k, v)
}
```

判断某个键是否存在：

```go
val, ok := userMap["test"]
if ok {
  fmt.Println(val)
} else {
  fmt.Println("this key not exist")
}
```

删除键值对：

```go
delete(userMap, "age")
```

按照指定顺序遍历 map：

```go
// 获取 map 的 key 数组
keys := make([]string, 0, len(userMap))
for k := range userMap {
  keys = append(keys, k)
}
// 对这个数组进行排序
sort.Strings(keys)
// 按新顺序进行遍历
for _, v := range keys {
  fmt.Println(v, userMap[v])
}
```

## 流程控制

### if 语句

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

### switch 语句

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

### for

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

### range

类似迭代器操作，返回*索引-值*或*键-值*。

range 可以对切片、map、数组、字符串等进行迭代:

类型|第一个返回值|第二个返回值
---|----------|----------
string|下标|下标对应的值
数组、切片|下标|下标对应的值
map|键|值
channel|element|

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

## 函数

### 函数定义

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

### defer 延迟执行

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

### 闭包

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

### 异常处理

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

### 单元测试

// TODO

### 压力测试

// TODO

## 结构体

### 类型别名和自定义类型

自定义类型是定义了一个全新的类型，可以基于内置的基本类型定义，也可以通过结构体定义。

```go
// 自定义类型
type MyInt int

// 类型别名
type byte = uint8
```

### 定义结构体

```go
type user struct {
  username string
  password string
  age int
}
```

### 结构体实例化

```go
var user1 user
user1.username = "koston"
user1.password = "123456"
user1.age = 21
```

### 匿名结构体

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

### 指针类型结构体

Go 语言中可以直接通过指针操作成员，可以不使用星号（语法糖）。

```go
var user1 = new(user)
user1.age = 21
(*user1).username = "koston"
fmt.Println(*user1)
```

### 取结构体的地址实例化

用 `&` 取地址相当于进行了一次 new 操作。

```go
user1 := &user{}
user1.age = 21
```

### 使用键值对初始化

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

### 使用值的列表初始化

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

### 构造函数

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

### 结构体匿名字段

```go
type demo struct {
  string
  int
}
```

匿名字段默认采用类型名作为字段名，结构体要求字段名称必须唯一，一个结构体中同类型的匿名字段只能有一个。

### 继承

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

### 字段的可见性

结构体中字段大写开头表示可公开访问，小写表示私有，仅在定义当前结构体的包中可以访问。

### 结构体与 JSON 序列化

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

### 结构体标签

结构体标签是结构体的元信息，可以在运行时通过反射读取。标签在结构体字段的后方定义，使用反引号，由一个或多个键值对构成，键值使用冒号分隔，值用双引号，键值对之间使用一个空格分隔。

```go
// 通过结构体标签指定转为 JSON 时的键
type address struct {
  Province string `json:"省份"`
  City string `json:"城市"`
}
```

## 方法

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

### 指针类型接收者

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

### 方法集

方法集规则：

- 类型 T 方法集包含全部 receiver T 方法。
- 类型 \*T 方法集包含全部 receiver T + \*T 方法。
- 如类型 S 包含匿名字段 T，则 S 和 *S 方法集包含 T 方法。
- 如类型 S 包含匿名字段 \*T，则 S 和 \*S 方法集包含 T + \*T 方法。
- 不管嵌入 T 或 \*T，\*S 方法集总是包含 T + \*T 方法。

## 接口

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

### 接口方法实现的接收者

如果接收者是指针类型，那么只能给接口变量传入指针类型，如果接收者是值类型，那么既可以传入值类型也可以传入指针类型。

### 空接口

任何类型都实现了空接口，空接口可以接受任意类型的函数参数。

*使用空接口作为函数的参数可以接受任意类型的函数参数。*

*空接口作为 map 的值可以保存任意值的字典。*

## 类型转换

### 类型断言

```go
map1 := make(map[string]interface{}, 10)
map1["cat1"] = cat1
cat2, isOk := map1["cat1"].(*cat)
```

### 类型 switch

将一个变量断言成 type 类型，type 类型具体值就是 switch case 的值，如果 x 成功断言成某个 case 就可以执行哪个 case。

```go
switch i := map1["cat1"].(type) {
case int:
  fmt.Println("int")
case cat:
  fmt.Println("cat", i.name)
case *cat:
  fmt.Println("*cat", i.name)
}
```

## IO

### 终端输入输出

- `os.Stdin`：标准输入的文件实例，类型为 *File。
- `os.Stdout`：标准输出的文件实例，类型为 *File。
- `os.Stderr`：标准错误输出的文件实例，类型为 *File。

### 读写文件

```go
// 写文件
func WriteStringToFile(file string) {
  // 创建一个文件，默认权限 0666。
  f, err := os.Create(file)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer f.Close()
  for i := 0; i < 5; i++ {
    f.WriteString("李在赣神魔\n")
    f.Write([]byte("芜湖"))
  }
}

// 读文件
func ReadFileAsString(file string){
  f, err := os.Open(file)
  if err != nil {
    fmt.Println("打开文件错误")
    return
  }
  defer f.Close()
  var buf [128]byte
  var content []byte
  for {
    n, err := f.Read(buf[:])
    if err == io.EOF {
      break
    }
    if err != nil {
      fmt.Println("读取文件出错")
      return
    }
    content = append(content, buf[:n]...)
  }
  fmt.Println(string(content))
}
```

### 拷贝文件

```go
func CopyFile (source, dest string) {
  destFile, err := os.Create(dest)
  if err != nil {
    fmt.Println(err)
    return
  }
  sourceFile, err2 := os.Open(source)
  if err2 != nil {
    fmt.Println(err2)
    return
  }
  var buffer [1024]byte
  for {
    n, err3 := sourceFile.Read(buffer[:])
    if err3 == io.EOF {
      break
    }
    destFile.Write(buffer[:n])
  }
}
```

### 其他 API

删除文件：

```go
os.Remove(filePath)
```

指定打开文件的方式、权限：

```go
f, err := os.OpenFile("demo.txt", os.O_APPEND|os.O_RDWR, os.ModeAppend)
```

### bufio

bufio 包实现了带缓冲区的读写，是对文件读写的封装。

```go
func BufferWrite(name string) {
  f, err := os.OpenFile(name, os.O_APPEND|os.O_WRONLY, 0666)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer f.Close()
  w := bufio.NewWriter(f)
  for i := 0; i < 10; i++ {
    w.WriteString("李在赣神魔\t")
  }
  w.Flush()
}
func BufferRead(name string) {
  f, err := os.Open(name)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer f.Close()
  r := bufio.NewReader(f)
  for {
    line, _, err := r.ReadLine()
    if err == io.EOF {
      break
    }
    if err != nil {
      return
    }
    fmt.Println(string(line))
  }
}
```

通过 bufio 获取标准输入：

```go
r := bufio.NewReader(os.Stdin)
line, _, _ := r.ReadLine()
```

### ioutil

读取所有内容：

```go
f, err := os.Open("demo.txt")
if err != nil {
  return
}
// 直到读取到 EOF，但是不会将读取到 EOF 视为错误。
b, err2 := ioutil.ReadAll(f)
if err2 != nil {
  return
}
fmt.Println(string(b))
```

或者使用 ReadAll 方法：

```go
b, err := ioutil.ReadFile("demo.txt")
if err != nil {
  return
}
fmt.Println(string(b))
```

向指定文件写入数据，如果文件不存在将按照给定权限创建文件，否则在写入前清空文件内容。

```go
func main() {
  err := ioutil.WriteFile("demo.txt", []byte("拖，就硬拖"), 0666)
  if err != nil {
    fmt.Println(err)
    return
  }
}
```

读取指定目录中的信息：

```go
func main() {
  fi, err := ioutil.ReadDir(".")
  if err != nil {
    fmt.Println(err)
    return
  }
  for _, v := range fi {
    fmt.Println(v.Name())
  }
}
```

## Time

### 时间戳

时间戳是从 1970.1.1 到当前时间的毫秒数。

```go
// 获取时间戳：
now := time.Now()
timestamp1 := now.Unix()
timestamp2 := now.UnixNano()
// 将时间戳转换为时间格式：
func ConvertTimestampToDate(timestamp int64, nsec int64) {
  t := time.Unix(timestamp, nsec)
  fmt.Println(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute(), t.Second())
}
```

### 时间间隔

时间间隔 time.Duration 是一个 time 包下的类型，代表两个时间点之间经过的时间，以纳秒为单位。

```go
time.Duration.Hours()
```

### 时间操作

```go
// 相加
fmt.Println(t1.Add(time.Hour))
// 求差
fmt.Println(t2.Sub(t1))
// 判断是否相等
fmt.Println(t1.Equal(t2))
// 判断是否在前
fmt.Println(t1.Before(t2))
// 判断是否在后
fmt.Println(t2.After(t1))
```

### 定时器

Ticker：每隔一段时间执行。

```go
t := time.NewTicker(time.Second * 1)
n := int(0)
for range t.C {
  n++
  if n == 10 {
    t.Stop()
    break
  }
  fmt.Println(n)
}
```

Timer：时间到了只执行一次。

```go
t := time.NewTimer(5 * time.Second)
fmt.Println(<- t.C)
// 重置定时器
t.Reset(3 * time.Second)

// 或者
<-time.After(time.Second * 2)
```

### 时间格式化

将 Time 转为日期字符串：

Go 语言中格式化字符串使用的是 Go 语言的诞生时间 2006 年 1 月 2 号 15 点 04 分，如果希望使用 12 小时制要指明 PM。

```go
fmt.Println(t.Format("2006-01-02 3:04:05 PM Mon Jan"))
fmt.Println(t.Format("2006-01-02 15:04:05"))
fmt.Println(t.Format("2006.01.02 15:04"))
```

解析字符串格式的事件：

```go
// 使用时区：
func ParseTime() {
  l, err := time.LoadLocation("Asia/Shanghai")
  if err != nil {
    fmt.Println(err)
    return
  }
  t, err := time.ParseInLocation("2006-01-02 3:04:05 PM Mon Jan", "2021-11-12 4:31:03 PM Fri Nov", l)

  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(t)
}
// 不使用时区：
func ParseTime() {
  t, err := time.Parse("2006.01.02 15:04", "2021.11.12 16:31")
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(t)
}
```

## 并发编程

### Goroutine

*一个 goroutine 必定对应一个函数，可以创建多个 goroutine 去执行相同的函数。*

主协程退出后，其他任务将一同结束。

### runtime 包

- runtime.Gosched()：类似 Java Thread.yield()。

```go
var count int = 0

func main() {
  go func() {
    for {
      time.Sleep(time.Second)
      count++
      fmt.Println(count)
      if count == 5 {
        return
      }
    }
  }()
  for count != 5 {
    runtime.Gosched()
  }
  fmt.Println("over")
}
```

- runtime.Goexit()：退出当前协程。

```go
func main() {
  go func() {
    for {
      time.Sleep(time.Second)
      count++
      fmt.Println(count)
      if count == 10 {
        runtime.Goexit()
      }
    }
  }()
  for count != 10 {
    runtime.Gosched()
  }
  fmt.Println("over")
}
```

Go 语言中操作系统线程和 goroutine 的关系：

- 一个操作系统线程对应多个用户态 goroutine。
- go 程序可以同时使用多个操作系统线程。
- goroutine 和操作系统线程是多对多的关系。

### channel

channel 可以让一个 goroutine 发送特定值到另一个 goroutine。

channel 是一种特殊类型，遵循先进先出原则，保证收发数据的顺序，每一个通道都是一个具体类型的导管，也就是声明 channel 的时后需要为其指定元素类型。

```go
var ch1 chan int   // 声明一个传递整型的通道
var ch2 chan bool  // 声明一个传递布尔型的通道
var ch3 chan []int // 声明一个传递int切片的通道
```

声明的 channel 需要使用 make 函数初始化之后才能使用，其中缓冲大小是可选的。

```go
ch := make(chan int, 10)
```

channel 的操作：

```go
// 发送
ch <- 123

// 接收
x := <- ch
<- ch // 忽略接收值。

// 关闭
// 只有在通知接收方 goroutine 所有的数据都发送完毕的时候才需要关闭通道，通道是可以被垃圾回收的，因此关闭通道不是必须的。
close(ch)
```

对于已经关闭的通道：

- 对一个关闭的通道再发送值就会导致 panic。
- 对一个关闭的通道进行接收会一致获取值直到通道为空。
- 对一个关闭并且没有值的通道执行接收操作会得到对应类型的零值。
- 关闭一个已经关闭的通道会导致 panic。

无缓冲的通道：

![无缓冲的通道](https://www.topgoer.com/static/7.1/3.png)

无缓冲的通道只有在有人接收值的时候才能发送值。使用无缓冲的通道将导致发送和接收同步化，因此也被称为同步通道。

```go
func main() {
  ch := make(chan string)
  go receive(ch)
  ch <- "123"
  fmt.Println("发送陈坤")
  for runtime.NumGoroutine() == 2 {
    runtime.Gosched()
  }
}
func receive(ch chan string) {
  time.Sleep(time.Second * 5)
  x := <-ch
  fmt.Println("接收陈坤", x)
}
```

有缓冲的通道：

![有缓冲的通道](https://www.topgoer.com/static/7.1/4.png)

只要通道的容量大于零，那么就是有缓冲的通道，通道的容量表示通道中能存放元素的数量。可以使用 len 函数获取通道内的元素数量，使用 cap 函数获取通道的容量。

判断通道是否关闭：

```go
// 方式一：在从通道中取值时，通过接收第二个返回值判断是否关闭。
for {
  i, ok := <- ch1
  if !ok {
    break
  }
  ch2 <- i * 1
}

// 方式二：通过 range 循环自动判断。
for i:= range ch2 {
  fmt.Println(i)
}
```

单向通道：

可以在传参时将通道定义为单向的，只能发送或者只能接收，双向通道可以转换为单向通道，反之不行。

```go
func main() {
  ch1 := make(chan int)
  ch2 := make(chan int)
  go func(out chan<- int) {
    for i := 0; i < 100; i++ {
      out <- i
    }
    close(out)
  }(ch1)
  go func(in <-chan int, out chan<- int) {
    for {
      i, ok := <-in
      if !ok {
        break
      }
      out <- i * 1
    }
    close(ch2)
  }(ch1, ch2)
  for i := range ch2 {
    fmt.Println(i)
  }
}
```

channel 状态|nil|非空|空|满|未满
-----------|---|---|--|--|----
接收|阻塞|接收值|阻塞|接收值|接收值
发送|阻塞|发送值|发送值|阻塞|发送值
关闭|panic|关闭成功，读取完数据后返回零值|关闭成功，返回零值|关闭成功，读完数据后返回零值|关闭成功，读完数据后返回零值

### Goroutine 池

目的：控制 goroutine 的数量，防止数量暴涨。

```go
// 同步两个通道与关闭操作，防止死锁
var wg1 sync.WaitGroup
var wg2 sync.WaitGroup

type Job struct{
  Id int
  RandNum int
}

type Result struct{
  Job *Job
  Sum int
}

func main() {
  jobChan := make(chan *Job, 128)
  resultChan := make(chan *Result, 128)
  createPool(64, jobChan, resultChan)
  wg1.Add(1)
  go func() {
    defer wg1.Done()
    for result := range resultChan {
      b, _ := json.Marshal(result)
      fmt.Println(string(b))
    }
  }()
  id := int(0)
  for ;id < 10000;{
    id ++
    job := &Job{
      Id: id,
      RandNum: rand.Int(),
    }
    jobChan <- job
  }
  close(jobChan)
  wg2.Wait()
  close(resultChan)
  wg1.Wait()
}

func createPool(num int, jobChan chan *Job, resultChan chan *Result) {
  for i := 0; i < num; i++ {
    wg2.Add(1)
    go func(jobChan chan *Job, resultChan chan *Result) {
      defer wg2.Done()
      for job := range jobChan {
        sum := int(0)
        temp := job.RandNum
        for temp != 0{
          sum += temp % 10
          temp /= 10
        }
        r := &Result{
          Sum : sum,
          Job: job,
        }
        resultChan <- r
      }
    }(jobChan, resultChan)
  }
}
```

### select

select 同时监听一个或多个 channel，直到其中一个 channel ready，如果多个 channel 同时 ready，则随机选择一个执行。

```go
select {
case s1 := <-output1:
  fmt.Println("s1=", s1)
case s2 := <-output2:
  fmt.Println("s2=", s2)
}
```

### 锁

互斥锁：保证同时只有一个 goroutine 可以访问共享资源。

```go
package main
import (
  "fmt"
  "sync"
)
var wg sync.WaitGroup
var lock sync.Mutex
var count = 0
func main() {
  for i := 0; i < 1000; i++ {
    wg.Add(1)
    go func(wtg *sync.WaitGroup){
      defer wtg.Done()
      lock.Lock()
      count++
      lock.Unlock()
    }(&wg)
  }
  wg.Wait()
  fmt.Println(count)
}
```

读写互斥锁：当一个 goroutine 获取读锁后，其他 goroutine 可以继续获取读锁，但不能获取写锁；当一个 goroutine 获取写锁之后，其他的 goroutine 无论是获取读锁还是写锁都会等待。

```go
var lock sync.RWMutex
lock.RLock() // 加读锁
fmt.Println(count)
lock.RUnlock() // 释放读锁
lock.Lock() // 加写锁
count++
lock.Unlock() // 加读锁
```

### 同步

使用 `sync.WaitGroup` 实现并发任务的同步：

```go
// 如果要使用参数传递 wg，需要传递指针，因为 wg 是结构体。
go func(wtg *sync.WaitGroup){
  defer wtg.Done()
  count++
}(&wg)
```

使用 `sync.Once` 唯一的执行一个函数：

```go
var user *User
var once sync.Once
var wg sync.WaitGroup
func main() {
  for i := 0; i < 1000; i++ {
    wg.Add(1)
    go getInstence()
  }
  wg.Wait()
}
func getInstence() {
  defer wg.Done()
  if user == nil {
    fmt.Println("getInstence")
    once.Do(initUser)
  }
}
func initUser() {
  fmt.Println("initUser")
  user = &User{
    Username: "koston",
    Age:      21,
  }
}
```

使用线程安全的 map：`sync.Map`。

```go
var m = sync.Map{}

// Store() 存储一个键值对。
m.Store(i, i)
// Load() 根据键获取值。
// LoadOrStore() 如果传入的 key 存在就获取值，如果不存在就添加键值对。
// Delete() 删除键值对
// Range() 接收一个函数类型参数，该参数返回布尔值，遍历。
```

### 原子操作

```go
atomic.AddInt64(&count, 1)
```

其他 atomic 包下的方法：[atomic](https://www.topgoer.com/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B/%E5%8E%9F%E5%AD%90%E6%93%8D%E4%BD%9C%E5%92%8Catomic%E5%8C%85.html#atomic%E5%8C%85)

## 常用标准库

### fmt

Fprint 系列函数将内容输出到一个 io.Writer 接口类型的变量中，可以用这个函数向文件中写入内容。

```go
f, err := os.OpenFile("demo.txt", os.O_APPEND|os.O_WRONLY, 0666)
if err != nil {
  return
}
defer f.Close()
w := bufio.NewWriter(f)
fmt.Fprintln(w, "李在赣神魔")
w.Flush()
```

Sprint 系列函数将传入的数据连接成一个字符串并返回。

```go
s := fmt.Sprint(1, "qqwe", 1234)
s := fmt.Sprintln(1, "qqwe", 1234) // 空格分隔
```

Fscan 系列函数从 io.Reader 中读取数据。

```go
f, err := os.OpenFile("demo.txt", os.O_RDONLY, 0666)
if err != nil {
  return
}
defer f.Close()
var str string
fmt.Fscan(f, &str)
fmt.Println(str)
```

Sscan 系列函数从指定字符串读取数据。

```go
s := "123 sss"
var a int
var str string
fmt.Sscan(s, &a, &str)
```

### Flag

flag 包数显了命令行参数解析。

```go
// 这种方式收到的是指针
name := flag.String("name", "", "名字")
var age int
flag.IntVar(&age, "age", 0, "年龄")
// 定义完参数后，调用 Parse() 方法解析命令行参数才能在后续可用。
flag.Parse()
fmt.Println(*name, age)
```

### Log

```go
func main() {
  // 配置 flag选项。
  log.SetFlags(log.Llongfile | log.LUTC | log.Lmicroseconds | log.Ldate)
  // 配置日志前缀。
  log.SetPrefix("[ppg007]")
  // 配置日志输出位置。
  f, err := os.OpenFile("demo.txt", os.O_WRONLY|os.O_CREATE, 0666)
  if err != nil {
    return
  }
  log.SetOutput(f)

  log.Println("这是一条很普通的日志。")
  log.Fatalln("这是一条会触发fatal的日志。")
  log.Panicln("这是一条会触发panic的日志。")
}
```

### strconv

string 与 int 互相转换。

```go
// 字符串转为 int 类型，如果无法转换就会返回错误
i, err := strconv.Atoi(s)
// int 转为字符串
s2 := strconv.Itoa(a)
```

Parse 系列函数用于将字符串转为指定类型的值。

```go
// 字符串转为整数，第二个参数表示进制，如果指定为 0，那么使用前缀判断，第三个参数指定能无溢出赋值的整数类型，0 表示 int，64 表示 int64
i, err := strconv.ParseInt(s, 10, 64)
// 字符串转为布尔
b, err := strconv.ParseBool("false")
// 字符串转为无符号整型传入负数会报错
b, err := strconv.ParseUint("123", 10, 64)
// 字符串转为浮点，第二个参数指定期望接收类型
b, err := strconv.ParseFloat("3.14", 64)
```

Format 系列函数将给定类型数据格式化为字符串。

```go
fmt.Printf("%T\n", strconv.FormatBool(false))
// 第二个参数表示进制
fmt.Printf("%T\n", strconv.FormatInt(12, 10))
// 第二个参数表示格式，第三个参数控制精度，第四个参数表示要转换的数的来源是 float32 还是 float64
fmt.Printf("%T\n", strconv.FormatFloat(3.14, 'f', -1, 64))
// 第二个参数表示进制
fmt.Printf("%T\n", strconv.FormatUint(123, 2))
```

### http

服务端：

```go
// 定义处理函数
func getServer(w http.ResponseWriter, r *http.Request) {
  if r.Method != "GET" {
    answer := `{"status": "405"}`
    w.Write([]byte(answer))
    return
  }
  defer r.Body.Close()
  query := r.URL.Query()
  fmt.Println(query.Get("token"))
  answer := `{"status": "ok"}`
  w.Write([]byte(answer))
}

func postServer(w http.ResponseWriter, r *http.Request) {
  defer r.Body.Close()
  if r.Method != "POST" {
    answer := `{"status": "405"}`
    w.Write([]byte(answer))
    return
  }
  b, err := ioutil.ReadAll(r.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(b))
  answer := `{"status": "ok"}`
  w.Write([]byte(answer))
}

//配置服务器
func StartServer(wg *sync.WaitGroup) {
  defer wg.Done()
  http.HandleFunc("/get", getServer)
  http.HandleFunc("/post", postServer)
  err := http.ListenAndServe(":8848", nil)
  if err != nil {
    fmt.Println(err)
    return
  }
}
```

GET 请求：

```go
response, err := http.Get("http://150.158.153.216:8848/passenger/checkToken")
if err != nil {
  fmt.Println(err)
  return
}
// 最后要关闭 response body
defer response.Body.Close()
b, err2 := ioutil.ReadAll(response.Body)
if err2 != nil {
  fmt.Println(err2)
  return
}
fmt.Println(string(b))
```

带参 GET 请求：

```go
api := "http://150.158.153.216:8848/passenger/checkToken"
data := url.Values{}
data.Set("token", "test")
u, err := url.ParseRequestURI(api)
if err != nil {
  fmt.Println(err)
  return
}
u.RawQuery = data.Encode()
r, err2 := http.Get(u.String())
```

POST 请求：

```go
func Post() {
  uri := "http://localhost:8848/post"
  r, err := http.Post(uri, "application/json", strings.NewReader(`{"token": "test"}`))
  if err != nil {
    fmt.Println(err)
    return
  }
  defer r.Body.Close()
  b, err2 := ioutil.ReadAll(r.Body)
  if err2 != nil {
    fmt.Println(err2)
    return
  }
  fmt.Println(string(b))
}
```

### context

Context 接口中定义了四个方法：

- Deadline 方法返回当前 Context 被取消的时间，也就是完成工作的截止时间。
- Done 方法返回一个 Channel，这个 Channel 会在当前工作完成或者上下文被取消之后关闭，多次调用 Done 方法会返回同一个 Channel。
- Err 方法会返回当前 Context 结束的原因，它只会在 Done 返回的 Channel 被关闭时才会返回非空的值：
    - 如果当前 Context 被取消就会返回 Canceled 错误。
    - 如果当前 Context 超时就会返回 DeadlineExceeded 错误。
- Value 方法会从 Context 中返回键对应的值，对于同一个上下文来说，多次调用 Value 并传入相同的 Key 会返回相同的结果，该方法仅用于传递跨 API 和进程间跟请求域的数据。

With 系列函数：

- WithCancel()：返回一个 当前 Context 的副本和一个 cancel 函数，调用这个函数就会导致 Done 通道中有内容。

    ```go
    func main() {
      c, cancel := context.WithCancel(context.Background())
      wg.Add(1)
      go worker(c)
      time.Sleep(time.Second * 5)
      cancel()
      wg.Wait()
    }
    ```

- WithDeadline()：返回一个当前 Context 的副本和一个 cancel 函数。超时或者主动调用 cancel 函数都会导致 Done channel 中出现内容。

    ```go
    c, cancel := context.WithDeadline(context.Background(), time.Now().Add(2 * time.Second))
    ```

- WithTimeout()：返回一个当前 Context 的副本和一个 cancel 函数，超时或者主动调用 cancel 函数会导致 Done channel 中出现内容。

    ```go
    c, cancel := context.WithTimeout(context.Background(), time.Second * 2)
    ```

- WithValue()：返回当前 Context 的副本，所提供的键必须是可比较的，并且不应该是任何内置类型。

Context 注意事项：

- 以参数方式显式传递 Context。
- 以 Context 作为参数的函数方法，应该把 Context 作为第一个参数。
- 给一个函数方法传递 Context 的时候不要传递 nil，如果不知道要传递什么，就用 context.TODO()。
- Context 的 Value 相关方法应该传递请求域的必要数据，不应该用于传递可选参数。
- Context 是线程安全的。

## 反射

### 基本用法

- 获取类型信息：reflect.TypeOf，是静态的。
- 获取值信息：reflect.ValueOf，是动态的。

```go
func reflect_type(a interface{}) {
   t := reflect.TypeOf(a)
   fmt.Println("类型是：", t)
   fmt.Println(reflect.ValueOf(a))
   // kind()可以获取具体类型
   k := t.Kind()
   fmt.Println(k)
   switch k {
   case reflect.Float64:
      fmt.Printf("a is float64\n")
   case reflect.String:
      fmt.Println("string")
   }
}
```

反射修改值：

```go
// Elem() 获取地址指向的值
reflect.ValueOf(a).Elem().SetFloat(3.14)
func main() {
   var x float64 = 3.4
   reflect_type(&x)
   fmt.Println(x)
}
```

结构体与反射：

```go
t := reflect.TypeOf(user1)
// 修改结构体中字段的值
reflect.ValueOf(&user1).Elem().FieldByName("Username").SetString("ppg")
// 遍历所有字段
for i := 0; i < t.NumField(); i++ {
  // 取得每个字段
  sf := t.Field(i)
  // 获取字段对应的信息
  fmt.Println(sf.Name, sf.Tag, sf.Anonymous, sf.Type, sf.PkgPath)
  // 只能获取公开字段，私有字段会报错
  fmt.Println(reflect.ValueOf(user1).Field(i).Interface())
}

// 调用方法
v := reflect.ValueOf(user1).MethodByName("GetBirthYear").Call([]reflect.Value{reflect.ValueOf(2021)})
fmt.Println(v[0])
// 获取字段的 tag
t.Field(0).Tag.Get("json")
```

## 操作 Redis

创建连接池：

```go
var pool *redis.Pool
func init() {
  pool = &redis.Pool{
    MaxIdle: 16,
    MaxActive: 0,
    IdleTimeout: 30,
    Dial: func() (redis.Conn, error) {
      return redis.Dial("tcp", "localhost:6379")
    },
  }
}
```

操作 hash 示例：

```go
func Demo() {
  c := pool.Get()
  defer c.Close()
  _, err := c.Do("hset", "user", "name", "koston", "age", 21)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(redis.String(c.Do("hget", "user", "name")))
  fmt.Println(redis.Int(c.Do("hget", "user", "age")))
}
```

## 操作 MongoDB

### 连接 MongoDB

```go
ctx, cancelFunc := context.WithTimeout(context.Background(), 10*time.Second)
defer cancelFunc()
client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
// 连通性测试
client.Ping(ctx, readpref.Primary())
if err != nil {
  fmt.Println(err)
  return
}
defer client.Disconnect(ctx)
collection := client.Database("local").Collection("member")
```

### 计数

```go
// 精确计数
fmt.Println(collection.CountDocuments(ctx, bson.D{{"age", bson.D{{"$gte", 30}}}}))
// 估算
fmt.Println(collection.EstimatedDocumentCount(ctx))
```

### 查询

```go
// bson.D 用来构造 JSON 查询，bson.A 相当于查询中的数组
filter := bson.D{
  {
    "$or", bson.A{
      bson.D{{"age", bson.D{{"$lt", 35}}}},
      bson.D{{"age", bson.D{{"$gte", 44}}}},
    },
  },
}
// 设置要返回的文档
projection := bson.D{{"name", 1}, {"_id", 0}, {"age", 1}, {"phone", 1}, {"number", 1}}
// 设置查询选项
opts := options.Find().SetLimit(10).SetSort(bson.D{{"age", 1}}).SetProjection(projection).SetSkip(1)
cursor, err := collection.Find(ctx, filter, opts)
if err != nil {
  fmt.Println(err)
  return
}
var result []bson.D
fmt.Println(cursor.All(ctx, &result))
for _, d := range result {
  fmt.Println(d)
}
```

### 聚合操作

```go
stages := []bson.D{
  {
    {Key: "$unwind", Value: "$tags",},
  },
  {
    {Key: "$group", Value: bson.D{
      {
        Key: "_id", Value: "$tags",
      },
      {
        Key: "peopleNumber", Value: bson.D{
          {
            Key: "$sum", Value: 1,
          },
        },
      },
      {
        Key: "avgAge", Value: bson.D{
          {
            Key: "$avg", Value: "$age",
          },
        },
      },
    },},
  },
  {
    {Key: "$project", Value: bson.D{
      {
        Key: "_id", Value: 0,
      },
    },},
  },
}
cursor, err := collection.Aggregate(ctx, stages)
if err != nil {
  fmt.Println(err)
  return
}
var result []bson.M
fmt.Println(cursor.All(ctx, &result))
for _, d := range result {
  fmt.Println("res:", d)
}
```

## Go Module

在项目根目录下执行 `go mod init ${项目名}` 命令，创建一个 `go.mod` 文件，这个文件只出现在根目录下。

`go mod tidy` 命令可以清除未使用的依赖项。

`go list -m all` 命令打印当前模块的依赖项。

## Golang Traps

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

## Golang Web

### 使用 httprouter

获取 httprouter：`go get github.com/julienschmidt/httprouter`。

```go
// 构造一个 httprouter 对象
router := httprouter.New()
// 设置请求方法、路径和处理函数
router.GET("/", index)
router.POST("/hello/:name", hello)
// 设置 404 处理器
router.NotFound = http.HandlerFunc(notFound)
// 启动服务
http.ListenAndServe(":8080", router)
```

注意：

- 路径处理器的方法签名必须是 `func(http.ResponseWriter, *http.Request, Params)`。
- 404 处理器是一个 `http.Handler` 接口实例，可以通过 `http.HandlerFunc()` 类型转换实现，方法签名必须是 `func(ResponseWriter, *Request)`。
