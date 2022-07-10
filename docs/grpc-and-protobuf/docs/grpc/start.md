---
prev:
  text: 首页
  link: /grpc-and-protobuf
---

# 起步

::: tip

可以使用以下命令生成桩文件：

```shell
docker run --rm --name protoc --mount type=bind,source=${your protofile abs path},target=/app/proto ppg007/protoc-gen:latest /sbin/my_init -- bash gen.sh
```

如果速度较慢可以将镜像从 `ppg007/protoc-gen` 替换为 `registry.cn-qingdao.aliyuncs.com/ppg007/protoc-gen`。

此种方式下，proto 源文件夹必须是绝对路径，且最多允许两层嵌套，例：如果输入的源路径为 /home/user/proto，那么 proto 文件夹中可以直接存放 proto 文件，也可以在 proto 文件夹中创建多个子目录存放 proto 文件。

如果使用的 grpc-gateway 是使用 yaml 格式描述的，这个 yaml 文件名必须是 `service.yml`。

此镜像详细信息见：[protoc-gen](https://github.com/PPG007/protoc-gen)

:::

## 引入 gRPC

`go get google.golang.org/grpc`。
