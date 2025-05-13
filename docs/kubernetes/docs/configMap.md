# ConfigMap

ConfigMap 允许将配置文件与镜像文件分离。

## 使用 kubectl 创建 ConfigMap

执行下面的命令可以在指定名称空间创建一个 ConfigMap：

```shell
kubectl create configmap application-config --from-file=application.toml -n example
```

其中 application-config 是这个 ConfigMap 的名字，from-file 可以是单个文件也可以是目录，`--from-env-file` 参数可以从环境文件创建 ConfigMap，环境文件每一行必须是 k=v 的格式，如果使用了多个 `--from-env-file` 参数，只有最后一个环境文件会生效。

使用 `--from-file` 参数时，可以使用下面这种形式自定义键名取代默认使用文件名的行为：

```shell
kubectl create configmap application-config --from-file=key=application.toml -n example
```

`--from-literal` 参数可以通过直接在命令中指定字面量来创建 ConfigMap。

## 配置文件创建

使用下面的配置文件可以创建一个 ConfigMap：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: application-config
  namespace: example
data:
  application.toml: |
    [mysql]

    url = "mysql://localhost:3306"
    username = "root"
    password = "123456"

    [mongodb]

    url = "mongo://localhost:27017"
    username = "mongo"
    password = "654321"
```

## 使用 ConfigMap 定义 Pod 环境变量

### 使用单一 ConfigMap

创建下面的这个 Deployment 并将一个 ConfigMap 挂载进去：

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
          image: registry.cn-qingdao.aliyuncs.com/ppg007/volume-demo:2.0
          imagePullPolicy: Always
          env:
            - name: DEMO_ENV
              valueFrom:
                configMapKeyRef:
                  name: application-config
                  key: application.toml
          ports:
            - containerPort: 8080
```

### 使用多个 ConfigMap

下面的 Deployment 使用了两个 ConfigMap：

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
          image: registry.cn-qingdao.aliyuncs.com/ppg007/volume-demo:2.0
          imagePullPolicy: Always
          env:
            - name: DEMO_ENV
              valueFrom:
                configMapKeyRef:
                  name: application-config
                  key: application.toml
            - name: USERNAME
              valueFrom:
                configMapKeyRef:
                  name: cm2
                  key: username
            - name: PASSWORD
              valueFrom:
                configMapKeyRef:
                  name: cm2
                  key: password
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
```

### 将 ConfigMap 中的所有键值对配置为容器环境变量

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
          image: registry.cn-qingdao.aliyuncs.com/ppg007/volume-demo:2.0
          imagePullPolicy: Always
          envFrom:
            - configMapRef:
                name: cm2
          ports:
            - containerPort: 8080
```

## 将 ConfigMap 中的数据添加到卷

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
          image: registry.cn-qingdao.aliyuncs.com/ppg007/volume-demo:2.0
          imagePullPolicy: Always
          envFrom:
            - configMapRef:
                name: cm2
          volumeMounts:
            - name: application
              mountPath: /root/configuration
            - name: config-volume
              mountPath: /etc/config
          ports:
            - containerPort: 8080
      volumes:
        - name: application
          nfs:
            server: master
            path: /nfs/data
        - name: config-volume
          configMap:
            name: cm2
```

上面的配置文件会在 /etc/config 目录中创建 cm2 ConfigMap 中的每个键值对，键为文件名，文件内容为值。这种方式中，/etc/config 目录中原有内容会被清除。
