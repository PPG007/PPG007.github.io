# Pod

## 创建 Pod

命令行方式：

```shell
kubectl run mynginx --image=nginx --port=80 --namespace=example
```

配置文件方式：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo
  namespace: example
spec:
  containers:
    - name: mynginx
      image: nginx
      resources:
        limits:
          memory: '200Mi'
        requests:
          memory: '100Mi'
    - image: tomcat:8.5.68
      name: tomcat
```

查看 Pod 的详细信息：

```shell
kubectl describe pod mynginx --namespace=example
```

删除 Pod：

```shell
kubectl delete pod mynginx --namespace=example
# 对于使用配置文件创建的 Pod：
kubectl delete -f nginx.yaml
```

查看 Pod 的日志：

```shell
kubectl logs mynginx --namespace=example
```

对于每个 Pod，Kubernetes 都会分配一个 IP：

```shell
kubectl get pod --namespace=example -owide
```
