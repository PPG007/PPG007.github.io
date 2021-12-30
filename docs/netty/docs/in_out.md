# Netty 入站出站机制

对客户端和服务端来说，向外发送是出站(相对自己)，向内接收是入站(相对自己)。

入站会调用解码器将字节解码成对象，出站会调用编码器，将对象编码成字节。

## 解码器 ByteToMessageDecoder

类图：

![image-20210815211039834](/Netty/image-20210815211039834.png)

由于不可能知道远程节点是否会一次性发送一个完整的信息，TCP 有可能出现粘包拆包的问题，这个类会对入站数据进行缓冲，直到它准备好被处理。

## 编码器 MessageToByteEncoder

![image-20210816132016781](/Netty/image-20210816132016781.png)

## Handler 链与编解码器调用实例

案例目标：客户端发送一个 Long 类型的数据，服务端接收到后回送一个 Long 类型数据。

Long 向字节转换编码器，LongToByteEncoder：

```java
public class LongToByteEncoder extends MessageToByteEncoder<Long> {
    @Override
    protected void encode(ChannelHandlerContext ctx, Long msg, ByteBuf out) throws Exception {
        out.writeLong(msg);
    }
}
```

字节向 Long 解码器，ByteToLongDecoder：

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

服务端初始化类：

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

客户端初始化类：

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

自定义 handler 直接调用 `writeAndFlush()` 方法传入一个 msg 即可。

::: warning
不论编码器和解码器，接收的消息类型必须与待处理的消息类型一致，否则 Handler 不会执行。
:::

## Netty 中其他常用编解码器

- ReplayingDecoder：

    ReplayingDecoder 扩展了 ByteToMessageDecoder 类,使用这个类,我们不必调用 `readableBytes()` 方法，即不需要判断字节数是否满足转换要求。

    示例：

    ```java
    public class ByteToLongDecoder2 extends ReplayingDecoder<Long> {

        @Override
        protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
            out.add(in.readLong());
        }
    }
    ```

    缺点：

    并不是所有的 ByteBuf 操作都被支持,如果调用了一个不被支持的方法,将会抛出一个 UnsupportedOperationException，ReplayingDecoder 在某些情况下可能稍慢于 ByteToMessageDecoder,例如网络缓慢并且消息格式复杂时,消息会被拆成了多个碎片,速度变慢。

- LineBasedFrameDecoder：使用行尾控制字符(`\n\r`)做分隔符解析数据。
- DelimiterBasedFrameDecoder：使用自定义的特殊字符作为消息的分隔符。
- Httpobjectdecoder：一个 HTTP 数据的解码器。
- LengthFieldBasedFrameDecoder：通过指定长度来标识整包消息,这样就可以自动的处理黏包和半包消息。
