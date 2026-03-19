# 使用 Mybatis

## 相关依赖

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 基本配置

```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

## 接口及 xml

接口上 `@Repository` 注解可以不加，但是在 IDEA 中会在自动装配的时候报错，不影响使用。

接口上应该添加 `@Mapper` 注解或者在主启动类上添加 `@MapperScan(basePackages = "com.example.demo.mapper")` 开启 mapper 扫描。

```java
@Repository
public interface UserMapper {
    /**
     * get user list
     * @return user list
     */
    List<User> queryUserList();

    /**
     * get a user by id
     * @param id id
     * @return user
     */
    User queryUserById(int id);
}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.mapper.UserMapper">

    <select id="queryUserList" resultType="com.example.demo.pojo.User">
        select * from springmvc.user
    </select>

    <select id="queryUserById" resultType="com.example.demo.pojo.User">
        select * from springmvc.user where id=#{id}
    </select>

</mapper>
```
