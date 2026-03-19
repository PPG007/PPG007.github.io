# 内置指令

## v-text

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
      <h2>{{name}}</h2>
      <h2 v-text="name"></h2>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'PPG',
          };
        },
      });
    </script>
  </body>
</html>
```

`v-text` 指令：

- 作用：向其所在节点渲染文本内容。
- 与插值语法的区别：`v-text` 会替换掉节点中的内容，插值语法不会。

## v-html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
      button {
        border-radius: 10px;
        background-color: skyblue;
      }
      button:hover {
        border-radius: 10px;
        background-color: red;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div v-html="str"></div>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            str: '<button>按钮</button>',
          };
        },
      });
    </script>
  </body>
</html>
```

`v-html` 指令：

- 作用：向指定节点渲染包含 HTML 结构的内容。
- 与插值语法的区别：
  - `v-html` 会替换掉节点中所有的内容，插值语法则不会。
  - `v-html` 可以识别 HTML 结构。
- `v-html`存在安全问题：
  - 在网站上动态渲染任意 HTML 是非常危险的，容易导致 XSS 攻击。
  - 一定要在可信的内容上使用 `v-html`，永远不要用在用户提交的内容上。

## v-cloak 指令

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
      [v-cloak] {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <h2 v-cloak>{{name}}</h2>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'PPG',
          };
        },
      });
    </script>
  </body>
</html>
```

通过 `v-cloak` 和 CSS 属性选择器配合，防止在网速过慢短时间内无法加载 Vue 时出现插值语法模板显示在页面上的情况。

`v-cloak` 本质是一个特殊属性，Vue 实例创建完毕并接管容器后，会删掉 `v-cloak` 属性

## v-once

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
      [v-cloak] {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <h2 v-once>n的初值为：{{n}}</h2>
      <h2 v-cloak>n:{{n}}</h2>
      <button @click="n++">点我n+1</button>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            n: 1,
          };
        },
      });
    </script>
  </body>
</html>
```

`v-once` 指令:

- `v-once` 所在节点在初次动态渲染后，就视为静态内容了。
- 以后数据的改变不会引起 `v-once` 所在结构的更新，可以用于优化性能。

## v-pre 指令

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
      [v-cloak] {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <h2 v-pre>李在干神魔</h2>
      <h2>n:{{n}}</h2>
      <button @click="n++">点我n+1</button>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            n: 1,
          };
        },
      });
    </script>
  </body>
</html>
```

`v-pre` 指令:

- 跳过其所在节点的编译过程。
- 可利用它跳过没有使用指令语法、没有使用插值语法的节点，会加快编译。
