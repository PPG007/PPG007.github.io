# 1.Servlet
### 1.1 实现Servlet的方法
1. class implements Servlet
```java
//Servlet的生命周期:从Servlet被创建到Servlet被销毁的过程
//一次创建，到处服务
//一个Servlet只会有一个对象，服务所有的请求
/*
 * 1.实例化（使用构造方法创建对象）
 * 2.初始化  执行init方法
 * 3.服务     执行service方法
 * 4.销毁    执行destroy方法
 */
public class ServletDemo1 implements Servlet {

    //public ServletDemo1(){}

     //生命周期方法:当Servlet第一次被创建对象时执行该方法,该方法在整个生命周期中只执行一次
    public void init(ServletConfig arg0) throws ServletException {
                System.out.println("=======init=========");
        }

    //生命周期方法:对客户端响应的方法,该方法会被执行多次，每次请求该servlet都会执行该方法
    public void service(ServletRequest arg0, ServletResponse arg1)
            throws ServletException, IOException {
        System.out.println("hehe");

    }

    //生命周期方法:当Servlet被销毁时执行该方法
    public void destroy() {
        System.out.println("******destroy**********");
    }
//当停止tomcat时也就销毁的servlet。
    public ServletConfig getServletConfig() {

        return null;
    }

    public String getServletInfo() {

        return null;
    }
}
```
2. extends GenericServlet
```java
public class Servlet2 extends GenericServlet {

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {

    }
}
```
3. extends HttpServlet
```java
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String method=req.getParameter("method");
        if ("add".equals(method)){
            req.getSession().setAttribute("msg","执行了add方法");
        }
        else if ("delete".equals(method)){
            req.getSession().setAttribute("msg","执行了delete方法");
        }
        else {
            req.getSession().setAttribute("msg","鬼！");
        }

        req.getRequestDispatcher("/WEB-INF/jsp/test.jsp").forward(req,resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
```
# 2.Controller
### 2.1 SpringMVC工作流程

![s](/SpringMVC/SpringMVC工作流程.png)
- 核心：**DispatcherServlet**
### 2.2 web.xml配置
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
            <param-name>contextConfigLocation</param-name>
            <!-- Spring的配置文件 -->
            <param-value>classpath:springmvc-servlet.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <!-- 拦截所有请求 -->
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```
### 2.3 Spring配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">


    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>

    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>

    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!-- 自动拼接 -->
        <!-- 前缀 -->
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <!-- 后缀 -->
        <property name="suffix" value=".jsp"/>
    </bean>
    <!-- 注册自定义的Controller类 -->
    <bean class="controller.HelloController" id="/hello"/>
</beans>
```
- BeanNameUrlHandlerMapping
处理器映射器的一种，根据请求的url与Spring容器中定义的处理器bean的id属性值进行匹配，**这种方式中bean的id属性必须以'/'开头**
- SimpleControllerHandlerAdapter
处理器适配器的一种，这个实现类将HTTP请求适配到一个控制器的实现进行处理。SimpleControllerHandlerAdapter将会调用处理器的handleRequest方法进行功能处理，该处理方法返回一个ModelAndView给DispatcherServlet。
- InternalResourceViewResolver
视图解析器的一种，InternalResourceViewResolver不管能不能解析它都不会返回null，也就是说它拦截了所有的逻辑视图，让后续的解析器得不到执行，所以InternalResourceViewResolver优先级必须放在最后。
### 2.4 实现Controller(非注解)
通过实现Controller接口，并重写其中的handleRequest方法实现定义Controller，这种方法意味着每一个url都要对应一个Controller，每个Controller单独成类，且都要在Spring容器中注册，效率极低
```java
public class HelloController implements Controller {
    @Override
    public ModelAndView handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.addObject("msg","Hello Controller");
        modelAndView.setViewName("hello");
        return modelAndView;
    }
}
```
### 2.5 使用注解实现Controller(仅Controller使用注解)
1. web.xml配置无变化
2. Spring配置如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc https://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!-- 开启自动扫描包：controller包 -->
    <context:component-scan base-package="controller"/>
    <!-- 开启Spring注解支持 -->
    <context:annotation-config/>
    <!-- 开启默认处理器，防止静态资源404 -->
    <mvc:default-servlet-handler/>
    <!-- 开启mvc的注解支持 -->
    <mvc:annotation-driven/>
    <!-- 视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" id="internalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
