# 安装和编译

安装命令：

```shell
sudo apt-get install protobuf-compiler
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

安装 Protobuf 后，如果执行 `protoc` 命令出现 `Protobuf cannot find shared libraries` 的错误，可以执行：`sudo ldconfig` 命令解决。

编译命令：

- 对于没有定义 rpc 服务的 proto 文件，使用命令：`protoc -I ${包含 proto 文件的文件夹} --go_out=${out_dir} ${要编译的文件}` 编译。
- 对于定义了 rpc 服务的 proto 文件，使用命令：`protoc -I ${包含 proto 文件的文件夹} --go_out=${out_dir} --go-grpc_out=${out_dir} ${要编译的文件}` 编译。
- 对于同时定义了普通 message 和 rpc 服务的 proto 文件，使用命令：`protoc -I ${包含 proto 文件的文件夹} --go_out=${out_dir} --go-grpc_out=${out_dir} ${要编译的文件}` 编译。

示例：`protoc -I ./proto/ --go_out=pb --go-grpc_out=pb proto/*.proto`。
