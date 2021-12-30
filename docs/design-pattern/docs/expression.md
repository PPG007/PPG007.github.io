# 解释器模式

## 定义

给定一门语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。

## 角色

- AbstractExpression 抽象解释器。
- TerminalExpression 终结符表达式。
- NonterminalExpression 非终结符表达式。
- Context 环境角色。

## 示例

抽象解释器：

```java
public abstract class Expression {

    /**
     * 解析公式和数据
     * @param var key为公式参数，value为具体的数字
     * @return 数字
     */
    public abstract int interpreter(HashMap<String, Integer> var);
}
```

变量解析器，非终结符表达式：

```java
public class VarExpression extends Expression{

    private final String key;

    public VarExpression(String key) {
        this.key = key;
    }

    @Override
    public int interpreter(HashMap<String, Integer> var) {
        return var.get(this.key);
    }
}
```

抽象运算符号解析器：

```java
public abstract class SymbolExpression extends Expression{

    protected Expression left;

    protected Expression right;

    public SymbolExpression(Expression left, Expression right){
        this.left = left;
        this.right = right;
    }
}
```

加法解析器：

```java
public class AddExpression extends SymbolExpression{
    public AddExpression(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public int interpreter(HashMap<String, Integer> var) {
        return this.left.interpreter(var)+this.right.interpreter(var);
    }
}
```

减法解析器：

```java
public class SubExpression extends SymbolExpression{
    public SubExpression(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public int interpreter(HashMap<String, Integer> var) {
        return this.left.interpreter(var) - this.right.interpreter(var);
    }
}
```

封装运算器类：

```java
public class Calculator {

    private Expression expression;

    public Calculator(String expStr) {
        Stack<Expression> stack = new Stack<>();
        char[] chars = expStr.toCharArray();

        Expression left;

        Expression right;

        for (int i = 0; i < chars.length; i++) {
            switch (chars[i]){
                case '+':
                    left=stack.pop();
                    right=new VarExpression(String.valueOf(chars[++i]));
                    stack.push(new AddExpression(left,right));
                    break;
                case '-':
                    left=stack.pop();
                    right=new VarExpression(String.valueOf(chars[++i]));
                    stack.push(new SubExpression(left,right));
                    break;
                default:
                    stack.push(new VarExpression(String.valueOf(chars[i])));
            }
        }
        this.expression=stack.pop();
    }

    public int run(HashMap<String, Integer> var){
        return this.expression.interpreter(var);
    }
}
```

启动类：

```java
public class Client {

    public static void main(String[] args) throws IOException {
        String expStr=getExpStr();
        HashMap<String, Integer> var=getValue(expStr);
        Calculator calculator = new Calculator(expStr);
        System.out.println("运算结果为："+calculator.run(var));
    }

    //获取公式中各变量的值
    private static HashMap<String, Integer> getValue(String expStr) throws IOException {
        HashMap<String, Integer> map = new HashMap<>();
        for (char c : expStr.toCharArray()) {
            if (c!='+'&&c!='-'){
                if (!map.containsKey(String.valueOf(c))){
                    String in=new BufferedReader(new InputStreamReader(System.in)).readLine();
                    map.put(String.valueOf(c),Integer.valueOf(in));
                }
            }
        }
        return map;
    }
	//获取公式
    private static String getExpStr() throws IOException {
        System.out.println("请输入表达式");
        return new BufferedReader(new InputStreamReader(System.in)).readLine();
    }

}
```

输入公式 a+b-c，然后分别输入 a、b、c 的值，得出结果。

过程解析：

- 调用 Calculator 的构造方法，因为表达式的最后一个运算符为减法，所以解析后的 expression 为 SubExpression，这个减法表达式又由一个加法表达式和变量表达式组成：

    ![image-20210921222535749](/设计模式/image-20210921222535749.png)

- 调用 run 方法开始执行运算，先是调用减法表达式的 interpreter 方法，然后又调用加法的 interpreter 方法和变量表达式的 interpreter 方法，层层向下，直到两端操作数都是变量表达式。
- 向上计算得出结果。

## 解释器模式的优点

扩展性好，若需要修改语法规则只需要修改相应的非终结符表达式即可；若扩展语法则只要增加非终结符类即可。

## 解释器模式的缺点

- 解释器模式会引起类膨胀：每个语法都要产生一个非终结符表达式。
- 解释器模式采用递归调用方法：调试复杂。
- 效率问题：使用了大量循环和递归。

## 解释器模式的使用场景

- 重复发生的问题可以使用解释器模式。
- 一个简单语法需要解释的场景。

## 解释器模式的注意事项

尽量不要在重要模块中使用解释器模式，维护成本高。
