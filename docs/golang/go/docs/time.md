# Time

## 时间戳

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

## 时间间隔

时间间隔 time.Duration 是一个 time 包下的类型，代表两个时间点之间经过的时间，以纳秒为单位。

```go
time.Duration.Hours()
```

## 时间操作

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

## 定时器

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

## 时间格式化

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
