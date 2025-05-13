# 组件

## 函数式组件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>hello</title>
  </head>
  <body>
    <div id="test"></div>
  </body>
  <script type="text/javascript" src="../js/react.development.js"></script>
  <script type="text/javascript" src="../js/react-dom.development.js"></script>
  <script type="text/javascript" src="../js/babel.min.js"></script>
  <script type="text/babel">
    function Demo() {
      return <h2>component</h2>;
    }
    ReactDOM.render(<Demo />, document.getElementById('test'));
  </script>
</html>
```

函数式组件是一个返回 DOM 的函数，首字母要大写以表示这是一个组件。

嵌套函数式组件：

```html
<script type="text/babel">
  const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
  function ReaderLi(languages = []) {
    return languages.map((language, index) => <li key={index}>{language}</li>);
  }
  function Demo() {
    return <ul>{ReaderLi(languages)}</ul>;
  }
  ReactDOM.render(<Demo />, document.getElementById('test'));
</script>
```

## 类组件

除了使用函数定义组件，也可以使用类声明组件：

```html
<script type="text/babel">
  const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
  class ListComponent extends React.Component {
    render() {
      return <ul>{this.getListItems()}</ul>;
    }
    getListItems() {
      return this.props.data.map((d, index) => <li key={index}>{d}</li>);
    }
  }
  ReactDOM.render(<ListComponent data={languages} />, document.getElementById('test'));
</script>
```

## 响应事件

React 中标签属性都使用驼峰命名，事件处理同样如此。

```html
<script type="text/babel">
  function MyButton() {
    return <button onClick={clickHandler}>click</button>;
  }
  function clickHandler() {
    console.log('click');
  }
  ReactDOM.render(<MyButton />, document.getElementById('test'));
</script>
```

还可以使用内联事件处理器：

```html
<script type="text/babel">
  function MyButton() {
    return (
      <button
        onClick={() => {
          console.log('click');
        }}
      >
        click
      </button>
    );
  }
  ReactDOM.render(<MyButton />, document.getElementById('test'));
</script>
```

事件处理函数会捕获子组件的事件，也就是冒泡，如果想要阻止事件向上传播，可以调用 `stopPropagation()` 方法：

```html
<script type="text/babel">
  const dom = (
    <>
      <div
        style={{ width: '600px', height: '600px', backgroundColor: 'blue' }}
        onClick={() => {
          console.log('click out div');
        }}
      >
        <div
          style={{ width: '300px', height: '300px', backgroundColor: 'yellow' }}
          onClick={event => {
            event.stopPropagation();
            console.log('click inner div');
          }}
        ></div>
      </div>
    </>
  );
  ReactDOM.render(dom, document.getElementById('test'));
</script>
```

部分情况下，可能希望能够捕获子组件的全部事件，即使子组件阻止了冒泡，那么可以通过在事件名称末尾加入 Capture 来实现：

```html
<script type="text/babel">
  const dom = (
    <>
      <div
        style={{ width: '600px', height: '600px', backgroundColor: 'blue' }}
        onClickCapture={() => {
          console.log('click out div');
        }}
      >
        <div
          style={{ width: '300px', height: '300px', backgroundColor: 'yellow' }}
          onClick={event => {
            event.stopPropagation();
            console.log('click inner div');
          }}
        ></div>
      </div>
    </>
  );
  ReactDOM.render(dom, document.getElementById('test'));
</script>
```

::: tip 事件的处理顺序

- 向下传播（从外到内）调用所有的 `onXXXCapture` 函数。
- 调用实际发生事件的组件的 `onXXX` 函数。
- 向上传播，调用所有的 `onXXX` 函数。

:::

有的事件具有默认的行为，例如表单 form 的 submit 事件会触发表单的提交事件导致重新加载整个页面，可以通过 `preventDefault()` 方法阻止默认行为：

```html
<script type="text/babel">
  const dom = (
    <>
      <form
        onSubmit={event => {
          event.preventDefault();
          console.log('submit');
        }}
      >
        <button>submit</button>
      </form>
    </>
  );
  ReactDOM.render(dom, document.getElementById('test'));
</script>
```

### 函数柯里化

柯里化是将一个接收多个参数的函数转为一个接收单一参数但是返回值是一个函数，且这个返回的函数接收下一个参数并再次返回函数，一直向下，例如：

```js
// 普通函数
fn(1, 2, 3, 4);
// 柯里化后
fn(1)(2)(3)(4);
```

下面的函数可以将一个函数柯里化：

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
```

然后可以用如下方式调用：

```js
function sum(a, b) {
  return a + b;
}

const ss = curry(sum);
console.log(ss(1)(2));
```

当然也可以反柯里化：

```js
function uncurry(fn) {
  return (...args) => {
    let result = fn;
    args.forEach(arg => {
      result = result(arg);
    });
    return result;
  };
}

console.log(uncurry(curry(sum))(1, 2));
```

react 中，事件处理函数应当传入一个函数，但是默认情况下这个回调函数只会收到一个 event 对象作为入参，如果希望传递自定义参数，那么可以使用函数柯里化。

```jsx
function Demo() {
  const languages = ['Java', 'JavaScript', 'Go'];
  const clickHandler = (language, event) => {
    console.log(language);
    console.log(event.target);
  };
  return (
    <ul>
      {languages.map(language => {
        return (
          <li key={language}>
            <button onClick={curry(clickHandler)(language)}>{language}</button>
          </li>
        );
      })}
    </ul>
  );
}
```

在上面的例子中，有一个按钮列表，每个按钮都有点击事件处理函数，点击每个按钮要输出不同的内容，将普通函数柯里化之后传入 onClick 属性，原函数接收两个参数，由于 onClick 里只传了一个入参，所以函数不会发生调用，而是实际发生事件时才会调用。
