# IO模型

用什么样的通道进行数据的发送和接收，很大程度上决定了程序通信的性能

### Java BIO

**同步并阻塞(传统阻塞型)**，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理如果这个连接不做任何事就会造成不必要的开销，适用于连接数目比较小且固定的架构，对服务器资源要求较高

##### BIO服务器示例

本示例使用Telnet做客户端，当然自己写也是可以的，服务端使用线程池为每个请求创建一个对应的处理线程，主线程循环监听请求

```java
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author ppg007
 * @version 1.0
 * @since 2021/8/11 16:34
 */
public class BIOServer {
    public static void main(String[] args) throws IOException {
//        创建线程池
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(Runtime.getRuntime().availableProcessors() / 2
                                                , Runtime.getRuntime().availableProcessors()
                                                , 10L
                                                , TimeUnit.SECONDS,
                                                new ArrayBlockingQueue<>(10)
                                                , new ThreadPoolExecutor.DiscardPolicy());
        ServerSocket serverSocket = new ServerSocket(8848);
        System.out.println("server has started!");
        while (true){
            System.out.println("waiting for connection");
            Socket accept = serverSocket.accept();//卡在此处
            System.out.println("a client has connected!");
            threadPoolExecutor.submit(()->{
                handler(accept);
            });
        }
//        如果有客户端连接，就创建一个线程，与之通讯
    }

    private static void handler(Socket socket) {
        char[] chars = new char[1024];
        try(InputStream inputStream = socket.getInputStream();
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream,"GBK")) {//使用转换流支持Windows中文
            while (true){
                System.out.println("reading");
                int len = inputStreamReader.read(chars);//卡在此处
                if (len==-1){
                    break;
                }
                System.out.println(Thread.currentThread().getName()+"===>"+new String(chars,0,len));
            }
            System.out.println(Thread.currentThread().getName()+"===>"+"disconnected");
        }catch (IOException e){
            e.printStackTrace();
        }

    }
}
```

> 在启动Telnet连接前，服务端在输出`server has started`和`waiting for connection`后就一直等待，卡在接受连接处，连接上后，每次发送内容结束后，都会卡在read处，这就是BIO中==阻塞==的体现，且通过线程名并通过多个Telnet客户端连接可以发现确实是一个线程对应一个连接

### Java NIO

**同步非阻塞**，服务器实现模式为一个线程处理多个请求，即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询连接，有I/O请求就进行处理，适用于连接数量多且连接比较短的架构，如聊天服务器、弹幕系统服务期间通讯等，jdk1.4

**三大核心部分：==Channel(通道)==，==Buffer(缓冲区)==,==Selector(选择器)==**

NIO是==面向缓冲区、或者面向块==编程的。数据读取到一个它稍后处理的缓冲区，需要时可在缓冲区前后移动，提高了处理过程中的灵活性

- 每个channel对应一个buffer(一一对应)
- 一个selector对应一个线程，一个线程对应多个selector
- channel注册到selector中
- 程序切换到那个channel是由事件决定的，Event
- selector会根据不同的事件在各个通道上进行切换
- buffer就是一个内存块，底层是数组
- 数据读取、写入通过buffer，buffer可读可写，需要通过`flip()`方法切换(与BIO本质的区别)
- channel是双向的，可以返回底层操作系统的情况
- 常用channel类：
  - FileChannel
  - DatagramChannel
  - ServerSocketChannel
  - SocketChannel

![image-20210811174516051](/Netty/image-20210811174516051.png)

- 读写Buffer

```java
IntBuffer intBuffer = IntBuffer.allocate(10);
Random random = new Random();
for (int i = 0; i < intBuffer.capacity(); i++) {
    intBuffer.put(random.nextInt(100));
}


//      切换为只读buffer，再调用put方法会抛出异常
//        intBuffer.asReadOnlyBuffer();
//        intBuffer.put(1);

//      读写切换，不写下方循环不会输出
intBuffer.flip();
while (intBuffer.hasRemaining()){
    System.out.println(intBuffer.get());
}
```

- 通过channel将字符串写入文件

```java
String str="蚌埠住了";
FileOutputStream fileOutputStream = new FileOutputStream("src/main/resources/1.txt");
FileChannel channel = fileOutputStream.getChannel();
ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
byteBuffer.put(str.getBytes());
byteBuffer.flip();
channel.write(byteBuffer);
fileOutputStream.close();
```

- 通过channel从文件中读取内容并输出

```java
FileInputStream fileInputStream = new FileInputStream("src/main/resources/1.txt");
FileChannel channel = fileInputStream.getChannel();
ByteBuffer byteBuffer = ByteBuffer.allocate(12);
channel.read(byteBuffer);
System.out.println(new String(byteBuffer.array()));
fileInputStream.close();
```

- 通过channel结合buffer拷贝文件

```java
FileInputStream fileInputStream = new FileInputStream("src/main/resources/1.txt");
FileChannel channel = fileInputStream.getChannel();
ByteBuffer byteBuffer = ByteBuffer.allocate(1);

FileOutputStream fileOutputStream = new FileOutputStream("src/main/resources/2.txt");
FileChannel fileOutputStreamChannel = fileOutputStream.getChannel();
while (channel.read(byteBuffer) !=-1){
    byteBuffer.flip();
    fileOutputStreamChannel.write(byteBuffer);
    //            一下两句选择一句即可，清空缓冲区
    //            byteBuffer.flip();
    byteBuffer.clear();
}
fileOutputStream.close();
fileInputStream.close();
```

- 只使用channel复制文件

```java
FileInputStream fileInputStream = new FileInputStream("src/main/resources/69.jpg");
FileOutputStream fileOutputStream = new FileOutputStream("src/main/resources/69-1.jpg");
FileChannel source = fileInputStream.getChannel();
FileChannel dest = fileOutputStream.getChannel();
source.transferTo(0,source.size(),dest);
dest.close();
source.close();
fileOutputStream.close();
fileInputStream.close();
```

- MappedBuffer直接修改文件内容

```java
//        直接在堆外内存修改，操作系统不需要拷贝一次
RandomAccessFile randomAccessFile = new RandomAccessFile("src/main/resources/1.txt","rw");

FileChannel channel = randomAccessFile.getChannel();
MappedByteBuffer map = channel.map(FileChannel.MapMode.READ_WRITE, 0, 100);//指定范围
map.put(0,(byte) 'q');
map.put(99,(byte) 'c');
//        map.put(100,(byte) 'c');溢出异常
randomAccessFile.close();
```

- NIO支持使用多个buffer进行读写操作

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
InetSocketAddress inetSocketAddress = new InetSocketAddress(8848);
serverSocketChannel.socket().bind(inetSocketAddress);
ByteBuffer[] byteBuffers = new ByteBuffer[2];
byteBuffers[0]=ByteBuffer.allocate(5);
byteBuffers[1]=ByteBuffer.allocate(3);
SocketChannel accept = serverSocketChannel.accept();
while (true){
    long byteRead=0;
    while (byteRead<8){
        long read = accept.read(byteBuffers);
        byteRead+=read;
        System.out.println("read");
        System.out.println(byteRead);
    }
    byteBuffers[0].flip();
    byteBuffers[1].flip();
    long byteWrite=0;
    while (byteWrite<8){
        long write = accept.write(byteBuffers);
        byteWrite+=write;
        System.out.println("write");
    }
    byteBuffers[0].clear();
    byteBuffers[1].clear();
    System.out.println(byteRead);
    System.out.println(byteWrite);
}
```

> selector能够检测多个注册通道上是否有事件发生，如果有事件发生就获取事件进行处理，从而做到一个线程管理多个通道
>
> 1. 当客户端连接时，会通过ServerSocketChannel的accept方法得到SocketChannel，每个客户端都有一个channel
> 2. selector进行监听，select方法返回有事件发生的通道个数
> 3. 将SocketChannel注册到selector上，一个selector可以注册多个channel，通过`register`方法
> 4. 注册后返回一个SelectionKey和指定的selector关联
> 5. 进一步得到各个key
> 6. 通过key反向获取channel
> 7. 通过得到的channel进行业务处理

服务器代码示例

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
//        得到一个选择器对象
Selector selector = Selector.open();
serverSocketChannel.socket().bind(new InetSocketAddress(8848));
serverSocketChannel.configureBlocking(false);
serverSocketChannel.register(selector,SelectionKey.OP_ACCEPT);

while (true){
    //            select有三个方法
    //            无参方法是阻塞的
    //            一个参数的方法是阻塞指定毫秒数
    //            selectNow不阻塞立刻返回
    //            还有一个唤醒方法wakeup
    if (selector.select(1000)==0){
        System.out.println("服务器等待了一秒，无连接");
        continue;
    }
    Set<SelectionKey> selectionKeys = selector.selectedKeys();
    Iterator<SelectionKey> iterator = selectionKeys.iterator();
    while (iterator.hasNext()){
        SelectionKey key = iterator.next();
        if (key.isAcceptable()){
            SocketChannel accept = serverSocketChannel.accept();
            accept.configureBlocking(false);
            accept.register(selector,SelectionKey.OP_READ, ByteBuffer.allocate(1024));
        }
        if (key.isReadable()){
            SocketChannel channel = (SocketChannel) key.channel();
            ByteBuffer buffer = (ByteBuffer) key.attachment();
            channel.read(buffer);
            System.out.println("客户端发来："+new String(buffer.array()));
        }
        iterator.remove();
    }
}
```

