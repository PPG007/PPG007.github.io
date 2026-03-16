# [React Router](https://reactrouter.com/en/6.17.0)

安装 react-router：

```shell
yarn add react-router-dom
```

## 示例组件

首先构造一个 App.tsx：

```tsx
import { FC } from 'react';
import styles from './styles/app.module.less';
const App: FC = () => {
  return (
    <div className={styles.app}>
      <div className={styles.sideBar}>
        <a>
          <button className={styles.button}>Home</button>
        </a>
        <a>
          <button className={styles.button}>About</button>
        </a>
      </div>
      <div className={styles.content}></div>
    </div>
  );
};

export default App;
```

后面的内容基于此页面进行。

## 创建 Router 实例

要在项目中使用 React Router，需要先创建一个 router 实例，就像使用 Vue Router 那样。

React Router 6.4 版本之后引入了 Data APIs，要想使用 Data APIs 就要使用支持 Data APIs 的 router。

支持 Data APIs 的 router：

- `createBrowserRouter`。
- `createMemoryRouter`。
- `createHashRouter`。
- `createStaticRouter`。

不支持 Data APIs 的 router：

- `<BrowserRouter>`。
- `<MemoryRouter>`。
- `<HashRouter>`。
- `<NativeRouter>`。
- `<StaticRouter>`。

一般的 web 项目建议使用 `createBrowserRouter`，相比 `createHashRouter` 能够更好地支持 SEO 和服务端渲染，但是要注意如果是将前端页面放在 nginx 中提供服务，那么需要配置将对应的路由发送给 index.html 而不是发给后端服务，防止 404 问题。当然为了方便也可以直接用 `createHashRouter`。

下面创建一个 browserRouter 的例子（createHashRouter 用法与 createBrowserRouter 一致），首先定义路由规则：

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'about',
        element: <About />,
      },
      {
        path: '/home',
        element: <Home />,
      },
    ],
  },
]);
```

然后在要使用 router 的位置：

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

修改 App 组件中 a 标签：

```tsx
<a href={'home'}>
  <button className={styles.button}>Home</button>
</a>
```

启动项目，应该能够看到 App 组件的内容，点击按钮会发现页面没有渲染出对应的组件，这是因为在 App 组件中没有定义子组件的展示位置，使用 Outlet 组件可以定义子组件的展示位置：

```tsx
<div className={styles.content}>
  <Outlet />
</div>
```

### RouterProvider

所有支持 DataAPIs 的 Router 都要将实例传入此组件的 router prop。

如果没有使用 SSR(Server Side Render)，那么在浏览器还未渲染完成页面时，可以通过 fallbackElement prop 传递一个 JSX 标签，例如遮罩层或者鱼骨架等效果，用来提醒用户正在加载。

### 使用 Link、NavLink 组件替换 a 标签防止浏览器刷新界面

上面的例子中，点击 a 标签会触发浏览器刷新，如果要去掉这种效果，可以使用 React Router Link 组件替换 a 标签：

```tsx
<Link to={'home'}></Link>
```

此外，如果希望链接在被激活时有高亮效果，那么可以使用 NavLink，当一个 NavLink 被激活时，会给渲染出来的 a 标签添加一个 active class，如果项目中有这个类选择器的样式那么就会生效。但是如果使用了 CSS Modules，那么我们定义的 active 样式的类名可能就不是 active 了，这时可以通过 className 属性动态为 NavLink 添加样式。

NavLink 组件的 className 属性除了可以像正常的 className 一样使用之外，还可以是一个纯函数，这个函数应该返回类名，此函数接收一个对象，对象上有三个布尔属性：isActive、isPending、isTransitioning。

```tsx
<NavLink to={'home'} className={({ isActive }) => (isActive ? styles.active : '')}>
  <button className={styles.button}>Home</button>
</NavLink>
```

NavLink 组件的 children 也可以是一个接收上面这个对象的纯函数，用于控制 NavLink 中显示的子元素，例如：

```tsx
<NavLink to={'home'} className={({ isActive }) => (isActive ? styles.active : '')}>
  {({ isActive }) => {
    let content = 'Home';
    if (isActive) {
      content = content.toUpperCase();
    }
    return <button className={styles.button}>{content}</button>;
  }}
</NavLink>
```

NavLink 组件的是否激活是通过 to 和 url 比较判断的，默认情况下会忽略大小写进行比较，如果希望大小写敏感，那么可以使用 caseSensitive 属性来限制大小写：

```tsx
<NavLink
  to={'HOME'}
  className={({isActive}) => isActive ? styles.active : ''}
  caseSensitive={false}
>
```

这样，如果访问 /home 那么此链接不会有 active 的效果。

NavLink 组件也可以限制 URL 匹配是否匹配后缀，例如如果上面的 Home 组件还有子组件，那么访问子组件的 url 应该是 `/home/sub`，默认情况下访问这个子组件时 `/home` 对应的 NavLink 链接也会有 active 效果，如果希望去掉这种效果，那么可以使用 end 属性：

```tsx
<NavLink
  to={'home'}
  className={({isActive}) => isActive ? styles.active : ''}
  end
