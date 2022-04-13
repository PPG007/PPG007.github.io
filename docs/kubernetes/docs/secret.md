# Secret

Kubernetes 中使用 secret 来保存敏感信息，例如密码、ssh 秘钥、TLS 证书及秘钥等。

## 使用 kubectl 管理 secret

首先创建两个文件，分别是 username 及 password，然后使用下面的命令将这两个文件打包为一个 secret 并在集群中创建对象：

```shell
kubectl create secret generic user-pass --from-file=username=username --from-file=password=password -n example
```

`--from-file` 参数指定密钥从文件中读取，默认情况下密钥名字就是文件名，但是可以像上面的命令那样指定密钥的名称。

`generic` 是密钥的类型，有三个可选值：

- generic: 从本地文件、目录或者直接在命令中赋值的方式创建 secret。
- tls: 创建 tls 的 secret。
- docker-registry： 创建 docker 仓库的 secret。

Kubernetes 会将 secret 进行 base64 编码，因此需要进行 base64 解码才能获取到原数据。

## 使用配置文件管理 secret

使用下面的配置文件创建一个 secret：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  namespace: example
type: Opaque
stringData:
  username: ppg007
  password: '123456'
```

stringData 中必须都是字符串，也可以使用 data 替换 stringData，但是使用 data 时，值必须是经过 base64 编码后的值。

如果同时使用 data 和 stringData，那么将会使用 stringData 的值。

配置文件中的 type 具有以下可选值：

![types](/kubernetes/secretTypes.png)

## Secret 做环境变量

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
          - secretRef:
              name: myali-docker
        ports:
        - containerPort: 8080
```

## 示例：配置 Docker 私有镜像仓库

首先编写下面这样的一个 json 文件：

```json
{
  "auths": {
    "your docker repository address": {
      "username": "username",
      "password": "password"
    }
  }
}
```

将这个文件的内容通过 base64 进行编码，在 Linux 中可以使用下面这个命令：

```shell
cat docker.json | base64
```

然后编写下面的配置文件：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myali-docker
  namespace: example
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <your base64>
```

::: warning
注意 base64 编码要在一行里。
:::

执行 apply 命令创建 secret。

修改之前的 Deployment 或者 Pod 配置文件：

```yaml
template:
  metadata:
    labels:
      app: grpc-server
  spec:
    imagePullSecrets:
      - name: myali-docker # 指定使用的 docker secret
    containers:
    - name: grpc-demo-server
      image: registry.cn-qingdao.aliyuncs.com/ppg007/grpc-demo-server
      ports:
      - containerPort: 8080
```

这样就会从私有仓库拉取镜像了。