客户端代码示例

```java
SocketChannel channel = SocketChannel.open();
channel.configureBlocking(false);
InetSocketAddress inetSocketAddress = new InetSocketAddress("localhost", 8848);
if (!channel.connect(inetSocketAddress)){
    while (!channel.finishConnect()){
        System.out.println("客户端不阻塞");
    }
}
String str="蚌埠住了";
ByteBuffer buffer = ByteBuffer.wrap(str.getBytes());
channel.write(buffer);
System.in.read();
```

##### 利用NIO实现在线群聊系统

服务端代码：

```java
package groupchat;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.*;
import java.util.Iterator;
import java.util.Set;

/**
 * @author ppg007
 * @version 1.0
 * @since 2021/8/12 19:57
 */
public class Server {

//    服务端拥有selector
    private Selector selector;

//    服务端channel
    private ServerSocketChannel serverSocketChannel;

//    服务端监听端口
    private static final int port=8848;

    public Server() {
        try {
//            初始化
            this.selector=Selector.open();
            this.serverSocketChannel= ServerSocketChannel.open();
            this.serverSocketChannel.socket().bind(new InetSocketAddress(port));
            this.serverSocketChannel.configureBlocking(false);
//            监听连接事件
            this.serverSocketChannel.register(this.selector, SelectionKey.OP_ACCEPT);
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    public void listen(){
        try {
            while (true){
//                间隔两秒监听
                int count = this.selector.select(2000);
                if (count>0){
                    Iterator<SelectionKey> iterator = this.selector.selectedKeys().iterator();
                    while (iterator.hasNext()){
                        SelectionKey key = iterator.next();
//                        如果可以连接
                        if (key.isAcceptable()){
//                            创建连接channel
                            SocketChannel accept = this.serverSocketChannel.accept();
                            accept.configureBlocking(false);
//                            注册到selector并监听读事件，是服务端读这个客户端可读
                            accept.register(this.selector,SelectionKey.OP_READ);
                            System.out.println(accept.getRemoteAddress()+" 上线 ");
                        }else if(key.isReadable()){
//                            如果可读就读取指定key对应的channel
                            read(key);
                        }
                        iterator.remove();
                    }
                }else {
                    System.out.println("等待......");
                }
            }
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    private void read(SelectionKey key){
        SocketChannel channel=null;
        try {
            channel= ((SocketChannel) key.channel());
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            int count = channel.read(buffer);
            if (count>0) {
                String msg = new String(buffer.array());
                System.out.println("收到客户端消息："+msg);
//                转发给其他客户端
                forward(msg,channel);
            }
        } catch (IOException e) {
            try {
                System.out.println(channel.getRemoteAddress()+" 离线了");
//                转发离线消息给其他客户端
                forward(channel.getRemoteAddress()+ "离线了",channel);
//                取消注册
                key.cancel();
//                关闭channel
                channel.close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private void forward(String msg,SocketChannel channel) throws IOException {
        System.out.println("服务器转发消息中");
//        获取所有注册的key
        Set<SelectionKey> keys = this.selector.keys();
        for (SelectionKey key : keys) {
            Channel target = key.channel();
//            排除自己，不转发给自己
            if (target instanceof SocketChannel && target!=channel){
                SocketChannel destination = (SocketChannel) target;
                ByteBuffer buffer = ByteBuffer.wrap(msg.getBytes());
                destination.write(buffer);
            }
        }
    }

    public static void main(String[] args) {
        Server server = new Server();
        server.listen();
    }
}
```



客户端代码

```java
package groupchat;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

/**
 * @author ppg007
 * @version 1.0
 * @since 2021/8/12 20:13
 */
public class Client {

//    指定主机地址
    private static final String HOST="localhost";
//    private static final String HOST="39.107.112.172";

//    指定主机端口号
    private static final int PORT=8848;

//    定义selector用于监听事件，不用也可以，但是就要一直receive
    private Selector selector;

//    定义channel
    private SocketChannel socketChannel;

//    客户端名字
    private String name;

    public Client() throws IOException {
//        初始化
        this.selector=Selector.open();
        this.socketChannel=SocketChannel.open(new InetSocketAddress(HOST,PORT));
        this.socketChannel.configureBlocking(false);
        this.socketChannel.register(selector, SelectionKey.OP_READ);
        this.name=this.socketChannel.getLocalAddress().toString();
        System.out.println("客户端"+this.name+"准备好了");
    }

    public void send(String msg){
        msg=this.name+" 说：\n"+msg;
        try {
//            写入channel
            this.socketChannel.write(ByteBuffer.wrap(msg.getBytes()));
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    public void receive(){
        try {
            int readChannels = this.selector.select();
            if (readChannels>0){
                Iterator<SelectionKey> iterator = this.selector.selectedKeys().iterator();
                while (iterator.hasNext()){
                    SelectionKey key = iterator.next();
//                    读取channel到buffer
                    if (key.isReadable()){
                        SocketChannel channel = (SocketChannel) key.channel();
                        ByteBuffer buffer = ByteBuffer.allocate(1024);
                        channel.read(buffer);
                        String msg = new String(buffer.array());
                        System.out.println(msg.trim());
                    }
                    iterator.remove();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws IOException {
        Client client = new Client();
//        用另一个线程循环接收
        new Thread(()->{
            while (true){
                client.receive();
                try {
                    TimeUnit.SECONDS.sleep(3);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
//        主线程接收命令行输入
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNextLine()){
            client.send(scanner.nextLine());
        }
        scanner.close();
    }
}
```

##### 零拷贝

传统文件传输：数据读取和写入是从用户空间到内核空间来回复制，而内核空间的数据是通过操作系统层面的 I/O 接口从磁盘读取或写入

![img](/Netty/v2-e3b554661358b18b3f36cc17f0b0c8c1_1440w.jpg)

**发生了 4 次用户态与内核态的上下文切换**

**发生了 4 次数据拷贝**

- *第一次拷贝*，把磁盘上的数据拷贝到操作系统内核的缓冲区里，这个拷贝的过程是通过 DMA 搬运的。
- *第二次拷贝*，把内核缓冲区的数据拷贝到用户的缓冲区里，于是我们应用程序就可以使用这部分数据了，这个拷贝到过程是由 CPU 完成的。
- *第三次拷贝*，把刚才拷贝到用户的缓冲区里的数据，再拷贝到内核的 socket 的缓冲区里，这个过程依然还是由 CPU 搬运的。
- *第四次拷贝*，把内核的 socket 缓冲区里的数据，拷贝到网卡的缓冲区里，这个过程又是由 DMA 搬运的。

零拷贝技术实现的方式通常有 2 种：

- mmap + write

`mmap()` 系统调用函数会直接把内核缓冲区里的数据「**映射**」到用户空间，这样，操作系统内核与用户空间就不需要再进行任何的数据拷贝操作

![img](/Netty/v2-16ff9ac786b16508711083ed44a8ff79_1440w.jpg)

- 应用进程调用了 `mmap()` 后，DMA 会把磁盘的数据拷贝到内核的缓冲区里。接着，应用进程跟操作系统内核「共享」这个缓冲区；
- 应用进程再调用 `write()`，操作系统直接将内核缓冲区的数据拷贝到 socket 缓冲区中，这一切都发生在内核态，由 CPU 来搬运数据；
- 最后，把内核的 socket 缓冲区里的数据，拷贝到网卡的缓冲区里，这个过程是由 DMA 搬运的。

