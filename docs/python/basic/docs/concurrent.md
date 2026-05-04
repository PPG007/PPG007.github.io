# 并发编程

## 多进程

在 Unix/Linux 中，操作系统提供了一个 `fork()` 系统调用，这个函数调用一次将会返回两次，操作系统会将当前进程（父进程）复制一份（子进程），然后分别在父进程和子进程中返回不同的值。父进程中返回子进程的 PID，而子进程中返回 0。这样做的理由是一个父进程可能会创建多个子进程，所以父进程需要记录每个子进程的 PID 来进行管理；而子进程只要通过 `getppid()` 就能获取到父进程的 PID。

创建子进程：

```python
import os
print('Process (%s) start...' % os.getpid())
pid = os.fork()
if pid == 0:
    print('I am child process (%s) and my parent is %s.' % (os.getpid(), os.getppid()))
else:
    print('I (%s) just created a child process (%s).' % (os.getpid(), pid))
```

由于 Windows 没有 `fork()` 调用，所以 Python 的 `multiprocessing` 模块提供了一个跨平台的多进程 API 来实现多进程编程。`multiprocessing` 模块提供了一个 `Process` 类来创建和管理子进程。

创建一个子进程并等待它结束：

```python
from multiprocessing import Process
import os

def run_proc(name):
    print('Run child process %s (%s)...' % (name, os.getpid()))

if __name__ == '__main__':
    print('Parent process %s.' % os.getpid())
    p = Process(target=run_proc, args=('test',))
    print('Child process will start.')
    p.start()
    p.join()
    print('Child process end.')
```

### 进程池

如果需要创建大量子进程，可以用进程池的方式批量创建子进程：

```python
from multiprocessing import Pool
import os, time, random

def long_time_task(name):
    print('Run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print('Task %s runs %0.2f seconds.' % (name, (end - start)))

if __name__ == '__main__':
    print('Parent process %s.' % os.getpid())
    p = Pool(4)
    for i in range(5):
        p.apply_async(long_time_task, args=(i,))
    print('Waiting for all subprocesses done...')
    p.close()
    p.join()
    print('All subprocesses done.')
```

进程池的默认大小是 CPU 的核数，如果不指定，`Pool()` 会自动根据系统的 CPU 核数来创建相应数量的进程。

### 进程通信

如果需要控制子进程的输入和输出，可以使用 `subprocess` 模块，例如：

```python
import subprocess

print('$ nslookup www.python.org')
r = subprocess.call(['nslookup', 'www.python.org'])
print('Exit code:', r)
```

如果子进程需要输入，可以通过 `communicate()` 方法输入：

```python
import subprocess

print('$ nslookup')
p = subprocess.Popen(['nslookup'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
output, err = p.communicate(b'set q=mx\npython.org\nexit\n')
print('Exit code:', p.returncode)
print('Output:', output.decode('utf-8'))
print('Error:', err.decode('utf-8'))
```

进程之间一般都需要通信，`multiprocessing` 模块提供了 `Queue`、`Pipes` 等多种方式来交换数据。

使用 `Queue` 进行进程间通信：

```python
from multiprocessing import Process, Queue
import os, time, random

def write(q):
    print('Process to write: %s' % os.getpid())
    for value in ['A', 'B', 'C']:
        print('Put %s to queue...' % value)
        q.put(value)
        time.sleep(random.random())

def read(q):
    print('Process to read: %s' % os.getpid())
    while True:
        value = q.get(True)
        print('Get %s from queue.' % value)

if __name__ == '__main__':
    q = Queue()
    pw = Process(target=write, args=(q,))
    pr = Process(target=read, args=(q,))
    pw.start()
    pr.start()
    pw.join()
    pr.terminate()
```

使用 `Pipes` 进行进程间通信：

```python
from multiprocessing import Process, Pipe

def f(conn):
    conn.send([42, None, 'hello'])
    conn.close()

if __name__ == '__main__':
    parent_conn, child_conn = Pipe()
    p = Process(target=f, args=(child_conn,))
    p.start()
    print(parent_conn.recv())   # prints "[42, None, 'hello']"
    p.join()
```

