# 函数

## 函数定义

Python 中使用 `def` 关键字定义函数，语法如下：

```python
def function_name(parameters):
    """docstring"""
    function_body
```

## 函数的参数

函数可以有位置参数、默认参数、可变参数和关键字参数等多种类型的参数。

### 位置参数

位置参数是最常见的参数类型，调用函数时必须按照定义的顺序传递参数。

```python
def greet(name):
    print(f"Hello, {name}!")
greet("Alice")  # 输出: Hello, Alice!
```

如果不想按照顺序传递参数，可以使用键值对的方式传递参数：

```python
greet(name="Bob")  # 输出: Hello, Bob!
```

Python 3.8 及以上版本还支持位置参数的特殊语法：

```python
def greet(name, /):
    print(f"Hello, {name}!")
greet("Charlie")  # 输出: Hello, Charlie!
```

这称为强制位置参数，调用时必须按照定义的顺序传递参数而不能使用键值对的方式。

### 默认参数

Python 中运行函数的参数拥有默认值，如果调用函数时没有传递该参数，则使用默认值。

```python
def greet(name="World"):
    print(f"Hello, {name}!")
greet()  # 输出: Hello, World!
greet("Alice")  # 输出: Hello, Alice!
```

::: tip

需要注意，带有默认值的参数必须放在没有默认值的参数之后，否则会导致语法错误。

```python
def greet(name="World", age):  # 这会导致语法错误
    print(f"Hello, {name}! You are {age} years old.")
```

:::

### 可变参数

Python 中可以使用 `*` 表达式让函数支持可变参数，例如一个将若干数字相加的函数：

```python
def sum(*numbers):
    total = 0
    for number in numbers:
        total += number
    return total
print(sum(1, 2, 3))  # 输出: 6
```

### 关键字参数

如果希望通过键值对的方式传入若干个参数，可以使用 `**` 表达式定义函数：

```python
def print_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")
print_info(name="Alice", age=30, city="New York")
# 输出:
# name: Alice
# age: 30
# city: New York
```

## 模块

如果一个 Python 源文件中定义了多个相同的函数，那么后声明的函数会覆盖前面声明的函数。为了解决这个问题，可以将函数定义在不同的模块中，然后通过 `import` 语句导入需要使用的函数。

Python 中一个源文件就是一个模块，模块名就是文件名（不包含扩展名）。例如，如果有一个名为 `math_utils.py` 的文件，其中定义了一个函数 `add`：

```python
# math_utils.py
def add(a, b):
    return a + b
```

在另一个文件中可以通过 `import` 语句导入这个函数：

```python
# main.py
from math_utils import add
result = add(2, 3)
print(result)  # 输出: 5
```

导入模块时还可以通过 `as` 关键字为模块或函数指定一个别名：

```python
import math_utils as mu
result = mu.add(2, 3)
print(result)  # 输出: 5
```

### 作用域

正常的函数和变量名是公开的，可以被其他模块访问；而以单下划线 `_` 开头的函数和变量名是受保护的，表示它们是模块内部使用的，不应该被外部访问；以双下划线 `__` 开头的函数和变量名是私有的，表示它们只能在类内部访问，不能被外部访问。

但是这些约定并不是强制的，Python 仍然允许访问受保护和私有的函数和变量，只是建议不要这样做。

## main 函数

Python 中没有像 C 语言那样的 `main` 函数，但可以通过以下方式模拟 `main` 函数的功能：

```python
def main():
    # 这里是程序的入口
    print("Hello, World!")
if __name__ == "__main__":
    main()
```

Python 解释器在执行一个模块时会将特殊变量 `__name__` 设置为 `"__main__"`，因此当直接运行这个模块时，`main()` 函数会被调用；而当这个模块被其他模块导入时，`main()` 函数不会被调用。

## 标准库的函数

Python 中有一类函数是不需要 `import` 就可以直接使用的，这些函数被称为内置函数（built-in functions）。常见的内置函数如下：

| 函数 | 说明 |
| ------- | ------------------------------------------------------------ |
| `abs` | 返回一个数的绝对值，例如：`abs(-1.3)`会返回`1.3`。 |
| `bin` | 把一个整数转换成以`'0b'`开头的二进制字符串，例如：`bin(123)`会返回`'0b1111011'`。 |
| `chr` | 将Unicode编码转换成对应的字符，例如：`chr(8364)`会返回`'€'`。 |
| `hex` | 将一个整数转换成以`'0x'`开头的十六进制字符串，例如：`hex(123)`会返回`'0x7b'`。 |
| `input` | 从输入中读取一行，返回读到的字符串。 |
| `len` | 获取字符串、列表等的长度。 |
| `max` | 返回多个参数或一个可迭代对象中的最大值，例如：`max(12, 95, 37)`会返回`95`。 |
| `min` | 返回多个参数或一个可迭代对象中的最小值，例如：`min(12, 95, 37)`会返回`12`。 |
| `oct` | 把一个整数转换成以`'0o'`开头的八进制字符串，例如：`oct(123)`会返回`'0o173'`。 |
| `open` | 打开一个文件并返回文件对象。 |
| `ord` | 将字符转换成对应的Unicode编码，例如：`ord('€')`会返回`8364`。 |
| `pow` | 求幂运算，例如：`pow(2, 3)`会返回`8`；`pow(2, 0.5)`会返回`1.4142135623730951`。 |
| `print` | 打印输出。 |
| `range` | 构造一个范围序列，例如：`range(100)`会产生`0`到`99`的整数序列。 |
| `round` | 按照指定的精度对数值进行四舍五入，例如：`round(1.23456, 4)`会返回`1.2346`。 |
| `sum` | 对一个序列中的项从左到右进行求和运算，例如：`sum(range(1, 101))`会返回`5050`。 |
| `type` | 返回对象的类型，例如：`type(10)`会返回`int`；而`type('hello')`会返回`str`。 |

