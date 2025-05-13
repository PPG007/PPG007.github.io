# 并发编程

## Goroutine

_一个 goroutine 必定对应一个函数，可以创建多个 goroutine 去执行相同的函数。_

主协程退出后，其他任务将一同结束。

## runtime 包

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

## channel

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

::: tip

只写通道：`chan<- T`。

只读通道：`<-chan T`。

:::

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

| 操作/状态 |  nil  |              非空              |         空         |              满              |             未满             |
| :-------: | :---: | :----------------------------: | :----------------: | :--------------------------: | :--------------------------: |
|   接收    | 阻塞  |             接收值             |        阻塞        |            接收值            |            接收值            |
|   发送    | 阻塞  |             发送值             |       发送值       |             阻塞             |            发送值            |
|   关闭    | panic | 关闭成功，读取完数据后返回零值 | 关闭成功，返回零值 | 关闭成功，读完数据后返回零值 | 关闭成功，读完数据后返回零值 |

## Goroutine 池

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

## select

select 同时监听一个或多个 channel，直到其中一个 channel ready，如果多个 channel 同时 ready，则随机选择一个执行。

```go
select {
case s1 := <-output1:
  fmt.Println("s1=", s1)
case s2 := <-output2:
  fmt.Println("s2=", s2)
}
```

## 锁

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

## 同步

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

## 原子操作

```go
atomic.AddInt64(&count, 1)
```

其他 atomic 包下的方法：[atomic](https://www.topgoer.com/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B/%E5%8E%9F%E5%AD%90%E6%93%8D%E4%BD%9C%E5%92%8Catomic%E5%8C%85.html#atomic%E5%8C%85)
