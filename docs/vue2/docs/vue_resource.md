# vue-resource

## 安装 vue-resource

```sh
npm install vue-resource
```

## 使用 vue-resource

注册插件：

```js
Vue.use(vueResource);
```

发起请求：

```js
this.$http.get('http://localhost:90/api/getAllStudents').then(
  response => {
    console.log(response.data);
  },
  error => {
    console.log(error.message);
  }
);
```

vue-resource 与 [Axios](https://github.com/axios/axios) 使用方法基本一致，发送请求要通过 `$http` 对象完成，但是 vue-resource 维护频率低，推荐使用 Axios。
