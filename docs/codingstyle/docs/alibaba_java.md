# Java 开发手册摘要

左小括号和右边相邻字符之间不出现空格，右小括号和左边相邻字符之间也不出现空格，左大括号前需要空格。

```java
if (a == b) {

}
```

if/for/while/switch/do 等保留字与括号之间必须加空格。

任何二目、三目运算符左右两边都需要加一个空格。

单行字符超过 120 个后需要换行，原则如下：

- 第二行相对第一行缩进，从第三行开始不再缩进。
- 运算符、方法调用点符号与下文一起换行。
- 方法调用多个参数需要换行时，在逗号后进行。
- 在括号前不要换行。

任何货币金额，以最小货币单位且整数类型来进行存储。

关于基本数据类型和包装数据类型：

- 所有的 POJO 类属性必须使用包装类。
- RPC 方法的返回值和参数必须使用包装数据类型。
- 所有的局部变量使用基本数据类型。

定义 POJO 类时，不要设定任何属性默认值。

不要随意修改 serialVersionUID 字段。

构造方法中禁止加入任何业务逻辑，初始化方法应该放在init方法中。

POJO 类必须写 toString 方法，如果存在继承，则还要在前面添加父类 toString。

使用索引访问 String 的 split 方法得到的数组时，要判断最后一个分隔符后面有没有内容。

类成员与方法访问控制从严：工具类不允许有 public 或 default 构造方法。

日期格式化时，传入 pattern 中表示年份统一用小写 y，YYYY 表示的是 week in which year，意思是当天所在的属于的年份，只要这周跨年，YYYY 返回的就是下一年。

关于 equals 和 hashCode，遵循下面的规则：

- 只要覆写 equals，就必须覆写 hashCode。
- Set 存储的对象必须覆写这两个方法。
- 同理 Map 的键必须重写这两个方法。

在使用 Collectors 类的 toMap 方法转为 Map 集合时，要使用含有参数类型 BinaryOperator 的方法，这是一个函数式接口，继承了 BiFunction 接口，其中的 apply 方法接收两个类型，返回另一个类型。

集合转数组时，必须使用 toArray(T[] array) 方法，传入的是类型一致、长度为 0 的空数组，如果使用无参重载，强转会出现 ClassCastException 异常。

使用 Arrays.asList() 方法将数组转换成集合时，不能修改转换后的数组，会抛出异常。

SimpleDateFormat 线程不安全，一般不要定义为 static，或者加锁，或者使用 DateUtils 工具类。

JDK8 后，使用 Instant 代替 Date，LocalDateTime 代替 Calendar，DateTimeFormatter 代替 SimpleDateFormat。

需要对多个资源进行加锁时，需要保持一致的加锁顺序，避免死锁。

每次访问冲突概率小于 20%，使用乐观锁，乐观锁的重试次数不小于 3 次。

悲观锁：一锁、二判、三更新、四释放。

Random 实例是线程安全的，但是会由于多线程竞争同一 seed 导致性能下降。JDK7 之后可以直接使用 ThreadLocalRandom。

DCL 单例模式中，单例对象应该是 volatile。

switch 括号中变量类型是 String 时，必须先判断 null。

并发环境中，避免使用“等于”判断作为中断或退出条件。

将复杂的逻辑判断结果赋值给一个有意义的布尔变量名。

不要在其他表达式中插入赋值语句。

避免取反逻辑。

方法内部单行注释，在被注释语句上方另起一行。

待办事项 TODO：标记人，标记时间。表示需要实现但还没有实现的功能。

错误 FIXME：标记人，标记时间。表示某段代码是错误的，而且不能工作。

前后端交互 API 需要明确协议、域名、路径、请求方法、请求内容、状态码、响应体。

body 里带参数时必须设置 Content-Type。

如果返回为空，则返回空数组或空集合。

服务端发生错误时，返回的相应信息必须包含 HTTP 状态码，errorCode、errorMessage、用户提示信息四个部分。

前后端交互的 JSON 中，所有的 key 必须为小驼峰。

超大整数场景，一律使用 String 类型返回。

使用 query 参数时，URL 不能超过 2048 字节。

通过 body 传递内容时也要控制长度。

服务器内部重定向必须使用 forward，外部重定向地址必须使用 URL 统一代理模块生成。

对于 trace/debug/info 级别的日志输出，必须进行日志级别开关的判断。

日志打印时禁止使用 JSON 工具将对象转换为 String，直接调用 toString 即可。

单元测试 AIR 原则：

- A：Automatic 自动化。
- I：Independent 独立性。
- R：Repeatable 可重复。

单元测试用例之间决不能互相调用，也不能依赖执行的先后次序。

单元测试 BCDE 原则：

- B：Border 边界值测试。
- C：Correct 正确的输入，并得到预期的结果。
- D：Design 与设计文档相结合来编写单元测试。
- E：Error 强制错误信息输入，并得到预期结果。

属于用户个人的页面或者功能必须进行权限控制校验。

用户敏感数据禁止直接展示，必须对展示数据进行脱敏。

用户传入的任何参数必须做有效性验证。

URL 外部重定向传入的目标地址必须执行白名单过滤。

使用平台资源如短信验证码时，必须实现正确的放重放机制，防止过量浪费资源。

数据库中表达是与否概念的字段，必须使用 is_xxx 命名。

表名、字段名必须使用小写字母或数字，禁止数字开头，禁止两个下划线之间只出现数字。

表名不使用复数名词，禁用保留字。

小数类型为 decimal。

如果存储的字符串长度几乎相等，使用 char。

varchar 长度不要超过 5000，大于此值应当使用 text。

分层领域模型规约：

- DO（Data Object）：此对象与数据库表结构一一对应，通过 DAO 层向上传输数据源对象。
- DTO（Data Transfer Object）：数据传输对象，Service 或 Manager 向外传输的对象。
- BO（Business Object）：业务对象，可以由 Service 层输出的封装业务逻辑的对象。
- Query：数据查询对象，各层接收上层的查询请求。
- VO（View Object）：显示层对象，通常是 Web 向模板渲染引擎层传输的对象。
