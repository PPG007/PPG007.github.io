---
prev:
  text: 首页
  link: /SpringMVC
---

# Servlet

## 实现 Servlet 的方法

- class implements Servlet：

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

- extends GenericServlet：

  ```java
  public class Servlet2 extends GenericServlet {

      @Override
      public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {

      }
  }
  ```

- extends HttpServlet：

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
