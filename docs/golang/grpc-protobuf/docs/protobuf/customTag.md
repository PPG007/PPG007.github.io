---
next:
  text: gRPC
  link: /grpc-and-protobuf/docs/grpc/start.md
---

# 添加自定义 tag

首先安装 tag 插入工具：

```shell
go get github.com/favadi/protoc-go-inject-tag
```

之后修改 proto 文件：

```protobuf
message LoginRequest {
  string username =1; // @gotags: validate:"required", test:"test"
  string password = 2; // @gotags: validate:"required"
}
```

::: tip
如果想添加多个 tag，则在 @gotags 后添加多个 tag 并使用空格或逗号分隔。

protoc 会默认生成 json 等 tags，如果 @gotags 后面的 tags 和 protoc 生成的 tags重名，那么将会替换 protoc 生成的 tag及其值。
:::

然后先使用 protoc 工具生成 .pb.go 文件，再执行下面的命令：

```shell
protoc-go-inject-tag -input=./test.pb.go
# or
protoc-go-inject-tag -input="*.pb.go"
```
