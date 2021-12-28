---
prev:
  text: 首页
  link: /grpc-and-protobuf
---

# ProtoBuf

## 安装和编译

安装命令：

```shell
sudo apt-get install protobuf-compiler
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1
```

安装 Protobuf 后，如果执行 `protoc` 命令出现 `Protobuf cannot find shared libraries` 的错误，可以执行：`sudo ldconfig` 命令解决。

编译命令：

- 对于没有定义 rpc 服务的 proto 文件，使用命令：`protoc -I ${包含 proto 文件的文件夹} --go_out=${out_dir} ${要编译的文件}` 编译。
- 对于定义了 rpc 服务的 proto 文件，使用命令：`protoc -I ${包含 proto 文件的文件夹} --go_out=${out_dir} --go-grpc_out=${out_dir} ${要编译的文件}` 编译。
- 对于同时定义了普通 message 和 rpc 服务的 proto 文件，使用命令：`protoc -I ${包含 proto 文件的文件夹} --go_out=${out_dir} --go-grpc_out=${out_dir} ${要编译的文件}` 编译。

示例：`protoc -I ./proto/ --go_out=pb --go-grpc_out=pb proto/*.proto`。

## 编写 proto 文件

示例文件：

```protobuf
// 指定 Protobuf 的版本。
syntax = "proto3";
// 指明生成 go 代码的包名。
option go_package = "./;pb";
// 对于 Java，将一个 proto 文件编译为多个接口和类。
option java_multiple_files = true;
// 指定生成的 Java 代码的包名。
option java_package = "com.demo.pb";
// 引入其他 proto 文件。
import "laptop_message.proto";
import "filter_message.proto";

// 使用 message 关键字定义一个普通变量。
message CreateLaptopRequest {
  Laptop laptop = 1;
}

message CreateLaptopResponse {
  string id = 1;
}

message SearchLaptopRequest {
  Filter filter = 1;
}

message SearchLaptopResponse {
  Laptop laptop = 1;
}

message UploadImageRequest {
  // oneof 关键字表示这个 message 中这两种成员同时只能存在一个，代码中会存在覆盖问题。
  oneof data {
    ImageInfo info =1;
    bytes chunk_data = 2;
  }
}

message ImageInfo {
  string laptop_id = 1;
  string image_type = 2;
}

message UploadImageResponse {
  string id = 1;
  uint32 size = 2;
}

message RateLaptopRequest {
  string laptop_id = 1;
  double score = 2;
}

message RateLaptopResponse {
  string laptop_id = 1;
  uint32 rated_count =2;
  double average_score = 3;
}

message Laptop {
  string id = 1;
  string brand = 2;
  string name = 3;
  CPU cpu = 4;
  Memory ram = 5;
  // repeated 修饰数组。
  repeated GPU gpus = 6;
  repeated Storage storeges = 7;
  Screen screen = 8;
  Keyboard keyboard = 9;
  oneof weight {
    double weight_kg = 10;
    double weight_lb = 11;
  }
  double price_usd = 12;
  uint32 release_year = 13;
  google.protobuf.Timestamp updated_at = 14;
}

message Memory {
  // 枚举类要以 0 开始。
  enum Unit {
    UNKNOWN = 0;
    BIT = 1;
    BYTE = 2;
    KILOBYTE = 3;
    MEGABYTE = 4;
    GIGABYTE = 5;
    TERABYTE = 6;
  }
  uint64 value = 1;
  Unit unit = 2;
}

service LaptopService {
  // 注意是 returns 不是 return。
  // 对于流，使用 stream 关键字修饰。
  rpc CreateLaptop(CreateLaptopRequest) returns (CreateLaptopResponse) {};
  rpc SearchLaptop (SearchLaptopRequest) returns (stream SearchLaptopResponse) {};
  rpc UploadImage (stream UploadImageRequest) returns (UploadImageResponse) {};
  rpc RateLaptop (stream RateLaptopRequest) returns (stream RateLaptopResponse) {};
}
```
