# 一些其他方法

## axios(url[, config])

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

## axios.request(config)

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

## axios.get(url[, config])

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

## axios.post(url[, data[, config]])

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
