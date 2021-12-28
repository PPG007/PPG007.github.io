# URL 通信

```java
public void test() throws IOException {
    //构造一个URL对象
    URL url = new URL("http://localhost:8080/33bae299.png");
	//开启连接
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.connect();
    //获取输入流
    InputStream inputStream = connection.getInputStream();
    FileOutputStream fileOutputStream = new FileOutputStream("D:\\Javaweb\\Java-Basic\\Net\\src\\url.png");
    byte[] buffer = new byte[1024];
    int len;
    //保存到文件
    while ((len=inputStream.read(buffer))!=-1){
        fileOutputStream.write(buffer,0,len);
    }
    //关闭资源
    fileOutputStream.close();
    inputStream.close();
    connection.disconnect();
}
```