</beans>
```
3. Controller:
```java
@Controller//表示此类为Controller类
public class HelloController {

    @GetMapping("/hello")//仅支持GET方式请求
    public String hello1(Model model){
        model.addAttribute("msg","Hello SpringMVC-Annotation!");

        return "hello";
    }

    @RequestMapping("/wuhu")//同时支持GET和POST
    public ModelAndView hello2(HttpServletRequest request){
        String username = request.getParameter("username");
        System.out.println(username);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("msg",username);
        modelAndView.setViewName("hello");
        return modelAndView;
    }
}
```
### 2.6 RestFul风格
- 传统url：localhost:8080/tradition?name=admin&password=123
- RestFul风格：localhost:8080/tradition/admin/123
RestFul风格更有层次，更安全
实现原理：
通过@PathVariable注解与@RequestMapping中url一一对应实现
```java
@RequestMapping("/add/{a}/{b}")
public String test(Model model, @PathVariable("a")int a,@PathVariable("b") int b){
    int integer = a + b;
    String msg= Integer.toString(integer);
    model.addAttribute("msg",msg);
    return "hello";
}
```
### 2.7 重定向与转发
- 重定向：request不再是原先的request，两个请求之间相互独立。
- 转发：前后的request相同
重定向：
```java
@RequestMapping("redirect")
public void test2(HttpServletResponse response,HttpServletRequest request) throws IOException {
    response.sendRedirect("/index.jsp");
}

@RequestMapping("redirect2")
public String test5(){
    //显式指定redirect或forward后，既可以跳转controller，也可以直接访问web路径下的静态资源
    return "redirect:https://www.baidu.com";
}
```
转发：
```java
@RequestMapping("/forward")
public void test(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setAttribute("msg","forward");
    request.getRequestDispatcher("/WEB-INF/jsp/hello.jsp").forward(request,response);
}


@RequestMapping("/forward2")
public String test3(){
    //使用视图解析器相当于访问对应的controller
    return "/hello";
    //return "/index.jsp";文件[/WEB-INF/jsp/index.jsp.jsp] 未找到
    //若不使用视图解析器，需要返回全路径，以web文件夹为根目录
}


