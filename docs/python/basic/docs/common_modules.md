# 常用模块

## datetime

获取当前时间：

```python
from datetime import datetime
now = datetime.now()
print(now)
```

获取指定日期和时间：

```python
from datetime import datetime
dt = datetime(2020, 5, 17, 10, 30, 0)
print(dt)
```

将 datetime 类型转为时间戳：

```python
from datetime import datetime
dt = datetime(2020, 5, 17, 10, 30, 0)
timestamp = dt.timestamp()
print(timestamp)
```

这个时间戳是一个浮点数，其中的整数部分表示秒。

同样可以将时间戳转为 datetime：

```python
from datetime import datetime
timestamp = 1589711400.0
dt = datetime.fromtimestamp(timestamp)
print(dt)
```

由于时间戳没有时区概念，因此上面的代码是将时间戳解析到本地时区。如果要解析到 UTC 时区，可以使用 `utcfromtimestamp()` 方法：

```python
from datetime import datetime
timestamp = 1589711400.0
dt = datetime.utcfromtimestamp(timestamp)
print(dt)
```

或者将一个 datetime 对象转换到任意时区：

```python
from datetime import datetime, timezone, timedelta
dt = datetime(2020, 5, 17, 10, 30, 0)
tz_utc_8 = timezone(timedelta(hours=8))
dt_utc_8 = dt.astimezone(tz_utc_8)
print(dt_utc_8)
```

上面的代码通过构造时区偏移量构造了一个 UTC+8:00 的时区对象，然后通过 `astimezone()` 方法将 datetime 对象转换到这个时区。

将 str 转为 datetime：

```python
from datetime import datetime
dt_str = '2020-05-17 10:30:00'
dt = datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
print(dt)
```

可用的占位符可以参考[官方文档](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes)。

注意这种转换后的 datetime 对象是没有时区信息的。

同样可以将 datetime 转为 str：

```python
from datetime import datetime
dt = datetime(2020, 5, 17, 10, 30, 0)
dt_str = dt.strftime('%Y-%m-%d %H:%M:%S')
print(dt_str)
```

datetime 还可以进行加减运算，加减可以直接使用 `+` 和 `-` 运算符（因为 datetime 类型通过 `__add__()` 和 `__sub__()` 方法实现了加减运算），可以使用 `timedelta` 类型来进行加减：

```python
from datetime import datetime, timedelta
dt = datetime(2020, 5, 17, 10, 30, 0)
dt_plus_1_day = dt + timedelta(days=1)
print(dt_plus_1_day)
dt_minus_1_hour = dt - timedelta(hours=1)
print(dt_minus_1_hour)
```

## collections

`collections` 是 Python 内建的一个集合模块，提供了很多集合类。

### namedtuple

`namedtuple` 是一个工厂函数，用于创建一个带字段名的元组子类。使用 `namedtuple` 可以让代码更具可读性。

例如，我们可以使用 `namedtuple` 来定义一个表示点的类：

```python
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(1, 2)
print(p)  # 输出: Point(x=1, y=2)
print(p.x)  # 输出: 1
print(p.y)  # 输出: 2
print(isinstance(p, Point))  # 输出: True
print(isinstance(p, tuple))  # 输出: True
```

### deque

`deque` 是一个双端队列，可以在两端快速地添加和删除元素。相比于列表，`deque` 在头部添加和删除元素的效率更高。

```python
from collections import deque
d = deque([1, 2, 3])
d.append(4)  # 在右侧添加元素
print(d)  # 输出: deque([1, 2, 3, 4])
d.appendleft(0)  # 在左侧添加元素
print(d)  # 输出: deque([0, 1, 2, 3, 4])
d.pop()  # 从右侧删除元素
print(d)  # 输出: deque([0, 1, 2, 3])
d.popleft()  # 从左侧删除元素
print(d)  # 输出: deque([1, 2, 3])
```

### defaultdict

使用 `dict` 来存储数据时，如果访问一个不存在的键会抛出 `KeyError` 异常。而 `defaultdict` 可以在访问一个不存在的键时返回一个默认值。

```python
from collections import defaultdict
d = defaultdict(lambda: 'N/A')  # 默认值为 'N/A'
d['key1'] = 'value1'
print(d['key1'])  # 输出: value1
print(d['key2'])  # 输出: N/A
```

