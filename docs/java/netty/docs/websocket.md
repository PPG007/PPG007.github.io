# WebSocket长连接

HTTP 传输的是帧，所以泛型都使用 Frame。

服务端：

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

自定义的处理器：

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

前端 HTML：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
    <script>
      let socket;
      if (window.WebSocket) {
        socket = new WebSocket('ws://localhost:8848/ppg');
        socket.onmessage = function (ev) {
          let res = document.getElementById('res');
          res.value = res.value + '\n' + ev.data;
        };
        socket.onopen = function () {
          let res = document.getElementById('res');
          res.value = '连接开启了';
        };
        socket.onclose = function () {
          let res = document.getElementById('res');
          res.value = res.value + '\n连接关闭了';
        };
      } else {
        alert('浏览器不支持WebSocket');
      }
      function send(msg) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(msg);
        } else {
          alert('未连接');
        }
      }
    </script>
  </head>
  <body>
    <form onsubmit="return false">
      <label>
        <textarea style="height: 300px;width: 300px" name="message"></textarea>
      </label>
      <input type="button" value="发送" onclick="send(this.form.message.value)" />
      <label>
        <textarea style="height: 300px;width: 300px" name="res" id="res"></textarea>
      </label>
      <input type="button" value="清空" onclick="document.getElementById('res').value=''" />
    </form>
  </body>
</html>
```
