# CSS

## 选择器

- 元素选择器。
- id 选择器。
- 类选择器。如果将两个类选择器链接在一起，那么只会选择同时有这两个类的元素。
- 通用选择器：使用 * 选择页面上所有的 HTML 元素。
- 分组选择器：使用逗号分隔每个选择器。
- 属性选择器：通过中括号选中包含某个属性的元素，可以指定属性值。
    类型|描述
    ----|----
    [title]|选中有 title 属性的元素
    [class~="important"]|选中 class 属性中包含 important 的元素
    [title^="def"]|选中 title 属性值以 def开头的元素
    [title$="def"]|选中 title 属性值 以 def结尾的元素
    [title*="def"]|选中 title 属性值包含子串 def 的元素
    [title\|="def"]|选中 title 属性值等于 def 或者是以 def- 开头的元素
- 后代选择器：例如 `h1 em{color:red;}` 会选中作为 h1 元素后代的 em 元素。
- 子元素选择器：只能选中作为某元素子元素的元素，例如 `h1>strong` 只会选择只作为 h1 元素子元素的 strong 元素，如果一个 strong 元素和 h1 元素之间还有其他元素则不会被选中。
- 相邻兄弟选择器：选择紧接在另一个元素后的元素，而且二者有相同的父元素，例如 `h1+p` 选择紧接在 h1 元素后出现的段落，h1 和 p 元素有共同的父元素。

## CSS 颜色

### RGB

使用公式 `rgb(red, green, blue)` 将颜色指定为 RGB值，每个参数定义了 0 到 255 之间的颜色强度。

### RGBA

扩展了 RGB，额外制定了颜色的不透明度，使用公式 `rgba(red, green, blue, alpha)` 指定颜色，alpha 参数是介于 0.0（完全透明）和 1.0（完全不透明）之间的数字。

### HEX

使用十六进制指定颜色 `#rrggbb`，每一组都是介于 00 和 ff 之间的十六进制值，对应 0-255。

### HSL

使用色相、饱和度和明度来指定颜色，格式：`hsla(hue, saturation, lightness)`，色相 hue 是色轮上从 0 到 360 的度数，0 是红色，120 是绿色，240 是蓝色；饱和度 saturation 是一个百分比值，0 表示灰色阴影，100 表示全色；亮度是百分比，0 是黑色，100 是白色。

## 背景

- 指定元素背景色：`background-color`。
- 指定透明度：`opacity`，取值范围 0.0 ~ 1.0，值越低越透明。
- 背景图像：`background-image`，默认情况下图像会重复填充整个元素，取值通过 `url("demo.png")` 的形式。
- 背景重复：默认情况下，图像会在水平和垂直方向上都重复，通过 `background-repeat` 设置重复的方向。
    - 水平重复：`repeat-x`。
    - 垂直重复：`repeat-y`。
    - 不重复：`no-repeat`。
- 背景图像位置：`background-position`，两个值，第一个是水平位置，第二个是垂直位置。
    - center top left right bottom.
    - x% y%.
    - xpos ypos.
- 相对定位 background-origin：
    - padding-box：相对与内边距框来定位。
    - border-box：相对于边框盒来定位。
    - content-box：相对于内容框来定位。
- 裁剪 background-clip：
    - border-box：背景被裁剪到边框盒。
    - padding-box：背景被裁剪到内边距框。
    - content-box：背景被裁剪到内容框。
- 背景图像的尺寸：`background-size: length|percentage|cover|contain`。
    - length：设置背景图像高度和宽度，第一个值为宽度，第二个值为高度。
    - percentage：以父元素的百分比设置背景图像的宽度和高度，第一个值为宽度，第二个值为高度。
    - cover：把背景图片扩展至足够大。
    - contain：把图像扩展至最大尺寸。
- 背景附着：通过 `background-attachment` 属性指定背景图像是滚动的还是固定的。
    - 固定：设为 fixed。
    - 滚动：设为 scroll。
- 简写背景属性：使用 `background` 属性，将属性值按空格分隔，顺序为：color-image-repeat-attachment-position。

## 边框

- 边框样式：border-style，可以选四个值，上、右、下、左。
- 边框宽度：border-width，可以是一到四个值。
- 边框颜色：border-color，可以使用一到四个值。
- 简写属性：border，顺序是 width、style、color。
- 圆角边框：border-radius。

## 盒子模型

### 外边距

margin 可以设置上、右、下、左的外边距，可以设为 auto，元素会在其容器中水平居中；还可以设为 inherit 边距继承自父元素。

外边距合并：当两个垂直外边距相遇时，合并后的外边距的高度为两个外边距中的较大者。当一个元素包含在另一个元素中时，上下外边距也会发生合并；如果一个元素内容为空，上下外边距碰到了一起也会合并。

### 内边距

padding 属性用于在任何定义的边界内的元素周围生成空间。

