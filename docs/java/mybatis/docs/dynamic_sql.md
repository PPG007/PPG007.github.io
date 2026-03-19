# 动态 SQL

- if。
- choose (when, otherwise)。
- trim (where, set)。
- foreach。

## 环境配置

实体类：

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

由于实体类中 createDate 名字与数据库中 create_date 不同，所以要在 mybatis-config.xml 中设置开启驼峰命名转换：

```xml
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```

## IF

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

## 其他标签

- choose (when, otherwise)：

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

- trim (where, set)：

  如果 where 元素与你期望的不太一样，你也可以通过自定义 trim 元素来定制 where 元素的功能。

  - prefix:前缀。
  - prefixOverrides：要去掉的内容（注意此例中的空格是必要的）。

  以下动态 SQL 语句与 where 标签默认功能一致：

  ```xml
  <trim prefix="WHERE" prefixOverrides="AND |OR ">
    ...
  </trim>
  ```

  定制 set：

  ```xml
  <trim prefix="SET" suffixOverrides=",">
    ...
  </trim>
  ```

- SQL 片段：

  为了实现 SQL 语句的复用 ，使用 sql 标签包含要复用的内容，使用 include 标签在需要使用的地方引用即可。

  ::: warning 注意：
  最好基于单表定义 SQL 片段。

  不要在片段中包含 where 标签。
  :::

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

- foreach：

  ::: tip
  当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。
  :::

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

  此段 SQL 会被解析为：

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

- script：

  ::: tip
  要在带注解的映射器接口类中使用动态 SQL，可以使用 script 元素。
  :::

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

- bind：

  bind 元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。

  ```xml
  <select id="selectBlogsLike" resultType="Blog">
    <bind name="pattern" value="'%' + _parameter.getTitle() + '%'" />
    SELECT * FROM BLOG
    WHERE title LIKE #{pattern}
  </select>
  ```

- 多数据库：

  ::: tip
  如果配置了 databaseIdProvider，你就可以在动态代码中使用名为 `databaseId` 的变量来为不同的数据库构建特定的语句。
  :::

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
