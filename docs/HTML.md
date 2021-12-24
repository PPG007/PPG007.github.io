# HTML

元数据 <meta> 标签：

此标签用于设置或说明网页的元数据，必须放在 `<head>` 里面，一个 `<meta>` 标签就是一个元数据，网页可以有多个。

元数据标签的五个属性：

- charset 属性：用来指定网页的编码方式。
- name 属性：表示元数据的名字。
- content 属性：表示元数据的值。与 name 属性共用可以指定一项元数据。
- http-equiv 属性：用来覆盖 HTTP 响应头的信息字段（结合 content）。

## URL

URL：统一资源定位符，一个 URL 对应一个资源，同一个资源可能对应多个 URL。

URL 的各个部分：

- 协议。
- 主机。
- 端口。
- 路径。
- 查询参数。
- 锚点。锚点名称通过网页元素的 id 属性命名。

URL 字符只能使用以下这些字符：

- 26个英文字母，包含大小写。
- 阿拉伯数字。
- 连词号 `-`。
- 句点 `.`。
- 下划线 `_`。

此外，还有 18 个字符属于保留字符，只能在特定位置出现，在其它地方出现需要转义。

通过 `<base>` 标签指定网页内部的所有相对 URL 的计算基准，整张网页只能有一个 `<base>` 标签，而且只能放在 `<head>` 里面，不需要闭合的单独标签，且这个标签必须至少具有 `href` 或 `target` 属性中的一个。

```html
<base href="https://www.google.com/" target="_blank">
```

## 元素的属性

属性名与标签名都不区分大小写。

### 全局属性

常见的全局属性：

- id。
- class。
- title。用来为元素添加附加说明，鼠标悬浮在元素上面会将 title 属性值浮动显示。
- tabindex。表示按下 Tab 键，焦点的转移顺序。
    - 负整数：该元素可以获取焦点但不参与 Tab 键对网页元素的遍历。
    - 0：该元素参与 Tab 遍历，顺序由浏览器指定。
    - 正整数：按大小参与 Tab 遍历，如果多个 tabindex 相同，按源码中出现的顺序。
- accesskey。指定网页元素获取焦点的快捷键，属性值必须是单个可打印的字符。需要通过功能键一起按下，Alt 或者 Ctrl +Alt。
- style。
- hidden。如果 CSS 可见性设置优先级高于此属性。
- lang。指定网页元素使用的语言。
- dir。表示文字的阅读方向。
    - ltr：从左到右。
    - rtl：从右到左。
    - auto：自动。
- contenteditable。设为 true 允许用户修改内容。
- spellcheck。
- data- 属性。用于存放自定义的数据。
- 事件处理属性。属性值都是 JavaScript 代码。

## 语义结构

常用标签：

- header：放在头部，header 里不能包含另一个 header 或 footer。
- footer：放在尾部，不能在内部包含另一个 footer 或 header。
- main：表示页面主体，一个页面只有一个，顶层标签，不能放在 header 等内部。
- article。
- aside：放置与网页、文章主要内容间接相关的部分。
- section：表示一个含有主题的独立部分，通常用来表示一个章节。
- nav：放置页面或文档的导航信息，内部通常是列表，往往放置在 header 里面。
- hgroup：用来放置多级标题，内部只能包含 h1~h6 标签。

## 文本标签

