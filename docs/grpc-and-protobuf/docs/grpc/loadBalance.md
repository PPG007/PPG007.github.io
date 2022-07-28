# Load Balance

## Nginx

[Reference](https://www.nginx.com/blog/nginx-1-13-10-grpc/)

### NO TLS

修改 Nginx 配置文件：

```nginx
worker_processes auto;
error_log /var/log/nginx/error.log;
events {
	worker_connections 768;
}

http {
	access_log /var/log/nginx/access.log;

	upstream hello_services {
		server 0.0.0.0:8081;
		server 0.0.0.0:8082;
	}

	server {
		listen	80 http2;
		location / {
			grpc_pass grpc://hello_services;
		}
	}
}
```

将 gRPC 服务端启动在对应的端口即可，访问 Nginx 监听的 80 端口即可访问 gRPC 的接口。

### TLS

首先执行下面的命令，输入信息后生成自签名证书：

```shell
#!/usr/bin/zsh

# 首先生成私钥
openssl genrsa -out cakey.pem
# 创建请求文件
openssl req -new -key cakey.pem -out rootCA.csr
# 自签署
openssl x509 -req -in rootCA.csr -signkey cakey.pem -out x509.crt

# 首先生成私钥
openssl genrsa -out prikey.pem
# 创建请求文件
openssl req -new -key prikey.pem -out local.csr
# 签署证书请求
openssl x509 -req -in local.csr -CA x509.crt -CAkey cakey.pem -out localhost.crt -CAcreateserial
```

修改 Nginx 的配置文件：

```nginx
worker_processes auto;
error_log /var/log/nginx/error.log;
events {
	worker_connections 768;
}

http {
	access_log /var/log/nginx/access.log;

	upstream hello_services {
		server 0.0.0.0:8081;
		server 0.0.0.0:8082;
	}

	server {
        server_name localhost;
        ssl_certificate /home/user/playground/grpc-resolver/cert/localhost.crt;
        ssl_certificate_key /home/user/playground/grpc-resolver/cert/prikey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305;
        ssl_prefer_server_ciphers on;
		listen	90 ssl http2;
		location / {
			grpc_pass grpc://hello_services;
		}
	}
}
```

TLS 加解密的过程交给 Nginx 来完成，服务端和客户端使用 insecure 方式连接即可。

## 注册中心

[Example Code](https://github.com/PPG007/grpc-resolver)

grpc 中，[NameResolver](https://github.com/grpc/grpc/blob/master/doc/naming.md) 被用来解析请求的地址，决定将请求发送给那个实例，默认情况下使用 DNS 完成，但是此种情况下，如果不使用 Nginx、Istio 等原生支持 grpc 流量负载均衡的中间件，对于持久连接（即 grpc.Dial 后创建 client 都用这一个 connect）来说，DNS 解析后就确定了后续请求发送给那个实例，因此后续的请求在重置连接前会进入同一个示例，例如 Kubernetes 中使用 Service 部署服务，服务间用 grpc 互相调用是不会负载均衡的，在这种情况下，可以结合注册中心以及自定义 NameResolver 实现负载均衡。

grpc-go 中提供了 Resolver 和 Builder 两个接口，只要实现这两个接口就可以自定义 NameResolver。

为了实现服务端注册到注册中心，定义一个 ServerManager 接口：

```go
type ServerManager interface {
	RegisterToCenter(serviceName string) error
}

// 获取自己的 IPv4 地址
func GetSelfIPv4Addresses() ([]string, error) {
	result := []string{}
	addresses, err := net.InterfaceAddrs()
	if err != nil {
		return result, err
	}
	for _, address := range addresses {
		host := strings.Split(address.String(), "/")[0]
		i := net.ParseIP(host).To4()
		if i != nil && !i.IsLoopback() {
			result = append(result, i.String())
		}
	}
	return result, nil
}
```

### Consul

实现向服务端注册：

```go
const (
	consulHost = "127.0.0.1"
	consulPort = 8500
)

type consulConfig struct {
	serverHost          string
	serverPort          int
	servicePort         int
	client              *api.Client
	healthCheckEndpoint string
}

// healthCheckEndpoint 是一个 http 地址，用于进行服务健康检查
func NewConsulConfig(healthCheckEndpoint string, servicePort int) (*consulConfig, error) {
	config := api.DefaultConfig()
	result := &consulConfig{
		serverHost:          consulHost,
		serverPort:          consulPort,
		servicePort:         servicePort,
		healthCheckEndpoint: healthCheckEndpoint,
	}
	config.Address = fmt.Sprintf("%s:%d", result.serverHost, result.serverPort)
	c, err := api.NewClient(config)
	if err != nil {
		return nil, err
	}
	result.client = c
	return result, nil
}

func (c *consulConfig) RegisterToCenter(serviceName string) error {
	addresses, err := manager.GetSelfIPv4Addresses()
	if err != nil {
		return err
	}
	registration := api.AgentServiceRegistration{
		Name:    serviceName,
		ID:      fmt.Sprintf("%s_%s", serviceName, primitive.NewObjectID().Hex()),
		Port:    c.servicePort,
		Address: addresses[0],
		Check: &api.AgentServiceCheck{
			HTTP:                           c.healthCheckEndpoint,
			Interval:                       "10s",
			DeregisterCriticalServiceAfter: "20s",
		},
	}
	return c.client.Agent().ServiceRegister(&registration)
}

func (c *consulConfig) GetClient() *api.Client {
	return c.client
}
```

实现 Resolver：

```go
type consulResolver struct {
	cc          resolver.ClientConn
	serviceName string
	client      *api.Client
	lastIndex   uint64
}

func (c *consulResolver) ResolveNow(opt resolver.ResolveNowOptions) {
	services, _, err := c.client.Health().Service(c.serviceName, "", true, &api.QueryOptions{})
	if err != nil {
		return
	}
	c.UpdateAddresses(services)
}

func (*consulResolver) Close() {
	log.Println("ConsulResolver will be closed")
}

// 由于 Consul 不支持长连接，因此使用长轮询的方式实现同步服务器上下线，这就需要维护一个 lastIndex
func (c *consulResolver) Watch() {
	c.lastIndex = 0
	for {
		services, meta, err := c.client.Health().Service(c.serviceName, "", true, &api.QueryOptions{
			WaitIndex: c.lastIndex,
		})
		if err != nil {
			return
		}
		c.lastIndex = meta.LastIndex
		c.UpdateAddresses(services)
	}
}

func (c *consulResolver) UpdateAddresses(services []*api.ServiceEntry) {

	addresses := []resolver.Address{}
	for _, service := range services {
		addresses = append(addresses, resolver.Address{
			Addr: fmt.Sprintf("%s:%d", service.Service.Address, service.Service.Port),
		})
	}
	// 调用此方法可以在服务上下线之后更新客户端可用的 address 列表
	c.cc.UpdateState(resolver.State{
		Addresses: addresses,
	})
}
```

然后实现 Builder 接口：

```go
package consulresolver

import (
	"nameresolver/server/consul"

	"github.com/hashicorp/consul/api"
	"google.golang.org/grpc/resolver"
)

const (
	CONSUL_RESOLVER_SCHEMA = "consul"
)

func Init() {
	consulConfig, err := consul.NewConsulConfig("", 0)
	if err != nil {
		panic(err.Error())
	}
	consulResolverBuilder := NewConsulResolverBuilder(consulConfig.GetClient())
	resolver.Register(consulResolverBuilder)
}

type consulResolverBuilder struct {
	client *api.Client
}

func NewConsulResolverBuilder(client *api.Client) *consulResolverBuilder {
	return &consulResolverBuilder{
		client: client,
	}
}

func (c *consulResolverBuilder) Build(target resolver.Target, cc resolver.ClientConn, opts resolver.BuildOptions) (resolver.Resolver, error) {
	service := target.URL.Host
	r := consulResolver{
		cc:          cc,
		client:      c.client,
		serviceName: service,
	}
	// 构建 resolver 的时候先更新一次 address
	r.ResolveNow(resolver.ResolveNowOptions{})
	// 开启协程监听
	go r.Watch()
	return &r, nil
}

// 返回当前能够处理的 schema，schema 指的就是在建立 grpc 连接的时候传入的服务端地址的协议部分
// 例如这个 Resolver 可以解析形如 consul://HelloService 这样的地址
func (*consulResolverBuilder) Scheme() string {
	return CONSUL_RESOLVER_SCHEMA
}
```

grpc-go 中默认的负载均衡策略是 pick-first，即选择第一个，还支持轮询方式，需要进行配置才能实现负载均衡：

```go
grpc.Dial(
	target,
	grpc.WithDefaultServiceConfig(`{"loadBalancingPolicy":"round_robin"}`),
)
```

配置文件参考：[ServiceConfig](https://github.com/grpc/grpc/blob/master/doc/service_config.md)

### TLS

使用 Nginx 部分中的命令生成自签证书，然后修改服务端启动方法：

```go
crt, err := credentials.NewServerTLSFromFile("localhost.crt", "prikey.pem")
if err != nil {
	panic(err.Error())
}
grpcServer := grpc.NewServer(
	grpc.Creds(crt),
)
```

并修改服务端启动方法：

```go
cc, err = grpc.Dial(
	target,
	grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
		InsecureSkipVerify: true,
	})),
	grpc.WithDefaultServiceConfig(`{"loadBalancingPolicy":"round_robin"}`),
)
```
