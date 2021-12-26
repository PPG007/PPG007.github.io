# Druid

## 基本配置

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306?serverTimezone=UTC
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource
```

## 在 Spring 配置 Druid

```java
@Configuration
public class DruidConfig {

    // 注册DruidDataSource到IOC，通过yml读取配置
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.druid")
    public DruidDataSource druidDataSource(){
        return new DruidDataSource();
    }

    // 添加监控的servlet，对应地址为/druid
    @Bean
    public ServletRegistrationBean<StatViewServlet> registrationBean(){
        ServletRegistrationBean<StatViewServlet> servletRegistrationBean = new ServletRegistrationBean<>(new StatViewServlet(), "/druid/*");
        HashMap<String, String> stringStringHashMap = new HashMap<>();
        // 设置用户名、密码、禁止访问的ip等信息
        stringStringHashMap.put("loginUsername","root");
        stringStringHashMap.put("loginPassword","123456");
        stringStringHashMap.put("ppg","112.126.61.130");
        servletRegistrationBean.setInitParameters(stringStringHashMap);
        return servletRegistrationBean;
    }
}
```

## druid 监控配置

::: warning 注意
通过 yaml 配置时，若 `@ConfigurationProperties` 中的 prefix 为 `spring.datasource` 则不需要在 yaml 中添加 `druid:*`，若为 properties 配置，需要使用 `spring.datasource.druid=` 进行配置。
:::

```yaml
druid:
#初始化大小
  initialSize: 5
  #最小值
  minIdle: 5
  #最大值
  maxActive: 20
  #最大等待时间，配置获取连接等待超时，时间单位都是毫秒ms
  maxWait: 60000
  #配置间隔多久才进行一次检测，检测需要关闭的空闲连接
  timeBetweenEvictionRunsMillis: 60000
  #配置一个连接在池中最小生存的时间
  minEvictableIdleTimeMillis: 300000
  validationQuery: SELECT 1 FROM DUAL
  testWhileIdle: true
  testOnBorrow: false
  testOnReturn: false
  poolPreparedStatements: true
  # 配置监控统计拦截的filters，去掉后监控界面sql无法统计，
  #'wall'用于防火墙，SpringBoot中没有log4j，我改成了log4j2
  filters: stat,wall,log4j2
  #最大PSCache连接
  maxPoolPreparedStatementPerConnectionSize: 20
  useGlobalDataSourceStat: true
  # 通过connectProperties属性来打开mergeSql功能；慢SQL记录
  connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
  username: root
  password: 123456
  url: jdbc:mysql://localhost:3306?serverTimezone=UTC
  driver-class-name: com.mysql.cj.jdbc.Driver
  # # 配置StatFilter
  # web-stat-filter:
  #   #默认为false，设置为true启动
  #   enabled: true
  #   url-pattern: "/*"
  #   exclusions: "*.js,*.gif,*.jpg,*.bmp,*.png,*.css,*.ico,/druid/*"
  # #配置StatViewServlet
  # stat-view-servlet:
  #   url-pattern: "/druid/*"
  #   #允许那些ip
  #   allow: 127.0.0.1
  #   login-username: admin
  #   login-password: 123456
  #   #禁止那些ip
  #   deny: 192.168.1.102
  #   #是否可以重置
  #   reset-enable: true
  #   #启用
  #   enabled: true
```
