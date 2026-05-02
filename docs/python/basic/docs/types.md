# 数据类型

Python 有以下几种基础类型：

- 整数（int）：Python 可以处理任意大小的整数，也包括负整数，使用 `0x` 前缀表示十六进制，`0o` 前缀表示八进制，`0b` 前缀表示二进制。，对于很大的数，可以使用 `_` 来分隔数字以提高可读性，例如 `1_000_000`。
- 浮点数（float）：浮点数可以使用数学写法例如 `3.14`，也可以使用科学计数法例如 `1e-5`。
- 字符串（str）：字符串可以使用单引号 `'` 或双引号 `"` 来定义，也可以使用三引号 `'''` 或 `"""` 来定义多行字符串。同时，为了方便在字符串中表示转义字符，可以使用原始字符串（raw string），在字符串前加上 `r` 或 `R`，例如 `r'\n'` 表示一个包含反斜杠和字母 n 的字符串，而不是换行符。
- 布尔值（bool）：布尔值只有两个取值：`True` 和 `False`，它们是 Python 的内置常量。

## 字符串及编码

在 Python 3 中，字符串以 Unicode 编码，这意味着字符串可以包含来自世界上任何语言的字符。Python 3 的字符串类型是 `str`，它表示 Unicode 字符串。对于需要处理二进制数据的情况，可以使用 `bytes` 类型，它表示字节序列。

通过 `encode()` 方法可以将字符串转换为字节序列，例如：

```python
print('test'.encode('ascii'))
print('中文'.encode('utf-8'))
print('中文'.encode('ascii')) # 报错
```

如果字符串中包含无法编码的字符，`encode()` 方法会抛出 `UnicodeEncodeError` 异常。可以通过指定错误处理方式来避免这种情况，例如：

```python
print('中文'.encode('ascii', errors='ignore')) # 忽略无法编码的字符
print('中文'.encode('ascii', errors='replace')) # 用 ? 替换无法编码的字符
```

相应的，可以使用 `decode()` 方法将字节序列转换回字符串，例如：

```python
print(b'test'.decode('ascii'))
print(b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8'))
```

同样，如果包含无法解码的字节，`decode()` 方法会抛出 `UnicodeDecodeError` 异常，可以通过指定错误处理方式来避免这种情况，例如：

```python
print(b'\xe4\xb8\xad\xe6\x96\x87'.decode('ascii', errors='ignore')) # 忽略无法解码的字节
print(b'\xe4\xb8\xad\xe6\x96\x87'.decode('ascii', errors='replace')) # 用 ? 替换无法解码的字节
```

::: tip

Python 中表示 bytes 的字面量使用 `b` 前缀，例如 `b'hello'` 表示一个包含 ASCII 字符的字节序列，而 `b'\xe4\xb8\xad\xe6\x96\x87'` 表示一个包含 UTF-8 编码的字节序列。

:::

要计算一个字符串又多少个字符，可以使用内置的 `len()` 函数，例如：

```python
print(len('hello')) # 输出 5
print(len('中文')) # 输出 2
```

`len` 计算的是字符的数量，如果换成 `bytes` 类型，则计算的是字节的数量，例如：

```python
print(len(b'hello')) # 输出 5
print(len('中文'.encode('utf-8'))) # 输出 6
```

由此可见，一个中文字符在 UTF-8 编码下占用 3 个字节，一个英文字符只占用 1 个字节。

由于 Python 源文件也是文本文件，所以当源代码包含中文的时候，在保存源码时，需要指定编码格式为 UTF-8。通常情况下，现代的编辑器会默认使用 UTF-8 编码来保存文件，因此不需要特别指定。但是，如果你使用的编辑器默认使用其他编码格式（例如 Windows 上的 GBK），则需要在源代码文件的开头添加以下注释来指定编码格式：

```python
# -*- coding: utf-8 -*-
```

Python 中仍然使用 `%` 来表示字符串格式化，例如：

```python
name = 'Alice'
age = 30
print('My name is %s and I am %d years old.' % (name, age))
```

还有一种格式化字符串的方法是使用 `str.format()` 方法，例如：

```python
name = 'Alice'
age = 30
print('My name is {} and I am {} years old.'.format(name, age))
```

