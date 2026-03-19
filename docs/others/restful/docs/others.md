# 其他

不要信任客户端的 ID 或者其他信息，这些信息应该由服务端从 token 中提取出来。

请求和响应都应该设置 Content-Type 为 `application/json`。

如果要在请求和响应中包含时间，应该使用 ISO 8601 或者 RFC 3339 标准。

DELETE 请求也要满足幂等性。
