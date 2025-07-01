---
prev:
  text: 首页
  link: /vue2
---

# 第一个 Vue 程序

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
  </head>
  <body>
    <div id="root">
      Hello World {{name}}
      <hr />
      <a :href="url">点击前往主页</a>
      <p>{{url.toUpperCase()}}</p>
    </div>

    <script>
      //关闭生产模式提醒(Vue全局配置)
      Vue.config.productionTip = false;
      //一对一
      const vm = new Vue({
        el: '#root', //el指定当前Vue实例为那个容器服务
        data: {
          //存储数据供el绑定的容器使用
          name: 'ppg',
          age: 21,
          url: 'http://www.fenchingking.top',
        },
      });
    </script>
  </body>
</html>
```

::: tip 初识 Vue：

- 想让 Vue 工作，必须创建一个 Vue 实例，且要传入一个配置对象。
- 容器(被绑定的 HTML 代码块)仍然符合 HTML 规范，混入了 Vue 语法。
- Vue 实例和容器只能是一对一的。
- 实际开发中只会有一个 Vue 实例，并且会配合组件一起使用。
- 双大括号中要写 JavaScript 表达式，例如下面的代码会显示 2：

  ```vue
  {{ 1 + 1 }}
  ```

- 一旦 data 中内容发生改变，容器中对应的位置也会改变。

:::

## 模板指令

Vue 模板有两大类语法：

- 插值语法：
  - 功能：用于解析标签体内容。
  - 写法：{{xxx}}，xxx 是 JavaScript 表达式，且可以获取 data 中的所有属性。
- 指令语法：
  - 功能：用于解析标签(标签属性、标签体内容、绑定事件)。
  - 举例：`v-bind:href='xxx'` 或简写(仅有 `v-bind` 指令可以)为 `:href='xxx'`，xxx 同样是 JavaScript 表达式。
  - Vue 中有很多指令，形式都是 `v-xxx`。
