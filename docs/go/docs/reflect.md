# 反射

## 基本用法

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
