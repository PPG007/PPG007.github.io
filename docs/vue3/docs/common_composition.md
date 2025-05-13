# 常用 Composition API

## setup

- setup 是 Vue3 中的一个新的配置项，值为一个函数。
- setup 是所有 Composition API 表演的舞台。
- 组件中所用到的数据、方法等均要配置在 setup 中。
- setup 函数的两种返回值：
  - 若返回一个对象，则对象中的属性、方法在模板中可以直接使用。
  - 若返回一个渲染函数，则可以自定义渲染内容。

::: warning 注意

- 不要与 Vue2 混用：
  - Vue2 配置（data、method、computed）中可以访问到 setup 中的属性、方法。
  - setup 中不能访问 Vue2 配置。
  - 如果有重名，setup 优先。
- setup 不能是一个异步方法（async），因为返回值不再是 return 对象，而是 promise(使用异步引入 [Suspense](./new_component.md#suspense) 的情况除外)。
- setup 只有返回的内容才能被模板使用。
  :::

```vue
<template>
  <h1>{{ name }}</h1>
  <h1>{{ age }}</h1>
  <button @click="demo">测试</button>
</template>

<script>
export default {
  name: 'App',
  setup() {
    let name = 'ppg';
    let age = 21;
    function demo() {
      alert(name + ' ' + age);
    }
    return {
      name,
      age,
      demo,
    };
  },
};
</script>
```

## ref函数

- 作用：定义一个响应式数据。
- 语法：`let x=ref(val)`。
- 注意：在方法中操作响应式数据时，有两种方式：
  - 使用 `this.x=xxx` 直接修改。
  - 不使用 this 使用 `x.value=xxx` 修改。
- 对于基本数据类型，响应式依靠的是 `Object.defineProperty()` 的 `get` 与 `set` 完成的。
- 对象类型的数据，内部使用了 Vue3 的新函数 `reactive` 函数。

不使用 this 进行响应式修改：

```javascript
let name = ref('ppg');
let age = ref(21);
let person = ref({
  name: 'test',
  age: 1,
});
function demo() {
  alert(name + ' ' + age);
}
function changeAge() {
  age.value++;
}
function changePerson() {
  person.value.age++;
}
```

使用 this 进行修改：

```js
let name = ref('ppg');
let age = ref(21);
let person = ref({
  name: 'test',
  age: 1,
});
function demo() {
  alert(name + ' ' + age);
}
function changeAge() {
  this.age++;
}
function changePerson() {
  this.person.age++;
}
```

## reactive 函数

- 作用：定义一个对象类型的响应式数据。
- 语法：`const 代理对象=reactive(源对象)` 接收一个对象或数组，返回一个代理对象(proxy 对象)。
- reactive 定义的响应式数据是深层次的。
- 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作。
- reactive 既可以用 this 直接修改，也可以不用 this 直接修改，省去了 value。

```javascript
let person = reactive({
  name: 'test',
  age: 1,
});
function changePerson() {
  person.age++;
  this.person.age++;
}
```

修改数组内容可以直接通过下标修改：

```js
let arr = reactive([1, 2, 3]);
function demo() {
  alert(name + ' ' + age);
}
function changeArr() {
  arr[0] = 100;
}
```

## Vue 的响应式原理

### Vue2 的响应式

- 原理：
  - 对象类型：通过 `Object.defineProperty()` 对属性的读取、修改进行拦截（数据劫持）。
  - 数组类型：通过重写更新数组的一系列方法来实现拦截（对数组的变更方法进行了包裹。
- 存在问题：
  - 新增属性、删除属性，界面不会更新。
  - 直接通过下标修改数组，界面不会自动更新。

### Vue3 的响应式

- 原理：
  - 通过 Proxy(代理)，拦截对象中任意属性的变化，包括属性值的读写、属性的添加、属性的删除等。
  - 通过 Reflect(反射)，对被代理对象的属性进行操作。

原理示例：

```js
let person = {
  name: 'PPG',
  age: 21,
};
const p = new Proxy(person, {
  get(target, p) {
    console.log(`读取了${p},内容为${target[p]}`);
    return Reflect.get(target, p); //返回内容
  },
  set(target, p, value) {
    console.log(`修改了${p}属性，改成了${value}`);
    Reflect.set(target, p, value);
  },
  deleteProperty(target, p) {
    console.log(`删除了${p}属性，删除的内容为：${target[p]}`);
    return Reflect.deleteProperty(target, p); //返回删除结果，布尔值
  },
});
```

::: tip
Reflect 是 window 中的一个对象，可以进行增加、删除、修改属性等操作。
:::

使用 Reflect 增加属性：

```js
let person = {
  name: 'PPG',
  age: 21,
};
Reflect.defineProperty(person, 'email', {
  temp: '',
  get() {
    return Reflect.get(this, 'temp');
  },
  set(v) {
    Reflect.set(this, 'temp', v);
  },
});
```

## reactive 对比 ref

- 定义数据角度：
  - ref 用来定义：_基本类型数据_。
  - reactive 用来定义：_对象(或数组)类型数据_。
  - ref 也可以用来定义*对象(或数组)类型数据*，它内部会自动通过 reactive 转为*代理对象*。
- 原理角度：
  - ref 通过 `Object.defineProperty()` 的 `get` 与 `set` 来实现响应式。
  - reactive 通过使用 **Proxy** 来实现响应式，并通过 **Reflect** 操作源对象内部的数据。
- 使用角度：
  - ref 定义的数据：操作数据需要 `.value`，读取数据时模板中直接读取不需要 `.value`。
  - reactive 定义的数据，操作数据与读取数据*均不需要 `.value`*。

## setup 的两个注意点

- 执行时机：
  - 在 `beforeCreate` 之前执行，this 是 undefined。
- 参数
  - props：值为对象，包含组件外部传递过来，且组件内部声明接收了的属性。
  - context：上下文。
    - attrs：值为对象，包含组件外部传递过来，但没有在 props 配置中声明的属性，相当于 `this.$attrs`。
    - slots：收到的插槽内容，相当于 `this.$slots`。
    - emit：分发自定义事件的函数，相当于 `this.$emit`。

父组件：

```vue
<template>
  <Demo @demo="hello" :msg="msg">
    <span>这是一个插入内容</span>
  </Demo>
</template>

<script>
import { reactive, ref } from 'vue';
import Demo from './components/Demo.vue'; //引入不加后缀名会404

export default {
  name: 'App',
  components: {
    Demo,
  },
  setup(props, context) {
    let msg = 'vue3';
    function hello(val) {
      alert('hello事件被触发，收到参数：' + val);
    }
    return {
      hello,
      msg,
    };
  },
};
</script>
```

子组件：

```vue
<template>
  <div>
    <h1>demo {{ msg }}</h1>
    <button @click="demo">测试按钮</button>
    <br />
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Demo',
  props: ['msg'],
  setup(props, context) {
    function demo() {
      console.log(props);
      console.log(context.attrs);
      context.emit('demo', '嘿嘿嘿');
    }

    return {
      demo,
    };
  },
};
</script>

<style scoped></style>
```

## 计算属性与监视

### 计算属性

简写形式：

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

完整形式：

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

### 监视

- 情况一，监视 ref 所定义的一个响应式数据：

  ```js
  let sum = ref(0);
  let msg = ref('hello');
  let person = reactive({
    name: 'PPG',
    age: 21,
  });
  watch(
    sum,
    (newValue, oldValue) => {
      console.log(newValue, oldValue);
    },
    { immediate: true }
  );
  ```

- 情况二，监视 ref 所定义的多个响应式数据：

  ```js
  watch(
    [sum, msg],
    (newValue, oldValue) => {
      console.log(newValue, oldValue);
    },
    { immediate: true }
  );
  ```

- 情况三，监视 reactive 所定义的一个响应式数据的全部属性：

  ::: warning 注意
  此处可能无法正确获取 oldValue，属于 Vue 的 bug，后续 Vue 更新可能修复。

  此处强制开启了深度监视，无论是否设置 deep 为 false 都无效。
  :::

  ```js
  watch(
    person,
    (newValue, oldValue) => {
      console.log(newValue, oldValue);
    },
    { immediate: true }
  );
  ```

- 情况四，监视 reactive 定义的一个响应式数据中的某个属性：

  ::: tip
  这种情况可以获取 oldValue。
  :::

  ```js
  watch(
    () => person.name,
    (newValue, oldValue) => {
      console.log(newValue, oldValue);
    },
    { immediate: true }
  );
  ```

- 情况五，监视 reactive 所定义的一个响应式数据的某些属性：

  ::: tip
  这种情况也可以获取 oldValue。
  :::

  ```js
  watch(
    [() => person.name, () => person.age],
    (newValue, oldValue) => {
      console.log(newValue, oldValue);
    },
    { immediate: true }
  );
  ```

- 特殊情况，监视 reactive 定义的一个响应式数据的某个对象属性：

  ::: warning 注意
  这种情况也不能获取 oldValue。
  :::

  ```js
  let person = reactive({
    name: 'PPG',
    age: 21,
    a: {
      b: {
        c: 1,
      },
    },
  });
  watch(
    () => person.a,
    (newValue, oldValue) => {
      console.log(newValue, oldValue);
    },
    { immediate: true, deep: true }
  );
  ```

#### watchEffect 函数

- watch 的套路是:既要指明监视的属性,也要指明监视的回调。
- watchEffect 的套路是:不用指明监视哪个属性,监视的回调中用到哪个属性,那就监视哪个属性。
- watch Effect 有点像 computed:
  - 但 computed 注重的计算出来的值(回调函数的返回值),所以必须要写返回值。
  - 而 watch Effect 注重的是过程(回调函数的函数体),所以不用写返回值。

```js
watchEffect(() => {
  const x = person.value.a.b.c; //要调用到最后一层
  console.log('watch');
});
```

## 生命周期

![实例的生命周期](./images/lifecycle.svg)

Vue3 中生命周期与 Vue2 基本相同，只是将*销毁*修改为了*卸载*。

### 配置项形式使用生命周期钩子

```js
export default {
  name: 'Demo',

  setup(props, context) {},
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  mounted() {
    console.log('mounted');
  },
  beforeUpdate() {
    console.log('beforeUpdate');
  },
  updated() {
    console.log('updated');
  },
  beforeUnmount() {
    console.log('beforeUnmount');
  },
  unmounted() {
    console.log('unmounted');
  },
};
```

### 使用组合式 API 编写钩子

```js
import {
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
} from 'vue';
export default {
  name: 'Demo',

  setup(props, context) {
    onBeforeMount(() => {
      console.log('onBeforeMount');
    });

    onMounted(() => {
      console.log('onMounted');
    });

    onBeforeUpdate(() => {
      console.log('onBeforeUpdate');
    });

    onUpdated(() => {
      console.log('onUpdated');
    });

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount');
    });

    onUnmounted(() => {
      console.log('onUnmounted');
    });
  },
};
```

组合式 API 就是将原来的钩子前加了 `on`。

::: warning 注意
`beforeCreate()` 和 `created()` 没有组合式 API，且如果一个钩子同时使用两种写法，两个写法都会执行，组合式 API 先执行。
:::

## 自定义 hook 函数

- 什么是 hook：
  - 本质是一个函数，将可能复用的 setup 中的组合式 API，包括生命周期钩子进行封装。
  - 类似 mixin 混合。

自定义 hook 示例：

要完成一个鼠标点击后将坐标显示在界面上，那么就需要为 window 绑定事件，并且在组建卸载时取消这个事件。

在 src 目录下创建 `hooks` 文件夹，在其中创建自定义 hook，命名规范：`useXXX.js`。

usePoint.js：

```js
import { onBeforeUnmount, onMounted, reactive } from 'vue';

export default function usePoint() {
  let point = reactive({
    x: 0,
    y: 0,
  });

  function f(event) {
    point.x = event.pageX;
    point.y = event.pageY;
  }
  onMounted(() => {
    window.addEventListener('click', f);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', f);
  });

  return point; //此处要返回
}
```

在组件中引入：

```vue
<template>
  <div>
    <h2>x:{{ point.x }}</h2>
    <h2>y:{{ point.y }}</h2>
  </div>
</template>

<script>
import usePoint from '../hooks/usePoint';
export default {
  name: 'Demo',
  setup(props, context) {
    let point = usePoint();
    return {
      point,
    };
  },
};
</script>
```

## toRef/toRefs

- 作用：创建一个 ref 对象,其 value 值指向另一个对象中的某个属性。
- 语法：`const name=toRef(person,'name')`。
- 应用：要将响应式对象中的某个属性单独提供给外部使用时。
- 扩展: `toRefs` 与 `toRef` 功能致,但可以批量创建多个 ref 对象,语法: `toRefs(person)`。

使用 toRef，第一个参数是对象，第二个参数是对象中的键：

```vue
<template>
  <h2>{{ name }}</h2>
  <h2>{{ age }}</h2>
  <h2>{{ c }}</h2>
  <button @click="name += '~'">name++</button>
  <button @click="age++">age++</button>
  <button @click="c += '!'">c++</button>
</template>
<script>
import { reactive, ref, toRef, toRefs } from 'vue';
export default {
  name: 'App',
  setup() {
    let person = reactive({
      name: 'ppg',
      age: 21,
      a: {
        b: {
          c: 'd',
        },
      },
    });
    return {
      name: toRef(person, 'name'),
      age: toRef(person, 'age'),
      c: toRef(person.a.b, 'c'),
    };
  },
};
</script>
```

使用 toRefs，只接受一个对象参数，_只去除最外层_：

```vue
<template>
  <h2>{{ name }}</h2>
  <h2>{{ age }}</h2>
  <h2>{{ a.b.c }}</h2>
  <button @click="name += '~'">name++</button>
  <button @click="age++">age++</button>
  <button @click="a.b.c += '!'">c++</button>
</template>

<script>
import { reactive, ref, toRef, toRefs } from 'vue';
export default {
  name: 'App',
  setup() {
    let person = reactive({
      name: 'ppg',
      age: 21,
      a: {
        b: {
          c: 'd',
        },
      },
    });
    return {
      ...toRefs(person),
    };
  },
};
</script>
```

::: tip
`toRef` 和 `toRefs` 使得返回的数据被修改时，源数据也能被修改，这与下面的写法是不同的，以下写法的修改不会影响源数据：

```js
return {
  name: ref(person.name),
};
```

:::
