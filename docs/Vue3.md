# 创建Vue3.0工程

### 使用vue-CLI

创建vue3.0工程需要Vue-CLI版本在4.5.0以上

### 使用vite

什么是vite？——新一代前端构建工具

优势：

- 开发环境中，无需打包操作，可快速冷启动
- 轻量快速的热重载（HMR）
- 真正的按需编译，不再等待整个应用编译完成

创建项目

```shell
npm init vite-app <项目名>
```

进入项目文件夹，安装依赖

```shell
npm install
```

# 常用Composition API

### setup

- setup是Vue3中的一个新的配置项，值为一个函数
- setup是所有Composition API表演的舞台
- 组件中所用到的数据、方法等均要配置在setup中
- setup函数的两种返回值
  - 若返回一个对象，则对象中的属性、方法在模板中可以直接使用
  - 若返回一个渲染函数，则可以自定义渲染内容
- 注意点：
  - 不要与Vue2混用
    - Vue2配置（data、method、computed）中可以访问到setup中的属性、方法
    - setup中不能访问Vue2配置
    - 如果有重名，setup优先
  - setup不能是一个异步方法（async），因为返回值不再是return对象，而是promise(异步引入Suspense可以)
- setup只有返回的内容才能被模板使用

```vue
<template>
  <h1>{{name}}</h1>
  <h1>{{age}}</h1>
  <button @click="demo">测试</button>
</template>

<script>

export default {
  name: 'App',
  setup(){
    let name='ppg'
    let age=21
    function demo() {
      alert(name+' '+age)
    }
    return{
      name,
      age,
      demo
    }
  }
}
</script>
```

### ref函数

- 作用：定义一个响应式数据
- 语法：`let x=ref(val)`
- 注意：在方法中操作响应式数据时，有两种方式：
  - 使用`this.x=xxx`直接修改
  - 不使用this使用`x.value=xxx`修改
- 对于基本数据类型，响应式依靠的是`Object.defineProperty()`的`get`与`set`完成的
- 对象类型的数据，内部使用了Vue3的新函数`reactive`函数

不使用this进行响应式修改

```javascript
let name=ref('ppg')
let age=ref(21)
let person=ref({
  name:'test',
  age:1
})
function demo() {
  alert(name+' '+age)
}
function changeAge(){

  age.value++
}
function changePerson() {
  person.value.age++
}
```

使用this进行修改

```js
let name=ref('ppg')
let age=ref(21)
let person=ref({
  name:'test',
  age:1
})
function demo() {
  alert(name+' '+age)
}
function changeAge(){

  this.age++
}
function changePerson() {
  this.person.age++
}
```

### reactive函数

- 作用：定义一个对象类型的响应式数据
- 语法：`const 代理对象=reactive(源对象)`接收一个对象或数组，返回一个代理对象(proxy对象)
- reactive定义的响应式数据是深层次的
- 内部基于ES6的Proxy实现，通过代理对象操作源对象内部数据进行操作
- reactive既可以用this直接修改，也可以不用this直接修改，省去了value

```javascript
let person=reactive({
  name:'test',
  age:1
})
function changePerson() {

  person.age++
  this.person.age++
}
```

- 修改数组内容可以直接通过下标修改

```js
let arr=reactive([1,2,3])
function demo() {
  alert(name+' '+age)
}
function changeArr(){
  arr[0]=100
}
```

### Vue3的响应式原理

##### Vue2的响应式

- 原理
  - 对象类型：通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）
  - 数组类型：通过重写更新数组的一系列方法来实现拦截（对数组的变更方法进行了包裹
- 存在问题
  - 新增属性、删除属性，界面不会更新
  - 直接通过下标修改数组，界面不会自动更新

##### Vue3的响应式

- 原理：
  - 通过Proxy(代理)，拦截对象中任意属性的变化，包括属性值的读写、属性的添加、属性的删除等
  - 通过Reflect(反射)，对被代理对象的属性进行操作

原理示例

```js
let person={
    name:'PPG',
    age:21
}
const p=new Proxy(person,{
    get(target, p) {
        console.log(`读取了${p},内容为${target[p]}`)
        return Reflect.get(target,p)//返回内容
    },
    set(target, p, value) {
        console.log(`修改了${p}属性，改成了${value}`)
        Reflect.set(target,p,value)
    },
    deleteProperty(target, p) {
        console.log(`删除了${p}属性，删除的内容为：${target[p]}`)
        return Reflect.deleteProperty(target,p)//返回删除结果，布尔值
    }
})
```

Reflect是window中的一个对象，可以进行增加、删除、修改属性等操作

