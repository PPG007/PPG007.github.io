---
prev:
  text: 首页
  link: /dart
---

# 起步

## 安装 Dart

```shell
sudo apt-get update
sudo apt-get install apt-transport-https
sudo sh -c 'wget -qO- https://dl.google.com/linux/linux_signing_key.pub | apt-key add -'
sudo sh -c 'wget -qO- https://storage.googleapis.com/download.dartlang.org/linux/debian/dart_stable.list > /etc/apt/sources.list.d/dart_stable.list'
sudo apt-get update
sudo apt-get install dart
```

使用 Visual Studio Code 安装 Dart 插件即可。

## 一个简单地 Dart 程序

创建 hello.dart：

```dart
void hello(String name) {
  print("Hello $name");
}

void main(List<String> args) {
  var name = "PPG007";
  hello(name);
}
```
