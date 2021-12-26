# Go Module

在项目根目录下执行 `go mod init ${项目名}` 命令，创建一个 `go.mod` 文件，这个文件只出现在根目录下。

`go mod tidy` 命令可以清除未使用的依赖项。

`go list -m all` 命令打印当前模块的依赖项。
