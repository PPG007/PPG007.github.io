# CSS 布局

## 块级元素

块级元素总是从新行开始，并占据可用的全部宽度。

## 行内元素

行内元素不从新行开始，仅占用所需的宽度。

## display

通过设置 display 属性的值为 inline、block、none，分别控制元素是行内元素、块级元素、隐藏元素。

display:none 的元素不会占用页面空间，visibility:hidden 隐藏的元素仍然占有原来的空间。

## width 和 max-width

设置块级元素的 width 属性将防止延伸到容器的边缘，然后设置左右外边距为 auto 可以水平居中，当浏览器窗口小于元素宽度时，会出现滚动条，使用 max-width 可以解决这个问题。

## box-sizing

默认情况下，元素看起来通常比设置的更大，因为还有边框和边距的宽度，使用 box-sizing 可以解决这个问题，box-sizing 属性允许我们在元素的总宽度和高度中包括内边距和边框，例如 `box-sizing: border-box` 宽度和高度会包括内边距和边框。

## position 属性

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

## 溢出

overflow 属性指定在元素内容太大而无法放入指定区域时是裁剪内容还是添加滚动条。

- visible：默认，溢出没有被裁剪，内容在元素框外渲染。
- hidden：溢出被裁剪，其余内容将不可见。
- scroll：溢出被裁剪，同时添加滚动条以查看其余内容。
- auto：仅在必要时添加滚动条。

overflow-x：指定如何处理内容的左右边缘。

overflow-y：指定如何处理内容的上下边缘。

## 浮动

float 属性用于定位和格式化内容，可取值：

- left：元素浮动到容器的左侧。
- right：元素浮动在容器的右侧。
- none：元素不会浮动
- inherit：元素继承父级的 float 值。

## 清除浮动

clear 属性指定哪些元素可以浮动于被清除元素的旁边及哪一侧：

- none：允许两侧都有浮动元素，默认值。
- left：左侧不允许浮动元素。
- right：右侧不允许浮动元素。
- both：左侧或右侧均不允许浮动元素。
- inherit：元素继承父级的 clear 值。

如果一个元素比包含它的元素高，并且它是浮动的，它将溢出到容器之外，可以指定 overflow 为 auto 来解决这个问题。

## display:inline-block

与 inline 相比，inline-block 允许在元素上设置宽度和高度，如果设置了 display:inline-block，将保留上下内外边距，inline 不会。

## 水平对齐和垂直对齐

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
