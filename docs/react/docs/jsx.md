# JSX

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>hello</title>
    <style>
        .test{
            background-color: cornflowerblue;
        }
    </style>
</head>
<body>
<div id="test">

</div>
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
            <h1 id={id + '1'} style={{backgroundColor: 'blue'}}>
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

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>hello</title>
</head>
<body>
<div id="test">

</div>
</body>
<script type="text/javascript" src="../js/react.development.js"></script>
<script type="text/javascript" src="../js/react-dom.development.js"></script>
<script type="text/javascript" src="../js/babel.min.js"></script>
<script type="text/babel">
    const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
    const languagesDom = languages.map((language) => {
       return <li>{language}</li>
    });
    const dom = (
      <>
          <h2>languages</h2>
          <ul>
              {languagesDom}
          </ul>
      </>
    );
    ReactDOM.render(dom, document.querySelector('#test'));
</script>
</html>
```

## 条件渲染

```html
<script type="text/babel">
    const languages = ['Java', 'Go', 'JavaScript', 'PHP'];
    const lower = true;
    const languagesDom = languages.map((language) => {
       return <li>{lower ? language.toLowerCase() : language}</li>
    });
    const dom = (
      <>
          <h2>languages</h2>
          <ul>
              {languagesDom}
          </ul>
      </>
    );
    ReactDOM.render(dom, document.querySelector('#test'));
</script>
```
