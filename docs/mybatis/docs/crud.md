# ybatis-CRUD

## select

通过 xml 配置：

::: tip

- resultMap：返回集。
- resultType：返回类型。
- parameterType：参数类型。
- parameterMap：参数集。

:::

```xml
<select id="getUserList" resultMap="userMapper">
        select * from usertable;
    </select>
```

通过注解：

```java
@Select("select * from usertable where id=#{id}")
    List<User> test(int id);
```

## update、insert、delete

::: warning 注意
若没有开启自动提交，则增删改需要提交事务才能实际修改数据。
:::

开启自动提交：

```java
SqlSessionFactory sqlSessionFactory=MybatisUtil.getSqlSessionFactory();
SqlSession sqlSession = sqlSessionFactory.openSession(true);
```

若不开启自动提交：

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
