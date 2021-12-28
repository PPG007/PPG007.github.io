---
prev:
  text: 首页
  link: /javanet
---

# TCP 通信

## 简单通信

客户端：

```java
public void client() throws IOException {
    //创建socket对象，指定服务器主机和端口号
    Socket socket = new Socket(InetAddress.getLocalHost(),8848);
    //获取输出流
    OutputStream outputStream = socket.getOutputStream();
    //写入内容
    outputStream.write("测试".getBytes(StandardCharsets.UTF_8));
    //关闭流
    outputStream.close();
    //关闭socket
    socket.close();
}
```

服务端：

```java
public void server() {
    try(ServerSocket serverSocket = new ServerSocket(8848);//创建服务端socket对象
        Socket accept = serverSocket.accept();//接收发送socket
        InputStream inputStream = accept.getInputStream();//获取输入流
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();){//创建字节输出流
        byte[] buffer = new byte[1024];
        int len;
        while ((len=inputStream.read(buffer))!=-1){
            //将内容写入字节数组输出流中
            byteArrayOutputStream.write(buffer,0,len);
        }
        //输出获取到的内容
        System.out.println(byteArrayOutputStream);
    }catch (Exception e){
        e.printStackTrace();
    }
}
```

## 发送文件

客户端：

```java
public void fileClient(){
    try(Socket socket = new Socket(InetAddress.getLocalHost(),8848);
        OutputStream outputStream = socket.getOutputStream();
        InputStream inputStream=socket.getInputStream();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        FileInputStream fileInputStream = new FileInputStream("D:\\Javaweb\\Java-Basic\\IO\\src\\1.jpg")){
        byte[] buffer = new byte[1024];
        int len;
        //将文件使用字节流输出
        while ((len=fileInputStream.read(buffer))!=-1){
            outputStream.write(buffer,0,len);
        }
        //关闭输出流，否则服务端无法获取发送的流何时结束导致一直等待
        socket.shutdownOutput();
        //获取服务端返回的信息并输出
        while ((len=inputStream.read(buffer))!=-1){
            byteArrayOutputStream.write(buffer,0,len);
        }
        System.out.println(byteArrayOutputStream);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

服务端：

```java
public void fileServer(){

    try(ServerSocket serverSocket = new ServerSocket(8848);
        Socket accept = serverSocket.accept();
        InputStream acceptInputStream = accept.getInputStream();
        OutputStream acceptOutputStream = accept.getOutputStream();
        FileOutputStream fileOutputStream = new FileOutputStream("D:\\Javaweb\\Java-Basic\\Net\\src\\1.jpg");) {
        byte[] buffer = new byte[1024];
        int len;
        //接收文件
        while ((len=acceptInputStream.read(buffer))!=-1){
            fileOutputStream.write(buffer,0,len);
        }
        //发送回复信息
        acceptOutputStream.write("接收成功".getBytes());
    }catch (IOException e){
        e.printStackTrace();
    }
}
```
