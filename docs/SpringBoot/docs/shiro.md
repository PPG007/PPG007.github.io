# Shiro

## 相关依赖

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

## 简单配置

Shiro三大模块：

- **Subject**：主体，一般指用户。
- **SecurityManager**：安全管理器，管理所有 Subject，可以配合内部安全组件。(类似于 SpringMVC 中的 DispatcherServlet)。
- **Realms**：用于进行权限信息的验证，一般需要自己实现。

配置步骤：

- ShiroFilterFactoryBean。
- DefaultWebSecurityManager。
- 创建 realm 对象-自定义。

配置 Realm：

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

配置 ShiroConfig：

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

## 简单使用 Shiro

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

## thymeleaf 整合 Shiro

命名空间：

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
```

常见标签：

- guest 标签：用户没有身份验证时显示相应信息，即游客访问信息。

    ```html
    <shiro:guest>
    </shiro:guest>
    ```

- user 标签：用户已经身份验证/记住我登录后显示相应的信息。

    ```html
    <shiro:user>
    </shiro:user>
    ```

- authenticated 标签：用户已经身份验证通过，即 `Subject.login` 登录成功，不是记住我登录的。

    ```html
    <shiro:authenticated>
    </shiro:authenticated>
    ```

- notAuthenticated 标签：用户已经身份验证通过，即没有调用 `Subject.login` 进行登录，包括记住我自动登录的也属于未进行身份验证。

    ```html
    <shiro:notAuthenticated>
    </shiro:notAuthenticated>
    ```

- principal 标签：相当于 `((User)Subject.getPrincipals()).getUsername()`。

    ```html
    <shiro: principal/>
    <shiro:principal property="username"/>
    ```

- lacksPermission 标签：如果当前 Subject 没有权限将显示 body 体内容。

    ```html
    <shiro:lacksPermission name="org:create">
    </shiro:lacksPermission>
    ```

- hasRole 标签：如果当前 Subject 有角色将显示 body 体内容。

    ```html
    <shiro:hasRole name="admin">
    </shiro:hasRole>
    ```

- hasAnyRoles 标签：如果当前 Subject 有任意一个角色（或的关系）将显示 body 体内容。

    ```html
    <shiro:hasAnyRoles name="admin,user">
    </shiro:hasAnyRoles>
    ```

- lacksRole 标签：如果当前 Subject 没有角色将显示 body 体内容。

    ```html
    <shiro:lacksRole name="abc">
    </shiro:lacksRole>
    ```

- hasPermission 标签：如果当前 Subject 有权限将显示 body 体内容。

    ```html
    <shiro:hasPermission name="user:create">
    </shiro:hasPermission>
    ```
