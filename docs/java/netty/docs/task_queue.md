# 任务队列 Task

## 用户程序自定义的普通任务

在 handler 类中通过 `ctx.channel().eventLoop().execute()` 方法执行即可，但是任务添加到队列后是单线程运行的。

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

## 用户自定义定时任务

在 handler 类中使用 `ctx.channel().eventLoop().schedule()` 方法执行即可。

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

## 非当前 Reactor 线程调用 channel 的各种方法

推送系统根据用户标识找到对应的 channel 调用 write 推送信息，write 被提交到任务队列中异步消费。

## Netty 搭建简单 HTTP服务器

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
