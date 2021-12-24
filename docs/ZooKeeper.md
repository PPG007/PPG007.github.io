# 安装ZooKeeper

### 基础安装

下载ZooKeeper：[Zookeeper](https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz)

上传到服务器解压，进入解压后的目录，进入conf目录，编辑`zoo-sample.cfg`：

修改数据快照目录

```sh
dataDir=/opt/zookeeper
```

重命名配置文件为`zoo.cfg`

进入bin目录执行：

```sh
./zkServer.sh start#启动zookeeper
./zkServer.sh status#查看zookeeper状态
./zkServer.sh stop#停止zookeeper
```

启动客户端：

```sh
./zkCli.sh
```

### 配置参数

```sh
tickTime=2000#心跳时间，毫秒
initLimit=10#Leader和Follower初始连接时能容忍的最多心跳数
syncLimit=5#Leader和Follower建立连接后的通信最大心跳数
dataDir=/opt/zookeeper#数据目录
clientPort=2181#客户端连接端口号
```

### 集群安装

zookeeper最好部署奇数台服务器，首先在每个服务器上都修改配置文件，指定数据目录并启动，启动后在指定的数据目录中创建`myid`文件，文件中输入一个整数，就像是数据库主键一样，每个服务器不同，例如这里将三台服务器分别配置为1、2、3，停掉zookeeper，修改配置文件，在配置文件中添加如下内容，这里以第三台服务器为例，格式为server.[id]=host:port1:port2，host是IP地址，端口号一是Follower与Leader交换信息端口，端口二是执行选举时的端口，注意，==自身要使用0.0.0.0而不是127.0.0.1==

```sh
server.1=39.107.112.172:2888:3888
server.2=150.158.153.216:2888:3888
server.3=0.0.0.0:2888:3888
```

在三台服务器上分别执行启动命令然后查看状态可以看到：

![image-20210823151117278](/ZooKeeper/image-20210823151117278.png)

1号服务器此时成为Leader

# 选举机制

### 第一次启动时选举机制

假设有五台服务器

1. 第一台服务器启动，发起一次选举，投自己一票，此时这台服务器票数不够一半（3），选举无法完成，服务器保持LOOKING
2. 第二台服务器启动，发起选举，两台服务器先把票投给自己并交换信息，第一台服务器发现第二台服务器的myid比自己大，就将票重新投给了第二台服务器，此时第一台0票，第二台2票，此时还是没有服务器达到一半票数（3），全部保持LOOKING
3. 第三台服务器启动，发起一次选举，与上面相同，票都到了三号服务器，此时达到了半数以上，三号服务器成为leader，状态为LEADING，1、2号服务器状态为FOLLOWING
4. 第四台服务器启动，发起一次选举，此时服务器1、2、3不是LOOKING状态，不会更改选票信息。服务器四有一票，服从多数把票投给三号服务器，状态变为FOLLOWING
5. 第五台服务器启动，与第四台服务器流程相同

### 非第一次启动时的选举机制

当ZooKeeper集群中一台服务器出现以下两种情况之一，就会开始进入Leader选举

- 服务器初始化启动
- 服务器运行期间无法和Leader保持连接

当一台服务器进入选举流程时，集群可能的状态：

- 集群中已经有Leader
- 集群中确实没有Leader

SID：服务器ID，与myid一致，唯一标识

ZXID：事务ID，用来标识一次服务器状态的变更

Epoch：每个Leader任期中的代号，每次投完一次票这个值就会增加

现在假设3、5号服务器掉线，1、2、4号服务器开始选举

选举规则：

- Epoch大的直接胜出
- Epoch相同，ZXID大的胜出
- ZXID相同，SID大的胜出

# 客户端命令行

### 节点类型

- 持久节点：客户端与服务端断开连接后创建的节点不删除
- 短暂节点：客户端与服务端断开连接后创建的节点会删除

- 带序号节点，就像数据库主键自增一样

创建无序号持久节点

节点+描述

```sh
create /sanguo "diaochan"
create /sanguo/shuguo "liubei"
```

获取节点信息

```sh
get -s /sanguo
```

创建带序号持久节点

```sh
create -s /sanguo/weiguo/zhangliao "zhangliao"
```

序号是自动生成的，创建带序号节点的语句可以重复执行，序号会递增，创建不带序号节点的语句不能重复执行

创建临时节点

```sh
create -e /sanguo/wuguo "zhouyu"
```

创建临时带序号节点

```sh
create -e -s /sanguo/wuguo "zhouyu"
```

修改节点值

```sh
set /sanguo/weiguo "simayi"
```

### 监听器及节点删除

##### 节点值的监听

客户端：

```sh
get -w /sanguo#监听此节点的值
```

在另一个客户端修改这个节点的值：

```sh
set /sanguo "xishi"
```

监听客户端收到消息

![image-20210823162822036](/ZooKeeper/image-20210823162822036.png)

**注意：注册一次只能监听一次变化，如果要再次监听，就要再次注册**

##### 节点子节点的监听

客户端：

```sh
ls -w /sanguo
```

另一个客户端修改节点

```sh
create /sanguo/zhugeliang "zhugeliang"
```

![image-20210823163448114](/ZooKeeper/image-20210823163448114.png)