**减少一次数据拷贝的过程，仍然需要 4 次上下文切换，因为系统调用还是 2 次。**

- sendfile(linux2.1)

该系统调用，可以直接把内核缓冲区里的数据拷贝到 socket 缓冲区里，不再拷贝到用户态，这样就只有 2 次上下文切换，和 3 次数据拷贝

![img](/Netty/v2-557b255dbca2fdd3a5a213cbee7df513_1440w.jpg)

从 Linux 内核 `2.4` 版本开始起，对于支持网卡支持 SG-DMA 技术的情况下， `sendfile()` 系统调用的过程发生了点变化，具体过程如下

- 第一步，通过 DMA 将磁盘上的数据拷贝到内核缓冲区里
- 第二步，缓冲区描述符和数据长度传到 socket 缓冲区，这样网卡的 SG-DMA 控制器就可以直接将内核缓存中的数据拷贝到网卡的缓冲区里，此过程不需要将数据从操作系统内核缓冲区拷贝到 socket 缓冲区中，这样就减少了一次数据拷贝

![img](/Netty/v2-dc405f1eb057217aee8820b6d3e340fd_1440w.jpg)

这就是所谓的**零拷贝（\*Zero-copy\*）技术，因为我们没有在内存层面去拷贝数据，也就是说全程没有通过 CPU 来搬运数据，所有的数据都是通过 DMA 来进行传输的。**。

零拷贝技术的文件传输方式相比传统文件传输的方式，减少了 2 次上下文切换和数据拷贝次数，**只需要 2 次上下文切换和数据拷贝次数，就可以完成文件的传输，而且 2 次的数据拷贝过程，都不需要通过 CPU，2 次都是由 DMA 来搬运。**

所以，总体来看，**零拷贝技术可以把文件传输的性能提高至少一倍以上**。

###### BIO实现拷贝(文件大小35.4MB)

服务端

```java
public class BIOServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket();
        serverSocket.bind(new InetSocketAddress(8848));
        while (true){
            Socket accept = serverSocket.accept();
            InputStream inputStream = accept.getInputStream();
            int len;
            byte[] buffer = new byte[1024];
            FileOutputStream fileOutputStream = new FileOutputStream("D:\\Javaweb\\Netty-Learn\\NIO-Demo\\src\\main\\java\\zerocopy\\bio\\test.jpg");
            while ((len=inputStream.read(buffer))!=-1){
                fileOutputStream.write(buffer,0,len);
            }
            fileOutputStream.close();
        }
    }
}
```

客户端

```java
public class BIOClient {
    public static void main(String[] args) throws IOException {
        long clientStart = System.currentTimeMillis();
        Socket socket = new Socket();
        socket.connect(new InetSocketAddress(8848));
        OutputStream outputStream = socket.getOutputStream();
        FileInputStream fileInputStream = new FileInputStream("D:\\Javaweb\\Netty-Learn\\NIO-Demo\\src\\main\\resources\\340.jpg");
        byte[] buffer = new byte[1024];
        int len;
        long copyStart = System.currentTimeMillis();
        while ((len=fileInputStream.read(buffer))!=-1){
            outputStream.write(buffer,0,len);
        }
        long copyEnd = System.currentTimeMillis();
        fileInputStream.close();
        socket.close();
        long clientEnd = System.currentTimeMillis();
        System.out.println("发送文件耗时："+(copyEnd-copyStart));
        System.out.println("客户端总耗时："+(clientEnd-clientStart));
    }
}
```

耗时情况：

![image-20210813141228051](/Netty/image-20210813141228051.png)

###### NIO实现拷贝(文件大小35.4MB)

服务端

```java
public class NIOServer {
    public static void main(String[] args) throws IOException {
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.socket().bind(new InetSocketAddress(8848));
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        FileOutputStream fileOutputStream = new FileOutputStream("D:\\Javaweb\\Netty-Learn\\NIO-Demo\\src\\main\\java\\zerocopy\\nio\\test.jpg");
        while (true){
            FileChannel channel = fileOutputStream.getChannel();
            SocketChannel accept = serverSocketChannel.accept();
            int len;
            while ((len=accept.read(buffer))!=-1){
                buffer.flip();
                channel.write(buffer);
                buffer.clear();
            }
        }
    }
}
```

客户端

```java
public class NIOClient {
    public static void main(String[] args) throws IOException {
        long clientStart = System.currentTimeMillis();
        SocketChannel socketChannel = SocketChannel.open();
        socketChannel.connect(new InetSocketAddress(8848));
        FileInputStream fileInputStream = new FileInputStream("D:\\Javaweb\\Netty-Learn\\NIO-Demo\\src\\main\\resources\\340.jpg");
        FileChannel channel = fileInputStream.getChannel();
        long size = channel.size();
        double segment = size / (double) (8 * 1024 * 1024);
        long copyStart = System.currentTimeMillis();
        int i=0;
        for (; i < (int)segment; i++) {
            channel.transferTo(i*(8*1024*1024),(8*1024*1024),socketChannel);
        }
        if (segment!=(int)segment){
            channel.transferTo(i*(8*1024*1024),size,socketChannel);
        }
        long copyEnd = System.currentTimeMillis();
        channel.close();
        fileInputStream.close();
        socketChannel.close();
        long clientEnd = System.currentTimeMillis();
        System.out.println("发送文件耗时："+(copyEnd-copyStart));
        System.out.println("客户端总耗时："+(clientEnd-clientStart));
    }
}
```

耗时情况：

![image-20210813141315951](/Netty/image-20210813141315951.png)

**注意：Windows环境中，调用一次transfer方法最大传输8MB，需要分段，Linux则不需要**

### Java AIO

**异步非阻塞**，引入异步通道概念，采用Proactor模式，有效的请求才启动线程，特点：先由操作系统完成后才通知服务端程序启动线程去处理，适用于连接数较多且连接时间较长的应用，比如相册服务器，jdk1.7

# 线程模型

### 传统阻塞I/O服务模型

![image-20210813163713373](/Netty/image-20210813163713373.png)

每个连接都需要一个线程完成业务处理、输入输出，如果线程没有数据可读，会阻塞在read，浪费资源，并发量很大时，创建大量线程，占用很大系统资源

### Reactor模型

- 基于I/O复用模型，多个连接共用一个阻塞对象
- 基于线程池复用线程

##### 单Reactor单线程

![image-20210813164539857](/Netty/image-20210813164539857.png)

服务端用一个线程多路复用实现了所有的处理任务，例如NIO群聊系统，性能不强，适合客户端数量少且业务处理很快的场景

##### 单Reactor多线程

![image-20210813165428693](/Netty/image-20210813165428693.png)

- Reactor通过select监控客户端请求事件，收到事件后，通过dispatch分发
- 如果是建立连接请求，则由acceptor处理并创建一个handler对象处理连接后的各种事件
- 如果不是连接事件则由reactor分发给对应handler进行处理
- handler只负责响应事件，不做具体业务处理，通过read读取数据后，分发给后面的worker线程池的某个线程处理业务
- worker线程池分配线程完成任务将结果返回handler
- handler收到结果后调用send将结果返回client

充分利用多核CPU，多线程共享比较复杂，reactor处理所有事件监听和响应还是单线程，高并发会有性能瓶颈

##### 主从Reactor多线程



![](/Netty/主从Reactor.png)

- Reactor监听连接事件，通过Acceptor处理连接事件
- 处理连接事件后，将连接分配到SubReactor
- SubReactor将连接加入到连接队列进行监听，并创建handler进行各种事件处理
- 当新事件发生时，SubReactor调用相应handler处理
- handler通过read获取数据，分发给worker线程处理
- worker线程池分配独立线程进行业务处理，返回结果
- handler收到结果后通过send返回给client
- MainReactor可以对应多个SubReactor

### Netty工作原理图

![](/Netty/netty工作原理图.png)

- Netty抽象出两组线程池，BossGroup负责接收客户端的连接，WorkerGroup负责网络的读写
- BossGroup和WorkerGroup类型都是NioEventLoopGroup
- NioEventLoopGroup相当于一个事件循环组，这个组中有多个事件循环，每一个事件循环是NioEventLoop
- NioEventLoop表示一个不断循环执行处理任务的线程，每个NioEventLoop都有一个selector，用于监听绑定在其上的socket的网络通讯
- NioEventLoop是串行的
- NioEventLoopGroup可以有多个线程，即可以有多个NioEventLoop
- 每个Boss NioEventLoop循环执行步骤有三部
  - 轮询accept事件
  - 处理accept事件，与client建立连接，生成NioSocketChannel，并将其注册到某个Worker NioEventLoop上的selector
  - 处理任务队列的任务，即runAllTasks
