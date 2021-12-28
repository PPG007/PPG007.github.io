
# UDP 通信

## 简单通信

客户端：

```java
public void sender(){
    try(DatagramSocket datagramSocket = new DatagramSocket()){
        String str="蚌埠住了";
        //创建数据报文
        DatagramPacket datagramPacket = new DatagramPacket(str.getBytes(), 0,str.getBytes().length, InetAddress.getLocalHost(), 8848);
        //发送数据报文
        datagramSocket.send(datagramPacket);
    }catch (IOException e){
        e.printStackTrace();
    }
}
```

服务端：

```java
public void receiver(){
    try(DatagramSocket datagramSocket=new DatagramSocket(8848)){
        byte[] buffer = new byte[1024];
        DatagramPacket datagramPacket = new DatagramPacket(buffer, 0, buffer.length);
        //接收数据报文
        datagramSocket.receive(datagramPacket);
        System.out.println(new String(datagramPacket.getData(),0,datagramPacket.getLength()));
    }catch (IOException e){
        e.printStackTrace();
    }
}
```

## 发送文件

::: warning 注意
使用 UDP 发送文件时，文件不能太大，且大小要已知，一般不用来传输文件。
:::

客户端：

```java
public void sender(){

    try(DatagramSocket datagramSocket = new DatagramSocket();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();){
        FileInputStream fileInputStream = new FileInputStream("D:\\Javaweb\\Java-Basic\\Net\\src\\3.png");
        byte[] buffer = new byte[1024];
        int len;
        while ((len=fileInputStream.read(buffer))!=-1){
            byteArrayOutputStream.write(buffer,0,len);
        }
        byte[] sendPacket = byteArrayOutputStream.toByteArray();
        System.out.println(sendPacket.length);
        DatagramPacket datagramPacket = new DatagramPacket(sendPacket, 0,sendPacket.length,InetAddress.getLocalHost(), 8848);
        datagramSocket.send(datagramPacket);
    }catch (IOException e){
        e.printStackTrace();
    }
}
```

服务端：

```java
public void receiver(){
    try(DatagramSocket datagramSocket=new DatagramSocket(8848);
        FileOutputStream fileOutputStream = new FileOutputStream("D:\\Javaweb\\Java-Basic\\Net\\src\\2.png");){
        byte[] buffer = new byte[58920];
        DatagramPacket datagramPacket = new DatagramPacket(buffer, 0, buffer.length);
        datagramSocket.receive(datagramPacket);
        byte[] data = datagramPacket.getData();
        System.out.println(data.length);
        fileOutputStream.write(data,0,data.length);
    }catch (IOException e){
        e.printStackTrace();
    }
}
```
