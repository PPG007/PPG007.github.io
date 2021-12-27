# ActiveMQ 的 Broker

## 什么是 Broker

相当于一个 ActiveMQ 实例。

Broker 其实就是实现了用代码的形式启动 ActiveMQ 将 MQ 嵌入到 Java 代码中，以便随时启动。

## 指定 ActiveMQ 使用的配置文件

```sh
./activemq start xbean:file/root/apache-activemq-5.16.3/conf/activemq.xml
```

## 嵌入式Broker

在上面依赖的基础上再导入 jackson。

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.12.4</version>
</dependency>
```

编写 Broker 启动程序：

```java
public class InsideBroker {
    public static void main(String[] args) throws Exception {
        BrokerService brokerService = new BrokerService();
        brokerService.setUseJmx(true);
//        指定绑定到的位置，填写本机ip
        brokerService.addConnector("tcp://localhost:61616");
//        启动
        brokerService.start();
//        在结束前阻塞，否则会立即结束
        brokerService.waitUntilStopped();

    }
}
```
