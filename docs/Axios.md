# [Axios](https://github.com/axios/axios)

## 安装 Axios

```sh
npm install axios
```

在要使用 axios 的文件中：

```js
import axios from 'axios';
```

## 请求示例

首先定义参数：

```js
// 定义参数
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
```

请求方式一，传入配置的形式，可以设置一些[其他参数](https://github.com/axios/axios#request-config)：

```js
axios({
    method:'GET',
    url:'/paramsTest',
    params:{
        param
    }
})
```

请求方式二：

```js
axios.get('/paramsTest', param)
```

::: tip
POST、DELETE 等方法修改成对应的方法或配置即可。
:::

::: warning 注意
使用 GET 请求时，传递的参数只能是 `params`，即配置对象中要使用 `params:{}` 形式而不是 `data` 形式。
使用 POST 请求时，传递的参数既可以是 `params` 也可以是 `data` 形式。
:::

## 一些其他方法

### axios(url[, config])

```js
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
const url='http://localhost/paramsTest';
axios(url,{
    params:{
        param
    }
})
```

### axios.request(config)

默认请求方法为 **GET**。

```js
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
//get方式
axios.request({
    url:url,
    params:{
        param
    }
})
//POST方式
//query参数
axios.request({
    url:url,
    method:'post',
    params:{
        param
    }
})
//body参数
axios.request({
    url:url1,
    method:'post',
    data:{
        param
    }
})
```

### axios.get(url[, config])

```js
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
axios.get(url1,{
    params:{
        param
    }
})
```

### axios.post(url[, data[, config]])

```js
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
//query参数
axios.posr({
    url:url1,
    method:'post',
    params:{
        param
    }
})
//body参数
axios.post({
    url:url1,
    method:'post',
    data:{
        param
    }
})
```

::: warning 注意
无论使用哪种传参方式，都是body传参，只是外层不同，使用 SpringBoot `@RequestBody` 后台收到如下：

```json
{"data":{"param":{"name":"PPG","age":21,"sex":"male"}}}
//或者
{"params":{"param":{"name":"PPG","age":21,"sex":"male"}}}
```

相比非别名方法，增加了一层
:::

## 响应处理

请求正确后的响应对象内容：

```json
{
    data:{},
    status:200,
    statusText:'OK',
    headers:{},
    config:{},
    request:{}
}
```

请求错误后 error 中的内容：

```js
error.response
error.request
error.message
error.config
```

### 不使用拦截器处理

```js
axios.get('/demo', {headers: {'token': "token"}})
    .then((res) => {
        // 请求成功
        console.log(res.data);
    }).catch((err) => {
        // 请求失败
        console.log(err.response.status);
    })
```

## [拦截器](https://github.com/axios/axios#interceptors)

### 请求拦截器

::: tip
use() 方法的两个参数都是函数，要返回参数类型的变量。
:::

```js
axios.interceptors.request.use(
  (config) => {
    // 对请求做配置
    config.headers[UserInfoKeys.TOKENKEY] = sessionStorage.getItem(UserInfoKeys.TOKENKEY);
    return config;
  },
  // 错误处理
  (error) => Promise.reject(error),
);
```

### 响应拦截器

```js
axios.interceptors.response.use(
  // 正常情况下直接返回响应
  (response) => response,
  // 出错后再处理
  (error) => {
    if (error.response === 401) {
      message.warn('请先登录');
    } else {
      message.error('网络错误');
    }
    return Promise.reject(error);
  },
);
```

::: warning 注意
在配置了拦截器后，要将配置过的 axios 导出：

```js
export default axios;
```

:::

## [默认设置](https://github.com/axios/axios#config-defaults)

示例：

```js
axios.default.method="POST"
axios.default.baseURL='http://localhost'
```

## 取消请求

```js
//声明变量
let cancel=null;
//配置项中添加cancelToken
axios({
    url:'http://localhost/delayTest',
    cancelToken:new axios.CancelToken(function(c){
        cancel=c
    })
})
//此时这个变量已经变成函数，调用即可取消请求
cancel()
```

::: tip
一个请求对应一个 cancel 对象，调用对应的 cancel 函数即可取消请求，可以通过 setTimeout 设置超时等。
:::
