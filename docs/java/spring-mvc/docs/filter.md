# 拦截器

拦截器是 AOP 思想的一种实践，是 SpringMVC 框架提供的，只会过滤 controller 请求。

## 创建拦截器

要创建自定义拦截器，就要实现 `HandlerInterceptor` 接口并至少重写 `preHandle` 方法：

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

## Spring 配置

```xml
<mvc:interceptors>
    <mvc:interceptor>
    <!-- /**表示拦截一个请求及其后面的所有url，例如/admin/**拦截admin后的所有请求 -->
        <mvc:mapping path="/**"/>
        <bean class="Interceptor.Interceptor"/>
    </mvc:interceptor>
</mvc:interceptors>
```