- 每个Worker NioEventLoop循环执行的步骤
  - 轮询read、write事件
  - 处理I/O事件，在对应的NioSocketChannel处理
  - 处理任务队列的任务，即runAllTasks
- 每个Worker NioEventLoop处理业务时，会使用`pipeline`管道，管道中包含channel，即通过管道可以获取channel，管道中维护了很多处理器
- 每个NioEventLoop包含一个Selector、一个taskQueue
- 每个NioEventLoop的Selector上可以注册监听多个NioChannel
- 每个NioChannel只会绑定在唯一的NioEventLoop
- 每个NioChannel都绑定有一个自己的ChannelPipeline

##### Netty示例程序

本示例在收到客户端发来的消息后将消息和客户端信息输出到控制台并发送一条消息返回给客户端，客户端在控制台输出这条消息和服务端的信息

引入依赖

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.1.55.Final</version>
</dependency>
```

服务端

```java
public class Server {
    public static void main(String[] args) {
//        创建BossGroup和WorkerGroup
        NioEventLoopGroup bossGroup = new NioEventLoopGroup();
        NioEventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
//            创建配置对象
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup,workerGroup)
//                    指定服务端channel类型
                    .channel(NioServerSocketChannel.class)
//                    设置线程队列连接个数
                    .option(ChannelOption.SO_BACKLOG,128)
//                    设置保持活动连接状态
                    .childOption(ChannelOption.SO_KEEPALIVE,true)
//                    设置处理器
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new ServerHandler());

                        }
                    });
            System.out.println("server is ready");
//            绑定端口并且同步
            ChannelFuture channelFuture = serverBootstrap.bind(8848).sync();
//            对关闭通道进行监听
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
//            关闭group
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
        }

    }
}
```

服务端处理器

处理器继承一个Adapter并重写需要的方法即可

```java
public class ServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.writeAndFlush(Unpooled.copiedBuffer("扎不多得嘞",StandardCharsets.UTF_8));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        ctx.channel().close();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("server ctx==>"+ctx);
        ByteBuf byteBuf = (ByteBuf) msg;
        System.out.println("client send==>"+byteBuf.toString(StandardCharsets.UTF_8));
        System.out.println("client address==>"+ctx.channel().remoteAddress());
    }
}
```

客户端

```java
public class Client {
    public static void main(String[] args) {
//        客户端同样是事件驱动
        NioEventLoopGroup eventExecutors = new NioEventLoopGroup();
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(eventExecutors)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new ClientHandler());
                    }
                });
        System.out.println("client is ready");
        try {
            ChannelFuture channelFuture = bootstrap.connect("localhost", 8848).sync();
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            eventExecutors.shutdownGracefully();
        }

    }
}
```

客户端处理器

```java
public class ClientHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf byteBuf = (ByteBuf) msg;
        System.out.println("client received==>"+byteBuf.toString(StandardCharsets.UTF_8));
        System.out.println("server address==>"+ctx.channel().remoteAddress());
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("client "+ctx);
        ctx.writeAndFlush(Unpooled.copiedBuffer("蚌埠住了", StandardCharsets.UTF_8));
    }
}
```

# 任务队列Task

### 用户程序自定义的普通任务

在handler类中通过`ctx.channel().eventLoop().execute()`方法执行即可，但是任务添加到队列后是单线程运行的

```java
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    System.out.println("server ctx==>"+ctx);
    ByteBuf byteBuf = (ByteBuf) msg;
    System.out.println("client send==>"+byteBuf.toString(StandardCharsets.UTF_8));
    System.out.println("client address==>"+ctx.channel().remoteAddress());
    try {
        TimeUnit.SECONDS.sleep(5);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    //        10秒
    ctx.channel().eventLoop().execute(()->{
        try {
            TimeUnit.SECONDS.sleep(10);
            System.out.println("耗时任务1结束");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });
    //        30秒
    ctx.channel().eventLoop().execute(()->{
        try {
            TimeUnit.SECONDS.sleep(20);
            System.out.println("耗时任务2结束");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });

}
```

### 用户自定义定时任务

在handler类中使用`ctx.channel().eventLoop().schedule()`方法执行即可

```java
@Override
public void channelActive(ChannelHandlerContext ctx) {
    System.out.println("client "+ctx);
    ctx.writeAndFlush(Unpooled.copiedBuffer("蚌埠住了", StandardCharsets.UTF_8));
    ctx.channel().eventLoop().schedule(()->{
        ctx.writeAndFlush(Unpooled.copiedBuffer("定时任务",StandardCharsets.UTF_8));
    },5, TimeUnit.SECONDS);
}
```

### 非当前Reactor线程调用channel的各种方法

推送系统根据用户标识找到对应的channel调用write推送信息，write被提交到任务队列中异步消费

### Netty搭建简单HTTP服务器

handler：

```java
public class HttpServerHandler extends SimpleChannelInboundHandler<HttpObject> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, HttpObject msg) throws Exception {
        if (msg instanceof HttpRequest){
            HttpRequest httpRequest = (HttpRequest) msg;
            URI uri = new URI(httpRequest.uri());
            if ("/favicon.ico".equals(uri.getPath())){
                return;
            }
            System.out.println("msg类型："+msg.getClass());
            System.out.println("client address:"+ctx.channel().remoteAddress());

            //回复信息
            ByteBuf content=Unpooled.copiedBuffer("扎不多得嘞", StandardCharsets.UTF_8);
            DefaultFullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK, content);
            response.headers().set(HttpHeaderNames.CONTENT_TYPE,"text/plain; charset=utf-8");
            response.headers().set(HttpHeaderNames.CONTENT_LENGTH,content.readableBytes());
            ctx.writeAndFlush(response);
        }
    }
}
```
Initialize:

```java
public class HttpServerInitialize extends ChannelInitializer<SocketChannel> {
    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();

        pipeline.addLast("HttpServerHandler",new HttpServerHandler());
        pipeline.addBefore("HttpServerHandler","MyCodec",new HttpServerCodec());
    }
}
```

server:

```java
public class HttpServer {
    public static void main(String[] args) {
        NioEventLoopGroup bossGroup = new NioEventLoopGroup();
        NioEventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup,workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new HttpServerInitialize());
            ChannelFuture channelFuture = serverBootstrap.bind(8848).sync();

