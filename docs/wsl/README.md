# [WSL](https://docs.microsoft.com/zh-cn/windows/wsl/)

- BIOS 要开启虚拟化支持。
- VsCode 中 Go 插件安装到 wsl 中之后，需要设置 GOROOT 和 GOPATH 才能执行 GO:Install/Update Tools。
- wsl 不支持 systemd，开启关闭服务可以用 service docker start/stop/restart/status。
