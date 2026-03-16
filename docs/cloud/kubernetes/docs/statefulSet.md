# StatefulSet

StatefulSet 是有状态的集合，管理有状态的服务，所管理的 Pod 名称不能随意变化，数据持久化的目录也不一样，每一个 Pod 都有自己的数据持久化存储目录，比如数据库集群、Redis 集群等场景。

下面创建一个示例 StatefulSet：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  namespace: example
  labels:
    app: nginx
spec:
  ports:
    - port: 80
      name: web
  clusterIP: None
  selector:
    app: nginx
---
# 通过下面这个 service 访问上面这个 Headle 服务
apiVersion: v1
kind: Service
metadata:
  name: nginx-visit
  namespace: example
  labels:
    app: nginx
spec:
  ports:
    - port: 80
      name: web
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
  namespace: example
spec:
  selector:
    matchLabels:
      app: nginx # has to match .spec.template.metadata.labels
  serviceName: 'nginx'
  replicas: 3 # by default is 1
  template:
    metadata:
      labels:
        app: nginx # has to match .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
              name: web
          volumeMounts:
            - name: www
              mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: www
      spec:
        accessModes: ['ReadWriteMany']
        storageClassName: 'nfs-client'
        resources:
          requests:
            storage: 10Mi
---
# 通过 Ingress 暴露服务
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: statefulset-demo
  namespace: example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  ingressClassName: nginx
  rules:
    - host: client.com
      http:
        paths:
          - path: /wuhu(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: nginx-visit
                port:
                  number: 80
```

持久卷申明 PVC 我们使用之前的 nfs 存储分配器分配，然后在执行这个配置文件后，查看 nfs 的目录，可以看到有 replicas 个目录，每一个就对应一个 Pod 的持久卷。

::: warning
StatefulSet 当前需要无头服务来负责 Pod 的网络标识，也就是需要一个 clusterIP 为 None 的 Service。
:::
