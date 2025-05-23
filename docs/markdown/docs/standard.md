# 规范要求

## 语义

格式应该遵守语义：

- 不要滥用强调格式。
- 不要滥用行内代码格式，只有代码才能使用行内代码格式，不要把行内代码格式当做高亮强调格式。代码包括语句、标识符、变量值、命名、路径等，术语、专有名词不算。
- 不要滥用引用格式，不要将引用格式当做高亮强调模式。

## 标题

- 应该**有且仅有一个**一级标题作为文件标题。
- 标题级别要按顺序，不应该没有二级标题就跳到三级标题。
- 尽量不要使用四级以上的标题，层次过深意味着结构需要重新组织。
- 前后要空行，但文件标题前面不用空。
- 不要在标题中使用强调、行内代码等格式。
- 整个标题可以是一个链接。

## 段落

前后要空行，尤其是多个段落，如果不空行渲染出来都在一行。

```markdown
段落一。

段落二。
```

## 强调

使用 `*` 而不是 `_`，因为下划线容易和变量名冲突。

## 链接

尽量使用`[标题](链接)`的写法。

## 列表

前缀使用 - 而不是 \* ；列表开始，前面空一行，结尾用冒号或句号。

```markdown
- 项目一。

  项目详细描述，应当缩进四个空格，而且作为一个段落应该上下各空一行。

  项目详细描述，应当缩进四个空格，而且作为一个段落应该上下各空一行。

- 项目二。
  - 嵌套项目，首行缩进四个空格，前后不需要空行。
  - 嵌套项目，首行缩进四个空格，前后不需要空行。
- 项目三。
  - 列表结束，后面空一行。
```

- 如果只有一条内容不应该使用列表。
- 不要滥用，列表项目逻辑上必须是并列或递进关系。
- 不要使用有序列表，不得不使用时序号全写 `1.`。

## 围栏代码块

- 前后要空行。
- 使用三个连续的 _backtick_ 作为分隔符号。
- 使用正确的语言标记，没有合适的语言标记时应当使用 `text`。
- 描述多个Shell命令应该使用下面的形式，且命令前不要带 `$` 等提示符，方便复制。

```sh
# 说明1
cd path

# 说明2
java -jar backend.jar
```

## 中文排版

- 空格：
  - 中英文之间需要空格。
  - 中文和数字之间需要空格。
  - 数字与单位之间**不需要**空格。
  - 全角标点与其他字符之间**不加**空格。例外：裸链接后面需要空格，否则可能将紧跟着的标点识别为链接的一部分。
  - 中文与链接、强调、行内代码等格式间是否加空格取决于内容。
- 全角与半角：
  - 主体是中文时，应当全部使用全角中文标点。
  - 遇到完整的英文整句（引用）、特殊名词等时，可以考虑使用半角。
  - 数字使用半角字符。
- 标点：
  - 中文列举间使用顿号而不是逗号。
  - 列表项目结尾是在引出详细描述时，使用冒号。
  - 句末加句号，特别短的（不是完整句子）可以例外，但要保持一致。

## 其他

- 表示带变量的字符串时，使用 `${var}` 的形式。
- 表示命令行选项、参数时，参考各种手册中的写法，可选的放在方括号 `[]` 中，必需的放在尖括号 `<>` 中。
- 英语专有名词大小写、符号等遵循官方的写法。
- 英语标题除介词、连词外，首字母大写。
- 描述菜单、目录导航使用 `【xxx】>【xxx】`。