最后一种格式化字符串的方法是使用 f-string（格式化字符串字面量），有点像 JavaScript 中的模板字符串，它在 Python 3.6 中引入，例如：

```python
name = 'Alice'
age = 30
print(f'My name is {name} and I am {age} years old.')
```

字符串支持使用 `+` 运算符进行拼接，例如：

```python
str1 = 'Hello'
str2 = 'World'
print(str1 + ' ' + str2) # 输出 'Hello World'
```

使用 `*` 运算符可以将字符串重复多次，例如：

```python
str1 = 'Hello'
print(str1 * 3) # 输出 'HelloHelloHello'
```

使用 `in`、`not in` 运算符可以检查子字符串是否在字符串中，例如：

```python
str1 = 'Hello World'
print('Hello' in str1) # 输出 True
print('Python' in str1) # 输出 False
print('Python' not in str1) # 输出 True
```

使用 `find` 和 `index` 方法可以查找子字符串在字符串中的位置，例如：

```python
str1 = 'Hello World'
print(str1.find('World')) # 输出 6
print(str1.find('Python')) # 输出 -1，表示没有找到
print(str1.index('World')) # 输出 6
# print(str1.index('Python')) # 会抛出 ValueError 异常，因为没有找到
```

大小写转换：

```python
str1 = 'Hello World'
print(str1.upper()) # 全部大写
print(str1.lower()) # 全部小写
print(str1.title()) # 大写每个单词的首字母
print(str1.capitalize()) # 大写第一个字母
```

通过 `startswith`、`endswith`、`isdigit`、`isalpha`、`isalnum` 等方法可以检查字符串的特定属性，例如：

```python
str1 = 'Hello World'
print(str1.startswith('Hello')) # 输出 True
print(str1.endswith('World')) # 输出 True
print(str1.isdigit()) # 检查字符串是否只包含数字，输出 False
print(str1.isalpha()) # 检查字符串是否只包含字母，输出 False
print(str1.isalnum()) # 检查字符串是否只包含字母和数字，输出 False
```

通过 `strip`、`lstrip`、`rstrip` 方法可以去除字符串两端的空白字符，例如：

```python
str1 = '  Hello World  '
print(str1.strip()) # 去除字符串两端的空白字符，输出 'Hello World'
print(str1.lstrip()) # 去除字符串左端的空白字符，输出 'Hello World  '
print(str1.rstrip()) # 去除字符串右端的空白字符，输出 '  Hello World'
```

通过 `replace` 方法可以替换字符串中的子字符串，例如：

```python
str1 = 'Hello World'
print(str1.replace('World', 'Python')) # 输出 'Hello Python'
```

通过 `split`、`join` 方法可以分割和连接字符串，例如：

```python
str1 = 'Hello World'
print(str1.split()) # 输出 ['Hello', 'World']
str2 = ['Hello', 'Python']
print('~'.join(str2)) # 输出 'Hello~Python'
```

## list 和 tuple

### list

list 是一种有序集合，可以随时添加删除其中的元素，例如：

```python
my_list = [1, 2, 3]
```

使用下标可以访问 list 中的元素，例如：

```python
my_list = [1, 2, 3]
print(my_list[0]) # 输出 1
print(my_list[1]) # 输出 2
print(my_list[2]) # 输出 3
```

如果使用负数作为下标，则表示从后往前访问，例如：

```python
my_list = [1, 2, 3]
print(my_list[-1]) # 输出 3
print(my_list[-2]) # 输出 2
print(my_list[-3]) # 输出 1
```

添加元素可以使用 `append()` 方法，例如：

```python
my_list = [1, 2, 3]
my_list.append(4)
print(my_list) # 输出 [1, 2, 3, 4]
```

要在指定位置插入元素，可以使用 `insert(index, value)` 方法，例如：

```python
my_list = [1, 2, 3]
my_list.insert(1, 4)
print(my_list) # 输出 [1, 4, 2, 3]
```

删除末尾元素可以使用 `pop()` 方法，例如：

```python
my_list = [1, 2, 3]
my_list.pop()
print(my_list) # 输出 [1, 2]
```

删除指定位置的元素可以使用 `pop(index)` 方法，例如：

```python
my_list = [1, 2, 3]
my_list.pop(1)
print(my_list) # 输出 [1, 3]
```

要根据值删除元素，可以使用 `remove(value)` 方法，例如：

