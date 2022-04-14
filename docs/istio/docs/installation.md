# 安装入门

配置好 Kubernetes 集群后，执行下面的命令：

```shell
curl -L https://istio.io/downloadIstio | sh -
```

然后进入 istio 包目录，将 bin 文件夹添加到 PATH 中，或者将 bin 中的 istioctl 拷贝到 /use/local/bin 中。

这里我们使用 Istio Operator 安装，执行下面的命令：

```shell
istioctl operator init
```

然后编写下面的配置文件并使用 kubectl 创建：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: istio-system
---
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: demo-istio-install
spec:
  profile: demo
```

当 Istio Operator 检测到 IstioOperator 资源后，它将开始安装 Istio。

## 启用 sidecar 注入

执行下面的命令为指定的名称空间开启 sidecar 注入：

```shell
kubectl label namespace default istio-injection=enabled
```

之后在这个名称空间中创建的每个 Pod 中都会有两个容器。
