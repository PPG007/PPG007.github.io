# 缓冲流

## 字节流

```java
//创建文件对象
File in = new File(PATH_PREFIX + "1.jpg");
File out = new File(PATH_PREFIX + "3.jpg");
//创建节点流
FileInputStream fileInputStream = new FileInputStream(in);
FileOutputStream fileOutputStream = new FileOutputStream(out);
//创建缓冲流
BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
byte[] buffer = new byte[1024];
int len;
//读取、写入
while ((len=bufferedInputStream.read(buffer))!=-1){
    bufferedOutputStream.write(buffer,0,len);
    //flush()方法刷新缓冲区
}
//关闭流，先开后关
bufferedOutputStream.close();
bufferedInputStream.close();
fileOutputStream.close();
fileInputStream.close();
```

## 字符流

```java
File in = new File(PATH_PREFIX + "1.txt");
File out = new File(PATH_PREFIX + "2.txt");
FileReader fileReader = new FileReader(in);
FileWriter fileWriter = new FileWriter(out);
BufferedReader bufferedReader = new BufferedReader(fileReader);
BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
//        方式一
//        char[] buffer=new char[1024];
//        int len;
//        while ((len=bufferedReader.read(buffer))!=-1){
//            bufferedWriter.write(buffer,0,len);
//        }

//        方式二
String buffer;
while ((buffer=bufferedReader.readLine())!=null){
    //不包含换行符
    bufferedWriter.write(buffer);
    //            使用newLine方法换行或拼接转义字符换行
    //            bufferedWriter.newLine();

}
bufferedWriter.close();
bufferedReader.close();
fileWriter.close();
fileReader.close();
```
