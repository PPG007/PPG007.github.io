# 参数验证

## 结构体验证

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

## [自定义验证](https://gin-gonic.com/zh-cn/docs/examples/custom-validators/)
