# 安装 Kubernetes

## 安装 Docker

卸载旧版本：

```shell
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get purge docker-ce docker-ce-cli containerd.io
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

安装依赖以及docker：

```shell
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

为了适配 k8s：

```shell
sudo mkdir /etc/docker
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
sudo systemctl enable docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 安装 kubeadm、kubelet 和 kubectl

禁用交换分区：

```shell
swapoff -a
sed -ri 's/.*swap.*/#&/' /etc/fstab
```

允许 iptables 检查桥接流量：

```shell
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

在每台机器上安装以下的软件包：

- kubeadm：用来初始化集群的指令。
- kubelet：在集群中的每个节点上用来启动 Pod 和容器等。
- kubectl：用来与集群通信的命令行工具。

更新 apt 包索引并安装使用 Kubernetes apt 仓库所需要的包：

```shell
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl
```

下载 Google Cloud 公开签名秘钥：

```shell
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
```

添加 Kubernetes apt 仓库：

```shell
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

更新 apt 包索引，安装 kubelet、kubeadm 和 kubectl，并锁定其版本：

```shell
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

## 初始化主节点

初始化主节点

```shell
kubeadm init \
--apiserver-advertise-address=192.168.2.118 \
--control-plane-endpoint=ubuntu1 \
--service-cidr=10.96.0.0/16 \
--pod-network-cidr=192.167.0.0/16
```

安装网络插件，为了 Pod 之间能够通信，这里使用 calico：

```shell
curl https://projectcalico.docs.tigera.io/manifests/calico.yaml -O
```

将此 yaml 配置文件中的 192.168.0.0/16 修改为上面 --pod-network-cidr 的值并取消注释：

```yaml
- name: CALICO_IPV4POOL_CIDR
  value: "192.167.0.0/16"
```

安装网络组件：

```shell
kubectl apply -f calico.yaml
```

## 添加其他节点

添加的时候需要用到 `kubeadm init` 初始化时最后生成的 token，如果忘记了，可以使用 `kubeadm token list` 命令获取 token 列表，默认 token 有效期为 24 小时，如果已经过期，可以使用 `kubeadm token create` 命令重新生成，还可以加上 `--print-join-command` 直接把加入命令打印出来。

在其他节点执行命令：

```shell
kubeadm join 192.168.2.118:6443 --token qz28oa.pi6w2ewiwhnixv9m --discovery-token-ca-cert-hash sha256:e81804ebb8dfc4311d4663927f6f5918cff1f5c87a0566234a86bd1f126b6db0
```

如果证书哈希也忘记了，可以使用下面的命令生成：

```shell
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

现在在主节点使用 `kubectl get nodes` 命令就可以看到加入的节点，刚开始状态是 NotReady，可以使用 `kubectl get pods -A -w` 命令查看其他节点的准备情况，稍等一会就 Ready 了。

## 部署 [dashbord](https://github.com/kubernetes/dashboard)

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.1/aio/deploy/recommended.yaml
```

设置访问端口：

```shell
kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard
```

将其中的 type: ClusterIP 改为 type: NodePort。

执行下面的命令获取暴露的端口号：

```shell
kubectl get svc -A |grep kubernetes-dashboard
```

创建 access.yaml：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```

执行下面的命令生成 token：

```shell
kubectl apply -f access.yaml
```

获取访问令牌：

```shell
kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```