```python
my_list = [1, 2, 3]
my_list.remove(2)
print(my_list) # 输出 [1, 3]
```

::: warning

如果要删除的元素在 list 中不存在，`remove()` 方法会抛出 `ValueError` 异常，因此在使用 `remove()` 方法之前，最好先检查一下元素是否存在，例如：

```python
my_list = [1, 2, 3]
if 2 in my_list:
    my_list.remove(2)
print(my_list) # 输出 [1, 3]
```

另外，如果 list 中又多个相同的元素，`remove()` 方法只会删除第一个出现的元素。

:::

同一个 list 中，可以包含不同的类型的元素，例如：

```python
my_list = [1, 'hello', 3.14, True]
print(my_list) # 输出 [1, 'hello', 3.14, True]
```

使用 `len()` 函数可以计算 list 中元素的数量，例如：

```python
my_list = [1, 2, 3]
print(len(my_list)) # 输出 3
```

使用 `index` 方法可以查找元素在 list 中的索引位置，例如：

```python
my_list = [1, 2, 3]
print(my_list.index(2)) # 输出 1
# print(my_list.index(22)) # 会抛出 ValueError 异常，因为 22 不在列表中
```

使用 `count` 方法可以计算元素在 list 中出现的次数，例如：

```python
my_list = [1, 2, 3, 2]
print(my_list.count(2)) # 输出 2
```

使用 `sort` 方法可以对列表元素进行排序，顺序是递增的，例如：

```python
my_list = [3, 1, 2]
my_list.sort()
print(my_list) # 输出 [1, 2, 3]
```

要想实现递减排序，可以使用 `sort(reverse=True)` 方法，例如：

```python
my_list = [3, 1, 2]
my_list.sort(reverse=True)
print(my_list) # 输出 [3, 2, 1]
```

使用 `reverse` 方法可以将列表元素反转，例如：

```python
my_list = [1, 2, 3]
my_list.reverse()
print(my_list) # 输出 [3, 2, 1]
```

list 还可以进行运算，例如将两个 list 连接起来可以使用 `+` 运算符，例如：

```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]
print(list1 + list2) # 输出 [1, 2, 3, 4, 5, 6]
```

使用 `*` 运算符可以将 list 重复多次，例如：

```python
my_list = [1, 2, 3]
print(my_list * 2) # 输出 [1, 2, 3, 1, 2, 3]
```

使用 `in`、`not in` 运算符可以检查元素是否在 list 中，例如：

```python
my_list = [1, 2, 3]
print(2 in my_list) # 输出 True
print(4 in my_list) # 输出 False
print(4 not in my_list) # 输出 True
```

两个列表还可以进行关系比较，例如：

```python
list1 = [1, 2, 3]
list2 = [1, 2, 3]
list3 = [4, 5, 6]
print(list1 == list2) # 输出 True
print(list1 == list3) # 输出 False
print(list1 != list2) # 输出 False
print(list1 != list3) # 输出 True
print(list1 < list3) # 输出 True
```

其中大于小于比较是按照元素逐个比较的，直到找到第一个不相等的元素为止。

通过 `for-in` 循环可以遍历 list 中的元素，例如通过下标遍历：

```python
my_list = [1, 2, 3]
for i in range(len(my_list)):
    print(my_list[i])
```

通过元素本身遍历：

```python
my_list = [1, 2, 3]
for item in my_list:
    print(item)
```

### tuple

与 list 类似，tuple（元组）也是一种有序列表，但是一旦初始化后就不能修改，例如：

```python
my_tuple = (1, 2, 3)
print(my_tuple) # 输出 (1, 2, 3)
```

仍然可以使用下标来访问 tuple 中的元素，例如：

```python
my_tuple = (1, 2, 3)
print(my_tuple[0]) # 输出 1
print(my_tuple[1]) # 输出 2
print(my_tuple[2]) # 输出 3
```

如果要定义一个只有一个元素的 tuple，需要在元素后面加上逗号，例如：

```python
my_tuple = (1,)
print(my_tuple) # 输出 (1,)
```

因为如果不加逗号，Python 会把括号当成普通的括号，而不是 tuple 的定义。

元组同样支持 `for-in` 循环来遍历元素，例如：

