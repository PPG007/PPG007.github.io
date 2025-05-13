# Deployment

Deployment 可以控制 Pod，使 Pod 拥有多副本，自愈，扩缩容等能力。

## 创建 Deployment 及简单使用

命令行方式：

```shell
# 使用指定的镜像进行部署，并创建共计三份实例副本
kubectl create deployment demo --image=nginx --replicas=3
```

::: tip
如果任意的副本 Pod 被删除或者 Pod 所在的机器宕机，则 Deployment 将会填补上缺失的副本个数，维持在 3 个。
:::

删除 Deployment：

```shell
kubectl delete deployment demo
```

配置文件方式：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo
  namespace: example
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

查看 Deployment 的详情：

```shell
kubectl describe deployment demo -n example
```

查看 Deployment 创建的 Pods：

```shell
# app 后是 spec.template.metadata.labels.app
kubectl get pods -n example -l app=nginx
```

::: tip
如果修改了配置文件的内容，再次调用 `kubectl apply -f config.yaml`，将会将对应的 Deployment 更新为最新的配置文件制定的内容，并且是滚动更新。
:::

扩缩容：

```shell
kubectl scale deployment/demo --replicas=5 -n example
```

版本回退：

```shell
# 查看历史版本
kubectl rollout history deployment/demo -n example
# 查看某个历史版本的详情
kubectl rollout history deployment/demo -n example --revision=1
#回滚(回到上次)
kubectl rollout undo deployment/demo -n example
#回滚(回到指定版本)
kubectl rollout undo deployment/demo -n example --to-revision=2
```
