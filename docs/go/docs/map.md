# Map

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