### OrderedDict

使用 `dict` 来存储数据时，键值对的顺序是不确定的。而 `OrderedDict` 可以保持键值对的插入顺序。

```python
from collections import OrderedDict
od = OrderedDict([('key1', 'value1'), ('key2', 'value2'), ('key3', 'value3')])
print(od)  # 输出: OrderedDict([('key1', 'value1'), ('key2', 'value2'), ('key3', 'value3')])
print(list(od.keys()))  # 输出: ['key1', 'key2', 'key3']
```

需要注意，OrderedDict 是按照插入的顺序来对 key 排序，而不是按照 key 的值来排序。

### ChainMap

`ChainMap` 可以将多个字典或者映射对象组合成一个单一的映射对象。当访问一个键时，`ChainMap` 会按照顺序在各个映射对象中查找，直到找到为止。

```python
from collections import ChainMap

dict1 = {'key1': 'value1', 'key2': 'value2'}
dict2 = {'key2': 'value3', 'key3': 'value4'}

chain = ChainMap(dict1, dict2)
print(chain['key1'])  # 输出: value1
print(chain['key2'])  # 输出: value2
print(chain['key3'])  # 输出: value4
```

当访问多个 dict 中都有的 key 时，`ChainMap` 会返回第一个 dict 中的 value。

### Counter

`Counter` 是一个计数器，用于统计可哈希对象的数量。它是一个字典的子类，键是可哈希对象，值是该对象出现的次数。

```python
from collections import Counter
c = Counter('hello world')
print(c)  # 输出: Counter({'l': 3, 'o': 2, 'h': 1, 'e': 1, ' ': 1, 'w': 1, 'r': 1, 'd': 1})
c.update('hello')
print(c)  # 输出: Counter({'l': 5, 'o': 3, 'h': 2, 'e': 2, ' ': 1, 'w': 1, 'r': 1, 'd': 1})
```

## argparse

Python 中的命令行参数都保存在 `sys.argv` 中，可以从中解析出需要的参数：

```python
import sys
print(sys.argv)
```

但是直接使用 `sys.argv` 来解析命令行参数比较麻烦，Python 内置的 `argparse` 模块提供了一个更方便的方式来解析命令行参数。

例如，定义一个数据库迁移的命令行工具：

```python
import argparse

def main():
    parser = argparse.ArgumentParser(description='Database migration tool')
    parser.add_argument('source', help='Source database URL')
    parser.add_argument('destination', help='Destination database URL')
    parser.add_argument('--batch-size', type=int, default=1000, help='Batch size for migration')
    args = parser.parse_args()

    print(f'Source: {args.source}')
    print(f'Destination: {args.destination}')
    print(f'Batch size: {args.batch_size}')

if __name__ == '__main__':
    main()
```

运行上面的代码：

```bash
python migrate.py mysql://localhost/source_db mysql://localhost/destination_db --batch-size 500
```

## base64

Python 内置的 `base64` 模块提供了 Base64 编码和解码的功能。Base64 是一种常用的编码方式，可以将二进制数据转换为 ASCII 字符串，常用于在网络上传输二进制数据。

下面是一些使用 `base64` 模块的示例：

```python
import base64

# 编码
data = b'Hello, World!'  # 二进制数据
encoded_data = base64.b64encode(data)  # Base64 编码
print(encoded_data)  # 输出: b'SGVsbG8sIFdvcmxkIQ=='

# 解码
decoded_data = base64.b64decode(encoded_data)  # Base64 解码
print(decoded_data)  # 输出: b'Hello, World!'
```

## struct

`struct` 模块提供了将 Python 值转换为 C 语言结构体表示的字节流，以及将字节流转换回 Python 值的功能。它可以用于处理二进制数据，例如网络协议、文件格式等。

下面是一些使用 `struct` 模块的示例：

```python
import struct

# 将整数和字符串打包成二进制数据
data = struct.pack('i5s', 42, b'Hello')
print(data)  # 输出: b'*\x00\x00\x00Hello'
# 将二进制数据解包成整数和字符串
unpacked_data = struct.unpack('i5s', data)
print(unpacked_data)  # 输出: (42, b'Hello')
```