通过 width 属性指定元素内容区域的宽度，包含内边距、外边距、边框，如果元素有指定的宽度，则添加到该元素的内边距会添加到元素的总宽度中。或者使用 `box-sizing` 属性，使元素保持其宽度。

### 高度和宽度

height 和 width 用于设置元素的高度和宽度，不包括内边距、外边距、边框，它设置的是元素内边距、外边距以及边框内的区域的高度或宽度。

### 盒子模型

所有 HTML 元素都可以视为方框。

- 内容：框的内容，显示文本和图像。
- 内边距：清除内容周围的区域，内边距是透明的。
- 边框：围绕内边距和内容的边框。
- 外边距：清除边界外的区域，外边距是透明的。

元素的总宽度应该这样计算：

元素总宽度 = 宽度 + 左内边距 + 右内边距 + 左边框 + 右边框 + 左外边距 + 右外边距。

元素的总高度应该这样计算：

元素总高度 = 高度 + 上内边距 + 下内边距 + 上边框 + 下边框 + 上外边距 + 下外边距。

## 轮廓

轮廓与边框不同，轮廓是在元素边框之外绘制的，并且可能与其他内容重叠。同样，轮廓也不是元素尺寸的一部分，元素的总宽度和高度不受轮廓宽度影响。

- 指定轮廓的样式：outline-style。
- 轮廓宽度：outline-width。
- 轮廓颜色：outline-color。
- 简写：outline，指定 width、style、color 中的几个，顺序无所谓。
- 轮廓偏移：outline-offset

## 文本

- 文本颜色：color。
- 设置文本水平对齐：text-align。
- 文本方向：direction 和 unicode-bidi。
- 垂直对齐：vertical-align。
- 文字装饰：text-decoration。
    - overline。
    - line-through。
    - underline。
    - none。
- 文本转换：text-transform 属性指定文本中的大写和小写字母。
    - uppercase 大写。
    - lowercase 小写。
    - capitalize 首字母大写。
- 文字间距：
    - 文字缩进：text-indent 属性指定文本第一行的缩进。
    - 字母间距：letter-spacing 属性指定文本中字符之间的距离。
    - 行高：line-height。
    - 字间距：word-spacing。
    - 空白：white-space 指定元素内部空白的处理方式。
- 文本阴影：text-shadow，水平阴影、垂直阴影、模糊效果、颜色。

## 字体

- 规定字体：font-family，包含多个字体名称作为备选。
- 字体样式：font-style：
    - 正常：normal。
    - 斜体：italic。
    - 倾斜：oblique。
- 字体粗细：font-weight。
- 字体变体：font-variant 指定是否以 small-caps 字体显示。
- 字体大小：font-size。

## CSS 链接

四种链接状态：

- 未访问过的链接：`a:link`。
- 访问过的链接：`a:visited`。
- 悬停时的链接：`a:hover`。
- 被点击时的链接：`a:active`。

## CSS 布局

### 块级元素

块级元素总是从新行开始，并占据可用的全部宽度。

### 行内元素

行内元素不从新行开始，仅占用所需的宽度。

### display

通过设置 display 属性的值为 inline、block、none，分别控制元素是行内元素、块级元素、隐藏元素。

display:none 的元素不会占用页面空间，visibility:hidden 隐藏的元素仍然占有原来的空间。

### width 和 max-width

设置块级元素的 width 属性将防止延伸到容器的边缘，然后设置左右外边距为 auto 可以水平居中，当浏览器窗口小于元素宽度时，会出现滚动条，使用 max-width 可以解决这个问题。

### box-sizing

默认情况下，元素看起来通常比设置的更大，因为还有边框和边距的宽度，使用 box-sizing 可以解决这个问题，box-sizing 属性允许我们在元素的总宽度和高度中包括内边距和边框，例如 `box-sizing: border-box` 宽度和高度会包括内边距和边框。

### position 属性

position 属性规定应用于元素的定位方法的类型，有五个不同的位置值：

- static：

    默认情况下的定位方式，元素不会被特殊的定位。

- relative：

    如果不使用额外的属性， relative 表现和 static 一样，一个元素相对于正常位置进行定位，设置四个属性将导致元素偏离正常位置，不会对其余内容进行调整来适应元素留下的任何空间。

- fixed：

    元素相对于视口定位，即使滚动页面，也始终位于同一位置。一个固定定位元素不会保留它原本在页面应有的空隙。

- absolute：

    与 fixed 类似，但是它不是相对视窗而是相对于最近的 position 值不是 static 的元素，如果没有这个元素，那么会相对于 body 元素定位，并且会随着页面滚动而移动。

- sticky：

    根据用户的滚动位置进行定位，在相对和固定之间切换，起先会被相对定位，直到视口中遇到给定的偏移位置为止，然后粘贴在适当的位置。

通过设置 z-index 属性指定元素的前后顺序，这个值可正可负。

