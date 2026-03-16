# Vue 脚手架配置代理

## 方式一

在 `vue.config.js` 中添加如下配置：

```js
'use strict';
module.exports = {
  devServer: {
    //将请求代理到localhost的80端口
    proxy: 'http://localhost',
    //前端服务器端口号设置为90
    port: 90,
  },
};
```

- 优点：配置简单，请求资源时直接发送给前端即可。
- 缺点：不能配置多个代理，不能灵活的控制请求是否走代理。
- 工作方式：当请求的资源在 public 夹(即前端服务器根目录)中找不到时，向代理目标发送请求。

## 方式二

在 `vue.config.js` 中添加如下配置：

```js
'use strict';
module.exports = {
  devServer: {
    port: 90,
    proxy: {
      //设置请求前缀，请求端口号后紧跟这个前缀才会被这条规则转发
      '/api': {
        //设置目标服务器
        target: 'http://localhost',
        //由于请求时要加前缀而服务器真实路径没有前缀，所以要去掉前缀
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
```

- 优点：可以配置多个代理，且可以灵活的控制请求是否走代理。
- 缺点：配置略繁琐，请求资源必须加前缀。

## 进行请求

路径要变为请求代理服务器地址而不是被代理服务器：

```js
axios.get('http://localhost:90/api/getAllStudents').then(
  response => {
    console.log(response.data);
  },
  error => {
    console.log(error.message);
  }
);
```
