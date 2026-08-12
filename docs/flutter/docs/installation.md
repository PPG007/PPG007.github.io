---
prev:
  text: 首页
  link: /flutter
---
# [安装 Flutter](https://docs.flutter.dev/get-started/install)

前置：[安装 Dart](../../dart/docs/start.md)。

## Ubuntu 20.04

首先使用 snap 安装：

```shell
sudo snap install flutter --classic
```

安装完成后执行：

```shell
flutter sdk-path
```

等待一段时间后，执行下面的命令检查各项环境：

```shell
flutter doctor
```

一般来说可能会出现安卓 SDK 的报错，可以使用 Android Studio 中的 SDK Manager 解决，此外还需要安装 Android SDK Command-line Tools，之后再使用上面的命令应该就不会出现 Android SDK 的问题了。

开启 Linux 桌面的支持：

```shell
# 安装依赖
sudo apt-get install clang cmake ninja-build pkg-config libgtk-3-dev liblzma-dev

flutter config --enable-linux-desktop
```

::: tip
执行 `flutter doctor` 时可能会出现连接到 maven.google.com 超时的问题，可以通过开启代理并且设置下面的环境变量解决：

```shell
export ALL_PROXY=socks5://127.0.0.1:10808
export HTTP_PROXY=http://127.0.0.1:10809
export HTTPS_PROXY=http://127.0.0.1:10809
export NO_PROXY=localhost,127.0.0.1,::1
```

:::
