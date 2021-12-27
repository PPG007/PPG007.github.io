---
prev:
  text: 首页
  link: /javaio
---

# 节点流

## 使用字符输入流 FileReader 访问文件

使用无参 `read()` 方法：

```java
File file = new File("D:\\Javaweb\\Java-Basic\\IO\\src\\test.json");
try (FileReader fileReader = new FileReader(file)) {//这种写法不需要在finally中关闭FileReader
    int data;
    while ((data = fileReader.read()) != -1) {//读到-1表示文件结束
        System.out.print(((char) data));
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

::: warning
如果创建 FileReader 不在 try 括号内，则要在 finally 中关闭流，且创建过程要使用 try...catch 包裹，防止抛出异常后不关闭流。
:::

使用有参 `read()` 方法，传入一个 char 数组：

```java
File file = new File("D:\\Javaweb\\Java-Basic\\IO\\src\\test.json");
try (FileReader fileReader = new FileReader(file)){
    char[] buffer=new char[1000];
    int data;
    while ((data=fileReader.read(buffer))!=-1){
        //写法一：直接输出char数组，注意遍历的终点是read方法的返回值
        //如果最后一次读取的字符内容无法填充满缓冲数组，缺少的部分仍然保存上次读出的结果
        //                for (int i = 0; i < data; i++) {
        //                    System.out.print(buffer[i]);
        //                }
        //写法二：使用String有参构造输出String，第一个参数是char数组，后两个参数分别是希望获取的数组的起点和终点
        System.out.println(new String(buffer, 0, data));
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

## 使用字符输出流FileWriter输出到文件

对应文件可以不存在

- 覆盖原内容

```java
File file = new File(PATH_PREFIX + "out.txt");
try (FileWriter fileWriter = new FileWriter(file)) {
    fileWriter.write("Hello\nWorld");
} catch (IOException e) {
    e.printStackTrace();
}
```

- 在原内容后添加

```java
File file = new File(PATH_PREFIX + "out.txt");
try (FileWriter fileWriter = new FileWriter(file,true)) {
    fileWriter.write("Hello\nWorld");
} catch (IOException e) {
    e.printStackTrace();
}
```

## 使用字节输入输出流复制图片

```java
File in = new File(PATH_PREFIX + "1.jpg");
File out = new File(PATH_PREFIX + "2.jpg");
FileInputStream fileInputStream = new FileInputStream(in);
FileOutputStream fileOutputStream = new FileOutputStream(out);
byte[] buffer = new byte[100];
while (fileInputStream.read(buffer) !=-1){
    fileOutputStream.write(buffer);
}
fileOutputStream.close();
fileInputStream.close();
```