## 高阶函数

Python 中的函数支持以下操作：

- 变量可以指向函数。
- 函数名也是一个变量，可以被赋值和传递。
- 函数可以作为参数传递给另一个函数。
- 函数可以作为另一个函数的返回值。

### map/reduce

`map` 函数接受一个函数和一个可迭代对象作为参数，将函数作用于可迭代对象的每个元素，并返回一个新的可迭代对象。

```python
def square(x):
    return x * x
numbers = [1, 2, 3, 4, 5]
squared_numbers = map(square, numbers)
print(list(squared_numbers))  # 输出: [1, 4, 9, 16, 25]
```

`reduce` 函数接受一个函数和一个可迭代对象作为参数，将函数作用于可迭代对象的前两个元素，并将结果与下一个元素继续进行运算，直到所有元素都被处理完毕，最终返回一个结果。

```python
from functools import reduce
def add(x, y):
    return x + y
numbers = [1, 2, 3, 4, 5]
total = reduce(add, numbers)
print(total)  # 输出: 15
```

### filter

`filter` 函数接受一个函数和一个可迭代对象作为参数，将函数作用于可迭代对象的每个元素，并返回一个新的可迭代对象，其中包含函数返回值为 `True` 的元素。

```python
def is_even(x):
    return x % 2 == 0
numbers = [1, 2, 3, 4, 5]
even_numbers = filter(is_even, numbers)
print(list(even_numbers))  # 输出: [2, 4]
```

### sorted

`sorted` 函数接受一个可迭代对象作为参数，并返回一个新的列表，其中包含可迭代对象的所有元素，并按照指定的排序规则进行排序。

```python
numbers = [5, 2, 9, 1, 5, 6]
sorted_numbers = sorted(numbers)
print(sorted_numbers)  # 输出: [1, 2, 5, 5, 6, 9]
```

`sorted` 是一个高阶函数，还可以接收一个 `key` 参数实现自定义排序规则。例如，下面的代码按照字符串的长度对列表进行排序：

```python
strings = ['apple', 'banana', 'cherry', 'date']
sorted_strings = sorted(strings, key=len)
print(sorted_strings)  # 输出: ['date', 'apple', 'banana', 'cherry']
```

如果要进行反向排序，可以将 `reverse` 参数设置为 `True`：

```python
numbers = [5, 2, 9, 1, 5, 6]
sorted_numbers = sorted(numbers, reverse=True)
print(sorted_numbers)  # 输出: [9, 6, 5, 5, 2, 1]
```

## Lambda 函数

lambda 函数是一种匿名函数，只能有一行代码，代码中的表达式产生的运算结果就是这个匿名函数的返回值。lambda 函数的语法如下：

```python
lambda parameters: expression
```

例如，下面的 lambda 函数接受两个参数并返回它们的和：

```python
add = lambda x, y: x + y
result = add(2, 3)
print(result)  # 输出: 5
```

## 装饰器

装饰器是一个函数，它接受另一个函数作为参数，并返回一个新的函数。装饰器通常用于在不修改原函数代码的情况下为函数添加额外的功能。

例如给一个函数添加日志功能的装饰器：

```python
def log(func):
    def wrapper(*args, **kwargs):
        print(f"Calling function {func.__name__} with arguments {args} and keyword arguments {kwargs}")
        return func(*args, **kwargs)
    return wrapper

@log
def add(x, y):
    return x + y
result = add(2, 3)
# 输出: Calling function add with arguments (2, 3) and keyword arguments {}
print(result)  # 输出: 5
```

将 `@log` 放在函数定义的前面相当于执行了 `add = log(add)`，即将 `add` 函数作为参数传递给 `log` 函数，并将 `log` 函数返回的结果重新赋值给 `add` 变量。

装饰器本身也可以接受参数，例如下面的代码定义了一个带有参数的装饰器：

```python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator
@repeat(3)
def greet(name):
    print(f"Hello, {name}!")
greet("Alice")
# 输出:
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
```

### __name__ 属性

每个函数都有一个 `__name__` 属性，表示函数的名称。使用装饰器时，装饰器返回的函数会覆盖原函数，因此 `__name__` 属性会被修改为装饰器内部定义的函数的名称。

```python
def log(func):
    def wrapper(*args, **kwargs):
        print(f"Calling function {func.__name__} with arguments {args} and keyword arguments {kwargs}")
        return func(*args, **kwargs)
    return wrapper
@log
def add(x, y):
    return x + y
print(add.__name__)  # 输出: wrapper
```

由于装饰器会修改 `__name__` 属性，因此某些依赖函数签名的代码执行起来会有问题，为了解决这个问题，可以使用 `functools` 模块中的 `wraps` 函数来保留原函数的名称和文档字符串等属性。

```python
from functools import wraps
def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling function {func.__name__} with arguments {args} and keyword arguments {kwargs}")
        return func(*args, **kwargs)
    return wrapper
@log
def add(x, y):
    return x + y
print(add.__name__)  # 输出: add
```

## 偏函数

偏函数是指将一个函数的某些参数固定住，返回一个新的函数。Python 中可以使用 `functools` 模块中的 `partial` 函数来创建偏函数。

例如将一个字符串分别按照 2 进制、8 进制和 16 进制转换成整数的函数：

```python
from functools import partial
int2 = partial(int, base=2)
int8 = partial(int, base=8)
int16 = partial(int, base=16)
print(int2('10010'))  # 输出: 18
print(int8('17'))     # 输出: 15
print(int16('1e'))    # 输出: 30
```
