# 通过脚手架创建 react 应用

通过以下命令可以创建一个 react 应用：

```shell
npx create-react-app my-app
```

npx 是一个包执行器工具，随着 npm 一起分发，从 npm5.2.0 版本之后 npx 已经被包含在 npm 中，npx 的主要用途：

- 直接运行包：如果没有全局安装某个包（上面的 create-react-app），但是仍想运行这个包可以使用 npx。
- 避免全局安装：npx 可以在没有全局安装工具的情况下运行这些工具。

如果不希望使用 npx，那么可以先使用 `npm install -g create-react-app` 命令全局安装 react 脚手架，然后执行脚手架创建应用。

## 配置 TypeScript

首先要安装 react 类型声明：

```shell
npm install @types/react @types/react-dom
```

然后配置 tsconfig.json 文件，以下是一个示例：

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES6",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "noEmit": true,
    "jsx": "preserve",
    "allowUnreachableCode": false
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

::: warning

- lib 必须要包含 DOM，如果没指定 lib 选项，那么默认情况下会包含 DOM。
- jsx 必须是一个有效值，通常使用 preserve，其他选项参考：[JSX](https://www.typescriptlang.org/tsconfig#jsx)。

:::

其中几个主要设置：

- noEmit：不输出编译后的 JavaScript 代码，仅进行 TypeScript 类型检查。
- allowJs：有的库可能是 JavaScript 写的，此选项允许编译时包含 JavaScript 代码。
- allowUnreachableCode： 是否禁止不可达代码。例如 return 写在前面则后面的代码为不可达。

最后将脚手架创建的 js 文件改写为 ts 文件，如果文件中有 JSX，那么文件后缀名应该是 .tsx。

## 样式模块化

为了防止相同选择器的 css 定义重复导致样式混乱，可以使用样式模块化来实现类似 vue scoped style 的效果。样式模块化通过 CSS Modules 实现，如果是使用 create-react-app 创建的应用，CSS Modules 已经内置。

模块化的样式应该遵循 `xxx.module.css` 的规则（webpack.config.js 中的配置），然后在要使用的组件文件中引用：

```tsx
import styles from './app.module.less';
function Title() {
  return <Tag className={styles.text}>123</Tag>;
}
```

如果使用的 TypeScript，那么需要安装 CSS Modules 的类型声明：`yarn add -D @types/css-modules`。

## 启用 less

默认情况下 create-react-app 创建的应用不支持 less，需要手动开启对 less 的支持。

首先安装 less 相关依赖：

```shell
yarn add less less-loader
```

然后要修改默认的 webpack 配置，使得能够处理 less 文件，首先执行下面的命令，此命令将所有的配置暴露出来，交给开发者维护，此操作不可逆：

```shell
yarn eject
```

运行之后，修改 config 目录下的 webpack.config.js，首先要定义 less 文件的匹配规则：

```js
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
```

然后增加 less 的解析配置，在默认的 sass 解析配置之后增加下面的配置：

```js
// add less loader
{
  test: lessRegex,
  exclude: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 3,
      sourceMap: isEnvProduction
        ? shouldUseSourceMap
        : isEnvDevelopment,
      modules: {
        mode: 'local',
        getLocalIdent: getCSSModuleLocalIdent,
      },
    },
    'less-loader'
  ),
  sideEffects: true
},
{
  test: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 3,
      sourceMap: isEnvProduction
        ? shouldUseSourceMap
        : isEnvDevelopment,
      modules: {
        mode: 'local',
        getLocalIdent: getCSSModuleLocalIdent,
      },
    },
    'less-loader'
  ),
  sideEffects: true
},
```

关于上面的几个配置项：

- importLoaders：此选项表示在处理 css `@import` 之前要应用于 `@import` 的资源的处理器数量，这里设置为 3，因为需要 less-loader 的处理同时可能还有其他的处理器（见 getStyleLoaders 方法）。
- mode：此选项决定如何应用 CSS Modules，有以下取值：

  - local：默认值，类名会被局部化，引用后实际的类名将会有一个随机后缀。
  - global：所有类名都不会被局部化，但是又允许像 CSS Modules 那样引用。
  - pure：类似 local，但是仅局部化纯类名，不会局部化使用了其他选择器的类名。
  - globalAndLocal、localAndGlobal：允许在同一个文件中使用局部化和全局类名，使用 `:global` 和 `:local` 伪选择器来明确哪些类名被局部化，哪些保持全局化。

    ```css
    .localClassName {
      /* this will be localized */
    }
    :global .globalClassName {
      /* this will remain as "globalClassName" */
    }
    ```

## 配置代理

为了解决开发时请求接口的跨域问题，需要给应用配置一个反向代理。

修改 package.json：

```json
{
  "proxy": "http://127.0.0.1:8888"
}
```
