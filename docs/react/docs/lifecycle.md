# 生命周期

生命周期是 React 组件从装载至卸载的全过程，这个过程中有多个钩子函数。

![生命周期](./images/life-cycle.png)

[生命周期在线图示](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

## constructor 构造器

在组件挂载前会先调用构造函数，在为 React.Component 的子类实现构造函数时，应当在所有语句之前调用 `super(props)`。构造器通常用于初始化 state 或者为事件处理函数绑定 this。

::: warning

构造器中初始化 state 时应该直接赋值而不是使用 setState，其他地方要修改 state 应该调用 setState。

:::

## `static getDerivedStateFromProps(props, state)`

此方法会在调用 render 方法前调用，并且在初始挂载及后续更新时都会调用，这个方法应当返回一个对象来更新 state，如果返回 null 则不更新任何内容。

```js
class Foo extends React.Component {
  static getDerivedStateFromProps(props, state) {
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>Foo</div>;
  }
}
```

## render

此方法是类组件中唯一必须要实现的方法，此函数应该是一个纯函数。

## `componentDidMount()`

此方法会在组件挂载后立即调用，此方法可以用来发起远程请求初始化数据等。

```jsx
const mockReq = () => {
  return new Promise(res => {
    setTimeout(() => {
      res({ value: '123' });
    }, 100);
  });
};
class Foo extends React.Component {
  state = {
    value: '',
  };
  render() {
    return (
      <div>
        <span>value: </span>
        <span>{this.state.value}</span>
      </div>
    );
  }
  async componentDidMount() {
    console.log('calling');
    const { value } = await mockReq();
    console.log(value);
    this.setState({ value });
  }
}
```

## `shouldComponentUpdate(nextProps, nextState)`

当组件因为 state 和 props 变化而发生更新时，在重新渲染前该函数会被触发。

此函数如果返回 true 那么将调用 render 继续进行组件的渲染，否则停止渲染，render 及后续其他生命周期函数将不会再被触发。

::: danger

此函数中不应该再调用 setState，否则会因为重新触发渲染而导致死循环。

:::

下面是一个例子，点击按钮递增，只有是传入 props 的倍数才重新渲染：

```jsx
class Foo extends React.Component {
  state = {
    value: 0,
  };
  render() {
    return (
      <div>
        <span>{this.state.value}</span>
        <button
          onClick={() => {
            this.setState({
              value: this.state.value + 1,
            });
          }}
        >
          click
        </button>
      </div>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { step } = nextProps;
    const { value } = nextState;
    return value % step === 0;
  }
}
```

## `getSnapshotBeforeUpdate(prevProps, prevState)`

此方法在最近一次渲染输出前调用，即提交到 DOM 节点之前，这可以让组件在发生更改前从 DOM 中捕获一些信息。

此方法的任何返回值将作为参数传递给 `componentDidUpdate()`。

例如，如果希望在更新后网页滚动的位置保持不变，可以在此方法中获取之前滚动的位置。

```jsx
class Foo extends React.Component {
  state = {
    arr: [],
  };
  ulRef = React.createRef();
  componentDidMount() {
    setInterval(() => {
      this.setState({ arr: [`item${this.state.arr.length}`, ...this.state.arr] });
    }, 1000);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.ulRef.current.scrollHeight;
  }

  componentDidUpdate(props, state, prevHeight) {
    this.ulRef.current.scrollTop += this.ulRef.current.scrollHeight - prevHeight;
  }

  render() {
    return (
      <div>
        <ul
          style={{ height: '200px', width: '400px', overflowY: 'auto', border: '1px solid #ccc' }}
          ref={this.ulRef}
        >
          {this.state.arr.map((item, index) => {
            return (
              <li key={index} style={{ height: '50px' }}>
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
```

scrollHeight 是只读属性，表示元素内容的整体高度，包括由于溢出导致在视线外的部分；scrollTop 是元素中被隐藏在滚动视图上方的元素高度。在 getSnapshotBeforeUpdate 中获取到的 scrollHeight 表示重新渲染之前的 ul 的高度，并将这个值返回给 componentDidUpdate 方法，此方法中再次获取到的 scrollHeight 的值为重新渲染之后的值，两者的差值就是新插入元素的高度，将 scrollTop 不断累加这个差值即可实现滚动条保持不变。

## `componentDidUpdate(nextProps, nextState, snapshot)`

此方法将会在每次重新渲染后触发。

```js
componentDidUpdate(nextProps, nextState, snapshot) {
  console.log(snapshot)
}
getSnapshotBeforeUpdate(prevProps, prevState) {
  return {
    prevProps,
    prevState
  }
}
```

## `componentWillUnmount()`

此方法会在组件卸载及销毁之前直接调用，此方法中不应该再调用 `setState()` 因为此组件将永远不会再渲染。

```jsx
class Foo extends React.Component {
  render() {
    return (
      <div>
        <h1>title</h1>
        <button
          onClick={() => {
            ReactDOM.unmountComponentAtNode(document.getElementById('test'));
          }}
        >
          remove
        </button>
      </div>
    );
  }
  componentWillUnmount() {
    console.log('GG');
  }
}
```
