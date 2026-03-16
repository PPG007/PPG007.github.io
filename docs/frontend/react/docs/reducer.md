# Reducer

假设有下面这样一个场景，ul 列表中的每个 li 都具有编辑、删除的功能，如果按照 state 的方式可能会写出下面的代码：

```tsx
// components/TodoList.tsx
import { FC, Fragment, useState } from 'react';

interface Todo {
  id: string;
  content: string;
}

type TodoListProps = {
  todos: Array<Todo>;
  changeHandler: (task: Todo) => void;
  deleteHandler: (id: string) => void;
};

const TodoList: FC<TodoListProps> = ({ todos, changeHandler, deleteHandler }) => {
  const [editingTodo, setEditingTodo] = useState<Todo>(() => ({ id: '', content: '' }));
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
                      if (isEditing(todo)) {
                        changeHandler(editingTodo);
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
                      deleteHandler(todo.id);
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

export { TodoList, Todo };
// App.ts
import { FC, Fragment, useState, KeyboardEvent } from 'react';
import { Todo, TodoList } from './components';

const App: FC = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [value, setValue] = useState('');
  const changeHandler = (todo: Todo) => {
    setTodos(
      todos.map(item => {
        if (item.id === todo.id) {
          return todo;
        }
        return item;
      })
    );
  };
  const deleteHandler = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  const addHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setTodos([...todos, { id: `${todos.length + 1}`, content: value }]);
    }
  };
  return (
    <Fragment>
      <input
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        onKeyDown={addHandler}
      />
      <TodoList todos={todos} changeHandler={changeHandler} deleteHandler={deleteHandler} />
    </Fragment>
  );
};

export default App;
```

在上面的例子中，App 组件里 setState 被多次调用了，如果以后还要添加其他需求，那么各种事件的处理函数可能会不断增加，为了将这种状态更新逻辑很多的组件的事件处理器集中起来，可以将所有的状态更新逻辑添加到一个外部函数中，即 reducer。通过下面的步骤可以将 useState 转为 useReducer：

- 将设置状态的逻辑修改成 dispatch 的一个 action。
- 编写一个 reducer 函数。
- 在组件中使用 reducer。

reducer 通过事件处理程序 dispatch 一个 action 来表明用户刚刚做了什么，状态更新逻辑保存在其他地方，不再像 state 那样通过事件处理器直接设置 task，而是 dispatch 一个添加、修改、删除任务的 action。

## 使用 Reducer 替换 state

第一步，定义 reducer，替换掉之前的 useState：

```ts
interface action extends Todo {
  type: 'add' | 'change' | 'delete';
}

const tasksReducer = (prevState: Array<Todo>, action: action): Array<Todo> => {
  switch (action.type) {
    case 'add':
      return [...prevState, { id: `${prevState.length + 1}`, content: action.content }];
    case 'change':
      return prevState.map(todo => {
        if (todo.id === action.id) {
          return {
            id: todo.id,
            content: action.content,
          };
        }
        return todo;
      });
    case 'delete':
      return prevState.filter(todo => todo.id !== action.id);
  }
};

const [todos, dispatch] = useReducer<Reducer<Array<Todo>, action>>(tasksReducer, []);
```

useReducer 函数会返回一个数组，第一个元素为一个 state，第二个元素是 dispatch 函数。

第二步，修改之前的事件处理函数：

```ts
const changeHandler = (todo: Todo) => {
  dispatch({
    type: 'change',
    ...todo,
  });
};
const deleteHandler = (id: string) => {
  dispatch({
    type: 'delete',
    id: id,
    content: '',
  });
};
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
```

## Reducer 和 State 的对比

- 通常情况下，使用 `useState` 时，一开始只需要编写少量的代码，而 `useReducer` 必须提前编写 reducer 函数和需要调度的 actions。当多个事件处理器以相似的方式修改 state 时，`useReducer` 可以减少代码量。
- 当状态更新逻辑足够简单时，`useState` 可读性良好，但是一旦逻辑变得复杂可读性将会下降，`useReducer` 允许将状态的更新和事件处理器分离以提高可读性。
- 当使用 state 出现问题时，很难发现具体的原因，使用 reducer 时，可以再 reducer 函数中通过日志等形式可以快速排查问题。
- reducer 是一个不依赖组件的纯函数，所以可以对它单独进行测试。

## Reducer 注意事项

- reducer 必须是纯粹的。和状态更新函数类似，reducer 在渲染时运行，它不应该包含异步请求、定时器或者任何副作用，应该以不可变值的方式去更新对象和数组。
- 每个 action 都描述了一个单一的用户交互，即使它会引发数据的多个变化。例如，如果是更新表单数据，应该一次性 dispatch 一个对象而不是分多次 dispatch。
