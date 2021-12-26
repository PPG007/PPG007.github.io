# 文件上传和下载

## 上传

### 前端代码

设置 form 表单的 enctype 属性为 `multipart/form-data` 用以接收字节数据：

```html
<form action="${pageContext.request.contextPath}/upload/doUpload2" enctype="multipart/form-data" method="post">
    <input type="file" name="file">
    <input type="submit" value="上传">
</form>
```

### Spring 配置

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

::: tip id 必须是 `multipartResolver` 的原因

`DispatcherServlet` 中部分 beanName是确定无法改变的：

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

:::

### 后台代码

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

方法二，调用 `CommonsMultipartFile` 的 `transferTo` 方法：

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

## 下载

### 前端代码

```html
<a href="${pageContext.request.contextPath}/download/doDownload">download</a>
```

### 后台代码

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

## 注意事项

- 使用 transferTo 方法前要先判断是否上传了文件，防止为空。
- Controller 中 `@RequestMapping` 的 url 最好要与表单中的 name 属性区别开。
