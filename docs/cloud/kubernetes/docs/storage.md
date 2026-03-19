# 存储

Kubernetes 支持很多类型的卷，Pod 可以同时使用任意数目的卷类型。临时卷类型的声明周期与 Pod 相同，但持久卷可以比 Pod 存活期长，当 Pod 不再存在时，Kubernetes 会销毁临时卷但不会销毁持久卷。对于给定 Pod 中任何类型的卷，在容器重启期间数据都不会丢失。

卷的核心是一个目录，其中可能存有数据，Pod 中的容器可以访问该目录中的数据。 所采用的特定的卷类型将决定该目录如何形成的、使用何种介质保存数据以及目录中存放的内容。

使用卷时, 在 `.spec.volumes` 字段中设置为 Pod 提供的卷，并在 `.spec.containers[*].volumeMounts` 字段中声明卷在容器中的挂载位置。 容器中的进程看到的文件系统视图是由它们的 容器镜像 的初始内容以及挂载在容器中的卷（如果定义了的话）所组成的。 其中根文件系统同容器镜像的内容相吻合。 任何在该文件系统下的写入操作，如果被允许的话，都会影响接下来容器中进程访问文件系统时所看到的内容。

卷挂载在镜像中的指定路径下。 Pod 配置中的每个容器必须独立指定各个卷的挂载位置。

卷不能挂载到其他卷之上，也不能与其他卷有硬链接。

