# 服务端流式 RPC

生成的接口：

```go
type LaptopServiceServer interface {
	CreateLaptop(context.Context, *CreateLaptopRequest) (*CreateLaptopResponse, error)
	SearchLaptop(*SearchLaptopRequest, LaptopService_SearchLaptopServer) error
	mustEmbedUnimplementedLaptopServiceServer()
}
```

实现这个接口：

```go
func (server *LaptopServer) SearchLaptop(request *pb.SearchLaptopRequest, stream pb.LaptopService_SearchLaptopServer) error {
  // 获取发送的 filter 对象。
	filter := request.GetFilter()
	log.Printf("receive a search-laptop request with filter: %v", filter)
  // 向自定义方法传入参数，context 用来进行取消和超时处理，filter 用来筛选，传入函数用来以流形式回复客户端，这个自定义方法循环遍历 map 中的每个元素，每遇到一个符合 filter 要求的就调用这个传入的函数发回客户端
	err := server.LaptopStore.Search(stream.Context(), filter, func(laptop *pb.Laptop) error {
		res := &pb.SearchLaptopResponse{Laptop: laptop}
    // 流调用 Send 方法发送。
		err := stream.Send(res)
		if err != nil {
			return err
		}
		log.Printf("sent laptop with id: %s", laptop.GetId())
		return nil
	})
	if err != nil {
		return status.Errorf(codes.Internal, "unexpected error: %v", err)
	}
	return nil
}
```

客户端调用：

```go
func searchLaptop(laptopClient pb.LaptopServiceClient, filter *pb.Filter) {
	log.Println("search filter", filter)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	req := &pb.SearchLaptopRequest{
		Filter: filter,
	}
	stream, err := laptopClient.SearchLaptop(ctx, req)
	if err != nil {
		log.Fatalf("cannot search laptop: %v\n", err)
	}
	for {
		res, err := stream.Recv()
		if err == io.EOF {
			return
		}
		if err != nil {
			log.Fatalf("cannot receive response: %v\n", err)
		}
		laptop := res.GetLaptop()
		log.Printf("- found laptop with id: %s", laptop.Id)
		log.Printf(" + found laptop with price_usd: %f", laptop.PriceUsd)
		log.Printf(" + found laptop with cpu_cores: %d", laptop.Cpu.NumberCores)
		log.Printf(" + found laptop with ram: %d %v", laptop.Ram.Value, laptop.Ram.Unit)
		log.Printf(" + found laptop with min cpu_ghz: %f", laptop.Cpu.MinGhz)
		log.Printf(" + found laptop with max cpu_ghz: %f", laptop.Cpu.MaxGhz)
	}
}
```

服务端、客户端启动函数不需要变化。
