# Flex 布局

指定某个容器为 Flex 布局，`display: flex;`，行内元素也可以使用 Flex 布局：`display: inline-flex`，Webkit 内核的浏览器需要在 flex 前面添加 `-webkit` 前缀。

设置为 Flex 布局以后，子元素的浮动、清除浮动、垂直居中属性会失效。

## 容器的属性

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

## 项目的属性

- order 属性：定义项目的排列顺序，数值越小排列越靠前。
- flex-grow 属性：定义项目的放大比例，默认为 0，即如果存在剩余空间也不放大。
- flex-shrink 属性：定义了项目的缩小比例，默认为 1。
- flex-basis 属性：定义了分配多余空间之前，项目占据的主轴空间，默认为 auto，也就是项目本来的大小。
- align-self 属性：允许单个项目与其他项目对齐方式不同，覆盖 align-items 属性，默认值 auto，表示继承父元素的 align-items 属性，如果没有父元素，等同于 stretch。