>
```

### 不使用 Data Apis 的 router

上面的例子也可以用不支持 Data APIs 的 router实现：

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

## Route 配置项

除了上面用到的 path、element、children 属性，路由规则还有很多配置项。

### 错误处理

如果在渲染一个组件时报错，那么会跳转到一个错误页面，默认情况下是 React Router 的内置页面，可以通过 errorElement 属性指定自定义的报错页面：

```tsx
// 抛出错误
const About: FC = () => {
  throw new Error('test error');
  return (
    <h1>About</h1>
  )
}
// 自定义错误页面
{
    path: 'about',
    element: <About/>,
    errorElement: <ErrorPage/>
},
```

::: tip

渲染报错后，错误页面是距离报错组件最近的错误页面。例如如果上面的例子中 App 组件也指定了错误页面，那么显示的应该是 About 指定的错误页面。

:::

为了在错误页面中获取错误信息，可以使用 `useRouteError` 这个 hook：

```tsx
const ErrorPage: FC = () => {
  const err = useRouteError() as Error;
  return (
    <div className={styles.page}>
      <span className={styles.text}>oop! There is an error: {err.message}</span>
    </div>
  );
};
```

### 参数路由

参数路由（动态路由）是指某个节点可以匹配不同的内容并能获取对应的参数，获取到的结果就是 params 参数，React Router 中通过冒号来定义参数路由。

首先定义一个 HomeDetailLink 组件：

```tsx
import { FC } from 'react';

const HomeLink: FC = () => {
  return <h3>link</h3>;
};

export default HomeLink;
```

然后为这个组件配置路由：

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'about',
        element: <About />,
        ErrorBoundary: ErrorPage,
      },
      {
        path: 'home',
        element: <Home />,
        children: [
          {
            path: 'links',
            element: <HomeLink />,
          },
        ],
      },
    ],
  },
]);
```

然后修改 HomeDetail 组件，添加三个按钮，点击每个按钮跳转到 HomeDetailLink：

```tsx
const HomeDetail: FC = () => {
  return (
    <div className={styles.detail}>
      <div className={styles.menus}>
        <NavLink to={'links'} className={({ isActive }) => (isActive ? styles.active : '')}>
          <button className={styles.menuButton}>link1</button>
        </NavLink>
        <NavLink to={'links'} className={({ isActive }) => (isActive ? styles.active : '')}>
          <button className={styles.menuButton}>link2</button>
        </NavLink>
        <NavLink to={'links'} className={({ isActive }) => (isActive ? styles.active : '')}>
          <button className={styles.menuButton}>link3</button>
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};
```

现在点击三个按钮内容所展示的内容完全一致，现在为 HomeDetailLink 组件配置参数路由，并修改上面 NavLink 的 to 属性：

```tsx
{
    path: 'home',
    element: <Home/>,
    children: [
        {
            path: 'links/:id',
            element: <HomeLink/>,
        }
    ]
}
// 修改 NavLink to 属性
<NavLink
  to={'links/1'}
  className={({isActive}) => isActive ? styles.active : ''}
>
```

现在再点击三个按钮，浏览器的地址栏 URL 会各不相同，而且同时只会有一个按钮有 active 效果。

现在要在 HomeDetailLink 组件中获取参数路由中 id 的值并展示到页面上，这需要使用 `useParams` hook：

```tsx
type HomeLinkParams = {
  id: string;
};

const HomeLink: FC = () => {
  const params = useParams<HomeLinkParams>();
  return <h3>{`showing link${params.id}`}</h3>;
};
```

### 可选路由

修改上面 link1 按钮的 to 属性，改为 links，这时因为链接里没有上面的动态参数所以会导致 404，对于这种需要 URL 中某个部分允许忽略的情况可以使用可选路由：

```tsx
{
    path: 'home',
    element: <Home/>,
    children: [
        {
            path: 'links/:id?',
            element: <HomeLink/>,
        }
    ]
}
```

在 URL 中使用问号可以使某一部分可以忽略，当然我们也可以忽略上面的 links：

```tsx
{
    path: 'home',
    element: <Home/>,
    children: [
        {
            path: 'links?/:id?',
            element: <HomeLink/>,
        }
    ]
}
```

这样即使跳转路径为 /home/123 也能展示 HomeDetailLink 组件，但是只访问 /home 是不会渲染 HomeDetailLink 的，因为 Home 组件设置的路由会先被匹配到。

### 通配路由

使用星号 `*` 可以进行通配，例如：

```tsx
{
    path: 'home',
    element: <Home/>,
    children: [
        {
            path: 'links/*',
            element: <HomeLink/>,
        }
    ]
}
```

这样凡是以 /home/links 开头的路径都会被 HomeLink 捕获，如果要在 HomeLink 中获取通配得到的内容，还是使用 `useParams`：

