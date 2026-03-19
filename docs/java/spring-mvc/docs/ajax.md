# Ajax

## ajax 基本属性

```js
$.ajax({
  url: '/books/ajaxSelect',
  data: { bookName: bookName }, //JSONObject或String
  async: true, //Boolean类型，默认为true，所有请求为异步，若设置false，将使用同步请求，锁住浏览器，其他操作必须等待ajax执行完毕
  type: 'POST', //请求方式：POST、GET、DELETE、PUT
  timeout: 5000, //毫秒
  cache: true, //默认为true，当dataType为script时默认false，false将不会从浏览器中加载请求信息
  dataType: 'json', //预期返回的数据类型
  success: function (data) {
    $('#bookTable').html(refresh(data));
  },
  error: function (data) {
    console.log(data);
  },
  complete: function () {
    console.log('complete');
  },
});
```

dataType:

- xml：返回 XML 文档，可用 JQuery 处理。
- html：返回纯文本 HTML 信息；包含的 script 标签会在插入 DOM 时执行。
- script：返回纯文本 JavaScript 代码。不会自动缓存结果。除非设置了 cache 参数。注意在远程请求时（不在同一个域下），所有 post 请求都将转为 get 请求。
- json：返回 JSON 数据。
- jsonp：JSONP 格式。使用 JSONP 形式调用函数时，例如 myurl?callback=?，JQuery 将自动替换后一个“?”为正确的函数名，以执行回调函数。
- text：返回纯文本字符串。

## ajax 处理前端

前端代码：

```html
<table class="table table-hover table-striped">
  <thead>
    <tr>
      <th>书籍编号</th>
      <th>书籍名称</th>
      <th>书籍数量</th>
      <th>书籍详情</th>
    </tr>
  </thead>
  <tbody id="bookTable">
    <c:forEach var="book" items="${bookList}">
      <tr>
        <td>${book.bookId}</td>
        <td>${book.bookName}</td>
        <td>${book.bookCounts}</td>
        <td>${book.detail}</td>
        <td>
          <a href="${pageContext.request.contextPath}/books/toUpdatePage?bookId=${book.bookId}"
            >修改</a
          >&nbsp;|&nbsp;
          <a href="${pageContext.request.contextPath}/books/delete?bookId=${book.bookId}">删除</a>
        </td>
      </tr>
    </c:forEach>
  </tbody>
</table>
```

通过 ajax 获取到数据后，调用拼接函数，注意拼接的位置(tbody)。

```js
function refresh(data) {
  let bookList = JSON.parse(data);
  let html = '';
  for (let i = 0; i < bookList.length; i++) {
    html +=
      '<tr><td>' +
      bookList[i].bookId +
      '</td>' +
      '<td>' +
      bookList[i].bookName +
      '</td>' +
      '<td>' +
      bookList[i].bookCounts +
      '</td>' +
      '<td>' +
      bookList[i].detail +
      '</td></tr>';
  }
  console.log(html);
  return html;
}
```

## 后台处理

后台通过 `@ResponseBody` 注解或 `@RestController` 注解返回一个 json 字符串即可。
