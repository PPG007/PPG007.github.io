# 组件

## 函数式组件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>hello</title>
</head>
<body>
<div id="test">

</div>
</body>
<script type="text/javascript" src="../js/react.development.js"></script>
<script type="text/javascript" src="../js/react-dom.development.js"></script>
<script type="text/javascript" src="../js/babel.min.js"></script>
<script type="text/babel">
    function Demo() {
        return <h2>component</h2>
    }
    ReactDOM.render(<Demo/>, document.getElementById('test'));
</script>
</html>
```

函数式组件是一个返回 DOM 的函数，首字母要大写以表示这是一个组件。

嵌套函数式组件：

```html
<script type="text/babel">
    const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
    function ReaderLi(languages = []) {
        return languages.map((language, index) => <li key={index}>{language}</li>)
    }
    function Demo() {
        return <ul>{ReaderLi(languages)}</ul>
    }
    ReactDOM.render(<Demo/>, document.getElementById('test'));
</script>
```

## 类组件

除了使用函数定义组件，也可以使用类声明组件：

```html
<script type="text/babel">
    const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
    class ListComponent extends React.Component {
        render() {
            return (
                <ul>{this.getListItems()}</ul>
            );
        }
        getListItems() {
            return this.props.data.map((d, index) => <li key={index}>{d}</li>)
        }
    }
    ReactDOM.render(<ListComponent data={languages}/>, document.getElementById('test'));
</script>
```

## 响应事件

React 中标签属性都使用驼峰命名，事件处理同样如此。

```html
<script type="text/babel">
    function MyButton() {
        return <button onClick={clickHandler}>click</button>
    }
    function clickHandler() {
        console.log('click')
    }
    ReactDOM.render(<MyButton/>, document.getElementById('test'));
</script>
```

还可以使用内联事件处理器：

```html
<script type="text/babel">
    function MyButton() {
        return <button onClick={() => {console.log('click')}}>click</button>
    }
    ReactDOM.render(<MyButton/>, document.getElementById('test'));
</script>
```

事件处理函数会捕获子组件的事件，也就是冒泡，如果想要阻止事件向上传播，可以调用 `stopPropagation()` 方法：

```html
<script type="text/babel">
    const dom = (
        <>
            <div style={{width: '600px', height: '600px', backgroundColor: 'blue'}} onClick={() => {console.log('click out div')}}>
                <div
                    style={{width: '300px', height: '300px', backgroundColor: 'yellow'}}
                    onClick={(event) => {
                        event.stopPropagation();
                        console.log('click inner div')
                    }}
                >

                </div>
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
            <div style={{width: '600px', height: '600px', backgroundColor: 'blue'}} onClickCapture={() => {console.log('click out div')}}>
                <div
                    style={{width: '300px', height: '300px', backgroundColor: 'yellow'}}
                    onClick={(event) => {
                        event.stopPropagation();
                        console.log('click inner div')
                    }}
                >

                </div>
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
            <form onSubmit={(event) => {
                event.preventDefault();
                console.log('submit');
            }}>
                <button>submit</button>
            </form>
        </>
    );
    ReactDOM.render(dom, document.getElementById('test'));
</script>
```
