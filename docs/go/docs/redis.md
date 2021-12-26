# 操作 Redis

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
