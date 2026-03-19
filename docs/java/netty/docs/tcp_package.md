# TCP粘包拆包

## 基本介绍

假设客户端分别发送了两个数据包 D1 和 D2 给服务端,由于服务端一次读取到字节数是不确定的,故可能存在以下四种情况:

- 服务端分两次读取到了两个独立的数据包,分别是 D1 和 D2,没有粘包和拆包。
- 服务端一次接受到了两个数据包,D1 和 D2 粘合在一起,称之为 _TCP 粘包_。
- 服务端分两次读取到了数据包,第一次读取到了完整的 D1 包和 D2 包的部分内容,第二次读取到了 D2 包的剩余内容,这称之为 _TCP 拆包_。
- 服务端分两次读取到了数据包,第一次读取到了 D1 包的部分内容 D11,第二次读取到了 D1 包的剩余部分内容 D12 和完整的 D2 包。

## TCP 粘包拆包示例

客户端向服务端循环发送 10 条数据：

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

服务端读取一次就回送一个随机字符串：

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

运行上述代码，每次运行客户端，服务端收到的内容不同，有时在同一行，有时在不同行，客户端则是有时回送一个字符串，有时回送多个字符串，这就是 TCP 的粘包拆包现象。

## 自定义协议解决 TCP 粘包拆包问题

使用自定义协议+编码解码器解决。

关键是要解决服务器每次读取数据长度的问题。

定义实体类，实体类有两个成员变量，第一个成员变量表示 byte 数组的长度：

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

编码器，这里继承了 ReplayingDecoder，不需要判断字节数是否够：

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

客户端 Handler：

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

服务端 Handler：

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

为服务端和客户端均添加编码、解码器即可，注意顺序。
