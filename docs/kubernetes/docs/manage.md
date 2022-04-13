# 管理集群

## 命名空间

命名空间用来对集群资源进行隔离划分，默认只隔离资源，不隔离网络，例如分为开发环境和生产环境。

### 创建命名空间

命令行方式：

```shell
kubectl create namespace example
```

配置文件方式：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: example
```

然后使用下面的命令读取配置文件并创建命名空间：

```shell
kubectl apply -f ns-example.yaml
```

删除命名空间：

```shell
kubectl delete namespace example
```

对于使用配置文件创建的资源可以使用下面的命令删除：

```shell
kubectl delete -f ns-example.yaml
```

### 管理命名空间的内存

#### 管理命名空间的内存请求和限制

通过下面的文件限制内存范围：

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-limit-range
spec:
  limits:
  - default:
      memory: 512Mi
    defaultRequest:
      memory: 256Mi
    type: Container
```

然后使用下面的命令为一个已经创建的命名空间添加内存限制：

```shell
kubectl apply -f ns-limit.yaml --namespace=example
```

也可以使用下面的配置文件同时创建并做出限制：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: example
---
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-limit-range
  namespace: example
spec:
  limits:
  - default:
      memory: 512Mi
    defaultRequest:
      memory: 256Mi
    type: Container
```

使用命令：

```shell
kubectl apply -f ns-limit.yaml
```

::: tip
现在，如果在 example 命名空间创建容器，并且该容器没有声明自己的内存请求和限制值， 它将被指定默认的内存请求 256 MiB 和默认的内存限制 512 MiB。
:::

#### 管理命名空间的最大和最小内存限制

通过下面的配置文件对命名空间的最大与最小内存做限制，如果 Pod 不满足这个约束条件，那么在这个命名空间中将无法创建这个 Pod。

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-min-max-demo-lr
  namespace: example
spec:
  limits:
  - max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

::: tip 现在，只要在 constraints-mem-example 命名空间中创建容器，Kubernetes 就会执行下面的步骤：

- 如果 Container 未指定自己的内存请求和限制，将为它指定默认的内存请求和限制。
- 验证 Container 的内存请求是否大于或等于 500 MiB。
- 验证 Container 的内存限制是否小于或等于1 GiB。

:::

### 管理命名空间的 CPU

#### 管理命名空间默认 CPU 请求和限制

使用下面的配置文件限制 CPU 资源：

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-limit-range
  namespace: example
spec:
  limits:
  - default:
      cpu: 1
    defaultRequest:
      cpu: 0.5
    type: Container
```

::: tip
现在如果在 example 命名空间创建一个容器，该容器没有声明自己的 CPU 请求和限制时， 将会给它指定默认的 CPU 请求 0.5 和默认的 CPU 限制值 1。
:::

#### 管理命名空间 CPU 最小和最大约束

使用下面的配置文件限制 CPU 的最小和最大约束：

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-min-max-demo-lr
  namespace: example
spec:
  limits:
  - max:
      cpu: "1"
    min:
      cpu: "200m"
    type: Container
```

::: tip 现在不管什么时候在 example 命名空间中创建容器，Kubernetes 都会执行下面这些步骤：

- 如果容器没有声明自己的 CPU 请求和限制，将为容器指定默认 CPU 请求和限制。
- 核查容器声明的 CPU 请求确保其大于或者等于 200 millicpu。
- 核查容器声明的 CPU 限制确保其小于或者等于 1 cpu。

:::

### 限制内存和 CPU 配额

使用下面的配置文件：

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: mem-cpu-demo
  namespace: example
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi

```

::: tip ResourceQuota 在 quota-mem-cpu-example 命名空间中设置了如下要求：

- 每个容器必须有内存请求和限制，以及 CPU 请求和限制。
- 所有容器的内存请求总和不能超过 1 GiB。
- 所有容器的内存限制总和不能超过 2 GiB。
- 所有容器的 CPU 请求总和不能超过 1 cpu。
- 所有容器的 CPU 限制总和不能超过 2 cpu。

:::

### 限制命名空间下 Pod 配额

使用下面的配置文件进行限制：

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: pod-demo
  namespace: example
spec:
  hard:
    pods: "2"
```
