# IOC 理论

## IOC 基本原理与思想

```java
public class UserServiceImpl implements UserService {

    private UserDao userDao;
    //使用set实现了动态注入
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public void getUser() {
        userDao.getUser();
    }
}
```

- 若不使用 set 方法，程序主动创建对象，控制权在程序员手中。
- 使用后，程序不再具有主动性，转而被动接收对象，通过 set 实现了控制反转。

使用 set 方法的用户代码如下:

```java
public static void main(String[] args) {
        UserService userService=new UserServiceImpl();

        ((UserServiceImpl)userService).setUserDao(new UserDaoMysqlImpl());

        userService.getUser();
    }
```

若不使用 set 方法，则需要在 `UserServiceImpl` 中不停修改代码：

```java
//每个Dao层实现都要赋值
private UserDao userDao=new UserDaoMysqlImpl();

    public void getUser() {
        userDao.getUser();
    }
```

## IOC 本质

::: tip
控制反转 IOC 是一种设计思想，DI（依赖注入）是实现 IOC 的一种方法
:::

控制反转：对象的创建转移给第三方，获得依赖对象的方式反转了。
Spring 容器在初始化时先读取配置文件，根据配置文件或元数据创建与组织对象存入容器中，程序使用时再从 IOC 容器中取出需要的对象。
