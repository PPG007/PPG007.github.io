---
prev:
  text: 首页
  link: /grpc-and-protobuf
---

# 编写 proto 文件

## 示例文件

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

## Extensions

extensions 允许你在 Message 中定义一个区间的字段数值，相当于是在当前文件中尚未被定义的字段的占位符，这允许其他 proto 文件为这个 Message 添加一些字段，下面是一个示例：

example.proto:

```protobuf
syntax = "proto2";

option go_package = "mytest/proto/proto2";

message Foo {
    required int64 a = 1;
    optional int64 b = 2;
    extensions 100 to max;
}
```

extensions.proto:

```protobuf
syntax = "proto2";

option go_package = "mytest/proto/proto2";

import "proto2/example.proto";

extend Foo {
    optional string c = 100;
}
```

最后，通过代码修改值如下：

```go
func main() {
	f := proto2.Foo{
		A: proto.Int64(123),
		B: proto.Int64(456),
	}
	proto.SetExtension(&f, proto2.E_C.TypeDescriptor().Type(), "test")
	log.Println(f.String())
}
```

::: warning

proto3 不支持使用 extensions 关键字。

:::

## custom option

如果想自定义 option,需要引入 `google/protobuf/descriptor.proto`，这其实就是一个 proto2 编写的 proto 文件：

```protobuf
syntax = "proto3";

option go_package = "mytest/proto/proto3";

import "google/protobuf/descriptor.proto";

extend google.protobuf.FileOptions {
  string my_file_option = 50000;
}
extend google.protobuf.MessageOptions {
  int32 my_message_option = 50001;
}
extend google.protobuf.FieldOptions {
  float my_field_option = 50002;
}
extend google.protobuf.OneofOptions {
  int64 my_oneof_option = 50003;
}
extend google.protobuf.EnumOptions {
  bool my_enum_option = 50004;
}
extend google.protobuf.EnumValueOptions {
  uint32 my_enum_value_option = 50005;
}
extend google.protobuf.ServiceOptions {
  MyEnum my_service_option = 50006;
}
extend google.protobuf.MethodOptions {
  MyMessage my_method_option = 50007;
}

option (my_file_option) = "Hello world!";

message MyMessage {
  option (my_message_option) = 1234;

  int32 foo = 1 [(my_field_option) = 4.5];
  string bar = 2;
  oneof qux {
    option (my_oneof_option) = 42;

    string quux = 3;
  }
}

enum MyEnum {
  option (my_enum_option) = true;

  FOO = 0 [(my_enum_value_option) = 321];
  BAR = 1;
}

message RequestType {}
message ResponseType {}

service MyService {
  option (my_service_option) = FOO;

  rpc MyMethod(RequestType) returns(ResponseType) {
    // Note:  my_method_option has type MyMessage.  We can set each field
    //   within it using a separate "option" line.
    option (my_method_option).foo = 567;
    option (my_method_option).bar = "Some string";
  }
}
```

读取每一个 option 的示例代码如下：

```go
package main

import (
	"encoding/json"
	"log"
	"mytest/proto/proto3"

	"github.com/spf13/cast"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/reflect/protodesc"
)

func main() {
	m := proto3.MyMessage{}

	f := protodesc.ToFileDescriptorProto(m.ProtoReflect().Descriptor().ParentFile())
	log.Println(cast.ToString(proto.GetExtension(f.Options, proto3.E_MyFileOption)))

	dp := protodesc.ToDescriptorProto(m.ProtoReflect().Descriptor())
	log.Println(cast.ToInt32(proto.GetExtension(dp.Options, proto3.E_MyMessageOption)))

	fdp := protodesc.ToFieldDescriptorProto(m.ProtoReflect().Descriptor().Fields().ByNumber(1))
	log.Println(cast.ToFloat64(proto.GetExtension(fdp.Options, proto3.E_MyFieldOption)))

	odp := protodesc.ToOneofDescriptorProto(m.ProtoReflect().Descriptor().Oneofs().ByName("qux"))
	log.Println(cast.ToInt64(proto.GetExtension(odp.Options, proto3.E_MyOneofOption)))

	var e proto3.MyEnum = 123

	edp := protodesc.ToEnumDescriptorProto(e.Descriptor())
	log.Println(cast.ToBool(proto.GetExtension(edp.Options, proto3.E_MyEnumOption)))

	evdp := protodesc.ToEnumValueDescriptorProto(e.Descriptor().Values().ByNumber(0))
	log.Println(cast.ToUint32(proto.GetExtension(evdp.Options, proto3.E_MyEnumValueOption)))


	sdp := protodesc.ToServiceDescriptorProto(m.ProtoReflect().Descriptor().ParentFile().Services().ByName("MyService"))
	i := proto.GetExtension(sdp.Options, proto3.E_MyServiceOption)
	log.Println(i.(proto3.MyEnum))

	mdp := protodesc.ToMethodDescriptorProto(m.ProtoReflect().Descriptor().ParentFile().Services().ByName("MyService").Methods().ByName("MyMethod"))
	i2 := proto.GetExtension(mdp.Options, proto3.E_MyMethodOption)
	log.Println(i2.(*proto3.MyMessage).String())
}

func String(v interface{}) string {
	b, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	return string(b)
}
```

## Any

Any 允许定义一个可以存储任意类型的字段，底层是 bytes 数组，需要 import `google/protobuf/any.proto`：

```protobuf
syntax = "proto3";

option go_package = "mytest/proto/proto3";

import "google/protobuf/any.proto";

message A {
  string a = 1;
}

message B {
  string b = 1;
}

message ErrorStatus {
  string message = 1;
  repeated google.protobuf.Any details = 2;
}
```

Go 示例代码：

```go
func main() {
	s := proto3.ErrorStatus{
		Message: "test",
	}
	a := proto3.A{
		A: "a",
	}
	b := proto3.B{
		B: "b",
	}
	anyA, err := anypb.New(&a)
	if err != nil {
		panic(err)
	}
	anyB, err := anypb.New(&b)
	if err != nil {
		panic(err)
	}
	s.Details = append(s.Details, anyA, anyB)
	for _, d := range s.Details {
		switch d.MessageName() {
		case "A":
			pm, err := d.UnmarshalNew()
			if err != nil {
				panic(err)
			}
			log.Println(pm.(*proto3.A).String())
		case "B":
			pm, err := d.UnmarshalNew()
			if err != nil {
				panic(err)
			}
			log.Println(pm.(*proto3.B).String())
		default:
			panic("unknown message name")
		}
	}
}
```
