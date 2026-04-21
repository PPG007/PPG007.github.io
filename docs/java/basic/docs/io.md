# IO

## File

Java 标准库 `java.io` 提供了 `File` 对象来操作文件和目录，要构造一个 `File` 对象，需要传入一个字符串参数，表示文件或目录的绝对路径或相对路径：

```java
File file = new File("path/to/file");
```

`File` 对象有三种形式表示的路径，一种是 `getPath`，返回构造方法传入的路径，一种是 `getAbsolutePath`，返回绝对路径，另一种是 `getCanonicalPath`，它和绝对路径相似，但是返回的是规范路径。

绝对路径可以表示成 `C:\Windows\System32\..\java`，而规范路径会解析掉 `..`，返回 `C:\Windows\java`。

因为 Windows 和 Linux 的路径分隔符不同，因此 `File` 类提供了一个静态常量 `separator`，表示当前系统的路径分隔符：

```java
String path = "path" + File.separator + "to" + File.separator + "file";
```

### 文件和目录

`File` 对象既可以表示文件，也可以表示目录。而且即使在构造 `File` 对象时传入的文件或目录不存在，代码也不会出错，因为构造一个 `File` 对象不会导致任何的磁盘操作，只有当调用 `File` 对象的方法时，才真正进行磁盘操作。

例如，调用 `isFile` 方法判断 `File` 对象是否是一个已经存在的文件，调用 `isDirectory` 方法判断该 `File` 对象是否是一个已存在的目录：

```java
public class Main {
    public static void main(String[] args) {
        File file = new File("src/main/resources/test.txt");
        System.out.println(file.isFile());
        System.out.println(file.isDirectory());
    }
}
```

用 `File` 对象获取到一个文件时，还可以进一步判断文件的权限和大小：

```java
public class Main {
    static void main() {
        File file = new File("src/main/resources/test.txt");
        System.out.println(file.canRead());
        System.out.println(file.canWrite());
        System.out.println(file.canExecute());
        System.out.println(file.length()); // 文件大小，单位是字节
    }
}
```

### 创建和删除文件

当 `File` 对象表示一个文件时，可以通过 `createNewFile` 创建一个新文件，用 `delete` 删除该文件：

```java
public class Main {
    static void main() throws IOException {
        File file = new File("src/main/resources/new.txt");
        System.out.println(file.createNewFile());
        System.out.println(file.delete());
    }
}
```

有时候程序需要操作一些临时文件，`File` 对象提供了 `createTempFile` 方法创建一个临时文件，以及 `deleteOnExit` 方法在 JVM 退出时删除该文件：

```java
public class Main {
    static void main() throws IOException {
        File file = new File("src/main/resources/new.txt");
        System.out.println(file.createNewFile());
        System.out.println(file.delete());
    }
}
```

### 遍历文件和目录

当 `File` 对象表示一个目录时，可以通过 `list` 和 `listFiles` 列出目录下的文件和子目录名，`listFiles()` 提供了一系列重载方法，可以过滤不想要的文件和目录：

```java
public class Main {
    static void main() throws IOException {
        File dir = new File("src/main/resources");
        System.out.println(Arrays.toString(dir.listFiles()));
        System.out.println(Arrays.toString(dir.listFiles((dir1, name) -> name.endsWith(".txt"))));
    }
}
```

和文件操作类似，`File` 对象也提供了创建和删除目录的方法：

- `mkdir` 创建一个目录，如果父目录不存在则创建失败；
- `mkdirs` 创建一个目录，如果父目录不存在则一并创建；
- `delete` 删除一个目录，只有当目录为空时才能删除成功。

### Path

Java 标准库还提供了一个 `Path` 对象，它位于 `java.nio.file` 包，`Path` 对象和 `File` 对象类似，但是操作更加简单：

```java
public class Main {
    static void main() throws IOException {
        Path p = Paths.get(".", "src", "main", "resources", "test.txt");
        System.out.println(p);
        System.out.println(p.toAbsolutePath());
        System.out.println(p.normalize());
        System.out.println(p.toFile().isFile());
    }
}
```

如果需要对目录进行复杂的拼接、遍历等操作，使用 `Path` 对象会比 `File` 对象更方便。

## InputStream

InputStream 是 Java 标准库提供的最基本的输入流，InputStream 是一个抽象类，它是所有输入流的超类，这个抽象类定义的一个最重要的方法就是 `int read()`。这个方法会读取输入流的下一个字节，并返回字节表示的 int 值，如果已经读到末尾，则返回 -1。

`FileInputStream` 是 `InputStream` 的一个子类，它可以从文件中读取数据：

```java
public static void main() throws Exception {
    InputStream stream = new FileInputStream("src/test.properties");
    while (true) {
        int n = stream.read();
        if (n == -1) {
            break;
        }
        System.out.println(n);
    }
    stream.close();
}
```

