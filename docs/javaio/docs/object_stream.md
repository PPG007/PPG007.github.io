# 对象流

`ObjectOutputStream` 和 `ObjectInputStream`。

不能序列化 `static` 和 `transient` 修饰的变量，且序列化、反序列化的类必须实现序列化接口。

```java
Person person = new Person();
person.setName("PPG");
person.setAge(21);
person.setSex("male");
ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(PATH_PREFIX + "person"));
objectOutputStream.writeObject(person);
objectOutputStream.flush();
objectOutputStream.close();
ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(PATH_PREFIX + "person"));
Person readObject = (Person) objectInputStream.readObject();
System.out.println(readObject);
objectOutputStream.flush();
objectOutputStream.close();
```

Person 类：

```java
public class Person implements Serializable {
	//表明类的不同版本间的兼容性，不指定就是Java运行时环境自动生成，若类实例变量做出了修改，这个值可能会变，建议显式指定。
    public static final long serialVersionUID = 41241252L;

    private String name;
    private String sex;
    private Integer age;

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                ", age=" + age +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Person person = (Person) o;

        if (!name.equals(person.name)) return false;
        if (!sex.equals(person.sex)) return false;
        return age.equals(person.age);
    }

    @Override
    public int hashCode() {
        int result = name.hashCode();
        result = 31 * result + sex.hashCode();
        result = 31 * result + age.hashCode();
        return result;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Person() {
    }
}
```

进行反序列化时，jvm 将传进字节流的序列化 ID 与本地实体类的序列化 ID 比较如果相同则可以进行反序列化，否则异常。
