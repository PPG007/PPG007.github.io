# 客户端 API

## 导入依赖

```xml
<!-- https://mvnrepository.com/artifact/org.apache.zookeeper/zookeeper -->
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.7.0</version>
</dependency>
```

## 创建节点

远程服务器超时时间要设置的久一些：

```java
public static void main(String[] args) throws IOException, InterruptedException, KeeperException {
    int timeOut=200000;
    String connectStr="150.158.153.216:2181,39.107.112.172:2181,115.28.211.227:2181";//使用逗号分隔，不能带空格
    ZooKeeper zooKeeper = new ZooKeeper(connectStr, timeOut, watchedEvent -> System.out.println(watchedEvent.getState()));


    String s = zooKeeper.create("/sanguo", "sanguo".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);

}
```

## 监听节点变化

创建监听方法，此方法阻塞：

```java
@org.junit.Test
public void getChildren() throws IOException, InterruptedException, KeeperException {
    zooKeeper.getChildren("/",true);//第二个参数为true表示使用创建zookeeper时定义的监听器
    System.in.read();
}
```

循环注册，循环监听：

```java
@Before
public void init() throws IOException {
    int timeOut=200000;
    String connectStr="150.158.153.216:2181,39.107.112.172:2181,115.28.211.227:2181";
    zooKeeper = new ZooKeeper(connectStr, timeOut, watchedEvent -> {
        List<String> children = null;
        try {
            children = zooKeeper.getChildren("/", true);
        } catch (KeeperException | InterruptedException e) {
            e.printStackTrace();
        }
        assert children != null;
        for (String child : children) {
            System.out.println(child);
        }
    });
}
```

## 判断节点是否存在

```java
@org.junit.Test
public void exist() throws InterruptedException, KeeperException {
    Stat exists = zooKeeper.exists("/sanguo", false);
    if (exists == null) {
        System.out.println("节点：[/sanguo] 不存在");
    }else {
        System.out.println("节点：[/sanguo] 存在");
    }
}
```
