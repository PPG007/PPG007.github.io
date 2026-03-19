# 使用纯 JavaConfig 配置 SSM

## 配置 DispatcherServlet 及 Filter

通过继承 `AbstractAnnotationConfigDispatcherServletInitializer` 类并重写其中方法对应实现 web.xml 的功能：

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

## 配置SpringConfig

通过实现 `WebMvcConfigurer` 接口，对应实现 mvc 标签的配置，重写的方法均为 mvc 配置：

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

## 自定义拦截器

简单的登录验证拦截器：

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

## SSM 配置总结

步骤：

- 配置 DispatcherServlet 和 filter。
- 配置数据源、SqlSessionFactory、Mapper 层自动扫描及 Mybatis 的属性。
- 配置事务管理器。
- 配置视图解析器。
- 配置默认 servlet 过滤静态资源。
- 配置文件上传和下载。
- 配置消息转换器，防止 JSON 乱码。
- 配置拦截器。

::: warning 注意事项

- 要实现 SpringMVC，必须在 SpringConfig 类前添加 `@EnableWebMvc` 注解。
- 要使用 AOP 需要在 SpringConfig 类前添加 `@EnableAspectJAutoProxy` 注解。
- 注意数据源的各项参数名。
- 在使用 AOP 时，可能出现直接在 `@Before` 中指定切点有效，而使用 `@PointCut` 指定切点并在 `@Before` 中引用无效、找不到切点问题，此时需要更换更高版本的 AOP 织入包。

:::

关于 `@Repository` 和 `@Mapper` 注解：

- 使用 `@mapper` 后，不需要在 spring 配置中设置扫描地址，通过 mapper.xml 里面的 namespace 属性对应相关的 mapper 类，spring 将动态的生成 Bean 后注入到 ServiceImpl 中。
- `@repository` 则需要在 Spring 中配置扫描包地址，然后生成 dao 层的 bean，之后被注入到 ServiceImpl 中。
