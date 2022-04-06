# Service

将 Deployment 暴露出来：

```shell
kubectl expose deployment grpc-demo --port=8080 --target-port=8080 -n example
```

::: tip
其中，port 是这个暴露出来的服务的端口，target-port 是 pod 中服务的端口。
:::

也可以使用配置文件形式：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grpc-demo
  namespace: example
spec:
  selector:
    matchLabels:
      app: grpc
  replicas: 5 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: grpc
    spec:
      containers:
      - name: grpc-demo
        image: grpc-demo:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: demo-service
  name: demo-service
  namespace: example
spec:
  ports:
  - port: 8000
    protocol: TCP
    targetPort: 80
  selector:
    app: grpc
  type: ClusterIP
```

上面是使用 type 为 ClusterIP 的情况，这种情况下，只有集群中的服务才可以互相使用 IP 或者域名访问，域名的规则为：`服务名.命名空间.svc:port`，例如 `demo-service.example.svc:8000`。

也可以使用 type 为 NodePort 的形式暴露服务，这样其他机器也能通过集群端口访问服务：

```shell
kubectl expose deployment grpc-demo --port=8080 --target-port=8080 --type=NodePort -n example
```

或者将配置文件中的 type 改为 NodePort 即可。
