# Hooks

## 自定义 Hook

之前的 useState、useReduce 等以 use 开头的方法都是 React Hook，React Hook 能够提取重复逻辑降低耦合度，但是很多情况下 React 内置的 Hooks 无法满足需求，这时就可以自定义 Hook。

要自定义 Hook 就要遵循 Hook 的命名公约：Hook 的名称必须以 use 开头，然后紧跟一个大写字母，就像 useState 这样，Hook 可以返回任意值。

### 抽取自定义 Hook

现在有两个组件 Foo 和 Bar，当前登录用户信息保存在 localStorage 中，如果希望在两个组件都能获取到用户信息，那么可以将从 localStorage 中读取的逻辑抽取为一个 Hook。

```tsx
export interface user {
  id: string;
  name: string;
}

const useCurrentUser = () => {
  const str = localStorage.getItem('user');
  if (str) {
    return JSON.parse(str) as user;
  }
  return null;
};

export default useCurrentUser;
```

然后在组件中引用：

```tsx
const Foo: FC = () => {
  const user = useCurrentUser();
  return (
    <p>
      {user ? (
        <span>
          {user.id} - {user.name}
        </span>
      ) : (
        'null'
      )}
    </p>
  );
};
```

::: tip

Hook 共享的只是状态逻辑而不是状态本身，对 Hook 的每个调用完全独立。

:::

### 自定义 Hook 的注意点

- 可以将响应值从一个 Hook 传递到另一个 Hook，并且它们会保持最新。
- 每次组件重新渲染时，所有的 Hook 会重新运行。
- 自定义 Hook 应该是具体的、高级定制的，保持纯粹。

## 一些 React 内置的 Hook

### useId

这个 Hook 会返回一个唯一的字符串 id：

```ts
console.log(useId(), useId(), useId());
```

如果一个页面中有多个 React 实例，那么可以在 createRoot 方法中传入 identifierPrefix 来为这个 React 应用的 useId 的结果设置前缀：

```tsx
ReactDOM.createRoot(document.getElementById('root')!, {
  identifierPrefix: 'PPG007',
}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### useMemo

这个 Hook 接收两个参数，第一个参数应该是一个没有任何参数的纯函数，并且可以返回任意类型，第二个参数是依赖项数组。React 会在首次渲染时调用这个函数，在之后的渲染中，如果依赖项数组没有发生变化，那么 React 将直接返回相同的值，否则会再次调用这个函数并缓存。

```tsx
const memoTest = () => {
  console.log('memo test');
};

function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  useMemo(memoTest, [b]);
  return (
    <>
      <span>{a}</span>
      <button
        onClick={() => {
          setA(a + 1);
        }}
      >
        add
      </button>
      <br />
      <span>{b}</span>
      <button
        onClick={() => {
          setB(b + 1);
        }}
      >
        add
      </button>
    </>
  );
}
```

现在有这样一个组件，接收一个整数数组并渲染出来，但是很慢：

```tsx
const Count: FC<{ count: Array<number> }> = ({ count }) => {
  console.log('rendering count');
  const start = performance.now();
  while (performance.now() - start < 1000) {
    continue;
  }
  return <span>{count[0]}</span>;
};
// App.tsx
function App() {
  const [a, setA] = useState(0);
  return (
    <>
      <Count count={[1]} />
      <button
        onClick={() => {
          setA(a + 1);
        }}
      >
        add
      </button>
    </>
  );
}
```

在上面的例子中，通过改变 state 可以实现重新渲染，向 Count 组件传入的内容始终相同，但是由于 Object.is 比较数组和对象时比较的是引用地址，因此每次相当于传入一个新数组，这会导致 Count 组件的重新渲染。你可能会想到 React 提供的 `memo()` 方法，此方法接收两个参数，第一个参数是一个组件，第二个参数是一个函数，是可选的，这个函数接收两个参数，prevProps 与 newProps，这个函数应当返回布尔值，当返回为 true 时 memo 中的组件不会重新渲染，这相当于是缓存。但是对于上面的例子来说，使用 `memo()` 方法并不会有效，原因就是每次传入的数组都是不一样的，这时，可以使用 `useMemo` 将传入的 props 的计算过程包裹起来，缓存这个过程。

```tsx
function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const count = useMemo(() => {
    return [a];
  }, [a]);
  return (
    <>
      <Count count={count} />
      <button
        onClick={() => {
          setA(a + 1);
        }}
      >
        add
      </button>
      <Count count={count} />
      <button
        onClick={() => {
          setB(b + 1);
        }}
      >
        add
      </button>
    </>
  );
}
```

这时，count 仅依赖 a，点击 b 不会触发 Count 组件的重新渲染。

::: tip

组件渲染时，函数内的所有内容都会被执行，如果组件内有一个局部定义的数组或者对象，那么每次重新渲染得到的变量必然和上一次的不同，useMemo 会有无效问题，因此不应该缓存这个变量本身而是缓存这个变量的计算逻辑。

:::

### useCallback

useCallback 也算是 useMemo，只不过缓存的是函数，如果要用 useMemo 缓存函数，那么 useMemo 的第一个参数必须也返回一个函数，useCallback 封装了这一步。

## 一些 React API

### lazy

此方法能够延迟加载组件，例如：

```tsx
const Foo = lazy(() => import('./components/Foo'));

function App() {
  return (
    <div>
      <Foo />
    </div>
  );
}
```

此方法接收 import 的结果必须是默认导出，如果是非默认导出可以用下面的方法：

```tsx
const Foo = lazy(async () => {
  const foo = (await import('./components')).Foo;
  return { default: foo };
});
```
