# 1.JDBC

### 1.1 JDBC进行增删改查的步骤
1. 配置
2. 加载驱动
3. 连接数据库
4. 向数据库发送sql的对象statement
5. 编写sql
6. 执行sql
7. 关闭连接，先创建的后关闭
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
### 1.2 JDBC使用预编译的步骤
1. 配置
2. 加载驱动
3. 连接数据库
4. 编写sql
5. 预编译
6. 执行sql
7. 关闭连接，先创建的后关闭
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
### 1.3 JDBC事务
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

# 2.Hello Mybatis
- 依赖
```xml
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.5</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.21</version>
        </dependency>
```
- 编写实体类：
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
    private int id;
    private String username;
    private String password;
}
```
- 编写mapper层接口：
```java
public interface UserMapper {
    /**
     * getUserList
     * @return userList
     */
    List<User> getUserList();
}
```
- 编写mapper.xml配置文件：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--mapper接口的名字-->
<mapper namespace="dao.UserMapper">
    <resultMap id="userMapper" type="pojo.User">
        <id column="id" property="id" javaType="java.lang.Integer"/>
        <result column="username" property="username" javaType="java.lang.String"/>
        <result column="password" property="password" javaType="java.lang.String"/>
    </resultMap>
    <!--id与对应的方法同名-->
    <select id="getUserList" resultMap="userMapper">
        select * from usertable;
    </select>
</mapper>
```
- 编写mybatis配置xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    <!--映射器-->
    <mappers>
        <mapper resource="dao/UserMapper.xml"/>
    </mappers>
</configuration>
```


- 编写工具类
```java
public class MybatisUtil {

