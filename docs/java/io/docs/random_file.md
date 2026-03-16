# 随机存取文件流

多线程断点下载。

- r：以只读方式打开。
- rw：读写。
- rwd：读写、同步文件内容的更新。
- rws：读写、同步文件内容和元数据的更新。

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
