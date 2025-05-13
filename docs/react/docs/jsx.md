# JSX

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>hello</title>
    <style>
      .test {
        background-color: cornflowerblue;
      }
    </style>
  </head>
  <body>
    <div id="test"></div>
  </body>
  <script type="text/javascript" src="../js/react.development.js"></script>
  <script type="text/javascript" src="../js/react-dom.development.js"></script>
  <script type="text/javascript" src="../js/babel.min.js"></script>
  <script type="text/babel">
    const id = '123';
    const content = 'Hello World';
    const dom = (
      <>
        <h1 id={id} className="test">
          <span>{content}</span>
        </h1>
        {/* 注释 */}
        <h1 id={id + '1'} style={{ backgroundColor: 'blue' }}>
          <span>{content}</span>
        </h1>
      </>
    );
    ReactDOM.render(dom, document.querySelector('#test'));
  </script>
</html>
```

JSX 的语法规则：

- 需要使用 JavaScript 语法的地方使用 `{}` 嵌入表达式。
- 因为 ES6 中使用 class 作为类关键字，所以要为一个标签指定 class 属性需要使用 className，此外，JSX 中所有标签的属性都是驼峰命名。
- 内联样式不能使用字符串定义，要使用 `style={{}}` 语法，外层表示要使用 JavaScript 嵌入表达式，内层表示要定义一个 JavaScript 对象。
- JSX 中只能有一个根节点，可以使用空标签 `<></>` 包裹。
- 所有标签必须闭合。
- 如果要在 JSX 中使用注释可以用 `{/* 123 */}` 这种语法。
- 如果标签首字母大写，那么 React 会将这个标签解析为组件，如果首字母小写那么会被解析为 HTML 标签。

## 列表渲染

现在有下面这样一个数组：`const languages = ['Java', 'Go', 'JavaScript', 'PHP'];`，需要将其渲染到 ul 标签中，可以使用 `map()` 方法从数组生成组件。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>hello</title>
  </head>
  <body>
    <div id="test"></div>
  </body>
  <script type="text/javascript" src="../js/react.development.js"></script>
  <script type="text/javascript" src="../js/react-dom.development.js"></script>
  <script type="text/javascript" src="../js/babel.min.js"></script>
  <script type="text/babel">
    const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
    const languagesDom = languages.map(language => {
      return <li>{language}</li>;
    });
    const dom = (
      <>
        <h2>languages</h2>
        <ul>{languagesDom}</ul>
      </>
    );
    ReactDOM.render(dom, document.querySelector('#test'));
  </script>
</html>
```

上面的代码会报错，因为没有为 li 标签指定 key 值，key 值可以是字符串或者数字的形式，key 值需要满足下面的条件：

- key 值在兄弟节点之间必须是唯一的，但是不需要全局唯一，在不同的数组中可以使用相同的 key。
- key 值不能改变，否则就失去了使用 key 的意义。

::: tip

React key 值原理类似 Vue，不建议使用数组下标作为 key，这会在数组的插入、删除或者重新排序时发生问题。

:::

如果希望为每个列表项显示多个 DOM 节点而不是一个，需要使用一个根标签将多个 DOM 包裹起来，但是 `<></>` 标签无法接收 key 值，所以要么使用 `<div>` 标签，要么使用 `<></>` 的完整写法 `<Fragment></Fragment>`，这类似 Vue template 标签，不会渲染成 HTML 标签：

```html
<script type="text/babel">
  const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
  const languagesDom = languages.map((language, index) => {
    return (
      <React.Fragment key={index}>
        <li>{language}</li>
        <li>{language.toLowerCase()}</li>
      </React.Fragment>
    );
  });
  const dom = (
    <>
      <h2>languages</h2>
      <ul>{languagesDom}</ul>
    </>
  );
  ReactDOM.render(dom, document.querySelector('#test'));
</script>
```

::: warning

因为浏览器不支持 ES6 的导入，babel 只负责语法翻译，不会执行模块解析和加载，所以上面的 Fragment 组件不能使用 `import { Fragment } from 'react';` 引入，而是使用全局对象 React 直接访问。

:::

## 条件渲染

```html
<script type="text/babel">
  const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
  const lower = true;
  const languagesDom = languages.map(language => {
    return <li>{lower ? language.toLowerCase() : language}</li>;
  });
  const dom = (
    <>
      <h2>languages</h2>
      <ul>{languagesDom}</ul>
    </>
  );
  ReactDOM.render(dom, document.querySelector('#test'));
</script>
```