            channelFuture.addListener((ChannelFutureListener) future -> {
                if (future.isSuccess()){
                    System.out.println("启动成功");
                }
            });
            channelFuture.channel().closeFuture().sync().addListener(new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture future) throws Exception {
                    if (future.isSuccess()) {
                        System.out.println("关闭成功");
                    }
                }
            });
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
        }
    }
}
```

# Netty核心模块

### Bootstrap、ServerBootstrap

Bootstrap是==客户端==的启动引导类，ServerBootstrap是==服务端==的启动引导类

常用方法

```java
group(bossGroup,workerGroup)//用于服务端指定两个EventLoopGroup
group(eventGroup)//用于客户端设置一个EventLoopGroup
channel(NioServerSocketChannel.class)//用于服务端指定服务端channel或客户端指定客户端channel类型
option(ChannelOption.SO_BACKLOG,128)//给自己的channel添加配置
childOption(ChannelOption.SO_KEEPALIVE,true)//给接收到的channel添加配置
childHandler()//添加自定义handler
serverBootstrap.bind()//用于服务端，绑定监听端口号
bootstrap.connect()//用于客户端连接服务端
```

### Future、ChannelFuture

Netty中I/O操作都是异步的，不能立刻得知消息是否正确处理，通过Future、ChannelFuture注册监听回调获取执行结果

### Channel

支持关联I/O操作与对应的处理程序

不同协议、不同的阻塞类型的连接都有不同的Channel与之对应，常用的Channel类型：

- NioSocketChannel：异步的客户端TCP Socket连接
- NioServerSocketChannel：异步的服务端TCP Socket连接
- NioDatagramChannel：异步的UDP连接
- NioSctpChannel：异步的客户端Sctp连接
- NioSctpServerChannel：异步的服务端Sctp连接

### Selector

Netty基于Selector对象实现I/O多路复用，通过Selector一个线程可以监听多个连接的 Channel事件。
当向一个 Selector中注册Channel后，Selector内部的机制就可以自动不断地查询(Select)这些注册的Channel是否有已就绪的l/O事件（例如可读，可写，网络连接完成等)，这样程序就可以很简单地使用一个线程高效地管理多个Channel

### ChannelHandler及其实现类

ChannelHandler是一个接口，处理I/О事件或拦截Ⅳ/O操作，并将其转发到其ChannelPipeline(业务处理链)中的下一个处理程序。
ChannelHandler本身并没有提供很多方法，因为这个接口有许多的方法需要实现，方便使用期间，可以继承它的子类

![image-20210814150823204](/Netty/image-20210814150823204.png)

- ChannelInboundHandler：处理入站I/O事件
- ChannelOutboundHandler：处理出站I/O操作
- ChannelInboundHandlerAdapter：处理入站I/O事件
- ChannelOutboundHandlerAdapter：处理出站I/O操作
- ChannelDuplexHandler：用于处理入站和出站事件

### Pipeline和ChannelPipeline

ChannelPipeline是一个Handler的集合，它负责处理和拦截inbound或者outbound的事件和操作，相当于一个贯穿Netty的链。(也可以这样理解:
ChannelPipeline是保存ChannelHandler的List，用于处理或拦截Channel的入站事件和出站操作)
ChannelPipeline实现了一种高级形式的拦截过滤器模式，使用户可以完全控制事件的处理方式，以及 Channel中各个的 ChannelHandler如何相互交互

![image-20210814151859777](/Netty/image-20210814151859777.png)

一个Channel包含了一个ChannelPipeline，而ChannelPipeline中又维护了一个由ChannelHandlerContext组成的双向链表，并且每个channelHandlerContext中又关联着一个channelHandler
入站事件和出站事件在一个双向链表中，入站事件会从链表head往后传递到最后一个入站的 handler,出站事件会从链表tail往前传递到最前一个出站的handler，两种类型的handler互不干扰

### ChannelHandlerContext

保存Channel相关所有上下文信息，同时关联一个ChannelHandler对象

即ChannelHandlerContext中包含了一个具体的事件处理器ChannelHandler同时ChannelHandlerContext中也绑定了对应的pipeline和Channel信息

### ChannelOption

- SO_BACKLOG
  - 对应TCP/IP协议listen函数中的backlog参数，用来初始化服务器可连接队列大小，多个请求到来时，服务端一次处理一个，把暂时没处理的放入队列
- SO_KEETALIVE
  - 一直保持连接活动状态，布尔值

### EventLoopGroup及其实现类NioEventLoopGroup

EventLoopGroup是一组 EventLoop的抽象,Netty为了更好的利用多核CPU资源一般会有多个 EventLoop同时工作,每个 EventLoop维护着一个 Selector实例。
EventLoopGroup提供next接口,可以从组里面按照一定规则获取其中一个EventLoop来处理任务。在 Netty服务器端编程中,我们一般都需要提供两个
EventLoopGroup,例如: BossEventLoopGroup和 WorkerEventLoopGroup。

通常一个服务端口即一个 ServerSocketChannel对应一个 Selector和一个 EventLoop线程。 BossEventLoop负责接收客户端的连接并将SocketChannel交给WorkerEventLoopGroup来进行I/O处理

BossEventLoopGroup通常是一个单线程的 EventLoop, EventLoop维护着一个注册了 ServerSocketChannel的Selector实例 BossEventLoop不断轮询
Selector将连接事件分离出来

通常是 OP_ACCEPT事件,然后将接收到的 SocketChannel交给WorkerEventLoopGroup
WorkerGroup会由next选择其中一个 EventLoop来将这个SocketChannel注册到其维护的Selector并对其后续的I/O事件进行处理

### Unpooled类

Netty提供的一个专门用来操作缓冲区的工具类，用来将字符串、整数等值转化为Netty中的`ByteBuf`

# Netty案例：群聊系统

### 服务端

```java
public class Server {

    private final int port;

    public Server(int port) {
        this.port = port;
    }

    public void run(){
//        给BossEventLoopGroup只分配一个EventLoop
        NioEventLoopGroup boss = new NioEventLoopGroup(1);
        NioEventLoopGroup worker = new NioEventLoopGroup();
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap.group(boss,worker)
                .channel(NioServerSocketChannel.class)
                .option(ChannelOption.SO_BACKLOG,128)
                .childOption(ChannelOption.SO_KEEPALIVE,true)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
//                        使用Netty提供的字符串编码、解码器
                        pipeline.addLast(new StringDecoder());
                        pipeline.addLast(new StringEncoder());
//                        添加自己的处理器
                        pipeline.addLast(new MyHandler());
                    }
                });
        try {
            ChannelFuture channelFuture = serverBootstrap.bind(this.port).sync();
            channelFuture.addListener((ChannelFutureListener) future -> {
                if (future.isSuccess()){
                    System.out.println("服务端启动成功");
                }
            });
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            worker.shutdownGracefully();
            boss.shutdownGracefully();
        }

    }

    public static void main(String[] args) {
        Server server = new Server(8848);
        server.run();
    }
}
```

### 服务端处理器

```java
public class MyHandler extends SimpleChannelInboundHandler<String> {

    /**
     * 创建channelGroup管理所有连接的channel
     */
    private static final ChannelGroup CHANNELS = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);


    /**
     * 一连接就调用，第一个调用
     * @param ctx 上下文
     */
    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        System.out.println(ctx.channel().remoteAddress()+"上线");
        CHANNELS.writeAndFlush("[客户端] "+ctx.channel().remoteAddress()+"上线\n");
        CHANNELS.add(ctx.channel());
    }

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * channel被激活时调用
     * @param ctx 上下文
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println(ctx.channel().remoteAddress()+"加入聊天");
    }

    /**
     * 断开连接时调用
     * @param ctx 上下文
     */
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) {
        CHANNELS.writeAndFlush("[客户端] "+ctx.channel().remoteAddress()+" "+dateFormat.format(new Date())+" 断开连接\n");
    }

    /**
     * channel失活时调用
     * @param ctx 上下文
     */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        CHANNELS.writeAndFlush("[客户端] "+ctx.channel().remoteAddress()+" "+dateFormat.format(new Date())+" 下线\n");
    }

    /**
     * 发生异常时调用
     * @param ctx 上下文
     * @param cause 异常
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        ctx.close();
    }

    /**
     * 读取客户端发送的消息
     * @param ctx 上下文
     * @param msg 客户端发来的经过解码的字符串消息
     */
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        Channel channel = ctx.channel();
        CHANNELS.forEach(channel1 -> {
            if (channel!=channel1){
                channel1.writeAndFlush("[客户端] "+channel.remoteAddress()+" "+dateFormat.format(new Date())+"：\n"+msg+"\n");
            }else {
                channel1.writeAndFlush("[我] "+dateFormat.format(new Date())+"：\n"+msg+"\n");
            }
        });
    }
}
```

### 客户端

```java
public class Client {

    private final String host;

    private final int port;

    public Client(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public void run(){
        NioEventLoopGroup eventExecutors = new NioEventLoopGroup();
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(eventExecutors)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
//                        添加Netty提供的字符串解码、编码器
                        pipeline.addLast(new StringDecoder())
                                .addLast(new StringEncoder())
//                                添加自定义处理器
                                .addLast(new ClientHandler());
                    }
                });
        try {
            ChannelFuture channelFuture = bootstrap.connect(this.host, this.port).sync();
            channelFuture.addListener((ChannelFutureListener) future -> {
                if (future.isSuccess()){
                    System.out.println("客户端启动成功");
                }
            });
//            不断读取输入
            Scanner scanner = new Scanner(System.in);
            while (scanner.hasNextLine()){
                String s = scanner.nextLine();
                channelFuture.channel().writeAndFlush(s);
            }
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            eventExecutors.shutdownGracefully();
        }


    }

    public static void main(String[] args) {
        Client localhost = new Client("localhost", 8848);
        localhost.run();
    }
}
```

### 客户端处理器

```java
public class ClientHandler extends SimpleChannelInboundHandler<String> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        System.out.print(msg);
    }
}
```

# Netty心跳检测

服务端配置心跳检测处理器

```java
serverBootstrap.group(boss,worker)
                .channel(NioServerSocketChannel.class)
                .handler(new LoggingHandler(LogLevel.INFO))
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
//                        Netty提供的空闲状态处理器
//                        参数一：多长时间没有读取，发送心跳检测包，检测是否连接
//                        参数二：多长时间没有写操作，发送心跳检测包，检测是否连接
//                        参数三：多长时间没有读写，发送心跳检测包，检测是否连接
//                        IdleEvent触发后会传递给管道中下一个handler
                        pipeline.addLast(new IdleStateHandler(3,5,6, TimeUnit.SECONDS))
                            //自定义IdleEvent处理器
                                .addLast(new HeartBeatHandler());
                    }
                });