使用Reflect增加属性：

```js
let person={
    name:'PPG',
    age:21
}
Reflect.defineProperty(person,'email',{
    temp:'',
    get() {
        return Reflect.get(this, 'temp');
    },
    set(v) {
        Reflect.set(this,'temp',v);
    }
})
```

### reactive对比ref

- 定义数据角度：
  - ref用来定义：==基本类型数据==
  - reactive用来定义：==对象(或数组)类型数据==
  - ref也可以用来定义==对象(或数组)类型数据==，它内部会自动通过reactive转为==代理对象==
- 原理角度：
  - ref通过`Object.defineProperty()`的`get`与`set`来实现响应式
  - reactive通过使用**Proxy**来实现响应式，并通过**Reflect**操作源对象内部的数据
- 使用角度：
  - ref定义的数据：操作数据需要`.value`，读取数据时模板中直接读取不需要`.value`
  - reactive定义的数据，操作数据与读取数据==均不需要`.value`==

### setup的两个注意点

- 执行时机
  - 在beforeCreate之前执行，this是undefined
- 参数
  - props：值为对象，包含：组件外部传递过来，且组件内部声明接收了的属性
  - context：上下文
    - attrs：值为对象，包含组件外部传递过来，但没有在props配置中声明的属性，相当于`this.$attrs`
    - slots：收到的插槽内容，相当于`this.$slots`
    - emit：分发自定义事件的函数，相当于`this.$emit`

父组件：

```vue
<template>
  <Demo @demo="hello" :msg="msg">
    <span>这是一个插入内容</span>
  </Demo>
</template>

<script>

import {reactive, ref} from "vue";
import Demo from "./components/Demo.vue";//引入不加后缀名会404

export default {
  name: 'App',
  components:{
    Demo
  },
  setup(props,context){
    let msg='vue3'
    function hello(val) {
      alert('hello事件被触发，收到参数：'+val)
    }
    return{
      hello,
      msg
    }
  }
}
</script>
```

子组件

```vue
<template>
  <div>
    <h1>demo {{msg}}</h1>
    <button @click="demo">测试按钮</button>
    <br>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Demo",
  props:['msg'],
  setup(props, context) {
    function demo() {
      console.log(props)
      console.log(context.attrs);
      context.emit('demo', '嘿嘿嘿')
    }

    return{
      demo
    }
  }
}
</script>

<style scoped>

</style>
```

### 计算属性与监视

##### 计算属性

简写形式

```js
setup(){
  let person=reactive({
    name:'PPG',
    age:21
  })
  person.info=computed(()=>{
    return person.name+'-'+person.age
  })

  return{
    person
  }
}
```

完整形式

```js
setup(){
  let person=reactive({
    name:'PPG',
    age:21
  })
  person.info=computed({
    get(){
      return person.name+'-'+person.age
    },
    set(val){
      console.log(val)
    }
  })

  return{
    person
  }
}
```

##### 监视

- 情况一：监视ref所定义的一个响应式数据

```js
let sum=ref(0)
let msg=ref('hello')
let person =reactive({
  name:'PPG',
  age:21
})
watch(sum,(newValue, oldValue)=>{
  console.log(newValue,oldValue)
},{immediate:true})
```

- 情况二：监视ref所定义的多个响应式数据

```js
watch([sum,msg],(newValue, oldValue)=>{
  console.log(newValue,oldValue)
},{immediate:true})
```

- 情况三：监视reactive所定义的一个响应式数据的全部属性
  - 注意：此处无法正确获取oldValue，后续Vue更新可能修复
  - 注意：此处强制开启了深度监视，无论是否设置deep为false都无效

```js
watch(person,(newValue, oldValue)=>{
  console.log(newValue,oldValue)
},{immediate:true})
```

- 情况四：监视reactive定义的一个响应式数据中的某个属性

**这种情况可以获取oldValue**

```js
watch(()=>person.name,(newValue, oldValue)=>{
  console.log(newValue,oldValue)
},{immediate:true})
```

- 情况五：监视reactive所定义的一个响应式数据的某些属性

**这种情况也可以获取oldValue**

```js
watch([()=>person.name,()=>person.age],(newValue, oldValue)=>{
  console.log(newValue,oldValue)
},{immediate:true})
```

- 特殊情况：监视reactive定义的一个响应式数据的某个对象属性

```js
let person =reactive({
  name:'PPG',
  age:21,
  a:{
    b:{
      c:1
    }
  }
})
watch(()=>person.a,(newValue, oldValue)=>{
  console.log(newValue,oldValue)
},{immediate:true,deep:true})
```

