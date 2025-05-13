# 链接标签

- target 属性的可选值：
  - \_self：当前窗口打开，默认。
  - \_blank：新窗口打开。
  - \_parent：上层窗口打开，如果没有上层窗口，等价于当前窗口。
  - \_top：顶层窗口打开，如果当前窗口就是顶层窗口，等价于 `_self`。
- download 属性：表明当前链接用于下载，不能跨域，如果设置了属性值，属性值就是下载下来的文件名。

  ```html
  <!-- 点击这个链接会打开一个虚拟网页，显示 Hello World!，然后会下载一个 hello.txt 的文件，文件内容就是 Hello World! -->
  <a href="data:,Hello%2C%20World!" download="hello.txt">点击</a>
  ```

- link 标签的 rel 属性表示外部资源与当前文档之间的关系，是必需属性，常用可选值：
  - author：文档作者的链接。
  - icon：图标。
  - stylesheet：加载一张样式表。
  - preload：要求提前下载并缓存指定资源，优先级较高。
  - dns-prefetch：要求提前执行指定网址的 DNS 查询。
  - preconnect：要求浏览器提前与指定服务器建立连接。
  - prerender：要求浏览器提前渲染指定链接。
- script 标签的一些属性：
  - async：异步执行，默认是同步。
  - defer：不是立即执行 JavaScript 代码，而是页面解析完成后执行。
  - crossorigin：跨域方式加载外部脚本。
  - integrity：给出脚本哈希值，只有哈希值相符的外部脚本才会被执行。
