# 客户端流式 RPC

生成的接口：

```go
type LaptopServiceServer interface {
	CreateLaptop(context.Context, *CreateLaptopRequest) (*CreateLaptopResponse, error)
	SearchLaptop(*SearchLaptopRequest, LaptopService_SearchLaptopServer) error
	UploadImage(LaptopService_UploadImageServer) error
	mustEmbedUnimplementedLaptopServiceServer()
}
```

实现这个接口：

```go
func (server *LaptopServer) UploadImage(stream pb.LaptopService_UploadImageServer) error {
  // 调用 Recv() 方法获取客户端发来的请求，此请求包含 oneof
	req, err := stream.Recv()
	if err != nil {
		return logErr(status.Errorf(codes.Unknown, "cannot receive image info"))
	}
  // 接收第一轮请求，这一轮请求包含 laptop 的 ID 和图片的类型，后续请求只有二进制数组。
	laptopID := req.GetInfo().GetLaptopId()
	imageType := req.GetInfo().GetImageType()
	log.Printf("receive an upload-image request for laptop %s with image type %s", laptopID, imageType)
	laptop, err := server.LaptopStore.Find(laptopID)
	if err != nil {
		return logErr(status.Errorf(codes.Internal, "cannot find laptop: %v", err))
	}
	if laptop == nil {
		return logErr(status.Errorf(codes.NotFound, "laptop with ID: %s dosen't exist", laptopID))
	}
  // 创建缓冲区。
	imageData := bytes.Buffer{}
	imageSize := 0
  // 流式请求要循环接收。
	for {
		log.Println("waiting to receive more data")
		req, err := stream.Recv()
    // 如果到达流的末尾。
		if err == io.EOF {
			log.Println("no more data")
			break
		}
		if err != nil {
			return logErr(status.Errorf(codes.Unknown, "cannot receive chunk data: %v\n", err))
		}

		chunk := req.GetChunkData()
		size := len(chunk)
		log.Println("receive data with size:", size)
		imageSize += size
    // 限制大小。
		if imageSize > maxImageSize {
			return logErr(status.Errorf(codes.InvalidArgument, "image is too large: %d > %d\n", imageSize, maxImageSize))
		}
    // 写入缓冲区。
		_, err = imageData.Write(chunk)
		if err != nil {
			return logErr(status.Errorf(codes.Internal, "cannot write chunk data: %v", err))
		}
	}
	imageID, err := server.ImageStore.Save(laptopID, imageType, imageData)
	if err != nil {
		return logErr(status.Errorf(codes.Internal, "cannot save image to the store: %v", err))
	}
	res := &pb.UploadImageResponse{
		Id:   imageID,
		Size: uint32(imageSize),
	}
  // 发送并关闭流，将相应发送回客户端。
	err = stream.SendAndClose(res)
	if err != nil {
		return logErr(status.Errorf(codes.Unknown, "cannot send response: %v", err))
	}
	log.Printf("save image with id: %s, size: %d successfully\n", imageID, imageSize)
	return nil
}
```

客户端调用：

```go
func uploadImage(laptopClient pb.LaptopServiceClient, laptopID, imagePath string) {
	file, err := os.Open(imagePath)
	if err != nil {
		log.Fatal("cannot open image file:", err)
	}
	defer file.Close()
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	stream, err := laptopClient.UploadImage(ctx)
	if err != nil {
		log.Fatal("cannot upload image: ", err)
	}

	req := &pb.UploadImageRequest{
		Data: &pb.UploadImageRequest_Info{
			Info: &pb.ImageInfo{
				LaptopId:  laptopID,
				ImageType: filepath.Ext(imagePath),
			},
		},
	}
	err = stream.Send(req)
	if err != nil {
		log.Fatal("cannot send image info:", err)
	}
	reader := bufio.NewReader(file)
	buffer := make([]byte, 1024)
	for {
		n, err := reader.Read(buffer)
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal("cannot read chunk to buffer:", err)
		}
		req := &pb.UploadImageRequest{
			Data: &pb.UploadImageRequest_ChunkData{
				ChunkData: buffer[:n],
			},
		}

		err = stream.Send(req)
		if err != nil {
			// 获取实际错误
			err2 := stream.RecvMsg(nil)
			log.Fatal("cannot send chunk to server:", err, err2)
		}
	}
	res, err := stream.CloseAndRecv()
	if err != nil {
		log.Fatal("cannot receive response:", err)
	}
	log.Printf("upload image with ID: %s and size: %d", res.Id, res.Size)
}
```

服务端、客户端启动函数无变化。
