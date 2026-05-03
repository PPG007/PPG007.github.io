# IO

## 读文件

使用 Python 的内置函数 `open()` 可以打开一个文件，并返回一个文件对象。可以使用该对象的 `read()` 方法来读取文件内容。例如：

```python
f = open('file.txt', 'r')
content = f.read()
print(content)
f.close()
```

在上面的代码中，`r` 参数表示以只读模式打开文件。在打开文件后，调用 `read()` 方法将文件的内容读取为一个字符串，并将其存储在变量 `content` 中。最后，使用 `close()` 方法关闭文件。

由于文件操作时有可能会产生异常，因此需要使用 `try` 来处理异常，防止 `close` 方法无法调用导致资源泄漏。例如：

```python
try:
    f = open('file.txt', 'r')
    content = f.read()
    print(content)
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    f.close()
```

但是这样比较繁琐，Python 提供了 `with` 语句来简化文件操作，自动处理文件的打开和关闭。例如：

```python
with open('file.txt', 'r') as f:
    content = f.read()
    print(content)
```

由于 `read` 函数会一次性读取整个文件，如果文件很大，可能会占用大量内存。可以传入一个整数参数来指定读取的字节数，或者使用 `readline()`、`readlines()` 方法逐行读取文件。例如：

```python
with open('file.txt', 'r') as f:
    line = f.readline()
    while line:
        print(line.strip())  # 去掉行末的换行符
        line = f.readline()
```

上面的代码适用于 UTF-8 编码的文本文件。如果文件使用其他编码，可以在 `open()` 函数中指定编码参数，例如：

```python
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    print(content)
```

有些文件可能编码并不规范，或者包含一些无法解码的字符，可以使用 `errors` 参数来指定错误处理方式，例如：

```python
with open('file.txt', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
    print(content)
```

除了直接忽略错误，还可以选择替换错误字符，例如：

```python
with open('file.txt', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()
    print(content)
```

如果是读取二进制文件，需要使用 `rb` 模式打开文件，例如：

```python
with open('file.bin', 'rb') as f:
    content = f.read()
    print(content)
```