    // 每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实
    // 例为核心的。SqlSessionFactory 的实例可以通过 
    // SqlSessionFactoryBuilder 获得。
    // 而 SqlSessionFactoryBuilder 则可以从 XML 配置文件
    // 或一个预先配置的 Configuration 实例来构建出 SqlSessionFactory 实例。

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try{
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static SqlSession getSqlSession(){
        //SqlSession 提供了在数据库执行 SQL 命令所需的所有方法。
        return sqlSessionFactory.openSession();
    }
}
```
- 由于maven约定大于配置，默认只会导出resources文件夹下的文件，若将mapper.xml放在java包中，需要在pom.xml中添加：
```xml
<build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.properties</include>
                </includes>
                <filtering>true</filtering>
            </resource>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.properties</include>
                </includes>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
```
- 测试类
```java
    @Test
    public void test(){
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<User> users= mapper.getUserList();
        for (User user : users) {
            System.out.println(user.toString());
        }
        sqlSession.close();
    }
```
- 通过注解配置mapper接口
```java
@Select("select * from usertable where id=#{id}")
    List<User> test(int id);
```

# 3.Mybatis-CRUD
### 3.1 select
1. 通过xml配置：
>resultMap：返回集，resultType：返回类型，parameterType：参数类型，parameterMap：参数集
```xml
<select id="getUserList" resultMap="userMapper">
        select * from usertable;
    </select>
```
2. 通过注解：
```java
@Select("select * from usertable where id=#{id}")
    List<User> test(int id);
```
### 3.2 update、insert、delete
- 注意：若没有开启自动提交，则增删改需要提交事务才能实际修改数据
1. 开启自动提交
```java
SqlSessionFactory sqlSessionFactory=MybatisUtil.getSqlSessionFactory();
SqlSession sqlSession = sqlSessionFactory.openSession(true);
```
2. 若不开启自动提交：
```java
@Insert("insert into usertable(id,username,password) values(#{id},#{username},#{password})")
    void addUser(User user);
```
```java
SqlSessionFactory sqlSessionFactory=MybatisUtil.getSqlSessionFactory();
SqlSession sqlSession = sqlSessionFactory.openSession(false);
UserMapper mapper = sqlSession.getMapper(UserMapper.class);
try{
    mapper.addUser(new User(32,"zch","password"));
    sqlSession.commit();
}
catch (Exception e){
    System.out.println("失败");
    sqlSession.rollback();
}
    sqlSession.close();
```
# 4.Mybatis配置解析
### 4.1 Mybatis配置文件：
>configuration（配置）
properties（属性）
settings（设置）
typeAliases（类型别名）
typeHandlers（类型处理器）
objectFactory（对象工厂）
plugins（插件）
environments（环境配置）
environment（环境变量）
transactionManager（事务管理器）
dataSource（数据源）
databaseIdProvider（数据库厂商标识）
mappers（映射器）
>
### 4.2 各属性详解
##### 环境配置及环境变量
>尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。
>
##### 事务管理器
默认jdbc
>在 MyBatis 中有两种类型的事务管理器（也就是 type="[JDBC|MANAGED]"）：
>

>如果你正在使用 Spring + MyBatis，则没有必要配置事务管理器，因为 Spring 模块会使用自带的管理器来覆盖前面的配置。
>
##### 数据源
>有三种内建的数据源类型（也就是 type="[UNPOOLED|POOLED|JNDI]"）
>
- UNPOOLED– 这个数据源的实现会每次请求时打开和关闭连接。虽然有点慢，但对那些数据库连接可用性要求不高的简单应用程序来说，是一个很好的选择。 性能表现则依赖于使用的数据库，对某些数据库来说，使用连接池并不重要，这个配置就很适合这种情形。
- POOLED– 这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来，避免了创建新的连接实例时所必需的初始化和认证时间。 这种处理方式很流行，能使并发 Web 应用快速响应请求。（默认）
- JNDI – 这个数据源实现是为了能在如 EJB 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个 JNDI 上下文的数据源引用。这种数据源配置只需要两个属性：
##### 属性
- 可以通过properties属性来实现引用配置文件
>这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置
>
编写一个配置文件db.properties
```java
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mydata?serverTimezone=UTC
username=root
password=123456
```
mybatis-config.xml引入外部配置文件，若引用了外部文件，即使再添加property标签也优先使用外部配置
```xml
<properties resource="db.properties">

</properties>
```
##### 类型别名
- 给实体类起别名
```xml
<typeAliases>
    <typeAlias type="pojo.User" alias="user"/>
</typeAliases>
```
- 扫描实体类的包，JavaBean的默认别名就是类名的小写
```xml
<package name="pojo.User"/>
```
可以在JavaBean中使用注解指定别名
```java
@Alias("ttt")
public class User {
    private int id;
    private String username;
    private String password;
}
```
##### 映射器
- 映射器的多种写法：
```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
<!-- 使用完全限定资源定位符（URL） -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>
<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```
- 最后两种方法通过class或package注册时，dao层接口必须和配置文件同名，且接口和配置文件必须在同一个包下
##### 其他
[参考文档](https://mybatis.org/mybatis-3/zh/configuration.html#settings)

# 5.生命周期和作用域
理解我们之前讨论过的不同作用域和生命周期类别是至关重要的，因为错误的使用会导致非常严重的**并发问题**。
- SqlSessionFactoryBuilder
>一旦创建了 SqlSessionFactory，就不再需要它了。 因此 SqlSessionFactoryBuilder 实例的最佳作用域是**方法作用域**（也就是局部方法变量）。
>
- SqlSessionFactory
>SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。 使用 SqlSessionFactory 的最佳实践是在应用运行期间不要重复创建多次，多次重建 SqlSessionFactory 被视为一种代码“坏习惯”。因此 SqlSessionFactory 的最佳作用域是**应用作用域**。 有很多方法可以做到，最简单的就是使用**单例模式**或者**静态单例模式**。
>
- SqlSession
>每个线程都应该有它自己的 SqlSession 实例。SqlSession 的实例**不是线程安全的**，因此是不能被共享的，所以它的最佳的作用域是**请求或方法作用域**。 绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。 也绝不能将 SqlSession 实例的引用放在任何类型的托管作用域中，比如 Servlet 框架中的 HttpSession。 如果你现在正在使用一种 Web 框架，考虑将 SqlSession 放在一个和 HTTP 请求相似的作用域中。 换句话说，每次收到 HTTP 请求，就可以打开一个 SqlSession，返回一个响应后，就关闭它。 **这个关闭操作很重要，为了确保每次都能执行关闭操作，你应该把这个关闭操作放到 finally 块中**。
>
# 6.ResultMap结果集映射
- 当实体类中只有基本类型时：
```xml
<resultMap id="userMapper" type="pojo.User">
    <id column="id" property="id" javaType="java.lang.Integer"/>
    <result column="username" property="username" javaType="java.lang.String"/>
    <result column="password" property="password" javaType="java.lang.String"/>
</resultMap>
```
# 7.日志
### 7.1 日志工厂
![](/MyBatis/Mybatis日志.jpg)
- Mybatis 通过使用内置的日志工厂提供日志功能。内置日志工厂将会把日志工作委托给下面的实现之一：
    - SLF4J
    - Apache Commons Logging
    - Log4j 2
    - Log4j
    - JDK logging
    - STDOUT——LOGGING

1. STDOUT——LOGGING实现
```xml
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
</settings>
```
2. Log4j实现
```properties
### 配置根 ###
log4j.rootLogger = debug,console,fileAppender

### 设置输出sql的级别，其中logger后面的内容全部为jar包中所包含的包名 ###
log4j.logger.org.apache=dubug
log4j.logger.java.sql.Connection=dubug
log4j.logger.java.sql.Statement=dubug
log4j.logger.java.sql.PreparedStatement=dubug
log4j.logger.java.sql.ResultSet=dubug
### 配置输出到控制台 ###
log4j.appender.console = org.apache.log4j.ConsoleAppender
log4j.appender.console.Target = System.out
log4j.appender.console.layout = org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern =  %d{ABSOLUTE} %5p %c{1}:%L - %m%n

### 配置输出到文件 ###
log4j.appender.fileAppender = org.apache.log4j.FileAppender
log4j.appender.fileAppender.File = logs/log.log
log4j.appender.fileAppender.Append = true
log4j.appender.fileAppender.Threshold = DEBUG
log4j.appender.fileAppender.layout = org.apache.log4j.PatternLayout
log4j.appender.fileAppender.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n

### 配置输出到文件，并且每天都创建一个文件 ###
log4j.appender.dailyRollingFile = org.apache.log4j.DailyRollingFileAppender
log4j.appender.dailyRollingFile.File = logs/log.log
log4j.appender.dailyRollingFile.Append = true
log4j.appender.dailyRollingFile.Threshold = DEBUG
log4j.appender.dailyRollingFile.layout = org.apache.log4j.PatternLayout
log4j.appender.dailyRollingFile.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n### 配置输出到文件，且大小到达指定尺寸的时候产生一个新的文件 ###log4j.appender.ROLLING_FILE=org.apache.log4j.RollingFileAppender log4j.appender.ROLLING_FILE.Threshold=ERROR log4j.appender.ROLLING_FILE.File=rolling.log log4j.appender.ROLLING_FILE.Append=true log4j.appender.ROLLING_FILE.MaxFileSize=10KB log4j.appender.ROLLING_FILE.MaxBackupIndex=1 log4j.appender.ROLLING_FILE.layout=org.apache.log4j.PatternLayout log4j.appender.ROLLING_FILE.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n

### 配置输出到邮件 ###
log4j.appender.MAIL=org.apache.log4j.net.SMTPAppender
log4j.appender.MAIL.Threshold=FATAL
log4j.appender.MAIL.BufferSize=10
log4j.appender.MAIL.From=chenyl@yeqiangwei.com
log4j.appender.MAIL.SMTPHost=mail.hollycrm.com
log4j.appender.MAIL.Subject=Log4J Message
log4j.appender.MAIL.To=chenyl@yeqiangwei.com
log4j.appender.MAIL.layout=org.apache.log4j.PatternLayout
log4j.appender.MAIL.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n

### 配置输出到数据库 ###
log4j.appender.DATABASE=org.apache.log4j.jdbc.JDBCAppender
log4j.appender.DATABASE.URL=jdbc:mysql://localhost:3306/test
log4j.appender.DATABASE.driver=com.mysql.jdbc.Driver
log4j.appender.DATABASE.user=root
log4j.appender.DATABASE.password=
log4j.appender.DATABASE.sql=INSERT INTO LOG4J (Message) VALUES ('[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n')
log4j.appender.DATABASE.layout=org.apache.log4j.PatternLayout
log4j.appender.DATABASE.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n
log4j.appender.A1=org.apache.log4j.DailyRollingFileAppender
log4j.appender.A1.File=SampleMessages.log4j
log4j.appender.A1.DatePattern=yyyyMMdd-HH'.log4j'
log4j.appender.A1.layout=org.apache.log4j.xml.XMLLayout
```
```xml
<settings>
    <setting name="logImpl" value="LOG4j"/>
</settings>
```
# 8.多表查询
### 8.1 多对一（学生对老师）
学生类代码
```java
@Data
public class Student {
    private int id;
    private String name;
    private Teacher teacher;
}
```
老师类代码
```java
@Data
@ToString
public class Teacher {
    private int id;
    private String name;
}
```
student mapper层接口
```java
public interface StudentMapper {
    List<Student> queryAllStudent();
    List<Student> queryAllStudent2();
}
```
student mapper.xml配置
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

    <!--首先绑定命名空间-->
    <mapper namespace="dao.StudentMapper">

    <!--方式一：类似子查询-->
    <!-- 定义结果映射集 -->
    <!-- 首先总体上此方法返回的是学生类的列表，因此最外层type为student -->
    <!-- student类具有两个基础类型属性，通过简单映射即可 -->
    <!-- teacher类对象通过association进行配置
    定义select属性为已经写好的select语句 -->
    <resultMap id="student" type="pojo.Student">
        <id property="id" column="id" javaType="java.lang.Integer"/>
        <result property="name" column="name" javaType="java.lang.String"/>
        <association property="teacher" column="tid" javaType="pojo.Teacher" select="getTeacher"/>
    </resultMap>
    <select id="queryAllStudent" resultMap="student">
        select * from student;
    </select>
    <select id="getTeacher" resultType="pojo.Teacher">
        select * from teacher where id=#{tid};
    </select>
    <!-- 方式二：类似多表联查 -->
    <!-- 首先写出SQL语句 
    然后配置resultMap，依然使用association配置老师
    其子标签中的result的property属性为老师类的属性
    column为SQL语句中重命名的属性名-->
    <resultMap id="student2" type="pojo.Student">
        <id property="id" column="sid"/>
        <result property="name" column="sname"/>
        <association property="teacher" javaType="pojo.Teacher">
            <result property="name" column="tname"/>
            <result property="id" column="tid"/>
        </association>
    </resultMap>
    <select id="queryAllStudent2" resultMap="student2">
        select s.name sname,t.name tname,t.id tid from student s,teacher t where s.tid=t.id;
    </select>
    
</mapper>
```
### 8.2 一对多（老师对学生）
学生类代码：
```java
@Data
public class Student {
    private int id;
    private String name;
    private int tid;
}
```
老师类代码：
```java
@Data
@ToString
public class Teacher {
    private int id;
    private String name;
    private List<Student> studentList;
}
```
teacher mapper层接口：
```java
public interface TeacherMapper {
    Teacher queryAllInfo(@Param("tid")int id);
    Teacher queryAllInfo2(@Param("tid")int id);
}
```
teacher mapper.xml配置
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="dao.TeacherMapper">

<!-- 方式一：多表联查 -->
<!-- 首先写出SQL语句，然后定义resultMap -->
<!-- 由于teacher中包含一个学生列表，所以使用collection标签进行配置 -->
<!-- collection子标签的column属性仍然对应SQL语句中的值，collection标签中的oftype属性为List中的数据类型，此处即为Student -->
<resultMap id="teacher" type="pojo.Teacher">
    <id property="id" column="tid" javaType="java.lang.Integer"/>
    <result property="name" column="tname" javaType="java.lang.String"/>
    <collection property="studentList" javaType="list" ofType="pojo.Student">
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
        <result property="tid" column="tid"/>
    </collection>
</resultMap>
<select id="queryAllInfo" resultMap="teacher">
    select s.id sid,s.name sname,t.id tid,t.name tname
    from mydata.student s,mydata.teacher t
    where s.tid=t.id and t.id=#{tid}
</select>

<!-- 方式二：子查询 -->
<select id="queryAllInfo2" resultMap="teacher2">
    select * from mydata.teacher where id=#{tid}
</select>
<select id="getStudent" resultType="pojo.Student">
    select * from mydata.student where tid=#{tid}
</select>
<resultMap id="teacher2" type="Teacher">
    <collection property="studentList" javaType="list" ofType="pojo.Student" select="getStudent" column="id">

