# Context

按照之前的内容，如果在一个组件里想向子组件传递一些数据，那么可以使用 props，但是如果要连续多级传递数据那么就要连续传递 props，这回导致代码冗长，Context 允许父组件向下层的任何深度的任何组件传递信息，而无需 props 显式传递。

## 使用 Context

现在以一个传递 memberId 的场景为例，多级传递 Context。

### 创建 Context

```ts
export const MemberIdContext = createContext<string>('');
```

### 使用 Context

创建 Context 之后，使用 `useContext` 使用 Context：

```tsx
// Son.tsx
import { FC, useContext } from 'react';
import { GrandSon, MemberIdContext } from './index';

const Son: FC = () => {
  const memberId = useContext(MemberIdContext);
  return (
    <>
      <h2>{memberId}</h2>
      <GrandSon />
    </>
  );
};

export { Son };
// GrandSon.tsx
import { FC, Fragment, useContext } from 'react';
import { MemberIdContext } from './index';

const GrandSon: FC = () => {
  const memberId = useContext(MemberIdContext);
  return (
    <Fragment>
      <h3>{memberId}</h3>
    </Fragment>
  );
};

export { GrandSon };
```

除了通过 `useContext` 使用 Context 之外，也可以使用 `<Consumer>/<Consumer>` 标签将要使用 Context 的标签包裹起来：

```tsx
import { FC } from 'react';
import { GrandSon, MemberIdContext } from './index';

const Son: FC = () => {
  return (
    <>
      <MemberIdContext.Consumer>{value => <h2>{value}</h2>}</MemberIdContext.Consumer>
      <GrandSon />
    </>
  );
};

export { Son };
```

::: tip

老版本 React 函数式组件可以通过第二个入参接收 Context，但是新版本建议使用 Hooks 或者 Consumer 标签。

:::

### 提供 Context

在最外层的组件中使用 `<Provider></Provider>` 标签将希望透传 Context 的标签包裹起来，这样在子组件中使用 Context 时，React 会将距离子组件最近的 `<Provider></Provider>` 标签传递的值传给子组件：

```tsx
// App.tsx
import { FC, useEffect, useState } from 'react';
import { MemberIdContext, Son } from './components';

const MyApp: FC = () => {
  const [memberId, setMemberId] = useState('');
  return (
    <>
      <MemberIdContext.Provider value={memberId}>
        <Son />
      </MemberIdContext.Provider>
      <button
        onClick={() => {
          setMemberId(memberId + '1');
        }}
      >
        click
      </button>
    </>
  );
};

export { MyApp };
```

## Context 的注意点

在使用 Context 之前先考虑下面几种替代方案：

- 从传递 props 开始：如果组件不是很复杂，可以通过 props 向下传递，这可以让数据的流动更加清晰。
- 抽象组件并将 JSX 作为 children prop 传递。如果要将 props 经过多个不使用它的组件向下传递，那么可以在这些中间组件中接收 props.children 并在对应位置渲染，然后直接使用这些中间组件包裹要使用 props 的组件。

## Context 的使用场景

- 主题：例如修改外观的黑暗模式。
- 当前账户：例如可以通过 Context 传递当前登录的用户的信息。
- 路由。
- 状态管理。

## 同时使用 Reducer 和 Context

现在回到 Reducer 中的待办事项的例子，dispatch 方法仅在顶级组件 App 中可用，要让 TodoList 组件中可以调用那么必须要通过 props 显式传递状态和事件处理器。如果有很多组件、很多事件处理器和状态，那么传递所有的状态和事件处理器会非常麻烦，如果将状态和 dispatch 都通过 Context 传递，那么所有的子组件都能获取到状态和 dispatch 函数。下面改造此前的 Reducer 中的 TodoList 的例子。

第一步仍然是创建 Context：

```ts
export interface action extends Todo {
  type: 'add' | 'change' | 'delete';
}

type TodosReducer = {
  todos?: Array<Todo>;
  dispatch?: Dispatch<action>;
};

export const TodosContext = createContext<TodosReducer>({});
```

然后在 TodoList 中改用 Context：

```tsx
const TodoList: FC = () => {
  const [editingTodo, setEditingTodo] = useState<Todo>(() => ({ id: '', content: '' }));
  const ctx = useContext(TodosContext);
  const todos = ctx.todos ? ctx.todos : [];
  const dispatch = ctx.dispatch;
  const isEditing = (todo: Todo) => editingTodo.id === todo.id;
  return (
    <Fragment>
      <ul>
        {todos
          ? todos.map(todo => {
              return (
                <li key={todo.id}>
                  {isEditing(todo) ? (
                    <input
                      value={editingTodo.content}
                      onChange={e => {
                        setEditingTodo({ ...editingTodo, content: e.target.value });
                      }}
                    />
                  ) : (
                    todo.content
                  )}
                  <button
                    onClick={() => {
                      if (isEditing(todo) && dispatch) {
                        dispatch({
                          type: 'change',
                          ...editingTodo,
                        });
                        setEditingTodo({ id: '', content: '' });
                        return;
                      }
                      setEditingTodo(todo);
                    }}
                  >
                    {isEditing(todo) ? 'save' : 'edit'}
                  </button>
                  <button
                    onClick={() => {
                      if (dispatch) {
                        dispatch({
                          type: 'delete',
                          id: todo.id,
                          content: '',
                        });
                      }
                    }}
                  >
                    delete
                  </button>
                </li>
              );
            })
          : undefined}
      </ul>
    </Fragment>
  );
};
```

最后从父组件中传入 Context：

```tsx
const App: FC = () => {
  const [todos, dispatch] = useReducer<Reducer<Array<Todo>, action>>(tasksReducer, []);
  const [value, setValue] = useState('');
  const addHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      dispatch({
        type: 'add',
        id: '',
        content: value,
      });
      setValue('');
    }
  };
  return (
    <TodosContext.Provider value={{ todos, dispatch }}>
      <input
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        onKeyDown={addHandler}
      />
      <TodoList />
    </TodosContext.Provider>
  );
};
```
