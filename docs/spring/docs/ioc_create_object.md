# IOC 创建对象的方式

- 默认使用无参构造。
- 配置文件加载时，bean 已被实例化。
- 若使用有参创建：
    - 使用下标赋值：

        ```xml
        <bean class="service.UserServiceImpl" id="userService">
                <constructor-arg index="0" ref="userDao"/>
        </bean>
        ```

    - 通过类型赋值（不建议使用，若有多个参数，无法使用）：

        ```xml
        <bean class="service.UserServiceImpl" id="userService">
                <constructor-arg type="dao.UserDao" ref="userDao"/>
        </bean>
        ```

    - 直接通过参数名设置：

        ```xml
        <bean class="service.UserServiceImpl" id="userService">
                <constructor-arg ref="userDaoOracle" name="userDao"/>
        </bean>
        ```

- 若参数是基本类型则使用value、name属性指定值即可。
