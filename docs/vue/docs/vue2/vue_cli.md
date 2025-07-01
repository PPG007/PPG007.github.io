# 使用 Vue 脚手架

## 安装 Vue-CLI 并创建 Hello World

首先需要安装 [Node.js](https://nodejs.org/zh-cn/) 环境。

成功安装 Node.js 后在命令行输入：

```powershell
npm install -g @vue/cli
```

如果安装过旧版本可以用这个命令卸载：

```powershell
npm uninstall vue-cli -g
```

如果安装太慢可以使用国内镜像：

```powershell
npm config set registry https://repo.huaweicloud.com/repository/npm/
npm cache clean -f
npm config set disturl https://repo.huaweicloud.com/nodejs
npm config set sass_binary_site https://repo.huaweicloud.com/node-sass
```

打开 CMD，进入到想要创建项目的文件夹，执行：

```powershell
vue create [项目名]
#例如：
vue create demo
```

在可选项中根据实际情况选择 Vue 的版本等选项。

创建结束后得到一个以项目名命名的文件夹，进入到这个文件夹中，执行：

```powershell
npm run serve
```

成功启动了Hello World项目

## render 函数

`main.js` 中有这样一行代码：

```js
import Vue from 'vue';
```

默认情况下引入的是 `vue.runtime.esm.js`，不包含模板解析器，所以 `main.js` 的Vue实例中不能添加 `template` 属性，会报错。

使用render可以在这个环境中完成模板渲染：

```js
render(createElement){
    return createElement('h1','Hello Wrold');
}
```

可以简写成箭头函数：

```javascript
render:h=>h('h1',Hello World);
```

如果使用组件直接传入组件即可，不需要第二个参数：

```js
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
```

## 修改默认配置

使用如下命令将现有配置输出到指定文件：

```powershell
vue inspect > out.js
```

在 `package.json` 同级目录下创建 `vue.config.js`，这个文件应该导出一个包含了选项的对象：

```js
module.exports = {};
```

可选参考项：[Vue-CLI配置项](https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE)。

示例，关闭保存时语法检查：

```js
module.exports = {
  lintOnSave: false,
};
```

如果定义了一个配置项但是没有设置配置值，那么将会报错，而且如果要使配置生效要*重新启动*：

```powershell
npm run serve
```

## ref 属性

ref 属性：

- 用来给元素或子组件注册引用信息(id 的替代者)。
- 应用在 HTML 标签上获取的是真实 DOM 元素，应用在组件上是组件实例对象(vc)。
- 获取：`vm.$refs.xxx`。

```vue
<template>
  <div>
    <!-- <Student></Student> -->
    <h2 ref="title">Hello{{ msg }}</h2>
    <button v-on:click="showDOM">点我输出上方DOM</button>
    <School></School>
  </div>
</template>

<script>
import School from './components/School';
import Student from './components/Student';
export default {
  name: 'App',
  components: {
    School,
  },
  data() {
    return {
      msg: 'World',
    };
  },
  methods: {
    showDOM() {
      console.log(this.$refs.title);
    },
  },
};
</script>

<style></style>
```

## props 属性

功能：让组件接收外部传来的数据。

### 传递参数

在使用到组件的地方：

```vue
<template>
  <div>
    <Student name="PPG" :age="21" sex="male"></Student>
  </div>
</template>
```

### 接收参数

方式一：

```js
props: ['name', 'age', 'sex'];
```

方式二：

```js
props:{
    name:String,
    age:Number,
    sex:String
}
```

方式三：

```js
props:{
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        default:20
    },
    sex:{
        type:String,
        required:false
    }
},
```

::: warning 注意
props 是只读的，如果进行修改会产生警告，如果确实需要修改，要将 props 中的指定内容在 data 中复制一份，由于 props 优先级较高，所以不会出现字段未定义的错误。
:::

```javascript
const student = Vue.extend({
  data() {
    return {
      msg: 'Hello Vue',
      studentAge: this.age,
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 20,
    },
    sex: {
      type: String,
      required: false,
    },
  },
  methods: {
    changeAge() {
      this.studentAge++;
    },
  },
});
```

## mixin 混入

功能：可以把多个组件共用的配置提取成一个混入对象。

### 定义 mixin

```js
'use strict';
export const mixin = {
  methods: {
    showName() {
      alert(this.name);
    },
  },
};
```

### 引用 mixin

局部引入，在组件中引用混合，mixins:['xxx','xxx']：

```html
<script>
  import Vue from 'vue';
  import { mixin } from '@/mixin';
  const student = Vue.extend({
    data() {
      return {
        msg: 'Hello Vue',
        name: 'PPG',
        age: 21,
        sex: 'male',
      };
    },
    mixins: [mixin],
  });
  export default student;
</script>
```

全局引入，`Vue.mixin(xxx)`：

```js
import { mixin } from '@/mixin';
Vue.mixin(mixin);
```

::: tip
如果一个组件内部定义了和混入中定义的相同的 data、method，最后得到的是内部定义的，如果是钩子函数，那么内部和混合中定义的都会保留。
:::

## 插件

功能：用于增强 Vue。

本质：包含 install 方法的一个对象，install 的第一个参数是 Vue，第二个以后的参数是插件使用者传递的数据。

使用插件：`Vue.use(xxx)`。

应用举例：添加全局过滤器、添加全局指令、配置全局混入、在 Vue 的原型对象上定义全局方法。

定义插件：

```js
'use strict';
const plugin1 = {
  install(vue, a, b) {
    console.log('Plugin 1 installed');
    vue.prototype.hello = function () {
      console.log('Vue 全局方法');
      console.log('另外两个参数为', a, b);
    };
  },
};
export { plugin1 };
```

使用插件：

```js
import { plugin1 } from '@/plugins';
Vue.use(plugin1, Date.now(), 'hello');
```

```vue
<template>
  <div class="demo">
    <h2 @click="showName">name:{{ name }}</h2>
    <br />
    <h2>address:{{ address }}</h2>
    <button @click="helloTest()">点我控制台输出</button>
  </div>
</template>

<script>
import Vue from 'vue';
const school = Vue.extend({
  name: 'School',
  data() {
    return {
      name: 'SDUST',
      address: 'QD',
    };
  },
  methods: {
    helloTest() {
      this.hello();
    },
  },
});
export default school;
</script>
```

## scoped 样式

每个组件中定义的 style 属性在编译后会混在一个文件中，如果存在重名 CSS 样式，后引入的组件中的会覆盖之前组件的 CSS，为 style 标签添加 `scoped` 属性限定样式只在当前组件中可用：

```html
<style scoped>
  .demo {
    background-color: orange;
  }
</style>
```

style 的另一个属性 `lang` 可以选择 `css` 或 `less` 使 Vue 能够解析，如果选择 less 需要安装 less-loader，要注意版本问题。