`InputStream` 和 `OutputStream` 都需要通过 `close` 方法来关闭流，关闭流会释放系统资源，因此在使用完流之后一定要记得关闭它们。因此，可以将 `close` 放在 finally 中：

```java
public static void main() throws IOException {
    InputStream stream = new FileInputStream("src/test.properties");
    try {
        while (true) {
            int n = stream.read();
            if (n == -1) {
                break;
            }
            System.out.println(n);
        }
    } finally {
        stream.close();
    }
}
```

或者使用 JDK7 引入的 try-with-resources 语法，只需要编写 `try` 语句，让编译器为我们自动关闭资源：

```java
public static void main() throws IOException {
    try (InputStream stream = new FileInputStream("src/test.properties")) {
        while (true) {
            int n = stream.read();
            if (n == -1) {
                break;
            }
            System.out.println(n);
        }
    }
}
```

自动关闭是通过 `AutoCloseable` 接口实现的，任何实现了 `AutoCloseable` 接口的类都可以使用 try-with-resources 语法来自动关闭资源。

### 缓冲

`InputStream` 提供了两个重载方法来实现读取多个字节：

- `int read(byte[] b)`：将输入流中的数据读取到字节数组 `b` 中，返回实际读取的字节数。
- `int read(byte[] b, int off, int len)`：将输入流中的数据读取到字节数组 `b` 中，从偏移量 `off` 开始，最多读取 `len` 个字节，返回实际读取的字节数。

```java
public static void main() throws IOException {
    try (InputStream stream = new FileInputStream("src/test.properties")) {
        byte[] buffer = new byte[10];
        int n = 0;
        do {
            n = stream.read(buffer);
            if (n != -1) {
                System.out.println(new String(buffer, 0, n));
            }
        } while (n != -1);
    }
}
```

### 阻塞

在调用 `InputStream` 的 `read` 方法时，如果输入流中没有数据可供读取，调用线程会被阻塞，直到有数据可供读取或者输入流被关闭。

## OutputStream

和 `InputStream` 相反，`OutputStream` 是 Java 标准库提供的最基本的输出流，`OutputStream` 是一个抽象类，它是所有输出流的超类，这个抽象类定义的一个最重要的方法就是 `void write(int b)`。这个方法会写入一个字节到输出流，虽然传入的是 `int` 参数，但只会写入一个字节，即只写入参数的最低 8 位。

除了 `close` 方法外，`OutputStream` 还提供了一个 `flush` 方法，`flush` 方法会将缓冲区中的数据强制写入到输出流中，通常在写入数据之后调用 `flush` 方法，以确保数据被及时写入到输出流中。

### FileOutputStream

可以使用 `FileOutputStream` 来将数据写入到文件中：

```java
public static void main() throws IOException {
    OutputStream stream = new FileOutputStream("src/out.txt");
    stream.write(72);
    stream.write(101);
    stream.write(108);
    stream.write(108);
    stream.write(111);
    stream.close();
}
```

每次写入一个字节太麻烦，可以一次写入多个：

```java
public static void main() throws IOException {
    OutputStream stream = new FileOutputStream("src/out.txt");
    stream.write("Hello, World!".getBytes(StandardCharsets.UTF_8));
    stream.close();
}
```

和 InputStream 一样，OutputStream 也可以使用 try-with-resources 语法来自动关闭：

```java
public static void main() throws IOException {
    try (OutputStream stream = new FileOutputStream("src/out.txt")) {
        stream.write("Hello, World!".getBytes(StandardCharsets.UTF_8));
    }
}
```

### 阻塞

在调用 `OutputStream` 的 `write` 方法时，如果输出流的缓冲区已满，调用线程会被阻塞，直到有足够的空间可供写入或者输出流被关闭。

## 装饰器模式

当我们要实现带有缓冲区、加密、压缩等功能的输入流或输出流时，可以使用装饰器模式来实现。装饰器模式是一种设计模式，它允许我们在不修改原有类的基础上，动态地添加新的功能。

在 Java IO 中，装饰器模式的实现对应着 `FilterInputStream` 和 `FilterOutputStream` 这两个抽象类，它们分别是输入流和输出流的装饰器基类，所有的装饰器类都继承自这两个抽象类。

一个 `InputStream` 可以和任意个 `FilterInputStream` 进行组合。

一个 `OutputStream` 也可以和任意个 `FilterOutputStream` 进行组合。

## Zip

`ZipInputStream` 是一种 `FilterInputStream`，它可以直接读取 zip 包的内容，另外还有一个 `JarInputStream`，它是 `ZipInputStream` 的子类，它的主要功能是直接读取 jar 包中的 `MANIFEST.MF` 文件，因为本质上 jar 包就是 zip 包，只是附加了一些固定的描述文件。

