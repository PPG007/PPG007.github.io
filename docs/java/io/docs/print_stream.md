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