@RequestMapping("/forward3")
public String test4(){
    return "forward:/hello";
    //相当于访问controller
    //return "froward:/index.jsp";直接从web文件夹下寻找
}
```
### 2.8 乱码问题
- 情况一：jsp、html等静态页面没有设置UTF-8，或者文件格式不是UTF-8

    - 解决：添加头部指定编码格式为UTF-8
- 情况二：调试中，控制台输出乱码

    - 解决：在Tomcat的启动参数中添加-Dfile.encoding=UTF-8，指定jvm以UTF-8启动。**注意：此项设置需要重启IDE方可生效**
- 情况三：浏览器前端界面乱码
    - 解决：在web.xml中配置Spring的CharacterEncodingFilter即可
    ```xml
        <filter>
        <filter-name>spring</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>spring</filter-name>
        <!-- /*表示还要过滤静态文件 -->
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    ```
# 3. 使用JSON传递数据
### 3.1 JavaScript中的JSON方法
```js
// 定义对象
let user={
    name:"ppg",
    age:20,
    sex:"boy"
};
let json = JSON.stringify(user);//将对象转换为JSON表示
let object=JSON.parse(json);//从JSON解析出Object对象
```
### 3.2 jackson
##### 3.2.1 相关依赖
```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.11.2</version>
</dependency>
```
##### 3.2.2 Spring配置
在Spring中做出如下配置
```xml
<mvc:annotation-driven>
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
```
##### 3.2.3 使用jackson
- 要是用jackson，需要首先通过构造函数构造一个**ObjectMapper**对象
```java
ObjectMapper mapper = new ObjectMapper();
Friend friend = new Friend("yitian", 25);

// 写为字符串
String text = mapper.writeValueAsString(friend);
// 写为文件
mapper.writeValue(new File("friend.json"), friend);
// 写为字节流
byte[] bytes = mapper.writeValueAsBytes(friend);
System.out.println(text);
// 从字符串中读取
Friend newFriend = mapper.readValue(text, Friend.class);
// 从字节流中读取
newFriend = mapper.readValue(bytes, Friend.class);
// 从文件中读取
newFriend = mapper.readValue(new File("friend.json"), Friend.class);
System.out.println(newFriend);
```
- 示例
```java
@RestController//@RestController=@Controller+@ResponseBody,不再经过视图解析器
public class JsonController {

    @RequestMapping(value = "/json1"/**,
    produces = "application/json;charset=UTF-8"->
    此段内容作用等同于在Spring中配置<mvc:message-converters>**/)
    public String json1() throws JsonProcessingException {
        ObjectMapper mapper=new ObjectMapper();
        User user=new User(1,"赵泽龙","5937");
        return mapper.writeValueAsString(user);
    }

    @RequestMapping(value = "/json2")
    @CrossOrigin//允许跨域访问，由于浏览器禁止ajax跨域，通过此注解可以实现ajax跨域请求
    public String json2() throws JsonProcessingException {
        ObjectMapper mapper=new ObjectMapper();

        List<User> userList=new ArrayList<>();
        User user=new User(1,"赵泽龙","5937");
        User user2=new User(2,"赵泽龙","5937");
        User user3=new User(3,"赵泽龙","5937");
        User user4=new User(4,"赵泽龙","5937");
        User user5=new User(5,"赵泽龙","5937");
        User user6=new User(6,"赵泽龙","5937");

        userList.add(user);
        userList.add(user2);
        userList.add(user3);
        userList.add(user4);
        userList.add(user5);
        userList.add(user6);

        // readValue用于将JSON字符串解析为简单Java对象
        mapper.readValue(mapper.writeValueAsString(user2),User.class);
        String s = mapper.writeValueAsString(userList);
        System.out.println(s);
        // readTree用于解析JSON字符串为复杂集合List、Map等
        JsonNode jsonNode = mapper.readTree(s);
        for (JsonNode node : jsonNode) {
            System.out.print(node.get("age"));
            //asText方法会去掉引号
            System.out.print(node.get("name").asText());
            System.out.println(node.get("tel").asText());
        }

        return mapper.writeValueAsString(userList);
    }

    @RequestMapping("/json3")
    public String json3() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        //默认会解析为时间戳
        Date date = new Date();
        //使用ObjectMapper格式化,return date
        mapper.configure(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS,false);

        //自定义日期格式,return format
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String format = simpleDateFormat.format(date);
        mapper.setDateFormat(simpleDateFormat);
        return mapper.writeValueAsString(date);
    }
}
```
### 3.3 fastjson
##### 3.3.1 相关依赖
```xml
<dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.47</version>
    </dependency>
```
##### 3.3.2 Spring配置
FastJsonHttpMessageConverter写与不写没区别(在基本使用上)，且若仅配置FastJsonHttpMessageConverter而不配置StringHttpMessageConverter，会导致JSON.toJSONString方法返回的JSON字符串中包含转义反斜杠，需要前端JavaScript两次JSON.parse()才能获取到正常的JSON对象
```xml
<mvc:annotation-driven>
    <mvc:message-converters>
        <bean class="org.springframework.http.converter.StringHttpMessageConverter">
            <constructor-arg value="UTF-8"/>

        </bean>

        <!-- <bean class="com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter">
        </bean> -->
    </mvc:message-converters>
</mvc:annotation-driven>
```
##### 3.3.3 使用fastjson

```java
//Java对象转JSON字符串
System.out.println("userList to JSONString:"+JSON.toJSONString(userList));
System.out.println("user to JSONString:"+JSON.toJSONString(user));

//Java对象转JSON对象
JSONObject jsonObject=(JSONObject)JSON.toJSON(user2);
System.out.println("Java Object to JSON Object:"+jsonObject);

//JSON字符串转Java对象
User temp=JSON.parseObject(JSON.toJSONString(user3),User.class);
System.out.println("JSONString to Java Object:"+temp);

//JSON对象转Java对象
User user1 = JSON.toJavaObject(jsonObject, User.class);
System.out.println("JSON Object to Java Object:"+user1);