    </collection>
</resultMap>

</mapper>
```
### 8.3 多对多

# 9.动态SQL
>if
choose (when, otherwise)
trim (where, set)
foreach
>
### 9.1 环境配置
实体类
```java
@Data
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date createTime;
    private int views;
}
```
编写随机生成id的工具类：
```java
public class IDUtils {
    public static String getId(){
        return UUID.randomUUID().toString().replaceAll("-","");
    }
}
```
由于实体类中createDate名字与数据库中create_date不同，所以要在mybatis-config.xml中设置开启驼峰命名转换
```xml
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```
### 9.2 IF
接口：
```java
List<Blog> queryBlog(Map map);
```
mapper.xml：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="mapper.BlogMapper">
    <select id="queryBlog" parameterType="map" resultType="pojo.Blog">
        select * from mydata.blog where true
        <if test="title!=null">
            and title=#{title}
        </if>
        <if test="author!=null">
            and author=#{author}
        </if>
    </select>
</mapper>
```
执行代码：
```java
@Test
public void query(){
    SqlSession sqlSession=MybatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
    Map<String, String> map=new HashMap<String, String>();
    map.put("title","动态SQL测试3");
    map.put("author","PPG007");
    List<Blog> blogs = mapper.queryBlog(map);
    for (Blog blog : blogs) {
        System.out.println(blog);
    }
    sqlSession.close();
}
```
# 9.3 其他标签
- choose (when, otherwise)
```xml
<select id="queryBlog2" resultType="pojo.Blog" parameterType="map">
    select * from mydata.blog
    <where>
        <choose>
            <when test="title!=null">
                and title=#{title}
            </when>
            <when test="author!=null">
                and author=#{author}
            </when>
            <otherwise>

            </otherwise>
        </choose>
    </where>
</select>
```
- trim (where, set)
1. 如果 where 元素与你期望的不太一样，你也可以通过自定义 trim 元素来定制 where 元素的功能。
    - prefix:前缀
    - prefixOverrides 要去掉的内容（注意此例中的空格是必要的）