**这种情况也不能获取oldValue**

==核心就是监视的到底是refImpl类型对象还是Proxy代理对象==

###### watchEffect函数

- watch的套路是:既要指明监视的属性,也要指明监视的回调
- watchEffect的套路是:不用指明监视哪个属性,监视的回调中用到哪个属性,那就监视哪个属性
- watch Effect有点像 computed:
  - 但 computed注重的计算出来的值(回调函数的返回值),所以必须要写返回值
  - 而 watch Effect注重的是过程(回调函数的函数体),所以不用写返回值。

```js
watchEffect(()=>{
  const x=person.value.a.b.c//要调用到最后一层
  console.log('watch')
})
```

### 生命周期

![实例的生命周期](/Vue3/lifecycle.svg)

Vue3中声明周期与Vue2基本相同，只是将`销毁`修改为了`卸载`

##### 配置项形式使用生命周期钩子

```js
export default {
  name: "Demo",

  setup(props, context) {
  },
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    console.log('mounted')
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
  beforeUnmount() {
    console.log('beforeUnmount')
  },
  unmounted() {
    console.log('unmounted')
  }
}
```

##### 使用组合式API编写钩子

```js
import {onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, ref} from "vue";
export default {
  name: "Demo",

  setup(props, context) {

    onBeforeMount(()=>{
      console.log('onBeforeMount')
    })

    onMounted(()=>{
      console.log('onMounted')
    })

    onBeforeUpdate(()=>{
      console.log('onBeforeUpdate')
    })

    onUpdated(()=>{
      console.log('onUpdated')
    })

    onBeforeUnmount(()=>{
      console.log('onBeforeUnmount')
    })

    onUnmounted(()=>{
      console.log('onUnmounted')
    })
  },
}
```

组合式API就是将原来的钩子前加了`on`

**注意：`beforeCreate()`和`created()`没有组合式API，且如果一个钩子同时使用两种写法，两个写法都会执行，组合式API先执行**

### 自定义hook函数

- 什么是hook：
  - 本质是一个函数，将可能复用的setup中的组合式API，包括生命周期钩子进行封装
  - 类似mixin混合

自定义hook示例：

要完成一个鼠标点击后将坐标显示在界面上，那么就需要为window绑定事件，并且在组建卸载时取消这个事件

在src目录下创建`hooks`文件夹，在其中创建自定义hook，命名规范：`useXXX.js`

usePoint.js：

```js
import {onBeforeUnmount, onMounted, reactive} from "vue";

export default function usePoint() {
    let point=reactive({
        x:0,
        y:0
    })

    function f(event) {
        point.x=event.pageX
        point.y=event.pageY
    }
    onMounted(()=>{
        window.addEventListener('click', f);
    })

    onBeforeUnmount(()=>{
        window.removeEventListener('click', f)
    })

    return point//此处要返回
}
```

在组件中引入：

```vue
<template>
  <div>
    <h2>x:{{point.x}}</h2>
    <h2>y:{{point.y}}</h2>
  </div>
</template>

<script>
import usePoint from '../hooks/usePoint'
export default {
  name: "Demo",
  setup(props, context) {
    let point = usePoint()
    return{
      point
    }
  },
}
</script>
```

### toRef/toRefs

- 作用：创建一个ref对象,其 value值指向另一个对象中的某个属性。
- 语法：`const name=toRef(person,'name')`
- 应用：要将响应式对象中的某个属性单独提供给外部使用时
- 扩展: `toRefs`与 `toRef`功能致,但可以批量创建多个ref对象,语法: `toRefs(person)`

使用toRef，第一个参数是对象，第二个参数是对象中的键

```vue
<template>
  <h2>{{name}}</h2>
  <h2>{{age}}</h2>
  <h2>{{c}}</h2>
  <button @click="name+='~'">name++</button>
  <button @click="age++">age++</button>
  <button @click="c+='!'">c++</button>
</template>
<script>
import {reactive, ref, toRef, toRefs} from "vue";
export default {
  name: 'App',
  setup(){
    let person=reactive({
      name:'ppg',
      age:21,
      a:{
        b:{
          c:'d'
        }
      }
    })
    return{
      name:toRef(person,'name'),
      age:toRef(person,'age'),
      c:toRef(person.a.b,'c')
    }
  }
}
</script>
```

使用toRefs，只接受一个对象参数，==只去除最外层==