//使用JSONArray
JSONArray jsonArray = new JSONArray();
jsonArray.add(jsonObject);
jsonArray.add(JSON.toJSON(user));
List<User> users = JSONArray.parseArray(jsonArray.toString(), User.class);
users.forEach(System.out::println);
System.out.println(jsonArray.toJSONString());
System.out.println(jsonArray.toString());
```
### 3.4 org.json:json
##### 3.4.1 相关依赖
```xml
<dependency>
    <groupId>org.json</groupId>
    <artifactId>json</artifactId>
    <version>20190722</version>
</dependency>
```
##### 3.4.2 Spring配置
```xml
<mvc:annotation-driven>
    <mvc:message-converters register-defaults="true">
        <bean class="org.springframework.http.converter.StringHttpMessageConverter">
            <constructor-arg value="UTF-8"/>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
```
##### 3.4.3 使用org.json

```java
Student student = new Student(1, "赵泽龙");
//通过构造函数创建JSONObject
JSONObject jsonObject = new JSONObject(student);
System.out.println("id=" + jsonObject.getInt("id"));
System.out.println("name="+jsonObject.getString("name"));

//通过put方法创建JSONObject
JSONObject jsonObject2 = new JSONObject();
jsonObject2.put("id",2);
jsonObject2.put("name", "赵泽龙2");
System.out.println("id=" + jsonObject2.get("id"));
System.out.println("name="+jsonObject2.get("name"));

//通过put方法创建JSONArray
JSONArray jsonArray = new JSONArray();
jsonArray.put(jsonObject);
System.out.println(jsonArray.getJSONObject(0).toString());

//通过构造函数创建JSONArray
ArrayList<Student> students = new ArrayList<>();
students.add(student);
students.add(student);
JSONArray jsonArray1 = new JSONArray(students);
System.out.println(jsonArray1.toString());
```
# 4. Ajax

### 4.1 ajax基本属性
```js
$.ajax({
    url:"/books/ajaxSelect",
    data:{"bookName":bookName},//JSONObject或String
    async:true,//Boolean类型，默认为true，所有请求为异步，若设置false，将使用同步请求，锁住浏览器，其他操作必须等待ajax执行完毕
    type:"POST",//请求方式：POST、GET、DELETE、PUT
    timeout:5000,//毫秒
    cache:true,//默认为true，当dataType为script时默认false，false将不会从浏览器中加载请求信息
    dataType:"json",//预期返回的数据类型
    success:function (data){
        $("#bookTable").html(refresh(data));
    },
    error:function (data){
        console.log(data);
    },
    complete:function (){
        console.log("complete");
    },

});
```
- dataType:
    - xml：返回XML文档，可用JQuery处理。
    - html：返回纯文本HTML信息；包含的script标签会在插入DOM时执行。
    - script：返回纯文本JavaScript代码。不会自动缓存结果。除非设置了cache参数。注意在远程请求时（不在同一个域下），所有post请求都将转为get请求。
    - json：返回JSON数据。
    - jsonp：JSONP格式。使用SONP形式调用函数时，例如myurl?callback=?，JQuery将自动替换后一个“?”为正确的函数名，以执行回调函数。
    - text：返回纯文本字符串。
### 4.2 ajax处理前端
前端代码：
```html
<table class="table table-hover table-striped">
<thead>
    <tr>
        <th>书籍编号</th>
        <th>书籍名称</th>
        <th>书籍数量</th>
        <th>书籍详情</th>
    </tr>
</thead>
<tbody id="bookTable">
    <c:forEach var="book" items="${bookList}">
        <tr >
            <td>${book.bookId}</td>
            <td>${book.bookName}</td>
            <td>${book.bookCounts}</td>
            <td>${book.detail}</td>
            <td>
                <a href="${pageContext.request.contextPath}/books/toUpdatePage?bookId=${book.bookId}">修改</a>&nbsp;|&nbsp;
                <a href="${pageContext.request.contextPath}/books/delete?bookId=${book.bookId}">删除</a>
            </td>
        </tr>
    </c:forEach>
