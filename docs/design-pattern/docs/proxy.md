# 代理模式

为其他对象提供一种代理以控制对这个对象的访问。

## 三个角色

- Subject 抽象主题角色：抽象类或者是接口。
- RealSubject 真实角色：具体业务逻辑的执行者，被代理。
- Proxy 代理主题角色：应用真实角色，把所有抽象主题类定义的方法限制委托给真实主题角色实现，并且在真实主题角色处理完毕前后进行处理工作。

静态代理示例：

```java
public class Proxy implements Subject{
    private Subject subject=null;

    public Proxy(Class<? extends Subject> clazz) throws InstantiationException, IllegalAccessException {
        Arrays.stream(clazz.getConstructors()).forEach(constructor -> constructor.setAccessible(true));
        this.subject=clazz.newInstance();
    }

    @Override
    public void request() {
        System.out.println("I'm Proxy,I'm invoking...");
        this.subject.request();
    }
}
```

## 代理模式的优点

- 职责清晰：真实角色只需要考虑实际业务逻辑，其他事务由代理完成。
- 高扩展性：如上述示例，只要真实角色实现了接口，则代理类可以不做任何修改。
- 智能化：动态代理、Mybatis 映射。

## 代理模式的扩展

### 普通代理

要求客户端只能访问代理角色，不能访问真实角色。

接口：

```java
public interface IPlayer {

    void login(String username,String password);

    void fight();

    void upgrade();
}
```

实现类：通过构造器私有禁止创建真实对象。

```java
public class Player implements IPlayer{
    @Override
    public void login(String username, String password) {
        System.out.println("正在登录");
        System.out.println("用户名："+username);
        System.out.println("密码："+password);
    }

    @Override
    public void fight() {
        System.out.println("fight");
    }

    @Override
    public void upgrade() {
        System.out.println("upgrade");
    }

    private Player() {
    }
}
```

代理类：实现接口，通过反射调用真实对象构造器。

```java
public class PlayerProxy implements IPlayer{

    private IPlayer player;

    @Override
    public void login(String username, String password) {
        this.player.login(username,password);
    }

    @Override
    public void fight() {
        this.player.fight();
    }

    @Override
    public void upgrade() {
        this.player.upgrade();
    }

    public PlayerProxy(Class<? extends IPlayer> playerImpl) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        Constructor<? extends IPlayer> declaredConstructor = playerImpl.getDeclaredConstructor();
        declaredConstructor.setAccessible(true);
        this.player=declaredConstructor.newInstance();
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        PlayerProxy playerProxy = new PlayerProxy(Player.class);
        playerProxy.login("ppg","123");
        playerProxy.fight();
        playerProxy.upgrade();
    }
}
```

### 强制代理

客户端只有通过真实对象指定的代理类才能访问，即真实角色管理了代理角色。

接口：

```java
public interface IPlayer {

    void login(String username,String password);

    void fight();

    void upgrade();

    IPlayer getProxy();
}
```

实现类：

```java
public class Player implements IPlayer{

    private IPlayer proxy=null;

    @Override
    public void login(String username, String password) {
        System.out.println("请使用代理类访问");
    }

    @Override
    public void fight() {
        System.out.println("请使用代理类访问");
    }

    @Override
    public void upgrade() {
        System.out.println("请使用代理类访问");
    }

    @Override
    public IPlayer getProxy(){
        try {
            proxy = new PlayerProxy(Player.class,this);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException | InstantiationException e) {
            e.printStackTrace();
        }
        return proxy;
    }

    private class RealPlayer implements IPlayer{

        @Override
        public void login(String username, String password) {
            System.out.println("正在登录");
            System.out.println("用户名："+username);
            System.out.println("密码："+password);
        }

        @Override
        public void fight() {
            System.out.println("fight");
        }

        @Override
        public void upgrade() {
            System.out.println("upgrade");
        }

        @Override
        public IPlayer getProxy() {
            return proxy;
        }
    }
}
```

通过内部类实现强制屏蔽，必须通过代理类访问对应的方法。

代理类：

```java
public class PlayerProxy implements IPlayer{

    private IPlayer realPlayer;

    public PlayerProxy(Class<? extends IPlayer> outerPlayer,IPlayer outer) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        Constructor<? extends IPlayer> declaredConstructor = outerPlayer.getDeclaredConstructor();

        Class<?>[] declaredClasses = outerPlayer.getDeclaredClasses();
        for (Class<?> declaredClass : declaredClasses) {
            if (IPlayer.class.isAssignableFrom(declaredClass)){
                Constructor<?> inner = declaredClass.getDeclaredConstructor(outerPlayer);
                inner.setAccessible(true);
                Object o = inner.newInstance(outer);
                realPlayer= ((IPlayer) o);
            }
        }
    }

    @Override
    public void login(String username, String password) {
        this.realPlayer.login(username,password);
    }

    @Override
    public void fight() {
        this.realPlayer.fight();
    }

    @Override
    public void upgrade() {
        this.realPlayer.upgrade();
    }

    @Override
    public IPlayer getProxy() {
        return null;
    }
}
```

代理类通过反射创建内部类实例并在相关方法中引用，注意内部类构造时，默认构造器接受一个外部类实例，需要传入。

```java
public class Client {
    public static void main(String[] args) {
        Player player = new Player();
        IPlayer proxy = player.getProxy();
        player.fight();//请使用代理类访问
        proxy.fight();//fight
    }
}
```

### 个性代理

代理类实现除代理接口以外的其他接口，在目标方法上完成增强。

### 动态代理

InvocationHandler 接口。