```vue
<template>
  <h2>{{name}}</h2>
  <h2>{{age}}</h2>
  <h2>{{a.b.c}}</h2>
  <button @click="name+='~'">name++</button>
  <button @click="age++">age++</button>
  <button @click="a.b.c+='!'">c++</button>
</template>

<script>
import {reactive, ref, toRef, toRefs} from "vue";
export default {
  name: 'App',
  setup(){
    let person=reactive({
      name:'ppg',
      age:21,
      a:{
        b:{
          c:'d'
        }
      }
    })
    return{
      ...toRefs(person)
    }
  }
}
</script>
```

**`toRef`和`toRefs`使得返回的数据被修改时，源数据也能被修改，这与下面的写法是不同的，以下写法的修改不会影响源数据**

```js
return{
    name:ref(person.name)
}
```

# 其它Composition API

### shallowReactive与shallowRef

- shallowReactive：
  - 只处理对象最外层属性的响应式(浅响应式)
- shallowRef：
  - 只处理基本数据类型的响应式，不进行对象的响应式处理
- 何时使用
  - 如果有一个对象数据，结构比较深，但变化时只是外层属性变化\==>使用==shallowReactive==
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生成新的对象来替换=\=>使用==shallowRef==

### readonly与shallowReadonly

- readonly：让一个**响应式**数据变为只读(深只读)
- shallowReadonly：让一个**响应式**数据变为只读(浅只读)
- 应用场景：不希望数据被修改时

以下代码使得person中浅层属性`name`与`age`只读

```js
let person=reactive({
  name:'ppg',
  age:21,
  a:{
    b:{
      c:'d'
    }
  }
})
person=shallowReadonly(person)
```

以下代码使得person所有层次属性只读

```vue
person=readonly(person)
```

### toRaw与markRaw

- toRaw：
  - 作用：将一个由`reactive`生成的==响应式对象==转为==普通对象==
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新
- markRaw：
  - 作用：标记一个对象，使其永远不会再成为响应式对象
  - 使用场景：
    - 有些值不应被设置为响应式的，例如复杂的第三方库等
    - 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能

### customRef

- 作用：创建一个自定义的ref，并对其依赖项跟踪和更新触发进行显式控制

示例：

```vue
<template>
  <input type="text" v-model="keyWord">
  <h3>{{keyWord}}</h3>
</template>

<script>


import {customRef} from "vue";

export default {
  name: 'App',
  setup(){
    function myRef(val) {//自定义ref
      return customRef((track, trigger)=>{//两个参数

        return{
          get(){
            track()//调用跟踪，否则不会响应式
            return val
          },
          set(newVal){
            val=newVal
            trigger()//触发页面更新
          }
        }
      })
    }

    let keyWord=myRef('hello')//使用自定义ref

    return{
      keyWord
    }
  }
}
</script>
```

### provide与inject

![Provide/inject scheme](/Vue3/components_provide.png)

- 作用：实现组件隔代通信
- 使用一对 `provide` 和 `inject`。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这些数据。

##### 使用provide

```vue
<template>
  <h1>{{ sum }}</h1>
  <button @click="add">sum++</button>
  <Demo/>
</template>

<script>

import Demo from "./components/Demo.vue";
import {provide, readonly, ref} from "vue";

export default {
  name: 'App',
  components: {
    Demo
  },
  setup() {
    let sum = ref(0)
    function add() {
      this.sum++
    }
    provide('sum', readonly(sum))//使用键值对形式传递
    provide('add',add)
    return {
      sum,
      add
    }
  }
}
</script>
```

##### 使用inject

```vue
<template>
  <div>
    <h3>{{sum}}</h3>
    <button @click="add">sum++</button>
  </div>
</template>

<script>
import {inject} from "vue";

export default {
  name: "Demo",

  setup(props, context) {
    let sum = inject('sum',100);//第二个参数是默认值
    const add=inject('add')
    return{
      sum,
      add
    }
  },
}
</script>

<style scoped>

</style>
```

### 响应式数据的判断

- isRef：检查一个值是否为一个ref对象
- isReactive：检查一个对象是否是由`reactive`创建的响应式代理
- isReadonly：检查一个对象是否是由`readonly`创建的只读代理
- isProxy：检查一个对象是否是由`reactive`或者`readonly`方法创建的代理

```js
let sum = ref(0)
let person=reactive({
  name:'ppg'
})
let x=readonly(person)

console.log(isReadonly(x))//true
console.log(isReactive(person))//true
console.log(isRef(sum));//true
console.log(isProxy(x));//true
```

# 新的组件

### Fragment

- 在Vue2中：组件必须有一个根标签
- 在Vue3中：组件可以没有根标签,内部会将多个标签包含在一个 Fragment虚拟元素中
- 好处：减少标签层级,减小内存占用