元素是使用 top、bottom、left、right 属性定位的。但是如果不先设置 position 属性这些属性将不起作用。

### 溢出

overflow 属性指定在元素内容太大而无法放入指定区域时是裁剪内容还是添加滚动条。

- visible：默认，溢出没有被裁剪，内容在元素框外渲染。
- hidden：溢出被裁剪，其余内容将不可见。
- scroll：溢出被裁剪，同时添加滚动条以查看其余内容。
- auto：仅在必要时添加滚动条。

overflow-x：指定如何处理内容的左右边缘。

overflow-y：指定如何处理内容的上下边缘。

### 浮动

float 属性用于定位和格式化内容，可取值：

- left：元素浮动到容器的左侧。
- right：元素浮动在容器的右侧。
- none：元素不会浮动
- inherit：元素继承父级的 float 值。

### 清除浮动

clear 属性指定哪些元素可以浮动于被清除元素的旁边及哪一侧：

- none：允许两侧都有浮动元素，默认值。
- left：左侧不允许浮动元素。
- right：右侧不允许浮动元素。
- both：左侧或右侧均不允许浮动元素。
- inherit：元素继承父级的 clear 值。

如果一个元素比包含它的元素高，并且它是浮动的，它将溢出到容器之外，可以指定 overflow 为 auto 来解决这个问题。

### display:inline-block

与 inline 相比，inline-block 允许在元素上设置宽度和高度，如果设置了 display:inline-block，将保留上下内外边距，inline 不会。

### 水平对齐和垂直对齐

居中对齐元素：要使块元素水平居中，使用 `margin: auto;`，设置元素的宽度将防止其延伸到容器的边缘。

居中对齐文本：使用 `text-align: center`。

居中对齐图像：将图像设置为块元素并将左右外边距设置为 auto。

左右对齐：

- 使用 `position:absolute` 绝对定位。
- 使用 float 属性。

垂直对齐：

- 使用 padding。
- 使用 line-height，让其值等于 height的值。
- 使用 position 和 transform。
- 使用 Flexbox。

## 伪类

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
  quotes: "~" "~";
}
```

所有 CSS 伪类：[CSS伪类](https://www.w3school.com.cn/css/css_pseudo_classes.asp)

## CSS 伪元素

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

## Flex 布局

指定某个容器为 Flex 布局，`display: flex;`，行内元素也可以使用 Flex 布局：`display: inline-flex`，Webkit 内核的浏览器需要在 flex 前面添加 `-webkit` 前缀。

设置为 Flex 布局以后，子元素的浮动、清除浮动、垂直居中属性会失效。

### 容器的属性

- flex-direction 属性：决定主轴的方向，即项目排列的方向。
    - row：默认值，主轴为水平方向，起点在左端。
    - row-reverse：主轴为水平方向，起点在右端。
    - column：主轴为垂直方向，起点在上面。
    - column-reverse：主轴为垂直方向，起点在下面。
- flex-wrap 属性：如果一条轴线排不下，如何换行。
    - nowrap：默认不换行。
    - wrap：换行，第一行在上方。
    - wrap-reverse：换行，第一行在下方。
- justify-content 属性：定义项目在主轴上的对齐方式。
    - center：整体居中。
    - flex-start：整体靠主轴起点。
    - flex-end：整体靠主轴终点。
    - space-between：两端对齐，项目之间的间隔都相等。
    - space-around：每个项目两侧的间隔相等，项目之间的间隔比项目和边框的间隔大一倍。
- align-items 属性：定义项目在交叉轴上如何对齐。
    - flex-start：交叉轴的起点对齐。
    - flex-end：交叉轴的终点对齐。
    - center：居中。
    - baseline：项目的第一行文字的基线对齐。
    - stretch：默认值，如果项目未设置高度或设为 auto，将占满整个容器的高度。
- align-content 属性：定义多根轴线的对齐方式，如果项目只有一根轴线，该属性不起作用：
    - flex-start：与交叉轴起点对齐。
    - flex-end：与交叉轴的终点对齐。
    - center：与交叉轴的中点对齐。
    - space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
    - space-around：每根轴线两侧的间隔都相等，轴线之间的间隔比轴线与边框间隔大一倍。
    - stretch：默认值，轴线占满整个交叉轴。

### 项目的属性

- order 属性：定义项目的排列顺序，数值越小排列越靠前。
- flex-grow 属性：定义项目的放大比例，默认为 0，即如果存在剩余空间也不放大。
- flex-shrink 属性：定义了项目的缩小比例，默认为 1。
- flex-basis 属性：定义了分配多余空间之前，项目占据的主轴空间，默认为 auto，也就是项目本来的大小。
- align-self 属性：允许单个项目与其他项目对齐方式不同，覆盖 align-items 属性，默认值 auto，表示继承父元素的 align-items 属性，如果没有父元素，等同于 stretch。
