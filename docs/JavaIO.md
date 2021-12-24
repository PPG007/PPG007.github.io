![](/JavaIO/IO.jpg)

# 节点流

### 使用字符输入流FileReader访问文件

使用无参read()方法

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

如果创建FileReader不在try括号内，则要在finally中关闭流，且创建过程要使用try...catch包裹，防止抛出异常后不关闭流

使用有参read()方法，传入一个char数组

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

### 使用字符输出流FileWriter输出到文件

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

### 使用字节输入输出流复制图片

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

# 缓冲流

### 字节流

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



### 字符流

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
}
```

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

# 标准输入输出流

```java
System.in//标准输入流
System.out//标准输出流
System.err//标准错误流
//调用System的setIn(InputStream)、setOut(PrintStream)方法 指定输入输出流
```

# 打印流

```java
PrintStream
PrintWriter
PrintWriter printWriter = new PrintWriter(new FileWriter(PATH_PREFIX + "3.txt"));
printWriter.print(PATH_PREFIX);
printWriter.close();
System.setOut(new PrintStream(PATH_PREFIX+"3.txt"));
for (int i = 0; i < 100; i++) {
    System.out.println(i);
}
```

# 数据流

```java
DataOutputStream dataOutputStream = new DataOutputStream(new FileOutputStream(PATH_PREFIX + "3.txt"));
dataOutputStream.writeUTF("PPG");
dataOutputStream.flush();
dataOutputStream.writeBoolean(true);
dataOutputStream.flush();
dataOutputStream.writeDouble(1.1);
dataOutputStream.flush();
dataOutputStream.close();

DataInputStream dataInputStream = new DataInputStream(new FileInputStream(PATH_PREFIX + "3.txt"));
System.out.println(dataInputStream.readUTF());
System.out.println(dataInputStream.readBoolean());
System.out.println(dataInputStream.readDouble());
dataInputStream.close();
```

# 对象流

`ObjectOutputStream` `ObjectInputStream`

不能序列化`static`和`transient`修饰的变量，且序列化、反序列化的类必须实现序列化接口

```java
Person person = new Person();
person.setName("PPG");
person.setAge(21);
person.setSex("male");
ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(PATH_PREFIX + "person"));
objectOutputStream.writeObject(person);
objectOutputStream.flush();
objectOutputStream.close();
ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(PATH_PREFIX + "person"));
Person readObject = (Person) objectInputStream.readObject();
System.out.println(readObject);
objectOutputStream.flush();
objectOutputStream.close();
```

person类

```java
public class Person implements Serializable {
	//表明类的不同版本间的兼容性，不指定就是Java运行时环境自动生成，若类实例变量做出了修改，这个值可能会变，建议显式指定
    public static final long serialVersionUID = 41241252L;

    private String name;
    private String sex;
    private Integer age;

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                ", age=" + age +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Person person = (Person) o;

        if (!name.equals(person.name)) return false;
        if (!sex.equals(person.sex)) return false;
        return age.equals(person.age);
    }

    @Override
    public int hashCode() {
        int result = name.hashCode();
        result = 31 * result + sex.hashCode();
        result = 31 * result + age.hashCode();
        return result;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Person() {
    }
}
```

进行反序列化时，jvm将传进字节流的序列化ID与本地实体类的序列化ID比较如果相同则可以进行反序列化，否则异常

# 随机存取文件流

多线程断点下载

- r：以只读方式打开
- rw：读写
- rwd：读写、同步文件内容的更新
- rws：读写、同步文件内容和元数据的更新

```java
RandomAccessFile rw = new RandomAccessFile(PATH_PREFIX + "rand.txt", "rw");
rw.writeBoolean(true);
//指定写入位置
rw.seek(0);
rw.writeChar(97);
rw.close();
RandomAccessFile r = new RandomAccessFile(PATH_PREFIX + "rand.txt", "r");
r.seek(1);
System.out.println(r.readBoolean());
r.seek(0);
System.out.println(r.readChar());
r.close();
```