```

自定义IdleEvent处理器

重写`userEventTriggered`方法即可

```java
public class HeartBeatHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof IdleStateEvent){
            IdleStateEvent idleStateEvent = (IdleStateEvent) evt;
            String msg="";
            switch (idleStateEvent.state()){
                case ALL_IDLE:
                    msg="读写空闲";
                    break;
                case READER_IDLE:
                    msg="读空闲";
                    break;
                case WRITER_IDLE:
                    msg="写空闲";
                    break;
                default:
                    break;
            }
            System.out.println(ctx.channel().remoteAddress()+" "+msg);
            ctx.channel().close();
        }
    }
}
```

# WebSocket长连接

HTTP传输的是帧，所以泛型都使用Frame

服务端

```java
public class Server {
    public static void main(String[] args) {
        NioEventLoopGroup boss = new NioEventLoopGroup(1);
        NioEventLoopGroup worker = new NioEventLoopGroup();
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap.group(boss,worker)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
//                        使用HTTP编码解码器
                        pipeline.addLast(new HttpServerCodec());
//                        以块方式写，添加这个处理器
                        pipeline.addLast(new ChunkedWriteHandler());
//                        HTTP数据分段，这个处理器将多个段聚合
                        pipeline.addLast(new HttpObjectAggregator(8192));
//                        将HTTP协议升级为ws协议获得长连接、匹配url
                        pipeline.addLast(new WebSocketServerProtocolHandler("/ppg"));
                        pipeline.addLast(new TextWebSocketFrameHandler());
                    }
                });
        try {
            ChannelFuture channelFuture = serverBootstrap.bind(8848).sync();
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            worker.shutdownGracefully();
            boss.shutdownGracefully();
        }
    }
}
```

自定义的处理器

```java
public class TextWebSocketFrameHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        System.out.println("已断开");
//        唯一
        System.out.println(ctx.channel().id().asLongText());
//        不唯一
        System.out.println(ctx.channel().id().asShortText());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println(cause.getMessage());
        ctx.channel().close();
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        System.out.println("已连接");
//        唯一
        System.out.println(ctx.channel().id().asLongText());
//        不唯一
        System.out.println(ctx.channel().id().asShortText());
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        super.channelActive(ctx);
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) {
        System.out.println("服务器端收到消息"+msg.text());
        ctx.channel().writeAndFlush(new TextWebSocketFrame("时间"+ LocalTime.now()+"\n"+msg.text()));
    }
}
```

前端HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
        let socket;
        if (window.WebSocket){
            socket=new WebSocket('ws://localhost:8848/ppg')
            socket.onmessage=function (ev) {
                let res = document.getElementById('res');
                res.value=res.value+'\n'+ev.data
            }
            socket.onopen=function () {
                let res = document.getElementById('res');
                res.value='连接开启了'
            }
            socket.onclose=function () {
                let res = document.getElementById('res');
                res.value=res.value+'\n连接关闭了'
            }
        }else {
            alert("浏览器不支持WebSocket")
        }
        function send(msg) {
            if (socket.readyState===WebSocket.OPEN){
                socket.send(msg)
            }else {
                alert('未连接')
            }
        }
    </script>
</head>
<body>
<form onsubmit="return false">
    <label>
        <textarea style="height: 300px;width: 300px" name="message"></textarea>
    </label>
    <input type="button" value="发送" onclick="send(this.form.message.value)">
    <label>
        <textarea style="height: 300px;width: 300px" name="res" id="res"></textarea>
    </label>
    <input type="button" value="清空" onclick="document.getElementById('res').value=''">
</form>
</body>
</html>
```

# Netty编码解码

Netty本身自带的 ObjectDecoder和 ObjectEncoder可以用来实现POJO对象或各种业务对象的编码和解码,底层使用的仍是Java序列化技术,而Java序列化技术本身效率就不高,存在如下问题：

- 无法跨语言
- 序列化后的体积太大,是二进制编码的5倍多。
- 序列化性能太低

新的解决方案：Google Protobuf