其中，`'i5s'` 是一个格式字符串，表示一个整数和一个长度为 5 的字符串。`pack()` 函数将 Python 值打包成二进制数据，`unpack()` 函数将二进制数据解包成 Python 值。

具体的格式字符串可以参考[官方文档](https://docs.python.org/3/library/struct.html#format-characters)。

## hashlib

`hashlib` 模块提供了常见的哈希算法，例如 MD5、SHA1、SHA256 等。哈希算法可以将任意长度的数据映射为固定长度的哈希值，常用于数据校验、密码存储等场景。

例如，计算一个字符串的 MD5 哈希值：

```python
import hashlib
data = 'Hello, World!'
md5_hash = hashlib.md5(data.encode('utf-8')).hexdigest()
print(md5_hash)
```

如果要计算大文件的哈希值，可以使用 `update()` 方法来分块计算：

```python
import hashlib

def calculate_md5(file_path):
    md5 = hashlib.md5()
    with open(file_path, 'rb') as f:
        while True:
            chunk = f.read(8192)  # 每次读取 8KB
            if not chunk:
                break
            md5.update(chunk)
    return md5.hexdigest()

file_path = 'large_file.txt'
md5_hash = calculate_md5(file_path)
print(md5_hash)
```

除了 md5 之外，sha1 等其他哈希算法的用法和上面类似，只需要将 `hashlib.md5()` 替换为对应的哈希算法函数即可，例如 `hashlib.sha1()`、`hashlib.sha256()` 等。

## hmac

Hmac 模块提供了基于密钥的消息认证码（HMAC）的功能。HMAC 是一种使用密钥进行哈希计算的算法，可以用于验证数据的完整性和真实性。

例如，使用 md5 哈希算法计算一个消息的 HMAC：

```python
import hmac

key = b'secret_key'  # 密钥必须是字节类型
message = b'Hello, World!'  # 消息也必须是字节类型
hmac_md5 = hmac.new(key, message, digestmod='md5')
print(hmac_md5.hexdigest())
```

## itertools

`itertools` 模块提供了很多用于操作迭代对象的函数。

首先是几个无限迭代器：

```python
import itertools

# count() 函数会创建一个无限迭代器，生成从 start 开始的整数序列
for i in itertools.count(1):
    print(i)
    if i >= 5:
        break

# cycle() 函数会创建一个无限迭代器，循环遍历一个可迭代对象
for item in itertools.cycle('ABC'):
    print(item)
    if item == 'C':
        break

# repeat() 函数会创建一个无限迭代器，重复一个对象
# 通过第二个参数来指定重复的次数
for item in itertools.repeat('Hello', 3):
    print(item)
```

无限序列只有在 `for` 迭代时才会无限地迭代下去，而且可以通过 `takewhile()` 等函数根据条件判断截取出一个有限的序列：

```python
import itertools

# takewhile() 函数会创建一个迭代器，直到条件不满足时停止
for item in itertools.takewhile(lambda x: x < 5, itertools.count(1)):
    print(item)
```

`chain()` 函数可以将多个可迭代对象连接成一个迭代器：

```python
import itertools

# chain() 函数会将多个可迭代对象连接成一个迭代器
for item in itertools.chain('ABC', 'DEF'):
    print(item)
```

`groupby()` 函数可以将一个可迭代对象中的连续相同元素分组：

```python
import itertools

# groupby() 函数会将一个可迭代对象中的连续相同元素分组
for key, group in itertools.groupby('AAABBBCCDAA'):
    print(key, list(group))
```

只要作用于函数的两个元素返回的值相等，那么它们就会被分到同一组中。

通过传入第二个参数可以自定义比较函数，例如奇数偶数分组：

```python
import itertools

numbers = list(itertools.takewhile(lambda x: x < 100, itertools.count(1)))
grouped = itertools.groupby(numbers, key=lambda x: x % 2)
for key, group in grouped:
    print(key, list(group))
```

## contextlib

在读写文件时，可以使用 Python 的 `with` 语句来自动管理资源，实际上，任何实现了上下文管理的类都可以使用 `with` 语句。

实现上下文管理是通过 `__enter__` 和 `__exit__` 方法来实现的，例如：

```python
class MyContext:
    def __enter__(self):
        print('Entering context')
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print('Exiting context')

with MyContext() as ctx:
    print('Inside context')
```

编写 `__enter__` 和 `__exit__` 仍然比较繁琐，因此 Python 的 `contextlib` 模块提供了一个更简单的方式来创建上下文管理器。

`@contextmanager` 装饰器可以将一个生成器函数转换为一个上下文管理器，用 `yield` 语句把 `with ... as var` 变量输出出去，然后 `with` 语句就能够正常地使用这个上下文管理器了：

```python
from contextlib import contextmanager

class MyContext:
    def __init__(self, name):
        self.name = name
    def query(self):
        print(f'Querying {self.name}...')

@contextmanager
def create_query(name):
    print('Creating context...')
    ctx = MyContext(name)
    yield ctx
    print('Cleaning up context...')

with create_query('test') as q:
    q.query()
```

上面的代码中，`create_query()` 函数是一个生成器函数，使用 `@contextmanager` 装饰器将其转换为一个上下文管理器。在 `with` 语句中，`create_query('test')` 会调用 `create_query()` 函数，并且在 `yield` 语句处将 `ctx` 输出到 `q` 变量中，然后执行 `q.query()` 方法。当 `with` 语句结束时，会继续执行 `yield` 之后的代码，进行清理工作。

`yield` 也可以不带有输出值，例如：

```python
from contextlib import contextmanager

@contextmanager
def my_context():
    print('Entering context...')
    yield
    print('Exiting context...')

with my_context():
    print('Inside context...')
```

如果一个对象没有实现上下文，就不能用在 `with` 语句中，这时可以使用 `closing()` 函数将这个对象转变为上下文对象：

```python
from contextlib import closing
from urllib.request import urlopen

with closing(urlopen('https://www.python.org')) as page:
    for line in page:
        print(line)
```

`closing` 也是一个经过 `@contextmanager` 装饰的生成器函数，它会在 `yield` 之后调用对象的 `close()` 方法来关闭资源。

```python
@contextmanager
def closing(thing):
    try:
        yield thing
    finally:
        thing.close()
```

## urllib

Python 内置的 `urllib` 模块提供了很多用于处理 URL 的函数，例如发送 HTTP 请求、解析 URL 等。

例如，发送 GET 请求查询天气然后解析 JSON 数据：

```python
from urllib import request
import json
def fetch_data(url, params):
  # 构造带参数的 URL
  import urllib.parse
  query_string = urllib.parse.urlencode(params)
  full_url = url + '?' + query_string
  req = request.Request(url=full_url)
  with request.urlopen(req) as resp:
      return json.load(resp)

URL = 'https://api.weatherapi.com/v1/current.json'
data = fetch_data(URL, {
  'key': 'b4e8f86b44654e6b86885330242207',
  'q': 'Qingdao',
  'aqi': 'no'
})
print(data)
```

## venv

venv 模块提供了创建虚拟环境的功能。虚拟环境是一个独立的 Python 运行环境，可以安装不同版本的 Python 包，互不干扰。

创建虚拟环境：

```shell
python -m venv myenv
```

激活虚拟环境：

```shell
cd myenv/bin
source activate
```

对于 Windows，使用 `activate.bat` 来激活。

退出虚拟环境：

```shell
deactivate
```

## Pillow

Pillow 是一个处理图像的第三方库，可以用来打开、操作和保存各种格式的图像文件。

```shell
pip install Pillow
```

除了对图片进行缩放、添加滤镜等操作之外，Pillow 还可以用来生成验证码图片：

```python
from PIL import Image, ImageDraw, ImageFont
import random

def rndColor():
  color = (
    random.randint(0, 255),
    random.randint(0, 255),
    random.randint(0, 255),
  )
  return color

def generate_captcha(text, font_path, font_size):
  # 创建一个白色背景的图片
  image = Image.new('RGB', (120, 30), (255, 255, 255))
  draw = ImageDraw.Draw(image)
  # 加载字体
  font = ImageFont.truetype(font_path, font_size)
  # 逐字符绘制文本，每个字符随机颜色
  x = 10
  for char in text:
    color = rndColor()
    # 计算字符宽度
    bbox = font.getbbox(char)
    char_width = bbox[2] - bbox[0]
    draw.text((x, 5), char, font=font, fill=color)
    x += char_width
  # 添加一些干扰线
  for _ in range(5):
    x1 = random.randint(0, 120)
    y1 = random.randint(0, 30)
    x2 = random.randint(0, 120)
    y2 = random.randint(0, 30)
    draw.line(((x1, y1), (x2, y2)), fill=(0, 0, 0), width=1)
  return image

captcha = generate_captcha('ABCD', 'MesloLGS NF Regular.ttf', 24)
captcha.save('captcha.png')
```

注意上面的代码可能会报错找不到字体，需要将 `font_path` 替换为你系统中存在的字体文件路径。

## requests

`requests` 也是一个处理 HTTP 请求的第三方库，相比于 `urllib`，`requests` 的 API 更加简洁易用。

```shell
pip install requests
```

还是以查询天气为例：

```python
import requests

def fetch_data(url, params):
    response = requests.get(url, params=params)
    return response.json() # 直接解析 JSON 数据，返回 dict

URL = 'https://api.weatherapi.com/v1/current.json'
data = fetch_data(URL, {
    'key': 'b4e8f86b44654e6b86885330242207',
    'q': 'Qingdao',
    'aqi': 'no'
})
print(data)
```

## chardet

`chardet` 模块提供了字符编码检测的功能，可以用来检测文本的编码格式。

```shell
pip install chardet
```

```python
import chardet

#bytes检测
result=chardet.detect(b'Hello, world!')
print(result)

#检测GBK编码的中文
data = '离离原上草，一岁一枯荣'.encode('gbk')
print(chardet.detect(data))


#对UTF-8编码进行检测
data = '离离原上草，一岁一枯荣'.encode('utf-8')
print(chardet.detect(data))

#对日文进行检测
data = '最新の主要ニュース'.encode('euc-jp')
print(chardet.detect(data))
```

需要注意，`chardet` 返回的是尽量具体的结果，例如如果将仅包含 ASCII 字符的文本以 UTF-8 编码，那么 `chardet` 可能会将其检测为 ASCII 编码，因为 ASCII 是 UTF-8 的一个子集。

## psutil

`psutil` 是一个支持跨平台读取系统 CPU、内存、磁盘、网络等信息的库，可以用来监控系统资源的使用情况。

```shell
pip install psutil
```

```python
import psutil

# 获取 CPU 使用率
cpu_percent = psutil.cpu_percent(interval=1)
print(f'CPU 使用率: {cpu_percent}%')
# CPU 逻辑数量和物理核心数
cpu_count_logical = psutil.cpu_count(logical=True)
cpu_count_physical = psutil.cpu_count(logical=False)
print(f'CPU 逻辑数量: {cpu_count_logical}')
print(f'CPU 物理核心数: {cpu_count_physical}')
# 物理内存和交换内存的使用情况
virtual_memory = psutil.virtual_memory()
swap_memory = psutil.swap_memory()
print(f'物理内存总量: {virtual_memory.total / (1024 ** 3):.2f} GB')
print(f'物理内存使用率: {virtual_memory.percent}%')
print(f'交换内存总量: {swap_memory.total / (1024 ** 3):.2f} GB')
print(f'交换内存使用率: {swap_memory.percent}%')
# 内存空闲量
print(f'内存空闲量: {virtual_memory.available / (1024 ** 3):.2f} GB')
# 磁盘分区和使用情况
disk_partitions = psutil.disk_partitions()
for partition in disk_partitions:
    print(f'分区: {partition.device}, 挂载点: {partition.mountpoint}, 文件系统类型: {partition.fstype}')
    usage = psutil.disk_usage(partition.mountpoint)
    print(f'  总量: {usage.total / (1024 ** 3):.2f} GB, 已使用: {usage.used / (1024 ** 3):.2f} GB, 使用率: {usage.percent}%')
# 网络接口和流量
net_io_counters = psutil.net_io_counters(pernic=True)
for interface, counters in net_io_counters.items():
    print(f'接口: {interface}, 发送字节数: {counters.bytes_sent}, 接收字节数: {counters.bytes_recv}')
```
