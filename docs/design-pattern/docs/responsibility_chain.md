# 责任链模式

## 定义

使多个对象都有机会处理请求，从而避免了请求的发送者和接受者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有对象处理它为止。

## 主要角色

- 抽象处理器。
- 具体处理器。
- 责任链管理类（可选）。

## 示例

抽象处理器：

```java
public abstract class AbstractHandler {

    protected AbstractHandler nextHandler;

    public AbstractHandler(Level handleAbleLevel) {
        this.handleAbleLevel = handleAbleLevel;
    }

    protected Level handleAbleLevel;

    public final void setNextHandler(AbstractHandler nextHandler){
        this.nextHandler=nextHandler;
    }

    public final AbstractHandler getNextHandler() {
        return nextHandler;
    }

    public final Level getHandleAbleLevel() {
        return handleAbleLevel;
    }

    public final void setHandleAbleLevel(Level handleAbleLevel) {
        this.handleAbleLevel = handleAbleLevel;
    }

    /**
     * 执行自己的处理逻辑
     * @param request 请求
     * @return 响应
     */
    protected abstract Response selfHandle(Request request);

    public final Response dispatchHandler(Request request) throws Exception {
        System.out.println("请求内容："+request.getMsg());
        System.out.println("请求级别："+request.getRequestLevel().getLevel());
        if (this.getHandleAbleLevel().getLevel()>=request.getRequestLevel().getLevel()){
            return this.selfHandle(request);
        }else {
            if (this.nextHandler == null) {
                throw new Exception("no handler available");
            }else {
                System.out.println("第 "+this.handleAbleLevel.getLevel()+" 级处理器放行");
                return this.nextHandler.dispatchHandler(request);
            }
        }
    }

}
```

结合模板方法模式，对于每个请求先判断级别与处理器的级别，不能处理则传给责任链中的下一个处理器。

具体处理器：

```java
public class Handler1 extends AbstractHandler{
    public Handler1(Level handleAbleLevel) {
        super(handleAbleLevel);
    }

    @Override
    protected Response selfHandle(Request request) {
        Response response = new Response();
        response.setResponseMsg("第 "+this.handleAbleLevel.getLevel()+" 级处理器处理完成");
        return response;
    }
}
```

请求级别枚举类：

```java
public enum Level {
    /**
     * 最小
     */
    MIN(1),
    /**
     * 较小
     */
    SMALLER(3),
    /**
     * 中等
     */
    MID(5),
    /**
     * 较大
     */
    LARGER(7),
    /**
     * 最大
     */
    MAX(9);

    private final Integer level;

    Level(Integer level) {
        this.level = level;
    }

    public Integer getLevel() {
        return level;
    }
}
```

请求实体类：

```java
public class Request {

    private String msg;

    private Level requestLevel;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Level getRequestLevel() {
        return requestLevel;
    }

    public void setRequestLevel(Level requestLevel) {
        this.requestLevel = requestLevel;
    }
}
```

响应实体类：

```java
public class Response {

    private String responseMsg;

    public String getResponseMsg() {
        return responseMsg;
    }

    public void setResponseMsg(String responseMsg) {
        this.responseMsg = responseMsg;
    }
}
```

处理器注册中心类：

```java
public class RegistryCenter {

    private final LinkedList<AbstractHandler> handlers=new LinkedList<>();

    public RegistryCenter registerHandler(AbstractHandler handler){
        boolean res = this.handlers.add(handler);
        if (res){
            this.sort();
        }
        return this;
    }

    public LinkedList<AbstractHandler> getHandlers() {
        return handlers;
    }

    public AbstractHandler getFirstHandler(){
        if (this.handlers.isEmpty()){
            return null;
        }else {
            return this.handlers.get(0);
        }
    }

    private void sort(){
        this.handlers.sort(Comparator.comparingInt(o -> o.getHandleAbleLevel().getLevel()));
        for (int i = 0; i < handlers.size(); i++) {
            if (i!=handlers.size()-1){
                this.handlers.get(i).setNextHandler(this.handlers.get(i+1));
            }
        }
    }
}
```

默认按照优先级从小到大指定每个处理器的下一个处理器。

场景类：

```java
public class Client {

    private static final AbstractHandler FIRST_HANDLER;

    static {
        Handler1 handler1 = new Handler1(Level.MIN);
        Handler2 handler2 = new Handler2(Level.SMALLER);
        Handler3 handler3 = new Handler3(Level.MID);
        Handler4 handler4 = new Handler4(Level.LARGER);
        Handler5 handler5 = new Handler5(Level.MAX);
        RegistryCenter registryCenter = new RegistryCenter();
        registryCenter.registerHandler(handler1)
                .registerHandler(handler2)
                .registerHandler(handler3)
                .registerHandler(handler4)
                .registerHandler(handler5);
        FIRST_HANDLER=registryCenter.getFirstHandler();
    }
    public static void main(String[] args) throws Exception {
        Request request = new Request();
        request.setRequestLevel(Level.MAX);
        request.setMsg("买房");
        Response response = FIRST_HANDLER.dispatchHandler(request);
        System.out.println(response.getResponseMsg());
    }
}
```

## 责任链模式的优点

将请求和处理分开，请求者不需要知道是谁处理的，处理者也不需要知道请求的来源及其他信息，实现解耦。

## 责任链模式的缺点

- 性能问题。
- 调试不方便。

## 责任链模式注意事项

责任链中的节点数量需要控制，避免超长链的情况，可以设置链的最大长度。
