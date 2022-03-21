# 在现有电脑上通过 VMware 搭建软路由（旁路由）

网络拓扑图：

![network](/openwrt/network.png)

![assets](/openwrt/assets.png)

下载上面的第五个 .vmdk 文件，然后按照下面的选择在 VMware 中创建虚拟机：

![step1](/openwrt/step1.png)
![step2](/openwrt/step2.png)
![step3](/openwrt/step3.png)
![step4](/openwrt/step4.png)

为虚拟机起个名字并选择位置：

![step5](/openwrt/step5.png)

根据情况分配 CPU：

![step6](/openwrt/step6.png)

根据情况分配内存，1 GB 就够了：

![step7](/openwrt/step7.png)

这里选什么都无所谓，稍后会再做修改：

![step8](/openwrt/step8.png)
![step9](/openwrt/step9.png)
![step10](/openwrt/step10.png)
![step11](/openwrt/step11.png)

这个就是选择刚刚下载下来的 .vmdk 文件：

![step12](/openwrt/step12.png)

保持现有格式。

![step13](/openwrt/step13.png)

创建完成后先修改虚拟网络：

![step14](/openwrt/step14.png)

添加网络，设置为桥接模式，桥接到网卡上，这里使用的笔记本有无线网卡和有线网卡，这里选择有线网卡。

![step15](/openwrt/step15.png)

然后在刚刚创建的虚拟机中编辑虚拟机设置，网络连接改为自定义，使用刚刚创建的桥接网络：

![step16](/openwrt/step16.png)

启动虚拟机，后续操作与[单网口旧电脑搭建软路由](./singleEth.md)一致，最后修改宿主机的默认网关及 DNS 为给这个虚拟机设置的 LAN 口的 IP 即可。
