# 常用标准库

## fmt

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

## Flag

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

## Log

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

## strconv

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

## http

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

## context

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

## TCP & UDP

### TCP

```go
func main() {
	go startTCPServer()
	time.Sleep(time.Second * 3)
	startClient()
}

func startTCPServer() {
	listen, err := net.Listen("tcp", "0.0.0.0:8080")
	if err != nil {
		panic(err)
	}
	for {
		conn, err := listen.Accept()
		if err != nil {
			panic(err)
		}
		go handleConnectionInServer(conn)
	}
}

func startClient() {
	conn, err := net.Dial("tcp", "127.0.0.1:8080")
	if err != nil {
		panic(err)
	}
	_, err = conn.Write([]byte("Hello World\n"))
	if err != nil {
		panic(err)
	}
	reader := bufio.NewReader(conn)
	str, err := reader.ReadString('\n')
	if err != nil {
		panic(err)
	}
	fmt.Printf("client received: %s\n", str)
	conn.Close()
}

func handleConnectionInServer(conn net.Conn) {
	reader := bufio.NewReader(conn)
	str, err := reader.ReadString('\n')
	if err != nil {
		panic(err)
	}
	fmt.Printf("server received: %s\n", str)
	_, err = conn.Write([]byte(str))
	if err != nil {
		panic(err)
	}
	conn.Close()
}
```

### UDP

```go
func main() {
	go startUDPServer()
	time.Sleep(time.Second)
	startUDPClient()
}

func startUDPServer() {
	conn, err := net.ListenUDP("udp", &net.UDPAddr{
		IP:   net.ParseIP("0.0.0.0"),
		Port: 8080,
	})
	if err != nil {
		panic(err)
	}
	buffer := make([]byte, 1024)
	for {
		n, remote, err := conn.ReadFromUDP(buffer)
		if err != nil {
			panic(err)
		}
		fmt.Printf("server received: %s\n", string(buffer[:n]))
		conn.WriteToUDP([]byte(strings.ToUpper(string(buffer[:n]))), remote)
	}
}

func startUDPClient() {
	conn, err := net.DialUDP("udp", nil, &net.UDPAddr{
		IP:   net.ParseIP("127.0.0.1"),
		Port: 8080,
	})
	if err != nil {
		panic(err)
	}
	_, err = conn.Write([]byte("Hello World"))
	if err != nil {
		panic(err)
	}
	buffer := make([]byte, 1024)
	n, err := conn.Read(buffer)
	if err != nil {
		panic(err)
	}
	fmt.Printf("client received: %s\n", string(buffer[:n]))
}
```