```tsx
type HomeLinkParams = {
  id?: string;
  '*'?: string;
};

const HomeLink: FC = () => {
  const params = useParams<HomeLinkParams>();
  return (
    <>
      <h3>{`showing link${params.id ? params.id : '-'}`}</h3>
      <h3>get params from pattern: {params['*']}</h3>
    </>
  );
};
```

如果 NavLink 的 to 为 `/home/links/123/456` 那么上面 params['*'] 的值就是 123/456。

### 大小写敏感设置

默认情况下 URL 匹配大小写不敏感，可以通过将 caseSensitive 设置为 true 开启大小写敏感。

### 设置默认组件

截止到现在，如果直接访问 localhost:5173 会发现右侧实际上没有渲染 Home 组件或者 About 组件导致空白，如果希望有一个默认首选组件，即使不指定 URL 也能渲染出一个组件可以使用 index 属性：

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        /*...other routes...*/
      },
    ],
  },
]);
```

现在再访问 localhost:5173 就会默认展示 IndexPage 了。

::: warning

如果一个 route 规则中设置了 children，那么此规则就不能设置 index 属性了。

:::

### 组件懒加载

Route 配置中可以通过 lazy 属性设置懒加载，可以懒加载 loader、action、element、errorElement 等，lazy 属性是一个 Promise 函数，返回一个路由配置对象，将现有的路由配置改为全部懒加载如下：

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => ({ Component: (await import('../App')).default }),
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('../components')).IndexPage }),
      },
      {
        path: 'about',
        async lazy() {
          const { About, ErrorPage } = await import('../components');
          return {
            element: <About />,
            errorElement: <ErrorPage />,
          };
        },
      },
      {
        path: 'home',
        lazy: async () => ({ Component: (await import('../components')).Home }),
        children: [
          {
            path: 'links/*',
            caseSensitive: false,
            lazy: async () => ({ Component: (await import('../components')).HomeLink }),
          },
        ],
      },
    ],
  },
]);
```

::: warning

懒加载只能用于非路由匹配部分，path、index、children、caseSensitive 等属性要用来路由匹配，所以这些属性不能在 lazy 中返回。

:::

### 导航到组件时获取数据

为了在一个组件被导航激活时获取数据，可以使用 React Router 的 loader 来实现，这个属性是一个函数，一般来说是异步的，此函数接收一个对象，对象中包含两个属性：params 和 request。params 就是 params 参数，request 是 JavaScript Fetch API 的内容，参考：[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)。

下面做一个例子，基于上面的 HomeDetail 和 HomeLink 两个组件，需求是点击不同的按钮后跳转到 HomeLink，在 HomeLink 中根据收到的 params 参数调用接口获取数据并展示：

首先 mock 一些数据：

```ts
// 定义 link 类型
type link = {
  id: string;
  content: string;
};
// mock 数据
const links: Array<link> = [
  {
    id: '1',
    content: 'message of link1',
  },
  {
    id: '2',
    content: 'message of link2',
  },
  {
    id: '3',
    content: 'message of link3',
  },
];

class Link {
  static getLink = async (id: string): Promise<link> => {
    await mockNetwork();
    const index = links.findIndex(link => link.id === id);
    if (index >= 0) {
      return links[index];
    }
    throw new Error('no link found');
  };
}
// 模拟网络请求
const mockNetwork = async () => {
  return new Promise<void>(res => {
    setTimeout(res, 300);
  });
};
```

准备就绪后定义 loader 方法，此方法应该返回一个对象：

```ts
const homeLinkLoader: LoaderFunction = ({ params }: { params: Params<'id'> }) => {
  if (!params.id) {
    throw new Error('empty link id!');
  }
  return Link.getLink(params.id);
};
```

然后将这个 loader 添加到路由定义里：

```tsx
{
  path: "home",
  lazy: async () => ({ Component: (await import("../components")).Home }),
  children: [
    {
      path: "links/:id",
      caseSensitive: false,
      lazy: async () => ({
        Component: (await import("../components")).HomeLink,
        loader: (await import("../components")).homeLinkLoader,
      }),
    },
  ],
},
```

要在组件中使用 loader 返回的数据，可以使用 `useLoaderData` 这个 hook：

```tsx
const HomeLink: FC = () => {
  const link = useLoaderData() as link;
  return (
    <>
      <h3>{link.id}</h3>
      <p>{link.content}</p>
    </>
  );
};
```

上面的这个 `useLoaderData` 只能在对应的组件中使用，现在假设我们要在外层 HomeDetail 组件中访问当前 link，那么可以使用 `useRouteLoaderData` 这个 hook，这个方法接收一个字符串 id，调用此方法会得到路由配置 id 选项等于这个 id 的组件的 loader 的结果：