## 多线程

Python 的 `threading` 模块提供了对线程的支持。创建一个线程就是把一个函数传入并创建 `Thread` 实例，然后调用 `start()` 方法开始执行：

```python
import time, threading

def loop():
    print('thread %s is running...' % threading.current_thread().name)
    n = 0
    while n < 5:
        n = n + 1
        print('thread %s >>> %s' % (threading.current_thread().name, n))
        time.sleep(1)
    print('thread %s ended.' % threading.current_thread().name)

print('thread %s is running...' % threading.current_thread().name)
t = threading.Thread(target=loop, name='LoopThread')
t.start()
t.join()
print('thread %s ended.' % threading.current_thread().name)
```

其中，`current_thread()` 方法永远返回当前线程的实例。主线程也是一个线程，所以主线程也有名字，默认为 `MainThread`。

### Lock

多线程和多进程之间最大的不同就是线程之间共享内存，而进程之间不共享内存。由于线程共享内存，所以任何一个线程修改了某个变量，其他线程都可以看到修改后的值。这种共享虽然方便，但也带来了问题，如果多个线程同时修改一个变量，就可能把这个变量弄乱了。

为了解决这个问题，Python 的 `threading` 模块提供了一个 `Lock` 锁，来保证某段代码只能由一个线程执行：

```python
import threading

balance = 0
lock = threading.Lock()

def change_it(n):
    global balance
    balance = balance + n
    balance = balance - n

def run_thread(n):
  for i in range(100000):
    lock.acquire()
    change_it(n)
    lock.release()

t1 = threading.Thread(target=run_thread, args=(5,))
t2 = threading.Thread(target=run_thread, args=(8,))
t1.start()
t2.start()
t1.join()
t2.join()
print(balance)
```

其中，`global` 关键字表示修改全局变量 `balance`，`lock.acquire()` 获取锁，`lock.release()` 释放锁。

锁在用完后一定要释放，否则其他线程就无法获得锁了。通常使用 `try...finally` 来确保锁一定会被释放。

### 线程池

如果要创建大量线程，可以使用线程池的方式批量创建线程，Python 3.2 之后提供了 `concurrent.futures` 模块，它提供了一个 `ThreadPoolExecutor` 类来创建线程池：

```python
from concurrent.futures import ThreadPoolExecutor, wait
import time, random

def task(name):
  print('Task %s is running...' % name)
  time.sleep(random.random() * 3)
  print('Task %s is done.' % name)

if __name__ == '__main__':
  tasks = []
  with ThreadPoolExecutor(max_workers=4) as pool:
    for i in range(10):
      tasks.append(pool.submit(task, i))
    wait(tasks)
  print('All tasks are done.')
```

由于线程池在使用完毕后需要关闭，因此这里使用了 `with` 语句来自动管理线程池的生命周期，`max_workers` 参数指定线程池的最大线程数，默认为 CPU 的核数。

使用 `wait` 方法可以等待所有线程执行完毕，同时可以传入 `return_when` 参数来指定等待条件，例如 `FIRST_COMPLETED` 表示只要有一个线程完成就返回，`FIRST_EXCEPTION` 表示只要有一个线程抛出异常就返回，`ALL_COMPLETED` 表示所有线程都完成才返回。

调用 `submit` 方法提交一个任务到线程池，返回一个 `Future` 对象，可以通过 `Future` 对象的 `result()` 方法获取任务的返回值，如果任务抛出异常，调用 `result()` 方法会重新抛出这个异常，例如：

```python
from concurrent.futures import ThreadPoolExecutor, wait
import time, random

def task(name):
  print('Task %s is running...' % name)
  time.sleep(random.random() * 3)
  print('Task %s is done.' % name)
  return name * 2

if __name__ == '__main__':
  tasks = []
  with ThreadPoolExecutor(max_workers=4) as pool:
    for i in range(10):
      tasks.append(pool.submit(task, i))
    wait(tasks)
  print('Results:', [t.result() for t in tasks])
  print('All tasks are done.')
```

