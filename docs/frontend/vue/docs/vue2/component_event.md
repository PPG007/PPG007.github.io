# 组件自定义事件

## 绑定自定义事件

父组件定义一个方法：

```js
f1(str){
    console.log(str);
}
```

父组件为子组件绑定事件：

写法一：

```vue
<Start :send="receive" v-on:event="f1" />
```

子组件：

```vue
<template>
  <div class="todo-header" @click="myEvent"></div>
</template>
<script>
export default {
  name: 'Start',
  methods: {
    myEvent() {
      this.$emit('event', 'test');
    },
  },
};
</script>
```

调用 `$emit()` 方法，第一个参数是父组件给子组件绑定的事件的名字，后面参数为要传递给父组件中定义的方法的参数。

自定义事件也可以使用修饰符：

```html
@event.once="f1"
```

写法二,使用 `ref` 属性：

父组件：

```html
<Start :send="receive" ref="ref1" />
```

```js
mounted() {
    let temp = localStorage.getItem("todos");
    if (temp){
        this.todos=JSON.parse(temp).todos;
    }
    this.$refs.ref1.$on('event',this.f1);
},
```

使用修饰符：

```js
this.$refs.ref1.$once('event', this.f1);
```

写法二虽然复杂，但是更加灵活，可以控制绑定的时机等等。

## 解绑自定义事件

### 解绑单个事件

子组件中：

```js
mounted() {
    setTimeout(()=>{
        this.$off('event')
        console.log('自定义事件解绑了')
    },10000);
}
```

10秒后事件被解绑

### 解绑多个事件

子组件中：

```js
mounted() {
    setTimeout(()=>{
        this.$off(['event1', 'event2])
        console.log('自定义事件解绑了')
    },5000);
}
```

使用数组传递所有要解绑的事件。

### 解绑所有事件

子组件中：

```js
mounted() {
    setTimeout(()=>{
        this.$off()
        console.log('自定义事件解绑了')
    },5000);
}
```

解绑的是所有自定义事件，原有的鼠标点击事件等不会解绑

## 给组件绑定原生事件

使用 `native` 修饰符，绑定的原生事件解绑自定义事件后仍然有效：

```html
<Start :send="receive" @click.native="demo('123')" />
```

## 总结

组件自定义事件：

- 一种组件间通信方式(子组件传递数据到父组件)。
- 使用场景：A 是父组件，B 是子组件，B 想给 A 传递数据，就要在 A 中为 B 绑定自定义事件，事件回调在 A 中定义。
- 绑定自定义事件：

  - 第一种方式：

    在父组件中使用 `<Component v-on:自定义事件名="回调函数"></Component>`。

  - 第二种方式：
    在父组件中使用 ref 属性。

    ```html
    <Start ref="demo" />
    ```

    ```js
    mounted() {
        this.$refs.demo.$on('demo',this.demo);
    },
    ```

- 如果想让事件只触发一次或其他限制，使用 `.once` 修饰符或 `$once()` 方法或其他修饰符或方法。
- 子组件触发自定义事件：

  定义一个方法，使用原生事件触发这个事件并在这个方法中调用自定义的事件。

  ```js
  myEvent(){
      this.$emit('demo','test');
  }
  ```

- 解绑自定义事件：

  子组件中：

  ```js
  //解绑一个事件
  this.$off('demo');
  //解绑多个事件
  this.$off(['demo', 'demo2']);
  //解绑所有自定义事件
  this.$off();
  ```

- 组件绑定原生 DOM 事件：使用 `.native` 修饰符。

::: warning 注意
通过 `this.$refs.xxx.$on('event',callback)` 绑定自定义事件时，如果把 callback 直接写成函数，要使用箭头函数，这样回调方法中 this 才是当前组件对象，如果是普通函数，this 指向的是触发这个自定义事件的组件对象，即父组件对象，或者在 methods 中定义回调函数。
:::