```tsx
// 为 HomeLink 组件路由配置 id
{
  path: "links/:id",
  caseSensitive: false,
  id: "link",
  lazy: async () => ({
    Component: (await import("../components")).HomeLink,
    loader: (await import("../components")).homeLinkLoader,
    ErrorBoundary: (await import("../components")).ErrorPage,
  }),
},
// 在外部访问 loader
const HomeDetail: FC = () => {
  const link = useRouteLoaderData("link") as link;
  console.log(link);
  // ......
};
```

### action

现在，假设要增加两个按钮，点击第一个按钮创建一个 link 对象，点击第二个按钮删除最后一个 link，要求这两个操作都要触发 UI 重新渲染，根据之前的内容，要想触发 UI 的重新渲染可以通过改变 state 或者 props 来实现，在这个场景中，应该用 state 来实现：

首先定义对 link 的操作：

```ts
static listLinks = async (): Promise<Array<link>> => {
  return new Promise<Array<link>>((res) => {
    res(links);
  });
};

static createLink = async (): Promise<void> => {
  const newLink: link = {
    id: `${links.length + 1}`,
    content: `message of link${links.length + 1}`,
  };
  links.push(newLink);
};

static deleteLastLink = async (): Promise<void> => {
  links.pop();
};
```

然后将 HomeLink 组件的路由中的 :id 参数改为可选项，并修改 loader 方法，如果不传 id 那么就返回全部 link：

```ts
const homeLinkLoader: LoaderFunction = ({ params }: { params: Params<'id'> }) => {
  if (!params.id) {
    return Link.listLinks();
  }
  return Link.getLink(params.id);
};
```

然后修改 HomeDetail 组件的 NavLink，设置其中一个按钮不传 id params 参数，使得能够展示所有 links，最后修改 HomeLink 组件：

```tsx
const HomeLink: FC = () => {
  const data = useLoaderData();
  let links: Array<link>;
  if (data instanceof Array) {
    links = data as Array<link>;
  } else {
    links = [data as link];
  }
  return (
    <div>
      {links.length > 1 ? (
        <div className={styles.buttons}>
          <button className={styles.menuButton}>add</button>
          <button className={styles.menuButton}>delete</button>
        </div>
      ) : undefined}
      <ul>
        {links.map(link => {
          return (
            <>
              <li>
                {link.id} - {link.content}
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};
```

现在开始引入 state，由于 add 和 button 都要操作同一个 state，但是因为有异步操作，所以还是用 state 而不是 reducer：

```tsx
const data = useLoaderData();
const [links, setLinks] = useState<Array<link>>([]);
const onLinkAdd = async () => {
  await Link.createLink();
  const newLinks = await Link.listLinks();
  setLinks([...newLinks]);
};
const onLinkDelete = async () => {
  await Link.deleteLastLink();
  const newLinks = await Link.listLinks();
  setLinks([...newLinks]);
};
```

注意，由于 HomeLink 组件是会随着动态路由不断重新渲染，而 useState 初始化只有第一次才会执行，所以上面的代码里 state 不能在 useState 中初始化，应该使用 useEffect 并且依赖 data：

```ts
useEffect(() => {
  if (data instanceof Array) {
    setLinks(data as Array<link>);
  } else {
    setLinks([data as link]);
  }
}, [data]);
```

上面使用 sate 的实现方式过于复杂，其实只需要触发 loader 执行就可以了，为了解决这个问题，React Router 提供了 action 来支持，action 会改变 loader 的结果，调用 action 后会重新调用 loader，组件也会重新渲染，当组件发生非 GET 类型的提交请求时 action 都会被触发。

action 也是一个函数，此函数接收一个对象，这个对象包含路由动态参数 params 和 Fetch Request 变量 requst，这个函数可以是异步的。

最简单的仍然是表单提交的场景，这里在 About 组件中演示，首先创建一个表单，这个表单具有一个输入框和一个按钮，点击按钮会创建一个 link：

```tsx
const About: FC = () => {
  return (
    <form method="post" action="/about">
      <input name="content" type="text" />
      <button type="submit">create</button>
    </form>
  );
};
```

然后定义一个 action，接收这个表单传递的参数并创建 link：

```ts
// link.ts
static createLink = async (content?: string): Promise<void> => {
  console.log("calling ", "createLink");
  await mockNetwork();
  const newLink: link = {
    id: `${links.length + 1}`,
    content: content ? content : `message of link${links.length + 1}`,
  };
  links.push(newLink);
};
// 定义 action
const aboutAction: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const content = data.get("content") as string;
  await Link.createLink(content);
  return redirect("/home/links");
};
```

上面的 action 返回一个 redirect，这个方法可以在 loader 或者 action 中使用，调用这个方法就相当于创建一个 302 状态的，同时设置了重定向地址的 Fetch API Response 对象。

接下来配置路由，将这个 action 设置给 About 组件：

```tsx
{
  path: "about",
  lazy: async () => ({
    Component: (await import("../components")).About,
    ErrorBoundary: (await import("../components")).ErrorPage,
    action: (await import("../components")).aboutAction,
  }),
},
```

