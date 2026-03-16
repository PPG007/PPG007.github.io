# 绑定 class 与 style

## 绑定 class 样式

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>

    <style>
      .basic {
        height: 100px;
        width: 500px;
        border: 2px;
        border-color: black;
        border-style: solid;
      }
      .a {
        background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
      }
      .b {
        background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
      }
      .c {
        background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
      }
      .font1 {
        font-size: 30px;
        background-color: skyblue;
      }
      .font2 {
        font-size: 50px;
        text-shadow: 10px 10px 10px;
        background-color: skyblue;
      }
      .font3 {
        font-size: 50px;
        background-color: skyblue;
        border-radius: 20px;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div @click="changeStyle" :class="color" class="basic">{{name}}</div>
      <hr />
      <div :class="classes" class="basic">{{name}}</div>

      <hr />
      <div :class="classesObj" class="basic">{{name}}</div>
    </div>

    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'PPG',
            color: '',
            classes: ['font1', 'font2', 'font3'],
            classesObj: {
              // 默认都是false
              font1: false,
              font2: true,
              font3: true,
            },
          };
        },
        methods: {
          changeStyle() {
            const arr = ['a', 'b', 'c'];
            this.color = arr[Math.floor(Math.random() * 3)];
          },
        },
      });
    </script>
  </body>
</html>
```

三种写法总结：

- 字符串写法：适用于样式的类名不确定，需要动态指定。
- 数组写法：适用于要绑定的样式个数不确定，名字也不确定。
- 对象写法：适用于要绑定的样式个数确定，名字也确定，但要动态决定用不用。

## 绑定 style 样式

```html
<div class="basic" v-bind:style="styleObj">{{name}}</div>
<div class="basic" v-bind:style="[styleObj,styleObj2]">{{name}}</div>

<script>
  const vm = new Vue({
    el: '#root',
    data() {
      return {
        name: 'PPG',
        styleObj: {
          //必须使用驼峰命名
          backgroundImage: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
        },
        styleObj2: {
          //必须使用驼峰命名
          fontSize: '100px',
        },
      };
    },
  });
</script>
```

与绑定 class 样式类似，即可以使用字符串写法，也可以使用数组写法，但是要注意：

- 写在 Vue 中的属性名必须采用*驼峰命名*。
- 属性值要使用引号。
