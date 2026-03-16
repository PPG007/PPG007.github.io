# Hello Mybatis

依赖：

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

编写实体类：

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

编写 apper 层接口：

```java
public interface UserMapper {
    /**
     * getUserList
     * @return userList
     */
    List<User> getUserList();
}
```

编写 mapper.xml 配置文件：

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

编写 mybatis 配置 xml：

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

编写工具类：

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

由于 maven 约定大于配置，默认只会导出 resources 文件夹下的文件，若将 mapper.xml 放在 java 包中，需要在 pom.xml 中添加：

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

测试类：

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

通过注解配置 mapper 接口：

```java
@Select("select * from usertable where id=#{id}")
    List<User> test(int id);
```
