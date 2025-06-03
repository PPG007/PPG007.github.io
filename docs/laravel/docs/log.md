# 日志

Laravel 日志记录是基于 channel 的，每个 channel 代表一种写入日志的方式，例如 `single` 将日志写入到单个文件中，日志消息可能会根据严重程度写入到多个 channel 中。

## 配置

TODO:

## 记录日志

### 设置上下文

使用 `withContext` 方法可以设置上下文，例如在 First 中间件中设置 requestId：

```php
Log::withContext([
    'reqId' => $reqId,
]);
```

### 设置共享上下文

如果想在所有的 channel 中共享上下文，可以使用 `shareContext` 方法：

```php
Log::shareContext([
    'reqId' => $reqId,
]);
```

然后调用处可以指定某个 channel：

```php
public function report()
{
    Log::channel('stderr')->warning('demo');
}
```
