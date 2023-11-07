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

接下来，我们来制作一个小型文章管理应用，这个应用能够展示、修改、添加文章，页面直接使用 Antd，首先我们来编写一个 Redux Slice 并组装一个 store：

```ts
// slice
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type Article = {
  id: string;
  title: string;
  content: string;
}

type ArticleState = Array<Article>

const initialArticles: Array<Article> = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
  }
];

interface upsertPayload {
  id?: string;
  title: string;
  content: string;
}

type ArticleReducer =  {
  create: (state: ArticleState, action: PayloadAction<upsertPayload>) => void;
  update: (state: ArticleState, action: PayloadAction<upsertPayload>) => void;
}

const articleSlice = createSlice<ArticleState, ArticleReducer, 'article'>({
  name: 'article',
  initialState: initialArticles,
  reducers: {
    create(state, action) {
      state.push({
        id: `${state.length+1}`,
        content: action.payload.content,
        title: action.payload.title,
      });
    },
    update(state, action) {
      if (!action.payload.id) {
        return;
      }
      state = state.map((a) => {
        if (a.id === action.payload.id) {
          a.title = action.payload.title
          a.content = action.payload.content
        }
        return a;
      })
    }
  }
})

export default articleSlice.reducer;

export const {
  create,
  update,
} = articleSlice.actions;

export const selectArticles = ({article}: {article: ArticleState}) => {
  return article
}

export const selectArticle = (id: string) => ({article}: {article: ArticleState}) =>{
  return article.find((a) => {return a.id === id})
}
// store
const store = configureStore({
  reducer: {
    article: article,
  }
})
export default store;
export type ArticleDispatch = typeof store.dispatch;
```

接着，来编写创建文章的页面：

```tsx
// Create.tsx
type formType = {
  title: string;
  content: string;
}

const Create: FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<formType>();
  const [sender, holder] = message.useMessage();
  const onSubmit = ({title, content}: formType) => {
    dispatch(create({
      title,
      content
    }));
    form.resetFields();
    sender.success('ok')
  };
  return (
    <>
      {holder}
      <Form onFinish={onSubmit} form={form}>
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
    </>
  )
}
```

上面是一个简单的表单，输入标题和内容后点击提交，调用 dispatch 发出 action，然后触发 Redux 的 state 更新。

然后是文章列表页面：

```tsx
// List.tsx
const List: FC = () => {
  const articles = useSelector(selectArticles);
  return (
    <AList dataSource={articles} renderItem={renderItem} rowKey={(item) => item.id}/>
  )
}

const renderItem = (article: Article) => {
  return (
    <AList.Item>
      <AList.Item.Meta
        title={<Link to={`view/${article.id}`}>{article.title}</Link>}
        description={article.content}
      />
    </AList.Item>
  )
}
```

这里使用了 selector 来获取当前 Redux 中的文章列表，每个文章的标题是一个 Link 组件，跳转至下面的文章详情页面：

```tsx
const View: FC = () => {
  const params = useParams<{id: string}>();
  const article = useSelector(selectArticle(params.id ? params.id : ''));
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(article ? article.title : '');
  const [content, setContent] = useState(article? article.content : '');
  const dispatch = useDispatch();
  if (!article){
    return (
      <Empty/>
    )
  }
  return (
    <Card
      title={
      isEditing ? (
        <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
      ) : article.title
      }
      extra={(
        <Space>
          <Button type={'link'} onClick={() => {
            setIsEditing(!isEditing);
          }}>{
            isEditing ? 'cancel' : 'edit'
          }</Button>
          <Link to={'..'}>back</Link>
        </Space>
      )}
    >
      {
        isEditing ? (
          <Input.TextArea
            showCount
            maxLength={100}
            value={content}
            onChange={(e) => {setContent(e.target.value)}}
          />
        ) : article.content
      }
      {
        isEditing ? <Button onClick={() => {
          dispatch(update({
            id: article?.id,
            title,
            content,
          }));
          setIsEditing(false);
        }}>Submit</Button> : undefined
      }
    </Card>
  )
}
```

