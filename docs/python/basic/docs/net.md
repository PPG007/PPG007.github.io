# 网络编程

## TCP

### 客户端

Python 中，可以使用 `socket` 模块来进行 TCP 网络编程。以下是一个简单的 TCP 客户端示例：

```python
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

s.connect(('localhost', 12345))

s.send(b'Hello, Server!')

buffer = []

while True:
    data = s.recv(1024)
    if not data:
        break
    buffer.append(data)
print(b''.join(buffer).decode('utf-8'))
s.close()
```

上面的代码中，通过 `socket()` 方法创建了一个 TCP 套接字，其中第一个参数 `AF_INET` 表示使用 IPv4 协议，第二个参数 `SOCK_STREAM` 表示使用 TCP 协议。然后通过 `connect()` 方法连接到服务器，发送数据后通过 `recv()` 方法接收服务器的响应，最后关闭套接字。

### 服务端

服务端要稍微复杂一些：

```python
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 12345))
s.listen(10)

while True:
    conn, addr = s.accept()
    print(f'Connected by {addr}')
    data = conn.recv(1024)
    if not data:
        break
    print(f'Received: {data.decode("utf-8")}')
    response = b'Hello, Client!'
    conn.sendall(response)
    conn.close()
```

上面的代码中，服务端首先创建一个 TCP 套接字，并通过 `bind()` 方法绑定到指定的地址和端口。然后通过 `listen()` 方法开始监听连接请求并且设置等待连接的最大数量。每当有客户端连接时，`accept()` 方法会返回一个新的套接字对象和客户端的地址。服务端可以通过这个新的套接字对象与客户端进行通信，接收数据并发送响应。

一般来说每个请求都应该在一个新的线程中处理，以避免阻塞主线程：

```python
import socket
from concurrent.futures import ThreadPoolExecutor

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 12345))
s.listen(10)
pool = ThreadPoolExecutor(max_workers=10)

def handle_connection(conn, addr):
    print(f'Connected by {addr}')
    data = conn.recv(1024)
    if not data:
        return
    print(f'Received: {data.decode("utf-8")}')
    response = b'Hello, Client!'
    conn.sendall(response)
    conn.close()

while True:
    conn, addr = s.accept()
    pool.submit(handle_connection, conn, addr)

pool.shutdown()
```

## UDP

UDP 要更简单一些，只要将 `SOCK_STREAM` 替换为 `SOCK_DGRAM` 即可：

::: code-tabs@udp

@tab server.py

```python
import socket
from concurrent.futures import ThreadPoolExecutor

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(('localhost', 12345))

while True:
    data, addr = s.recvfrom(1024)
    print(f'Received {data.decode("utf-8")} from {addr}')
    response = b'Hello, Client!'
    s.sendto(response, addr)
```

@tab client.py

```python
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

s.sendto(b'Hello, Server!', ('localhost', 12345))

print(s.recv(1024).decode('utf-8'))

s.close()
```

:::

## WSGI

WSGI（Web Server Gateway Interface）是 Python Web 应用程序和 Web 服务器之间的一种接口规范。它定义了一个简单的调用约定，使得不同的 Web 服务器和 Web 应用程序能够互相兼容。

在 WSGI 中，Web 服务器会调用一个可调用对象（通常是一个函数）来处理 HTTP 请求。这个可调用对象接受两个参数：一个环境字典（environ）和一个回调函数（start_response）。环境字典包含了请求的各种信息，而回调函数用于发送 HTTP 响应的状态码和头部信息。

WSGI 中，协议部分的处理由支持 WSGI 的 Web 服务器负责，而应用程序部分的处理由开发者编写的 WSGI 应用程序负责。这种分离使得开发者可以专注于编写应用程序逻辑，而不需要关心底层的网络通信细节。

例如编写一个 WSGI 的 Hello World 应用程序：

```python
def application(environ, start_response):
    status = '200 OK'
    headers = [('Content-Type', 'text/plain')]
    start_response(status, headers)
    return [b'Hello, World!']
```

定义好函数后，需要使用一个支持 WSGI 的服务器来运行这个应用程序，这里直接使用 Python 的内置模块 `wsgiref`：

```python
from wsgiref.simple_server import make_server
from main import application

httpd = make_server('localhost', 8000, application)
print("Serving on port 8000...")
httpd.serve_forever()
```

上面的代码中，`make_server()` 函数创建了一个 WSGI 服务器，并将 `application` 函数作为处理请求的应用程序。服务器监听在 `localhost` 的 8000 端口上，并通过 `serve_forever()` 方法开始处理请求。
