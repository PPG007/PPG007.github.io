# 组合模式（合成模式、部分-整体模式）

## 定义

将对象组合成树形结构以表示*部分——整体*的层次结构，使得用户对单个对象和组合对象的使用具有一致性。

## 角色

- Component 抽象构件角色：定义参加组合对象的共有方法和属性，可以定义一些默认的行为或属性。
- Leaf 叶子构件：遍历的最小单位。
- Composite 树枝构件：组合树枝节点和叶子节点形成一个树形结构。

## 示例

抽象构件角色（员工）：

```java
public abstract class Corp {
    private final String name;

    private final String position;

    private final int salary;

    public Corp(String name, String position, int salary) {
        this.name = name;
        this.position = position;
        this.salary = salary;
    }

    public String getInfo(){
        return "姓名：" +
                this.name +
                "\t职位：" +
                this.position +
                "\t薪水" +
                this.salary;
    }
}
```

叶子构件：

```java
public class Leaf extends Corp{

    public Leaf(String name, String position, int salary) {
        super(name, position, salary);
    }
}
```

树枝构件：

```java
public class Composite extends Corp{
    public Composite(String name, String position, int salary) {
        super(name, position, salary);
    }
    private LinkedList<Corp> corps=new LinkedList<>();

    public void addCorp(Corp corp){
        this.corps.add(corp);
    }

    public LinkedList<Corp> getCorps() {
        return corps;
    }
}
```

启动类：

```java
public class Client {

    private static String getTreeInfo(Composite root){
        LinkedList<Corp> corps = root.getCorps();
        StringBuilder info= new StringBuilder();
        for (Corp corp : corps) {
            if (corp instanceof Composite){
                info.append(corp.getInfo()).append("\n").append(getTreeInfo(((Composite) corp)));
            }else {
                info.append(corp.getInfo()).append("\n");
            }
        }
        return info.toString();
    }
    public static void main(String[] args) {
        Composite ceo = new Composite("张三", "总经理", 50000);
        Composite deptA = new Composite("李四", "A部门经理", 30000);
        Composite deptB = new Composite("王五", "B部门经理", 30000);
        Composite devGroup = new Composite("二元", "开发组组长", 25000);
        Leaf a = new Leaf(UUID.randomUUID().toString().substring(0,5), "CEO秘书", 40000);
        ceo.addCorp(deptA);
        ceo.addCorp(deptB);
        ceo.addCorp(a);
        deptA.addCorp(devGroup);
        for (int i = 0; i < 10; i++) {
            devGroup.addCorp(new Leaf(UUID.randomUUID().toString().substring(0,5), "码农", 20000));
        }
        System.out.println(getTreeInfo(ceo));
    }
}
```

## 组合模式的优点

- 高层模块调用简单：节点都是构件，高层模块不必关心处理的是单个对象还是组合结构。
- 节点自由增加。

## 组合模式的缺点

就像上面启动类中的代码，违背了依赖倒置原则。

## 组合模式的使用场景

- 维护和展示部分-整体关系的场景，例如树形菜单、文件和文件夹管理。
- 从一个整体中能够独立出部分模块或功能的场景。

## 组合模式的注意事项

只要是树形结构就要考虑使用组合模式。

## 组合模式的扩展

### 真实的组合模式

使用数据库保存树形关系。

### 透明的组合模式

组合模式有两种不同的实现：_透明模式_、_安全模式_，上面的是安全模式。

透明模式：把上面 add、remove 等用来组合的方法放到抽象类中，叶子节点继承抽象类后，将这些方法不做操作，直接丢出异常即可。

### 组合模式的遍历

为所有节点添加一个父节点对象，这样既能够从树根出发遍历，也能从叶子出发找到根。
