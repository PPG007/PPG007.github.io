# 会话控制

## Cookie

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

## session

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
