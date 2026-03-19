# Hello World

## 引入相关依赖

在 [CDN](https://www.bootcdn.cn/) 上下载 react.development.js、react-dom.development.js、babel.min.js 这三个文件，因为是在浏览器环境，所以要下载 URL 中包含 umd 的文件，否则在浏览器中会因为 process.env 的调用报错。

## 第一个 react

编写下面的 HTML：

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
    const dom = <h1>Hello World</h1>;
    ReactDOM.render(dom, document.querySelector('#test'));
  </script>
</html>
```

::: tip

注意渲染逻辑中 script 标签的 type 属性需要是 "text/babel"，因为浏览器不支持 JSX(Javascript XML)，需要通过 babel 翻译。

:::

这样就创建出了一个 react 应用。

## 不使用 JSX

也可以只使用 JavaScript 语法创建 react 应用：

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
  <script type="text/javascript">
    const dom = React.createElement(
      'h1',
      { id: '1' },
      React.createElement('span', {}, 'Hello World')
    );
    ReactDOM.render(dom, document.querySelector('#test'));
  </script>
</html>
```

通过 `React.createElement` 方法可以创建虚拟 DOM，第一个参数是标签名，第二个参数是个对象，表示为这个标签设置的属性值，第三个标签表示这个虚拟 DOM 中的内容，上面的程序会创建一个 `<h1 id="1"><span>Hello World</span></h1>` 的虚拟 DOM。
