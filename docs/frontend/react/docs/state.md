# state

很多时候需要修改一个变量的值来实现响应式，这需要通过 state 来实现，首先是不使用 state 的例子：

```html
<script type="text/babel">
  function MyComponent() {
    let index = 0;
    return (
      <div>
        <button
          onClick={() => {
            index++;
          }}
        >
          click
        </button>
        <span>{index}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
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
        <button
          onClick={() => {
            setIndex(index + 1);
          }}
        >
          click
        </button>
        <span>{index}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
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
        <button
          onClick={() => {
            setIndex(index => index + 10);
          }}
        >
          click
        </button>
        <span>{index}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
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
        <button
          onClick={() => {
            setIndex(index + 1);
            setIndex(index + 1);
          }}
        >
          click
        </button>
        <span>{index}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
</script>
```

但是如果使用的状态更新函数，那么调用多少次 setter 就会生效多少次：

```html
<script type="text/babel">
  function MyComponent() {
    let [index, setIndex] = React.useState(0);
    return (
      <div>
        <button
          onClick={() => {
            setIndex(index => index + 1);
          }}
        >
          click
        </button>
        <span>{index}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
</script>
```

为了避免重复创建初始状态提高性能，useState 的参数可以传入初始化函数，这同样必须是一个纯函数：

```html
<script type="text/babel">
  // init 将只输出一次
  function getInitialIndex() {
    console.log('init');
    return 0;
  }
  function MyComponent() {
    let [index, setIndex] = React.useState(getInitialIndex);
    return (
      <div>
        <button
          onClick={() => {
            setIndex(index + 1);
          }}
        >
          click
        </button>
        <span>{index}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
</script>
```

当存在多个变量时，可以使用对象替代多个 useState 调用：

```html
<script type="text/babel">
  function MyComponent() {
    let [person, setPerson] = React.useState({ name: 'PPG007', age: 23 });
    return (
      <div>
        <button
          onClick={() => {
            setPerson(({ name, age }) => {
              return {
                name: name + '_1',
                age: age + 1,
              };
            });
          }}
        >
          click
        </button>
        <br />
        <span>{person.name}</span>
        <br />
        <span>{person.age}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
</script>
```

::: warning

## state 更新对象

当 state 变量是一个对象时，不能只更新其中一个字段而不显式复制其他字段，所以上面的例子中如果只希望每次点击年龄加 1 而名字不做改动，那么不能写成 `setPerson({age: age+1})`，如果希望只设置一部分字段，那么应该使用对象展开，例如：

```html
<script type="text/babel">
  function MyComponent() {
    let [person, setPerson] = React.useState({ name: 'PPG007', age: 23 });
    return (
      <div>
        <button
          onClick={() => {
            setPerson(({ name, age }) => {
              return {
                ...person,
                age: age + 1,
              };
            });
          }}
        >
          click
        </button>
        <br />
        <span>{person.name}</span>
        <br />
        <span>{person.age}</span>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
</script>
```

:::

state 是隔离且私有的，如果渲染同一个组件多次，每个副本都会有完全隔离的 state，改变一个不会影响另一个，例如：

```html
<script type="text/babel">
  function MyComponent() {
    let [person, setPerson] = React.useState({ name: 'PPG007', age: 23 });
    return (
      <div>
        <button
          onClick={() => {
            setPerson(({ name, age }) => {
              return {
                ...person,
                age: age + 1,
              };
            });
          }}
        >
          click
        </button>
        <br />
        <span>{person.name}</span>
        <br />
        <span>{person.age}</span>
      </div>
    );
  }
  const dom = (
    <div>
      <MyComponent />
      <br />
      <MyComponent />
    </div>
  );
  ReactDOM.render(dom, document.getElementById('test'));
</script>
```

## state 更新数组

与处理对象相同，在更新 state 中的数组时，需要创建一个新数组并将其设置为新的 state。这意味着不能通过访问数组下表直接修改数组，也不应该使用 `push` 等修改原始数组的方法，在操作 React state 中的数组时，避免使用左侧的方法，首选右侧的方法：

