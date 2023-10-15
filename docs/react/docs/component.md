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

## state

很多时候需要修改一个变量的值来实现响应式，这需要通过 state 来实现，首先是不使用 state 的例子：

```html
<script type="text/babel">
    function MyComponent() {
        let index = 0;
        return (
            <div>
                <button onClick={() => {index++}}>click</button>
                <span>{index}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

上面的代码不会修改页面上现实的数值，不会发生变化的原因：

- 局部变量无法在多次渲染中持久保存，当再次渲染这个组件时会从头开始渲染而不会考虑之前对局部变量的任何更改。
- 更改局部变量不会触发渲染。

要使用数据动态更新页面，需要两步操作：

- 保留渲染之间的数据。
- 触发重新渲染的逻辑。

通过 useState 可以实现这个要求：

```html
<script type="text/babel">
    function MyComponent() {
        let [index, setIndex] = React.useState(0);
        return (
            <div>
                <button onClick={() => {setIndex(index+1)}}>click</button>
                <span>{index}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

useState 方法接收一个值并作为返回变量的初始值，此方法返回一个数组，数组第一个元素为创建的变量，第二个元素为这个变量的 setter，通过调用 setter 即可实现对变量值的修改，以下是实际的情况：

- 组件进行第一次渲染，因为将 0 传递给了 useState，React 记住 0 是 state 的最新值。
- 调用 setter 更新了 state，React 记住当前 index 是 1 并触发下一次渲染。
- 组件进行下一次渲染，React 仍然看到 `useState(0)`，但是因为第二步，所以返回的 index 值就变成了 1。

setter 方法接收一个 nextState，它可以是任意类型的值，如果传递的是函数，那么这个函数必须是纯函数，且只接受当前 state 作为唯一的参数。

::: tip 纯函数

纯函数是函数式编程的概念，需要满足一下两个主要条件：

- 相同的输入总是产生相同的输出。
- 没有副作用，例如不会修改外部变量、进行 I/O 操作、修改 DOM、调用其他纯函数等。

:::

```html
<script type="text/babel">
    function MyComponent() {
        let [index, setIndex] = React.useState(0);
        return (
            <div>
                <button onClick={() => {setIndex((index) => index+10)}}>click</button>
                <span>{index}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

注意事项：

- setter 方法仅更新下一次渲染的状态变量，如果在 set 函数后读取状态变量，则仍然会得到之前的值。
- React 会批量处理状态的更新，它会在所有的事件处理函数运行并调用 setter 函数后更新页面，这可以防止在单个事件期间多次重新渲染。
- 在严格模式中，React 将两次调用传入 `useState` 或者是 setter 的更新函数以确保这是纯函数，如果两次调用结果相同则其中一次调用结果将被忽略（仅在开发环境有此行为）。

参考下面的代码，由于 setter 方法仅更新下一次渲染的状态变量，而且 React 是批量处理状态的更新，所以下面传入 setter 的 index 值相同，所以实际上点击一次按钮页面只会加一。

```html
<script type="text/babel">
    function MyComponent() {
        let [index, setIndex] = React.useState(0);
        return (
            <div>
                <button onClick={() => {
                    setIndex(index+1);
                    setIndex(index+1);
                }}>click</button>
                <span>{index}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

但是如果使用的状态更新函数，那么调用多少次 setter 就会生效多少次：

```html
<script type="text/babel">
    function MyComponent() {
        let [index, setIndex] = React.useState(0);
        return (
            <div>
                <button onClick={() => {
                    setIndex((index) => index+1);
                }}>click</button>
                <span>{index}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

为了避免重复创建初始状态提高性能，useState 的参数可以传入初始化函数，这同样必须是一个纯函数：

```html
<script type="text/babel">
    // init 将只输出一次
    function getInitialIndex() {
        console.log('init')
        return 0;
    }
    function MyComponent() {
        let [index, setIndex] = React.useState(getInitialIndex);
        return (
            <div>
                <button
                    onClick={() => {setIndex(index+1)}}
                >
                    click
                </button>
                <span>{index}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

当存在多个变量时，可以使用对象替代多个 useState 调用：

```html
<script type="text/babel">
    function MyComponent() {
        let [person, setPerson] = React.useState({name: 'PPG007', age: 23});
        return (
            <div>
                <button
                    onClick={() => {setPerson(({name, age}) => {
                        return {
                            name: name + '_1',
                            age: age+1,
                        }
                    })}}
                >
                    click
                </button>
                <br/>
                <span>{person.name}</span>
                <br/>
                <span>{person.age}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

::: warning

### state 更新对象

当 state 变量是一个对象时，不能只更新其中一个字段而不显式复制其他字段，所以上面的例子中如果只希望每次点击年龄加 1 而名字不做改动，那么不能写成 `setPerson({age: age+1})`，如果希望只设置一部分字段，那么应该使用对象展开，例如：

```html
<script type="text/babel">
    function MyComponent() {
        let [person, setPerson] = React.useState({name: 'PPG007', age: 23});
        return (
            <div>
                <button
                    onClick={() => {setPerson(({name, age}) => {
                        return {
                            ...person,
                            age: age+1,
                        }
                    })}}
                >
                    click
                </button>
                <br/>
                <span>{person.name}</span>
                <br/>
                <span>{person.age}</span>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'));
</script>
```

:::

state 是隔离且私有的，如果渲染同一个组件多次，每个副本都会有完全隔离的 state，改变一个不会影响另一个，例如：

```html
<script type="text/babel">
    function MyComponent() {
        let [person, setPerson] = React.useState({name: 'PPG007', age: 23});
        return (
            <div>
                <button
                    onClick={() => {setPerson(({name, age}) => {
                        return {
                            ...person,
                            age: age+1,
                        }
                    })}}
                >
                    click
                </button>
                <br/>
                <span>{person.name}</span>
                <br/>
                <span>{person.age}</span>
            </div>
        )
    }
    const dom = (
        <div>
            <MyComponent/>
            <br/>
            <MyComponent/>
        </div>
    );
    ReactDOM.render(dom, document.getElementById('test'));
</script>
```

### state 更新数组

与处理对象相同，在更新 state 中的数组时，需要创建一个新数组并将其设置为新的 state。这意味着不能通过访问数组下表直接修改数组，也不应该使用 `push` 等修改原始数组的方法，在操作 React state 中的数组时，避免使用左侧的方法，首选右侧的方法：

|   |避免使用（修改原数组）|建议使用（返回新数组）|
|---|--------------------|--------------------|
|添加元素|`push`, `unshift`|`concat`, `[...arr]`|
|删除元素|`pop`, `shift`, `splice`|`filter`, `slice`|
|替换元素|`splice`, `arr[i]=...`|`map`|
|排序|`reverse`, `sort`|先复制一份数组|

向数组中添加、删除元素：

```html
<script type="text/babel">
    function MyComponent() {
        const [values, setValues] = React.useState([]);
        const [value, setValue] = React.useState('');
        return (
            <div>
                <input onChange={(event) => {setValue(event.target.value)}} value={value}/>
                <button onClick={() => {
                    if (value === '') {
                        return;
                    }
                    setValues([...values, value])
                    setValue('')
                }}>add</button>
                <br/>
                <ul>
                    {values.map((value, index) => {
                        return (
                            <li key={index}>
                                {value}
                                <button onClick={() => {
                                    setValues((values) => {
                                        return values.filter((v, ii) => {
                                            return ii !== index
                                        })
                                    })
                                }}>delete</button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'))
</script>
```

更新数组内部的对象：

```html
<script type="text/babel">
    const items = [
        {
            name: 'PPG007',
            age: '23',
        },
    ];

    function MyComponent() {
        const [a, setA] = React.useState(items);
        const [b, setB] = React.useState(items);
        function grow(items, index, setter) {
            const temp = [...items];
            const target = temp.find((v, i) => {
                return i === index
            });
            target.age++;
            setter(temp);
        }
        return (
            <div>
                <h1>A</h1>
                <ul>
                    {
                        a.map((v, index) => {
                            return (
                                <li key={index}>
                                    {v.name} __ {v.age}
                                    <button onClick={() => {grow(a, index, setA)}}>grow</button>
                                </li>
                            )
                        })
                    }
                </ul>
                <h1>B</h1>
                <ul>
                    {
                        b.map((v, index) => {
                            return (
                                <li key={index}>
                                    {v.name} __ {v.age}
                                    <button onClick={() => {grow(b, index, setB)}}>grow</button>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'))
</script>
```

在上面的代码中，点击按钮会发现操作同时影响了 a 和 b，这是因为数组展开拷贝是浅拷贝，拷贝出的数组中的元素指向的还是同一个对象，所以直接找到对象并修改会导致这个问题，可以通过 map 解决：

```js
function grow(items, index, setter) {
    setter(items.map((item, i) => {
        if (index === i) {
            return {
                name: item.name,
                age: item.age+1,
            }
        }
        return item;
    }))
}
```

### 类组件的 state

通过继承 React Component 类来定义组件类，这个组件类中有一个 state 变量，将数据存储在这里然后调用实例方法 `setState()` 即可实现 state 更新：

```html
<script type="text/babel">
    class MyComponent extends React.Component {
        render() {
            return (
                <div>
                    <button onClick={this.growUp}>click</button>
                    <br/>
                    <span>{this.state.name}</span>
                    <br/>
                    <span>{this.state.age}</span>
                </div>
            );
        }
        constructor(props) {
            super(props);
            this.state = {
                name: props.name,
                age: props.age,
            };
        }
        // 这里要使用箭头函数赋值，同时不能定义成一般函数，而是要赋值给一个成员变量，
        // 因为需要使用箭头函数，由于箭头函数中 this 指向外层的 this，
        // 通过这种方式防止事件回调时 this 时 undefined。
        growUp = () => {
            this.setState({age: this.state.age+1});
        }
    }
    ReactDOM.render(<MyComponent name="PPG007" age={23}/>, document.getElementById('test'));
</script>
```

setState 如果是设置对象的话，只会设置传入的字段，不会覆盖没传入的字段，这与 useState 不同，此外 setState 还有两种用法：

```js
// 通过更新函数（纯函数）传参
this.setState((self) => {
    return {
        age: self.age+1,
    }
})
// 设置状态更新并重新渲染后的回调函数
this.setState({age: this.state.age+1}, () => {console.log('updated')})
```

setState 更新数组时可以不必构造新数组，可以直接通过下标修改：

```html
<script type="text/babel">
    const items = [
        {
            name: 'PPG007',
            age: 23,
        },
        {
            name: 'LiHua',
            age: 24,
        },
    ];
    class MyComponent extends React.Component {
        render() {
            return (
                <div>
                    <ul>
                        {
                            this.state.items.map((item, index) => {
                                return (
                                    <li key={index}>
                                        {item.name}__{item.age}
                                        <button onClick={() => {this.grow(index)}}>grow</button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            );
        }
        grow = (index) => {
            this.setState((state) => {
                state.items[index].age++;
                return state
            })
        }
        state = {items}
    }
    ReactDOM.render(<MyComponent/>, document.getElementById('test'))
</script>
```

::: tip

无论是 useState 还是 setState，都建议创建一个新的副本而不是直接修改原始状态，主要原因：

- 不变性：保持状态的不变性可以简化复杂的 UI 逻辑和提高组件的性能。
- 批量更新：React 会批量处理多个 state 改动，导致状态的更新不会立即渲染，通过不变的数据和基于前一个状态的函数式更新可以确保状态的正确。

:::
