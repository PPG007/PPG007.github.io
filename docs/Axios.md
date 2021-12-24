# 配置项大全：

```json
{
   // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

   // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,

   // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

 // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

   // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

   // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

   // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

   // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指定用于取消请求的 cancel token
  // （查看后面的 Cancellation 这节了解更多）
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

# axios注意事项

使用GET请求时，传递的参数只能是`params`，即配置对象中要使用`params:{}`形式而不是`data`形式

使用POST请求时，传递的参数既可以是`params`也可以是`data`形式



# axios(config)

传入一个配置对象创建请求

创建一个带参GET请求

```js
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
axios({
    method:'GET',
    url:'http://localhost/paramsTest',
    params:{
        param
    }
})
```

创建一个带参POST请求

参数放在Body中：

```js
axios({
    method:'POST',
    url:'http://localhost/paramsTest',
    data:{
        param
    }
})
```

SpringBoot使用RequestBody接收到：

```json
{"param":{"name":"PPG","age":21,"sex":"male"}}
```

参数放在query中

```js
axios({
    method:'POST',
    url:'http://localhost/paramsTest',
    params:{
        param
    }
})
```

SpringBoot使用RequestParam接收到：(若使用GET方式请求，只要使用了query传参接收时就会脱掉外层键)

```json
{"name":"PPG","age":21,"sex":"male"}
```

# axios(url[, config])

创建带参GET请求

```js
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
const url1='http://localhost/paramsTest';
axios(url1,{
    params:{
        param
    }
})
```

创建带参POST请求

参数放在Body中：

```js
const url2='http://localhost/bodyTest'
axios(url2,{
    method:'POST',
    data:{
        param
    }
})
```

参数放在query中

```js
const url1='http://localhost/paramsTest'
axios(url1,{
    method:'POST',
    params:{
        param
    }
})
```

# 方法的别名

### axios.request(config)

默认==GET== 方式

```js
const param={
    name:'PPG',
    age:21,
    sex:'male'
}
//get方式
axios.request({
    url:url1,
    params:{
        param
    }
})
//POST方式
//query参数
axios.request({
    url:url1,
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

无论使用哪种传参方式，都是body传参，只是外层不同，后台收到如下：

```json
{"data":{"param":{"name":"PPG","age":21,"sex":"male"}}}
//或者
{"params":{"param":{"name":"PPG","age":21,"sex":"male"}}}
```

相比非别名方法，增加了一层

# 响应结构

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

返回结果是Promise形式

```js
axios.post(url2,{
    params:{
        param
    }
}).then((res)=>{
    console.log(res)
})
```

# 错误处理

使用catch处理错误

```js
axios.request('http://localhost/errorTest',{
    params:{
        param
    }
}).then((res)=>{
    console.log(res)
}).catch((error)=>{
    console.log(error.response)
    console.log(error.request);
    console.log(error.message);
    console.log(error.config);
})
```

# 默认设置

```js
axios.default.method="POST"
axios.default.baseURL='http://localhost'
```

# 取消请求

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

> 一个请求对应一个cancel对象，调用对应的cancel函数即可取消请求

# 使用流程

1. 创建实例

```js
//首先我们来创建一个Axios实例

var axiosIns = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-product': 'h5'}
});


```

2. 设置拦截器

在请求或响应被 `then` 或 `catch` 处理前拦截它们

```js
//设置request拦截器
axiosIns.interceptors.request.use((config) => {
    //在这里处理request，可以修改config
    console.log('request拦截器生效')
    return config
})

//设置response拦截器
axiosIns.interceptors.response.use((response) => {
    //在这里处理response
    console.log('response拦截器生效')
    return response
},(error)=>{
    return Promise.reject(error)
});
```

3. 发送请求并处理结果

```js
axiosIns({
    url:'/errorTest',
    method:'POST',
    data:{
        param
    }
}).then((res)=>{
    console.log(res)
}).catch((error)=>{
    console.log(error.response)
    console.log(error.request);
    console.log(error.message);
    console.log(error.config);
})
```

