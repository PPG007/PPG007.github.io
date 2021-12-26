# 请求示例

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
