# 备忘录模式

## 定义

在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可将该对象恢复到原先保存的状态。

## 角色

- Originator 发起人角色：记录当前时刻的内部状态，负责定义哪些属于备份范围的状态，负责创建和恢复备忘录数据。
- Memento 备忘录角色：存储发起人对象的内部状态，在需要的时候提供发起人需要的内部状态。
- Caretaker 备忘录管理员角色：对备忘录进行管理、保存和提供。

## 示例

发起人角色：

```java
public class GameRole {
    /**
     * vit 生命值
     * atk 攻击力
     * def 防御力
     */
    private int vit;
    private int atk;
    private int def;

    public int getVit() {
        return vit;
    }

    public void setVit(int vit) {
        this.vit = vit;
    }

    public int getAtk() {
        return atk;
    }

    public void setAtk(int atk) {
        this.atk = atk;
    }

    public int getDef() {
        return def;
    }

    public void setDef(int def) {
        this.def = def;
    }

    public void display(){
        System.out.println("====now state====");
        System.out.println("生命值==>"+this.vit);
        System.out.println("攻击力==>"+this.atk);
        System.out.println("防御力==>"+this.def);
    }

    public void getInitState(){
        this.vit=100;
        this.atk=100;
        this.def=100;
    }

    public void fight(){
        this.vit=0;
        this.atk=0;
        this.def=0;
    }

    public RoleStateMemento saveState(){
        return new RoleStateMemento(this.vit, this.atk, this.def);
    }

    public void recoveryState(RoleStateMemento stateMemento){
        this.vit=stateMemento.getVit();
        this.atk=stateMemento.getAtk();
        this.def=stateMemento.getDef();
    }
}
```

发起者具有三个属性，且能够保存状态、恢复状态。

备忘录角色：

```java
public class RoleStateMemento {
    /**
     * vit 生命值
     * atk 攻击力
     * def 防御力
     */
    private int vit;
    private int atk;
    private int def;

    public int getVit() {
        return vit;
    }

    public void setVit(int vit) {
        this.vit = vit;
    }

    public int getAtk() {
        return atk;
    }

    public void setAtk(int atk) {
        this.atk = atk;
    }

    public int getDef() {
        return def;
    }

    public void setDef(int def) {
        this.def = def;
    }

    public RoleStateMemento(int vit, int atk, int def) {
        this.vit = vit;
        this.atk = atk;
        this.def = def;
    }
}
```

备忘录管理员角色：

```java
public class RoleStateCaretaker {
    private RoleStateMemento memento;

    public RoleStateMemento getMemento() {
        return memento;
    }

    public void setMemento(RoleStateMemento memento) {
        this.memento = memento;
    }
}
```

启动类：

```java
public class Client {
    public static void main(String[] args) {
        GameRole gameRole = new GameRole();
        gameRole.getInitState();
        gameRole.display();

        RoleStateCaretaker roleStateCaretaker = new RoleStateCaretaker();
        roleStateCaretaker.setMemento(gameRole.saveState());

        gameRole.fight();
        gameRole.display();

        gameRole.recoveryState(roleStateCaretaker.getMemento());
        gameRole.display();
    }
}
```

## 备忘录模式的使用场景

- 需要保存和恢复数据的相关状态场景。
- 提供一个可回滚的操作。
- 需要监控的副本场景中：备份一个主线程中的对象。
- 数据库连接的事务管理。

## 备忘录模式的注意事项

- 备忘录的生命期：

    建立就要使用，不使用就立刻删除。

- 备忘录的性能：

    不要在频繁建立备份的场景中使用备忘录模式（比如循环），原因如下：

    - 控制不了备忘录建立的对象数量。
    - 大对象的建立消耗资源。

## 备忘录模式的扩展

### clone 方式的备忘录

发起人实现 `Cloneable` 接口并重写 clone 方法即可，且不再需要备忘录角色。

发起人：

```java
public class GameRole implements Cloneable{
    /**
     * vit 生命值
     * atk 攻击力
     * def 防御力
     */
    private int vit;
    private int atk;
    private int def;

    public int getVit() {
        return vit;
    }

    public void setVit(int vit) {
        this.vit = vit;
    }

    public int getAtk() {
        return atk;
    }

    public void setAtk(int atk) {
        this.atk = atk;
    }

    public int getDef() {
        return def;
    }

    public void setDef(int def) {
        this.def = def;
    }

    public void display(){
        System.out.println("====now state====");
        System.out.println("生命值==>"+this.vit);
        System.out.println("攻击力==>"+this.atk);
        System.out.println("防御力==>"+this.def);
    }

    public void getInitState(){
        this.vit=100;
        this.atk=100;
        this.def=100;
    }

    public void fight(){
        this.vit=0;
        this.atk=0;
        this.def=0;
    }

    public RoleStateCaretaker saveState(){
        return new RoleStateCaretaker(this.clone());
    }

    public void recoveryState(RoleStateCaretaker caretaker){
        GameRole gameRole = caretaker.getGameRole();
        this.atk=gameRole.getAtk();
        this.def=gameRole.getDef();
        this.vit=gameRole.getVit();
    }

    @Override
    public GameRole clone() {
        try {
            return (GameRole) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

备忘录管理员：

```java
public class RoleStateCaretaker {

    private GameRole gameRole;

    public GameRole getGameRole() {
        return gameRole;
    }

    public void setGameRole(GameRole gameRole) {
        this.gameRole = gameRole;
    }

    public RoleStateCaretaker(GameRole gameRole) {
        this.gameRole = gameRole;
    }
}
```

启动类：

```java
public class Client {

    public static void main(String[] args) {

        GameRole gameRole = new GameRole();
        gameRole.getInitState();

        RoleStateCaretaker roleStateCaretaker = gameRole.saveState();

        gameRole.display();
        gameRole.fight();
        gameRole.display();

        RoleStateCaretaker roleStateCaretaker1 = gameRole.saveState();

        gameRole.recoveryState(roleStateCaretaker);
        gameRole.display();

        gameRole.recoveryState(roleStateCaretaker1);
        gameRole.display();

    }
}
```

### 多状态的备忘录

例如上面的例子中，发起人具有三个属性组成的状态，可以使用 HashMap 键值对的形式进行存储或者采用数据库等方案。

### 多备份的备忘录

即在不同的时间点对状态进行备份，可以将备忘录管理者中的状态改为 HashMap 类型进行存储，或者使用数据技术。
