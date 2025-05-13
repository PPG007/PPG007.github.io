# el 与 data 的两种写法

- el 有两种写法：
  - 创建 Vue 实例时指定 el。
  - 先创建 Vue 实例，通过 `Vue实例.$mount('#root')` 进行挂载指定 el。
- data 有两种写法：
  - 对象式。
  - 函数式。
  - 对象式函数式共存的时候，只有函数式才会生效。

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
      <h1>Hello,{{name}}</h1>
    </div>

    <script>
      const vm = new Vue({
        // el:'#root',
        // data:{
        //     name:'PPG007'
        // }
        data() {
          return {
            name: 'PPG007',
          };
        },
      });
      vm.$mount('#root');
    </script>
  </body>
</html>
```