### 读取 zip 包

```java
public static void main() throws IOException {
    try (InputStream stream = new FileInputStream("src/test.zip");
         ZipInputStream zipInputStream = new ZipInputStream(stream)) {
        ZipEntry entry;
        while ((entry = zipInputStream.getNextEntry()) != null) {
            System.out.println(entry.getName());
            // 读取 entry 的内容
            byte[] buffer = new byte[1024];
            int n;
            while ((n = zipInputStream.read(buffer)) != -1) {
                System.out.write(buffer, 0, n);
            }
        }
    }
}
```

### 写入 zip 包

```java
public static void main() throws IOException {
    try (OutputStream stream = new FileOutputStream("src/test.zip");
         ZipOutputStream zipOutputStream = new ZipOutputStream(stream)) {
        ZipEntry entry = new ZipEntry("test.txt");
        zipOutputStream.putNextEntry(entry);
        zipOutputStream.write("Hello, World!".getBytes(StandardCharsets.UTF_8));
        zipOutputStream.closeEntry();
    }
}
```

## 读取 classpath

由于 classpath 中可以包含其他类型的文件，而且从 classpath 读取文件可以避免不同环境下的路径问题，因此如果我们要编写一个库或者框架，最好将资源文件放在 classpath 中。

要读取 classpath 中的文件，需要先获取当前的 `Class` 对象，然后调用 `getResourceAsStream` 方法来获取一个输入流：

```java
public static void main() throws IOException {
    InputStream stream = Main.class.getResourceAsStream("/test.properties");
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
    }
}
```

::: tip

classpath 中的资源文件路径总是以 `/` 开头。

如果资源文件不存在，`getResourceAsStream` 方法会返回 `null`，因此在使用之前需要进行 null 判断。

:::

## 序列化

一个 Java 对象要能被序列化，必须实现 `java.io.Serializable` 接口，这个接口是一个标记接口，它没有任何方法，表示实现了这个接口的类可以被序列化。

把一个 Java 对象变为 `byte[]` 需要使用 `ObjectOutputStream`，它负责把一个 Java 对象写入一个字节流：

```java
public static void main() throws IOException {
    OutputStream stream = new FileOutputStream("src/out.obj");
    ObjectOutputStream objectOutputStream = new ObjectOutputStream(stream);
    objectOutputStream.writeObject(new Student(20));
    objectOutputStream.close();
    stream.close();
}
```

相对的，把一个 `byte[]` 变为 Java 对象需要使用 `ObjectInputStream`，它负责从一个字节流中读取一个 Java 对象：

```java
public static void main() throws IOException, ClassNotFoundException {
    InputStream stream = new FileInputStream("src/out.obj");
    ObjectInputStream objectInputStream = new ObjectInputStream(stream);
    Object obj = objectInputStream.readObject();
    Student s = (Student)obj;
    System.out.println(s);
    objectInputStream.close();
    stream.close();
}
```

通过 `readObject` 方法读取到的对象是一个 `Object` 类型，需要进行类型转换才能使用。这个方法可能抛出 `ClassNotFoundException` 异常，表示在反序列化过程中找不到对应的类，`InvalidClassException` 异常，表示在反序列化过程中发现了不兼容的类。

为了避免反序列化中由于类定义导致的不兼容，Java 的序列化允许 class 定义一个特殊的 `serialVersionUID` 字段，这个字段是一个 `long` 类型的常量，表示类的版本号，如果增加或者修改了字段，可以改变这个字段的值自动阻止不匹配的类被反序列化。

### 安全性

由于 Java 的序列化允许在不经过构造函数的情况下直接从 `byte[]` 创建一个 Java 对象，因此存在一定的安全隐患。一个精心构造的 `byte[]` 可以在被反序列化后执行特定的 Java 代码，从而导致严重的安全漏洞。

## Reader

与 `InputStream` 和 `OutputStream` 不同，`Reader` 和 `Writer` 是 Java 标准库提供的字符流，它们是专门用来处理字符数据的输入流和输出流。`Reader` 和 `Writer` 都是抽象类，它们定义了一系列的方法来读取和写入字符数据。

例如，通过 `FileReader` 来读取一个文本文件：

```java
public static void main() throws IOException, ClassNotFoundException {
    Reader reader = new FileReader("src/out.txt", StandardCharsets.UTF_8);
    while (true) {
        int n = reader.read();
        if (n == -1) {
            break;
        }
        System.out.println((char) n);
    }
    reader.close();
}
```

为了避免乱码问题，最好手动指明字符编码。

如果已经持有一个 `InputStream` 对象，也可以通过 `InputStreamReader` 来将它转换为一个 `Reader` 对象：

