# metadata、interceptor、JWT

设计思想：设计一个登录接口，登录成功后返回 token，客户端使用拦截器在出站请求的 metadata 中添加 token，服务端通过拦截器判断是否需要拦截或者需要的角色，并对 token 进行合法校验和权限判断。

生成的接口：

```go
type AuthServiceServer interface {
	Login(context.Context, *LoginRequest) (*LoginResponse, error)
  // 同样需要嵌套。
	mustEmbedUnimplementedAuthServiceServer()
}
```

实现这个接口：

```go
type AuthServer struct {
	userStore  UserStore
	jwtManager JWTManager
	pb.UnimplementedAuthServiceServer
}
func (authServer *AuthServer) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	user, err := authServer.userStore.Find(req.Username)
	if err != nil {
		return nil, err
	}
  // 此处是将传来的密码进行 hash，与正确密码的 hash 比较得出。
	if !user.IsCorrectPassword(req.Password) {
		return nil, status.Errorf(codes.NotFound, "incorrect password", req.Username)
	}
  // 如果信息正确就返回。
	token, err := authServer.jwtManager.GenerateToken(user)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "cannot generate token")
	}
	return &pb.LoginResponse{
		AccessToken: token,
	}, nil
}
```

grpc/server.go 中定义了两个方法如下：

```go
func UnaryInterceptor(i UnaryServerInterceptor) ServerOption
func StreamInterceptor(i StreamServerInterceptor) ServerOption
```

这两个方法的返回值为 ServerOption 类型，将这个类型对象传入 gRPC server 构造方法中可以实现添加拦截器，这两个函数的参数定义在 grpc/interceptor.go 中：

```go
type UnaryServerInterceptor func(ctx context.Context, req interface{}, info *UnaryServerInfo, handler UnaryHandler) (resp interface{}, err error)
type StreamServerInterceptor func(srv interface{}, ss ServerStream, info *StreamServerInfo, handler StreamHandler) error
```

因此，自定义拦截器只要分别定义两个方法，分别返回这两种类型的返回值，再将这个返回值传入 gRPC server 构造函数中即可。

实现：

```go
type AuthInterceptor struct {
	jwtManager      *JWTManager
	accessibleRoles map[string][]string // 键为方法名，值为允许访问的角色列表。
}

func (interceptor *AuthInterceptor) Unary() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		log.Println("--> unary interceptor:", info.FullMethod)
		err = interceptor.authorize(ctx, info.FullMethod)
		if err != nil {
			return nil, err
		}
		return handler(ctx, req)
	}
}

func (interceptor *AuthInterceptor) Stream() grpc.StreamServerInterceptor {
	return func(srv interface{}, ss grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) error {
		log.Println("--> stream interceptor:", info.FullMethod)
		err := interceptor.authorize(ss.Context(), info.FullMethod)
		if err != nil {
			return err
		}
		return handler(srv, ss)
	}
}
func (interceptor *AuthInterceptor) authorize(ctx context.Context, fullMethod string) error {
	accessibleRoles := interceptor.accessibleRoles[fullMethod]
  // 如果没有可以访问的角色列表，那么就是不设限制。
	if accessibleRoles == nil {
		return nil
	}
  // 从 context 中获取 metadata map[string][]string
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return status.Errorf(codes.DataLoss, "need metadata")
	}
  // 用约定好的键取出值。
	values := md["authorization"]
	if len(values) == 0 {
		return status.Errorf(codes.DataLoss, "need authorization token")
	}
  // 约定数组只有一个元素就是 token。
	accessToken := values[0]
  // 验证 token。
	claims, err := interceptor.jwtManager.Verify(accessToken)
	if err != nil {
		return status.Errorf(codes.InvalidArgument, "access token is invalid: %v", err)
	}
	if contains(accessibleRoles, claims.Role) {
		return nil
	}
	return status.Errorf(codes.PermissionDenied, "no permission to call %s", fullMethod)
}
```

服务端启动函数：

```go
grpcServer := grpc.NewServer(
  grpc.UnaryInterceptor(authInterceptor.Unary()),
  grpc.StreamInterceptor(authInterceptor.Stream()),
)
```

定义客户端拦截器：

```go
type AuthInterceptor struct {
	authClient  *AuthClient // 另一个自定义结构体，用来通过用户名密码获取 access token。
	authMethods map[string]bool // 键为方法名，值为布尔，表示是否需要 token。
	accessToken string
}

// 这里两个函数的返回值也是函数，函数签名与服务端拦截器在同一个文件：grpc/interceptor.go 中。
func (authInterceptor *AuthInterceptor) Unary() grpc.UnaryClientInterceptor {
	return func(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
		log.Printf("--> unary interceptor: %s", method)
    // 如果需要认证。
		if authInterceptor.authMethods[method] {
      // 为 context 添加 token，然后将请求返回
			return invoker(authInterceptor.attachToken(ctx), method, req, reply, cc, opts...)
		}
		return invoker(ctx, method, req, reply, cc, opts...)
	}
}

func (authInterceptor *AuthInterceptor) Stream() grpc.StreamClientInterceptor {
	return func(ctx context.Context, desc *grpc.StreamDesc, cc *grpc.ClientConn, method string, streamer grpc.Streamer, opts ...grpc.CallOption) (grpc.ClientStream, error) {
		log.Printf("--> stream interceptor: %s", method)
		if authInterceptor.authMethods[method] {
      // 为 context 添加 token，然后将请求返回
			return streamer(authInterceptor.attachToken(ctx), desc, cc, method, opts...)
		}
		return streamer(ctx, desc, cc, method, opts...)
	}
}

func (authInterceptor *AuthInterceptor) attachToken(ctx context.Context) context.Context {
  // 这里的键要和服务端取出的键一致。
	return metadata.AppendToOutgoingContext(ctx, "authorization", authInterceptor.accessToken)
}
```

由于 token 存在有效期，所以在客户端拦截器上定义一个定时刷新 token 的方法：

```go
func (authInterceptor *AuthInterceptor) refreshToken() error {
	accessToken, err := authInterceptor.authClient.Login()
	if err != nil {
		return err
	}
	authInterceptor.accessToken = accessToken
	return nil
}

func (authInterceptor *AuthInterceptor) scheduleRefreshToken(refreshDuration time.Duration) error {
  // 第一次执行先尝试获取 token，如果失败则直接结束。
	err := authInterceptor.refreshToken()
	if err != nil {
		return err
	}
	go func() {
		wait := refreshDuration
		for {
			time.Sleep(wait)
			err := authInterceptor.refreshToken()
			if err != nil {
        // 如果失败了就短时间内重新尝试。
				wait = time.Second
			} else {
				wait = refreshDuration
			}
		}
	}()
	return nil
}
```

客户端启动函数：

```go
// 因为客户端拦截器成员中有一个 access token，所以客户端先使用不带拦截器的 grpc 连接到服务端并进行登录获取 token，获取 token 后创建出拦截器再新建带有拦截器的 grpc 连接。
conn, err := grpc.Dial(*serverAddress, grpc.WithUnaryInterceptor(interceptor.Unary()), grpc.WithStreamInterceptor(interceptor.Stream()))
```
