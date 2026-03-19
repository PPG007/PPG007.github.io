# 常用 API

## axios(url[, config])

```js
const param = {
  name: 'PPG',
  age: 21,
  sex: 'male',
};
const url = 'http://localhost/paramsTest';
axios(url, {
  params: {
    param,
  },
});
```

[可选配置项](https://github.com/axios/axios#request-config)

::: warning 注意
使用配置对象时：

使用 GET 请求时，传递的参数只能是 `params`，即配置对象中要使用 `params:{}` 形式而不是 `data` 形式。
使用 POST 请求时，传递的参数既可以是 `params` 也可以是 `data`。
:::

## axios.request(config)

默认请求方法为 **GET**。

```js
const param = {
  name: 'PPG',
  age: 21,
  sex: 'male',
};
//get方式
axios.request({
  url: url,
  params: {
    param,
  },
});
//POST方式
//query参数
axios.request({
  url: url,
  method: 'post',
  params: {
    param,
  },
});
//body参数
axios.request({
  url: url1,
  method: 'post',
  data: {
    param,
  },
});
```

## axios.get(url[, config])

```js
const param = {
  name: 'PPG',
  age: 21,
  sex: 'male',
};
axios.get(url1, {
  params: {
    param,
  },
});
```

## axios.post(url[, data[, config]])

```js
const param = {
  name: 'PPG',
  age: 21,
  sex: 'male',
};
// params 配置项
axios.post({
  url: url1,
  method: 'post',
  params: {
    param,
  },
});
// data 配置项
axios.post({
  url: url1,
  method: 'post',
  data: {
    param,
  },
});
```

::: warning 注意
无论使用哪种传参配置项，都是body传参，只是外层不同，使用 SpringBoot `@RequestBody` 后台收到如下：

```json
{"data":{"param":{"name":"PPG","age":21,"sex":"male"}}}
//或者
{"params":{"param":{"name":"PPG","age":21,"sex":"male"}}}
```

相比非别名方法，增加了一层
:::

## axios.delete(url[, config])

与 `axios.get(url[, config])` 类似。

## axios.head(url[, config])

与 `axios.get(url[, config])` 类似。

## axios.options(url[, config])

与 `axios.get(url[, config])` 类似。

## axios.put(url[, data[, config]])

与 `axios.post(url[, data[, config]])` 类似。

## axios.patch(url[, data[, config]])

与 `axios.post(url[, data[, config]])` 类似。
