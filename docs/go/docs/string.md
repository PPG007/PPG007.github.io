# 字符串

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