```python
my_tuple = (1, 2, 3)
for item in my_tuple:
    print(item)
```

以及拼接运算，例如：

```python
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)
print(tuple1 + tuple2) # 输出 (1, 2, 3, 4, 5, 6)
```

`in`、`not in` 运算符也可以用来检查元素是否在 tuple 中，例如：

```python
my_tuple = (1, 2, 3)
print(2 in my_tuple) # 输出 True
print(4 in my_tuple) # 输出 False
print(4 not in my_tuple) # 输出 True
```

关系比较：

```python
tuple1 = (1, 2, 3)
tuple2 = (1, 2, 3)
tuple3 = (4, 5, 6)
print(tuple1 == tuple2) # 输出 True
print(tuple1 == tuple3) # 输出 False
print(tuple1 != tuple2) # 输出 False
print(tuple1 != tuple3) # 输出 True
print(tuple1 < tuple3) # 输出 True
```

#### 打包和解包

如果使用 `,` 将多个值赋值给一个变量时，Python 会自动将这些值打包成一个 tuple，例如：

```python
my_tuple = 1, 2, 3
print(my_tuple) # 输出 (1, 2, 3)
```

同样的，可以将元组赋值给多个变量实现解包，例如：

```python
my_tuple = (1, 2, 3)
a, b, c = my_tuple
print(a) # 输出 1
print(b) # 输出 2
print(c) # 输出 3
```

解包时如果变量的数量和元组中的元素数量不匹配，会抛出 `ValueError` 异常。

为了解决这个问题，可以使用星号表达式来捕获多余的元素，例如：

```python
my_tuple = (1, 2, 3, 4, 5)
a, b, *rest = my_tuple
print(a) # 输出 1
print(b) # 输出 2
print(rest) # 输出 [3, 4, 5]
```

打包和解包不仅对 tuple 有效，对 list、字符串等类型都有效。

## dict

dict（字典）是一种无序的键值对集合，每个键必须是唯一的不可变对象，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
print(my_dict) # 输出 {'name': 'Alice', 'age': 30, 'city': 'New York'}
print(my_dict['name']) # 输出 'Alice'
print(my_dict['age']) # 输出 30
print(my_dict['city']) # 输出 'New York'
print(my_dict['not_exist']) # 会抛出 KeyError 异常，因为键不存在
```

字典可以直接用 key 访问或者设置 value，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
my_dict['name'] = 'Bob'
print(my_dict) # 输出 {'name': 'Bob', 'age': 30, 'city': 'New York'}
```

同样可以使用 `in`、`not in` 运算符来检查键是否在字典中，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
print('name' in my_dict) # 输出 True
print('country' in my_dict) # 输出 False
print('country' not in my_dict) # 输出 True
```

使用 `get` 方法可以安全地访问字典中的值，如果键不存在，将返回 None 或者指定的默认值，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
print(my_dict.get('name')) # 输出 'Alice'
print(my_dict.get('country')) # 输出 None
print(my_dict.get('country', 'Unknown')) # 输出 'Unknown'
```

使用 `keys()`、`values()`、`items()` 方法可以获取字典的键、值和键值对，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
print(my_dict.keys()) # 输出 dict_keys(['name', 'age', 'city'])
print(my_dict.values()) # 输出 dict_values(['Alice', 30, 'New York'])
print(my_dict.items()) # 输出 dict_items([('name', 'Alice'), ('age', 30), ('city', 'New York')])
```

使用 `update` 方法可以实现两个字典的合并，当执行 `x.update(y)` 时，字典 x 与 y 中的相同的键对应的值会被 y 的值覆盖，而 x 中没有、y 中有的键值对会被添加到 x 中，例如：

```python
dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
dict1.update(dict2)
print(dict1) # 输出 {'a': 1, 'b': 3, 'c': 4}
```

在 Python 3.9 之后，字典还支持使用 `|` 运算符来合并两个字典，例如：

```python
dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
dict3 = dict1 | dict2
print(dict3) # 输出 {'a': 1, 'b': 3, 'c': 4}
```

使用 `del` 关键字可以删除字典中的键值对，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
del my_dict['age']
print(my_dict) # 输出 {'name': 'Alice', 'city': 'New York'}
```