现在，点击这个表单的按钮，会发现请求报错 404，这是因为原生表单提交时浏览器会向 action 发送请求并刷新页面，上面的代码中是向 /about 发送 POST 请求，这会导致 404，即使改为 GET 方式也不会创建 link，因此在这种场景中需要拦截浏览器对表单的默认处理，在 React Router 中可以使用封装的 Form 组件完成：

```tsx
const About: FC = () => {
  return (
    <Form method="post">
      <input name="content" type="text" />
      <button type="submit">create</button>
    </Form>
  );
};
```

现在点击提交后会调用 action 并且重定向到 HomeLink 组件。

::: tip

action 属性如果不指定那么默认是交给当前路径对应的组件的 action 进行处理。

:::

因为 action 不响应 GET 方式的提交，如果上面的 form 是 get 方式提交的，那么可以在指定 action 中通过 loader 中的 request 来获取提交的内容，例如现在为 About 组件加一个 loader，只获取并输出提交的内容：

```tsx
// 添加 loader 获取 GET 方式提交的表单
const aboutLoader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  return url.searchParams.get('content');
};
// 在 loader 对应的组件中使用 useLoaderData
const About: FC = () => {
  console.log(useLoaderData());
  return (
    <Form method="get">
      <input name="content" type="text" />
      <button type="submit">create</button>
    </Form>
  );
};
```

HomeLink 中的例子不适合表单实现，React Router 提供了 useSubmit 这个 hook，此方法返回一个函数，此函数第一个参数是 target, 可以是 FormData、JsonValue 等，用来传递数据；第二个参数是提交选项，可以控制 method、action 等属性，要改写上面的 HomeLink，先修改 HomeLink 组件：

```tsx
// 移除事件处理函数和 state
<button className={styles.menuButton} onClick={() => {submit({method: 'create'}, {method: 'post', encType: 'application/json'})}}>
  add
</button>
<button className={styles.menuButton} onClick={() => {submit({method: 'delete'}, {method: 'delete', encType: 'application/json'})}}>
  delete
</button>
```

::: warning

上面如果使用 JSON 传递数据那么必须手动设置 encType 为 application/json。

:::

然后定义 action：

```ts
const linkAction: ActionFunction = async ({ request }) => {
  const data = (await request.json()) as { method: 'create' | 'delete' };
  if (data.method === 'create') {
    await Link.createLink();
  } else {
    await Link.deleteLastLink();
  }
  return null;
};
```

现在点击添加或者删除组件同样会重新渲染而不再依赖 state。

action 也可以返回数据，返回的内容可以在对应组件中使用 `useActionData` 这个 hook 来获取，例如上面的 linkAction 我们返回一个 Fetch API 的 Response 对象，并将状态设置为 200：