### Teleport

Teleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下渲染了 HTML，而不必求助于全局状态或将其拆分为两个组件。

例如：子组件中使用了对话框组件，希望点击按钮后弹出到页面中心

修改Dialog.vue

```vue
<template>
  <div>
    <button @click="isShow=true">
      弹窗
    </button>
    <teleport to="body"><!--to属性指定了teleport标签内部的HTML渲染到的目标位置，使用选择器写法-->
      <div class="mask" v-if="isShow">
        <div class="dialog">
          <h3>弹窗</h3>
          <h4>something</h4>
          <h4>something</h4>
          <h4>something</h4>
          <button @click="isShow=false">关闭</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "Dialog",
  setup(){
    let isShow=ref(false)

    return{
      isShow
    }
  }
}
</script>

<style scoped>
  .dialog{
    width: 300px;
    height: 300px;
    background-color: green;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    position: absolute;
  }
  .mask{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,0.5);
  }
</style>
```

### Suspense

在网速较慢的情况下，默认引入会导致只有所有组件都准备好才渲染界面，使用异步引入则可以依次渲染，让应用有更好体验

- 使用步骤：

  - 异步引入组件

  ```js
  import {defineAsyncComponent} from "vue";
  
  const A=defineAsyncComponent(()=>import("./components/A.vue"))
  export default {
    name: 'App',
    components:{
      A
    },
    setup() {
  
    },
  
  }
  ```

  - 使用`Suspense`标签包裹组件，并使用提供的`default`与`fallback`插槽

  ```vue
  <template>
    <div class="app">
      <h3>APP</h3>
      <Suspense>
        <template v-slot:default>
          <A/>
        </template>
        <template v-slot:fallback>
          <h3>loading</h3>
        </template>
      </Suspense>
    </div>
  </template>
  ```

**注意：使用Suspense包裹的组件中setup函数可以是async的**

# Vue3其他改变

### 全局API的转移

- Vue2中有很多全局API和配置
  - 例如：全局组件、全局指令等
- Vue3进行了调整
  - 将全局的API，即`Vue.xxx`调整到应用实例`app`上

| 2.x 全局 API               | 3.x 实例 API (`app`)                       |
| -------------------------- | ------------------------------------------ |
| Vue.config                 | app.config                                 |
| Vue.config.productionTip   | **已移除**                                  |
| Vue.config.ignoredElements | app.config.compilerOptions.isCustomElement |
| Vue.component              | app.component                              |
| Vue.directive              | app.directive                              |
| Vue.mixin                  | app.mixin                                  |
| Vue.use                    | app.use                                    |
| Vue.prototype              | app.config.globalProperties                |
| Vue.extend                 | **已移除**                                  |

### 其它改变

##### 过渡class

在进入/离开的过渡中，会有 6 个 class 切换。

1. `v-enter-from`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
2. `v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
3. `v-enter-to`：定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter-from` 被移除)，在过渡/动画完成之后移除。
4. `v-leave-from`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
5. `v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
6. `v-leave-to`：离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave-from` 被删除)，在过渡/动画完成之后移除。

![Transition Diagram](/Vue3/transitions.svg)

##### 移除keyCode座位v-on的修饰符，同时也不再支持`config.keyCodes`

##### 移除`v-on.native`修饰符

父组件中绑定事件：

```vue
<A v-on:click="show"/>
```

子组件中声明自定义事件

```vue
<script>
    export default {
        name: "A",
        components:{B},
        emits:['click']//声明自定义事件，不写在这里面会被视作原生事件，这里click不会被触发
    }
</script>
```

##### 移除过滤器

##### v-if 与 v-for 的优先级对比

- 2.x 版本中在一个元素上同时使用 `v-if` 和 `v-for` 时，`v-for` 会优先作用
- 3.x 版本中 `v-if` 总是优先于 `v-for` 生效。

##### v-bind 合并行为

在 2.x，如果一个元素同时定义了 `v-bind="object"` 和一个相同的单独的 property，那么这个单独的 property 总是会覆盖 `object` 中的绑定。

```html
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="red"></div>
```

在 3.x，如果一个元素同时定义了 `v-bind="object"` 和一个相同的单独的 property，那么声明绑定的==顺序==决定了它们如何合并。换句话说，相对于假设开发者总是希望单独的 property 覆盖 `object` 中定义的内容，现在开发者对自己所希望的合并行为有了更好的控制。

```html
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="blue"></div>

<!-- template -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- result -->
<div id="red"></div>
```

