# SSM 框架整合

## 配置 web.xml

创建项目后，需要在 IDEA 中右击项目模块，选择 Add Framework Support 添加 web 支持 web.xml：配置 `DispatcherServlet及CharacterEncodingFilter`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <!-- 指定Spring xml配置文件 -->
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:beans.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    <filter>
        <filter-name>filter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    <session-config>
        <session-timeout>15</session-timeout>
    </session-config>
</web-app>
```

若仅 Spring 想通过 Config 方式配置，则需要在 servlet-class 后紧接着添加如下内容：

```xml
<init-param>
    <param-name>contextClass</param-name>
    <!-- 默认是XmlWebApplicationContext，指定的是xml方式配置文件 -->
    <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
</init-param>
<init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>config.Config</param-value>
</init-param>
```

## 配置 Spring

### 配置数据源、注解支持、整合 Mybatis

```xml
<!-- 开启Spring注解支持 -->
<context:annotation-config/>
<!-- 指定数据库配置文件 -->
<context:property-placeholder location="classpath:db.properties"/>
<!-- 此处使用c3p0数据源 -->
<bean class="com.mchange.v2.c3p0.ComboPooledDataSource" id="dataSource">
    <property name="driverClass" value="${driver}"/>
    <property name="user" value="${user}"/>
    <property name="password" value="${password}"/>
    <property name="jdbcUrl" value="${url}"/>
</bean>
<!-- 整合Mybatis：配置SqlSessionFactory -->
<bean class="org.mybatis.spring.SqlSessionFactoryBean" id="sqlSessionFactory">
    <property name="dataSource" ref="dataSource"/>
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
</bean>
<!-- 开启自动扫描mapper接口 -->
<!-- 通过MapperFactoryBean指定也可行，但是当mapper接口较多的时候要多次注册bean，且通过这种方式不需要在mapper接口上添加@Repository -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
    <property name="basePackage" value="mapper"/>
</bean>
```

::: warning 关于c3p0数据源的注意事项
c3p0 的用户名属性为 user，最开始在 properties 中配置为 username 时，即使通过 `${username}` 并且显示取到了值但是仍然报错，修改为 user 后正常。
:::

### 配置 service 层

```xml
<!-- 开启组件自动扫描 -->
<context:component-scan base-package="service"/>
<!-- 手动装配， 由于已经配置MapperScannerConfigurer扫描mapper接口，所以可以在ServiceImpl上添加@Service并在其中的mapper上使用@Autowired-->
<bean class="service.impl.BookServiceImpl" id="service">
    <property name="bookMapper" ref="bookMapper"/>
</bean>
<!-- 配置Spring事务管理器 -->
<bean class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>
```

### 配置 mvc

```xml
<!-- 开启mvc的注解驱动 -->
<mvc:annotation-driven>
    <!-- 开启对jackson的乱码处理支持 -->
    <mvc:message-converters register-defaults="true">
        <bean class="org.springframework.http.converter.StringHttpMessageConverter">
            <constructor-arg value="UTF-8"/>
        </bean>
        <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
            <property name="objectMapper">
                <bean class="org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean">
                    <property name="failOnEmptyBeans" value="false"/>
                </bean>
            </property>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
<!-- 开启默认servlet防止无法获取静态资源 -->
<mvc:default-servlet-handler/>
<!-- 开启controller层组件扫描 -->
<context:component-scan base-package="controller"/>
<!-- 配置视图解析器 -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/jsp/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```
