# 条件渲染

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
      <h2 v-show="flag">欢迎{{name}}</h2>
      <h2 v-if="flag">欢迎{{name}}</h2>

      <h2>当前n的值为：{{n}}</h2>
      <button v-on:click="n++">点我</button>
      <div v-if="n===1">C</div>
      <div v-else-if="n==2">C++</div>
      <div v-else>JAVA</div>

      <!--template只能使用v-if不能使用v-show，template不影响页面的结构，即template不会出现在渲染后的页面中而把内部元素直接暴露出来-->
      <template v-if="n===3">
        <h2>A</h2>
        <h2>B</h2>
        <h2>C</h2>
      </template>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'PPG',
            flag: true,
            n: 0,
          };
        },
      });
    </script>
  </body>
</html>
```

- v-if：

  写法：

  - `v-if='表达式'`。
  - `v-else-if='表达式'`。
  - `v-else`。

  适用于切换频率较低的场景。

  特点：不展示的 DOM 元素直接被移除。

::: warning 注意
`v-if` 可以和 `v-else-if`、`v-else` 组合使用，但是其中结构不能被打断。
:::

- v-show：

  写法：

  `v-show='表达式'`。

  适用于切换频率较高的场景。

  特点：不显示的 DOM 元素没有被移除，只是设置了 `display: none`。

::: tip
使用 `v-if` 时，元素可能无法获取到，但使用 `v-show` 一定可以
:::
