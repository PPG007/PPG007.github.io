# 转换流

```java
File in = new File(PATH_PREFIX + "1.txt");
File out = new File(PATH_PREFIX + "2.txt");
FileInputStream fileInputStream = new FileInputStream(in);
FileOutputStream fileOutputStream = new FileOutputStream(out);
//        指定字节流和字符集
InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, StandardCharsets.UTF_8);
OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "GBK");
char[] buffer=new char[1024];
int len;
while ((len=inputStreamReader.read(buffer))!=-1){
    outputStreamWriter.write(new String(buffer,0,len));
}
outputStreamWriter.close();
inputStreamReader.close();
fileInputStream.close();
```
