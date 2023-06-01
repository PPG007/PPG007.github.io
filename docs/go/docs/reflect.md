# 反射

## 三大法则

### 第一法则

将 `interface{}` 变量转换成反射对象。当执行 `reflect.ValueOf` 或者 `reflect.TypeOf` 时，即使传入的是确定类型，例如 int，但是由于这两个方法的入参都是 `interface{}` 类型，并且 Go 语言的函数调用是值传递的，所以变量会在函数调用处进行类型转换，即从其他类型转为了 `interface{}` 类型，所以说第一法则是 `interface{}` 转换为反射对象。

![第一法则](./images/golang-interface-to-reflection.png)

### 第二法则

可以从反射对象获取 `interface{}` 变量。

![第二法则](./images/golang-reflection-to-interface.png)

```go
t := time.Now()
fmt.Println(reflect.ValueOf(t).Interface())
```

从反射对象到 `interface{}` 的过程和 `interface{}` 到反射对象的过程的镜像过程，都需要经历两次转换：

- 从 `interface{}` 到反射对象：
    - 从基本类型到 `interface{}` 的转换。
    - 从 `interface{}` 到反射对象的转换。
- 从反射对象到 `interface{}`：
    - 反射对象转换成接口类型。
    - 通过显式类型转换变回原始类型。

![双向转换](./images/golang-bidirectional-reflection.png)

### 第三法则

如果希望更新一个 `reflect.Value` 那么它持有的值一定可以被更新。

由于 Go 语言函数调用是值传递的，所以要通过下面的步骤实现对值的修改：

- 使用 `reflect.ValueOf` 获取变量指针。
- 使用 `reflect.Value.Elem` 获取指针指向的变量。
- 使用 `reflect.Value.SetInt` 更新变量的值。

```go
func main() {
	x := 0
	v := reflect.ValueOf(&x)
	v.Elem().SetInt(10)
	fmt.Println(x)
}
```

## 实现协议

判断一个类型是否实现了某个接口：

```go
type A struct {
}

func (*A) Error() string {
	return "test"
}

func main() {
	errInterface := reflect.TypeOf((*error)(nil)).Elem()
	fmt.Println(reflect.TypeOf(A{}).Implements(errInterface))
	fmt.Println(reflect.TypeOf(&A{}).Implements(errInterface))
}
```

## 方法调用

调用方法示例：

```go
func add(x, y int) int {
	return x + y
}

func main() {
	v := reflect.ValueOf(add)
	if v.Kind() != reflect.Func {
		panic("error kind")
	}
	args := make([]reflect.Value, v.Type().NumIn())
	for i := 0; i < len(args); i++ {
		args[i] = reflect.ValueOf(1)
	}
	out := v.Call(args)
	for i := 0; i < v.Type().NumOut(); i++ {
		fmt.Println(out[i].Interface())
	}
}
```

调用一个类型的方法示例：

```go
type A struct {
}

func (*A) Error() string {
	return "test"
}

func main() {
	a := &A{}
	v := reflect.ValueOf(a)
	method := v.MethodByName("Error")
	var args []reflect.Value
	for i := 0; i < method.Type().NumIn(); i++ {
		args = append(args, reflect.ValueOf(nil))
	}
	out := method.Call(args)
	for i := 0; i < method.Type().NumOut(); i++ {
		fmt.Println(out[i])
	}
}
```

## 一些实例

### 反射调用 gRPC

定义两个服务：

```proto
// proto/a/service.proto
syntax = "proto3";
option go_package = "./;pb";

message String {
  string value = 1;
}

service AService {
  rpc Hello(String) returns (String);
}
// proto/b/service.proto
syntax = "proto3";
option go_package = "./;pb";

message Int {
  int64 value = 1;
}

service BService {
  rpc Hello(Int) returns (Int);
}
```