使用 `pop` 和 `popitem` 方法可以从字典中删除元素，前者会返回被删除的值，后者会返回被删除的键值对，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
age = my_dict.pop('age')
print(age) # 输出 30
print(my_dict) # 输出 {'name': 'Alice', 'city': 'New York'}
item = my_dict.popitem()
print(item) # 输出 ('city', 'New York')
print(my_dict) # 输出 {'name': 'Alice'}
```

使用 `clear` 方法可以清空字典中的所有键值对，例如：

```python
my_dict = {'name': 'Alice', 'age': 30, 'city': 'New York'}
my_dict.clear()
print(my_dict) # 输出 {}
```

## set

set 与 dict 类似，是一种无序的集合，但是 set 只包含键，没有值，因此 set 中的元素必须是唯一的不可变对象，例如：

```python
my_set = {1, 2, 3}
print(my_set) # 输出 {1, 2, 3}
```

将 list 转换为 set 可以使用 `set()` 函数，例如：

```python
my_list = [1, 2, 3, 2]
my_set = set(my_list)
print(my_set) # 输出 {1, 2, 3}
```

通过 `add` 方法可以向 set 中添加元素，例如：

```python
my_set = {1, 2, 3}
my_set.add(4)
print(my_set) # 输出 {1, 2, 3, 4}
```

通过 `remove` 方法可以从 set 中删除元素，例如：

```python
my_set = {1, 2, 3}
my_set.remove(2)
print(my_set) # 输出 {1, 3}
```

set 还可以直接进行交差并补运算，例如：

```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}

# 交集
print(set1 & set2) # 输出 {3}
print(set1.intersection(set2)) # 输出 {3}

# 并集
print(set1 | set2) # 输出 {1, 2, 3, 4, 5}
print(set1.union(set2)) # 输出 {1, 2, 3, 4, 5}

# 差集
print(set1 - set2) # 输出 {1, 2}
print(set1.difference(set2)) # 输出 {1, 2}

# 对称差集
print(set1 ^ set2) # 输出 {1, 2, 4, 5}
print(set1.symmetric_difference(set2)) # 输出 {1, 2, 4, 5}
```

::: tip

对称差集指的是在 set1 和 set2 中存在，但不同时存在于两个集合中的元素。

:::

### frozenset

frozenset 是 set 的不可变版本，一旦创建就不能修改，例如：

```python
my_frozenset = frozenset([1, 2, 3])
print(my_frozenset) # 输出 frozenset({1, 2, 3})
```

## 高级特性

### 切片

Python 中的切片（slice）是一种强大的工具，可以用来获取序列（如字符串、列表、元组等）中的一部分元素。切片的语法如下：

```python
sequence[start:stop:step]
```

其中，`start` 是切片的起始索引，默认为 0；`stop` 是切片的结束索引，不包含该索引位置的元素；`step` 是切片的步长，默认为 1。

例如获取字符串中的一部分：

```python
my_string = "Hello, World!"
print(my_string[0:5]) # 输出 'Hello'
print(my_string[7:]) # 输出 'World!'
print(my_string[::2]) # 输出 'Hlo ol!'
```

获取 list 中的一部分：

```python
my_list = [1, 2, 3, 4, 5]
print(my_list[1:4]) # 输出 [2, 3, 4]
print(my_list[:3]) # 输出 [1, 2, 3]
print(my_list[::2]) # 输出 [1, 3, 5]
```

获取 tuple 中的一部分：

```python
my_tuple = (1, 2, 3, 4, 5)
print(my_tuple[1:4]) # 输出 (2, 3, 4)
print(my_tuple[:3]) # 输出 (1, 2, 3)
print(my_tuple[::2]) # 输出 (1, 3, 5)
```

切片也能倒着获取元素，例如：

```python
my_string = "Hello, World!"
print(my_string[::-1]) # 输出 '!dlroW ,olleH'
```

### 迭代

要遍历一个序列中的元素，可以使用 `for-in` 循环。`for-in` 循环需要一个可迭代对象（iterable），例如字符串、列表、元组、字典等都是可迭代对象。

要想判断一个对象是否是可迭代对象，可以使用 `collections.abc.Iterable` 来进行检查，例如：

```python
from collections.abc import Iterable
print(isinstance("hello", Iterable)) # 输出 True
print(isinstance([1, 2, 3], Iterable)) # 输出 True
print(isinstance(123, Iterable)) # 输出 False
```

### 列表生成式

前面已经提到，使用 `range` 函数可以生成一个整数序列，例如：

```python
print(list(range(1, 10))) # 输出 [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