除了 `submit` 方法，线程池还提供了 `map` 方法来批量提交任务，这个方法的返回结果的顺序和传入的元素顺序是相同的，即使后面的元素可能处理的更快，也是要等到前面的元素处理完毕才会添加到结果中：

```python
from concurrent.futures import ThreadPoolExecutor, wait
import time, random

def task(name):
  print('Task %s is running...' % name)
  time.sleep(random.random() * 3)
  print('Task %s is done.' % name)
  return name * 2

if __name__ == '__main__':
  with ThreadPoolExecutor(max_workers=4) as pool:
    results = pool.map(task, ['A', 'B', 'C', 'D'])
  print('Results: %s' % list(results))
```

### GIL

Python 的全局解释器锁（Global Interpreter Lock，GIL）是一个互斥锁，保护着 Python 解释器中的全局状态，确保同一时刻只有一个线程在执行 Python 字节码。这意味着即使在多线程环境中，Python 也无法利用多核 CPU 的优势来提高性能。

但是在 Python 3.13 之后，官方的解释器实现（CPython）提供了 free-threading 版本，移除了 GIL，使得多线程能够真正并行执行。这对于 CPU 密集型任务来说是一个重大改进，可以显著提升性能。

可以通过如下方式查看当前的 Python 版本是否支持 free-threading：

```python
import sys
print(sys.version)
print(sys._is_gil_enabled()) # 如果返回 False，说明 GIL 已经被移除，支持真正的多线程并行执行。
```

## ThreadLocal

这里和 Java 的 ThreadLocal 类似，ThreadLocal 解决了线程之间共享数据的问题。每个线程都可以通过 ThreadLocal 存储自己的数据，互不干扰。

```python
import threading

local_school = threading.local()

def process_student():
    std = local_school.student
    print('Hello, %s (in %s)' % (std, threading.current_thread().name))

def process_thread(name):
    local_school.student = name
    process_student()

t1 = threading.Thread(target=process_thread, args=('Alice',), name='Thread-A')
t2 = threading.Thread(target=process_thread, args=('Bob',), name='Thread-B')
t1.start()
t2.start()
t1.join()
t2.join()
```

## 分布式进程

Python 中的 `multiprocessing` 模块的子模块 `managers` 可以将多进程分布到多台机器上，依靠网络通信来实现进程间的通信。`managers` 模块提供了一个 `BaseManager` 类来创建一个分布式进程管理器，允许在不同机器上的进程共享数据。

例如，实现一个使用远程机器计算 `[start, end]` 范围内所有整数的和：

::: code-tabs#process

@tab local.py

```python
from multiprocessing.managers import BaseManager

class RemoteManager(BaseManager):
    pass

RemoteManager.register('sum')

def main():
    manager = RemoteManager(address=('127.0.0.1', 50000), authkey=b'abc')
    manager.connect()
    sum_func = manager.sum
    start = 1
    end = 100
    result = sum_func(start, end)
    print(f"Sum from {start} to {end} is: {result}")

if __name__ == '__main__':
    main()
```

@tab remote.py

```python
from multiprocessing.managers import BaseManager

def sum_range(start, end):
    """Calculate the sum of integers from start to end (inclusive)."""
    return sum(range(start, end + 1))

class RemoteManager(BaseManager):
    pass

RemoteManager.register('sum', callable=sum_range)

def main():
    manager = RemoteManager(address=('', 50000), authkey=b'abc')
    server = manager.get_server()
    print("RemoteManager server started on port 50000...")
    server.serve_forever()

if __name__ == '__main__':
    main()
```

:::

从上面的代码中可以看到，要想实现分布式进程，需要首先创建一个自定义的 `BaseManager` 子类，同时调用类方法 `register()` 来注册一个函数，对于 `local.py` 来说，由于不知道 `sum` 的具体实现，所以只是注册了一个名字；而对于 `remote.py` 来说，除了名字外，还注册了一个具体的函数实现。

