# Google Protobuf Style Guide

::: tip

当对旧项目中的文件进行修改时，应当遵循之前的规范，保持一致。

:::

## 标准文件格式

- 每行长度不超过 80 个字符。
- 缩进使用两个空格。
- 对于字符串使用双引号。

## 文件结构

文件名应该是下划线命名，例如：user_request.proto。

所有的文件中的内容都应当按照如下顺序组织：

- License。
- 文件摘要。
- proto 版本。
- 包信息。
- 引入的其他 proto 文件，按照名称进行排序。
- options。
- 其他。

## 包信息

包名应当是都是小写，并且包名应当根据项目名称以及包含 protobuf 定义的文件的路径确定唯一的名字。

## Message 和字段名

- message 名称应该使用大驼峰命名。
- 字段名，包含 one of 字段和 extension 都应当使用下划线分割小写命名。
- 如果字段名包含数字，这个数字应该紧跟最后一个字母而不是再起一个下划线，例如应当命名为 `song_name1` 而不是 `song_name_1`。

## repeated 字段

repeated 字段名应当是名词复数。

## 枚举

枚举名应当是大驼峰命名，枚举字段的命名应该采用下划线分割大写：

```protobuf
enum FooBar {
  FOO_BAR_UNSPECIFIED = 0;
  FOO_BAR_FIRST_VALUE = 1;
  FOO_BAR_SECOND_VALUE = 2;
}
```

枚举值之间应该使用分号而不是逗号，一个枚举中的枚举值应该具有一致的前缀，并且对于枚举零值，应当添加 `UNSPECIFIED` 后缀。

## RPC

在 proto 文件中定义的 RPC 服务的名称以及方法名称均应该使用大驼峰。
