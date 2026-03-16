# 监视属性

## 基本用法

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
      <h2>今天天气很{{info}}</h2>
      <hr />
      <button @click="change">切换天气</button>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            isHot: true,
          };
        },
        computed: {
          info() {
            return this.isHot ? '炎热' : '寒冷';
          },
        },
        methods: {
          change() {
            this.isHot = !this.isHot;
          },
        },
        watch: {
          isHot: {
            immediate: false, //设为true时，初始化时就调用
            handler(newValue, oldValue) {
              console.log('旧值：' + oldValue);
              console.log('新值：' + newValue);
            },
          },
        },
      });
      //监视属性的第二种写法
      // vm.$watch('isHot',{
      //         handler(newValue,oldValue){
      //         console.log("旧值："+oldValue)
      //         console.log("新值："+newValue)
      //     }
      // })
    </script>
  </body>
</html>
```

::: warning 注意
handler 方法中第一个参数是新值，第二个是旧值，不可交换顺序。
:::

监视属性 watch：

- 当被监视的属性发生变化时，回调函数自动调用。
- 监视的属性必须存在。
- 监视的两种写法：
  - 创建 Vue 实例时传入 watch 配置。
  - 通过 `vm.$watch` 监视，第一个参数是要监视的属性名，**要使用引号包裹**，第二个参数与第一种写法一致。

## 深度监视

现在有如下 HTML 代码：

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
      <h2>今天天气很{{info}}</h2>
      <hr />
      <button @click="change">切换天气</button>
      <hr />
      <h2>a:{{numbers.a}}</h2>
      <button @click="numbers.a++">点我加一</button>
      <hr />
      <h2>b:{{numbers.b}}</h2>
      <button @click="numbers.b++">点我加一</button>
    </div>
  </body>
</html>
```

如果要只监视 a 的变化：

```javascript
// 监视多级结构中某个属性的变化
//这里必须加引号，平时不加是因为简写，但是多层次不连续的属性名不能简写
'numbers.a':{
    handler(newValue,oldValue){
        console.log("旧值："+oldValue)
        console.log("新值："+newValue)
    }
},
```

如果要能够监视 numbers 中任意值的变化：

```js
numbers:{
    //开启深度监视
    deep:true,
    handler(newValue,oldValue){
        console.log("旧值："+oldValue)
        console.log("新值："+newValue)
    }
}
```

深度监视：

- Vue 中 watch 默认不监视对象的内部值的变化。
- 配置 deep 属性为 true 可以监测对象内部值的变化。
- Vue 自身可以监测对象内部值的改变，但 Vue 提供的 watch 默认不可以。
- 使用 watch 时根据数据的具体结构决定是否采用深度监视。

## 监视的简写形式

简写时，只有 handler 中的内容，不能配置其他参数：

```javascript
watch:{
    isHot(newValue,oldValue){
        console.log("旧值："+oldValue)
        console.log("新值："+newValue)
    }
}
//或者
vm.$watch('isHot',function(newValue,oldValue){
    console.log("旧值："+oldValue)
    console.log("新值："+newValue)
})
```

## 计算属性与监视属性的区别与联系

区别：

- 计算属性能完成的，监视属性一定也能完成。
- 监视属性能完成的，计算属性不一定能完成，例如异步操作。

::: tip
除非必须要使用监视属性，否则能够使用计算属性完成的就不要使用监视属性，监视属性会监视被监视对象的所有内容，包括不会影响结果的值的内容，计算属性只有影响结果的数据发生变化才会重新计算，性能更好。
:::

两个原则：

- 所有被 Vue 管理的函数，最好写成普通函数，这样 this 的指向才是 Vue 实例或组件的实例对象。
- 所有不被 Vue 锁管理的函数(定时器回调函数，ajax 回调函数)，最好写成箭头函数，这样其中的 this 的指向才是 Vue 实例或者组件实例对象。
