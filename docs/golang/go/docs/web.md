# Golang Web

## 使用 httprouter

获取 httprouter：`go get github.com/julienschmidt/httprouter`。

```go
// 构造一个 httprouter 对象
router := httprouter.New()
// 设置请求方法、路径和处理函数
router.GET("/", index)
router.POST("/hello/:name", hello)
// 设置 404 处理器
router.NotFound = http.HandlerFunc(notFound)
// 启动服务
http.ListenAndServe(":8080", router)
```

注意：

- 路径处理器的方法签名必须是 `func(http.ResponseWriter, *http.Request, Params)`。
- 404 处理器是一个 `http.Handler` 接口实例，可以通过 `http.HandlerFunc()` 类型转换实现，方法签名必须是 `func(ResponseWriter, *Request)`。
