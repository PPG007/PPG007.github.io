# DaemonSet

DaemonSet 确保全部或者某些节点上运行一个 Pod 的副本，当有节点加入集群时，也会为他们新增一个 Pod，当有节点从集群中移除时，这些 Pod 也会被回收，删除 DaemonSet 将会删除它创建的所有 Pod。

::: tip 常见场景：

- 在每个节点上运行集群守护进程。
- 在每个节点上运行日志收集守护进程。
- 在每个节点上运行监控守护进程。

:::

## 搭建 EFK 日志收集系统

[TODO](https://www.qikqiak.com/post/install-efk-stack-on-k8s/).