以下动态SQL语句与where标签默认功能一致
```xml
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  ...
</trim>
```
2. 定制set
```xml
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>
```
- SQL片段
为了实现SQL语句的复用 ，使用sql标签包含要复用的内容，使用include标签在需要使用的地方引用即可
>注意：
最好基于单表定义SQL片段
不要在片段中包含where标签
>
```xml
<sql id="sqlTest">
    <if test="title!=null">
        and title=#{title}
    </if>
    <if test="author!=null">
        and author=#{author}
    </if>
</sql>
<select id="queryBlog" parameterType="map" resultType="pojo.Blog">
    select * from mydata.blog where true
    <include refid="sqlTest"/>
</select>
```
- foreach
语法：
>当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。
```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  WHERE ID in
  <foreach item="item" index="index" collection="list"
      open="(" separator="," close=")">
        #{item}
  </foreach>
</select>
```
示例：
```xml
<!-- List<Blog> queryBlog3(Map map); -->
<select id="queryBlog3" resultType="pojo.Blog">
    select * from mydata.blog
    <where>
        <foreach collection="ids" item="id" open="(" close=")" separator="or">
            id=#{id}
        </foreach>
    </where>
</select>
```
此段SQL会被解析为：
```sql
select * from mydata.blog WHERE ( id=? or id=? )
```
执行代码：
```java
@Test
public void query(){
    SqlSession sqlSession=MybatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
    Map map=new HashMap();
    map.put("author","PPG007");
    List<String> list=new ArrayList<>();
    list.add("002444de22a148c099a5e1b36dcaf0c2");
    list.add("f69869b0257f45c9907e3d7e0aeaa7d5");
    map.put("ids",list);
    List<Blog> blogs = mapper.queryBlog3(map);
    for (Blog blog : blogs) {
        System.out.println(blog);
    }
    sqlSession.close();
}
```
- script
>要在带注解的映射器接口类中使用动态 SQL，可以使用 script 元素
```java
@Update({"<script>",
    "update Author",
    "  <set>",
    "    <if test='username != null'>username=#{username},</if>",
    "    <if test='password != null'>password=#{password},</if>",
    "    <if test='email != null'>email=#{email},</if>",
    "    <if test='bio != null'>bio=#{bio}</if>",
    "  </set>",
    "where id=#{id}",
    "</script>"})
void updateAuthorValues(Author author);
```
- bind
>bind 元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。
```xml
<select id="selectBlogsLike" resultType="Blog">
  <bind name="pattern" value="'%' + _parameter.getTitle() + '%'" />
  SELECT * FROM BLOG
  WHERE title LIKE #{pattern}
</select>
```
- 多数据库
>如果配置了 databaseIdProvider，你就可以在动态代码中使用名为 “_databaseId” 的变量来为不同的数据库构建特定的语句。
```xml
<insert id="insert">
  <selectKey keyProperty="id" resultType="int" order="BEFORE">
    <if test="_databaseId == 'oracle'">
      select seq_users.nextval from dual
    </if>
    <if test="_databaseId == 'db2'">
      select nextval for seq_users from sysibm.sysdummy1"
    </if>
  </selectKey>
  insert into users values (#{id}, #{name})
</insert>
```
# 10.缓存
### 10.1 缓存简介
1. 什么是缓存：
    - 存在内存中的临时数据
    - 将用户经常查询的数据放在缓存中，从缓存中查询，提高查询效率，解决了高并发系统的性能问题
