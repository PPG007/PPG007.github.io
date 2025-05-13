# props

props 是传递给 JSX 标签的信息，可以将任意 JavaScript 值传递给一个组件，包括数组、对象和函数。

## 向组件传递 props

```html
<script type="text/babel">
  function PersonInfo(props) {
    return (
      <div>
        <span>{props.person.name}</span>
        <br />
        <span>{props.person.age}</span>
        <br />
        <button onClick={props.print(props.person)}>print</button>
      </div>
    );
  }
  const print = person => () => {
    console.log(person);
  };
  ReactDOM.render(
    <PersonInfo person={{ name: 'PPG007', age: 23 }} print={print} />,
    document.getElementById('test')
  );
</script>
```

函数式组件的参数是一个 props 对象，包含组件标签上传递的全部属性，也可以使用对象解构的写法：

```jsx
function PersonInfo({ person, print }) {
  return (
    <div>
      <span>{person.name}</span>
      <br />
      <span>{person.age}</span>
      <br />
      <button onClick={print(person)}>print</button>
    </div>
  );
}
```

::: warning

props 是只读的，在组件内不能修改。

:::

类组件的构造函数的入参是 props 对象，用法同函数式组件。

## 使用 JSX 展开语法传递 props

如果一个组件标签的属性过多，写起来很长，可以使用 JSX 的展开语法：

```jsx
function PersonInfo({ person, print }) {
  return (
    <div>
      <span>{person.name}</span>
      <br />
      <span>{person.age}</span>
      <br />
      <button onClick={print(person)}>print</button>
    </div>
  );
}
const print = person => () => {
  console.log(person);
};
const props = {
  person: {
    name: 'PPG007',
    age: 23,
  },
  print: print,
};
ReactDOM.render(<PersonInfo {...props} />, document.getElementById('test'));
```

## 将 JSX 作为子组件传递

组件之间发生嵌套时，父组件的 props 中将增加一个 children 属性：

```js
function Foo() {
  return <div>foo</div>;
}
function Bar({ children }) {
  return (
    <div>
      bar
      {children}
    </div>
  );
}
const dom = (
  <Bar>
    <Foo />
  </Bar>
);
ReactDOM.render(dom, document.getElementById('test'));
```

::: warning

如果组件发生了嵌套，那么如果父组件不在自己返回的 JSX 中显式地使用 children 属性，那么嵌套在其中的内容将不会被渲染。

:::

## 类组件传递 props

```jsx
class Time extends React.Component {
  render() {
    const props = {
      color: this.color,
      time: this.state.time,
    };
    return (
      <div>
        <Display {...props} />
        {this.children}
      </div>
    );
  }
  constructor(props) {
    super(props);
    const { color, children } = props;
    console.log(color, children);
    this.color = color;
    this.children = children;
    this.state = {
      time: new Date().toLocaleTimeString(),
    };
    setInterval(() => {
      this.setState({ time: new Date().toLocaleTimeString() });
    }, 1000);
  }
}

class Display extends React.Component {
  render() {
    const { color, time } = this.props;
    return (
      <div>
        <h2 style={{ color: color }}>{time}</h2>
      </div>
    );
  }
}
const dom = (
  <Time color={'skyblue'}>
    <span>123</span>
  </Time>
);
ReactDOM.render(dom, document.getElementById('test'));
```

## 使用 PropTypes 对 prop 做限制

[prop-types](https://github.com/facebook/prop-types)

prop-types 定义了很多限制，可以通过定义组件的 propTypes 静态属性定义校验规则， 通过 defaultProps 定义默认值。

```jsx
function Demo(props) {
  return <button onClick={props.onClick}>{props.text}</button>;
}
Demo.defaultProps = {
  text: 'default text',
  onClick: () => {
    console.log('default click');
  },
};
Demo.propTypes = {
  text: PropTypes.string,
};
ReactDOM.render(<Demo text={123} />, document.getElementById('test'));
```

上面的代码中限制了 text 是一个字符串类型，开发环境中控制台会输出报错，类组件使用方式类似，只要定义 propTypes 静态变量即可。
