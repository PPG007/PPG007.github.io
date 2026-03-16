# 使用 JSON 传递数据

## JavaScript 中的 JSON 方法

```js
// 定义对象
let user = {
  name: 'ppg',
  age: 20,
  sex: 'boy',
};
let json = JSON.stringify(user); //将对象转换为JSON表示
let object = JSON.parse(json); //从JSON解析出Object对象
```

## jackson

### 相关依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.11.2</version>
</dependency>
```

### Spring 配置

在 Spring 中做出如下配置：

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

### 使用 jackson

要是用 jackson，需要首先通过构造函数构造一个 `ObjectMapper` 对象：

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

示例：

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

## fastjson

### 相关依赖

```xml
<dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.47</version>
    </dependency>
```

### Spring 配置

`FastJsonHttpMessageConverter` 写与不写没区别(在基本使用上)，且若仅配置 `FastJsonHttpMessageConverter` 而不配置 `StringHttpMessageConverter`，会导致 `JSON.toJSONString` 方法返回的 JSON 字符串中包含转义反斜杠，需要前端 JavaScript 两次 `JSON.parse()` 才能获取到正常的 JSON 对象。

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

### 使用 fastjson

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

## org.json:json

### 相关依赖

```xml
<dependency>
    <groupId>org.json</groupId>
    <artifactId>json</artifactId>
    <version>20190722</version>
</dependency>
```

### Spring 配置

```xml
<mvc:annotation-driven>
    <mvc:message-converters register-defaults="true">
        <bean class="org.springframework.http.converter.StringHttpMessageConverter">
            <constructor-arg value="UTF-8"/>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
```

### 使用 org.json

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
