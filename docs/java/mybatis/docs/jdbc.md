---
prev:
  text: 首页
  link: /mybatis
---

# JDBC

## JDBC 进行增删改查的步骤

1. 配置。
2. 加载驱动。
3. 连接数据库。
4. 向数据库发送 sql 的对象 statement。
5. 编写 sql。
6. 执行 sql。
7. 关闭连接，先创建的后关闭。

```java
    //配置
    String url="jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC";
    String username="root";
    String password="123456";

    //加载驱动
    Class.forName("com.mysql.cj.jdbc.Driver");
    //连接数据库
    Connection connection= DriverManager.getConnection(url,username,password);
    //向数据库发送sql的对象statement
    Statement statement=connection.createStatement();
    //编写sql
    String sql="select * from usertable";
    //执行sql,查询返回结果集，增删改返回受影响的行数
    ResultSet resultSet = statement.executeQuery(sql);
    while(resultSet.next()){
        System.out.println("id="+resultSet.getObject("id"));
        System.out.println("username="+resultSet.getObject("username"));
        System.out.println("password="+resultSet.getObject("password"));
        System.out.println();
    }
    //关闭连接,先创建的后关闭
    resultSet.close();
    statement.close();
    connection.close();
```

## JDBC 使用预编译的步骤

1. 配置。
2. 加载驱动。
3. 连接数据库。
4. 编写 sql。
5. 预编译。
6. 执行 sql。
7. 关闭连接，先创建的后关闭。

```java
    //配置
    String url="jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC";
    String username="root";
    String password="123456";

    //加载驱动
    Class.forName("com.mysql.cj.jdbc.Driver");
    //连接数据库
    Connection connection= DriverManager.getConnection(url,username,password);
    //编写sql
    String sql="insert into usertable(id,username,password) values (?,?,?)";
    //预编译
    PreparedStatement preparedStatement=connection.prepareStatement(sql);
    //给对应的？赋值
    preparedStatement.setInt(1,123);
    preparedStatement.setString(2,"username");
    preparedStatement.setString(3,"password");
    //执行sql,查询返回结果集，增删改返回受影响的行数
    int i=preparedStatement.executeUpdate();
    if(i>=1){
        //成功
    }
    //关闭连接,先创建的后关闭
    preparedStatement.close();
    connection.close();
```

## JDBC 事务

开启事务：

```java
//false是开启
connection.setAutoCommit(false);
```

事务末尾：

```java
connection.commit();//正常执行
```

```java
connection.rollback();//执行异常
```
