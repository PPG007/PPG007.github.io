# 全局事件总线

全局事件总线：

一种组件间通信方式，适用于*任意组件通信*.

## 设置全局总线

main.js 中通过为 Vue 原型对象添加属性实现创建总线，且该总线能够访问所有的 Vue 对象方法:

```js
new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
}).$mount('#app');
```

## 使用事件总线

### 接收数据

A 组件要接收数据，A 组件中在总线上创建自定义事件:

```js
mounted() {
    this.$bus.$on('getInfo',(student,school)=>{
        if (school){
            this.school={'name':school.name,'address':school.address};
        }
        if (student){
            this.student={'name':student.name,'age':student.age};
        }
    })
}
```

### 发送数据

B 组件要发送数据，B 组件中调用 `$emit()` 方法调用其他组件创建的自定义事件并传递数据:

```js
methods:{
    showAll(){
        this.$bus.$emit('getInfo',{'name':this.name,'age':this.age});
    }
}
```

::: tip
最好在 `beforeDestroy()` 中解绑自己创建的事件：

```js
  beforeDestroy() {
    this.$bus.$off('getInfo');
  }
```

:::
