# 事件

## 事件处理

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
      <h2>Hello {{name}}</h2>
      <button v-on:click="showInfo($event,123)">点击提示信息</button>
      <button @click="showInfo($event,456)">点击提示信息</button>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'PPG',
          };
        },
        methods: {
          showInfo(event, number) {
            console.log(event);
            console.log(number);
            alert('Hello');
          },
        },
      });
    </script>
  </body>
</html>
```

- 使用 `v-on` 指令绑定事件，可以简写为 `@XXX`，XXX 是事件的名字。
- 事件的毁掉需要配置在 methods 对象中。
- methods 中的函数不要使用箭头函数，否则 this 就不是 Vue 实例了。
- methods 中的函数都是被 Vue 所管理的函数，this 指向是 Vue 实例或组件实例对象。

::: warning 注意
如果事件处理器需要同时接收事件对象和其他对象作参数，为了防止事件对象丢失，要使用 `$event` 进行占位。
:::

## 事件修饰符

> Vue中的事件修饰符：
>
> 1. prevent：阻止默认事件，例如阻止a标签跳转
> 2. stop：阻止事件冒泡，例如div标签和内部的button同时有点击事件，使用stop修饰后，点击按钮只会执行按钮的点击事件
> 3. once：事件只触发一次，点击后在刷新前不能再次点击
> 4. capture：使用事件的捕获模式，捕获后立即执行(事件触发时，先从DOM根开始向下找到点击的元素，期间可能穿过了其他拥有点击事件的上层模块，向下的这个过程称为捕获，到达目标元素后开始向上执行点击事件称为冒泡，默认先执行内部元素的点击事件)
> 5. self：只有event.target是当前操作的元素时才触发事件，也能阻止冒泡
> 6. passive：事件将会被立即执行，默认情况下，先执行点击事件函数，然后才执行事件、
>
> ==修饰符可以连着写(.stop.once)==

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
      .demo1 {
        height: 100px;
        background-color: aqua;
      }
      * {
        margin-top: 20px;
      }
      .box1 {
        padding: 5px;
        background-color: skyblue;
      }
      .box2 {
        padding: 5px;
        background-color: orange;
      }
      .list {
        width: 200px;
        height: 200px;
        background-color: peru;
        overflow: auto;
      }
      li {
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <h2>Hello {{name}}</h2>
      <a href="https://www.baidu.com" @click.prevent="showInfo">What's up</a>

      <div class="demo1" @click="showInfo">
        <button @click.stop="showInfo">点我</button>
      </div>

      <button @click.once="showInfo">点我</button>

      <div class="box1" @click.capture="showMsg(1)">
        div1
        <div class="box2" @click="showMsg(2)">div2</div>
      </div>

      <div class="demo1" @click.self="showInfo">
        <button @click="showInfo">点我</button>
      </div>
      <!-- @wheel鼠标滚轮 -->
      <!-- @scroll滚动条 -->
      <ul class="list" @wheel.passive="demo">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
    </div>
    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'PPG',
          };
        },
        methods: {
          showInfo(event) {
            // event.preventDefault();
            // event.stopPropagation();

            alert('Hello');
          },
          showMsg(msg) {
            console.log(msg);
          },
          demo() {
            for (let index = 0; index < 100000; index++) {
              console.log('#');
            }
            console.log('over');
          },
        },
      });
    </script>
  </body>
</html>
```

## 键盘事件

- Vue中常用按键别名：
  - 回车：enter。
  - 删除：delete，包含删除和退格。
  - 退出：esc。
  - 空格：space。
  - 换行：tab，由于 tab 默认功能是切换焦点，如果绑定的是 keyup 事件，将不会出发，因此应当绑定 keydown 事件。
  - 上：up。
  - 下：down。
  - 左：left。
  - 右：right。

:::tip
Vue 中未提供别名的按键，可以使用按键原始的 key 值(调用 `event.key` 查看按键名，调用 `event.keyCodes` 查看按键编码)，使用按键名时要注意不能使用驼峰命名，而应当使用 xxx-yyy 且全为小写，这与 Vue 修改 CSS 中的修改属性名规则也是相同的。
:::

- 系统修饰键：ctrl、alt、shift、meta(Windows 中的 win 键)：
  - 配合 keyup 使用时，按下修饰键的同时，按下任意其他按键，随后释放其他按键事件才会被触发。
  - 配合 keydown 使用：正常触发。
  - 如果要指定 keyup 时的另一个按键，可以在这四个修饰符后再添加指定的按键，例如：`.ctrl.y` 指定 `ctrl+y` 才触发。
- 可以使用 keyCode 指定具体按键(不推荐，逐渐失去浏览器支持)。
- 可以使用 `Vue.config.KeyCodes.自定义键名=按键编码` 定制按键别名。
- 添加 exact 修饰符，在有且只有操作指定按键时才会触发。

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
      <h2>Hello,{{name}}</h2>
      <input type="text" placeholder="按下回车提示输入" @keyup.ppg="showInfo" />
    </div>

    <script>
      Vue.config.keyCodes.ppg = 13;
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'PPG',
          };
        },
        methods: {
          showInfo(event) {
            // if(event.keyCode!==13) return
            console.log(event.target.value);
          },
        },
      });
    </script>
  </body>
</html>
```

## 鼠标按钮修饰符

鼠标按钮修饰符：

- `.left`：左键。
- `.middle`：滑轮按键。
- `.right`：右键。

```html
<input type="button" name="submit" id="submit" value="提交" @click.middle="submit" />
```
