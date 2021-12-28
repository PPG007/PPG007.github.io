# 案例：服务器动态上下线

## 案例描述

创建服务器类和客户端类，服务器启动并连接成功后创建节点，客户端监听节点的变化，获取服务端上线情况，服务端退出前删除创建的节点，此时客户端会获取下线情况。

## 服务端编码

```java
public class Server {

    private ZooKeeper zooKeeper;

    private static final String CONNECT_STR="150.158.153.216:2181,39.107.112.172:2181,115.28.211.227:2181";

    private static final int TIMEOUT=200000;

    private final String serverName;

    private String path;

    public Server(String serverName) {
        this.serverName = serverName;
    }

    public static void main(String[] args) {
        Server server = new Server("server1");
        server.connect();
        server.register();
        server.process();

    }

    private void register() {//注册方法
        try {
            path=zooKeeper.create("/servers/"+serverName,serverName.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);//创建自己的节点
        } catch (KeeperException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void process() {//模拟服务端服务
        try {
            System.in.read();//阻塞于此
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            remove();//结束阻塞后删除创建的节点，尽管创建时设置为临时节点，但是不知道为何程序结束后还是存在
        }
    }

    private void remove() {//删除创建的节点
        try {
            zooKeeper.delete(this.path,-1);//第二个参数表示版本号，-1表示匹配任意版本号
        } catch (InterruptedException | KeeperException e) {
            e.printStackTrace();
        }
    }

    private void connect(){//连接zookeeper集群
        try {
            zooKeeper=new ZooKeeper(CONNECT_STR,TIMEOUT,watchedEvent -> {//监听是否连接成功
                if (watchedEvent.getState().equals(Watcher.Event.KeeperState.SyncConnected)){//连接成功提示
                    System.out.println(serverName+"连接成功");
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 客户端编码

```java
public class Client {

    private ZooKeeper zooKeeper;

    private static final String CONNECT_STR="150.158.153.216:2181,39.107.112.172:2181,115.28.211.227:2181";

    private static final int TIMEOUT=200000;

    private LinkedList<String> oldList = new LinkedList<>();

    private int time=0;

    public static void main(String[] args) {
        Client client = new Client();
        client.connect();
        client.watch();

    }

    private void watch() {//监视
        try {
            System.in.read();//阻塞于此
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void connect() {//连接zookeeper集群
        try {
            zooKeeper=new ZooKeeper(CONNECT_STR,TIMEOUT ,watchedEvent -> {
                //监听连接成功事件且通过变量控制只提示一次
                if (watchedEvent.getState().equals(Watcher.Event.KeeperState.SyncConnected)&&time==0){
                    System.out.println("客户端连接成功");
                    ++time;
                }
                try {
                    //设置参数为true循环注册监听
                    List<String> children = zooKeeper.getChildren("/servers", true);
                    for (String child : children) {//第一个循环获取新上线的服务器节点
                        if (oldList.isEmpty()||!oldList.contains(child)){
                            System.out.println("服务器 ["+child+"] 已上线");
                            oldList.add(child);//更新现有节点
                        }
                    }
                    for (String s : oldList) {//第二个节点获取下线的服务器节点
                        if (children.isEmpty()||!children.contains(s)){
                            System.out.println("服务器 ["+s+"] 已下线");
                            oldList.remove(s);//更新现有节点
                        }
                    }
                } catch (KeeperException | InterruptedException e) {
                    e.printStackTrace();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 测试结果

![image-20210823183243214](/ZooKeeper/image-20210823183243214.png)
