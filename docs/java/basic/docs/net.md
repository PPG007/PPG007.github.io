# 网络编程

## TCP

### Socket

Socket 是一个抽象概念，一个程序通过 Socket 来建立一个远程连接，而 Socket 内部通过 TCP/IP 协议来实现网络通信。

一个 Socket 由 IP 地址和端口号组成，IP 地址标识了网络中的一个设备，而端口号则标识了设备上的一个特定服务。

### TCP server

要实现一个 TCP 服务器，可以使用 Java 的 `ServerSocket` 类。以下是一个简单的 TCP 服务器示例：

::: code-tabs#TCPServer

@tab Server.java

```java
public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket socket = new ServerSocket(8080);
        ExecutorService pool = Executors.newFixedThreadPool(10);
        System.out.println("server started");
        while (true) {
            Socket accepted = socket.accept();
            pool.submit(new Handler(accepted));
        }
    }
}
```

@tab Handler.java

```java
public class Handler implements Runnable{
    private final Socket socket;

    public Handler(Socket socket) {
        System.out.println("socket connected");
        this.socket = socket;
    }

    @Override
    public void run() {
        try (InputStream inputStream = this.socket.getInputStream()) {
            try (OutputStream outputStream = this.socket.getOutputStream()) {
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8));
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
                writer.write("hello, world!\n");
                writer.flush();
                while (true) {
                    String line = reader.readLine();
                    if ("exit".equals(line)) {
                        writer.write("bye\n");
                        writer.flush();
                        break;
                    }
                    writer.write("echo: " + line + "\n");
                    writer.flush();
                }
            }
        } catch (IOException e) {
            try {
                this.socket.close();
            } catch (IOException ex) {
            }
        } finally {
            System.out.println("socket disconnected");
        }
    }
}
```

:::

通过调用 `ServerSocket` 的构造方法可以在一个端口上开启监听，当有客户端连接时，`accept()` 方法会返回一个新的 `Socket` 对象，代表与客户端的连接。服务器可以使用线程池来处理多个客户端连接。

在启动上面的服务器后，可以直接使用 `telnet` 命令连接到服务器：

```bash
telnet localhost 8080
```

### TCP client

相比之下 TCP 客户端要简单得多：

```java
public class Client {
    static void main() throws IOException {
        Socket socket = new Socket("127.0.0.1", 8080);
        try (InputStream inputStream = socket.getInputStream()){
            try (OutputStream outputStream = socket.getOutputStream()){
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8));
                Scanner scanner = new Scanner(System.in);
                System.out.printf("[server]: %s\n", reader.readLine());
                while (true) {
                    System.out.print(">>> ");
                    String line = scanner.nextLine();
                    writer.write(line);
                    writer.newLine();
                    writer.flush();
                    String readLine = reader.readLine();
                    System.out.printf("<<< %s\n", readLine);
                    if ("bye".equals(readLine)) {
                        break;
                    }
                }
            }
        }
        socket.close();
    }
}
```

### Socket 流

因为 TCP 是基于流的协议，因此 Java 标准库中使用 `InputStream` 和 `OutputStream` 来处理 Socket 的输入和输出。

此外，如果不调用 `flush()` 方法，数据可能不会立即发送给对方，因为输出流可能会有缓冲区。调用 `flush()` 可以确保所有缓冲的数据都被发送出去。

## UDP

与 TCP 相比，UDP 要简单一些，因为 UDP 是无连接的协议，数据包也是一次发一个，没有流的概念。在 Java 中实现 UDP 通信仍然需要用到 `Socket`，因为 UDP 也有 IP 地址和端口号。

::: tip

同一个端口可以同时监听 TCP 和 UDP 协议。

:::

一个简单的 UDP 服务端和客户端示例如下：

::: code-tabs#UDP

@tab UDPServer.java

```java
public class UDPServer {
    static void main() throws IOException {
        DatagramSocket socket = new DatagramSocket(8080);
        while (true) {
            byte[] buffer = new byte[1024];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            socket.receive(packet);
            String string = new String(packet.getData(), packet.getOffset(), packet.getLength(), StandardCharsets.UTF_8);
            System.out.println("Server received: " + string);
            packet.setData("OK".getBytes(StandardCharsets.UTF_8));
            socket.send(packet);
        }
    }
}
```

@tab UDPClient.java

```java
public class UDPClient {
    static void main() throws IOException {
        DatagramSocket socket = new DatagramSocket();
        socket.setSoTimeout(2000);
        socket.connect(InetAddress.getLocalHost(), 8080);
        byte[] data = "Hello UDP".getBytes(StandardCharsets.UTF_8);
        DatagramPacket packet = new DatagramPacket(data, data.length);
        socket.send(packet);
        byte[] buffer = new byte[1024];
        DatagramPacket received = new DatagramPacket(buffer, buffer.length);
        socket.receive(received);
        String resp = new String(received.getData(), received.getOffset(), received.getLength(), StandardCharsets.UTF_8);
        System.out.println("Client received: " + resp);
        socket.disconnect();
        socket.close();
    }
}
```

:::

## RMI

RMI（Remote Method Invocation）是 Java 提供的一种远程调用机制，允许在不同 JVM 之间调用对象的方法。RMI 基于 TCP 协议实现，使用了 Java 的序列化机制来传输对象。

要想实现 RMI，需要服务端和客户端共享一个接口，例如：

```java
public interface RMIDemo extends Remote {
    String now() throws RemoteException;
}
```

这个接口必须继承 `java.rmi.Remote`，并且所有的方法都必须声明抛出 `RemoteException`。

接下来定义这个接口的实现类：

```java
public class RMIDemoImpl implements RMIDemo{
    @Override
    public String now() throws RemoteException {
        LocalDateTime now = LocalDateTime.now();
        return DateTimeFormatter.ISO_DATE_TIME.format(now);
    }
}
```

编写服务端的启动函数：

```java
public class Main {
    public static void main(String[] args) throws IOException {
        RMIDemo rmiDemo = new RMIDemoImpl();
        Remote remote = UnicastRemoteObject.exportObject(rmiDemo, 0);
        Registry registry = LocateRegistry.createRegistry(8080);
        registry.rebind("RMIDemo", remote);
    }
}
```

上面代码的逻辑如下：

- 创建一个 `RMIDemoImpl` 实例。
- 使用 `UnicastRemoteObject.exportObject` 方法将这个实例导出为一个远程对象。
- 创建一个 RMI 注册表，并将远程对象绑定到注册表中，并且指定端口号和名字。

客户端的代码如下：

```java
class RMIClient {
    static void main() throws RemoteException, NotBoundException {
        Registry registry = LocateRegistry.getRegistry("127.0.0.1", 8080);
        Remote service = registry.lookup("RMIDemo");
        if (service instanceof RMIDemo rmiDemo) {
            System.out.println(rmiDemo.now());
        }
    }
}
```

RMI 的问题和限制：

- RMI 只能在 Java 环境中使用，因为它依赖于 Java 的序列化机制。
- 由于 RMI 使用了 Java 的序列化，因为 Java 的序列化不但涉及数据，还会涉及二进制字节码，因此可能会有安全风险。只有在内网互相信任的机器才能使用，同时不能将 RMI 服务暴露在公网。
