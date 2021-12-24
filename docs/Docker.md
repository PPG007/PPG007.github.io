# Docker

## 列出镜像

- 列出已经下载的镜像：`docker image ls` 或 `docker images`。
- 查看镜像、容器、数据卷所占用的空间：`docker system df`。
- 显示中间层在内的所有镜像：`docker image ls -a`。
- 列出部分镜像：`docker image ls ubuntu:18.04`。

### 虚悬镜像

由于新旧镜像同名，旧镜像名称被取消的无标签镜像称为虚悬镜像。

- 查看虚悬镜像：`docker image ls -f dangling=true`。
- 删除虚悬镜像：`docker image prune`。