**注意：只有监听节点的直接子节点才会被监听，如果是子节点的子节点变化是监听不到的**

##### 节点删除及查看

删除单个节点

```sh
delete /sanguo/zhugeliang
```

递归删除全部子节点

```sh
deleteall /sanguo
```

查看节点信息

```sh
stat /zookeeper
```

# 客户端API

### 导入依赖

```xml
<!-- https://mvnrepository.com/artifact/org.apache.zookeeper/zookeeper -->
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.7.0</version>
</dependency>
```

### 创建节点

远程服务器超时时间要设置的久一些

```java
public static void main(String[] args) throws IOException, InterruptedException, KeeperException {
    int timeOut=200000;
    String connectStr="150.158.153.216:2181,39.107.112.172:2181,115.28.211.227:2181";//使用逗号分隔，不能带空格
    ZooKeeper zooKeeper = new ZooKeeper(connectStr, timeOut, watchedEvent -> System.out.println(watchedEvent.getState()));


    String s = zooKeeper.create("/sanguo", "sanguo".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);

}
```

### 监听节点变化

创建监听方法，此方法阻塞

```java
@org.junit.Test
public void getChildren() throws IOException, InterruptedException, KeeperException {
    zooKeeper.getChildren("/",true);//第二个参数为true表示使用创建zookeeper时定义的监听器
    System.in.read();
}
```

循环注册，循环监听

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

### 判断节点是否存在

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

# 案例：服务器动态上下线

### 案例描述

创建服务器类和客户端类，服务器启动并连接成功后创建节点，客户端监听节点的变化，获取服务端上线情况，服务端退出前删除创建的节点，此时客户端会获取下线情况

### 服务端编码

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



### 客户端编码

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

### 测试结果

![image-20210823183243214](/ZooKeeper/image-20210823183243214.png)

# 案例：分布式锁

### 案例描述

程序启动后以临时有序节点注册到zookeeper集群中，注册完毕后判断自己的编号是否是所有节点中最小的，若是，则继续执行业务代码，否则监听等待，知道自身编号是最小

### 编码

```java
public class LockServer {
    private ZooKeeper zooKeeper;

    private static final String CONNECT_STR="150.158.153.216:2181,39.107.112.172:2181,115.28.211.227:2181";

    private static final int TIMEOUT=200000;

    private final String serverName;

    private final CountDownLatch countDownLatch=new CountDownLatch(1);//辅助类，用于获取锁后唤醒业务方法

    int time=0;//计数器，用于控制输出，避免多次输出同一内容

    private String path=null;//当前节点全路径

    public LockServer(String serverName) {
        this.serverName = serverName;
    }

    public static void main(String[] args) {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(Runtime.getRuntime().availableProcessors()
                , 2 * Runtime.getRuntime().availableProcessors()
                , 10
                , TimeUnit.SECONDS
                , new ArrayBlockingQueue<>(5),
                new ThreadPoolExecutor.CallerRunsPolicy());//创建线程池
        for (int i = 0; i < 10; i++) {
            int finalI = i;
            threadPoolExecutor.execute(()->{
                LockServer server = new LockServer("server"+ finalI);
                server.init();
            });
        }
        while (threadPoolExecutor.getActiveCount()!=0){
            Thread.yield();//等待所有线程结束
        }
        threadPoolExecutor.shutdownNow();//关闭线程池
    }

    public void init(){
        this.connect();
        this.register();
        this.process();
    }

    private void register() {
        try {
            path=zooKeeper.create("/lock/server",serverName.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);//创建带序号节点
            System.out.println(serverName+"创建了节点："+path);
        } catch (KeeperException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void process() {

        try {
            countDownLatch.await();//等待获取锁
            System.out.println(serverName+" 进行业务处理");
            TimeUnit.SECONDS.sleep(5);//模拟业务处理
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            remove();//处理完移除节点，释放锁，虽然创建的是临时节点，但为了保险还是手动释放
        }
    }

    private void remove() {
        try {
            zooKeeper.delete(this.path,-1);//释放节点
            path=null;
            System.out.println(serverName+"释放锁");
        } catch (InterruptedException | KeeperException e) {
            e.printStackTrace();
        }
    }

    private void connect() {
        try {
            zooKeeper=new ZooKeeper(CONNECT_STR,TIMEOUT,watchedEvent -> {
                if (watchedEvent.getState().equals(Watcher.Event.KeeperState.SyncConnected)&&time==0){//只输出一次连接成功提示
                    System.out.println(serverName+"连接成功");
                    ++time;
                }
                try {
                    List<String> children = zooKeeper.getChildren("/lock", true);
                    Collections.sort(children);
                    if (children.get(0)!=null&&children.get(0).equals(path.substring("/lock/".length()))&&time==1){
                        System.out.println(serverName+"获取锁");
                        countDownLatch.countDown();//唤醒业务方法，且只唤醒一次
                        ++time;
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

### 测试结果

![image-20210824141808191](/ZooKeeper/image-20210824141808191.png)

![image-20210824141821848](/ZooKeeper/image-20210824141821848.png)

通过结果发现，获取锁的顺序确实是按照创建节点的序号大小进行的
