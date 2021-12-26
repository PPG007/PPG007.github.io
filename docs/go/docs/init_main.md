---
prev:
  text: 首页
  link: /go
---

# init 函数和 main 函数

main 函数是程序的默认入口。

init 函数用于包的初始化，每个包可以有多个 init 函数，包的每个源文件也可以有多个 init 函数，init 函数不能被其他函数调用，在 main 之前、全局声明后调用。
