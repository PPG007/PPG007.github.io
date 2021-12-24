# 1.SpringBoot自动配置基本原理
- 依赖均在父项目中，要使用什么依赖，只需使用对应的starter启动器
![SpringBoot原理](/SpringBoot/SpringBoot流程图.jpg)
### 1.1 配置文件中的配置名从何而来？
在spring-boot-autoconfigure包下的\META-INF文件夹中有一个spring.factories文件，文件内容如下
![spring.factories](/SpringBoot/spring.factories.jpg)
在**Auto Configure**中的所有类都具有 **@EnableConfigurationProperties**注解(或者直接指向了配置文件而没有配置类，或者注解在内部类上)，这个注解的值指向的类就是我们在配置文件中的可选择的属性，如HttpEncodingAutoConfiguration自动配置类使用了ServerProperties.class，在ServerProperties中有唯一一个注解 **@ConfigurationProperties(prefix = "server", ignoreUnknownFields = true)**，此注解就是SpringBoot通过配置文件向实体类赋值的注解，prefix表示前缀，ServerProperties中有一个port属性用于指定端口号，要在配置文件中配置时，可以使用**server.port=xxx**的方式指定它的值
这些自动配置类都有多个@ConditionalOnxxx注解，用于根据注解中的条件是否成立决定是否生效，
![@Conditional](/SpringBoot/@Conditional.jpg)
总结：配置文件中的属性都有XxxProperties类与其对应，且都有XxxAutoConfiguration类加载了Properties中的属性
# 2. SpringBoot配置
### 2.1 通过properties配置
SpringBoot可以通过application.properties文件进行配置(配置文件名必须是application-xxx，例如application-test.properties,application-dev.properties)
以下是start.aliyun.com提供的模板
如果同一个项目有多个properties，可以通过spring.profiles.active=logger引用，如果引用的文件和被引用的文件有相同的部分，以被引用的文件为主，其中logger就是上面提到的application-xxx.properties中的xxx

```properties
# 应用名称
spring.application.name=demo
# 应用服务 WEB 访问端口
server.port=8080
#下面这些内容是为了让MyBatis映射
#指定Mybatis的Mapper文件
mybatis.mapper-locations=classpath:mappers/*xml
#指定Mybatis的实体目录
mybatis.type-aliases-package=com.example.demo.mybatis.entity
# 数据库驱动：
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
# 数据源名称
spring.datasource.name=defaultDataSource
# 数据库连接地址
spring.datasource.url=jdbc:mysql://localhost:3306/blue?serverTimezone=UTC
# 数据库用户名&密码：
spring.datasource.username=***
spring.datasource.password=***
# THYMELEAF (ThymeleafAutoConfiguration)
# 开启模板缓存（默认值： true ）
spring.thymeleaf.cache=true
# 检查模板是否存在，然后再呈现
spring.thymeleaf.check-template=true
# 检查模板位置是否正确（默认值 :true ）
spring.thymeleaf.check-template-location=true
#Content-Type 的值（默认值： text/html ）
spring.thymeleaf.content-type=text/html
# 开启 MVC Thymeleaf 视图解析（默认值： true ）
spring.thymeleaf.enabled=true
# 模板编码
spring.thymeleaf.encoding=UTF-8
# 要被排除在解析之外的视图名称列表，⽤逗号分隔
spring.thymeleaf.excluded-view-names=
# 要运⽤于模板之上的模板模式。另⻅ StandardTemplate-ModeHandlers( 默认值： HTML5)
spring.thymeleaf.mode=HTML5
# 在构建 URL 时添加到视图名称前的前缀（默认值： classpath:/templates/ ）
spring.thymeleaf.prefix=classpath:/templates/
# 在构建 URL 时添加到视图名称后的后缀（默认值： .html ）
spring.thymeleaf.suffix=.html

spring.profiles.active=logger
```

### 2.2 通过properties给属性赋值
- 注意，为属性赋值的properties最好不使用application这个前缀命名，springboot对application前缀的properties文件强制使用ISO编码

实体类代码：
通过@PropertySource注解的value属性指定要使用的properties文件，encoding属性指定编码，使用utf-8防止中文乱码
```java
@Component
@Data
@NoArgsConstructor
@AllArgsConstructor
@PropertySource(value = "classpath:my.properties",encoding = "UTF-8")
public class Student {

    @Value("${student.id}")
    private int id;

    @Value("${student.name}")
    private String name;

    // 对list赋值以下两种写法都可以
//    @Value("${student.hobbies}")
    @Value("#{'${student.hobbies}'.split(',')}")
    private List<Object> hobbies;

    // map的赋值方法
    @Value("#{${student.grade}}")
    private Map<String,Integer> grade;

    // 复杂类型的赋值方法
    @Value("#{teacher}")
    private Teacher teacher;
}
```
properties文件内容：
```properties
teacher.id=9
teacher.name=zzl
teacher.sex=w
teacher.age=111

student.id=10
student.name=赵泽龙
student.hobbies=code,music
student.grade={"math":60,"eng":11}
```
### 2.3 通过YAML配置
YAML语法格式大体如下，具有较强的层次性
```yml
server:
  port: 9900
spring:
  datasource:
    username:
```
- 注意：在项目中存在properties的情况下，SpringBoot优先使用properties配置文件
-
### 2.4 通过YAML给属性赋值
YAML配置如下：
```yml
teacher:
  id: 1
  name: 赵泽龙
  sex: 男
  age: 20

student:
  id: 1
  name: zzl
  hobbies:
    - code
    - music
  grade: {math: 59,eng: 59}
  teacher:
    id: ${teacher.id:random.int}#冒号后为默认值
    name: ${teacher.name:zzz}
    sex: ${teacher.sex:女}
    age: ${teacher.age:99}
```
实体类只需要加入@ConfigurationProperties(prefix = "student")注解指定使用前缀为student的yml配置即可
- 由于yml默认就是utf-8，所以不会出现中文乱码

