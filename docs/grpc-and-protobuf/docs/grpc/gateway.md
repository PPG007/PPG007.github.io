# gRPC Gateway

## 安装工具

```shell
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
```

## 在服务 proto 文件中定义

首先定义一个简单的服务：

```protobuf
syntax = "proto3";
option go_package = "./;pb";

message HelloWorldRequest {
  string msg = 1;
}

message HelloWorldResponse {
  string msg = 1;
}
```

```protobuf
syntax = "proto3";
option go_package = "./;pb";

import "proto/hello.proto";
import "google/api/annotations.proto";

service HelloService {
  rpc HelloWorld(HelloWorldRequest) returns (HelloWorldResponse){
    option (google.api.http) = {
      post: "/v1/example/echo/{msg}" // 绑定请求方法和请求路径
      body: "*"
      additional_bindings { // 绑定其他请求方式和路径
        get: "/v1/get"
      }
    };
  }
}
```

::: warning 注意
这种方式需要将 [`googleapis`](https://github.com/googleapis/googleapis) `google/api` 目录中的几个文件拷贝到项目中：`annotations.proto`、`field_behavior.proto`、`httpbody.proto`、`http.proto`。
:::

执行编译命令：

```shell
protoc -I . --go_out=pb --go-grpc_out=pb --grpc-gateway_out pb --grpc-gateway_opt logtostderr=true  proto/*.proto
```

实现所有的接口，最终项目文件结构：

![项目文件结构](../images/项目文件结构.png)

其中的 `api.yaml` 是另一种 grpc-gateway 的使用方式，这里先不考虑。

main.go：

```go
package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"proto/pb"
	"proto/service"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/reflection"
)

func startHttpServer(ctx context.Context) {
	mux := runtime.NewServeMux()
	err := pb.RegisterHelloServiceHandlerFromEndpoint(ctx, mux, "localhost:8082", []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())})
	if err != nil {
		log.Println("RegisterHelloServiceHandlerFromEndpoint failed:", err)
	}
	http.ListenAndServe(":8081", mux)
}

func startgRPCServer() {
	grpcServer := grpc.NewServer()
	helloServer := service.HelloService{}
	pb.RegisterHelloServiceServer(grpcServer, helloServer)
	reflection.Register(grpcServer)
	listener, err := net.Listen("tcp", ":8082")
	if err != nil {
		log.Println(err)
		log.Println("start server failed")
	}
	err = grpcServer.Serve(listener)
	if err != nil {
		log.Println("start grpc server failed")
	}
}

func main() {
	go startHttpServer(context.Background())
	startgRPCServer()
}
```

其中的 `RegisterHelloServiceHandlerFromEndpoint` 方法可以用来转换包括流式 gRPC 的类型，需要指定 gRPC 服务端的路径；如果只有一元 gRPC 可以使用 `RegisterHelloServiceHandlerServer` 方法，这个方法不需要指定 gRPC 服务端的路径，同时使用这个方法也不需要额外启动 gRPC 服务端。

## 在 YAML 配置文件中定义

定义 `api.yaml` 文件：

```yaml
type: google.api.Service
config_version: 3

http:
  rules:
    - selector: HelloService.HelloWorld
      post: /v1/example/echo
      body: "*"
      additional_bindings:
        - get: /v1/example/echo
```

[配置参考](https://cloud.google.com/endpoints/docs/grpc-service-config/reference/rpc/google.api#special-notes)，使用 YAML 和直接在 proto 文件中定义都可以参考这里的配置。

其他代码不需要改动，执行编译命令后直接运行：

```shell
protoc -I . --go_out=pb --go-grpc_out pb --grpc-gateway_out pb --grpc-gateway_opt logtostderr=true --grpc-gateway_opt grpc_api_configuration=proto/api.yaml proto/*.proto
```
