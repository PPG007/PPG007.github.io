# 一些示例

配置参考：[参考](https://istio.io/latest/zh/docs/reference/config/networking/)。

## 将 HTTP 服务通过 Istio Gateway 暴露

首先通过 Kubernetes 部署一个 HTTP Service，然后创建一个 Istio Gateway：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: demo-gateway
  namespace: example
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
      - client.com
```

然后创建 VirtualService，并使用这个 Gateway，注意 Gateway 和 VirtualService 的 hosts 中要有交集：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: vs-demo
  namespace: example
spec:
  hosts:
  - client.com
  gateways:
    - demo-gateway
  http:
  - match:
    - headers:
        token:
          exact: wuhu # 限制请求头中的 token 字段必须等于 wuhu
    route:
      - destination:
          host: grpc-client-service
          port:
            number: 8000
```

之后通过 Istio Gateway 暴露出来的端口进行访问即可。

向 Istio Gateway 中设置 TLS，在不修改 Service 的情况下实现 HTTPS：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: demo-gateway
  namespace: example
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTPS
    hosts:
      - client.com
    tls:
      mode: SIMPLE
      credentialName: istio-secret
```

其中 credentialName 是当前命名空间中的一个 Kubernetes tls secret。

## 将 gRPC 服务通过 Istio Gateway 暴露

首先部署一个 gRPC Service，注意 Service 的 spec.ports.name 要以 grpc 开头，然后编写下面的 Gateway 配置：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: demo-gateway
  namespace: example
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: grpc
      protocol: GRPC
    hosts:
      - server.com
```

然后同样创建 VirtualService 并绑定这个 Gateway：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: vs-demo2
  namespace: example
spec:
  hosts:
  - server.com
  gateways:
    - demo-gateway
  http:
  - route:
    - destination:
        host: grpc-server-service
        port:
          number: 8000
    name: grpc-demo
```

此时即可使用客户端进行访问。

修改 Gateway 文件实现 gRPC over TLS：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: demo-gateway
  namespace: example
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: grpc
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: grpc-secret
    hosts:
      - server.com
```

协议改为 HTTPS。
