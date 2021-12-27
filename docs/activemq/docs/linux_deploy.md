# Linux 中部署 ActiveMQ

## 安装并启动 ActiveMQ

下载对应压缩包：

[ActiveMQ](https://activemq.apache.org/components/classic/download/)

在 Linux 中解压并进入解压后的目录，进入其中的 bin 文件夹(首先需要安装 Java 环境)：

```sh
#启动
./activemq start
#重启
./activemq restart
#停止
./activemq stop
#查看状态
./activemq status
```

后台进程默认端口：`61616`。

控制台默认端口：`8161`，用户名：`admin`，密码：`admin`。

## 控制台访问

修改 conf 文件夹中的 `jetty.xml`，注释掉 `127.0.0.1` 才能使用公网访问：

```xml
<bean id="jettyPort" class="org.apache.activemq.web.WebConsolePort" init-method="start">
    <!-- the default port number for the web console -->
    <!--
    <property name="host" value="127.0.0.1"/>
	-->
    <property name="port" value="8161"/>
</bean>
```