2. 为什么用缓存
    - 减少访问数据库的次数，减小系统开销，提高系统效率
3. 什么样的数据适合用缓存
    - 经常查询且不经常改变的数据
### 10.2 Mybatis缓存
>MyBatis 内置了一个强大的事务性查询缓存机制，它可以非常方便地配置和定制。

- 默认情况下，只启用了本地的会话缓存，它仅仅对一个会话中的数据进行缓存。(一级缓存，sqlsession级别的缓存)

- 二级缓存需要手动开启，基于namespace级别

- mybatis提供了cache接口可以自定义缓存(二级)

### 10.3 Mybatis缓存机制
- 映射语句文件中的所有 select 语句的结果将会被缓存。
- 映射语句文件中的所有 insert、update 和 delete 语句会刷新缓存。
- 缓存会使用最近最少使用算法（LRU, Least Recently Used）算法来清除不需要的缓存。
- 缓存不会定时进行刷新（也就是说，没有刷新间隔）。
- 缓存会保存列表或对象（无论查询方法返回哪种）的 1024 个引用。
- 缓存会被视为读/写缓存，这意味着获取到的对象并不是共享的，可以安全地被调用者修改，而不干扰其他调用者或线程所做的潜在修改。
>
### 10.4 一级缓存
实体类代码：
```java
@Data
@EqualsAndHashCode
public class User {
    private int id;
    private String username;
    private String password;
}
```
mapper.xml：
```xml
<update id="updateUser">
    update mydata.usertable set password=#{password} where id=#{id}
</update>

<select id="queryUsers" resultType="pojo.User">
    select * from mydata.usertable
</select>
<select id="queryUserById" resultType="pojo.User">
    select * from mydata.usertable where id=#{id}
</select>
```
- 测试一：两次查询同一记录(sqlsession生命周期内)
输出：
```
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
Opening JDBC Connection
Created connection 293508253.
Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
==>  Preparing: select * from mydata.usertable where id=?
==> Parameters: 1(Integer)
<==    Columns: id, username, password
<==        Row: 1, 丛维仪, 110
<==      Total: 1
User(id=1, username=丛维仪, password=110)
==============================
User(id=1, username=丛维仪, password=110)
true
Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
Returned connection 293508253 to pool.
```
>由日志文件可以看出，两次查询同一记录只访问了一次数据库

