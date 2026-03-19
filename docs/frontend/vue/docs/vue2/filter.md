# 过滤器

通过管道符 `|` 使用：

- `v-bind` 和插值语法可以使用过滤器。
- `v-model` 不可以使用过滤器。
- 多个过滤器可以串联。
- 过滤器并没有修改源数据。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/dayjs.min.js"></script>
  </head>
  <body>
    <div id="root">
      <h2>Time</h2>
      <!-- 计算属性实现 -->
      <h2>{{fmtTime}}</h2>
      <!-- methods实现 -->
      <h2>{{getFormatTime()}}</h2>
      <!-- 过滤器实现 -->
      <h2>{{time|timeFormater('YYYY年MM月DD日')}}</h2>
      <h2>{{time|timeFormater('YYYY年MM月DD日')|mySlice}}</h2>
    </div>
    <script>
      Vue.filter('mySlice', function (val) {
        return val.slice(0, 4);
      });
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            time: 1627296335622,
          };
        },
        computed: {
          fmtTime() {
            return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss');
          },
        },
        methods: {
          getFormatTime() {
            return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss');
          },
        },
        filters: {
          // 局部过滤器
          timeFormater(val, formatStr = 'YYYY年MM月DD日 HH:mm:ss') {
            return dayjs(val).format(formatStr);
          },
        },
      });
    </script>
  </body>
</html>
```
