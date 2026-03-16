# CSS 伪元素

CSS 伪元素用于设置元素指定部分的样式。

::first-line 伪元素用于向文本首行添加特殊样式，只能应用于块级元素。

::first-letter 伪元素用于向文本的首字母添加特殊样式，只能用于块级元素。

::before 伪元素用于在元素内容之前插入一些内容。

在每个 h1 元素的内容前插入一副图像：

```css
h1::before {
  content: url(smiley.gif);
}
```

::after 伪元素用于在元素内容后插入一些内容。

::selection 伪元素匹配用户选择的元素部分。

选中文本添加黄色背景：

```css
::selection {
  color: red;
  background: yellow;
}
```

所有 CSS 伪元素：[CSS 伪元素](https://www.w3school.com.cn/css/css_pseudo_elements.asp)