|          | 避免使用（修改原数组）   | 建议使用（返回新数组） |
| -------- | ------------------------ | ---------------------- |
| 添加元素 | `push`, `unshift`        | `concat`, `[...arr]`   |
| 删除元素 | `pop`, `shift`, `splice` | `filter`, `slice`      |
| 替换元素 | `splice`, `arr[i]=...`   | `map`                  |
| 排序     | `reverse`, `sort`        | 先复制一份数组         |

向数组中添加、删除元素：

```html
<script type="text/babel">
  function MyComponent() {
    const [values, setValues] = React.useState([]);
    const [value, setValue] = React.useState('');
    return (
      <div>
        <input
          onChange={event => {
            setValue(event.target.value);
          }}
          value={value}
        />
        <button
          onClick={() => {
            if (value === '') {
              return;
            }
            setValues([...values, value]);
            setValue('');
          }}
        >
          add
        </button>
        <br />
        <ul>
          {values.map((value, index) => {
            return (
              <li key={index}>
                {value}
                <button
                  onClick={() => {
                    setValues(values => {
                      return values.filter((v, ii) => {
                        return ii !== index;
                      });
                    });
                  }}
                >
                  delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
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
        return i === index;
      });
      target.age++;
      setter(temp);
    }
    return (
      <div>
        <h1>A</h1>
        <ul>
          {a.map((v, index) => {
            return (
              <li key={index}>
                {v.name} __ {v.age}
                <button
                  onClick={() => {
                    grow(a, index, setA);
                  }}
                >
                  grow
                </button>
              </li>
            );
          })}
        </ul>
        <h1>B</h1>
        <ul>
          {b.map((v, index) => {
            return (
              <li key={index}>
                {v.name} __ {v.age}
                <button
                  onClick={() => {
                    grow(b, index, setB);
                  }}
                >
                  grow
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
</script>
```

在上面的代码中，点击按钮会发现操作同时影响了 a 和 b，这是因为数组展开拷贝是浅拷贝，拷贝出的数组中的元素指向的还是同一个对象，所以直接找到对象并修改会导致这个问题，可以通过 map 解决：

```js
function grow(items, index, setter) {
  setter(
    items.map((item, i) => {
      if (index === i) {
        return {
          name: item.name,
          age: item.age + 1,
        };
      }
      return item;
    })
  );
}
```

## 类组件的 state

通过继承 React Component 类来定义组件类，这个组件类中有一个 state 变量，将数据存储在这里然后调用实例方法 `setState()` 即可实现 state 更新：

```html
<script type="text/babel">
  class MyComponent extends React.Component {
    render() {
      return (
        <div>
          <button onClick={this.growUp}>click</button>
          <br />
          <span>{this.state.name}</span>
          <br />
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
      this.setState({ age: this.state.age + 1 });
    };
  }
  ReactDOM.render(<MyComponent name="PPG007" age={23} />, document.getElementById('test'));
</script>
```

setState 如果是设置对象的话，只会设置传入的字段，不会覆盖没传入的字段，这与 useState 不同，此外 setState 还有两种用法：

```js
// 通过更新函数（纯函数）传参
this.setState(self => {
  return {
    age: self.age + 1,
  };
});
// 设置状态更新并重新渲染后的回调函数
this.setState({ age: this.state.age + 1 }, () => {
  console.log('updated');
});
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
            {this.state.items.map((item, index) => {
              return (
                <li key={index}>
                  {item.name}__{item.age}
                  <button
                    onClick={() => {
                      this.grow(index);
                    }}
                  >
                    grow
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    grow = index => {
      this.setState(state => {
        state.items[index].age++;
        return state;
      });
    };
    state = { items };
  }
  ReactDOM.render(<MyComponent />, document.getElementById('test'));
</script>
```

::: tip

无论是 useState 还是 setState，都建议创建一个新的副本而不是直接修改原始状态，主要原因：

- 不变性：保持状态的不变性可以简化复杂的 UI 逻辑和提高组件的性能。
- 批量更新：React 会批量处理多个 state 改动，导致状态的更新不会立即渲染，通过不变的数据和基于前一个状态的函数式更新可以确保状态的正确。

