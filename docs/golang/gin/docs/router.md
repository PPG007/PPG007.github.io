# gin 路由

## 基本路由

```go
func main() {
  e := gin.Default()
  e.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello")
  })
  e.POST("/post", func(c *gin.Context) {
    c.String(http.StatusOK, "POST", "123")
  })
  e.Run(":8080")
}
```

## 参数路由

```go
func main() {
  e := gin.Default()
  e.GET("/hello/:name", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello %s", c.Param("name"))
  })
  // 如果访问 /post/xxx 路径会导致 404，如果是 /post/xxx/ 则会被接收
  e.POST("/post/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    c.String(http.StatusOK, "name: %s, action: %s", name, action)
  })
  e.Run(":8080")
}
```

## URL 参数

URL 参数可以使用 `DefaultQuery()` 或者 `Query()` 方法获取，如果参数不存在，前者返回默认值，后者返回空串

```go
func main() {
  e := gin.Default()
  e.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello %s, %s", c.DefaultQuery("name", "ppg"), c.Query("age"))
  })
  e.Run(":8080")
}
```

## 表单参数

表单参数使用 `PostFrom()` 方法获取，该方法默认解析的是 `x-www-form-urlencoded` 或 `form-data` 格式的参数。

```go
func main() {
  e := gin.Default()
  e.POST("/form", func(c *gin.Context) {
    c.String(http.StatusOK, "name: %s, password: %s", c.PostForm("name"), c.PostForm("password"))
  })
  e.Run(":8080")
}
```

## 上传单个文件

```go
func main() {
  e := gin.Default()
  // 限制上传最大尺寸为 8 MB，默认为 32 MB
  e.MaxMultipartMemory = 8 << 20
  e.POST("upload", func(c *gin.Context) {
    // 获取对应字段的文件
    file, _ := c.FormFile("file")
    // 保存文件到指定文件
    c.SaveUploadedFile(file, "/home/user/go-playground/" + file.Filename)
    c.String(http.StatusOK, "filename: %s", file.Filename)
  })
  e.Run(":8080")
}
```

## 上传多个文件

```go
func main() {
  e := gin.Default()
  e.MaxMultipartMemory = 8 << 20
  e.POST("upload", func(c *gin.Context) {
    form, _ := c.MultipartForm()
    files := form.File["files"]
    for _, v := range files {
      c.SaveUploadedFile(v, v.Filename)
    }
    c.JSON(http.StatusOK, files)
  })
  e.Run(":8080")
}
```

## 路由组

类似于写在 controller 类上的 @RequestMapping。

```go
func main() {
  e := gin.Default()
  userGroup := e.Group("/user")
  {
    userGroup.POST("/login", func(c *gin.Context) {
      username := c.PostForm("username")
      password := c.PostForm("password")
      if username == "koston" && password == "123456" {
        c.String(http.StatusOK, "user login success")
        return
      }
      c.String(http.StatusUnauthorized, "user login failed")
    })
    userGroup.GET("/hello", func(c *gin.Context) {
      c.String(http.StatusOK, "hello user")
    })
  }
  adminGroup := e.Group("/admin")
  {
    adminGroup.POST("/login", func(c *gin.Context) {
      if c.PostForm("username") == "ppg007" && c.PostForm("password") == "654321" {
        c.String(http.StatusOK, "admin login success")
        return
      }
      c.String(http.StatusUnauthorized, "admin login failed")
    })
    adminGroup.GET("/hello", func(c *gin.Context) {
      c.String(http.StatusOK, "hello admin")
    })
  }
  e.Run(":8080")
}
```

## 404 路由处理

```go
func main() {
  e := gin.Default()
  e.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "OK")
  })
  e.NoRoute(func(c *gin.Context) {
    c.String(http.StatusNotFound, "404")
  })
  e.Run(":8080")
}
```

## 重定向

```go
func main() {
  e := gin.Default()
  e.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "OK")
  })
  e.NoRoute(func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "/hello")
  })
  e.Run(":8080")
}
```

## 路由拆分与注册

在两个文件中：

```go
func adminHelloHandler(c *gin.Context) {
  c.JSON(http.StatusOK, gin.H{
    "message": "Hello Admin",
  })
}
func InitAdminRouter(r *gin.Engine){
  adminGroup := r.Group("admin")
  adminGroup.GET("/hello", adminHelloHandler)
}
```

```go
func userHelloHandler(c * gin.Context) {
  c.JSON(http.StatusOK, gin.H{
    "message": "Hello World",
  })
}
func InitUserRouter(r *gin.Engine){
  userGroup := r.Group("user")
  userGroup.GET("/hello", userHelloHandler)
}
```

在启动函数中：

```go
func main() {
  r := gin.Default()
  controller.InitAdminRouter(r)
  controller.InitUserRouter(r)
  r.Run(":8080")
}
```

思路：启动函数中定义一个路由对象，将这个对象传给其他文件的初始化函数，其他文件将自己的路由注册到这个对象上。

## 静态文件服务

```go
func main() {
  r := gin.Default()
  // 提供单个文件的访问
  r.StaticFile("/png", "ff.png")
  // 提供一个目录中文件的访问，但是访问这个路径是 404，URL 要准确到文件，例如 http://localhost:8080/static/http/client.go
  r.Static("/static", "/home/user/go-playground")
  // 提供一个目录的访问，访问这个路径可以看到目录中的全部内容
  r.StaticFS("/staticfs", http.Dir("/home/user/md"))
  r.Run(":8080")
}
```