```go
package main

import (
	pb_a "conf/proto/a"
	pb_b "conf/proto/b"
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"net"
	"reflect"
	"strings"
	"time"
)

type A struct {
	pb_a.UnimplementedAServiceServer
}

func (A) Hello(ctx context.Context, req *pb_a.String) (*pb_a.String, error) {
	return &pb_a.String{
		Value: strings.ToUpper(req.Value),
	}, nil
}

type B struct {
	pb_b.UnimplementedBServiceServer
}

func (B) Hello(ctx context.Context, req *pb_b.Int) (*pb_b.Int, error) {
	return &pb_b.Int{
		Value: -req.Value,
	}, nil
}

func startServer(ctx context.Context) {
	server := grpc.NewServer()
	pb_a.RegisterAServiceServer(server, A{})
	pb_b.RegisterBServiceServer(server, B{})
	listener, err := net.Listen("tcp", "0.0.0.0:9999")
	if err != nil {
		panic(err)
	}
	server.Serve(listener)
}

func GetClientByName(name string) interface{} {
	switch name {
	case "AService":
		return pb_a.NewAServiceClient
	case "BService":
		return pb_b.NewBServiceClient
	default:
		return nil
	}
}

func dial(ctx context.Context) grpc.ClientConnInterface {
	conn, err := grpc.Dial("127.0.0.1:9999", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	return conn
}

func CallGrpc(ctx context.Context, path string, req interface{}) (interface{}, interface{}) {
	conn := dial(ctx)
	paths := strings.Split(path, ".")
	clientFunc := GetClientByName(paths[0])
	resp := reflect.ValueOf(clientFunc).Call([]reflect.Value{reflect.ValueOf(conn)})
	client := resp[0]
	resp = client.MethodByName(paths[1]).Call([]reflect.Value{reflect.ValueOf(ctx), reflect.ValueOf(req)})
	return resp[0].Interface(), resp[1].Interface()
}

func main() {
	ctx := context.Background()
	go startServer(ctx)
	time.Sleep(time.Second * 3)
	resp, err := CallGrpc(ctx, "BService.Hello", &pb_b.Int{
		Value: 111,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(resp.(*pb_b.Int).Value)
}
```

### copier

```go
package main

import (
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
)

type TransFunc interface{}

type Copier struct {
	pair        map[string]string
	transformer map[string]TransFunc
	source      interface{}
}

func NewCopier() *Copier {
	return &Copier{
		pair:        make(map[string]string),
		transformer: make(map[string]TransFunc),
	}
}

func (c *Copier) RegisterPair(pair map[string]string) *Copier {
	for k, v := range pair {
		c.pair[k] = v
	}
	return c
}

func (c *Copier) RegisterTransformer(transformer map[string]TransFunc) *Copier {
	for k, v := range transformer {
		c.transformer[k] = v
	}
	return c
}

func (c *Copier) From(source interface{}) *Copier {
	c.source = source
	return c
}

func (c *Copier) To(target interface{}) {
	doCopy(reflect.ValueOf(c.source), reflect.ValueOf(target), c)
}

func doCopy(from, to reflect.Value, c *Copier) {
	if to.Type().Kind() != reflect.Pointer {
		panic("type error")
	}
	if to.Type().Elem().Kind() != reflect.Struct {
		panic("type error")
	}
	vt := to.Elem()
	for i := 0; i < vt.NumField(); i++ {
		switch vt.Field(i).Type().Kind() {
		case reflect.String:
			vt.Field(i).SetString(getSourceValueByName(vt.Type().Field(i).Name, c, from).String())
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			vt.Field(i).SetInt(getSourceValueByName(vt.Type().Field(i).Name, c, from).Int())
		case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
			vt.Field(i).SetUint(getSourceValueByName(vt.Type().Field(i).Name, c, from).Uint())
		case reflect.Float32, reflect.Float64:
			vt.Field(i).SetFloat(getSourceValueByName(vt.Type().Field(i).Name, c, from).Float())
		case reflect.Slice, reflect.Array:
			fallthrough
		case reflect.Bool:
			vt.Field(i).Set(getSourceValueByName(vt.Type().Field(i).Name, c, from))
		case reflect.Struct:
			fieldName := vt.Type().Field(i).Name
			sourceName := c.getSourceName(fieldName)
			if t := c.getTransformer(fieldName); t != nil {
				out := reflect.ValueOf(t).Call([]reflect.Value{from.FieldByName(sourceName)})
				vt.Field(i).Set(out[0])
				continue
			}
			doCopy(from.FieldByName(sourceName), vt.Field(i).Addr(), c)
		}
	}
}

func (c *Copier) getSourceName(name string) string {
	if c.pair[name] != "" {
		return c.pair[name]
	}
	return name
}

func (c *Copier) getTransformer(name string) TransFunc {
	return c.transformer[name]
}

func getSourceValueByName(name string, c *Copier, from reflect.Value) reflect.Value {
	valueByName := getFieldValueByName(c.getSourceName(name), from)
	if t := c.getTransformer(name); t != nil {
		out := reflect.ValueOf(t).Call([]reflect.Value{valueByName})
		return out[0]
	}
	return valueByName
}

func getFieldValueByName(name string, source reflect.Value) reflect.Value {
	paths := strings.Split(name, ".")
	if len(paths) > 1 {
		value := source.FieldByName(paths[0])
		return getFieldValueByName(strings.Join(paths[1:], "."), value)
	}
	return source.FieldByName(paths[0])
}

type A struct {
	Id        string
	B         B
	Test      float64
	SliceTest []int
	ArrayTest [3]string
}

type B struct {
	Age int
}

type C struct {
	Id        string
	D         D
	OldEnough bool
	TTT       float64
	SliceTest []int
	ArrayTest [3]string
}

type D struct {
	Age int64
}

func main() {
	a := A{
		Id: "1234",
		B: B{
			Age: 20,
		},
		Test:      22.45,
		SliceTest: []int{1, 2, 3},
		ArrayTest: [3]string{"1", "2", "3"},
	}
	c := C{}
	NewCopier().RegisterPair(map[string]string{
		"D":         "B",
		"OldEnough": "B.Age",
		"TTT":       "Test",
	}).RegisterTransformer(map[string]TransFunc{
		"OldEnough": func(age int) bool {
			return age >= 18
		},
	}).From(a).To(&c)
	marshal, err := json.Marshal(c)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(marshal))
}
```