使用YAML进行配置时，要导入依赖,不导入会存在警告
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```
### 2.5 JSR-303校验
1. 依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```
2. 使用：
- 在要开启校验的实体类上添加：@Validated注解
- 在要进行限制的属性上添加指定注解
例：
value用于指定要限制的值，message用于替换默认的报错信息
```java
@Min(value = 1,message = "爪巴")
private int id;
private String name;
private String sex;
private int age;
}
```
其余各限制类型如下：
![JSR-303校验](/SpringBoot/JSR-303校验.jpg)
### 2.6 多环境配置及配置文件位置
1. 配置文件的可选位置
**注意：配置文件命名仍然要为：application-xxx.yml(properties)**
- file:./config
此位置就是在项目根目录下创建一个config文件夹(文件夹名字必须为comfig)，在config文件夹中创建配置文件(config文件夹与src同级)
![配置文件路径一](/SpringBoot/配置文件路径一.jpg)
- file:./
此位置就是在根目录下直接创建配置文件，配置文件与src文件夹同级
![配置文件路径一](/SpringBoot/配置文件路径二.jpg)
- classpath:/config/
此位置就是在resources目录下创建config文件夹并在其中创建配置文件
![配置文件路径一](/SpringBoot/配置文件路径三.jpg)
- classpath:/
此位置就是resources目录
![配置文件路径一](/SpringBoot/配置文件路径四.jpg)
2. 各位置配置文件的优先级顺序：
file:./config > file:./ > classpath:/config/ > classpath:/
3. 多环境的配置
- 若使用properties：
创建多个application-xxx.properties
在application.properties(默认主配置文件)中添加：
```properties
#application-logger.properties
spring.profiles.active=logger
```
- 使用YAML
yml通过---分割不同的环境，所以一个配置文件可以有多个环境，最上面为主环境，主环境可以通过**spring.profiles.active**指定要使用的环境，其他环境通过**spring.config.active.on-profile**为自己起名字
```yml
server:
  port: 5555

spring:
  profiles:
    active: dev
---
server:
  port: 6666
spring:
  config:
    activate:
      on-profile: test
---
server:
  port: 7777
spring:
  config:
    activate:
      on-profile: dev
```
# 3. SpringBoot Web开发
### 3.1 静态资源可用位置
在WebMvcAutoConfiguration类中存在addResourceHandlers方法
```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
  // 根据if中的条件可知，若自定义了静态资源的路径，默认静态资源配置将会失效，方法将会直接返回，
  if (!this.resourceProperties.isAddMappings()) {
    logger.debug("Default resource handling disabled");
    return;
  }
  Duration cachePeriod = this.resourceProperties.getCache().getPeriod();
  CacheControl cacheControl = this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl();
  // 由第二个if及其中的代码可知，存在这样一个访问静态资源路径即webjars中的所有资源，例如localhost:8080/wabjars/jquery.js,
  // 且这个访问路径会被映射到classpath:/META-INF/resources/webjars/
  // 也就是说在浏览器输入的webjars等价于实际结构中的classpath:/META-INF/resources/webjars/
  if (!registry.hasMappingForPattern("/webjars/**")) {
    customizeResourceHandlerRegistration(registry.addResourceHandler("/webjars/**")
        .addResourceLocations("classpath:/META-INF/resources/webjars/")
        .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl)
        .setUseLastModified(this.resourceProperties.getCache().isUseLastModified()));
  }
  // 以下代码通过读取默认的路径设置获取静态资源路径，这个配置存在于WebMvcProperties中
  String staticPathPattern = this.mvcProperties.getStaticPathPattern();
  if (!registry.hasMappingForPattern(staticPathPattern)) {
    customizeResourceHandlerRegistration(registry.addResourceHandler(staticPathPattern)
        .addResourceLocations(getResourceLocations(this.resourceProperties.getStaticLocations()))
        .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl)
        .setUseLastModified(this.resourceProperties.getCache().isUseLastModified()));
  }
}
```
- isAddMappings()方法定义在WebProperties类中，这个类上有一个@ConfigurationProperties("spring.web")注解，说明这个类可以通过spring.web前缀的配置进行设置，在application.yml中输入如下内容，所有默认静态资源路径都会失效：
```yml
spring:
  web:
    resources:
      add-mappings: false
```
- 关于webjars
进入webjars官网即可获取对应的依赖
![webjars](/SpringBoot/webjars.jpg)
webjars实现了使用jar包依赖引入web资源
以jQuery为例，首先在Maven中添加依赖：
```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.5.1</version>
</dependency>
```
![webjars在项目中的位置](/SpringBoot/webjars在项目中的位置.jpg)
根据对源代码的分析，要想访问jQuery，只需要在浏览器输入localhost:8080/webjars/jquery/3.5.1/jquery.js
- 默认静态资源路径
WebMvcProperties的getStaticPathPattern()方法返回一个String字符串
```java
private String staticPathPattern = "/**";
```
if中的代码中有：
```java
this.resourceProperties.getStaticLocations()
```
此方法在WebProperties中的内部静态类Resources中定义，返回一个String数组
```java
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { "classpath:/META-INF/resources/",
				"classpath:/resources/", "classpath:/static/", "classpath:/public/" };
```
说明访问/**的资源会被转换为项目中的四个CLASSPATH_RESOURCE_LOCATION，且优先级为resources > static > public，例如访问localhost:8080/test.js会根据优先级访问resources、static、public中的test.js
- 可以通过配置文件的方式改变映射路径/**为其他路径，例如：
```yml
spring:
  mvc:
    static-path-pattern: /hello/**
```
配置后，访问/hello下的资源才会被映射，例如原先访问localhost:8080/test.js要更改为http://localhost:8080/hello/test.js

### 3.2 首页和图标定制
##### 3.1 首页
在WebMvcAutoConfiguration类中存在welcomePageHandlerMapping方法：
```java
@Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext,
    FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
  WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
      new TemplateAvailabilityProviders(applicationContext), applicationContext, getWelcomePage(),
      this.mvcProperties.getStaticPathPattern());
  welcomePageHandlerMapping.setInterceptors(getInterceptors(mvcConversionService, mvcResourceUrlProvider));
  welcomePageHandlerMapping.setCorsConfigurations(getCorsConfigurations());
  return welcomePageHandlerMapping;
}
```
其中调用了getWelcomePage
```java
private Optional<Resource> getWelcomePage() {
  String[] locations = getResourceLocations(this.resourceProperties.getStaticLocations());
  return Arrays.stream(locations).map(this::getIndexHtml).filter(this::isReadable).findFirst();
}
```
这个方法又调用了getStaticLocations方法，返回一个location字符串数组：
```java
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { "classpath:/META-INF/resources/",
    "classpath:/resources/", "classpath:/static/", "classpath:/public/" };

/**
  * Locations of static resources. Defaults to classpath:[/META-INF/resources/,
  * /resources/, /static/, /public/].
  */