那么如果需要生成一个平方数列表，可以使用 `map` 或者循环，但是 Python 提供了一种更简洁的方式来生成列表，那就是列表生成式（list comprehension），例如：

```python
squares = [x * x for x in range(1, 10)]
print(squares) # 输出 [1, 4, 9, 16, 25, 36, 49, 64, 81]
```

列表生成式的语法是 `[expression for item in iterable if condition]`，其中 `expression` 是生成列表元素的表达式，`item` 是迭代变量，`iterable` 是可迭代对象，`condition` 是可选的过滤条件。例如，下面的代码生成一个包含 1 到 10 中偶数的列表：

```python
even_numbers = [x for x in range(1, 11) if x % 2 == 0]
print(even_numbers) # 输出 [2, 4, 6, 8, 10]
```

列表生成式也能嵌套，例如求两个列表的笛卡尔积：

```python
list1 = [1, 2, 3]
list2 = ['a', 'b', 'c']
cartesian_product = [(x, y) for x in list1 for y in list2]
print(cartesian_product) # 输出 [(1, 'a'), (1, 'b'), (1, 'c'), (2, 'a'), (2, 'b'), (2, 'c'), (3, 'a'), (3, 'b'), (3, 'c')]
```

注意，`for` 后面的 `if` 是过滤条件，不能带 `else`，如果需要使用 `else`，可以将其放在 `for` 前面的表达式中，例如：

```python
numbers = [1, 2, 3, 4, 5]
result = [x if x % 2 == 0 else -x for x in numbers]
print(result) # 输出 [-1, 2, -3, 4, -5]
```

### 生成器

如果列表的元素可以按照某种算法推算出来，那么就不必创建一个完整的列表，而是可以在需要的时候才生成元素，这就是生成器（generator）。

创建生成器有多种方式，最简单的方法是将列表生成式的 `[]` 改成 `()`，例如：

```python
squares = (x * x for x in range(1, 10))
print(squares) # 输出 <generator object <genexpr> at 0x7ff8c0c0>
```

如果要一个个获取生成器中的元素，可以使用 `next()` 函数，例如：

```python
squares = (x * x for x in range(1, 10))
print(next(squares)) # 输出 1
print(next(squares)) # 输出 4
print(next(squares)) # 输出 9
```

当没有更多元素时，`next()` 函数会抛出 `StopIteration` 异常。

或者者可以使用 `for-in` 循环来遍历生成器中的元素，例如：

```python
squares = (x * x for x in range(1, 10))
for square in squares:
    print(square)
```

第二种创建生成器的方法是使用生成器函数，生成器函数是一个普通的函数，但是使用 `yield` 语句来返回一个值，并且在下一次调用时从上次返回的地方继续执行，例如一个斐波那契数列的生成器函数可以这样定义：

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
for num in fibonacci(10):
    print(num)
```

普通函数时顺序执行，遇到 `return` 或者最后一行函数语句就返回，而生成器函数在每次调用 `next()` 时执行，遇到 `yield` 就返回，再次执行时从上次返回的 `yield` 语句继续执行。

::: warning

调用生成器函数会创建一个生成器对象，多次调用生成器函数会创建多个生成器对象，每个生成器对象都有自己的状态。

:::

### 迭代器

可以被 `next()` 函数调用并不断返回下一个值的对象称为迭代器（iterator）。迭代器对象实现了迭代器协议，即包含 `__iter__()` 和 `__next__()` 方法。

可以使用 `isinstance()` 函数来检查一个对象是否是迭代器，例如：

```python
from collections.abc import Iterator
print(isinstance(iter([1, 2, 3]), Iterator)) # 输出 True
print(isinstance(iter('hello'), Iterator)) # 输出 True
print(isinstance(123, Iterator)) # 输出 False
```

将 `Iterable` 转换为 `Iterator` 可以使用内置的 `iter()` 函数，例如：

```python
print(iter([1, 2, 3])) # 输出 <list_iterator object at 0x7ff8c0c0>
print(iter('hello')) # 输出 <str_iterator object at 0x7ff8c0c0>
```
