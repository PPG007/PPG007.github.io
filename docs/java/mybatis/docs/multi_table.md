# 多表查询

## 多对一（学生对老师）

学生类代码：

```java
@Data
public class Student {
    private int id;
    private String name;
    private Teacher teacher;
}
```

老师类代码：

```java
@Data
@ToString
public class Teacher {
    private int id;
    private String name;
}
```

student mapper 层接口：

```java
public interface StudentMapper {
    List<Student> queryAllStudent();
    List<Student> queryAllStudent2();
}
```

student mapper.xml 配置：

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

## 一对多（老师对学生）

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

teacher mapper 层接口：

```java
public interface TeacherMapper {
    Teacher queryAllInfo(@Param("tid")int id);
    Teacher queryAllInfo2(@Param("tid")int id);
}
```

teacher mapper.xml配置：

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