- 测试二：两次查询的不是同一记录
输出：
```
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
Opening JDBC Connection
Created connection 293508253.
Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
==>  Preparing: select * from mydata.usertable where id=?
==> Parameters: 1(Integer)
<==    Columns: id, username, password
<==        Row: 1, 丛维仪, 110
<==      Total: 1
User(id=1, username=丛维仪, password=110)
==============================
==>  Preparing: select * from mydata.usertable where id=?
==> Parameters: 2(Integer)
<==    Columns: id, username, password
<==        Row: 2, 王海洋, 13573285937
<==      Total: 1
User(id=2, username=王海洋, password=13573285937)
false
Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
Returned connection 293508253 to pool.
```
>由日志文件可以看出，两次查询不同记录访问了两次数据库

- 测试三：查询完第一条记录后，更新数据库内任意记录，再次查询同一条记录
输出：
```
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
PooledDataSource forcefully closed/removed all connections.
Opening JDBC Connection
Created connection 293508253.
Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
==>  Preparing: select * from mydata.usertable where id=?
==> Parameters: 1(Integer)
<==    Columns: id, username, password
<==        Row: 1, 丛维仪, 110
<==      Total: 1
User(id=1, username=丛维仪, password=110)
==>  Preparing: update mydata.usertable set password=? where id=?
==> Parameters: test1(String), 2(Integer)
<==    Updates: 1
==============================
==>  Preparing: select * from mydata.usertable where id=?
==> Parameters: 1(Integer)
<==    Columns: id, username, password
<==        Row: 1, 丛维仪, 110
<==      Total: 1
User(id=1, username=丛维仪, password=110)
true
Rolling back JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@117e949d]
Returned connection 293508253 to pool.
```
>由日志文件可以看出，更新数据库内容导致了缓存的更新

