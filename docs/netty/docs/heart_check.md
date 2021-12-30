# Netty 心跳检测

服务端配置心跳检测处理器：

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

自定义 IdleEvent 处理器：

重写 `userEventTriggered` 方法即可。

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
