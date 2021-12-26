# Thymeleaf

## 使用准备

导入依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

首先依然根据 `spring-boot-autoconfigure\META-INF\spring.factories`，找到 thymeleaf 的配置类 `org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration`，并根据 `@EnableConfigurationProperties(ThymeleafProperties.class)` 注解找到 `ThymeleafProperties`

```java
@ConfigurationProperties(prefix = "spring.thymeleaf")
public class ThymeleafProperties {
  private static final Charset DEFAULT_ENCODING = StandardCharsets.UTF_8;

	public static final String DEFAULT_PREFIX = "classpath:/templates/";

	public static final String DEFAULT_SUFFIX = ".html";
```

由此，我们可以在配置文件中使用 `spring.thymeleaf` 作出相应配置，且默认路径是 `classpath:/templates/`，后缀为 `.html`。

::: warning 注意
templates 目录下的文件必须通过 controller 访问。
:::

在 html 页面中引入约束：

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
```

## 基本语法

thymeleaf 中，HTML 标签的所有元素都由 thymeleaf 接管，要使用 thymeleaf 必须通过 `th:xxx` 的形式指定属性。

- `${...}` 表达式：

    Thymeleaf 通过 `${}` 来获取 model 中的变量，注意这不是 el 表达式，而是 ognl 表达式，但是语法非常像。

    ```java
    @Controller
    public class TestController {
        @RequestMapping("/test")
        public String hello(Model model){
            Student student=new Student();
            student.setSname("zhai");
            student.setSnum("201716161");
            model.addAttribute("student", student);
            return "test";
        }
    }
    ```

    ```html
    <!DOCTYPE html>
    <html lang="en" xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
      <h3 th:text="${student.sname}"></h3>
      <h3>[[${student.sname}]]</h3>
    </body>
    </html>
    ```

- `#{...}` 表达式：

    获取资源文件中的数据。

    ```html
    <!DOCTYPE html>
    <html lang="en" xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <title>国际化</title>
    </head>
    <body>
    <form method="post">
        <p>
            <input type="text" name="username" th:placeholder="#{login.username}">
        </p>
        <p>
            <input type="password" name="password" th:placeholder="#{login.password}">
        </p>
    <input type="submit" th:value="#{login.submit}"/></p>
    </form>
    </body>
    </html>
    ```

- `*{...}` 表达式：

    用于暂存对象。

    ```html
    <h2 th:object="${user}">
        <p>Name: <span th:text="*{name}">Jack</span>.</p>
        <p>Age: <span th:text="*{age}">21</span>.</p>
        <p>friend: <span th:text="*{friend.name}">Rose</span>.</p>
    </h2>
    ```

- `@{...}` 表达式：

    用于指定 URL。

    ```html
    <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
    ```

- 内置对象：

    ![thymeleaf内置对象](/SpringBoot/thymeleaf内置对象.jpg)

    示例：

    ```html
    <title th:text="${#request.getServerPort()}"></title>
    ```