private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;
```
可以看到，这个值就是上面提到的四个静态资源路径

此外，welcomePageHandlerMapping方法还调用了WebMvcProperties的getStaticPathPattern()方法，返回值默认就是上面提到的/**

getWelcomePage还调用了getIndexHtml方法,并且传入的参数就是上面的四个location
```java
private Resource getIndexHtml(String location) {
  return this.resourceLoader.getResource(location + "index.html");
}
```
- 综上：
首页名称必须是index.html，且必须放在默认静态资源路径下，默认访问路径如：localhost:8080，若修改了static-path-pattern为其他路径，则无法访问index，原因尚不知晓
##### 3.2 图标定制
最新版本SpringBoot中已经移除了图标的设置，若使用老版本，在静态资源文件夹中放置一个favicon.ico文件，并修改配置文件,关闭默认图标：
```yml
spring:
  mvc:
    favicon:
      enabled: false
```
# 4. Thymeleaf
### 4.1 使用准备
- 导入依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```
- 首先依然根据spring-boot-autoconfigure\META-INF\spring.factories，找到thymeleaf的配置类**org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration**，并根据@EnableConfigurationProperties(ThymeleafProperties.class)注解找到**ThymeleafProperties**
```java
@ConfigurationProperties(prefix = "spring.thymeleaf")
public class ThymeleafProperties {
  private static final Charset DEFAULT_ENCODING = StandardCharsets.UTF_8;

	public static final String DEFAULT_PREFIX = "classpath:/templates/";

	public static final String DEFAULT_SUFFIX = ".html";
```
由此，我们可以在配置文件中使用**spring.thymeleaf**作出相应配置，且默认路径是classpath:/templates/，后缀为.html
- 注意：templates目录下的文件必须通过controller访问
- 在html页面中引入约束：
```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
```
### 4.2 基本语法
- thymeleaf中，HTML标签的所有元素都由thymeleaf接管，要使用thymeleaf必须通过th:xxx的形式指定属性
1. ${...}表达式
Thymeleaf通过${}来获取model中的变量，注意这不是el表达式，而是ognl表达式，但是语法非常像。
```java
@Controller
public class TestController {
    @RequestMapping("/test")
    public String hello(Model model){
        Student student=new Student();
        student.setSname("zhai");
        student.setSnum("201716161");
        model.addAttribute("student", student);
        return "test";
    }
}
```
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
   <h3 th:text="${student.sname}"></h3>
   <h3>[[${student.sname}]]</h3>
</body>
</html>
```
2. #{...}表达式
获取资源文件中的数据
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>国际化</title>
</head>
<body>
<form method="post">
    <p>
        <input type="text" name="username" th:placeholder="#{login.username}">
    </p>
    <p>
        <input type="password" name="password" th:placeholder="#{login.password}">
    </p>
<input type="submit" th:value="#{login.submit}"/></p>
</form>
</body>
</html>
```
3. *{...}表达式
用于暂存对象
```html
<h2 th:object="${user}">
    <p>Name: <span th:text="*{name}">Jack</span>.</p>
    <p>Age: <span th:text="*{age}">21</span>.</p>
    <p>friend: <span th:text="*{friend.name}">Rose</span>.</p>
</h2>
```
4. @{...}表达式
用于指定URL
```html
<link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
```
5. ~{...}表达式
6. 内置对象
![thymeleaf内置对象](/SpringBoot/thymeleaf内置对象.jpg)
示例：
```html
<title th:text="${#request.getServerPort()}"></title>
```
7. 字面值
- 字符串字面值
使用一对'引用的内容就是字符串字面值了：如下的thymeleaf会被当做字符串
```html
<p>
  你正在观看 <span th:text="'thymeleaf'">template</span> 的字符串常量值.
</p>
```
- 数字字面值
```html
<p>今年是 <span th:text="2018">1900</span>.</p>
<p>两年后将会是 <span th:text="2018 + 2">1902</span>.</p>
```
- 布尔字面值
```html
<div th:if="true">
    你填的是true
</div>
```
8. utext
```java
@RequestMapping("/")
public String aa(Model model) {
    String msg = "<h1>啦啦啦</h1>";
    model.addAttribute("msg", msg);
    return "index";
}
```
若使用th:text，msg将被视作字符串并显示在页面上(含标签)，若使用utext，msg将被解析为html并只显示解析后的结果
9. 字符串拼接
```html
<span th:text="'欢迎您:' + ${user.name} + '!'"></span>
<span th:text="|欢迎您:${user.name}|"></span>
```
10. 运算
需要注意："\${}"内部的是通过OGNL表达式引擎解析的，外部的才是通过Thymeleaf的引擎解析，因此运算符尽量放在${}外进行。
- 算术运算
**支持的算术运算符：+ - * / %**
```html
<span th:text="${user.age}"></span>         //21
<span th:text="${user.age}%2 == 0"></span>  //false
```
- 比较运算
支持的比较运算：**>, <, >= and <=**，但是>, <不能直接使用，因为xml会解析为标签，要使用别名。
注意 == and !=不仅可以比较数值，类似于equals的功能。
可以使用的别名：**gt (>), lt (<), ge (>=), le (<=), not (!). Also eq (==), neq/ne (!=)**
- 条件运算
  - 三元运算
  ```html
  <td th:text="${emp.gender}==0?'女':'男'"></td>
  ```
  - 默认值
  有的时候，我们取一个值可能为空，这个时候需要做非空判断，可以使用 表达式 ?: 默认值简写：
  ```html
  <span th:text="${user.name} ?: '二狗'"></span>
  ```
  当前面的表达式值为null时，就会使用后面的默认值。
  **注意：?:之间没有空格。**
