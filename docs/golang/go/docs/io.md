# IO

## 终端输入输出

- `os.Stdin`：标准输入的文件实例，类型为 \*File。
- `os.Stdout`：标准输出的文件实例，类型为 \*File。
- `os.Stderr`：标准错误输出的文件实例，类型为 \*File。

## 读写文件

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

## 拷贝文件

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

## 其他 API

删除文件：

```go
os.Remove(filePath)
```

指定打开文件的方式、权限：

```go
f, err := os.OpenFile("demo.txt", os.O_APPEND|os.O_RDWR, os.ModeAppend)
```

## bufio

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

## ioutil

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
