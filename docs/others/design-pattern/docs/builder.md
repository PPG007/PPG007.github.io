# 建造者模式

::: tip 定义
将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。
:::

## 四个角色

Product 产品类：通常是实现了模板方法模式。
Builder 抽象建造者：规范产品的组建，一般由子类实现。
ConcreteBuilder 具体建造者：实现抽象类定义的所有方法，并且返回一个组建好的对象。
Director 导演类：负责安排已有模块的顺序，告诉Builder开始建造。

示例：构造一个 HTTP 请求，URL、参数、请求头顺序可以随意设置。

首先编写一个基类，包含请求的基本信息。

编写一个子类继承这个基类。

编写建造者基类：

```java
public abstract class AbstractBuilder {

    protected AbstractRequest request;

    protected abstract void setPart(String filedName,Object value);

    public AbstractBuilder() {
        this.request=new Request();
    }

    protected abstract AbstractRequest getRequest();
}
```

编写建造者的实现类：

```java
public class Builder extends AbstractBuilder{
    @Override
    protected void setPart(String filedName,Object value) {
        if ("url".equals(filedName)){
            this.request.setUrl((String) value);
        }else if ("header".equals(filedName)){
            this.request.setHeader(((String) value));
        }else {

            this.request.setParams((HashMap<String, String>) value);
        }
    }

    @Override
    protected AbstractRequest getRequest() {
        return this.request;
    }

    public Builder setUrl(String url){
        this.setPart("url",url);
        return this;
    }

    public Builder setHeader(String header){
        this.setPart("header",header);
        return this;
    }

    public Builder setParams(HashMap<String, String> params){
        this.setPart("params",params);
        return this;
    }
}
```

最后编写导演类，此处我们将启动类作为导演类：

```java
public class Client {
    public static void main(String[] args) {
        Builder builder = new Builder();
        AbstractRequest request = builder.setHeader("header")
                .setUrl("url")
                .setParams(new HashMap<>(1))
                .getRequest();

        System.out.println(request);
    }
}
```

## 建造者模式的优点

封装性：客户端不必知道产品内部组成的细节。
建造者独立，易于扩展：上例中，构建 HTTPS 请求只要编写 HTTPS 类和 HTTPS 的建造者即可，且所有的建造者没有直接关系。
便于控制细节风险：建造者是独立的，可以对构造过程精细化而不对其他模块产生影响。

## 建造者模式使用场景

- 相同的方法，不同的执行顺序，产生不同的事件结果，例如构建 HTTP、HTTPS。
- 多个零部件都可以装配到一个对象中，但产生的运行结果又不相同。
- 产品类非常复杂，或者产品类中调用顺序不同会产生不同的效能。
- 在对象创建过程中会使用到系统中的一些其他对象，且这些对象不易获取。

## 注意事项

建造者模式关注的是*零件类型、装配工艺（顺序）*，这是与工厂方法模式最大的不同。