### validation

```go
package main

import (
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"reflect"
	"strings"
)

type A struct {
	Id     string `valid:"objectId"`
	Status string `valid:"required,in(enabled|disabled)"`
	B      B      `valid:"required"`
}

type B struct {
	Extra string `valid:"json"`
}

func validate(source interface{}) error {
	v := reflect.ValueOf(source)
	return doValid(v)
}

func doValid(v reflect.Value) error {
	if v.Type().Kind() == reflect.Pointer {
		return doValid(v.Elem())
	}
	for i := 0; i < v.NumField(); i++ {
		tags := strings.Split(v.Type().Field(i).Tag.Get("valid"), ",")
		if StrInArray("required", tags) {
			if v.Field(i).IsZero() {
				return fmt.Errorf("%s required", v.Type().Field(i).Name)
			}
		}
		switch v.Type().Field(i).Type.Kind() {
		case reflect.Struct:
			if StrInArray("required", tags) || StrInArray("optional", tags) {
				return doValid(v.Field(i))
			}
		case reflect.Pointer:
			return doValid(v.Field(i).Elem())
		case reflect.String:
			for _, tag := range tags {
				if tag == "json" {
					if !json.Valid([]byte(v.Field(i).String())) {
						return fmt.Errorf("%s should be json", v.Type().Field(i).Name)
					}
				} else if tag == "objectId" {
					_, err := primitive.ObjectIDFromHex(v.Field(i).String())
					if err != nil {
						return fmt.Errorf("%s should be objectId", v.Type().Field(i).Name)
					}
				} else if strings.HasPrefix(tag, "in") {
					tag = strings.TrimLeft(tag, "in(")
					tag = strings.TrimRight(tag, ")")
					arr := strings.Split(tag, "|")
					if !StrInArray(v.Field(i).String(), arr) {
						return fmt.Errorf("%s should in %v", v.Type().Field(i).Name, arr)
					}
				}
			}
		}
	}
	return nil
}

func StrInArray(str string, arr []string) bool {
	for _, v := range arr {
		if str == v {
			return true
		}
	}
	return false
}

func main() {
	a := A{
		Id:     primitive.NewObjectID().Hex(),
		Status: "enabled",
		B: B{
			Extra: "{1234}",
		},
	}
	if err := validate(a); err != nil {
		panic(err)
	}
}
```