```ts
const linkAction: ActionFunction = async ({ request }) => {
  const data = (await request.json()) as { method: 'create' | 'delete' };
  if (data.method === 'create') {
    await Link.createLink();
  } else {
    await Link.deleteLastLink();
  }
  return new Response('{"status": "ok"}', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

然后我们在 HomeLink 中使用 `useActionData` 获取：

```ts
const actionData = useActionData();
console.log('action data', actionData, typeof actionData);
```

### shouldRevalidate

默认情况下，渲染组件或者触发 action 都会导致调用 loader，shouldRevalidate 方法会在 loader 新数据之前调用，此方法如果返回 false，那么 loader 将不会被调用，也就是说展示的数据还是旧数据，此方法接收一个对象参数，这个对象中包含触发 action 的数据（formData、json 等）以及一些其他数据，现在为 HomeLink 组件定义一个 shouldRevalidate，使得点击添加后创建 link 但是不更新页面，点击删除正常更新页面。

首先定义 shouldRevalidate 方法：

```ts
const homeLinkShouldRevalidate: ShouldRevalidateFunction = ({ json }) => {
  if (!json) {
    return false;
  }
  const temp = json as { method: 'create' | 'delete' };
  return temp.method !== 'create';
};
```

然后修改 HomeLink 组件的路由配置：

```ts
lazy: async () => ({
  Component: (await import("../components")).HomeLink,
  loader: (await import("../components")).homeLinkLoader,
  ErrorBoundary: (await import("../components")).ErrorPage,
  action: (await import("../components")).linkAction,
  shouldRevalidate: (await import("../components")).homeLinkShouldRevalidate,
}),
```

接下来点击 add 或者 delete 会发现页面仍然在正常更新，似乎 shouldRevalidate 没有生效？不，其实已经生效了，可以在 loader 中打印 log 来证明这一点，页面正常更新是因为 Link 类中 listLinks 返回了存储 links 的数组变量，这导致在第一次渲染的时候拿到的就是这个变量，后面即使 loader 不执行但是因为引用的关系在组件中使用 `useLoaderData` 仍然能拿到最新的 links 值，因此修改 listLinks：

```ts
static listLinks = async (): Promise<Array<link>> => {
  console.log("calling ", "listLinks");
  await mockNetwork();
  return new Promise<Array<link>>((res) => {
    res([...links]);
  });
};
```

::: danger

React 中很多值要理解为不可变，例如 useState、useLoader，这些方法的结果必须是全新的数据，不能是引用。

:::

## 编程式路由

使用 `useNavigate` 获取 navigate 对象，通过此对象操作路由。

首先构造一个导航组件：

```tsx
const NavigatePage: FC = () => {
  const ngv = useNavigate();
  const navigate = () => {};
  return (
    <div className={styles.top}>
      <button
        className={styles.button}
        onClick={() => {
          navigate();
        }}
      >
        Go
      </button>
    </div>
  );
};
```

调用 useNavigate 获取一个 NavigateFunction 对象，类型声明如下：

```ts
export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}
```

用法一，前进后退指定步数：

```ts
const navigate = () => {
  ngv(-1);
};
```

用法二，通过配置项跳转：

```ts
const navigate = () => {
  ngv('/home/links', { state: { now: new Date() } });
};
```

此外，此方法支持相对路径，默认情况下，相对路径被解析为以路由为相对，举例来说，如果当前路径是 /test/nvg，之前的路径是 /home，那么这种情况下 `navigate('..')` 会向上跳转一级路由，也就是跳转到 /home，如果函数的选项中设置了 Relative 属性为 path，那么相对跳转就是相对于 URL 了，例如 /test/nvg 向上跳转会跳转到 /test。

```ts
ngv('..', { relative: 'path' });
```

## 传递参数

### 传递 params 参数

见上文。

### 传递 query 参数

如果要读取 query 参数，除了在 loader 中使用 Fetch API Request 的相关方法外，还可以使用 `useSearchParams` 方法，此方法类似 useState，返回的第一个元素是 query 参数，第二个元素是这个 query 参数的 setter：

```tsx
const About: FC = () => {
  const [query] = useSearchParams();
  console.log(query.get('a'));
  return (
    <Form method="get">
      <input name="content" type="text" />
      <button type="submit">create</button>
    </Form>
  );
};
```

这个 hook 也可以像 useState 那样设置初始值。

### 传递 state

这里的 state 不是 React useState 的 state，这里指的只是临时的数据传输对象，传递数据时，数据被保存在了浏览器历史记录 history 对象的 state 字段上。

有很多方法可以传递 state：Link、NavLink 组件、navigate 编程式路由、Form 组件、useSubmit 等，下面一一演示：

Link、NavLink 传递：

```tsx
<NavLink
  to={"links"}
  className={({ isActive }) => (isActive ? styles.active : "")}
  state={{ now: new Date() }}
  end={true}
>
```

Form 传递：

```tsx
<Form method="get" state={{ now: new Date() }}>
  <input name="content" type="text" />
  <button type="submit">create</button>
</Form>
```

编程式路由传递：

```tsx
const ngv = useNavigate();
const navigate = () => {
  ngv('..', { state: { now: new Date() } });
};
```

useSubmit 传递：

```tsx
submit(
  { method: 'delete' },
  { method: 'post', encType: 'application/json', state: { now: new Date() } }
);
```

读取 state 可以使用 `useLocation`：

```tsx
type myState = { now: Date };
const { state }: { state: myState } = useLocation();
console.log(state.now);
```

::: tip

如果 state 是 Form 或者 submit 传递，那么 action 不能 return redirect 重定向，否则 state 会清空。

:::

## 获取当前组件的路由信息

有时候需要在组件中获取当前路由的一些信息，这时可以使用 `useNavigation` 这个 hook，这个方法会返回一个对象，这个对象包含了很多的属性。

### state

这里的 state 不是 useState 和 Link 传递的那个 state，这里是一个表示当前组件渲染的状态，有 loading、submitting、idle 三种状态。

```tsx
<span>
  {navigation.state === 'submitting' ? 'saving' : navigation.state === 'loading' ? 'saved' : 'go'}
</span>
```

- idle：当前没有正在发生的导航。
- submitting：当前有 action 被触发。
- loading：正在调用 loader。

一个组件的 navigation.state 一般有以下两种变化顺序：

```txt
没有 action 被执行：
idle -> loading -> idle