- wbr：表示一个可选的断行，如果一行宽度足够就不断行，否则在指定位置断行。
- strong、b：加粗。
- em、i：倾斜。
- sub：下标。
- sup：上标。
- var：表示代码或数学公式的变量。
- u：下划线。
- s：删除线。
- blockquote：表示引用。
- cite：表示引言出处或作者，斜体。
- q：表示引用，不会换行，默认斜体，自动添加半角双引号。
- code：表示计算机代码。表示多行必须放在 `<pre>` 内部。
- kbd：各种输入。
- samp：计算机程序输出内容的一个例子，默认以等宽字体显示。
- mark：突出显示内容。
- small：以小一号的字号显示。
- time：通过 datatime 属性指定内容的具体日期。
- data：类似 time，用于非时间场合。
- address：表示某人、某个组织的联系方式。
- abbr：表示一个缩写，通过 title 属性指定缩写的完整形式。
- ins：表示原始文档添加的内容。通过 cite 属性表示某个 URL 可以解释这次删改，datatime 属性表示删改发生的时间。
- del：表示删除的内容。通过 cite 属性表示某个 URL 可以解释这次删改，datatime 属性表示删改发生的时间。
- dfn：表示一个术语。通过 title 属性实现鼠标悬停提示。
- ruby：表示文字的语音注释。
    - rp：为不支持语音注释的浏览器提供的兼容方案。
    - rt：放置语音注释。
    - rb：划分文字单位，与语音注释一一对应。
- bdo：表示文字方向与网页主题内容方向不一致，通过 dir 属性指定具体方向。
- bdi：用于不确定文字方向的情况。

## 列表标签

- ol：一个有序列表容器。通过 reversed 属性产生倒序的数字列表，通过 start 属性指定数字列表的起始编号。type 属性指定数字编号的样式：
    - a：小写字母。
    - A：大写字母。
    - i：小写罗马数字。
    - I：大写罗马数字。
    - 1：（数字1）整数。
- ul：无序列表容器
- li：列表项，通过 value 属性指定当前列表项的编号，后面列表项会从这个值开始编号。
- dl：表示一组术语。
- dt：定义术语名。
- dd：定义术语解释。

## 图像标签

- img：通过 loading 属性指定指定图片加载的行为。
    - auto：浏览器的默认行为。
    - lazy：启用懒加载。
    - eager：立即加载，无论它在页面那个位置。
- figure：图像区块，将图像和相关信息封装在一起。
- figcaption：figure 的可选子元素，表示图像的文本描述。

### 响应式图片

- img 标签：
    - srcset 属性，指定多张图像，适应不同像素密度的屏幕。

    ```html
    <img srcset="foo-320w.jpg,
             foo-480w.jpg 1.5x,
             foo-640w.jpg 2x"
     src="foo-640w.jpg">
    ```

    - sizes 属性：显示不同大小的图像。必须与 srcset 属性搭配。

    ```html
    <img srcset="foo-160.jpg 160w,
             foo-320.jpg 320w,
             foo-640.jpg 640w,
             foo-1280.jpg 1280w"
     sizes="(max-width: 440px) 100vw,
            (max-width: 900px) 33vw,
            254px"
     src="foo-1280.jpg">
    ```

