# 插槽

父组件可以在子组件指定位置插入 HTML 结构，也是一种组件间通信方式，父组件传到子组件，如果子组件中不包含插槽，父组件中写在子组件标签中的所有内容都会丢失，如果没有东西要插入插槽，则子组件中插槽标签中的内容会作为默认值出现。

## 默认插槽

子组件中直接使用 `<slot></slot>` 标签，如果有多个插槽，则父组件中要插入的内容在每个插槽中都会重复出现：

```vue
<template>
  <div class="container">
    <Category :listData="foods">
      <img src="http://fenchingking.top/source/src/1291.jpg" width="200" height="300" />
    </Category>
    <Category :listData="games"> </Category>
    <Category :listData="films"> </Category>
  </div>
</template>
```

```vue
<template>
  <div class="category">
    <h3>{{ listData.title }}分类</h3>

    <slot>
      <ul>
        <li v-for="(item, index) in listData.data" :key="index">
          {{ item }}
        </li>
      </ul>
    </slot>
  </div>
</template>
```

## 具名插槽

使用 `slot` 标签的 name 属性用来区分插槽，如果一个 `slot` 没有显式指定 name 属性，则默认 name 为 `default`，父组件中可以在**任意标签**上使用 `slot` 属性指定插槽，从 vue2.6.0 起，这两个 attribute 已被废弃，应当使用 `v-slot` 指令指定插槽，但是这个指令*只能使用在 `template` 标签*上，且 `v-slot` 指令冒号后直接跟插槽名即可，不需要等号。

```vue
<Category :listData="foods">
    <img src="http://fenchingking.top/source/src/1291.jpg" height="25%" width="100%" slot="slot1">
    <img src="http://fenchingking.top/source/src/1292.jpg" height="25%" width="100%" slot="slot2">
    <img src="http://fenchingking.top/source/src/1293.jpg" height="25%" width="100%" slot="slot2">
    <template v-slot:slot2>
		<img src="http://fenchingking.top/source/src/1293.jpg" height="25%" width="100%">
    </template>
</Category>
```

```vue
<template>
  <div class="category">
    <h3>{{ listData.title }}分类</h3>

    <slot name="slot1">
      <ul>
        <li v-for="(item, index) in listData.data" :key="index">
          {{ item }}
        </li>
      </ul>
    </slot>
    <slot name="slot2"> </slot>
  </div>
</template>
```

::: tip
`v-slot:` 可以简写成 `#`，井号后接插槽名。
:::

## 作用域插槽

现有如下子模板：

```vue
<template>
  <div class="category">
    <h3>{{ foods.title }}分类</h3>
    <slot>
      {{ foods.title }}
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Category',
  // props:['listData'],
  data() {
    return {
      foods: { title: 'foods', data: ['foodA', 'foodB', 'foodC', 'foodD'] },
    };
  },
};
</script>
```

子模板默认显示的是 `foods.title` 属性，如果在父组件中要使显示内容改变，变为 `foods.data` 应当使用作用域插槽：

```vue
<slot :slotFoods="foods">
    {{foods.title}}
</slot>
```

使用 `v-bind` 指令将数据绑定到 `slot` 元素上，通过这种方式绑定的 attribute 称为**插槽 prop**，接下来通过 `slot-scope` 属性或 `v-slot` 指令将包含所有插槽 prop 的对象起个名字，然后通过这个对象去访问所有插槽 prop，`slot-scope` 已过时，vue2.6.0 后使用 `v-slot` 指令：

```vue
<template>
  <div class="container">
    <Category>
      <template slot-scope="ppg">
        <ul>
          <li v-for="(item, index) in ppg.slotFoods.data" :key="index">{{ item }}</li>
        </ul>
      </template>
    </Category>

    <Category>
      <template v-slot:default="ppg">
        <ol>
          <li v-for="(item, index) in ppg.slotFoods.data" :key="index">{{ item }}</li>
        </ol>
      </template>
    </Category>
  </div>
</template>
```

上述写法中，子组件中的插槽是默认插槽(没有 name 属性)，所有父组件中 `v-slot` 指令冒号后跟的是 default，如果子组件*仅有*默认插槽，则 default 也可不写，一旦子组件中包含具名插槽，则每个 `template` 都要指定插槽名，且如果 `v-slot` 使用简写形式，default 不能省略。

::: tip
只要出现多个插槽，请为所有的插槽使用完整的 `template` 语法。
:::
