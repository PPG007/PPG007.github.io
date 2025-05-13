# 其它 Composition API

## shallowReactive 与 shallowRef

- shallowReactive：
  - 只处理对象最外层属性的响应式(浅响应式)。
- shallowRef：
  - 只处理基本数据类型的响应式，不进行对象的响应式处理。
- 何时使用：
  - 如果有一个对象数据，结构比较深，但变化时只是外层属性变化：使用 `shallowReactive`。
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生成新的对象来替换：使用 `shallowRef`。

## readonly 与 shallowReadonly

- readonly：让一个**响应式**数据变为只读(深只读)。
- shallowReadonly：让一个**响应式**数据变为只读(浅只读)。
- 应用场景：不希望数据被修改时。

以下代码使得 person 中浅层属性 `name` 与 `age` 只读：

```js
let person = reactive({
  name: 'ppg',
  age: 21,
  a: {
    b: {
      c: 'd',
    },
  },
});
person = shallowReadonly(person);
```

以下代码使得 person 所有层次属性只读：

```js
person = readonly(person);
```

## toRaw 与 markRaw

- toRaw：
  - 作用：将一个由 `reactive` 生成的*响应式对象*转为*普通对象*。
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
- markRaw：
  - 作用：标记一个对象，使其永远不会再成为响应式对象。
  - 使用场景：
    - 有些值不应被设置为响应式的，例如复杂的第三方库等。
    - 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

## customRef

作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。

示例：

```vue
<template>
  <input type="text" v-model="keyWord" />
  <h3>{{ keyWord }}</h3>
</template>

<script>
import { customRef } from 'vue';

export default {
  name: 'App',
  setup() {
    function myRef(val) {
      //自定义ref
      return customRef((track, trigger) => {
        //两个参数

        return {
          get() {
            track(); //调用跟踪，否则不会响应式
            return val;
          },
          set(newVal) {
            val = newVal;
            trigger(); //触发页面更新
          },
        };
      });
    }

    let keyWord = myRef('hello'); //使用自定义ref

    return {
      keyWord,
    };
  },
};
</script>
```

## provide 与 inject

![Provide/inject scheme](./images/components_provide.png)

- 作用：实现组件隔代通信。
- 使用一对 `provide` 和 `inject`。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这些数据。

### 使用 provide

```vue
<template>
  <h1>{{ sum }}</h1>
  <button @click="add">sum++</button>
  <Demo />
</template>

<script>
import Demo from './components/Demo.vue';
import { provide, readonly, ref } from 'vue';

export default {
  name: 'App',
  components: {
    Demo,
  },
  setup() {
    let sum = ref(0);
    function add() {
      this.sum++;
    }
    provide('sum', readonly(sum)); //使用键值对形式传递
    provide('add', add);
    return {
      sum,
      add,
    };
  },
};
</script>
```

### 使用 inject

```vue
<template>
  <div>
    <h3>{{ sum }}</h3>
    <button @click="add">sum++</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Demo',

  setup(props, context) {
    let sum = inject('sum', 100); //第二个参数是默认值
    const add = inject('add');
    return {
      sum,
      add,
    };
  },
};
</script>

<style scoped></style>
```

## 响应式数据的判断

- isRef：检查一个值是否为一个 ref 对象。
- isReactive：检查一个对象是否是由 `reactive` 创建的响应式代理。
- isReadonly：检查一个对象是否是由 `readonly` 创建的只读代理。
- isProxy：检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理。

```js
let sum = ref(0);
let person = reactive({
  name: 'ppg',
});
let x = readonly(person);

console.log(isReadonly(x)); //true
console.log(isReactive(person)); //true
console.log(isRef(sum)); //true
console.log(isProxy(x)); //true
```
