# 自定义指令

## 定义指令

局部指令：

向 Vue 配置对象中添加 `directives` 属性即可，类似于计算属性与监视属性，两种写法，调用的时机不同。

```javascript
directives:{
// 指令与元素成功绑定时调用
// 指令所在模板被重新解析时调用
ppg(element,binding){
    element.innerText=binding.value*3
},
fbind:{
    // 当指令与元素成功绑定时调用
    bind(element,binding){
        element.value=binding.value;

    },
    // 指令所在元素被插入页面时调用
    inserted(element,binding){
        element.focus();
    },
    // 指令所在模板被重新解析时调用
    update(element,binding){
        element.value=binding.value;
        element.focus()
    }
}
}
```

## 指令定义对象的钩子函数

- `bind()`：只调用一次，指令第一次绑定到元素时调用，进行初始化设置。
- `inserted()`：被绑定元素插入父节点时调用。
- `update()`：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
- `componentUpdated()`：指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
- `unbind()`：只调用一次，指令与元素解绑时调用。

钩子函数的参数：

- el(element)：指令所绑定的元素，可以用来直接操作 DOM。
- binding：一个对象，包含：
  - `name`：指令名，不包括 `v-` 前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
- `vnode`：Vue 编译生成的虚拟节点。
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

::: warning 注意

除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 [`dataset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 来进行。

- 指令定义没有前缀 `v-`，使用时要加前缀。
- 指令名如果是多个单词，要使用 kebab-case 命名方式，不要用驼峰命名。

:::

## 实例

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
      <h2>n:{{n}}</h2>
      <hr />
      <h2>n*3=<span v-ppg="n"></span></h2>
      <hr />
      <button @click="n++">n++</button>
      <hr />
      <input type="text" v-fbind="n" />
    </div>

    <script>
      Vue.directive('fbing', {
        bind(el, binding, vnode) {},
        inserted(el, binding, vnode) {},
        update(el, binding, vnode, oldVnode) {},
        componentUpdated(el, binding, vnode) {},
        unbind(el, binding, vnode) {},
      });
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            n: 1,
          };
        },
        directives: {
          // 指令与元素成功绑定时调用
          // 指令所在模板被重新解析时调用
          ppg(element, binding) {
            element.innerText = binding.value * 3;
          },
          fbind: {
            // 当指令与元素成功绑定时调用
            bind(element, binding) {
              element.value = binding.value;
            },
            // 指令所在元素被插入页面时调用
            inserted(element, binding) {
              element.focus();
            },
            // 指令所在模板被重新解析时调用
            update(element, binding) {
              element.value = binding.value;
              element.focus();
            },
          },
        },
      });
    </script>
  </body>
</html>
```
