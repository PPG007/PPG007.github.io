# 数组

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