##### 缓存失效的情况
1. 查询不同的记录
2. 增删改操作后，必定刷新缓存
3. 查询不同的mapper.xml
4. 手动清理缓存
手动清理缓存方法：
```java
sqlSession.clearCache();
```
### 10.5 二级缓存
##### 10.5.1 开启二级缓存
在映射器xml中添加：
```xml
<cache/>
```
- 注意：缓存只作用于 cache 标签所在的**映射文件**中的语句。如果你混合使用 Java API 和 XML 映射文件，在共用接口中的语句将不会被默认缓存。你需要使用 **@CacheNamespaceRef** 注解指定缓存作用域。
##### 10.5.2 cache元素的属性
```xml
<cache
  eviction="FIFO"
  flushInterval="60000"
  size="512"
  readOnly="true"/>
```
- eviction：指定清除策略，默认的清除策略是 **LRU**
  可用的清除策略有：
    - LRU – 最近最少使用：移除最长时间不被使用的对象。
    - FIFO – 先进先出：按对象进入缓存的顺序来移除它们。
    - SOFT – 软引用：基于垃圾回收器状态和软引用规则移除对象。
    - WEAK – 弱引用：更积极地基于垃圾收集器状态和弱引用规则移除对象。
- flushInterval：可以被设置为任意的正整数，设置的值应该是一个以毫秒为单位的合理时间量。 默认情况是不设置，也就是没有刷新间隔，缓存仅仅会在调用语句时刷新。
- size：（引用数目）可以被设置为任意正整数，要注意欲缓存对象的大小和运行环境中可用的内存资源。默认值是 1024。
- readOnly：（只读）可以被设置为 true 或 false。只读的缓存会给所有调用者返回缓存对象的相同实例。 因此这些对象不能被修改。这就提供了可观的性能提升。而可读写的缓存会（通过序列化）返回缓存对象的拷贝。 速度上会慢一些，但是更安全，因此默认值是 false。
>二级缓存是事务性的。这意味着，当 SqlSession 完成并提交时，或是完成并回滚，但没有执行 flushCache=true 的 insert/delete/update 语句时，缓存会获得更新。
##### 10.5.3 使用二级缓存的步骤
1. 开启全局缓存
```xml
<settings>
    <setting name="cacheEnabled" value="true"/>
</settings>
```
2. 在要开启二级缓存的mapper.xml中开启二级缓存
```xml
<cache
        eviction="FIFO"
        flushInterval="30000"
        size="512"
        readOnly="false"
/>
```
>注意：若readOnly属性设置为false，可能会抛出实体类的序列化异常。
3. 测试
- 只有当会话提交或者关闭时，才会提交到二级缓存
- 所有的数据都会先放在以及惠存

**异常分析：**
为什么要实现序列化：
1、缓存机制：将查询结果保存到内存中
2、内存饱满，需要移出时，MyBatis就会自动将内存中的内容进行移除，但是文件很重要，不能，此时就需要进行序列化，以文件的形式将内容从内存保存到硬盘上，一个内容保存成文件的读写，必须实现序列化。
**解决方法**
1、实体类实现Serializable序列化接口
2、将cache元素的readOnly属性设置为true
##### 10.5.4 二级缓存工作机制
- 一个会话查询一条记录，这个记录就会被放在当前会话的**一级缓存**中
- 如果当前会话关闭了，一级缓存会消失，一级缓存中的数据被保存到二级缓存中
- 新的会话查询信息，就可以从二级缓存中获取内容
- 不同的mapper查出的数据会放在自己对应的缓存(map)中

### 10.6 自定义缓存
>除了上述缓存的方式，也可以通过实现你己的缓存，或为其他第三方缓存方案创建适配器，来完全覆盖缓存行为。

>Ehcache是一种广泛使用的开源Java分布式缓存。

