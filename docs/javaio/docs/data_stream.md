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
