# 流程控制

## if

使用 `if`、`elif` 和 `else` 语句来进行条件判断：

```python
x = 10

if x > 0:
    print("x 是正数")
elif x < 0:
    print("x 是负数")
else:
    print("x 是零")
```

对于单行的条件判断，可以使用简化的语法：

```python
x = 10
print("x 是正数") if x > 0 else print("x 是负数或零")
```

对于大于两个条件的判断，可以使用链式比较：

```python
x = 10
if 0 < x < 20:
    print("x 在 0 和 20 之间")
```

如果需要组合多个条件，可以使用逻辑运算符 `and`、`or` 和 `not`：

```python
x = 10
y = 5

if x > 0 and y > 0:
    print("x 和 y 都是正数")
if x > 0 or y > 0:
    print("x 或 y 至少有一个是正数")
if not (x < 0):
    print("x 不是负数")
```

::: warning

Python 中使用缩进而不是大括号来表示代码块，因此在使用 `if` 语句时要注意缩进的正确性。

:::

## match

Python 3.10 引入了 `match` 语句，可以用来进行模式匹配：

```python
score = 85

match score:
    case 100:
        print("满分")
    case temp if temp >= 90:
        print("优秀")
    case temp if temp >= 80:
        print("良好")
    case temp if temp >= 70:
        print("中等")
    case _:
        print("其他")
```

match 还可以匹配列表：

```python
my_list = [1, 2, 3]
match my_list:
    case [1]:
        print('only 1')
    case [1, 2, 3]:
        print("匹配成功")
    case _:
        print("匹配失败")
```

## for-in

通过 `range` 函数可以生成一个整数序列：

`range(start, stop, step)` 生成一个从 `start` 到 `stop`（不包含 `stop`）的整数序列，步长为 `step`。

因此，可以使用 `range` 实现循环 n 次：

```python
sum = 0
for i in range(101):
    sum += i
print(sum) # 输出 5050
```

## while

`while` 循环会一直执行，直到条件不满足为止：

```python
sum = 0
i = 0
while i <= 100:
    sum += i
    i += 1
print(sum) # 输出 5050
```

## break 和 continue

在循环中，`break` 用于跳出循环，`continue` 用于跳过当前迭代并继续下一次迭代。