11. 循环
```html
<tr th:each="user : ${users}">
    <td th:text="${user.name}">Onions</td>
    <td th:text="${user.age}">2.41</td>
</tr>
```
- 遍历集合支持的类型：
  - Iterable，实现了Iterable接口的类
  - Enumeration，枚举
  - Interator，迭代器
  - Map，遍历得到的是Map.Entry
  - Array，数组及其它一切符合数组结果的对象

在迭代的同时，我们也可以获取迭代的状态对象：
```html
<tr th:each="user,stat : ${users}">
    <td th:text="${user.name}">Onions</td>
    <td th:text="${user.age}">2.41</td>
</tr>
```
- stat对象包含以下属性
  - index，从0开始的角标
  - count，元素的个数，从1开始
  - size，总元素个数
  - current，当前遍历到的元素
  - even/odd，返回是否为奇偶，boolean值
  - first/last，返回是否为第一或最后，boolean值
12. 逻辑判断
Thymeleaf中使用**th:if** 或者 **th:unless** ，两者的意思恰好相反。
```html
<span th:if="${user.age} > 24">老油条</span>
```
如果表达式的值为true，则标签会渲染到页面，否则不进行渲染。
- 认定为true的情况：
  - 表达式值为true
  - 表达式值为非0数值
  - 表达式值为非0字符
  - 表达式值为字符串，但不是"false","no","off"
  - 表达式不是布尔、字符串、数字、字符中的任何一种