:::

## 状态提升

有时候希望两个组件的状态始终同步更改，可以将相关 state 从这两个组件上移动到它们的公共父级，再通过 props 将 state 传递给两个组件，这被称为状态提升。

现在假设有以下场景：页面有两个组件，Search 组件和 List 组件，在 Search 组建中输入内容按下回车后，List 组件请求相关数据并展示，这里 state 的维护就要提升到他们的共同父组件中。

首先编写搜索组件，此组件接收三个属性：搜索关键字、搜索关键字设置回调、执行搜索回调：

```tsx
import { FC, Fragment } from 'react';

interface SearchProps {
  searchKey: string;
  onSearchKeyChange: (value: string) => void;
  onSearch: () => void;
}

const Search: FC<SearchProps> = ({ searchKey, onSearchKeyChange, onSearch }) => {
  return (
    <Fragment>
      <input
        value={searchKey}
        onChange={e => {
          onSearchKeyChange(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
      />
    </Fragment>
  );
};

export { Search };
```

然后编写 List 组件，这里为了简单，List 组件只接收搜索关键字并展示：

```tsx
import { FC, Fragment } from 'react';

const List: FC<{ searchKey: string }> = ({ searchKey }) => {
  return <Fragment>{searchKey ? <h2>searching {searchKey}...</h2> : undefined}</Fragment>;
};

export { List };
```

最后在它们的共同父组件中管理 state：

```tsx
import { FC, Fragment, useState } from 'react';
import { Search } from './Search';
import { List } from './List';

const App: FC = () => {
  const [searchKey, setSearchKey] = useState('');
  const [editingSearchKey, setEditingSearchKey] = useState('');
  return (
    <Fragment>
      <Search
        searchKey={editingSearchKey}
        onSearchKeyChange={setEditingSearchKey}
        onSearch={() => {
          setSearchKey(editingSearchKey);
        }}
      />
      <List searchKey={searchKey} />
    </Fragment>
  );
};

export default App;
```

## 订阅发布

使用父组件管理 state 会导致代码冗余，既要将 state 作为 props 传递给子组件，又要传递回调给子组件调用，父组件中可能需要管理很多的状态，为了简化开发，可以使用消息订阅发布模型来实现兄弟组件之间的通信。

实现了订阅发布模型的库有很多，这里使用[mitt](https://github.com/developit/mitt)。

安装 mitt：

```shell
yarn add mitt
```

订阅发布的实现需要基于同一个 mitt 实例，使用下面的代码获取一个实例：

```ts
// utils/index.ts
import mitt, { Emitter } from 'mitt';

type Events = {
  search: {
    searchKey: string;
  };
};

let emitter: Emitter<Events>;

const getEmitter = (): Emitter<Events> => {
  if (!emitter) {
    emitter = mitt<Events>();
  }
  return emitter;
};

export { getEmitter };
```

然后修改 Search 和 List 两个组件，并移除 App 组件中管理的 state：

```tsx
// Search.tsx
const Search: FC = () => {
  const [searchKey, setSearchKey] = useState('');
  const onSearch = () => {
    const emitter = getEmitter();
    emitter.emit('search', {
      searchKey: searchKey,
    });
  };
  return (
    <Fragment>
      <input
        value={searchKey}
        onChange={e => {
          setSearchKey(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
      />
    </Fragment>
  );
};
//List.tsx
const List: FC = () => {
  const [searchKey, setSearchKey] = useState('');
  useEffect(() => {
    const emitter = getEmitter();
    emitter.on('search', ({ searchKey }) => {
      setSearchKey(searchKey);
    });
    return () => {
      emitter.off('search');
    };
  }, []);
  return <Fragment>{searchKey ? <h2>searching {searchKey}...</h2> : undefined}</Fragment>;
};
```

注意上面的 List 组件中订阅事件的地方需要在 useEffect hook 中进行，并且依赖空数组，限制订阅动作只在组件挂载时执行，同时要返回一个清理函数，此函数中取消订阅。
