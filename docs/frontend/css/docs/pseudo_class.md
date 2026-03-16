# 伪类

伪类用于定义元素的特殊状态。

:first-child 伪类与指定的元素匹配，该元素是另一个元素的第一个子元素。

匹配作为任何元素的第一个子元素的任何 p 元素：

```css
p:first-child {
  color: blue;
}
```

匹配所有 p 元素中的第一个 i 元素：

```css
p i:first-child {
  color: blue;
}
```

匹配所有第一个 p 标签中的所有 i 元素：

```css
p:first-child i {
  color: blue;
}
```

:lang 伪类允许为不同的语言定义特殊的规则。

为属性 lang="en" 的 q 元素定义引号：

```css
q:lang(en) {
  quotes: '~''~';
}
```

所有 CSS 伪类：[CSS伪类](https://www.w3school.com.cn/css/css_pseudo_classes.asp)