</tbody>
</table>
```
通过ajax获取到数据后，调用拼接函数，注意拼接的位置(tbody)
```js
function refresh(data) {
    let bookList=JSON.parse(data);
    let html="";
    for (let i=0;i<bookList.length;i++){
        html+="<tr><td>"+bookList[i].bookId+"</td>"
            +"<td>"+bookList[i].bookName+"</td>"
            +"<td>"+bookList[i].bookCounts+"</td>"
            +"<td>"+bookList[i].detail+"</td></tr>"
    }
    console.log(html);
    return html;
}
```
### 4.3 后台处理
后台通过@ResponseBody注解或@RestController注解返回一个json字符串即可
# 5. 文件上传和下载
### 5.1 上传
##### 5.1.1 前端代码
设置form表单的enctype属性为multipart/form-data用以接收字节数据
```html
<form action="${pageContext.request.contextPath}/upload/doUpload2" enctype="multipart/form-data" method="post">
    <input type="file" name="file">
    <input type="submit" value="上传">
</form>
```
##### 5.1.2 Spring配置
```xml
<!--    id必须是这个-->
<bean class="org.springframework.web.multipart.commons.CommonsMultipartResolver" id="multipartResolver">
<!--        编码必须和jsp界面编码一致-->
    <property name="defaultEncoding" value="UTF-8"/>
<!--        文件大小，单位是字节-->
    <property name="maxUploadSize" value="10485760"/>
    <property name="maxInMemorySize" value="40960"/>
</bean>
```
id必须是multipartResolver的原因：
DispatcherServlet中部分beanName是确定无法改变的
```java
public static final String MULTIPART_RESOLVER_BEAN_NAME = "multipartResolver";
public static final String LOCALE_RESOLVER_BEAN_NAME = "localeResolver";
public static final String THEME_RESOLVER_BEAN_NAME = "themeResolver";
public static final String HANDLER_MAPPING_BEAN_NAME = "handlerMapping";
public static final String HANDLER_ADAPTER_BEAN_NAME = "handlerAdapter";
public static final String HANDLER_EXCEPTION_RESOLVER_BEAN_NAME = "handlerExceptionResolver";
public static final String REQUEST_TO_VIEW_NAME_TRANSLATOR_BEAN_NAME = "viewNameTranslator";
public static final String VIEW_RESOLVER_BEAN_NAME = "viewResolver";
public static final String FLASH_MAP_MANAGER_BEAN_NAME = "flashMapManager";
```
##### 5.1.3 后台代码
方法一：
```java
@PostMapping("/doUpload")
public String upload(@RequestParam("file")CommonsMultipartFile file, HttpServletRequest request) throws IOException {
    //获取上传的文件名
    String originalFilename = file.getOriginalFilename();
    // 若为空就重定向
    if ("".equals(originalFilename)){
        return "redirect:/upload";
    }
    //getServletContext方法需要servlet-api3.0版本以上
    // 获取服务器端的路径
    String realPath = request.getServletContext().getRealPath("/upload");
    // 创建指定的文件夹
    File file1 = new File(realPath);
    if (!file1.exists()){
        file1.mkdir();
    }
    // 通过流读取文件并输出
    InputStream inputStream = file.getInputStream();
    assert originalFilename != null;
    FileOutputStream fileOutputStream = new FileOutputStream(new File(file1, originalFilename));
    int len=0;
    byte[] buffer=new byte[1024];
    while ((len=inputStream.read(buffer))!=-1){
        fileOutputStream.write(buffer,0,len);
        fileOutputStream.flush();
    }
    fileOutputStream.close();
    inputStream.close();
    return "redirect:/upload";
}
```
方法二：调用CommonsMultipartFile的transferTo方法
```java
@PostMapping("/doUpload2")
public String upload2(@RequestParam("file")CommonsMultipartFile file, HttpServletRequest request) throws IOException {
    String realPath = request.getServletContext().getRealPath("/upload2");
    File file1 = new File(realPath);
    if (!file1.exists()){
        file1.mkdir();
    }
    file.transferTo(new File(file1+"/"+file.getOriginalFilename()));
    return "redirect:/upload";
}
```
### 5.2 下载
##### 5.2.1 前端代码
```html
<a href="${pageContext.request.contextPath}/download/doDownload">download</a>
```
##### 5.2.2 后台代码
```java
@RequestMapping("/doDownload")
public String doDownload(HttpServletResponse response, HttpServletRequest request) throws Exception{
    String realPath = request.getServletContext().getRealPath("/upload");
    // 此处文件名应由前端传回指定
    String fileName="sw.js";
    // 以下为设置response响应头
    response.reset();
    response.setCharacterEncoding("UTF-8");
    response.setContentType("multipart/form-data");
    response.setHeader("Content-Disposition","attachment;fileName="+ URLEncoder.encode(fileName,"UTF-8"));
    // 获取文件
    File file = new File(realPath, fileName);
    // 通过流读取文件
    FileInputStream fileInputStream = new FileInputStream(file);
    ServletOutputStream outputStream = response.getOutputStream();
    byte[] buffer = new byte[1024];
    int index=0;
    while((index=fileInputStream.read(buffer))!=-1){
        outputStream.write(buffer,0,index);
        outputStream.flush();
    }
    outputStream.close();
    fileInputStream.close();
    return "redirect:/download";
}
```
### 5.3 注意事项
1. 使用transferTo方法前要先判断是否上传了文件，防止为空
2. Controller中@RequestMapping的url最好要与表单中的name属性区别开
# 6. 拦截器
拦截器是AOP思想的一种实践，是SpringMVC框架提供的，只会过滤controller请求
### 6.1 创建拦截器
要创建自定义拦截器，就要实现**HandlerInterceptor**接口并至少重写**preHandle**方法
```java
public class Interceptor implements HandlerInterceptor {