- 字面值：

    - 字符串字面值：

        使用一对单引号引用的内容就是字符串字面值了，如下的 thymeleaf 会被当做字符串。

        ```html
        <p>
          你正在观看 <span th:text="'thymeleaf'">template</span> 的字符串常量值.
        </p>
        ```

    - 数字字面值：

    ```html
    <p>今年是 <span th:text="2018">1900</span>.</p>
    <p>两年后将会是 <span th:text="2018 + 2">1902</span>.</p>
    ```

    - 布尔字面值：

    ```html
    <div th:if="true">
        你填的是true
    </div>
    ```

    - utext：

        ```java
        @RequestMapping("/")
        public String aa(Model model) {
            String msg = "<h1>啦啦啦</h1>";
            model.addAttribute("msg", msg);
            return "index";
        }
        ```

        若使用 `th:text`，msg 将被视作字符串并显示在页面上(含标签)，若使用 utext，msg 将被解析为 html 并只显示解析后的结果。

        - 字符串拼接：

            ```html
            <span th:text="'欢迎您:' + ${user.name} + '!'"></span>
            <span th:text="|欢迎您:${user.name}|"></span>
            ```

        - 运算:

            ::: warning
            `${}` 内部的是通过 OGNL 表达式引擎解析的，外部的才是通过 Thymeleaf 的引擎解析，因此运算符尽量放在 `${}` 外进行。
            :::

        - 算术运算:

            ::: tip
            支持的算术运算符：`+`， `-`， `*`， `/`， `%`。
            :::

            ```html
            <span th:text="${user.age}"></span>         //21
            <span th:text="${user.age}%2 == 0"></span>  //false
            ```

        - 比较运算：

            ::: tip
            支持的比较运算：`>`, `<`, `>=` and `<=`，但是 `>`, `<` 不能直接使用，因为 xml 会解析为标签，要使用别名。
            :::

            ::: warning
            `==`、 `!=` 不仅可以比较数值，类似于 equals 的功能。

            可以使用的别名：`gt`(>), `lt`(<), `ge`(>=), `le`(<=), `not`(!)， `eq`(==), `neq/ne`(!=)。
            :::

        - 条件运算：
            - 三元运算：

                ```html
                <td th:text="${emp.gender}==0?'女':'男'"></td>
                ```

            - 默认值

                有的时候，我们取一个值可能为空，这个时候需要做非空判断，可以使用 表达式 `?:` 默认值简写：

                ```html
                <span th:text="${user.name} ?: '二狗'"></span>
                ```

                当前面的表达式值为null时，就会使用后面的默认值。

                ::: warning 注意
                `?:` 之间没有空格。
                :::

        - 循环：

            ```html
            <tr th:each="user : ${users}">
                <td th:text="${user.name}">Onions</td>
                <td th:text="${user.age}">2.41</td>
            </tr>
            ```

            ::: tip
            遍历集合支持的类型：

            - Iterable，实现了 Iterable 接口的类。
            - Enumeration，枚举。
            - Interator，迭代器。
            - Map，遍历得到的是 Map.Entry。
            - Array，数组及其它一切符合数组结果的对象。
            :::

            在迭代的同时，我们也可以获取迭代的状态对象：

            ```html
            <tr th:each="user,stat : ${users}">
                <td th:text="${user.name}">Onions</td>
                <td th:text="${user.age}">2.41</td>
            </tr>
            ```

            ::: tip
            stat 对象包含以下属性：

            - index：从 0 开始的角标。
            - count：元素的个数，从1开始。
            - size：总元素个数。
            - current：当前遍历到的元素。
            - even/odd：返回是否为奇偶，boolean 值。
            - first/last：返回是否为第一或最后，boolean值。
            :::

- 逻辑判断：

    Thymeleaf 中使用 `th:if` 或者 `th:unless` ，两者的意思恰好相反。

    ```html
    <span th:if="${user.age} > 24">老油条</span>
    ```

    如果表达式的值为 true，则标签会渲染到页面，否则不进行渲染。

    ::: tip 认定为true的情况
    - 表达式值为 true。
    - 表达式值为非 0 数值。
    - 表达式值为非 0 字符。
    - 表达式值为字符串，但不是 "false", "no", "off"。
    - 表达式不是布尔、字符串、数字、字符中的任何一种。
    - 其它情况包括 null 都被认定为 false。
    :::

- 分支控制 switch：

    这里要使用两个指令：`th:switch` 和 `th:case`：

    ```html
    <div th:switch="${user.role}">
      <p th:case="'admin'">用户是管理员</p>
      <p th:case="'manager'">用户是经理</p>
      <p th:case="*">用户是别的玩意</p>
    </div>
    ```

    需要注意的是，一旦有一个 `th:case` 成立，其它的则不再判断。与 java 中的 switch 是一样的。

    `th:case="*"` 表示默认，放最后。

- js 模板：

    模板引擎不仅可以渲染 html，也可以对 JS 中的进行预处理。而且为了在纯静态环境下可以运行，其 Thymeleaf 代码可以被注释起来：

    ```html
    <script th:inline="javascript">
        const user = /*[[${user}]]*/ {};
        const age = /*[[${user.age}]]*/ 20;
        console.log(user);
        console.log(age)
    </script>
    ```

    在 script 标签中通过 `th:inline="javascript"` 来声明这是要特殊处理的 js 脚本。

    语法结构：

    ```js
    const user = /*[[Thymeleaf表达式]]*/ "静态环境下的默认值";
    ```

    因为 Thymeleaf 被注释起来，因此即便是静态环境下， js 代码也不会报错，而是采用表达式后面跟着的默认值。且 User 对象会被直接处理为 json 格式。
