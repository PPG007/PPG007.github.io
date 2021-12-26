# 类型转换

## 类型断言

```go
map1 := make(map[string]interface{}, 10)
map1["cat1"] = cat1
cat2, isOk := map1["cat1"].(*cat)
```

## 类型 switch

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
