# 消息订阅与发布

::: tip
消息订阅与发布是一种解决通信问题的思想，这里使用 `pubsub-js` 库。
:::

## 安装 `pubsub-js`

```powershell
npm i pubsub-js
```

## 引入 `pubsub`

```js
import pubsub from 'pubsub-js';
```

## 接收数据

```js
mounted() {
    this.channel=pubsub.subscribe('test',(msg,data)=>{
        console.log("频道：" + msg);
        console.log(data);
    })
},
beforeDestroy() {
    pubsub.unsubscribe(this.channel);
}
```

调用 pubsub 的 `subscribe()` 方法订阅消息，返回一个 ID，第一个参数是订阅的消息的名字，第二个参数是回调函数，此处回调函数如果写成普通函数，则回调函数中的 `this` 是 undefined，应当写成箭头函数，或者在 `methods` 中定义函数并在 `subscribe` 中传入。

## 发送数据

```js
pubsub.publish('test', '发布成功');
```

调用 pubsub 的 `publish()` 方法发布消息，第一个参数是消息，对应订阅中的第一个参数，第二个参数是要传递的数据。