- picture 标签：

    ```html
    <picture>
    <source srcset="homepage-person@desktop.png,
                    homepage-person@desktop-2x.png 2x"
            media="(min-width: 990px)">
    <source srcset="homepage-person@tablet.png,
                    homepage-person@tablet-2x.png 2x"
            media="(min-width: 750px)">
    <img srcset="homepage-person@mobile.png,
                homepage-person@mobile-2x.png 2x"
        alt="Shopify Merchant, Corrine Anestopoulos">
    </picture>
    ···

## 链接标签

- target 属性的可选值：
    - _self：当前窗口打开，默认。
    - _blank：新窗口打开。
    - _parent：上层窗口打开，如果没有上层窗口，等价于当前窗口。
    - _top：顶层窗口打开，如果当前窗口就是顶层窗口，等价于 `_self`。
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

## 多媒体标签

- video：视频。
- audio：音频。
- track：指定视频的字幕，格式是 WebVTT（`.vtt` 文件）。
    - label 属性：播放器显示的字幕名称。
    - kind 属性：字幕类型。
    - srclang 属性：字幕的语言。
    - default 属性：是否默认打开。
- source：用于 `<picture>`、`<video>`、`<audio>` 的内部，用于指定一项外部资源。
- embed：用于嵌入外部内容。
- object：插入外部资源，embed 的替代品。

## iframe

iframe 标签生成一个指定区域，嵌入其他网页。

iframe 可以通过设置 sandbox 属性对嵌入网页的权限作出限制。

## 表格

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

## 表单

- form 标签的属性：
    - accept-charset：服务器接受的字符编码列表，空格分隔。
    - autocomplete：浏览器是否可以自动填充某个控件的值，取 off 或 on。
    - enctype：当 method 属性指定为 POST 时，指定提交给服务器的 MIME 类型。关于 MIME：[MIME](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types),常用可取值如下：
        - `application/x-www-form-urlencoded`：默认类型。
        - `multipart/form-data`：用于文件上传，将文件分成多块传送
- fieldset 标签：块级容器标签，表示控件的集合。
    - disabled 属性：一旦设置会使 fieldset 内部包含的控件不可用。
    - form 属性：指定控件组所属 form，值等于 form 的 id 属性。
- legend 标签：用来设置 fieldset 控件组的标题。
- label 标签：提供控件文字说明，通过 for 属性和对应控件的 id 属性对应，或者直接将控件放在 label 标签之中，可以不使用 for 属性。可以通过 form 属性关联表单 id。

- input 标签属性：
    - autofocus：是否在页面加载时自动获得焦点。
    - disabled：是否禁用。
    - form：关联表单的 id 属性。
    - readonly：是否只读。
- input 标签的类型：
    - text 类型：通过 maxlength 和 minlength 指定最大和最小输入字符数；通过 pattern 指定必须输入与正则表达式匹配的内容。
    - image 类型：与 submit 完全一致，将一个图像文件作为提交按钮。
    - reset 类型：重置控件。
    - checkbox 类型：复选框，通过 name 和 value 属性形成键值对。
    - radio 类型：单选框，checked 属性表示是否默认选中当前项，value 属性指定用户选中该项提交到服务器的值。
    - email 类型：设置 multiple 属性可以输入以逗号分隔的多个电子邮箱。
    - number 类型：只能输入数字，通过 step 属性指定每次递增、递减的步长。
    - range 类型：一个滑块，选择给定范围之中的一个数值，通过 max、min 指定最大最小值，通过 step 属性指定步长。
    - url 类型：一个只能输入网址的文本框。
    - tel 类型：一个只能输入电话号码的输入框。
    - color 类型：选择颜色。
    - date 类型：一个只能输入日期的输入框，step 指定步长。
    - time 类型：只能输入时间的输入框。
    - month 类型：只能输入年份和月份的输入框。
    - week 类型：输入一年之中第几周的输入框。
    - datetime-local 类型：输入年月日和时分。
- button 标签属性：
    - autofocus。
    - disabled。
    - type：可选 submit、reset、button。
    - form：值为 form 的 id 属性。
    - formenctype：数据提交到服务器的编码方式，会覆盖 form 元素的设置，三个可选值：
        - application/x-www-form-urlencoded。
        - multipart/form-data。
        - text/plain。
    - formmethod：覆盖 form 的 method 属性。
- select 属性：
    - multiple：是否可以选择多个菜单项。
- option 属性：
    - label：该项的说明，如果省略，就等于该项的文本内容。
    - value：提交到服务器的值，如果省略，等于该项的文本内容。
- datalist：为指定控件提供一组相关数据，指定控件通过 list 属性和 datalist 的 id 对应。
    - datalist 中的 option 标签可以不闭合，设置 value 即可。
- progress：表示完成进度，通过 max 属性设置进度条最大值，大于 0 的浮点数，value 属性是进度条的当前值
- meter：指示器，显示一致范围内的一个值。
    - max：范围的上限，必须大于 min 属性。
    - value：当前值。
    - low：表示“低端”的上限门槛值，必须大于 min 属性，小于 high 属性和 max 属性。
    - high：表示“高端”的下限门槛值，必须小于 max 属性，大于 low 属性和 min 属性。
    - optimum：指定最佳值，必须在min属性和max属性之间。它应该与low属性和high属性一起使用，表示最佳范围。
    - form：关联表单的id属性。

## 其他

- dialog：对话框，通过 open 属性让对话框显示。
- details：折叠内容，open 属性默认打开折叠。
- summary：定制折叠内容的标题