在注册完函数后，`remote.py` 需要首先构造一个 `RemoteManager` 的实例，并且设置监听 IP、端口，同时指定一个认证密钥，最后调用 `get_server()` 方法来获取一个服务器对象，调用 `serve_forever()` 方法来启动服务器。

`local.py` 同样需要构造一个 `RemoteManager` 的实例，并且设置服务器的 IP、端口和认证密钥，调用 `connect()` 方法连接到服务器，最后通过 `manager.sum` 获取到远程函数的调用对象，调用这个对象就可以执行远程函数了。

## 协程

Python 中协程是通过 generator 实现的，前面已经提过，在 generator 中，不但也可通过 `for` 循环来迭代，还可以不断调用 `next()` 来获取由 `yield` 语句返回的下一个值。Python 的 `yield` 不仅可以返回一个值，还可以接收调用者发出的参数。我们把 `yield` 语句看成是一个双向通道，既可以通过它向外返回数据，也可以通过它接收调用者传入的数据。

例如，使用 `yield` 实现一个生产者-消费者模型：

```python
def consumer():
  r = ''
  while True:
    n = yield r
    if not n:
      return
    print('[CONSUMER] Consuming %s...' % n)
    r = '200 OK'

def produce(c):
  c.send(None)
  n = 0
  while n < 5:
    n = n + 1
    print('[PRODUCER] Producing %s...' % n)
    r = c.send(n)
    print('[PRODUCER] Consumer return: %s' % r)
  c.close()

c = consumer()
produce(c)
```

上面代码的流程如下：

1. 首先调用 `produce()` 函数，传入一个 `consumer` 生成器对象 `c`。
2. 在 `produce()` 函数中，首先调用 `c.send(None)` 来启动 `consumer` 生成器，执行到第一个 `yield` 语句处暂停，并且 `yield` 返回 `None`。
3. 接着进入一个循环，每次循环中，生产者生成一个新的数据 `n`，然后调用 `c.send(n)` 将这个数据发送给 `consumer` 生成器，`consumer` 生成器接收到这个数据后继续执行，打印出消费的内容，并且通过 `yield` 返回一个结果 `r`。
4. 生产者接收到消费者返回的结果后，继续下一轮循环，直到生产完 5 个数据后，调用 `c.close()` 来关闭生成器。

## asyncio

Python 3.4 引入了 `asyncio` 模块来支持异步 I/O 操作，提供了一个事件循环来管理和调度异步任务。用 `@asyncio.coroutine` 可以把一个 generator 标记为 coroutine，然后在 coroutine 内部使用 `yield from` 来调用另一个 coroutine，从而实现异步调用。

Python 3.5 引入了 `async` 和 `await` 关键字，使得编写异步代码更加简洁和易读。使用 `async def` 定义一个 coroutine 函数，在函数内部使用 `await` 来调用另一个 coroutine。

例如：

```python
import asyncio

async def hello():
    print('Hello world!')
    await asyncio.sleep(1)
    print('Hello again!')

asyncio.run(hello())
```

当使用 `await` 时，当前 coroutine 会被挂起，直到 `await` 后面的 coroutine 执行完成后才会继续执行。主线程将会继续执行其他任务，直到事件循环中没有任何任务需要执行时才会退出。

使用 `asyncio.gather()` 可以同时运行多个 coroutine：

```python
import asyncio

async def task(name):
    print(f'Task {name} is running...')
    await asyncio.sleep(1)
    print(f'Task {name} is done.')

async def main():
    await asyncio.gather(task('A'), task('B'), task('C'))

asyncio.run(main())
```

### asyncio http

基于 `asyncio` 的特点，可以用来编写高性能的网络服务，例如使用 `aiohttp` 库来实现一个简单的 HTTP 服务器：

```shell
pip install aiohttp
```

```python
from aiohttp import web

async def handle(request):
  name = request.match_info.get('name', "Anonymous")
  text = "Hello, " + name
  return web.Response(text=text)

app = web.Application()
app.add_routes([
  web.get('/', handle),
  web.get('/{name}', handle)
])

if __name__ == '__main__':
  web.run_app(app, port=8080)
```