    // preHandle返回值为true时放行，否则被拦截，相当于前置通知
    // 以下是一个简单地登录验证
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        if (session.getAttribute("username")!=null||request.getRequestURI().contains("login"))
        {
            return true;
        }
        request.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(request,response);
        return false;
    }

    // 后置通知
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("after");
    }

    // 环绕通知
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("clean");
    }
}
```
### 6.2 Spring配置
```xml
<mvc:interceptors>
    <mvc:interceptor>
    <!-- /**表示拦截一个请求及其后面的所有url，例如/admin/**拦截admin后的所有请求 -->
        <mvc:mapping path="/**"/>
        <bean class="Interceptor.Interceptor"/>
    </mvc:interceptor>
</mvc:interceptors>
```
# 7. SSM框架整合
### 7.1 配置web.xml
- 创建项目后，需要在IDEA中右击项目模块，选择Add Framework Support添加web支持
web.xml:配置DispatcherServlet及CharacterEncodingFilter
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
- 若仅Spring想通过Config方式配置，则需要在servlet-class后紧接着添加如下内容
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
### 7.2 配置Spring
##### 7.2.1 配置数据源、注解支持、整合Mybatis
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
- 关于c3p0数据源的注意事项：c3p0的用户名属性为user，最开始在properties中配置为username时，即使通过${username}并且显示取到了值但是仍然报错，修改为user后正常
##### 7.2.2 配置service层
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
##### 7.2.3 配置mvc
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
# 8. 使用纯JavaConfig配置SSM
### 8.1 配置DispatcherServlet及Filter
通过继承AbstractAnnotationConfigDispatcherServletInitializer类并重写其中方法对应实现web.xml的功能
```java
public class SpringInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    // 此方法返回RootConfig
    // 一些公共的bean，如Services，Repository均在getRootConfigClasses返回的类中配置
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return null;
    }

    // 此方法返回SpringConfig
    // 每个DispatcherServlet的bean如Controller，ViewResolver,HandlerMapping等，均在getServletConfigClasses返回的类中配置
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{Config.class};
    }

    // 配置DispatcherServlet的mappingurl
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    // 配置过滤器，但是尚不知晓如何指定url
    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("UTF-8");
        characterEncodingFilter.setForceEncoding(true);
        return new Filter[]{characterEncodingFilter};
    }

}
```
### 8.2配置SpringConfig
通过实现WebMvcConfigurer接口，对应实现mvc标签的配置，重写的方法均为mvc配置
```java
@Configuration
@EnableWebMvc
@ComponentScan("mapper")
@ComponentScan("service")
@ComponentScan("controller")
public class Config implements WebMvcConfigurer {

    // 配置c3p0数据源
    @Bean
    public ComboPooledDataSource getComboPooledDataSource() throws PropertyVetoException {
        ComboPooledDataSource comboPooledDataSource = new ComboPooledDataSource();
        comboPooledDataSource.setJdbcUrl("jdbc:mysql://localhost:3306/?serverTimezone=UTC");
        comboPooledDataSource.setDriverClass("com.mysql.cj.jdbc.Driver");
        comboPooledDataSource.setUser("root");
        comboPooledDataSource.setPassword("123456");
        return comboPooledDataSource;
    }

    // 配置SqlSessionFactory
    @Bean("sqlSessionFactory")
    public SqlSessionFactoryBean getSqlSessionFactoryBean() throws PropertyVetoException {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        // 设置数据源
        sqlSessionFactoryBean.setDataSource(getComboPooledDataSource());
        // 设置mybatis选项，在xml配置中，可以用configuration location指定mybatis-config.xml，或在Configuration中注入bean
        sqlSessionFactoryBean.setConfiguration(configuration());
        return sqlSessionFactoryBean;
    }

    // 配置Mybatis-config中的setting属性
    @Bean
    public org.apache.ibatis.session.Configuration configuration(){
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        // 设置标准日志输出
        configuration.setLogImpl(StdOutImpl.class);
        return configuration;
    }

    // 开启mapper层扫描，使用mapperScannerConfigurer后，不需要在mapper接口上添加@Repository注解，但是由于不是xml配置，不是实时的，所以IDEA在自动装配时会警告，忽略即可
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer(){
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        mapperScannerConfigurer.setBasePackage("mapper");
        mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
        return mapperScannerConfigurer;
    }

    // 配置事务管理器
    @Bean
    public DataSourceTransactionManager dataSourceTransactionManager() throws PropertyVetoException {
        DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager();
        dataSourceTransactionManager.setDataSource(getComboPooledDataSource());
        return  dataSourceTransactionManager;
    }

    // 配置视图解析器
    @Bean
    public InternalResourceViewResolver internalResourceViewResolver(){
        InternalResourceViewResolver internalResourceViewResolver = new InternalResourceViewResolver();
        internalResourceViewResolver.setPrefix("/WEB-INF/jsp/");
        internalResourceViewResolver.setSuffix(".jsp");
        return internalResourceViewResolver;
    }

    // 配置mvc默认servlet，防止静态资源404
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    // 配置消息转换器
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(stringHttpMessageConverter());
    }

    // 配置编码
    @Bean
    public StringHttpMessageConverter stringHttpMessageConverter(){

        return new StringHttpMessageConverter(UTF_8);
    }

    // 配置jackson消息转换器，虽然不配置仅靠stringHttpMessageConverter也没有乱码，但还是配置一下
    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter(){
        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
        Jackson2ObjectMapperFactoryBean jackson2ObjectMapperFactoryBean = jackson2ObjectMapperFactoryBean();

        mappingJackson2HttpMessageConverter.setObjectMapper(jackson2ObjectMapperFactoryBean.getObject());
        return  mappingJackson2HttpMessageConverter;
    }

    // 配置jackson的ObjectMapperFactory，其中**setFeaturesToEnable**方法不可省略，否则在MappingJackson2HttpMessageConverter的setObjectMapper方法中会出现空引用
    @Bean
    public Jackson2ObjectMapperFactoryBean jackson2ObjectMapperFactoryBean(){
        Jackson2ObjectMapperFactoryBean jackson2ObjectMapperFactoryBean = new Jackson2ObjectMapperFactoryBean();
        jackson2ObjectMapperFactoryBean.setFailOnEmptyBeans(false);
//        jackson2ObjectMapperFactoryBean.setIndentOutput(true);
//        jackson2ObjectMapperFactoryBean.setDateFormat(new SimpleDateFormat("MM/dd/yyyy"));
//        jackson2ObjectMapperFactoryBean.setFeaturesToDisable(
//                com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        jackson2ObjectMapperFactoryBean.setFeaturesToEnable(
                com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_COMMENTS,
                com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_SINGLE_QUOTES,
                com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        jackson2ObjectMapperFactoryBean.afterPropertiesSet();
        return jackson2ObjectMapperFactoryBean;
    }

    // 配置文件上传下载，id依然必须为multipartResolver
    @Bean("multipartResolver")
    public CommonsMultipartResolver multipartResolver(){
        CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
        commonsMultipartResolver.setDefaultEncoding("UTF-8");
        commonsMultipartResolver.setMaxUploadSize(10485760);

        return commonsMultipartResolver;
    }

    // 在Spring中注册拦截器
    @Bean
    public Interceptor interceptor(){
        return new Interceptor();
    }

    // 添加拦截器到SpringMVC中
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // addPathPatterns添加要拦截的请求，excludePathPatterns添加放行的请求，参数都是String数组
        registry.addInterceptor(interceptor()).addPathPatterns("/**").excludePathPatterns("/css/**");
    }

}
```
### 8.3 自定义拦截器
简单的登录验证拦截器
```java
public class Interceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (request.getSession().getAttribute("username")!=null||request.getRequestURI().contains("login")){
            return true;
        }
        request.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(request,response);
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
```
### 8.4 SSM配置总结
- 步骤
1. 配置DispatcherServlet和filter
2. 配置数据源、SqlSessionFactory、Mapper层自动扫描及Mybatis的属性
3. 配置事务管理器
4. 配置视图解析器
5. 配置默认servlet过滤静态资源
6. 配置文件上传和下载
7. 配置消息转换器，防止JSON乱码
8. 配置拦截器
- 注意事项
1. 要实现SpringMVC，必须在SpringConfig类前添加@EnableWebMvc注解
2. 要使用AOP需要在SpringConfig类前添加@EnableAspectJAutoProxy注解
3. 注意数据源的各项参数名
4. 在使用AOP时，可能出现直接在@Before中指定切点有效，而使用@PointCut指定切点并在@Before中引用无效、找不到切点问题，此时需要更换更高版本的AOP织入包
- 关于@Repository和@Mapper注解
这两种注解的区别在于：
1. 使用@mapper后，不需要在spring配置中设置扫描地址，通过mapper.xml里面的namespace属性对应相关的mapper类，spring将动态的生成Bean后注入到ServiceImpl中。
2. @repository则需要在Spring中配置扫描包地址，然后生成dao层的bean，之后被注入到ServiceImpl中。

# 9. 各项依赖说明及IDEA开发注意事项
### 9.1 全部依赖
```xml
<dependencies>
    <!-- junit单元测试依赖 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>

    <!-- lombok懒人依赖 -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.16.18</version>
    </dependency>

    <!-- servlet依赖，servlet-api已迁移到javax.servlet-api -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
    </dependency>

    <!-- jsp相关依赖，目前已迁移到javax.servlet.jsp-api -->
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>jsp-api</artifactId>
        <version>2.1</version>
    </dependency>
    <!-- 支持c标签等的依赖 -->
    <!-- 目前已发生迁移，groupId为javax.servlet.jsp.jstl，artifactId为jstl -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet.jsp.jstl</groupId>
        <artifactId>jstl-api</artifactId>
        <version>1.2</version>
    </dependency>

    <!-- spring依赖 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.9.RELEASE</version>
    </dependency>

    <!-- aop依赖 -->
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.9.6</version>
    </dependency>

    <!-- jackson依赖 -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.11.2</version>
    </dependency>

    <!-- fastjson依赖 -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.47</version>
    </dependency>

    <!-- mysql连接驱动依赖 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.21</version>
    </dependency>

    <!-- c3p0数据源依赖 -->
    <dependency>
        <groupId>com.mchange</groupId>
        <artifactId>c3p0</artifactId>
        <version>0.9.5.5</version>
    </dependency>

    <!-- mybatis相关依赖 -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.6</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.0.6</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.3.3</version>
    </dependency>

    <!-- 文件上传、下载依赖 -->
    <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.4</version>
    </dependency>
</dependencies>
```
### 9.2 IDEA注意事项
1. 关于语言版本不停回溯到默认值问题：
需要在pom.xml中指定：
```xml
<properties>
    <java.version>1.8</java.version>
</properties>
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```
2. 代码没有问题但是运行404、ClassNotFound或者其他问题：
    在Project Structure的Artifacts中，在WEB-INF文件夹中创建lib文件夹并添加全部依赖
3. 配置了default handler后静态资源依然404，检查out文件夹
