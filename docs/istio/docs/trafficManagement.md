# 流量管理

流量管理指的是：

- 控制服务之间的路由：通过在 VirtualService 中的规则条件匹配来设置路由，可以再服务间拆分流量。
- 控制路由上流量的行为：设定好路由之后就可以在路由上指定超时和重试机制。
- 显式地向网格中注册服务：显式地引入 Service Mesh 内部或外部的服务，纳入服务网格管理，由 ServiceEntry 实现。
- 控制网格边缘的南北向流量：为了管理进入 Istio Service Mesh 的南北向入口流量，需要创建 Gateway 对象并与 VirtualService 绑定。

## VirtualService

VirtualService 中定义了一系列针对指定服务的流量路由规则。每个路由规则都是针对特定协议的匹配规则。如果流量符合这些特征，就会根据规则发送到服务注册表中的目标服务（或者目标服务的子集或版本）。

虚拟服务允许将路由目标设为不同的服务或同一服务的不同版本。

虚拟服务示例：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v3
```

所有配置项参考[VirtualService](https://istio.io/latest/zh/docs/reference/config/networking/virtual-service/#Destination)。

### hosts 字段

流量的目标主机，可以使带有通配符前缀的 DNS 名称，也可以是 IP 地址或者依赖平台的简称（Kubernetes服务的短名称），一个主机名只能在一个 VirtualService 中定义。

### 路由规则

在 http 字段中包含了虚拟服务的路由规则，它们把 HTTP/1.1、HTTP2 和 gRPC 流量发送到 hosts 字段指定的目标，如果希望为 TCP 和未终止的 TLS 流量设置路由规则，可以使用 tcp 和 tls 字段。

路由规则按从上到下的顺序选择，虚拟服务中定义的第一条规则具有最高优先级，上面的示例中将先通过第一条规则进行判断，不满足的将进行第二条规则。

### 目标规则

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: my-destination-rule
spec:
  host: my-svc
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
    trafficPolicy:
      loadBalancer:
        simple: ROUND_ROBIN
  - name: v3
    labels:
      version: v3
```

每个子集都是基于一个或多个 labels 定义的，在 Kubernetes 中它是附加到像 Pod 这种对象上的键/值对。这些标签应用于 Kubernetes 服务的 Deployment 并作为 metadata 来识别不同的版本。

## Gateway 网关

Gateway 为 HTTP/TCP 流量配置了一个负载均衡，多数情况下在网格边缘进行操作，用于启用一个服务的入口（ingress）流量，相当于前端代理。与 Kubernetes 的 Ingress 不同，Istio Gateway 只配置四层到六层的功能（例如开放端口或者 TLS 配置），而 Kubernetes 的 Ingress 是七层的。将 VirtualService 绑定到 Gateway 上，用户就可以使用标准的 Istio 规则来控制进入的 HTTP 和 TCP 流量。

Gateway 设置了一个集群外部流量访问集群中的某些服务的入口，而这些流量究竟如何路由到那些服务上则需要通过配置 VirtualServcie 来绑定。

下面是一个 Istio Gateway 的示例，

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
  - port:
      number: 443
      name: grpc
      protocol: GRPC
    hosts:
      - server.com
```

## Service Entry 服务入口

TODO:
