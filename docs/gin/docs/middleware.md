# 中间件

注意：`gin.Default()` 默认使用了 `Logger()` 和 `Recovery()` 中间件。

## 全局中间件

```go
func main() {
  r := gin.New()
  r.Use(func(c *gin.Context) {
    t1 := time.Now()
    fmt.Println("全局中间件开始工作")
    // 通过 context 传递变量
    c.Set("request","wuhu")
    fmt.Printf("c.Request.URL.Query(): %v\n", c.Request.URL.Query())
    fmt.Println("全局中间件退出，耗时：",time.Since(t1))
  })
  r.GET("/hello", func(c *gin.Context) {
    // 从 context 中取出变量
    value, _ := c.Get("request")
    c.JSON(http.StatusOK, value)
  })
  r.Run(":8080")
}
```

## Next 方法

上面的全局中间件是在都结束后才会执行对应的路由处理器，相当于 Spring AOP 中的前置通知，通过在中间件中调用 Next() 方法可以实现环绕和后置。

中间件的默认执行顺序是调用 Use 注册的顺序，调用 Next 方法可以执行下一个中间件或者路由处理器，执行完毕后再回到 Next 方法的下一行继续执行。

```go
func main() {
  r := gin.New()

  r.Use(func(c *gin.Context) {
    t1 := time.Now()
    fmt.Println("环绕中间件开始工作")
    c.Next()
    fmt.Println("环绕中间件退出，耗时：",time.Since(t1))
  })
  r.Use(func(c *gin.Context) {
    c.Next()
    t1 := time.Now()
    fmt.Println("后置中间件开始工作")

    fmt.Println("后置中间件退出，耗时：",time.Since(t1))
  })
  r.GET("/hello", func(c *gin.Context) {
    fmt.Println("路由处理器执行")
    c.JSON(http.StatusOK, gin.H{"message": "success"})
  })

  r.Run(":8080")
}
```

## 局部中间件

```go
r.GET("/hello/:name",func(c *gin.Context) {
  c.Next()
  t1 := time.Now()
  fmt.Println("中间件1开始工作")

  fmt.Println("中间件1退出，耗时：",time.Since(t1))
}, func(c *gin.Context) {
  fmt.Println("路由处理器执行")
  c.JSON(http.StatusOK, gin.H{"message": c.Param("name")})
}, func(c *gin.Context) {
  // 此处调用 Next 无效，因为后面已经没有其他中间件了
  c.Next()
  t1 := time.Now()
  fmt.Println("中间件2开始工作")

  fmt.Println("中间件2退出，耗时：",time.Since(t1))
})
```

[gin 框架的可用中间件](https://github.com/gin-gonic/contrib)
