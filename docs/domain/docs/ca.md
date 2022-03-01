# CA 认证

这里只涉及免费获取 CA 证书。

可以访问[Let's Encrypt](https://letsencrypt.org/)按照文档一步一步完成获取 CA 证书，此文档有中文版本，因此就不在详细介绍了。

除此之外，还可以使用 acme.sh 自动化脚本实现获取 CA 证书。

## [acme.sh](https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E)

::: tip
建议使用 root 用户执行下面的所有操作
:::

首先安装 acme.sh。

```shell
curl  https://get.acme.sh | sh -s email=my@example.com
```

如果 80 端口为空：

```shell
acme.sh --issue -d example.com --standalone -k ec-256 --force
```

安装证书：

```shell
acme.sh --installcert -d example.com --fullchainpath /examplePath/fullchain.crt --keypath /data/example.com/example.com.key --ecc --force
```