- 其它情况包括null都被认定为false
13. 分支控制switch
这里要使用两个指令：**th:switch** 和 **th:case**
```html
<div th:switch="${user.role}">
  <p th:case="'admin'">用户是管理员</p>
  <p th:case="'manager'">用户是经理</p>
  <p th:case="*">用户是别的玩意</p>
</div>
```
需要注意的是，一旦有一个th:case成立，其它的则不再判断。与java中的switch是一样的。
th:case="*"表示默认，放最后。
14. js模板
模板引擎不仅可以渲染html，也可以对JS中的进行预处理。而且为了在纯静态环境下可以运行，其Thymeleaf代码可以被注释起来：
```html
<script th:inline="javascript">
    const user = /*[[${user}]]*/ {};
    const age = /*[[${user.age}]]*/ 20;
    console.log(user);
    console.log(age)
</script>
```
- 在script标签中通过th:inline="javascript"来声明这是要特殊处理的js脚本
- 语法结构：
```js
const user = /*[[Thymeleaf表达式]]*/ "静态环境下的默认值";
```
因为Thymeleaf被注释起来，因此即便是静态环境下， js代码也不会报错，而是采用表达式后面跟着的默认值。且User对象会被直接处理为json格式
# 5. 拓展MVC配置
### 5.1 注意事项
要想扩展mvc的配置，只要写一个类实现WebMvcConfigurer接口，并重写想要拓展的功能即可(这个接口就是SpringMVC使用注解配置时，对应于mvc标签的接口)
此外，这个类要使用@Configuration注解，但是不能使用@EnableWebMvc注解，原因如下：
WebMvcAutoConfiguration类上有这样一个注解，说明只有在容器中没有WebMvcConfigurationSupport这个类时，WebMvcAutoConfiguration才会生效
```java
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
```
@EnableWebMvc注解中有这样一个注解：
```java
@Import({DelegatingWebMvcConfiguration.class})
```
此注解引用了DelegatingWebMvcConfiguration这个类，而这个类继承了WebMvcConfigurationSupport，所以会使容器中出现了WebMvcConfigurationSupport这个类进而导致WebMVC自动配置失效：
```java
public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport
```
### 5.2 示例
```java
@Configuration
public class MyMVC implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/index").setViewName("index");
        registry.addViewController("/index.html").setViewName("index");
        registry.addRedirectViewController("/ss","https://www.baidu.com");
        registry.addStatusController("/bad", HttpStatus.BAD_GATEWAY);
    }
}
```
上述代码实现了addViewControllers方法，在访问/,/index,/index.html时均会指向index界面，在访问/ss时，会被重定向到百度，当访问/bad时，会返回一个错误码
# 6. 国际化
### 6.1 通过浏览器自动进行国际化
在resources目录下创建i18n目录，并在其中创建properties文件，文件命名需要符合以下规范：
![国际化配置文件](/SpringBoot/i18n.jpg)
若名称正确，IDEA会提示出Resource Bundle目录(不是真实存在的)
IDEA中可以使用可视化进行多文件同步编辑：
![国际化配置文件](/SpringBoot/国际化配置.jpg)
使用时通过thymeleaf的#{}表达式获取这些定义在资源文件中的数据
```html
<ul class="nav nav-subnav">
  <li> <a href="lyear_ui_buttons.html" th:text="#{index.button}"></a> </li>
  <li> <a href="lyear_ui_cards.html" th:text="#{index.card}"></a> </li>
  <li> <a href="lyear_ui_grid.html" th:text="#{index.grille}">格栅</a> </li>
  <li> <a href="lyear_ui_icons.html" th:text="#{index.icon}">图标</a> </li>
  <li> <a href="lyear_ui_tables.html" th:text="#{index.table}">表格</a> </li>
  <li> <a href="lyear_ui_modals.html" th:text="#{index.modal_box}">模态框</a> </li>
  <li> <a href="lyear_ui_tooltips_popover.html" th:text="#{index.tips}">提示 / 弹出框</a> </li>
  <li> <a href="lyear_ui_alerts.html" th:text="#{index.warning}">警告框</a> </li>
  <li> <a href="lyear_ui_pagination.html" th:text="#{index.paging}">分页</a> </li>
  <li> <a href="lyear_ui_progress.html" th:text="#{index.progress_bar}">进度条</a> </li>
  <li> <a href="lyear_ui_tabs.html" th:text="#{index.tab}">标签页</a> </li>
  <li> <a href="lyear_ui_typography.html" th:text="#{index.typesetting}">排版</a> </li>
  <li> <a href="lyear_ui_step.html" th:text="#{index.step}">步骤</a> </li>
  <li> <a href="lyear_ui_other.html" th:text="#{index.others}">其他</a> </li>
</ul>
```
以上方式在界面中并没有可以修改语言的按钮或链接，只能通过设置浏览器的语言，通过浏览器发起请求的头部信息决定返回何种语言资源
### 6.2 添加转换语言的按钮
##### 6.2.1 不使用ajax
首先自定义区域解析器，写一个类实现LocaleResolver接口即可
```java
public class MyLocaleResolver implements LocaleResolver {
    @Override
    public Locale resolveLocale(HttpServletRequest request) {
        String language = request.getParameter("language");
        Locale locale = Locale.getDefault();
        if (!StringUtils.isEmpty(language)){
            String[] s = language.split("_");
            locale=new Locale(s[0],s[1]);
        }
        return locale;
    }

    @Override
    public void setLocale(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Locale locale) {

    }
}
```
将自定义类注册到IOC容器中
```java
@Bean
public MyLocaleResolver localeResolver(){
    return new MyLocaleResolver();
}
```
前端界面：
```html
<a th:href="@{/test(language='zh_CN')}">中文</a>
<a th:href="@{/test(language='en_US')}">English</a>
```
以上代码虽然可以实现语言转换，但是默认语言并不会随着浏览器语言改变而改变
##### 6.2.2 使用ajax
区域解析器我们直接选择AcceptHeaderLocaleResolver，这个类可以通过Request Header确定区域
首先注册AcceptHeaderLocaleResolver到IOC容器中
```java
@Bean
public AcceptHeaderLocaleResolver localeResolver(){
    return new AcceptHeaderLocaleResolver();
}
```
前端界面：设置两个按钮并添加点击事件，使用ajax向后端发起请求，beforeSend中设置Request Header中的Accept-Language为zh_CN或en_US，但是此代码中的ajax没有处理返回的html代码，直接插入到了body标签中，虽然浏览器不会报错，但是生成的html并不规范
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script th:src="@{/webjars/jquery/3.5.1/jquery.js}"></script>
    <script th:inline="javascript">
        function a(data) {
            $.ajax({
                url:/*[[@{/test}]]*/ {},
                beforeSend:function (xhr){
                    xhr.setRequestHeader("Accept-Language",data)
                },
                success: function (data){
                    $("body").html(data)
                },

            })
        }
    </script>
</head>
<body>
<p th:text="#{index.others}"></p>
<button onclick="a('zh-CN')">中文</button>
<button onclick="a('en-US')">English</button>
</body>
</html>
```
# 7. 使用JDBC
### 7.1 基本配置
```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306?serverTimezone=UTC
    username: root
    password: 123456
```
### 7.2 使用原生JDBC
```java
// 注意：此DataSource是javax.sql.DataSource
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
### 7.3 使用JdbcTemplate
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
# 8. Druid
### 8.1 基本配置
```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306?serverTimezone=UTC
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource
```
### 8.2 在Spring配置Druid
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
### 8.3 druid监控配置
- 注意：通过yml配置时，若@ConfigurationProperties中的prefix为spring.datasource则不需要在yml中添加druid:*，若为properties配置，需要使用spring.datasource.druid=进行配置
```yml
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
# 9. 使用Mybatis
### 9.1 相关依赖
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
### 9.2 基本配置
```yml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```
### 9.3 接口及xml
接口上 **@Repository**注解可以不加，但是在IDEA中会在自动装配的时候报错，不影响使用
接口上应该添加 **@Mapper**注解或者在主启动类上添加
**@MapperScan(basePackages = "com.example.demo.mapper")** 开启mapper扫描
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
# 10.SpringSecurity
### 10.1 相关依赖
```xml
<!-- SpringSecurity依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<!-- thymeleaf模板依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<!-- thymeleaf-SpringSecurity整合依赖 -->
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
    <version>3.0.4.RELEASE</version>
