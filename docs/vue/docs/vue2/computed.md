# 计算属性

::: danger 注意
methods 和 computed 中方法不要**重名**。
:::

::: tip
methods 中定义的是方法，调用时要加括号，而且每次调用返回值是重新计算的。

computed 中定义的是属性，调用时不加括号，每次调用返回值不会重新计算，除非它所依赖的内容发生改变。

计算属性相当于**缓存**。
:::

## 计算属性示例

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
      姓:<input type="text" v-model:value="firstName" />
      <hr />
      名:<input type="text" v-model:value="lastName" />
      <hr />
      <span>姓名：{{name}}</span>
      <hr />
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            firstName: '',
            lastName: '',
          };
        },
        computed: {
          name: {
            // 初次读取
            // 所依赖的数据发生变化
            get() {
              // 此处this是vm
              return this.firstName + '-' + this.lastName;
            },
            //可以不写set方法，如果不写set方法，将不能修改对应的属性
          },
        },
      });
    </script>
  </body>
</html>
```

### get 方法调用时机

- 初次读取时会执行一次。
- 当依赖的数据发生改变时会被再次调用。

计算属性原理：

与数据代理类似，借助 getter、setter 实现。

::: tip
计算属性最终会出现在 Vue 实例上，可以直接调用。
:::

## 计算属性简写

```javascript
const vm = new Vue({
  el: '#root',
  data() {
    return {
      firstName: '',
      lastName: '',
    };
  },
  computed: {
    name() {
      //相当于getter
      return this.firstName + '-' + this.lastName;
    },
  },
});
```

::: danger 警告
一个计算属性中不能操作自己，包括调用和赋值，会无限递归出错。
:::