Protobuf官方文档：[Proto](https://developers.google.com/protocol-buffers)

### 使用Protobuf编码传输单个类

引入Maven坐标

```xml
<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>3.17.3</version>
</dependency>
```

引入Maven插件，可以使用此插件将`.proto`文件编译为`.java`文件

```xml
<plugin>
    <groupId>org.xolstice.maven.plugins</groupId>
    <artifactId>protobuf-maven-plugin</artifactId>
    <version>0.6.1</version>
    <configuration>
        <protocExecutable>
            D:\protoc-3.17.3-win64\bin\protoc.exe  <!--protoc.exe-->
        </protocExecutable>
        <pluginId>protoc-java</pluginId>
        <!-- proto文件放置的目录 -->
        <protoSourceRoot>${project.basedir}/src/main/java/protocol</protoSourceRoot>
        <!-- 生成文件的目录 -->
        <outputDirectory>${project.basedir}/src/main/java</outputDirectory>
        <!-- 生成文件前是否把目标目录清空，这个最好设置为false，以免误删项目文件 -->
        <clearOutputDirectory>false</clearOutputDirectory>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>compile</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

编译程序下载地址：[protoc](https://github.com/protocolbuffers/protobuf/releases/tag/v3.17.3)

在Maven插件配置的proto文件目录中新建一个`.proto`文件

`Student.proto`：

```protobuf
syntax="proto3";//指定版本
option java_package="pojo";//指定生成的java文件在哪个包下
option java_outer_classname="StudentPOJO";//指定生成java文件的名字，不能和下面定义的message重名
option java_multiple_files = true;//开启多文件，不开就生成一个java文件，开了会生成接口和类
//proto中数据类型以message定义，与class类似
message Student{
//proto中的类型，对应关系参考官方文档
  int32 id=1;//等号不是赋值，而是一个标记，不能重复，就像是数据库主键一样
  string name=2;
  double salary=3;
}
```

执行Maven插件的compile命令

![image-20210815203257869](/Netty/image-20210815203257869.png)

在指定的包下生成三个文件

![image-20210815203337639](/Netty/image-20210815203337639.png)

Netty客户端设置编码器，注意添加handler的先后顺序，发送放在自定义handler中，所以编码要放在自定义handler之前

```java
bootstrap.group(eventExecutors)
    .channel(NioSocketChannel.class)
    .handler(new ChannelInitializer<SocketChannel>() {
        @Override
        protected void initChannel(SocketChannel ch) {
            ch.pipeline().addLast(new ProtobufEncoder());
            ch.pipeline().addLast(new ClientHandler());
        }
    });
```

Netty客户端自定义handler

创建对象的方法：

message名字(Student)`.newBuilder().`相应set方法`.build()`

```java
public class ClientHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf byteBuf = (ByteBuf) msg;
        System.out.println("client received==>"+byteBuf.toString(StandardCharsets.UTF_8));
        System.out.println("server address==>"+ctx.channel().remoteAddress());
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("client "+ctx);
        Student student = Student.newBuilder().setId(31).setName("李在干神魔").setSalary(5.5).build();
        ctx.writeAndFlush(student);
    }
}
```

Netty服务端设置解码器，自定义handler负责读取输出，所以解码放在自定义handler前

`ProtobufDecoder`构造器要传入一个类型，指定要解码的类型，类型通过message名字(Student)`.getDefaultInstance()`获取

```java
.childHandler(new ChannelInitializer<SocketChannel>() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new ProtobufDecoder(Student.getDefaultInstance()));
        pipeline.addLast(new ServerHandler());

    }
});
```

Netty服务端自定义handler

```java
public class ServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.writeAndFlush(Unpooled.copiedBuffer("扎不多得嘞",StandardCharsets.UTF_8));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        ctx.channel().close();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("server ctx==>"+ctx);
        //强制类型转换
        Student student = (Student) msg;
        System.out.println(student.getId());
        System.out.println(student.getName());
        System.out.println(student.getSalary());
    }
}
```

如果继承的父类handler是支持泛型的，也可以通过泛型指定消息类型，不需要强制类型转换，如`SimpleChannelInboundHandler`

### 使用Protobuf编码传输多个类

同样先创建`.proto`文件

```protobuf
syntax="proto3";
option java_package="pojo";
option java_outer_classname="SchoolPOJO";
option java_multiple_files = true;
option optimize_for=SPEED;//加速编译
message Teacher{//定义一个Teacher
  int32 id=1;
  string name=2;
}
message Child{//定义一个Child
  int32 age=1;
  string name=2;
}
message School{//定义School，由School管理前面的两个类型
  enum DataType{//创建枚举类，注意枚举类元素标记从0开始，枚举是内部枚举
    TeacherType=0;
    ChildType=1;
  }
  //标识传递的是哪个枚举类型，注意：上面的是枚举，而下面的是数据类型(相当于实例)，也就是说Teacher中有两个数据类型
  DataType data_type=1;
  //oneof表示其中的类型只能是其中一个，要么是Teacher要么是Child
  oneof dataBody{
    Teacher teacher=2;
    Child child=3;
  }
}
```

Netty客户端编码器配置不变，自定义handler如下：

```java
public class ClientHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf byteBuf = (ByteBuf) msg;
        System.out.println("client received==>"+byteBuf.toString(StandardCharsets.UTF_8));
        System.out.println("server address==>"+ctx.channel().remoteAddress());
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("client "+ctx);

        Child child = Child.newBuilder().setName("孩子").setAge(1).build();
        School school = School.newBuilder().setDataType(School.DataType.ChildType).setChild(child).build();
        ctx.writeAndFlush(school);

        Teacher teacher = Teacher.newBuilder().setId(2).setName("教师").build();
        School school1 = School.newBuilder().setDataType(School.DataType.TeacherType).setTeacher(teacher).build();
        ctx.channel().eventLoop().schedule(()->{
            ctx.writeAndFlush(school1);
        },10,TimeUnit.SECONDS);
    }
}
```

创建`School`类还是使用`newBuilder()`，但是还要设置数据类型，因为`.proto`文件使用了`oneof`，然后传入对应的实例对象调用`build()`完成创建

Netty服务端解码器配置，这里就变成了传入`School`对象

```java
.childHandler(new ChannelInitializer<SocketChannel>() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new ProtobufDecoder(School.getDefaultInstance()));
        pipeline.addLast(new ServerHandler());

    }
});
```

Netty服务端自定义handler

```java
public class ServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.writeAndFlush(Unpooled.copiedBuffer("扎不多得嘞",StandardCharsets.UTF_8));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        ctx.channel().close();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("server ctx==>"+ctx);
        School school = (School) msg;
        School.DataType dataType = school.getDataType();
        if (dataType== School.DataType.ChildType){
            Child child = school.getChild();
            System.out.println(child.getName());
            System.out.println(child.getAge());
        }else {
            Teacher teacher = school.getTeacher();
            System.out.println(teacher.getId());
            System.out.println(teacher.getName());
        }
    }
}
```

先强制转换为大类型(School)，然后判断DataType再调用对应方法即可获取对应值

# Netty入站出站机制

对客户端和服务端来说，向外发送是出站(相对自己)，向内接收是入站(相对自己)

入站会调用解码器将字节解码成对象，出站会调用编码器，将对象编码成字节

### 解码器ByteToMessageDecoder

类图：

![image-20210815211039834](/Netty/image-20210815211039834.png)

> 由于不可能知道远程节点是否会一次性发送一个完整的信息，TCP有可能出现粘包拆包的问题，这个类会对入站数据进行缓冲，直到它准备好被处理

### 编码器MessageToByteEncoder

![image-20210816132016781](/Netty/image-20210816132016781.png)

### Handler链与编解码器调用实例

案例目标：客户端发送一个Long类型的数据，服务端接收到后回送一个Long类型数据

Long向字节转换编码器，LongToByteEncoder：

```java
public class LongToByteEncoder extends MessageToByteEncoder<Long> {
    @Override
    protected void encode(ChannelHandlerContext ctx, Long msg, ByteBuf out) throws Exception {
        out.writeLong(msg);
    }
}
```

字节向Long解码器，ByteToLongDecoder：

```java
public class ByteToLongDecoder extends ByteToMessageDecoder {
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        if (in.readableBytes()>=8){//判断够不够8个字节
            out.add(in.readLong());
        }
    }
}
```

服务端初始化类

```java
public class ServerInitialize extends ChannelInitializer<SocketChannel> {
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        ctx.channel().close();
    }

    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        //注意先后顺序
        pipeline.addLast(new ByteToLongDecoder());
        pipeline.addLast(new LongToByteEncoder());
        pipeline.addLast(new ServerHandler());
    }
}
```

客户端初始化类

```java
public class ClientInitialize extends ChannelInitializer<SocketChannel> {
    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new LongToByteEncoder())
                .addLast(new ByteToLongDecoder())
                .addLast(new ClientHandler());
    }
}
```

自定义handler直接调用`writeAndFlush()`方法传入一个msg即可

**不论编码器和解码器，接收的消息类型必须与待处理的消息类型一致，否则Handler不会执行**

### Netty中其他常用编解码器

- ReplayingDecoder

ReplayingDecoder扩展了 ByteToMessageDecoder类,使用这个类,我们不必调用readableBytes()方法，即不需要判断字节数是否满足转换要求

示例：

```java
public class ByteToLongDecoder2 extends ReplayingDecoder<Long> {

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        out.add(in.readLong());
    }
}
```

> 缺点：
>
> 并不是所有的 ByteBuf操作都被支持,如果调用了一个不被支持的方法,将会抛出一个UnsupportedOperationException，ReplayingDecoder在某些情况下可能稍慢于ByteToMessageDecoder,例如网络缓慢并且消息格式复杂时,消息会被拆成了多个碎片,速度变慢

- LineBasedFrameDecoder

使用行尾控制字符(\n\r)做分隔符解析数据

- DelimiterBasedFrameDecoder

  使用自定义的特殊字符作为消息的分隔符。
- Httpobjectdecoder

  一个HTTP数据的解码器
- Length FieldBasedFrame Decoder

  通过指定长度来标识整包消息,这样就可以自动的处理黏包和半包消息。

# TCP粘包拆包

### 基本介绍

假设客户端分别发送了两个数据包D1和D2给服务端,由于服务端一次读取到字节数是不确定的,故可能存在以下四种情况:

1. 服务端分两次读取到了两个独立的数据包,分别是D1和D2,没有粘包和拆包
2. 服务端一次接受到了两个数据包,D1和D2粘合在一起,称之为==TCP粘包==
3. 服务端分两次读取到了数据包,第一次读取到了完整的D1包和D2包的部分内容,第二次读取到了D2包的剩余内容,这称之为==TCP拆包==
4. 服务端分两次读取到了数据包,第一次读取到了D1包的部分内容D11,第二次读取到了D1包的剩余部分内容D12和完整的D2包

### TCP粘包拆包示例

客户端向服务端循环发送10条数据

```java
public class ClientHandler extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        for (int i = 0; i < 10; i++) {
            ByteBuf byteBuf = Unpooled.copiedBuffer(" 蚌埠住了 " + i, StandardCharsets.UTF_8);
            ctx.writeAndFlush(byteBuf);
        }

    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        //接收服务端回传
        byte[] bytes = new byte[msg.readableBytes()];
        ByteBuf byteBuf = msg.readBytes(bytes);
        System.out.println(new String(bytes, StandardCharsets.UTF_8));
    }
}
```

服务端读取一次就回送一个随机字符串

```java
public class ServerHandler extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        byte[] bytes = new byte[msg.readableBytes()];
        msg.readBytes(bytes);
        System.out.println(new String(bytes, StandardCharsets.UTF_8));
        ctx.writeAndFlush(Unpooled.copiedBuffer(UUID.randomUUID().toString(),StandardCharsets.UTF_8));
    }
}
```

运行上述代码，每次运行客户端，服务端收到的内容不同，有时在同一行，有时在不同行，客户端则是有时回送一个字符串，有时回送多个字符串，这就是TCP的粘包拆包现象

### 自定义协议解决TCP粘包拆包问题

使用自定义协议+编码解码器解决

关键是要解决服务器每次读取数据长度的问题

定义实体类

实体类有两个成员变量，第一个成员变量表示byte数组的长度

```java
public class Message {
    public Message(long len, byte[] content) {
        this.len = len;
        this.content = content;
    }

    public Message() {
    }