```java
public static void main() throws IOException, ClassNotFoundException {
    InputStream stream = new FileInputStream("src/out.txt");
    Reader reader = new InputStreamReader(stream, StandardCharsets.UTF_8);
    while (true) {
        int n = reader.read();
        if (n == -1) {
            break;
        }
        System.out.println((char) n);
    }
    reader.close();
    stream.close();
}
```

## Writer

与 `Reader` 类似，`Writer` 是 Java 标准库提供的字符流输出流，它是一个抽象类，定义了一系列的方法来写入字符数据。

常用的实现有 `FileWriter`、`OutputStreamWriter` 等。

## PrintStream 和 PrintWriter

`PrintStream` 是一种 `FilterOutputStream`，它在 `OutputStream` 的接口上，额外提供了一些写入各种数据类型的方法：

- 写入 int： `void print(int i)`
- 写入 long： `void print(long l)`
- 写入 float： `void print(float f)`
- 写入 double： `void print(double d)`
- .....

同时还有对应的 `println` 方法，在写入数据之后会自动写入一个换行符。

`System.out.println` 就是使用 `PrintStream` 打印各种数据，其中 `System.out` 是系统默认提供的 `PrintStream` 对象，表示标准输出流。

此外，`System.err` 也是一个 `PrintStream` 对象，表示标准错误流。

通过调用 `System.setIn(InputStream)`、`System.setOut(PrintStream)` 方法可以指定输入输出流。

与 `OutputStream` 相比，`PrintStream` 的 `print` 和 `println` 方法不会抛出 `IOException` 异常，因此在使用 `PrintStream` 时不需要进行异常处理。

### PrintWriter

`PrintStream` 输出的总是 `byte` 数据，而 `PrintWriter` 则是扩展了 `Writer` 接口，它的 `print` 和 `println` 方法输出的是 char 数据，二者的使用几乎是一样的。

## 随机存取文件流

随机存取文件流是 Java 标准库提供的一种特殊的输入输出流，它允许我们在文件的任意位置进行读写操作，而不需要按照顺序进行读写。

随机存取文件流的类是 `RandomAccessFile`，它既实现了 `DataInput` 接口，也实现了 `DataOutput` 接口，因此它既可以读取数据，也可以写入数据：

```java
public static void main() throws IOException {
    RandomAccessFile rw = new RandomAccessFile("src/rand.txt", "rw");
    rw.writeBoolean(true);
    rw.seek(0);
    rw.writeChar(97);
    rw.close();
    RandomAccessFile r = new RandomAccessFile("src/rand.txt", "r");
    r.seek(1);
    System.out.println(r.readBoolean());
    r.seek(0);
    System.out.println(r.readChar());
    r.close();
}
```

## Files

从 JDK7 开始，Java 标准库提供了一个 `Files` 工具类，能极大地方便读写文件。

例如将一个文件读取为 `byte[]`：

```java
byte[] data = Files.readAllBytes(Paths.get("src/test.properties"));
```

如果是文本文件，可以直接读取为 `String`：

```java
String content = Files.readString(Paths.get("src/test.properties"), StandardCharsets.UTF_8);
```

或者按行读取：

```java
List<String> lines = Files.readAllLines(Paths.get("src/test.properties"), StandardCharsets.UTF_8);
```

写入文件也很方便：

```java
Files.write(Paths.get("src/out.txt"), "Hello, World!".getBytes(StandardCharsets.UTF_8));
```

## 总结

下表整理了 Java IO 中常见的字节流和字符流实现：

| 分类       | 字节输入流           | 字节输出流            | 字符输入流        | 字符输出流         |
| ---------- | -------------------- | --------------------- | ----------------- | ------------------ |
| 抽象基类   | InputStream          | OutputStream          | Reader            | Writer             |
| 访问文件   | FileInputStream      | FileOutputStream      | FileReader        | FileWriter         |
| 访问数组   | ByteArrayInputStream | ByteArrayOutputStream | CharArrayReader   | CharArrayWriter    |
| 访问管道   | PipedInputStream     | PipedOutputStream     | PipedReader       | PipedWriter        |
| 访问字符串 | -                    | -                     | StringReader      | StringWriter       |
| 缓冲流     | BufferedInputStream  | BufferedOutputStream  | BufferedReader    | BufferedWriter     |
| 转换流     | -                    | -                     | InputStreamReader | OutputStreamWriter |
| 对象流     | ObjectInputStream    | ObjectOutputStream    | -                 | -                  |
| 过滤流     | FilterInputStream    | FilterOutputStream    | FilterReader      | FilterWriter       |
| 打印流     | -                    | PrintStream           | -                 | PrintWriter        |
| 推回输入流 | PushbackInputStream  | -                     | PushbackReader    | -                  |
| 特殊流     | DataInputStream      | DataOutputStream      | -                 | -                  |
