# 日志

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