</dependency>
```
### 10.2 简单使用
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/").permitAll()
                .antMatchers("/vip1/**").hasRole("vip1")
                .antMatchers("/vip2/**").hasRole("vip2")
                .antMatchers("/vip3/**").hasRole("vip3")
                .anyRequest().authenticated()//其他接口登录即可
                .and().formLogin().loginPage("/login");//登录界面
        http.formLogin().loginProcessingUrl("/index")//登录验证url
        .usernameParameter("username")
                .passwordParameter("password")
                .successForwardUrl("https://www.baidu.com")
                .successHandler(new AuthenticationSuccessHandler() {
                    @Override
                    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {

                    }
                }).failureHandler(new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {

            }
        });
        http.logout().logoutSuccessUrl("/index").logoutSuccessHandler(new LogoutSuccessHandler() {
            @Override
            public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {

            }
        });
        http.csrf().disable();//关闭csrf保护
        http.rememberMe();//记住我
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
        web.ignoring().antMatchers("ignore");//添加不拦截
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
      //添加用户，密码要进行加密
        auth.inMemoryAuthentication()
                .passwordEncoder(new BCryptPasswordEncoder())
                .withUser("ppg").password(new BCryptPasswordEncoder().encode("123"))
                .roles("vip1","vip3","vip2")
                .and()
                .withUser("vip1").password(new BCryptPasswordEncoder().encode("123"))
                .roles("vip1");
    }
}
```
### 10.3 thymeleaf整合SpringSecurity
常用标签：
```html
<!-- 命名空间 -->
<html lang="en" xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/extras/spring-security">
判断用户是否已经登陆认证，引号内的参数必须是isAuthenticated()。
sec:authorize="isAuthenticated()"

获得当前用户的用户名，引号内的参数必须是name。
sec:authentication="name"

判断当前用户是否拥有指定的权限。引号内的参数为权限的名称。
sec:authorize=“hasRole(‘role’)”

获得当前用户的全部角色，引号内的参数必须是principal.authorities。
sec:authentication="principal.authorities"
```
### 10.4 SpringSecurity详解
##### 10.4.1 SpringSecurity配置文件详解
```java
package edu.sdust.album.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;

/**
 * @author ppg007
 * @date 2021/4/27 16:47
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    // 注入一个用于认证的接口的实现类
    @Autowired
    private UserAuthorityImpl userAuthority;

    // 注入数据源，用于记住我功能的实现
    @Autowired
    private DataSource dataSource;

    // 创建用于保存登录信息的接口的实现
    public PersistentTokenRepository persistentTokenRepository(){
        JdbcTokenRepositoryImpl jdbcTokenRepository = new JdbcTokenRepositoryImpl();
        jdbcTokenRepository.setDataSource(dataSource);

        // 自动建表
//        jdbcTokenRepository.setCreateTableOnStartup(true);
        return jdbcTokenRepository;
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 设置自定义403报错界面
        http.exceptionHandling().accessDeniedPage("/403");
        http.csrf().disable()//关闭跨站请求保护
                .formLogin().loginPage("/toLogin")//使用自定义的登录界面
                .usernameParameter("account")//指出自定义界面中的用户名
                .passwordParameter("password")//指出自定义界面中的密码
                //设置用于登录处理的url，此url不存在于controller中，
                // 可以理解为起别名，由SpringSecurity实现
                .loginProcessingUrl("/login")
                // 设置默认成功转发到的路径，注意和successForwardUrl的区别
                // 即重定向和转发
                .defaultSuccessUrl("/upload");
        // 设置处理登出的url，此url同样不存在于controller中
        http.logout().logoutUrl("/logout")
            // 设置登出成功的跳转界面
            .logoutSuccessUrl("/");
        // 开启记住我功能
        http.rememberMe().
            // 将用于保存登录接口的实现类实例传入
            tokenRepository(persistentTokenRepository())
            // 设置有效时间，单位是秒
            .tokenValiditySeconds(60)
            // 使用认证接口类实例
            .userDetailsService(userAuthority);
        // 对部分url做出限制
        http.authorizeRequests()
            .antMatchers("/upload")
            // 对权限进行限制
            .hasAuthority("vip")
            .antMatchers("/toRegister")
            // 对角色进行限制
            .hasRole("root");
            .antMatchers("/login")
            // 全部放开
            .permitAll();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 使用注入的认证接口实现类对用户权限、角色进行验证和管理
        auth.userDetailsService(userAuthority);
    }

    // 向IOC中注入加密bean
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```
##### 10.4.2 登录认证实现类详解
```java
package edu.sdust.album.config;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import edu.sdust.album.mapper.UserMapper;
import edu.sdust.album.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author ppg007
 * @date 2021/4/27 18:34
 */
@Component
// 实现UserDetailsService接口，并重写loadUserByUsername方法
public class UserAuthorityImpl implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
        userQueryWrapper.eq("account",s);
        User user = userMapper.selectOne(userQueryWrapper);
        if (user==null){
            throw new UsernameNotFoundException("用户名"+s+"不存在");
        }
        // 赋予权限或角色
        // 注意：赋予角色时，必须加上ROLE_前缀，而配置类中做出限制时则不需要
        List<GrantedAuthority> role = AuthorityUtils.commaSeparatedStringToAuthorityList("vip,ROLE_admin");

        // 返回user对象，密码必须使用加密类进行加密
        return new org.springframework.security.core.userdetails.User(user.getAccount(),bCryptPasswordEncoder.encode(user.getPassword()),role);
    }
}
```
##### 10.4.3 方法注解详解
要使用共计四种(这里只介绍三种)方法注解，需要在主启动类上添加
```java
@EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true)
```
1. @Secured
>该注解对用户角色进行判断，只有拥有正确角色的用户可以正常访问
```java
@RequestMapping("/test")
@ResponseBody
@Secured({"ROLE_test"})
public String test(){
    return "test";
}
```
2. @PreAuthorize
>该注解对用户的权限和角色进行判断，可以使用hasAuthority、hasRole等方法进行约束
```java
@RequestMapping("/authTest")
@ResponseBody
@PreAuthorize("hasAuthority('vipp')")
public String authTest(){
    return "authTest";
}
```
3. @PostAuthorize
>该注解先执行方法，再判断用户权限和角色
```java
@RequestMapping("/postTest")
@ResponseBody
@PostAuthorize("hasAuthority('vipp')")
public String postTest(){
    System.out.println("test");
    return "test";
}
```
# 11.Shiro
### 11.1 相关依赖
```xml
<!-- shiro依赖 -->
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring-boot-starter</artifactId>
    <version>1.7.1</version>
</dependency>
<!-- thymeleaf模板依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<!-- thymeleaf整合shiro依赖 -->
<dependency>
    <groupId>com.github.theborakompanioni</groupId>
    <artifactId>thymeleaf-extras-shiro</artifactId>
    <version>2.0.0</version>
</dependency>
```
### 11.2 简单配置
- Shiro三大模块
1. **Subject**：主体，一般指用户。
2. **SecurityManager**：安全管理器，管理所有Subject，可以配合内部安全组件。(类似于SpringMVC中的DispatcherServlet)
3. **Realms**：用于进行权限信息的验证，一般需要自己实现。
- 配置步骤
  - 3. ShiroFilterFactoryBean
  - 2. DefaultWebSecurityManager
  - 1. 创建 realm 对象-自定义
