# gin

## 获取 gin

```sh
go get -u github.com/gin-gonic/gin
```

## gin 路由

### 基本路由

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

### 参数路由

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

### URL 参数

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

### 表单参数

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

### 上传单个文件

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

### 上传多个文件

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

### 路由组

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

### 404 路由处理

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

### 重定向

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

### 路由拆分与注册

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

### 静态文件服务

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

## 数据解析与绑定

### JSON、表单 数据解析与绑定

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

### URL 数据解析和绑定

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

## 渲染

### 各种数据格式的响应

```go
func main() {
  r := gin.Default()
  r.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "json", "status": "ok"})
  })
  r.GET("/struct", func(c *gin.Context) {
    user := User{
      Username: "PPG007",
      Password: "123456",
    }
    c.JSON(http.StatusOK, user)
  })
  r.GET("/xml", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "json", "status": "ok"})
  })
  r.GET("/yaml", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "json", "status": "ok"})
  })
  r.Run(":8080")
}
```

### HTML 模板渲染

```go
func main() {
  r := gin.Default()
  // 加载文件
  r.LoadHTMLGlob("*.html")
  r.GET("/", func(c *gin.Context) {
    // 指定要渲染的文件
    c.HTML(http.StatusOK, "index.html", gin.H{"username": "PPG007", "password": "123456"})
  })
  r.Run(":8080")
}
```

如果要使用不同路径下名称相同的模板：

```go
func main() {
  router := gin.Default()
  // 设置自定义分隔符
  r.Delims("[[", "]]")
  router.LoadHTMLGlob("templates/**/*")
  router.GET("/posts/index", func(c *gin.Context) {
    c.HTML(http.StatusOK, "posts/index.tmpl", gin.H{
      "title": "Posts",
    })
  })
  router.GET("/users/index", func(c *gin.Context) {
    c.HTML(http.StatusOK, "users/index.tmpl", gin.H{
      "title": "Users",
    })
  })
  router.Run(":8080")
}
```

templates/posts/index.tmpl：

```html
{{ define "posts/index.tmpl" }}
<html><h1>
  {{ .title }}
</h1>
<p>Using posts/index.tmpl</p>
</html>
{{ end }}
```

templates/posts/index/tmpl：

```html
{{ define "users/index.tmpl" }}
<html><h1>
  {{ .title }}
</h1>
<p>Using users/index.tmpl</p>
</html>
{{ end }}
```

## 中间件

注意：`gin.Default()` 默认使用了 `Logger()` 和 `Recovery()` 中间件。

### 全局中间件

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

### Next 方法

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

### 局部中间件

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

## 会话控制

### Cookie

```go
func main() {
	router := gin.Default()
	router.GET("/cookie", func(c *gin.Context) {
		// 获取 Cookie
		cookie, err := c.Cookie("gin_cookie")
		if err != nil {
			cookie = "NotSet"
			// 键、值、最大有效时间，单位：秒、path，Cookie 所在目录、域名、是否只能通过 https 访问、HTTPOnly 是否允许 js 获取 Cookie。
			c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
		}
		fmt.Printf("cookie value:%s\n", cookie)
	})
	router.Run(":8080")
}
```

### session

依赖库：`github.com/gorilla/sessions`。

```go
var store = sessions.NewCookieStore([]byte("secret"))

func main() {
	router := gin.Default()
	router.GET("/save", func(c *gin.Context) {
		session, err := store.Get(c.Request, "session-name")
		if err != nil {
			fmt.Println(err)
			return
		}
		session.Values["foo"] = "bar"
		session.Values[42] = 43
		session.Save(c.Request, c.Writer)
	})
	router.GET("/get", func(c *gin.Context) {
		session, err := store.Get(c.Request, "session-name")
		if err != nil {
			return
		}
		// 设为小于 0 的数表示删除
		session.Options.MaxAge = -1
		foo := session.Values["foo"]
		fmt.Println(foo)
	})
	router.Run(":8080")
}
```

## 参数验证

### 结构体验证

```go
type Person struct {
  // 大于10
	Age int `form:"age" binding:"required,gt=10"`
	Name string `form:"name" binding:"required"`
  // 限制格式
	Birthday time.Time `form:"birthday" time_format:"2006-01-02" time_utc:"1"`
}


func main() {
	router := gin.Default()
	router.POST("/demo", func(c *gin.Context) {
		var person Person
		if err :=c.ShouldBind(&person); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"err": err})
			return
		}
		c.JSON(http.StatusOK, person)
	})
	router.Run(":8080")
}
```

### 自定义验证

```go

```

## 日志

- 关闭控制台颜色：`gin.DisableConsoleColor()`。
- 记录到文件：

    ```go
    f, _ := os.Create("gin.log")
	  gin.DefaultWriter = io.MultiWriter(f)
    ```

- 同时写入文件和控制台：`gin.DefaultWriter = io.MultiWriter(f, os.Stdout)`。
- 定义路由日志格式：

    ```go
    gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		  log.Printf("endpoint %v %v %v %v \n", httpMethod, absolutePath, handlerName, nuHandlers)
	  }
  ```

## JWT

```go
func generateToken(username string, secret string, period time.Duration) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &UserClaim{
		username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(period).Unix(),
		},
	})
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Println(err)
		return "", fmt.Errorf("cannot generate token")
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) error {
	token, _ := jwt.ParseWithClaims(tokenString, &UserClaim{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid token sign method")
		}
		return []byte(secret), nil
	})
	if _, ok := token.Claims.(*UserClaim); ok && token.Valid {
		return  nil
	}
	return fmt.Errorf("invalid token")
}
```