关于 `open()` 函数的 `encoding`、`errors` 的可选项，可以参考[官方文档](https://docs.python.org/3/library/functions.html#open)。

## 写文件

写文件和读文件一样，唯一的区别是打开文件时使用 `w` 或者 `wb` 表示写文本文件还是写二进制文件。例如：

```python
with open('file.txt', 'w', encoding='utf-8') as f:
    f.write('Hello, World!')
```

如果文件不存在，写入时会创建这个文件；如果文件已经存在，写入时会覆盖原有内容。如果想要在文件末尾追加内容，可以使用 `a` 模式，例如：

```python
with open('file.txt', 'a', encoding='utf-8') as f:
    f.write('\nThis is an additional line.')
```

## StringIO 和 BytesIO

很多时候，数据读写的不一定是文件，也可以在内存中读写。

`StringIO` 就是在内存中读写 `str`。

要想将 `str` 写入 `StringIO`，首先需要创建一个 `StringIO`，然后像文件一样写入即可：

```python
from io import StringIO
s = StringIO()
s.write('Hello, World!')
print(s.getvalue())  # 获取写入的内容
```

要想从 `StringIO` 中读取数据，可以像文件一样使用 `read()` 方法：

```python
from io import StringIO
s = StringIO('Hello, World!')
content = s.read()
print(content)
```

但是如果是读取一个被写入了数据的 `StringIO`，需要先调用 `seek(0)` 将指针移动到开头，否则读取时会返回空字符串：

```python
from io import StringIO
s = StringIO()
s.write('Hello, World!')
s.seek(0)  # 将指针移动到开头
content = s.read()
print(content)
```

`StringIO` 操作的只能是 `str`，如果需要在内存中读写 `bytes`，可以使用 `BytesIO`：

```python
from io import BytesIO
b = BytesIO()
b.write('中文'.encode('utf-8'))  # 写入 bytes，需要先编码
print(b.getvalue())  # 获取写入的内容
```

读取和上面一样：

```python
from io import BytesIO
b = BytesIO()
b.write('中文'.encode('utf-8'))  # 写入 bytes，需要先编码
b.seek(0)  # 将指针移回开头
content = b.read()
print(content.decode('utf-8'))  # 读取 bytes 后需要解码
```

## 文件和目录操作

### 环境变量

Python 的 `os` 模块提供了 `environ` 字典来访问环境变量。例如：

```python
import os
print(os.environ['HOME'])  # 获取 HOME 环境变量
```

设置环境变量可以直接修改 `environ` 字典：

```python
import os
os.environ['MY_VAR'] = 'Hello'
print(os.environ['MY_VAR'])  # 输出 Hello
```

### 操作文件和目录

操作文件和目录的函数一部分放在 `os` 模块中，一部分放在 `os.path` 模块中。

查看某个文件的绝对路径：

```python
import os
print(os.path.abspath('file.txt'))
```

查看某个路径是否存在：

```python
import os
print(os.path.exists('file.txt'))  # True 如果文件存在，否则 False
```

创建一个目录：

```python
import os
os.mkdir('mydir')
```

删掉一个目录：

```python
import os
os.rmdir('mydir')
```

使用 `os.path.join` 来拼接路径：

```python
import os
path = os.path.join('mydir', 'file.txt')
print(path)  # 输出 mydir/file.txt
```

使用 `os.path.split` 来分割路径：

```python
import os
dir_name, file_name = os.path.split('/path/to/file.txt')
print(dir_name)  # 输出 /path/to
print(file_name)  # 输出 file.txt
```

获取文件拓展名：

```python
import os
name, ext = os.path.splitext('file.txt')
print(name)  # 输出 file
print(ext)   # 输出 .txt
```

文件重命名：

```python
import os
os.rename('old_name.txt', 'new_name.txt')
```

删除一个文件：

```python
import os
os.remove('file.txt')
```

复制文件需要使用 `shutil` 模块：

```python
import shutil
shutil.copyfile('source.txt', 'destination.txt')
```

这个模块还有很多其他函数，例如复制目录、移动文件等，可以参考[官方文档](https://docs.python.org/3/library/shutil.html)。

遍历一个目录下的所有文件和子目录，以及子目录下的文件和子目录，可以使用 `os.walk()` 函数：

```python
import os
for dirpath, dirnames, filenames in os.walk('mydir'):
    print(f"Directory: {dirpath}")
    print(f"Subdirectories: {dirnames}")
    print(f"Files: {filenames}")
```

## 序列化

有时候需要将一个 Python 对象转换为字符串或者二进制数据，以便保存到文件或者通过网络传输，这个过程叫做序列化。Python 提供了 `pickle` 模块来实现对象的序列化和反序列化。

例如，将一个 `Stuydent` 对象序列化并存入文件，使用 `pickle.dump` 或者 `pickle.dumps`，前者可以直接将序列化后的内容写入到 file-like 对象中，后者则返回 bytes：

```python
import pickle
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
student = Student('Alice', 20)
with open('student.pkl', 'wb') as f:
    pickle.dump(student, f)
```

要想反序列化一个对象，可以使用 `pickle.load` 或者 `pickle.loads`，前者从 file-like 对象中读取序列化内容并返回对象，后者则从 bytes 中读取：

```python
import pickle
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

with open('student.pkl', 'rb') as f:
    student = pickle.load(f)
print(student.name)  # 输出 Alice
print(student.age)   # 输出 20
```

## JSON

Python 内置了 `json` 模块来处理 JSON 数据。

要想将一个对象转换为 JSON 字符串，可以使用 `json.dumps()` 或者 `json.dump()`，前者返回一个 JSON 字符串，后者则将 JSON 字符串写入到 file-like 对象中：

```python
import json
data = {'name': 'Alice', 'age': 20}
json_str = json.dumps(data)
print(json_str)  # 输出 {"name": "Alice", "age": 20}
with open('data.json', 'w') as f:
    json.dump(data, f)
```

要想从 JSON 字符串或者文件中读取数据，可以使用 `json.loads()` 或者 `json.load()`，前者从 JSON 字符串中读取数据，后者则从 file-like 对象中读取：

```python
import json
json_str = '{"name": "Alice", "age": 20}'
data = json.loads(json_str)
print(data['name'])  # 输出 Alice
print(data['age'])   # 输出 20
with open('data.json', 'r') as f:
    data = json.load(f)
print(data['name'])  # 输出 Alice
print(data['age'])   # 输出 20
```

很多时候需要序列化的是一个自定义对象，很容易写出下面的代码：

```python
import json
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
student = Student('Alice', 20)
json_str = json.dumps(student)
print(json_str)
```

但是上面的代码会抛出 `TypeError: Object of type Student is not JSON serializable` 错误，因为 `json` 模块不知道如何将 `Student` 对象转换为 JSON 字符串。

为了解决这个问题，可以在 `json.dumps()` 中传入一个 `default` 参数，这个参数是一个函数，用来指定如何将无法序列化的对象转换为可序列化的对象。例如：

```python
import json
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
student = Student('Alice', 20)
def student_to_dict(obj):
    if isinstance(obj, Student):
        return {'name': obj.name, 'age': obj.age}
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
json_str = json.dumps(student, default=student_to_dict)
print(json_str)  # 输出 {"name": "Alice", "age": 20}
```

或者更偷懒一点：

```python
import json
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
student = Student('Alice', 20)
json_str = json.dumps(student, default=lambda obj: obj.__dict__)
print(json_str)  # 输出 {"name": "Alice", "age": 20}
```

class 通常都会有一个 `__dict__` 属性，这个属性是一个字典，包含了对象的所有属性和属性值，因此可以直接使用 `obj.__dict__` 来将对象转换为一个字典，从而实现 JSON 序列化。但是定义了 `__slots__` 的类可能没有 `__dict__` 属性，这时候就需要自己实现一个函数来将对象转换为字典。
