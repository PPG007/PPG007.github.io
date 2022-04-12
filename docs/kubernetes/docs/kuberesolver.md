# kuberesolver

Kubernetes 中，以 Service 部署的 gRPC 服务之间互相调用时，如果只是使用服务的域名形式进行互相访问，如果 clientConnect 每次不重置，则所有的 gRPC 请求都会进入一个 gRPC 实例中，例如下面的代码：

```go
var (
	cc *grpc.ClientConn
	err error
)

func init() {
	cc, err = grpc.Dial("grpc-server-service:8000", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
}

func main() {
	http.HandleFunc("/getResponse", func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		values, err := getResps()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		b, _ := json.Marshal(values)
		w.Write(b)
	})
	http.ListenAndServe("0.0.0.0:8080", nil)
}

func getResps() ([]string, error) {
	if err != nil {
		return nil, err
	}
	m := map[string]string{}
	values := []string{}
	s := proto.NewDemoServiceClient(cc)
	for i := 0; i < 10; i++ {
		resp, err := s.Demo(context.Background(), &proto.Empty{})
		if err != nil {
			return nil, err
		}
		m[resp.Value] = resp.Value
	}
	for _, v := range m {
		values = append(values, v)
	}
	return values, nil
}
```

上面的代码中，clientConnect 只有在 init 中才初始化了一次，后续不再改变，调用这个 http 接口发现返回值唯一，说明没有负载均衡。

使用 [Kuberesolver](https://github.com/sercand/kuberesolver) 可以实现客户端负载均衡，并且可以监控服务节点的动态上下线。

因为 kuberesolver 需要调用 Kubernetes 的 API，因此首先需要为使用了 kuberesolver 的 gRPC 客户端所在的 Pods 添加 ServiceAccount 及 Role：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  namespace: example
  name: kuberesolver
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: example
  name: kuberesolver-role
rules:
- apiGroups: [""]
  resources: ["endpoints", "pods"]
  verbs: ["get", "watch"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kuberesolver-rolebinding
  namespace: example
subjects:
- kind: ServiceAccount
  name: kuberesolver
  namespace: example
roleRef:
  kind: Role
  name: kuberesolver-role
  apiGroup: rbac.authorization.k8s.io
```

将上面对的配置文件中的 namespace 修改为 gRPC server 所在的命名空间，也可以使用 ClusterRole 替代 Role。

然后修改客户端启动函数，首先执行：

```shell
go get github.com/sercand/kuberesolver/v3
```

修改客户端连接函数：

```go
func init() {
	kuberesolver.RegisterInCluster()
	cc, err = grpc.Dial(endpoint, grpc.WithBalancerName(roundrobin.Name), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalln(err)
		panic(err)
	}
}
```

其中 endpoint 格式为：`kubernetes:///<service.name>.<namespace>:targetPort`，端口号是 gRPC server 在容器中暴露的端口号，不是 gRPC server 的 Kubernetes Service 的端口号。