    public long getLen() {
        return len;
    }

    public void setLen(long len) {
        this.len = len;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "Message{" +
                "len=" + len +
                ", content=" + Arrays.toString(content) +
                '}';
    }

    private long len;
    private byte[] content;
}
```

解码器：

```java
public class MessageEncoder extends MessageToByteEncoder<Message> {
    @Override
    protected void encode(ChannelHandlerContext ctx, Message msg, ByteBuf out) throws Exception {
        System.out.println("编码方法调用");
        out.writeLong(msg.getLen());
        out.writeBytes(msg.getContent());
    }
}
```

编码器：

这里继承了ReplayingDecoder，不需要判断字节数是否够

```java
public class MessageDecoder extends ReplayingDecoder<Message> {
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        System.out.println("解码方法调用");
        long l = in.readLong();
        byte[] content = new byte[(int) l];
        in.readBytes(content);
        Message message = new Message(l, content);
        out.add(message);
    }
}
```

客户端Handler

```java
public class ClientHandler extends SimpleChannelInboundHandler<Message> {
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        for (int i = 0; i < 10; i++) {
            String msg="第"+i+"此蚌埠住了";
            byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
            Message message = new Message(bytes.length, bytes);
            ctx.writeAndFlush(message);
        }
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Message msg) throws Exception {
        System.out.println(new String(msg.getContent(), StandardCharsets.UTF_8));
    }
}
```

服务端Handler

```java
public class ServerHandler extends SimpleChannelInboundHandler<Message> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Message msg) throws Exception {
        System.out.println(new String(msg.getContent(), StandardCharsets.UTF_8));
        String content="扎不多得嘞";
        Message message = new Message(content.getBytes(StandardCharsets.UTF_8).length, content.getBytes(StandardCharsets.UTF_8));
        ctx.writeAndFlush(message);
    }
}
```

为服务端和客户端均添加编码、解码器即可，注意顺序

# RPC调用

### RPC流程

![image-20210816181235199](/Netty/image-20210816181235199.png)

RPC服务将2-11步封装起来，消费者只能看到调用与结果

### Netty实现RPC

##### 设计描述

1. 创建一个接口，定义抽象方法，用于消费者和提供者的约定
2. 创建一个提供者，该类需要监听消费者的请求，并按照约定返回数据
3. 创建一个消费者，该类需要透明的调用自己不存在的方法，内部需要使用Netty请求提供者返回数据

##### 具体实现

接口：

```java
public interface DemoInterface {

    /**
     * 返回逆序字符串
     * @param source 源串
     * @return 逆序字符串
     */
    String reverse(String source);

    /**
     * 返回两个整数的和
     * @param a 整数a
     * @param b 整数b
     * @return a+b
     */
    Integer sum(int a,int b);
}
```

Provider中的实现类:

```java
public class DemoInterfaceImpl implements DemoInterface {
    @Override
    public String reverse(String source) {
        return new StringBuilder(source).reverse().toString();
    }

    @Override
    public Integer sum(int a, int b) {
        return a + b;
    }
}
```

服务端Netty Handler

RPC要有规定传输格式，这里简化为使用井号分隔，分割后第一个字符串是要调用的方法名，之后是参数，由于只添加了String编码解码器，所有为了简化这里都用String传输

```java
public class NettyServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        String[] split = msg.toString().split("#");
        if ("reverse".equals(split[0])){
            String reverse = new DemoInterfaceImpl().reverse(split[1]);
            ctx.writeAndFlush(reverse);
        }else if ("sum".equals(split[0])){
            Integer sum = new DemoInterfaceImpl().sum(Integer.parseInt(split[1]), Integer.parseInt(split[2]));
            ctx.writeAndFlush(String.valueOf(sum));
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        ctx.channel().closeFuture();
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
    }
}
```

编写Netty服务端

```java
public class NettyServer {

    private NioEventLoopGroup boss;

    private NioEventLoopGroup worker;

    public void run(int port){
        this.boss=new NioEventLoopGroup(1);
        this.worker=new NioEventLoopGroup();
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap
                .group(boss,worker)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast(new StringEncoder())
                                .addLast(new StringDecoder())
                                .addLast(new NettyServerHandler());
                    }
                });
        try {
            ChannelFuture channelFuture = serverBootstrap.bind(port).sync();
            channelFuture.addListener((ChannelFutureListener) future -> {
                if (future.isSuccess()){
                    System.out.println("服务端启动成功");
                }
            });
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            this.boss.shutdownGracefully();
            this.worker.shutdownGracefully();
        }
    }
}
```

编写Provider启动类

```java
public class Server {
    public static void main(String[] args) {
        NettyServer nettyServer = new NettyServer();
        nettyServer.run(8848);
    }
}
```

编写Netty客户端Handler，客户端实现Callable接口，具体思路是在消费者发出RPC请求后，创建一个Handler对象，然后启动Netty客户端，添加Handler，调用了active方法，此时成员变量context被赋值，由于Handler实现了Callable接口，可以交给线程池运行，在call方法中发出RPC请求，并调用wait阻塞等待结果，read方法在服务提供者传回消息后调用，将结果赋给成员变量result并调用notify唤醒call方法，返回执行结果，call和read方法要使用synchronized同步

```java
public class NettyClientHandler extends ChannelInboundHandlerAdapter implements Callable {

    private ChannelHandlerContext context;

    private String result;

    private String params;

    public void setParams(String params) {
        this.params = params;
    }

    @Override
    public synchronized Object call() throws Exception {
        System.out.println("发出RPC请求");
        this.context.writeAndFlush(this.params);
        wait();
        return this.result;

    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        this.context=ctx;
    }

    @Override
    public synchronized void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        this.result=msg.toString();
        System.out.println("获取结果，准备唤醒");
        notify();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        ctx.channel().close();
    }
}
```

编写Netty客户端

静态代码块中初始化线程池与启动Netty客户端并连接，为连接添加监听，在连接成功后给标志位success赋值1，失败赋值为0，success初始值为-1，success要使用volatile保证对getInstance方法可见，getInstance方法接收一个Class对象使用动态代理创建一个此类对象，这样消费者在调用getInstance方法后获取到的就是接口的动态代理对象，可以直接调用方法。通过`Proxy.newProxyInstance`方法创建动态代理，由于只用了String编码解码器，所以要判断调用的method的返回值类型，如果是int就调用`parseInt`解析为int，将客户端Handler对象提交给线程池并调用get方法获取最终结果

```java
public class NettyClient {
    public static ExecutorService executorService;

    static {
        executorService = new ThreadPoolExecutor(
                Runtime.getRuntime().availableProcessors() / 2,
                Runtime.getRuntime().availableProcessors(),
                10,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(10),
                new ThreadPoolExecutor.DiscardPolicy());
        executorService.execute(NettyClient::init);
    }

    private static NettyClientHandler clientHandler;

    private volatile static int success=-1;

    public static void init(){
        clientHandler=new NettyClientHandler();
        NioEventLoopGroup eventExecutors = new NioEventLoopGroup();
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(eventExecutors)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast(new StringDecoder())
                                .addLast(new StringEncoder())
                                .addLast(clientHandler);
                    }
                });
        try {
            ChannelFuture channelFuture = bootstrap.connect("localhost",8848).sync();
            channelFuture.addListener((ChannelFutureListener) future -> {
                if (future.isSuccess()){
                    System.out.println("请求启动成功");
                    success=1;
                }else{
                    success=0;
                }
            });
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            System.out.println("连接断开");
        }finally {
            eventExecutors.shutdownGracefully();
        }
    }

    public Object getInstance(Class<?> service){
        return Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader()
                , new Class<?>[]{service}, ((proxy, method, args) -> {
                    while (success<=0);
                    String str=method.getName();
                    for (Object arg : args) {
                        str+="#"+arg;
                    }
                    clientHandler.setParams(str);
                    return method.getReturnType()==Integer.class
                            ?Integer.parseInt(executorService.submit(clientHandler).get().toString())
                            :executorService.submit(clientHandler).get();
                }));
    }
}
```

编写消费者

```java
public class Client {

    public static void main(String[] args) {
        NettyClient nettyClient = new NettyClient();
        DemoInterface instance = (DemoInterface) nettyClient.getInstance(DemoInterface.class);
        String result = instance.reverse("蚌埠住了");
        System.out.println(result);
        System.out.println(instance.sum(1, 2));
        NettyClient.executorService.shutdownNow();
    }
}
```
