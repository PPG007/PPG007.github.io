---
prev:
  text: 首页
  link: /openwrt
---

# 单网口旧电脑搭建软路由（旁路由）

网络拓扑图：

![network](/openwrt/network.png)

首先制作一个 Windows PE 启动盘，这里使用[老毛桃](https://www.laomaotao.net/)。

OpenWrt 固件有很多，这里我们使用[骷髅头固件](https://github.com/DHDAXCW/FusionWRT_x86_x64)，当然你也可以在 OpenWrt 官方网站找到适配不同硬件平台的[固件](https://downloads.openwrt.org/releases/)。

骷髅头固件的 Releases 中有很多版本，根据需求选择即可。

![Releases](/openwrt/releases.png)

这里我们选择正式版。

![assets](/openwrt/assets.png)

下载上图中的第四个 .img.gz 文件，下载到本地后进行解压获得一个 .img 文件。

启动盘制作完成后将下载下的 .img 镜像文件以及[镜像写入工具](https://drive.google.com/file/d/1D9G9bga-XBiVH_0SMbDzKaR6IDXNuHAL/view?usp=sharing)一起拷贝到启动盘的根目录。

设置电脑 BIOS 从 U 盘启动，进入老毛桃 PE 系统，首先打开桌面上的 DiskGenius 找到电脑的硬盘，右键点击后选择删除所有分区。由于下载的镜像是 UEFI 引导的，所以还需要选择转化分区表为 GUID 格式，如果这个选项不能选说明已经是 GUID 格式了，完成后点击左上角保存更改退出。

然后打开此电脑，进入 U 盘，双击运行镜像写入工具，选中电脑的硬盘，一般是 Physic0，然后下面的镜像选择我们拷贝到 U 盘中的 .img 文件，点击开始进行写入，写入完成后重启电脑，拔出 U 盘，正常启动即可。

寻找一根网线将这台旧电脑和一台现有的能用的电脑连接，修改电脑的 IP 为 192.168.2.2，默认网关及 DNS 为 192.168.2.1，打开浏览器，访问 192.168.2.1，用户名 root，密码 password 进入系统，首先进入网络-接口选项，如果接口中没有 WAN 口，那么点击添加接口，设置协议为 DHCP 客户端（因为我们是做旁路由，主路由拨号及 DHCP），点击提交，再点击保存应用。

![createWan](/openwrt/createWan.png)

接下来修改 LAN 口配置，协议选择静态地址，修改 IPv4 地址为你的主路由器的网段下的一个不冲突的 IP，例如主路由为 192.168.3.1，那么这里可以修改为 192.168.3.5，然后 IPv4 网关和使用自定义的 DNS 服务器都填入路由器的 IP，IPv6 分配长度选择禁用，物理设置中**不要**勾选桥接接口，然后基本设置中选中忽略此接口，IPv6 设置也全部禁用，最后保存应用即可（这个时候由于经过修改两台电脑可能已经不在同一个网段了，所以会看不到修改成功提示，稍等一会即可断开连接），然后将两个电脑断开，都连接到主路由器上，之前修改 IP 的电脑重新修改为自动获取 IP 地址及 DNS，然后访问刚刚为 LAN 口设置的 IP 即可进入系统，之后进行设置即可。然后在希望使用此电脑做路由的设备中将网络设置为手动 IP，默认网关及 DNS 都选择刚刚为 LAN 口设置的静态 IP，此时即可通过此路由上网。

![LanSetting1](/openwrt/lanSetting1.png)
![LanSetting2](/openwrt/lanSetting2.png)
![LanSetting3](/openwrt/lanSetting3.png)
![LanSetting4](/openwrt/lanSetting4.png)
