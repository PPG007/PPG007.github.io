# 渲染

## 各种数据格式的响应

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

## HTML 模板渲染

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
