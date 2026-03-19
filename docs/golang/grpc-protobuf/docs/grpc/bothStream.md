# 双向流式 RPC

生成的接口：

```go
type LaptopServiceServer interface {
	CreateLaptop(context.Context, *CreateLaptopRequest) (*CreateLaptopResponse, error)
	SearchLaptop(*SearchLaptopRequest, LaptopService_SearchLaptopServer) error
	UploadImage(LaptopService_UploadImageServer) error
	RateLaptop(LaptopService_RateLaptopServer) error
	mustEmbedUnimplementedLaptopServiceServer()
}
```

实现这个接口：

```go
func (server *LaptopServer) RateLaptop(stream pb.LaptopService_RateLaptopServer) error {
	for {
    // 获取 context 错误并进行超时和取消判断。
		err := stream.Context().Err()
		if err == context.Canceled {
			return logErr(status.Error(codes.Canceled, "request canceled"))
		}
		if err == context.DeadlineExceeded {
			return logErr(status.Error(codes.DeadlineExceeded, "deadline exceeded"))
		}
		if err != nil {
			return logErr(status.Errorf(codes.Unknown, "unknown error: %v", err))
		}
    // 接收客户端发来的请求。
		req, err := stream.Recv()
    // 如果到达流的末尾就退出循环。
		if err == io.EOF {
			log.Println("no more data")
			break
		}
		if err != nil {
			return logErr(status.Errorf(codes.Unknown, "cannot receive stream request: %v", err))
		}
		laptopID := req.GetLaptopId()
		score := req.GetScore()
		log.Printf("receive a rate-laptop request with laptopID: %s and score: %f\n", laptopID, score)
		laptop, err := server.LaptopStore.Find(laptopID)
		if err != nil {
			return logErr(err)
		}
		if laptop == nil {
			return logErr(status.Errorf(codes.NotFound, "cannot find laptop with ID: %s", laptopID))
		}
		rating, err := server.RatingStore.Add(laptopID, score)
		if err != nil {
			return logErr(status.Errorf(codes.Internal, "cannot add rating: %v", err))
		}
		res := &pb.RateLaptopResponse{
			LaptopId:     laptopID,
			RatedCount:   rating.Count,
			AverageScore: rating.Sum / float64(rating.Count),
		}
    // 每轮请求都有返回值所以直接 Send
		err = stream.Send(res)
		if err != nil {
			return logErr(status.Errorf(codes.Unknown, "cannot send response: %v", err))
		}
	}
	return nil
}
```

客户端调用：

```go
func rateLaptop(laptopID []string, score []float64, laptopClient pb.LaptopServiceClient) error {
	if len(laptopID) != len(score) {
		return fmt.Errorf("laptopID's num dosen't eqal to the score's num")
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	stream, err := laptopClient.RateLaptop(ctx)
	if err != nil {
		log.Fatalf("cannot rate laptop: %v\n", err)
	}
	waitResponse := make(chan error)
	go func() {
		for {
			res, err := stream.Recv()
			if err == io.EOF {
				log.Println("no more response")
				waitResponse <- nil
				return
			}
			if err != nil {
				waitResponse <- err
				return
			}
			log.Printf("receive response: %v\n", res)
		}
	}()
	for i, laptopID := range laptopID {
		req := &pb.RateLaptopRequest{
			LaptopId: laptopID,
			Score:    score[i],
		}
		err := stream.Send(req)
		if err != nil {
			return fmt.Errorf("cannot send stream request: %v - %v", err, stream.RecvMsg(nil))
		}
		log.Printf("send request: %v\n", req)
	}
	err = stream.CloseSend()
	if err != nil {
		return fmt.Errorf("cannot close send: %v", err)
	}
	err = <-waitResponse
	return err
}
```

客户端、服务端启动函数没有变化。