- 配置Realm
```java
public class UserRealm extends AuthorizingRealm{

    @Autowired
    private UserMapper userMapper;
    /**
     * 授权
     * @param principalCollection ?
     * @return null
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        System.out.println("执行了==>授权doGetAuthorizationInfo");
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        // 添加权限
        simpleAuthorizationInfo.addStringPermission("user:add");
        simpleAuthorizationInfo.addStringPermission("user:update");
        return simpleAuthorizationInfo;
    }

    /**
     * 认证
     * @param authenticationToken ?
     * @return null
     * @throws AuthenticationException 异常
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        System.out.println("执行了==>认证doGetAuthenticationInfo");
        // 令牌
        UsernamePasswordToken token= (UsernamePasswordToken) authenticationToken;
        List<User> users = userMapper.queryUserByName(token.getUsername());
        if (users.isEmpty()){
            return null;
        }
        return new SimpleAuthenticationInfo("",users.get(0).getPassword(),"");
    }
}
```
- 配置ShiroConfig
```java
@Configuration
public class ShiroConfig {

    // 注册Realm
    @Bean
    public UserRealm userRealm(){
        return new UserRealm();
    }

    // 注册DefaultWebSecurityManager
    @Bean
    public DefaultWebSecurityManager defaultWebSecurityManager(){
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        defaultWebSecurityManager.setRealm(userRealm());
        return defaultWebSecurityManager;
    }

    // 创建ShiroFilterFactoryBean
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(defaultWebSecurityManager());

//        添加shiro内置过滤器
//        anon：无需认证就可访问
//        authc：必须认证才能访问
//        user：必须拥有记住我功能才能使用
//        perms：拥有某个资源的权限才能访问
//        role：拥有某个角色权限才能访问
        LinkedHashMap<String, String> stringStringLinkedHashMap = new LinkedHashMap<>();
        stringStringLinkedHashMap.put("/add","perms[user:add]");
        stringStringLinkedHashMap.put("/update","perms[user:update]");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(stringStringLinkedHashMap);
        shiroFilterFactoryBean.setLoginUrl("/toLogin");
        shiroFilterFactoryBean.setUnauthorizedUrl("/noauth");
        return shiroFilterFactoryBean;
    }

    //整合ShiroDialect 整合thymeleaf
    @Bean
    public ShiroDialect shiroDialect(){
        return new ShiroDialect();
    }
}
```
### 11.3 简单使用Shiro
```java
@RequestMapping("/check")
public String login(HttpServletRequest request,Model model){
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    //        获取当前用户

    Subject subject = SecurityUtils.getSubject();
    System.out.println(username);
    System.out.println(password);
    //        封装用户的登录数据
    UsernamePasswordToken token = new UsernamePasswordToken(username, password);
    try {
        // 登录
        subject.login(token);
        return "index";
    } catch (UnknownAccountException e) {
        model.addAttribute("msg","用户名错误");
        return "login";
    } catch (IncorrectCredentialsException e){
        model.addAttribute("msg","密码错误");
        return "login";
    }
}
```
### 11.4 thymeleaf整合Shiro
- 命名空间
```html
<html lang="en" xmlns:th="http://www.thymeleaf.org"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
```
- 常见标签
```html
guest标签
　　<shiro:guest>
　　</shiro:guest>
　　用户没有身份验证时显示相应信息，即游客访问信息。

user标签
　　<shiro:user>　　
　　</shiro:user>
　　用户已经身份验证/记住我登录后显示相应的信息。

authenticated标签
　　<shiro:authenticated>　　
　　</shiro:authenticated>
　　用户已经身份验证通过，即Subject.login登录成功，不是记住我登录的。

notAuthenticated标签
　　<shiro:notAuthenticated>
　　
　　</shiro:notAuthenticated>
　　用户已经身份验证通过，即没有调用Subject.login进行登录，包括记住我自动登录的也属于未进行身份验证。

principal标签
　　<shiro: principal/>
　　
　　<shiro:principal property="username"/>
　　相当于((User)Subject.getPrincipals()).getUsername()。

lacksPermission标签
　　<shiro:lacksPermission name="org:create">
　
　　</shiro:lacksPermission>
　　如果当前Subject没有权限将显示body体内容。

hasRole标签
　　<shiro:hasRole name="admin">　　
　　</shiro:hasRole>
　　如果当前Subject有角色将显示body体内容。

hasAnyRoles标签
　　<shiro:hasAnyRoles name="admin,user">
　　　
　　</shiro:hasAnyRoles>
　　如果当前Subject有任意一个角色（或的关系）将显示body体内容。

lacksRole标签
　　<shiro:lacksRole name="abc">　　
　　</shiro:lacksRole>
　　如果当前Subject没有角色将显示body体内容。

hasPermission标签
　　<shiro:hasPermission name="user:create">　　
　　</shiro:hasPermission>
　　如果当前Subject有权限将显示body体内容
```
# 12.异步任务
### 12.1 开启异步支持
在要是用异步方法的类上(或主启动类上)添加 **@EnableAsync**注解
> @EnableAsync  注解主要是为了扫描范围包下的所有 @Async注解
### 12.2 在方法上开启异步
```java
@Async
public void hello(){
    try{
        Thread.sleep(3000);
    } catch (Exception e){
        e.printStackTrace();
    }
    System.out.println("Processing");
}
```
# 13.邮件任务
### 13.1 相关依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```
### 13.2 基础配置
```properties
#注意：QQ邮箱需要配置ssl，发件邮箱要开启SMTP服务
spring.mail.username=springbootforppg@163.com
spring.mail.password=YMIRUQKQUVHCVDOB
spring.mail.host=smtp.163.com
spring.mail.protocol=smtps
spring.mail.port=465
```
### 13.3 简单使用
```java
@Component
public class SendMail {

    // 静态变量如果直接@Autowired注入会报错，
    // 因为注入发生在实例化之后，
    // 静态变量不需要实例化，
    // 所以静态变量注入的时候容器中没有实例化的Bean可用
    // 但是可以通过非静态set方法进行注入
    private static MailMapper mailMapper;

    private static JavaMailSender javaMailSender;

    @Autowired
    public void setJavaMailSender(JavaMailSender javaMailSender){
        SendMail.javaMailSender=javaMailSender;
    }

    @Autowired
    public void setMailMapper(MailMapper mailMapper) {
        SendMail.mailMapper = mailMapper;
    }


    public static void send() throws MessagingException {
        List<String> list = mailMapper.queryAllMailAddress();

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        /**
        true:开启复杂邮件
        UTF-8：设置编码
        */
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,true,"UTF-8");
        mimeMessageHelper.setSubject("每日N石更");//主题
        mimeMessageHelper.setText("全都可以炸完");//正文
        mimeMessageHelper.setFrom("springbootforppg@163.com");//发件人
        mimeMessageHelper.addAttachment("很大.jpg",new File(ImageUrl.getImageUrl()));//添加附件


        for (String s : list) {
            // 设置收信人
            mimeMessageHelper.setTo(s);
            try{
                // 发送
                javaMailSender.send(mimeMessage);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
```
# 14.定时任务
### 14.1 开启定时任务
在主启动类上添加 **@EnableScheduling**注解开启定时任务支持
### 14.2 使用定时任务
在要开启定时执行的方法上添加，括号内为cron表达式
**@Scheduled(cron = "0 0 8,12,18,22 * * ?")**
# 15. RPC

