# Effect

函数式组件不能使用类组件中的生命周期，但是生命周期的效果可以通过 Effect 实现（但是 Effect 不是生命周期），Effect 的定义就是“渲染引起的副作用”。

## 编写 Effect

编写 Effect 的步骤：

- 声明 Effect。默认情况下，Effect 会在每次渲染后都执行。
- 指定 Effect 依赖。大多数 Effect 应该按需执行，而不是每次渲染后都被执行。
- 必要时添加清理函数。有时 Effect 需要指定如何停止、撤销或者清除它的效果。

### 声明 Effect

```jsx
function MyVideo(props) {
  const ref = React.useRef(null);
  if (props.isPlaying) {
    ref.current.play();
  } else {
    ref.current.pause();
  }
  return (
    <>
      <video src={props.src} ref={ref} />
    </>
  );
}
function Player(props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  return (
    <div>
      <MyVideo isPlaying={isPlaying} src={props.src} />
      <br />
      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? 'pause' : 'play'}
      </button>
    </div>
  );
}
```

在上面的代码中，定义了两个组件，现在希望通过点击按钮来控制 video 的播放和暂停，但是不能直接在函数中通过 ref 操作 video 标签的 `play()` 和 `pause()` 方法，因为渲染过程中不能操作 DOM，而且在第一次渲染时还没有 DOM。

可以使用 Effect 将控制 video 的方法分离到渲染逻辑之外，让 React 先渲染好界面再调用 Effect 的内容：

```jsx
function MyVideo(props) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (props.isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });
  return (
    <>
      <video src={props.src} ref={ref} style={{ height: '900px', width: '500px' }} />
    </>
  );
}
```

当这个组件被渲染时，React 会首先刷新屏幕，确保元素出现在了 DOM 中，然后 React 执行 Effect，Effect 中根据 isPlaying 的值进行操作。

::: warning

由于渲染会触发 Effect，所以 Effect 中再调用 setState 会导致死循环。

:::

### 指定 Effect 依赖

一般情况下，Effect 将在每次渲染时都被调用，但是很多时候并不需要执行。例如上面的组件中，如果给 Player 增加一个 input 并绑定一个 state，那么每次修改这个 input 的内容都会导致 effect 被执行。

```jsx
function Player(props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [value, setValue] = React.useState('');
  return (
    <div>
      <MyVideo isPlaying={isPlaying} src={props.src} />
      <br />
      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? 'pause' : 'play'}
      </button>
      <br />
      <input
        value={value}
        onChange={event => {
          setValue(event.target.value);
        }}
      />
    </div>
  );
}
```

为了解决这个问题，useEffect 接收第二个参数，这个参数是一个数组，内容是在 Effect 中依赖的变量，每次渲染时进行判断，如果这个数组内的变量的值没有发生改变，那么将不会执行 Effect：

```jsx
function MyVideo(props) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    console.log('effect');
    if (props.isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [props.isPlaying]);
  return (
    <>
      <video src={props.src} ref={ref} style={{ height: '900px', width: '500px' }} />
    </>
  );
}
```

::: tip

React 是通过 `Object.is()` 方法进行比较的。

:::

::: warning

不传依赖数组和传递空依赖数组是不一样的：

```js
useEffect(() => {
  // 这里的代码会在每次渲染后执行
});

useEffect(() => {
  // 这里的代码只会在组件挂载后执行
}, []);
```

:::

### 添加清理函数

在一些场景中，例如在线聊天，需要在组件挂载时连接服务器并在卸载时断开连接。Effect 可以返回一个函数，每次重新执行 Effect 之前 React 都会调用清理函数，组件被卸载时也会调用清理函数。

```js
React.useEffect(() => {
  console.log('effect');
  return () => {
    console.log('GG');
  };
});
```

关于如何限制清理函数只在组件卸载时被调用见后文。

### 从 Effect 中读取 props 和 state 但是不响应

假设 Effect 中需要上报一个客户事件，这个事件需要上报一些事件属性，其中有的事件属性是 props 或者 state 中的内容，因此 Effect 的依赖项里必须要声明这些字段，但是事件是否上报可能只取决于其中一个字段，也就是说需要只对部分字段做出响应，可以通过 `useEffectEvent` 来声明 Effect 事件。

TODO: 非正式特性。

### 处理开发环境两次调用 Effect 的问题

在开发环境中，React 重复挂载组件会调用两次 Effect，Effect 中可能会有不能连续调用两次的 API，例如 modal 标签的 showModal 方法，这种情况下，可以通过返回一个清理函数解决，这个清理函数将状态重置回调用前从而允许下次的调用：

```jsx
class MockAPI {
  isClosed = true;
  call() {
    if (this.isClosed) {
      this.isClosed = false;
      return;
    } else {
      throw new Error('error status');
    }
  }
  close() {
    this.isClosed = true;
  }
}
const api = new MockAPI();
function MyVideo(props) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    console.log('effect');
    if (props.isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
    api.call();
    return () => api.close();
  }, [props.isPlaying]);
  return (
    <>
      <video src={props.src} ref={ref} style={{ height: '900px', width: '500px' }} />
    </>
  );
}
```

::: tip

与上面的例子类似，为了解决开发环境中 Effect 执行两次的问题，应当遵循下面的规范：

- 如果 Effect 中订阅了事件（例如 addEventListener），那么清理函数中应该退订事件。
- 如果 Effect 中获取了数据，那么清理函数要么终止上次的获取操作，要么忽略第二次的结果。终止操作可以通过第三方库 api 实现（如 axios）；忽略结果可以定义一个局部变量，在清理函数中修改此变量的值，并在发出请求前确认此变量。
- …………

总之，Effect 中的逻辑需要考虑重复调用产生的影响和处理。

:::
