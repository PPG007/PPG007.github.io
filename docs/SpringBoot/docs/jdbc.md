# 使用 JDBC

## 基本配置

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306?serverTimezone=UTC
    username: root
    password: 123456
```

## 使用原生 JDBC

```java
@Autowired
DataSource dataSource;

@Test
void contextLoads() throws SQLException {
    Connection connection = dataSource.getConnection();
    Statement statement = connection.createStatement();
    ResultSet resultSet = statement.executeQuery("select * from springmvc.user");
    while (resultSet.next()){
        System.out.println("id==>"+resultSet.getObject("id"));
        System.out.println("name==>" + resultSet.getObject("name"));
        System.out.println("sex==>" + resultSet.getObject("sex"));

    }

    resultSet.close();
    statement.close();
    connection.close();
}
```

::: warning 注意
此 DataSource 是`javax.sql.DataSource`。
:::

## 使用 JdbcTemplate

```java
@Autowired
JdbcTemplate jdbcTemplate;

@Test
void contextLoads() throws SQLException {
    String sql="select * from springmvc.user";
    List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
    maps.forEach(System.out::println);
}
```
