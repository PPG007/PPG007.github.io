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

reduce人 是一个函数，接收当前的 state 和一个 action 对象，必要时决定如何更新状态并返回新状态。`(state, action) => newState`。可以将 reducer 视为一个事件监听器，它根据接收到的 action 类型处理事件。

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
