# 环境准备

## 注册中心 ZooKeeper

下载地址：[ZooKeeper](http://zookeeper.apache.org/releases.html)

下载完成后解压，在 conf 目录下有 zoo.cfg 文件，其中保存着 ZooKeeper 的配置，例如端口号等，这里我们使用默认配置，端口号为 2181。

Windows 环境下双击 bin 目录下的 `zkServer.cmd` 即可开启 ZooKeeper。

## Dubbo 可视化面板

下载地址：[Dubbo-Admin](https://github.com/apache/dubbo-admin/tree/master-0.2.0)。

以下命令需要配置 Maven 环境变量及 Node.js 环境变量：

默认分支最新已经切换为 Vue 前后端分离版，master-0.2.0 分支仍然是不分离版，此处方便起见使用不分离版本，如果要使用前后端分离，则将后台打包后启动，在前端中运行 `npm install` 下载依赖然后运行 `npm run dev` 启动前端，访问对应端口即可。

进入 dubbo-admin 目录中，运行 `mvn package` 命令，生成一个 target 文件夹，使用 `java -jar` 命令运行其中 jar 包即可。

进入 dubbo-monitor-simple 文件夹，运行 `mvn package` 命令生成 target 文件夹，解压其中生成的压缩包，进入解压后的目录，其中 config 文件中的配置文件配置了相关端口等，可自行修改，这里使用默认即可，进入 bin 目录运行 `start.bat` 即可。
