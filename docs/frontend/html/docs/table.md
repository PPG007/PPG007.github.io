# 表格

所有的表格内容都要放在 table 标签中。

- caption：table中的第一个子元素，表示表格的标题。
- thead：表头。
- tbody：表体。
- tfoot：表尾。
- colgroup：包含一组列的定义。
  - col：用来定义表格的一列，没有结束标志。
- tr：表示表格的一行。
- th：标题单元格。
  - scope 属性：表示该单元格是一行的标题还是一列的标题。
- td：数据单元格。
  - colspan 属性：跨列。
  - rowspan 属性：跨行。
  - headers 属性：对应 th 标签中的 id 属性值。
