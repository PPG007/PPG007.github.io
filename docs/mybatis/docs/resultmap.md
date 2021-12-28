# ResultMap 结果集映射

当实体类中只有基本类型时：

```xml
<resultMap id="userMapper" type="pojo.User">
    <id column="id" property="id" javaType="java.lang.Integer"/>
    <result column="username" property="username" javaType="java.lang.String"/>
    <result column="password" property="password" javaType="java.lang.String"/>
</resultMap>
```
