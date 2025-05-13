# ref

如果希望组件记住某些信息在之前可以使用 state，但是修改 state 会重新渲染页面，如果希望不渲染页面可以使用 ref。

下面是一个例子，每次点击按钮会在控制台输出点击的总次数：

```html
<script type="text/babel">
  function RefDemo() {
    const ref = React.useRef(0);
    return (
      <button
        onClick={() => {
          ref.current++;
          console.log(ref.current);
        }}
      >
        click
      </button>
    );
  }
  ReactDOM.render(<RefDemo />, document.getElementById('test'));
</script>
```

和 state 一样，ref 可以指向任何东西，与 state 相比，ref 是一个普通的 JavaScript 对象，具有可以被读取和修改的 current 属性。

::: tip

与 state 一样，ref 会在每次重新渲染之间被保留，但是设置 state 会触发渲染，修改 ref 则不会。

:::

接下来制作一个秒表，需要显示时间、开始按钮、停止按钮，这涉及到页面的渲染，因此，显示的时间要用 state，计时实际上就是每隔一段时间刷新页面上的计数，这可以通过 `setInterval` 来实现，因为需要停止功能，所以需要通过 `setInterval` 的返回值停止计时器，因此，计时器 id 可以使用 ref 实现。

```html
<script type="text/babel">
  function RefDemo() {
    const start = React.useRef(null);
    const intervalId = React.useRef(null);
    const [now, setNow] = React.useState(null);
    return (
      <div>
        <span>{now && start ? (now - start.current) / 1000 : (0.0).toFixed(3)}</span>
        <br />
        <button
          onClick={() => {
            start.current = Date.now();
            setNow(start.current);
            intervalId.current = setInterval(() => {
              setNow(Date.now());
            }, 10);
          }}
        >
          start
        </button>
        <br />
        <button
          onClick={() => {
            clearInterval(intervalId.current);
          }}
        >
          stop
        </button>
      </div>
    );
  }
  ReactDOM.render(<RefDemo />, document.getElementById('test'));
</script>
```

因为类组件中修改 state 只会调用 render 方法，成员变量还在，所以上面的场景不需要 ref 即可实现。

## ref 操作 DOM

当需要直接操作一个 DOM 节点时，可以使用 ref，例如现在有一个输入框和一个按钮，点击按钮聚焦到输入框中：

```jsx
function Focus() {
  const ref = React.useRef(null);
  return (
    <div>
      <input ref={ref} />
      <button
        onClick={() => {
          ref.current.focus();
        }}
      >
        focus
      </button>
    </div>
  );
}
```

对于类组件，通过 createRef 来实现上面的效果：

```jsx
class Focus extends React.Component {
  render() {
    return (
      <div>
        <input ref={this.inputRef} />
        <button
          onClick={() => {
            this.inputRef.current.focus();
          }}
        >
          focus
        </button>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
}
```

对于类组件，ref 可以使用字符串形式，但是此形式已过时：

```jsx
class Demo extends React.Component {
  render() {
    return (
      <div>
        <input ref="input" />
        <button
          onClick={() => {
            console.log(this.refs.input.value);
          }}
        >
          click
        </button>
      </div>
    );
  }
}
```

标签的 ref 的值也可以是一个纯函数，此函数的入参就是这个标签，可以将这个标签赋值给一个变量，通过此变量就能操作 DOM：

```jsx
class Demo extends React.Component {
  render() {
    return (
      <div>
        <input
          ref={ref => {
            this.inputRef = ref;
          }}
        />
        <button
          onClick={() => {
            console.log(this.inputRef.value);
          }}
        >
          click
        </button>
      </div>
    );
  }
}
```

### ref 访问其他组件的 DOM

react 禁止一个组件通过 ref 访问其他组件，即使是自己的子组件，但是允许一个组件选择接收父组件的 ref，可以通过 `forwardRef` 方法将父组件传来的 ref 交给组件内的其他组件或者标签，例如有以下例子，点击按钮聚焦到封装的 input 上：

```jsx
const MyInput = React.forwardRef((props, ref) => {
  return <input ref={ref} placeholder="my input" />;
});

function MyForm() {
  const inputRef = React.useRef(null);
  return (
    <div>
      <MyInput ref={inputRef} />
      <button
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        focus
      </button>
    </div>
  );
}
```

上面的代码中，MyInput 组件将父组件传递来的 ref 传递给了 input 标签，现在点击按钮可以成功聚焦了。

通过持有 ref 就可以对 DOM 进行操作，包括修改样式，如果希望控制 ref 暴露的功能，例如只能执行聚焦操作而不能修改样式，可以使用 `useImperativeHandle`：

```jsx
const MyInput = React.forwardRef((props, ref) => {
  const realRef = React.useRef(null);
  React.useImperativeHandle(ref, () => {
    return {
      ppg() {
        realRef.current.focus();
      },
    };
  });
  return <input ref={realRef} placeholder="my input" />;
});

function MyForm() {
  const inputRef = React.useRef(null);
  return (
    <div>
      <MyInput ref={inputRef} />
      <button
        onClick={() => {
          inputRef.current.ppg();
        }}
      >
        focus
      </button>
      <button
        onClick={() => {
          inputRef.current.style.borderRadius = '10px';
        }}
      >
        change border
      </button>
    </div>
  );
}
```

useImperativeHandle 第一个参数是一个 ref，第二个参数是一个函数，返回一个对象，这样第一个参数 ref 身上只会带有返回对象上的内容。

## 受控组件和非受控组件

受控组件：

- 元素的值或者状态由 state 控制。
- 当元素发生交互，会触发一个事件处理函数，该函数更新 state。
- 受控组件总是显示 state 中的值。

非受控组件：

- 元素的值或者状态直接由 DOM 管理。
- 通过 ref 操作。

大多数情况下，推荐使用受控组件，这可以使数据流更加清晰可预测。

例如，以下是将 input 作受控组件使用：

```jsx
function Demo() {
  const [value, setValue] = React.useState('');
  return (
    <div>
      <input
        value={value}
        onChange={event => {
          setValue(event.target.value);
        }}
      />
      <br />
      <span>{value}</span>
    </div>
  );
}
```

以下是将 input 作非受控组件使用：

```jsx
function Demo() {
  const inputRef = React.useRef(null);
  const [value, setValue] = React.useState('');
  return (
    <div>
      <input
        ref={inputRef}
        onChange={() => {
          setValue(inputRef.current.value);
        }}
      />
      <br />
      <span>{value}</span>
    </div>
  );
}
```