Kubernetes 支持多种类型的卷，参考[这里](https://kubernetes.io/zh/docs/concepts/storage/volumes/#volume-types)。

## configMap 和 secret

configMap 卷提供了向 Pod 注入配置数据的方法。 ConfigMap 对象中存储的数据可以被 configMap 类型的卷引用，然后被 Pod 中运行的容器化应用使用。

引用 configMap 对象时，你可以在 volume 中通过它的名称来引用。 你可以自定义 ConfigMap 中特定条目所要使用的路径。 下面的配置显示了如何将名为 log-config 的 ConfigMap 挂载到名为 configmap-pod 的 Pod 中：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

log-config ConfigMap 以卷的形式挂载，并且存储在 log_level 条目中的所有内容都被挂载到 Pod 的 /etc/config/log_level 路径下。 请注意，这个路径来源于卷的 mountPath 和 log_level 键对应的 path。

::: tip

- 在使用 ConfigMap 之前你首先要创建它。
- 容器以 subPath 卷挂载方式使用 ConfigMap 时，将无法接收 ConfigMap 的更新。
- 文本数据挂载成文件时采用 UTF-8 字符编码。如果使用其他字符编码形式，可使用 binaryData 字段。

:::

secret 同样可以通过 `spec.volumes.secret.secretName` 挂载到 Pod 中。

## PV 与 PVC

持久卷 PV 是集群中的一块存储，可以事先供应或者使用存储类来动态供应，持久卷是集群资源。

持久卷申领 PVC 表达的是用户对存储的请求，Pod 会消耗节点资源，PVC 会消耗 PV 资源，PVC 也可以申请特定大小的 PV 以及访问模式。

## 静态供应和动态供应

静态供应：

集群管理员创建若干 PV 卷，这些卷对象带有真实存储的细节信息，并且对集群用户可见，可供消费使用。

动态供应：

如果静态 PV 无法满足，集群可以尝试为该 PVC 申请动态供应一个存储卷，这一供应操作是给予存储类 StorageClass 来实现的，PVC 必须请求某个存储类，同时急群众必须创建并配置了这个类。

## 存储类 StorageClass

每个 StorageClass 都包含 provisioner（存储制备器）、parameters（参数） 和 reclaimPolicy（回收策略） 字段， 这些字段会在 StorageClass 需要动态分配 PersistentVolume 时会使用到。

下面是一个 local 本地卷的示例：

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

### 回收策略

StorageClass 的 reclaimPolicy 字段可以指定会搜狐策略，可选为 Delete 和 Retain，默认是 Delete。

Delete：动态供应的 PV 默认的策略，删除时会将 PV 从集群中删除，同时也会从外部 NFS 等卷插件中删除。

Retain：手动创建的 PV 默认的策略，用户可以手动回收资源，当使用 PV 的对象被删除时，PV 仍然存在，对应的数据卷状态变为已释放。

## local

local 卷所代表的是某个被挂载的本地存储设备，只能用作静态创建的持久卷，不支持动态配置。如果节点变得不健康，那么 local 卷也将变得不可被 Pod 访问。本地卷不支持动态纸杯，但是还是需要创建 StorageClass 以延迟卷绑定，直到完成 Pod 调度，这是由 WaitForFirstConsumer 卷绑定模式指定的。

使用下面的配置文件创建一次 Deployment 并挂载 local 卷：

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: localpv-demo
  namespace: example
spec:
  capacity:
    storage: 100Mi # 限制大小
  volumeMode: Filesystem
  accessModes:
    - ReadOnlyMany # 只读
  persistentVolumeReclaimPolicy: Delete # 回收策略
  storageClassName: local-storage
  local:
    path: /root/configrations # 宿主机路径
  nodeAffinity: # local 卷必须指定节点亲和性
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/os
              operator: In
              values:
                - linux
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: local-demo-claim
  namespace: example
spec:
  accessModes:
    - ReadOnlyMany
  resources:
    requests:
      storage: 10Mi
  storageClassName: local-storage
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: volume-demo
  namespace: example
spec:
  selector:
    matchLabels:
      app: volume-demo
  replicas: 2
  template:
    metadata:
      labels:
        app: volume-demo
    spec:
      imagePullSecrets:
        - name: myali-docker
      containers:
        - name: volume-demo
          image: registry.cn-qingdao.aliyuncs.com/ppg007/volume-demo
          imagePullPolicy: Always
          volumeMounts:
            - name: application
              mountPath: /root/configuration
          ports:
            - containerPort: 8080
      volumes:
        - name: application
          persistentVolumeClaim:
            claimName: local-demo-claim
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: volume-service
  name: volume-service
  namespace: example
spec:
  ports:
    - port: 8000
      protocol: TCP
      targetPort: 8080
  selector:
    app: volume-demo
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-volume-demo
  namespace: example
  annotations:
spec:
  ingressClassName: nginx
  rules:
    - host: client.com
      http:
        paths:
          - path: /config
            pathType: Prefix
            backend:
              service:
                name: volume-service
                port:
                  number: 8000
```

## nfs

安装 nfs server：

```shell
# 在所有节点执行
apt-get install nfs-kernel-server
```

在主节点执行：

```shell
#nfs主节点
echo "/nfs/data/ *(insecure,rw,sync,no_root_squash)" > /etc/exports

mkdir -p /nfs/data
systemctl enable rpcbind --now
systemctl enable nfs-server --now
#配置生效
exportfs -r
```

在从节点执行：

```shell
#执行以下命令挂载 nfs 服务器上的共享目录到本机路径 /root/nfsmount
mkdir -p /nfs/data
mount -t nfs master:/nfs/data /nfs/data
```

NFS 没有内置的存储制备器，通过下面的配置文件来创建：

首先执行[这个](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner/blob/master/deploy/rbac.yaml)配置文件，创建 ServiceAccount。注意将其中的 default 替换成要部署的命名空间。

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: nfs-client-provisioner
  namespace: example
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nfs-client-provisioner
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: k8s.gcr.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: k8s-sigs.io/nfs-subdir-external-provisioner
            - name: NFS_SERVER
              value: master
            - name: NFS_PATH
              value: /nfs/data
      volumes:
        - name: nfs-client-root
          nfs:
            server: master
            path: /nfs/data
```

然后就可以在 StorageClass 中使用上面的 PROVISIONER_NAME 环境变量值做存储制备器了：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-client
  namespace: example
provisioner: k8s-sigs.io/nfs-subdir-external-provisioner # or choose another name, must match deployment's env PROVISIONER_NAME'
parameters:
  archiveOnDelete: 'false'
```

然后创建测试用 PVC 及 Pod，并将 PVC 绑定给 Pod：

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-claim
  namespace: example
spec:
  storageClassName: nfs-client
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Mi
---
kind: Pod
apiVersion: v1
metadata:
  name: test-pod
  namespace: example
spec:
  containers:
    - name: test-pod
      image: busybox:stable
      command:
        - '/bin/sh'
      args:
        - '-c'
        - 'touch /mnt/SUCCESS && exit 0 || exit 1'
      volumeMounts:
        - name: nfs-pvc
          mountPath: '/mnt'
  restartPolicy: 'Never'
  volumes:
    - name: nfs-pvc
      persistentVolumeClaim:
        claimName: test-claim
```

在 Pod complete 之后，即可在 nfs 的目录中看到新内容。

下面来使用 nfs 做一个原生挂载，创建一个 Deployment：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: volume-demo
  namespace: example
spec:
  selector:
    matchLabels:
      app: volume-demo
  replicas: 2
  template:
    metadata:
      labels:
        app: volume-demo
    spec:
      imagePullSecrets:
        - name: myali-docker
      containers:
        - name: volume-demo
          image: registry.cn-qingdao.aliyuncs.com/ppg007/volume-demo
          imagePullPolicy: Always
          volumeMounts:
            - name: application
              mountPath: /root/configuration
          ports:
            - containerPort: 8080
      volumes:
        - name: application
          nfs:
            server: master
            path: /nfs/data
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: volume-service
  name: volume-service
  namespace: example
spec:
  ports:
    - port: 8000
      protocol: TCP
      targetPort: 8080
  selector:
    app: volume-demo
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-volume-demo
  namespace: example
spec:
  ingressClassName: nginx
  rules:
    - host: client.com
      http:
        paths:
          - path: /config
            pathType: Prefix
            backend:
              service:
                name: volume-service
                port:
                  number: 8000
```
