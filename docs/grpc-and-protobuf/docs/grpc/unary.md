# 一元 RPC

在 proto 文件编译后生成的代码中可以找到 proto 中 service 关键字定义的接口 interface：

```go
type LaptopServiceServer interface {
	CreateLaptop(context.Context, *CreateLaptopRequest) (*CreateLaptopResponse, error)
	mustEmbedUnimplementedLaptopServiceServer()
}
```

在生成的接口中存在一个对包外不可见的方法，同时这个生成的文件提供了一个结构体 `UnimplementedLaptopServiceServer` 实现了这个接口的所有方法，如果我们要在其他包中实现这个接口，就必须在包外的结构体中：

```go
type LaptopServer struct {
  // 自定义的接口，用来保存笔记本，这里直接保存在一个 map 中。
	LaptopStore LaptopStore
  // 自定义的接口，用来保存图片，这里保存在系统中指定的路径中。
	ImageStore  ImageStore
  // 匿名嵌套
	pb.UnimplementedLaptopServiceServer
  // 自定义接口，用来保存笔记本的评分，这里直接存在 map 中。
	RatingStore RatingStore
}
```

在上面的结构体上实现这个接口：

```go
func (server *LaptopServer) CreateLaptop(ctx context.Context, req *pb.CreateLaptopRequest) (*pb.CreateLaptopResponse, error) {
  // 获取请求中的 laptop 对象
	laptop := req.GetLaptop()
	log.Printf("receive a create-laptop request with id: %s", laptop.Id)
  // 如果传来的 laptop 的 id 大于 0 就对其进行验证。
	if len(laptop.Id) > 0 {
    // 使用 uuid 解析 id
		_, err := uuid.Parse(laptop.Id)
    // 如果出错就直接返回
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "laptop ID is not a valid UUID: %v", err)
		}
	} else {
    // 如果发来的 laptop 的 id 长度为 0，就生成一个随机 id 赋值给这个 laptop 对象。
		id, err := uuid.NewRandom()
    // 出错就返回。
		if err != nil {
			return nil, status.Errorf(codes.Internal, "cannot generate a new laptop ID: %v", err)
		}
		laptop.Id = id.String()
	}
  // 如果客户端终止了（Ctrl + C）就直接返回错误。
	if ctx.Err() == context.Canceled {
		log.Println("request canceled")
		return nil, status.Error(codes.Canceled, "request canceled")
	}
  // 如果客户端设置了超时且已经超时也返回错误。
	if ctx.Err() == context.DeadlineExceeded {
		log.Println("deadline exceeded")
		return nil, status.Error(codes.DeadlineExceeded, "deadling exceeded")
	}
  // 将这个 laptop 保存起来并对错误进行处理。
	err := server.LaptopStore.Save(laptop)
	if err != nil {
		s, ok := status.FromError(err)
		if !ok {
			return nil, status.Errorf(codes.Internal, "cannot save laptop to the store: %v", err)
		}
		return nil, status.Errorf(s.Code(), "cannot save laptop to the store: %v", err)
	}
	return &pb.CreateLaptopResponse{
		Id: laptop.Id,
	}, nil
}
```

服务端启动函数：

```go
func main() {
	port := flag.Int("port", 8080, "the server port")
	flag.Parse()
	log.Printf("start server on port %d\n", *port)
	laptopServer := service.NewLaptopServer(service.NewInMemoryLaptopStore())
  // 创建一个 grpc 服务器。
	grpcServer := grpc.NewServer()
  // 向这个 grpc 服务器注册一个服务。
	pb.RegisterLaptopServiceServer(grpcServer, laptopServer)
	address := fmt.Sprintf("0.0.0.0:%d", *port)
  // 定义监听。
	listener, err := net.Listen("tcp", address)
	if err != nil {
		log.Fatalf("cannot start server: %v\n", err)
	}
  // 启动 grpc 服务器。
	err = grpcServer.Serve(listener)
	if err != nil {
		log.Fatalf("cannot start server: %v\n", err)
	}
}
```

客户端启动函数：

```go
func main() {
	serverAddress := flag.String("address", "", "the server address")
	flag.Parse()
	log.Printf("dial server %s\n", *serverAddress)
  // 不使用 TLS 进行连接。
	conn, err := grpc.Dial(*serverAddress, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("cannot dial server: %v\n", err)
	}
  // 调用生成的方法生成指定服务的客户端。
	laptopClient := pb.NewLaptopServiceClient(conn)
  // 创建一个 laptop 对象。
	laptop := sample.NewLaptop()
  // 构建一个请求对象。
	req := &pb.CreateLaptopRequest{
		Laptop: laptop,
	}
  // 设置超时时间。
	ctx, cancelFunction := context.WithTimeout(context.Background(), time.Second * 5)
	defer cancelFunction()
  // 通过 client 调用方法
	res, err := laptopClient.CreateLaptop(ctx, req)
	if err !=nil {
		log.Fatalf("call createLaptop error: %v\n", err)
	}
	log.Printf("created laptop with id: %s\n", res.Id)
}
```
