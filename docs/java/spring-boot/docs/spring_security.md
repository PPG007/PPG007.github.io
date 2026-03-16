# SpringSecurity

## 相关依赖

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

## 简单使用

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

## thymeleaf 整合 SpringSecurity

常用标签：

```html
<!-- 命名空间 -->
<html
  lang="en"
  xmlns:th="http://www.thymeleaf.org"
  xmlns:sec="http://www.thymeleaf.org/extras/spring-security"
>
  判断用户是否已经登陆认证，引号内的参数必须是 isAuthenticated()。 sec:authorize="isAuthenticated()"
  获得当前用户的用户名，引号内的参数必须是 name。 sec:authentication="name"
  判断当前用户是否拥有指定的权限。引号内的参数为权限的名称。 sec:authorize=“hasRole(‘role’)”
  获得当前用户的全部角色，引号内的参数必须是 principal.authorities。
  sec:authentication="principal.authorities"
</html>
```

## SpringSecurity详解

### SpringSecurity 配置文件详解

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

### 登录认证实现类详解

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

### 方法注解详解

要使用共计四种(这里只介绍三种)方法注解，需要在主启动类上添加：

```java
@EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true)
```

- `@Secured`：

::: tip
该注解对用户角色进行判断，只有拥有正确角色的用户可以正常访问。
:::

```java
@RequestMapping("/test")
@ResponseBody
@Secured({"ROLE_test"})
public String test(){
    return "test";
}
```

- `@PreAuthorize`：

::: tip
该注解对用户的权限和角色进行判断，可以使用 hasAuthority、hasRole 等方法进行约束。
:::

```java
@RequestMapping("/authTest")
@ResponseBody
@PreAuthorize("hasAuthority('vipp')")
public String authTest(){
    return "authTest";
}
```

- `@PostAuthorize`：

::: tip
该注解先执行方法，再判断用户权限和角色。
:::

```java
@RequestMapping("/postTest")
@ResponseBody
@PostAuthorize("hasAuthority('vipp')")
public String postTest(){
    System.out.println("test");
    return "test";
}
```
