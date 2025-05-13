# 新的组件

## Fragment

- 在 Vue2 中：组件必须有一个根标签。
- 在 Vue3 中：组件可以没有根标签,内部会将多个标签包含在一个 Fragment 虚拟元素中。
- 好处：减少标签层级,减小内存占用。

## Teleport

Teleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下渲染了 HTML，而不必求助于全局状态或将其拆分为两个组件。

例如：子组件中使用了对话框组件，希望点击按钮后弹出到页面中心

修改 Dialog.vue：

```vue
<template>
  <div>
    <button @click="isShow = true">弹窗</button>
    <teleport to="body"
      ><!--to属性指定了teleport标签内部的HTML渲染到的目标位置，使用选择器写法-->
      <div class="mask" v-if="isShow">
        <div class="dialog">
          <h3>弹窗</h3>
          <h4>something</h4>
          <h4>something</h4>
          <h4>something</h4>
          <button @click="isShow = false">关闭</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Dialog',
  setup() {
    let isShow = ref(false);

    return {
      isShow,
    };
  },
};
</script>

<style scoped>
.dialog {
  width: 300px;
  height: 300px;
  background-color: green;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
```

## Suspense

在网速较慢的情况下，默认引入会导致只有所有组件都准备好才渲染界面，使用异步引入则可以依次渲染，让应用有更好体验。

异步引入组件：

```js
import { defineAsyncComponent } from 'vue';

const A = defineAsyncComponent(() => import('./components/A.vue'));
export default {
  name: 'App',
  components: {
    A,
  },
  setup() {},
};
```

使用 `Suspense` 标签包裹组件，并使用提供的 `default` 与 `fallback` 插槽：

```vue
<template>
  <div class="app">
    <h3>APP</h3>
    <Suspense>
      <template v-slot:default>
        <A />
      </template>
      <template v-slot:fallback>
        <h3>loading</h3>
      </template>
    </Suspense>
  </div>
</template>
```

::: tip
使用 Suspense 包裹的组件中 setup 函数可以是 async 的。
:::