View 组件复杂一些，这个组件首先获取路由参数中的 id 并调用 useSelector 获取 Redux 中对应的文章，如果文章获取不到就返回一个空页面。同时这个详情页面允许编辑，编辑和查看的状态通过 isEditing 这个布尔值来区分，点击按钮来回切换这个值，并使用两个局部 state 来保存编辑过程中的文章标题和内容，最后，使用 dispatch 来创建一个文章。

最后是路由配置和应用入口的内容：

```tsx
// router/index.tsx
const router = createHashRouter([{
  path: '/',
  element: <App/>,
  children: [
    {
      path: 'create',
      element: <Create/>,
    },
    {
      element: <List/>,
      index: true,
    },
    {
      element: <View/>,
      path: 'view/:id'
    }
  ]
}])
// App.tsx
const Extra: FC = () => {
  const isCreate = useLocation().pathname === '/create';
  let to = 'create';
  if (isCreate) {
    to = '/';
  }
  return (
    <Space>
      <Link to={to}>{isCreate ? 'list' : 'create'}</Link>
    </Space>
  )
}

const App:FC = () => {

  return (
    <Card
      title={'Articles'}
      extra={<Extra/>}
    >
      <Outlet/>
    </Card>
  )
}
// main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
```

::: tip 总结

到这里，这个文章应用包含了以下内容：

- 通过 reducer 来更新 state。
- 通过 dispatch 来在组件中触发 state 的更新。
- 通过 selector 来获取数据，如果 selector 需要自定义参数，那么在定义 selector 时要使用函数柯里化。
- 应用内的任意组件都能访问 Redux 管理的 state。

:::

## 异步逻辑与数据请求

上面的例子中，数据仍然是只在这个应用中流转，现在我们来编写一个 http server，通过 api 调用的方式来获取数据。

这里使用 koa 来编写 http 服务，主要逻辑如下：

```ts
import ObjectID from "bson-objectid";
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

type Article = {
  id: string;
  title: string;
  content: string;
}

const app = new Koa();
app.use(bodyParser());
app.use(async (ctx, next) => {
  try {
    await next();
    if (!ctx.body) {
      ctx.body = {};
    }
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = (e as Error).message;
  }
})

const router = new Router({
  prefix: '/articles',
});

type UpsertRequest = {
  title: string;
  content: string;
}
let articles: Array<Article> = [];
router.get('/', (ctx) => {
  ctx.body = articles;
});

router.post('/', (ctx) => {
  if (!ctx.request.body) {
    throw new Error('missing body');
  }
  const req: UpsertRequest = ctx.request.body as UpsertRequest;
  const newArticle: Article = {
    title: req.title,
    content: req.content,
    id: ObjectID().toHexString(),
  };
  articles.push(newArticle);
});

router.put('/:id', (ctx) => {
  const id = ctx.params['id'];
  if (!ctx.request.body) {
    throw new Error('missing body');
  }
  const req: UpsertRequest = ctx.request.body as UpsertRequest;
  let articleFound = false;
  articles = articles.map((a) => {
    if (a.id === id) {
      articleFound = true;
      a.title = req.title;
      a.content = req.content;
    }
    return a
  });
  if (!articleFound) {
    throw new Error('article not found')
  }
})
app.use(router.routes()).use(router.allowedMethods());
app.listen(8080, '0.0.0.0');
```

通过上面的内容可知，reducer 不能包含异步逻辑，但是在 reducer 被调用之前，要先调用 dispatch，可以扩展 dispatch，也就是在调用 dispatch 之前发起异步逻辑，Redux 中的中间件为此提供了支持，最常用的异步中间件是 redux-thunk，Redux Toolkit 中的 configureStore 方法会默认开启此中间件，在加入 thunk 中间件之后，数据的流转就像下面这样：

![async](./images/thunk.gif)

现在，将之前的创建、修改、获取文章改为使用 thunk 异步执行 Redux Toolkit 提供了 createAsyncThunk 方法来创建 asyncThunk，下面是对三个接口调用的封装：

