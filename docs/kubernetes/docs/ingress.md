# Ingress

Ingress 是从 Kubernetes 集群外部访问集群内部服务的入口，通常情况下，service 和 pod 仅在集群内部网络可以通过 IP 或者域名访问，

Ingress 可以配置不同的转发规则以根据不同的规则设置访问集群内不同的 Service 所对应的后端 Pods。

单纯的创建 Ingress 没有意义，需要一个 Ingress Controller 来实现 Ingress

Kubernetes 默认没有 Ingress Controller，官方维护的是 AWS、GCE 和 Nginx Ingress Controller，可以在[这里](https://kubernetes.io/zh/docs/concepts/services-networking/ingress-controllers/)找到所有的可以选择的控制器，这里我们使用 Nginx Ingress Controller。

直接使用下面的命令安装即可：

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml
```

但是需要注意，默认的配置文件中有一个 externalTrafficPolicy，这样的话外部只有访问 Ingress Controller 被分配到的节点的 IP 及 端口才能访问，注释掉即可从集群任意一个节点访问。

安装后，可以通过下面的命令获取端口的映射关系：

```shell
kubectl get service -n ingress-nginx
```

默认情况下，Nginx Ingress Controller 的 80 及 443 端口会被随机分配两个端口映射，在外部可以通过这两个端口进行访问。

## 创建 Ingress 路由

使用下面的配置文件创建一个简单的 http 后台 pod 的路由：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-http-demo
  namespace: example
spec:
  ingressClassName: nginx # 制定使用 Nginx Ingress Controller
  rules:
    - host: client.com # 如果使用这个域名访问集群，那么会对应到下面的路径
      http:
        paths:
          - path: /client # 如果路径为 /client 就进入下面的这个 client-service，例如：http://client.com/client
            pathType: Prefix # 前缀匹配模式
            backend:
              service:
                name: client-service # 服务名
                port:
                  number: 8000 # client-service 的端口
```

应用后，即可通过 Ingress Controller 80 端口映射的端口从集群外部发起 http 请求了。

## 路径重写

修改 Ingress 资源配置文件：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-http-demo
  namespace: example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  ingressClassName: nginx
  rules:
    - host: client.com
      http:
        paths:
          - path: /client(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: client-service
                port:
                  number: 8000
```

Nginx Ingress Controller 的高级功能都可以通过添加 annotations 实现，上面添加了一个重写的 annotation，这样所有 path 中被 (.\*) 捕获的内容都会被替换到 annotation 中设置的 $n 中，例如上面的例子中，重定向的结果示例如下：

- client.com/client rewrites to client.com/。
- client.com/client/ rewrites to client.com/。
- client.com/client/new rewrites to client.com/new。

::: tip
关于 Nginx Ingress 的 annotations 及其示例可见[这里](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations)。

一些高级用法示例也可以参考[这里](https://help.aliyun.com/document_detail/86533.html#section-xsg-g5g-1uy)。
:::

## Nginx Ingress gRPC

现在我们会将一个已经实现的简单的 gRPC 服务通过 Ingress 暴露出来并在外部使用客户端进行调用。

实现并暴露服务后，我们需要为服务端生成自签名 TLS 证书，因为 Nginx Ingress Controller 对于 gRPC 只能通过其 443 端口代理，并且需要证书。

这里我们使用的域名是 server.com。

首先请确保系统中已安装 OpenSSL，然后创建下面的 /tmp/openssl.cnf 文件：

```cnf
[ req ]
#default_bits           = 2048
#default_md             = sha256
#default_keyfile        = privkey.pem
distinguished_name      = req_distinguished_name
attributes              = req_attributes
req_extensions          = v3_req

[ req_distinguished_name ]
countryName                     = Country Name (2 letter code)
countryName_min                 = 2
countryName_max                 = 2
stateOrProvinceName             = State or Province Name (full name)
localityName                    = Locality Name (eg, city)
0.organizationName              = Organization Name (eg, company)
organizationalUnitName          = Organizational Unit Name (eg, section)
commonName                      = Common Name (eg, fully qualified host name)
commonName_max                  = 64
emailAddress                    = Email Address
emailAddress_max                = 64

[ req_attributes ]
challengePassword               = A challenge password
challengePassword_min           = 4
challengePassword_max           = 20

[v3_req]
# Extensions to add to a certificate request
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = server.com
```

执行下面的命令签署证书请求：

```shell
openssl req -new -nodes -keyout grpc.key -out grpc.csr -config /tmp/openssl.cnf -subj "/C=CN/ST=Zhejiang/L=Hangzhou/O=AlibabaCloud/OU=ContainerService/CN=server.com"
```

执行下面的命令签署证书：

```shell
openssl x509 -req -days 3650 -in grpc.csr -signkey grpc.key -out grpc.crt -extensions v3_req -extfile /tmp/openssl.cnf
```

此时会生成三个文件：grpc.crt grpc.csr grpc.key。

执行下面的命令将证书添加到集群中 gRPC 服务所在的 namespace：

```shell
kubectl create secret tls grpc-secret --key grpc.key --cert grpc.crt -n example
```

然后通过下面的 Ingress 配置文件创建 gRPC Ingress：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-grpc-demo
  namespace: example
  annotations:
    nginx.ingress.kubernetes.io/backend-protocol: 'GRPC' # 添加 GRPC 协议支持的 annotation
spec:
  ingressClassName: nginx
  rules:
    - host: server.com
      http:
        paths:
          - path: / # 对于 gRPC 这里就不要写路径了
            pathType: Prefix
            backend:
              service:
                name: demo-service
                port:
                  number: 8000
  tls:
    - secretName: grpc-secret
      hosts:
        - server.com # 证书对应的域名
```

将之前生成的 grpc.crt 证书文件拷贝到客户端，编写客户端启动函数：

```go
func TestDemo(t *testing.T) {
	c, err := credentials.NewClientTLSFromFile("../ssl/grpc.crt", "server.com") // 读取自签名证书
	assert.NoError(t, err)
	cc, err := grpc.Dial("server.com:31837", grpc.WithTransportCredentials(c))
	assert.NoError(t, err)
	s := proto.NewDemoServiceClient(cc)
	m := map[string]int{}
	for i := 0; i < 10; i++ {
		resp, err := s.Demo(context.Background(), &proto.Empty{})
		assert.NoError(t, err)
		m[resp.Value] = 2
	}
	assert.GreaterOrEqual(t, len(m), 1) // 这里可以看到是有负载均衡的
}
```
