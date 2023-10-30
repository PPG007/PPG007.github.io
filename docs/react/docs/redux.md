# Redux

## Redux 简介

Redux 是一个使用 action 事件来管理和更新应用状态的工具，通过集中存储的方式对整个应用中的状态进行管理，确保状态以可预测的方式更新。Redux 可以帮助管理全局状态，可以更容易理解状态何时、何地、为什么以及如何被更新。

### State 管理

从一个小的 React 组件开始：

```tsx
const App:FC = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count+1)}>incr</button>
    </>
  )
}
```

上面的组件中包含下面的部分：

- state：驱动组件的真实数据。
- view：基于当前状态的视图描述。
- actions：根据用户输入在应用程序中发生的事件，触发状态更新。

上面组件的工作流程可以用下面的步骤概括：

- 用 state 来描述应用程序的状态。
- 基于 state 来渲染 view。
- 当发生事件时，state 根据发生的事情进行更新，生成新的 state。
- 基于新的 state 渲染 view。

上面的流程就是*单项数据流*。

![one-way-data-flow](./images/one-way-data-flow.png)

但是，如果有多个组件需要共享 state 时，事情会变的很复杂，尤其是当这些组件位于应用中的不同部分时，当然，这可以通过[状态提升](./state.md#状态提升)来解决，但是父组件需要维护大量的状态。为了解决这个问题，可以从组件中提取 state 并放入组件之外的另一个集中的位置，这样任何组件就能访问 state 或者触发 action 而无论它们在组件树的哪里。

### 不可变性

Mutable 意为“可以改变的”，而 immutable 意为“不可改变的”。

JavaScript 中的对象和数组都是可以改变的，如果创建一个对象，那么可以修改对象的属性；如果创建一个数组，那么可以修改数组内的元素。内存中还是原来对象或者数组的引用，但是里面的内容变化了。如果想要以不可变的方式更新，那么就必须先复制原来的对象或者数组，然后用这个复制结果更新。JavaScript 中的展开运算符可以实现对象或数组的拷贝。

Redux 期望所有的状态更新都使用不可变的方式。这样具有以下优势：

- 引用比较的简便性：如果状态对象不可变，那么就可以简单的通过比较对象和数组的引用来判断状态是否已经改变了，可以避免深度比较。
- 撤销、重做更容易实现：由于使用不可变的方式更新状态，所以可以轻松实现撤销、重做或者状态的时间旅行，通过 Redux 开发者插件可以查看、修改、穿梭过去的状态。

### 术语

Action：

action 是一个具有 type 字段的普通的 JavaScript 对象，action 可以被视为描述应用程序中发生了什么的事件，type 字段是一个字符串，给这个 action 定义一个描述性的名字。action 对象也可以有其他字段，其中包含有关发生的事情的附加信息，按照惯例此信息放在 payload 字段中，以下是一个示例 action：

```ts
const incrAction = {
  type: 'count/add',
  payload: 1,
}
```

Reducer：

reducer 是一个函数，接收当前的 state 和一个 action 对象，必要时决定如何更新状态并返回新状态。`(state, action) => newState`。可以将 reducer 视为一个事件监听器，它根据接收到的 action 类型处理事件。

Reducer 必须符合以下规则：

- 仅使用 state 和 action 计算新的状态值。
- 禁止直接修改 state，必须通过不可变方式更新。
- 禁止任何的异步逻辑、依赖随机值或者会导致副作用的代码。

Reducer 的执行内容通常是：检查当前 action 的 type 是否应该被处理，如果需要处理那么以不可变形式返回新的 state，否则返回之前的 state。

Dispatch：

更新 state 唯一的方法是调用 `store.dispatch()` 并传入一个 action 对象，store 将执行所有 reducer 函数并计算出更新后的 state，调用 `getState()` 可以获取新 state。

Selector：

随着状态的增多，可能会有很多地方需要读取 state 中的同一个字段，可以使用 selector 封装这个过程，避免重复逻辑。

下面是结合 Redux 后组件状态的维护流程：

![workflow](./images/redux-data-flow.gif)

### Redux Toolkit

Redux Toolkit 是一个开箱即用的 Redux 开发工具集，封装了配置 store、定义 reducer、不可变的更新逻辑、立即创建整个状态的切片，不需要手动编写任何 action creator 或者 action type，还自带了一些常用的 Redux 插件。

Redux 过于精简，需要很多的配置，使用 Redux Toolkit 可以简化代码。

## 示例：计数器

下面编写一个计数器示例，首先是不使用 Redux 的情况：

```tsx
const Count: FC = () => {
  const [value, setValue] = useState(0);
  const [step, setStep] = useState(1);
  return (
    <div>
      <button onClick={() => setValue(value+1)}>+</button>
      <span>{value}</span>
      <button onClick={() => setValue(value-1)}>-</button>
      <br/>
      <input value={step} onChange={(e) => {setStep(parseInt(e.target.value))}}/>
      <button onClick={() => {setValue(value+step)}}>add by step</button>
      <button onClick={() => {setTimeout(() => {setValue(value+step)}, 1000)}}>add async</button>
    </div>
  )
}
```

接下来将这个例子改造成使用 Redux，首先安装依赖：

```shell
yarn add redux @reduxjs/toolkit react-redux
yarn add -D @types/react-redux @types/redux
```

### 编写 Redux Store

Redux Toolkit 提供了 Redux Slice，这是单个 Reducer 逻辑和 action 的集合，用来将根 Redux 对象拆分成多个部分。下面定义一个 CounterSlice 用来完成计数器的功能：

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";

export type counterState = {
  value: number;
}

export type counterIncByStepAction = PayloadAction<{step: number}>;

type counterReducer = {
  incr: (state: counterState) => void;
  desc: (state: counterState) => void;
  incrByStep: (state: counterState, action: counterIncByStepAction) => void;
}

export const counterSlice = createSlice<counterState, counterReducer, 'counter'>({
  initialState: {
    value: 0,
  },
  name: "counter",
  reducers: {
    incr: (state) => {
      state.value ++;
    },
    desc: state => {
      state.value--;
    },
    incrByStep: (state, action) => {
      state.value += action.payload.step;
    }
  }
})

export default counterSlice.reducer;

export const {incr, incrByStep, desc} = counterSlice.actions;

export const incrAsync = (step: number) => (dispatch: Dispatch<counterIncByStepAction>) => {
  setTimeout(() => {
    dispatch(incrByStep({step: step}));
  }, 1000);
}

export const selectCount = ({counter}: {counter: counterState}) => {
  return counter.value;
};
```

使用 createSlice 方法创建一个 Redux Slice，首先需要指定一个 state 的初始值，这里将 state 初始值置为一个包含 value 字段的对象，然后需要一个 name，因为 action 是一个带有 type 字符串字段的对象，createSlice 方法会根据 name 值和 reducers 中方法的名字来自动生成 action，例如：

```ts
export const {incr, incrByStep, desc} = counterSlice.actions;
// {type: 'counter/incr', payload: undefined}
console.log(incr())
```

上面的 reducers 中并没有对 state 进行不可变式更新，而是直接操作的字段，这是因为 Redux Toolkit 使用了 [immer](https://github.com/immerjs/immer) 这个库，immer 检测到 draft state 改变时会基于这个改变去创建一个新的不可变的 state。

selectCount 就是之前提到的 Selector，这个函数接收一个参数，这个参数就是根 state，由于这里我们使用了 Redux Slice 将根 state 切分为多个部分，所以 counterState 将会作为这个参数的其中一个字段，这个字段的字段名取决于在组装 Redux Store 时为当前 Slice 指定的名字。

通过之前的内容我们知道，如果向改变 state，那么需要通过 dispatch 并传入 action 来完成，所以上面的 incrAsync 方法中有一个 dispatch 入参，这个dispatch 类型声明如下：`type Dispatch<A> = (value: A) => void;`。

接下来将这个 Slice 组装为 Redux Store：

```ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer, { counterState } from './count.ts';

const store = configureStore<{x: counterState}>({
  reducer: {
    x: counterReducer,
  }
})

export default store;
```

这里使用 Redux Toolkit 中的 configureStore 方法来完成，这个方法接收一个配置对象，这里我们将之前定义的 counterSlice 赋值给 x 字段，这样的话在状态树中的 x 字段上就有了 counterSlice 对象了，这也是在 Slice 中 Selector 入参的字段名的依据。

之前在介绍 reducer 时我们说 reducer 不能包含任何的异步逻辑，如果需要异步的话，我们需要使用 thunk。thunk 是一种特定类型的 Redux 函数，可以包含异步逻辑，Thunk 由两个函数编写：

- 一个内部 thunk 函数，以 dispatch 和 getState 作为参数。
- 外部创建者函数，创建并返回 thunk 函数。

使用 thunk 需要在创建 Redux Store 时使用 redux-thunk 中间件，Redux Toolkit 封装了这个过程。然后我们就可以将 thunk 传给 dispatch 方法了。

### 编写计数器组件

接下来修改 Count 组件：

```tsx
const Count: FC = () => {
  const count = useSelector<{x: counterState}, number>(selectCount);
  const dispatch = useDispatch<Dispatch<counterIncByStepAction | PayloadAction>>();
  const [step, setStep] = useState(1);
  return (
    <div>
      <button onClick={() => {dispatch(incr())}}>+</button>
      <span>{count}</span>
      <button onClick={() => {dispatch(desc())}}>-</button>
      <br/>
      <input value={step} onChange={(e) => setStep(parseInt(e.target.value))}/>
      <br/>
      <button onClick={() => {dispatch(incrByStep({step}))}}>add by step</button>
      <button onClick={() => {incrAsync(step)(dispatch)}}>add async</button>
    </div>
  )
}
```

上面的组件中，展示用的 count 值我们使用 useSelector 方法并传入在 counterSlice 中定义的 Selector，useSelector 会将 state 作为入参调用我们的 Selector 并返回 Selector 的返回值。

接下来，所有对 count 的修改都通过 dispatch 来进行，这里通过 `useDispatch` 方法获取 dispatch，这里有两种 action：带有 step 字段的 action 和空 action。

最后，在事件处理函数中使用 dispatch 并传入由 action creator 构造的响应 action 即可实现对状态的修改。

### provide store

在完成上面的内容之后，还需要在用到 Store 状态管理的地方像 React Router 来提供一个 store provider：

```tsx
function App() {
  return (
    <Provider store={store}>
      <Count/>
    </Provider>
  )
}
```

## 示例：文章管理

接下来，我们来制作一个小型文章管理应用，这个应用能够展示、修改、添加文章，首先我们来编写一个首页，这里直接使用 antd：

```tsx
const App:FC = () => {
  return (
    <Card
      title={"Articles"}
    >
      <h1>body</h1>
    </Card>
  )
}
```

然后创建路由：

```tsx
const routes = createHashRouter([
  {
    path: '/',
    element: <App/>
  }
])
```

然后修改 main.tsx：

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={routes}/>
  </React.StrictMode>,
)
```

接下来编写创建文章组件和文章列表组件，暂时使用非响应式数据，后面引入 Redux 后再改为响应式数据：

```tsx
// List.tsx

// Creator.tsx
type formType = {
  title: string;
  content: string;
}

const Creator: FC = () => {
  return (
    <Form<formType> onFinish={(data) => {console.log(data)}}>
      <Form.Item name="title" label={'标题'} rules={[{required: true}]}>
        <Input/>
      </Form.Item>
      <Form.Item name="content" label={'内容'} rules={[{required: true}]}>
        <Input/>
      </Form.Item>
      <Form.Item>
        <Button type={'primary'} htmlType={'submit'}>Submit</Button>
      </Form.Item>
    </Form>
  )
}
```

然后修改一下 App.tsx 和路由配置：

```tsx

```

## 数据流

## 使用数据

## 异步逻辑与数据请求

## 性能与数据范式化

## RTK 查询