```ts
const axiosInstance = axios.create({
  baseURL: '/v1/articles/'
})

export const update = createAsyncThunk<void, upsertPayload>('articles/update', async ({id, content, title}, {dispatch}) => {
  if (!id) {
    throw new Error('empty id')
  }
  await axiosInstance.put<void, AxiosResponse<void>, upsertPayload>(`${id}`, {
    content,
    title,
  });
  dispatch(list())
});

export const create = createAsyncThunk<void, upsertPayload, {dispatch: ArticleDispatch}>('articles/create', async ({content, title}, {dispatch}) => {
  await axiosInstance.post<void, AxiosResponse<void>, upsertPayload>('', {
    content,
    title,
  })
  dispatch(list())
})

export const list = createAsyncThunk<Array<Article>, void>('articles/list', async () => {
  const resp = await axiosInstance.get<Array<Article>>('')
  return resp.data;
})
```

这个方法接收三个泛型类型，第一个类型是里面包裹的函数的返回类型，第二个类型是参数类型，这个参数可以在内部函数的入参中访问到，第三个参数是一个配置对象，这里只配置了 dispatch 的类型是 articleStore 的 dispatch 类型。

为了在创建、更新文章之后能够及时更新 state，在 update 和 create 之后都再次 dispatch list，为了接收 asyncThunk 的返回值并更新到 state 中，修改 slice：

```ts
const articleSlice = createSlice<ArticleState, {}, 'article'>({
  name: 'article',
  initialState: initialArticles,
  extraReducers: (builder) => {
    builder.addCase(list.fulfilled, (_, action) => {
      return action.payload
    })
  },
  reducers: {},
})
```

extraReducers 选项是一个接收名为 builder 的参数的函数，builder 对象提供了一些方法，可以定义额外的 reducer 来响应各种 case，可以通过下面三种方式定义 case：

- `addCase(actionCreator, reducer)`：定义一个 case reducer 来响应一个 action。
- `addMatcher(matcher, reducer)`：定义一个 case reducer，如果 matcher 返回为 true 那么 reducer 将会被执行。
- `addDefaultCase(reducer)`：定义一个 case reducer，如果没有其他 case reducer 被执行，那么这个 reducer 会执行。

::: tip

如果多个 case 都匹配，那么它们将按照定义的顺序运行。

:::

上面的例子中使用了 addCase，下面是使用 addMatcher 的写法：

```ts
// isFulfilled 是 Redux Toolkit 提供的内置方法
extraReducers: (builder) => {
  builder.addMatcher(isFulfilled(list), (_, action) => {
    return action.payload
  })
},
```

### vite 反向代理设置

在上面的例子中，如果使用 vite 管理项目，那么需要修改 vite.config.ts 来设置反向代理：

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/v1/.*': {
        target: 'http://127.0.0.1:8080',
        rewrite: path => path.replace(/^\/v1/, '')
      }
    }
  }
})
```

### 在组件中执行异步

现在，修改创建文章的组件，使用异步 dispatch：

```ts
const dispatch = useDispatch<ArticleDispatch>();
const [form] = Form.useForm<formType>();
const [sender, holder] = message.useMessage();
const onSubmit = async ({title, content}: formType) => {
  await dispatch(create({
    title,
    content
  }));
  form.resetFields();
  sender.success('ok')
};
```

由于在 createAsyncThunk 中抛出错误时，这个错误会被内部捕获处理，所以上面的代码中即使 create 中抛出异常 await 之后的逻辑也会执行，要想处理异步结果，有以下两种方法。

第一种方法是将 dispatch 的结果展开为一个 Promise，对这个 Promise 做 await 可以获得异常：

```ts
const onSubmit = async ({title, content}: formType) => {
  try {
    await dispatch(create({
      title,
      content
    })).unwrap();
    form.resetFields();
    sender.success('ok');
  } catch (e) {
    sender.error((e as Error).message)
  }
}
```

第二种方法时校验 dispatch 的结果是不是 rejected 或者 fulfilled 状态：

```ts
const onSubmit = async ({title, content}: formType) => {
  const resp = await dispatch(create({
    title,
    content
  }))
  if (create.fulfilled.match(resp)) {
    form.resetFields();
    sender.success('ok')
  } else if (create.rejected.match(resp)) {
    sender.error(resp.error.message);
  }
};
```

## 性能与数据范式化

## RTK 查询