# 16. Dubbo-Zookeeper
### 16.1 相关依赖
首先下载apache-zookeeper-3.6.2-bin，启动bin目录下的zkServer.cmd

```xml
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-spring-boot-starter</artifactId>
    <version>2.7.8</version>
</dependency>
<dependency>
    <groupId>com.github.sgroschupf</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.1</version>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-framework</artifactId>
    <version>5.1.0</version>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.1.0</version>
</dependency>
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.6.2</version>
    <!-- 排除日志防止日志冲突 -->
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```
### 16.2 服务提供者
1. 定义服务接口
```java
public interface TicketService {

    String getTicket();
}
```
2. 定义服务实现类
添加@DubboService注解开启Dubbo支持
```java
@Component
@DubboService
public class TicketServiceImpl implements TicketService{
    @Override
    public String getTicket() {
        return "李在干神魔";
    }
}
```
3. application.properties
```properties
#服务名
dubbo.application.name=provider
#注册中心URL,可以在zookeeper的conf目录下找到端口号等信息
dubbo.registry.address=zookeeper://127.0.0.1:2181
#指定要扫描@DubboService注解的包
dubbo.scan.base-packages=com.example.provider.service
```
4. Maven打包到本地仓库
首先打成jar包
- 执行：
```
mvn install:install-file -Dfile=D:\Javaweb\dubbo-zookeeper\provider\target\provider-0.0.1-SNAPSHOT.jar //jar包绝对路径
-DgroupId=com.example
-DartifactId=provider
-Dversion=0.0.1-SNAPSHOT
-Dpackaging=jar
```
### 16.3 服务消费者
1. 引入定义的服务提供者
```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>provider</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```
2. 使用服务提供者的服务
通过@DubboReference注入服务
```java
@Service
public class UserService {

    @DubboReference
    private TicketService ticketService;

    public String buy(){
        return ticketService.getTicket();
    }
}
```
3. application.properties
```properties
dubbo.application.name=customer
dubbo.registry.address=zookeeper://127.0.0.1:2181
```
### 16.4 Dubbo-admin
