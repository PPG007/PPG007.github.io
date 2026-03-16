# 数据绑定

Vue 中有两种数据绑定方式：

- 单向绑定(`v-bind`)：数据只能从 data 流向页面。
- 双向绑定(`v-model`)：数据既能从 data 流向页面，也能从页面流向 data。

::: tip

- 双向绑定一般应用在表单类元素上。
- `v-model:value` 可以简写成 `v-model`，因为 `v-model` 默认收集的就是 value 的值。

:::

## 单向绑定 v-bind

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
      单向数据绑定:<input type="text" v-bind:value="name" />
      <hr />
      双向数据绑定:<input type="text" v-model:value="name" />
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data: {
          name: 'ppg',
        },
      });
    </script>
  </body>
</html>
```

## 双向绑定 v-model

::: tip
双向数据绑定：

当数据发生变化，视图也发生变化，当视图发生变化，数据也会跟着变化。
:::

::: warning 注意
`v-model` 只能用于绑定*表单类元素*
:::

绑定 input：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>demo</title>
    <script src="./vue.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id="demo"><input type="text" name="text" id="text" value="" v-model="text" />{{text}}</div>
    <script type="text/javascript">
      let vm = new Vue({
        el: '#demo',
        data: {
          text: '',
        },
      });
    </script>
  </body>
</html>
```

绑定单选框：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>demo</title>
    <script src="./vue.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id="demo">
      <input type="radio" name="radio" id="radio1" value="A" v-model="choice" />A
      <input type="radio" name="radio" id="radio2" value="B" v-model="choice" />B
      <p>你选择了：{{choice}}</p>
    </div>
    <script type="text/javascript">
      let vm = new Vue({
        el: '#demo',
        data: {
          choice: '',
        },
      });
    </script>
  </body>
</html>
```

绑定多个多选框：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>demo</title>
    <script src="./vue.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id="demo">
      <input type="checkbox" name="" id="c1" value="A" v-model="choices" />A
      <input type="checkbox" name="" id="c2" value="B" v-model="choices" />B
      <input type="checkbox" name="" id="c3" value="C" v-model="choices" />C
      <input type="checkbox" name="" id="c4" value="D" v-model="choices" />D
      <li v-for="choice in choices">{{choice}}</li>
    </div>
    <script type="text/javascript">
      let vm = new Vue({
        el: '#demo',
        data: {
          choices: [],
        },
      });
    </script>
  </body>
</html>
```

绑定 select：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>demo</title>
    <script src="./vue.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id="demo">
      <select v-model="choice">
        <option value="" disabled>请选择</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <p>你选择了：{{choice}}</p>
    </div>
    <script type="text/javascript">
      let vm = new Vue({
        el: '#demo',
        data: {
          choice: '123',
        },
      });
    </script>
  </body>
</html>
```

::: warning 注意：
如果 `v-model` 表达式的初始值未能匹配任何选项，select 元素将被渲染为未选中状态。
:::

### v-model 修饰符

- `.lazy`：

  ::: tip
  在默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步 (除了输入法组织文字时)。你可以添加 `lazy` 修饰符，从而转为在 `change` 事件（失去焦点）之后进行同步。
  :::

  ```html
  <!-- 在“change”时而非“input”时更新 -->
  <input v-model.lazy="msg" />
  ```

- `.number`：

  ::: tip
  如果想自动将用户的输入值转为数值类型，可以给 `v-model` 添加 `number` 修饰符。
  :::

  ```html
  <input v-model.number="age" type="number" />
  ```

- `.trim`：

  ::: tip
  如果要自动过滤用户输入的首尾空白字符，可以给 `v-model` 添加 `trim` 修饰符。
  :::

  ```html
  <input v-model.trim="msg" />
  ```

### 收集表单数据总结

- 如果表单是 text，则 `v-model` 绑定的就是 value 值，value 值就是用户输入的值。
- 如果表单是 radio，则 `v-model` 绑定的就是 value 值，要给标签配置 value 属性。
- 如果是多选框：
  - 没有配置 input 的 value 属性，那么 v-model 绑定的是 checked，是布尔值。
  - 配置了 value 属性：
    - 绑定的数据类型不是数组，那么收集的是 checked。
    - 如果是数组，那么收集的就是每个 CheckBox 的 value。
