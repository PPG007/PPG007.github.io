# Netty 案例：群聊系统

## 服务端

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

## 服务端处理器

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

## 客户端

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

## 客户端处理器

```java
public class ClientHandler extends SimpleChannelInboundHandler<String> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        System.out.print(msg);
    }
}
```