有 action 执行：
idle -> submitting -> loading -> idle
```

### formData、text、json

navigation.formData 中保存着以 formData 传输的数据，如果是 Form 表单提交的数据或者 useSubmit 使用默认的 encType 传输的数据保存在这里。

如果 encType 设置为 application/json，那么数据会保存在 navigation.json 中，例如我们上面的例子中，HomeLink 组件点击添加或者删除后是通过 JSON 传递的数据，从这里就能够取到。

如果 encType 设置为 text/plain，那么传递的数据保存在 navigation.text 中。

### location

内容与调用 `useLocation()` 的结果相同，包含 state。

::: warning

以上的各个字段在 idle 状态下是取不到的。

:::

## defer 异步加载数据

目前通过 loader 加载数据时，如果接口的响应很慢，那么组件的渲染会在接口响应结束后进行，这可能会导致一些体验上的问题，为了解决这个问题，React Router 提供了 defer 方法，此方法包裹的内容会异步执行，也就是说会先渲染组件再等待响应，这样就可以在页面上添加加载中的效果，defer 要配合 React Suspense 组件和 React Router Await 组件使用，例如我们现在修改 HomeLink 的 loader：

```ts
const homeLinkLoader: LoaderFunction = ({ params }: { params: Params<'id'> }) => {
  console.log('home link loader running...');
  if (!params.id) {
    return defer({ links: Link.listLinks() });
  }
  return defer({ links: Link.listLinks(params.id) });
};
```

然后修改 HomeLink 组件：

```tsx
const HomeLink: FC = () => {
  console.log('rendering HomeLink');
  const { links } = useLoaderData() as { links: Promise<Array<link>> };

  const navigation = useNavigation();
  const submit = useSubmit();
  return (
    <div>
      <span>
        {navigation.state === 'submitting'
          ? 'saving'
          : navigation.state === 'loading'
            ? 'saved'
            : 'go'}
      </span>
      <Suspense fallback={<p>loading...</p>}>
        <Await resolve={links} errorElement={<ErrorPage />}>
          {(links: Array<link>) => (
            <>
              {links.length > 1 ? (
                <div className={styles.buttons}>
                  <button
                    className={styles.menuButton}
                    onClick={() => {
                      submit(
                        { method: 'create', action: '/home/links' },
                        { method: 'post', encType: 'application/json' }
                      );
                    }}
                  >
                    add
                  </button>
                  <button
                    className={styles.menuButton}
                    onClick={() => {
                      submit(
                        { method: 'delete' },
                        {
                          method: 'post',
                          encType: 'application/json',
                        }
                      );
                    }}
                  >
                    delete
                  </button>
                </div>
              ) : undefined}
              <ul>
                {links.map(link => {
                  return (
                    <li key={link.id}>
                      {link.id} - {link.content}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
};
```

现在在初次加载此页面时会有 loading 显示，而不是白屏。

### Await

为了实现数据的异步渲染，React Router 提供了 Await 组件，此组件有三个属性。

resolve：

此属性接收一个 Promise 对象，并在 resolve 后开始执行渲染。

errorElement：

此属性用来指定如果 resolve 中的 Promise 报错了应该显示什么内容。

children：

这个属性可以是一个元素标签或者是一个函数，如果是函数的话，那么 resolve 中的 Promise 中的内容将被作为参数传递到这个函数里。

### 异步加载的错误处理

为了对异步加载可能导致的报错进行处理，可以在 Await 组件中设置 errorElement 属性：

```tsx
<Await resolve={links} errorElement={<ErrorPage />}>
...
```

这种情况下，错误处理的组件使用之前的 `useRouteError` 将得到 undefined，应该使用 `useAsyncError()`：

```tsx
const ErrorPage: FC = () => {
  const err = useAsyncError() as Error;
  return (
    <div className={styles.page}>
      <span className={styles.text}>oop! There is an error: {err.message}</span>
    </div>
  );
};
```

### useAsyncData

上面 Await 中包裹的内容过多，可读性不强，为了提高可读性，可以将其中的内容抽取为一个组件，在这个组件里，为了获取异步得到的数据，使用 `useAsyncValue()` 方法：

```tsx
const Links: FC<{ submit: SubmitFunction }> = ({ submit }) => {
  const links: Array<link> = useAsyncValue() as Array<link>;
  // .....
};

// 修改 Await 组件的内容
<Await resolve={links} errorElement={<AsyncErrorPage />}>
  <Links submit={submit} />
</Await>;
```

### 部分异步

有的数据可能必须要在页面渲染前处理，因此可以在 defer 中通过 await 来限制部分异步：

```ts
const homeLinkLoader: LoaderFunction = async ({ params }: { params: Params<'id'> }) => {
  console.log('home link loader running...');
  if (!params.id) {
    return defer({ links: await Link.listLinks() });
  }
  return defer({ links: Link.listLinks(params.id) });
};
```

上面的代码中，第一个 links 将会在组件被渲染前调用。

## Fetcher

在之前的例子中，如果想触发一个 loader，那么必须要导航到此 loader 的路由，但是有些时候出于代码复用的考虑，可能需要不跳转就调用 loader，此时可以使用 Fetcher 来实现。

首先通过 `useFetcher()` 获取一个 fetcher 实例：

```tsx
const About: FC = () => {
  console.log('rendering About');
  const fetcher = useFetcher();
  // ....
};
```

### state

fetcher 也有 state 属性，此属性取值与 useNavigation 中的 state 一致。

### 调用 loader、action

现在，为 About 定义一个 button，每次点击就调用 HomeLink 组件的 loader：

```tsx
return (
  <div>
    <button
      onClick={() => {
        fetcher.load('/home/links/1');
      }}
    >
      click
    </button>
  </div>
);
```

loader 或者 action 返回的数据都包含在 fetcher.data 中，现在要将结果渲染到页面上：

```tsx
const About: FC = () => {
  const fetcher = useFetcher<{ links: Array<link> }>();
  return (
    <div>
      <button
        onClick={() => {
          fetcher.load('/home/links/1');
        }}
      >
        click
      </button>
      {fetcher.data ? (
        <ul>
          {fetcher.data.links.map(link => (
            <li key={link.id}>
              {link.id}-{link.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};
```

调用 action 与调用 loader 类似，使用 fetcher.submit 方法触发一个 action，此方法用法和 useSubmit 类似：

```tsx
<button
  onClick={() => {
    fetcher.submit(
      { method: 'delete' },
      {
        method: 'post',
        encType: 'application/json',
        action: '/home/links',
      }
    );
  }}
>
  click
</button>
```

::: tip 获取即将提交的数据

当使用 fetcher 触发 loader 或者 action 时，传递给 loader 或者 action 的参数保存在 formData、json、text 属性中，并根据 encType 决定到底保存在哪个字段里。注意，只有 submitting state 的情况下能够取到这些内容。

:::

### 提交表单

fetcher 提供了封装的 Form 组件，此组件支持调用其他 action，将之前的 aboutAction 转移给其他页面，然后修改 About 组件：

```tsx
return (
  <div>
    <fetcher.Form method="post" action="/test/navigate">
      <input name="content" type="text" />
      <button type="submit">create</button>
    </fetcher.Form>

    {fetcher.data ? (
      <ul>
        {fetcher.data.links.map(link => (
          <li key={link.id}>
            {link.id}-{link.content}
          </li>
        ))}
      </ul>
    ) : (
      <p>loading...</p>
    )}
  </div>
);
```

## 实现路由守卫功能

很多网站都有权限管理功能，每个页面要求访问者具有相应的权限，为了实现这个功能，我们需要一个全局路由守卫，React Router 并没有提供这个功能，因此需要我们自行实现。要实现此功能需要先了解 React Router 的 Navigator 组件，此组件可以指定 to 属性，一旦此组件被渲染，那么就会立即跳转到对应路由，基于此可以实现路由守卫功能。

首先，由于子路由会被渲染到父组件中使用 `<Outlet/>` 的位置上，因此我们可以包装一层，并且在代码中使用自己的 Outlet，例如：

```tsx
const GuardRouter: FC<{ context?: unknown }> = ({ context }) => {
  const pathName = useLocation().pathname;
  let isAuthorized = true;
  if (!['/'].includes(pathName)) {
    isAuthorized = Link.isAuthorized();
  }
  console.log('rendering GuardRouter');
  return <>{!isAuthorized ? <Navigate to={'/'} /> : <Outlet context={context} />}</>;
};
```

在这个组件中，如果当前路径不在免认证路径中，那么进行验证，验证成功返回 Outlet 组件，否则通过渲染 Navigate 组件将路由重定向到根路径。

如果希望更细粒度的控制，可以使用下面的组件：

```tsx
const ProtectedRoute: FC<{ children: ReactElement }> = ({ children }) => {
  return <>{Link.isAuthorized() ? children : <Navigate to={'/'} />}</>;
};
```

然后在路由配置中使用自定义组件包裹正常组件：

```tsx
{
  path: "links/:id?",
  id: "link",
  lazy: async () => {
    const components = await import("../components");
    return {
      element: (
        <components.ProtectedRoute>
          <components.HomeLink />
        </components.ProtectedRoute>
      ),
      loader: components.homeLinkLoader,
      ErrorBoundary: components.ErrorPage,
      action: components.linkAction,
    };
  },
},
```

## 其他 hooks

### useMatches

这个 hook 返回当前组件在路由中的信息，返回值为一个数组，此数组包含从根路径一直到当前组件路径的路由，数组内元素：

```ts
export interface UIMatch<Data = unknown, Handle = unknown> {
  id: string;
  pathname: string;
  params: AgnosticRouteMatch['params'];
  data: Data;
  handle: Handle;
}
```

- id：路由的 id。
- pathname：路由的路径。
- params：参数路由中的参数值。
- data：从 loader 中传来的数据，**如果 loader 用了 defer，那么这个字段会是 Promise 对象**。
- handle：定义路由时设置的参数，例如：

  ```tsx
  {
    path: "about",
    lazy: async () => ({
      Component: (await import("../components")).About,
      ErrorBoundary: (await import("../components")).ErrorPage,
      handle: { now: new Date() },
      loader: (await import("../components")).aboutLoader,
    }),
  },
  ```

### useOutletContext

有时父组件希望向子组件传递 state 或者是一些其他值，可以向 Outlet 组件传递 context 属性来实现，为了在子组件中获取传递的值，可以使用 `useOutletContext()`：

```tsx
// App.tsx
<Outlet context={{ now: new Date() }} />;
// About.tsx
console.log(useOutletContext<{ now: Date }>().now);
```
