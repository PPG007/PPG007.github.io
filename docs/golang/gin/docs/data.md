# 数据解析与绑定

## JSON、表单 数据解析与绑定

```go
type User struct {
  // 通过 tag 指定各种数据格式中对应的键和是否必需
  Username string `form:"username" uri:"username" json:"username" xml:"username" binding:"required"`
  Password string `form:"password" uri:"username" json:"password" xml:"password" binding:"required"`
}

func main() {
  r := gin.Default()
  r.POST("/users/login", func(c *gin.Context) {
    var user User
    var user2 User
    // 将 body 中的数据解析到结构体实例上
    err := c.ShouldBind(&user)
    c.ShouldBind(&user2)
    if err !=nil {
      fmt.Println(err)
      return
    }
    c.JSON(http.StatusOK, gin.H{"message": "success"})
    fmt.Println(user,user2)
  })
  r.Run(":8080")
}
```

ShouldBind 方法不能多次调用，只有第一次调用才能获取值，如果要多次获取值应该使用 `ShouldBindBodyWith` 方法：

```go
c.ShouldBindBodyWith(&user2, binding.JSON)
```

## URL 数据解析和绑定

```go
func main() {
  r := gin.Default()
  r.POST("/users/login/:username/:password", func(c *gin.Context) {
    var user User
    var user2 User
    err := c.ShouldBindUri(&user)
    c.ShouldBindUri(&user2)
    if err != nil {
      fmt.Println(err)
      return
    }
    c.JSON(http.StatusOK, gin.H{"message": "success"})
    fmt.Println(user, user2)
  })
  r.Run(":8080")
}
```
