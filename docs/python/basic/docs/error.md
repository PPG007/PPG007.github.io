# 错误处理

Python 中的错误处理主要通过 `try...except` 语句来实现。你可以捕获特定类型的异常，并在发生错误时执行相应的代码。

在 Python 中，使用 `raise` 语句可以抛出一个错误的实例，这个实例必须是 `BaseException` 类的子类。你可以自定义异常类来表示特定类型的错误：

```python
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b

result = divide(10, 0)
```

错误会导致程序中断，Python 中可以使用 `try...except` 块来捕获和处理这些错误：

```python
try:
    result = divide(10, 0)
except ValueError as e:
    print(f"发生错误: {e}")
print("程序继续执行")
```

Python 中同样支持 `else` 和 `finally` 块：

- `else` 块在没有发生异常时执行。
- `finally` 块无论是否发生异常都会执行，通常用于清理资源。

```python
try:
    result = divide(10, 2)
except ValueError as e:
    print(f"发生错误: {e}")
else:
    print(f"结果是: {result}")
finally:
    print("执行完毕")
```

由于所有的错误都是通过继承 `BaseException` 类来实现的，同时错误是异常类的实例对象，因此可以通过捕获父错误类型来捕获所有的子错误：

```python
try:
    result = divide(10, 0)
except Exception as e:
    print(f"发生错误: {e}")
```

如果希望既能捕获错误，又能记录错误的堆栈信息，可以使用 `traceback` 模块：

```python
import traceback

try:
    result = divide(10, 0)
except Exception as e:
    print(f"发生错误: {e}")
    traceback.print_exc()
```

或者使用 `logging` 模块来记录错误：

```python
import logging

logging.basicConfig(level=logging.ERROR)
try:
    result = divide(10, 0)
except Exception as e:
    logging.exception("发生错误")
print("程序继续执行")
```

当我们捕获到一个错误后，如果不知道如何处理，可以在进行必要的记录等操作之后，再次抛出这个错误：

```python
try:
    result = divide(10, 0)
except Exception as e:
    logging.exception("发生错误")
    raise
print("程序继续执行")
```

::: tip

当 `raise` 语句没有指定错误对象时，会重新抛出当前捕获的错误。

:::

## 断言

断言是一种调试工具，用于在程序中插入检查点，以验证某些条件是否为真。如果条件不满足，断言会抛出一个 `AssertionError` 异常：

```python
def calculate_area(radius):
    assert radius >= 0, "半径必须是非负数"
    return 3.14 * radius ** 2

area = calculate_area(-5)
```

默认情况下，断言在 Python 中是启用的，但在优化模式下（使用 `-O` 选项运行 Python）会被禁用，因此不应该依赖断言来进行程序的正常错误处理。

## 单元测试

Python 中单元测试类需要继承 `unittest.TestCase` 类，并且测试方法必须以 `test_` 开头：

```python
import unittest

class TestMathFunctions(unittest.TestCase):
    def test_divide(self):
        self.assertEqual(divide(10, 2), 5)
        self.assertRaises(ValueError, divide, 10, 0)

if __name__ == '__main__':
    unittest.main()
```

单元测试类有两个特殊的 `setUp` 和 `tearDown` 方法，这两个方法会分别在每个测试方法执行前和执行后被调用，可以在其中进行一些准备工作和清理工作。

## 文档测试

文档测试（doctest）是一种通过在文档字符串中编写示例代码来测试代码的工具：

```python
def add(a, b):
    """
    返回 a 和 b 的和。

    >>> add(2, 3)
    5
    >>> add(-1, 1)
    0
    """
    return a + b
if __name__ == '__main__':
    import doctest
    doctest.testmod()
```

正常情况下，执行这个脚本会运行文档测试，如果所有测试都通过，则不会有任何输出；如果有测试失败，则会显示失败的测试用例和相关信息。

文档测试既可以作为代码的文档，也可以作为测试用例，适合于一些简单的函数和类的测试。
