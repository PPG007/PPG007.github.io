# 常用类

## String

在 Java 中，比较两个字符串时，应该使用 `equals()` 方法而不是 `==` 运算符。`==` 运算符比较的是两个对象的引用是否相同，而 `equals()` 方法比较的是两个字符串的内容是否相同。例如：

```java
String str1 = new String("Hello");
String str2 = new String("Hello");
System.out.println(str1 == str2); // 输出 false，因为 str1 和 str2 是不同的对象
System.out.println(str1.equals(str2)); // 输出 true，因为 str1 和 str2 的内容相同
```

如果要忽略大小写比较，可以使用 `equalsIgnoreCase()` 方法。

String 类还提供了若干常用方法，例如 `contains` 方法用于检查字符串是否包含指定的子字符串，`startsWith` 和 `endsWith` 方法用于检查字符串是否以指定的前缀或后缀开头或结尾，`indexOf` 方法用于查找子字符串在字符串中的位置，`substring` 方法用于提取字符串的一部分，`toUpperCase` 和 `toLowerCase` 方法用于转换字符串的大小写等。这些方法可以帮助我们更方便地操作和处理字符串数据。

### 空白

String 类提供了 `isEmpty()` 方法用于检查字符串是否为空（长度为 0），以及 `isBlank()` 方法用于检查字符串是否为空白（长度为 0 或只包含空白字符）。

另外使用 `trim()` 方法可以去除字符串两端的空白字符，`strip()` 方法也可以去除字符串两端的空白字符，但它还支持 Unicode 空白字符。`stripLeading()` 方法用于去除字符串开头的空白字符，`stripTrailing()` 方法用于去除字符串结尾的空白字符。这些方法可以帮助我们更方便地处理字符串中的空白问题。

### 分割与拼接

String 类提供了 `split()` 方法用于将字符串分割成一个字符串数组，`join()` 方法用于将多个字符串拼接成一个字符串，`concat()` 方法用于连接两个字符串。这些方法可以帮助我们更方便地处理字符串的分割和拼接操作。

### 格式化字符串

String 类提供了 `format()` 方法用于格式化字符串，可以使用占位符来指定要插入的值的类型和位置。例如：

```java
String name = "Alice";
int age = 30;
String formattedString = String.format("My name is %s and I am %d years old.", name, age);
System.out.println(formattedString); // 输出 "My name is Alice and I am 30 years old."
```

具体支持的占位符可以参考：[JDK文档](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html#syntax)

### 类型转换

要把任意基本类型或引用类型转为字符串，可以使用 `String.valueOf()` 方法。例如：

```java
int number = 42;
String str = String.valueOf(number); // str 的值为 "42"
```

## StringBuilder

Java 中允许使用 `+` 运算符来连接字符串，但这种方式在需要频繁修改字符串的场景下效率较低，因为每次连接都会创建一个新的字符串对象。为了提高性能，Java 提供了 `StringBuilder` 类，它是一个可变的字符序列，可以在原有的基础上修改字符串内容，而不需要创建新的对象。例如：

```java
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World!"); // 在原有的基础上添加字符串
String result = sb.toString(); // 将 StringBuilder 转换为 String
System.out.println(result); // 输出 "Hello World!"
```

## StringJoiner

由于使用分隔符拼接字符串的需求很常见，Java 8 引入了 `StringJoiner` 类来简化这种操作。`StringJoiner` 允许我们指定一个分隔符，并且可以选择性地添加前缀和后缀。例如：

```java
StringJoiner sj = new StringJoiner(", ", "[", "]");
sj.add("Alice");
sj.add("Bob");
sj.add("Charlie");
String result = sj.toString(); // result 的值为 "[Alice, Bob, Charlie]"
System.out.println(result); // 输出 "[Alice, Bob, Charlie]"
```

## 包装类型

前面我们已经知道，基础类型都有对应的包装类型，例如 `int` 对应 `Integer`，`double` 对应 `Double`，等等。

Java 中，基础类型和包装类型直接可以自动转换，例如将一个 `int` 赋值给一个 `Integer` 变量时，Java 会自动将 `int` 转换为 `Integer` 对象，这个过程称为自动装箱（autoboxing）。同样地，将一个 `Integer` 赋值给一个 `int` 变量时，Java 会自动将 `Integer` 对象转换为 `int` 基础类型，这个过程称为自动拆箱（unboxing）装箱和拆箱都是编译期进行的。例如：

```java
Integer num1 = 42; // 自动装箱，将 int 转换为 Integer
int num2 = num1; // 自动拆箱，将 Integer 转换为 int
```

装箱和拆箱会影响代码执行效率，因为编译后的 class 代码是严格区分基本类型和引用类型的，并且，自动拆箱可能会报 NullPointerException 异常，例如：

```java
Integer num1 = null;
int num2 = num1; // 这里会抛出 NullPointerException，因为 num1 是 null，无法拆箱为 int
```

所有的包装类都是不变类，也就是说它们的值一旦创建就不能改变。如果需要修改包装类的值，必须创建一个新的对象。例如：

```java
Integer num1 = 42;
num1 = num1 + 1; // 这里实际上是创建了一个新的 Integer 对象，原来的 num1 仍然是 42，而新的 num1 是 43
```

同时，如果使用了包装类，要判断是否相等，需要使用 `equals()` 方法而不是 `==` 运算符，因为 `==` 比较的是对象的引用，而 `equals()` 比较的是对象的值。

对于 Integer 来说，Java 会缓存 -128 到 127 之间的 Integer 对象，因此在这个范围内的 Integer 对象是共享的，使用 `==` 运算符比较时会返回 true，而在这个范围之外的 Integer 对象则不会被缓存，使用 `==` 运算符比较时会返回 false。例如：

```java
Integer num1 = 100;
Integer num2 = 100;
System.out.println(num1 == num2); // 输出 true，因为 100 在 -128 到 127 之间，num1 和 num2 引用的是同一个 Integer 对象
Integer num3 = 200;
Integer num4 = 200;
System.out.println(num3 == num4); // 输出 false，因为 200 不在 -128 到 127 之间，num3 和 num4 引用的是不同的 Integer 对象
```

## BigInteger

Java 中，`BigInteger` 类用于表示任意精度的整数，可以处理非常大的整数值，超出 `long` 类型的范围。`BigInteger` 提供了丰富的方法来进行数学运算，例如加法、减法、乘法、除法、取模等。例如：

```java
BigInteger bigInt1 = new BigInteger("12345678901234567890");
BigInteger bigInt2 = new BigInteger("98765432109876543210");
BigInteger sum = bigInt1.add(bigInt2); // 加法
BigInteger difference = bigInt1.subtract(bigInt2); // 减法
BigInteger product = bigInt1.multiply(bigInt2); // 乘法
BigInteger quotient = bigInt1.divide(bigInt2); // 除法
System.out.println("Sum: " + sum); // 输出 "Sum: 111111111111111111100"
System.out.println("Difference: " + difference); // 输出 "Difference: -86419753208641975320"
System.out.println("Product: " + product); // 输出 "Product: 1219326311370217952237463801111263526900"
System.out.println("Quotient: " + quotient); // 输出 "Quotient: 0"
```

此外还可以通过 `xxxValue()` 方法将 `BigInteger` 转换为其他数值类型，例如 `intValue()`、`longValue()`、`doubleValue()` 等，但需要注意，如果 `BigInteger` 的值超出目标类型的范围，可能会导致数据丢失或溢出。

## BigDecimal

BigDecimal 表示任意大小且精度完全准确的浮点数。

```java
BigDecimal bigDec1 = new BigDecimal("12345.67890");
BigDecimal bigDec2 = new BigDecimal("0.00001");
BigDecimal sum = bigDec1.add(bigDec2); // 加法
BigDecimal difference = bigDec1.subtract(bigDec2); // 减法
BigDecimal product = bigDec1.multiply(bigDec2); // 乘法
BigDecimal quotient = bigDec1.divide(bigDec2, 5, RoundingMode.HALF_UP); // 除法，指定小数位数和舍入模式
System.out.println("Sum: " + sum); // 输出 "Sum: 12345.67891"
System.out.println("Difference: " + difference); // 输出 "Difference: 12345.67889"
System.out.println("Product: " + product); // 输出 "Product: 0.123456789"
System.out.println("Quotient: " + quotient); // 输出 "Quotient: 1234567890.00000"
```

通过 `scale()` 方法可以获取 `BigDecimal` 的小数位数，通过 `precision()` 方法可以获取 `BigDecimal` 的有效数字位数。

如果 `scale()` 方法返回负数，例如 -2，那么表示这个数是一个整数，并且这个整数的末尾有两个零。

进行加减乘运算时，精度不会丢失，但是在进行除法运算时，由于可能存在无法除尽的情况，就必须指定精度以及如何截断，否则会报错：

```java
BigDecimal a = new BigDecimal("1");
BigDecimal b = new BigDecimal("3");
BigDecimal result = a.divide(b); // 这里会抛出 ArithmeticException，因为1 除以 3 是一个无限循环小数，无法除尽
```

在比较两个 BigDecimal 变量时，应该使用 `compareTo()` 方法而不是 `equals()` 方法，因为 `equals()` 方法不仅比较数值是否相等，还比较小数位数是否相等，而 `compareTo()` 方法只比较数值是否相等。例如：

```java
BigDecimal bd1 = new BigDecimal("1.0");
BigDecimal bd2 = new BigDecimal("1.00");
System.out.println(bd1.equals(bd2)); // 输出 false，因为 bd1 和 bd2 的小数位数不同
System.out.println(bd1.compareTo(bd2)); // 输出 0，因为 bd1 和 bd2 的数值相等
```

## 其他工具类

### Math

求绝对值：

```java
int absValue = Math.abs(-5); // absValue 的值为 5
```

求最大最小：

```java
int maxValue = Math.max(10, 20); // maxValue 的值为 20
int minValue = Math.min(10, 20); // minValue 的值为 10
```

计算幂：

```java
double power = Math.pow(2, 3); // power 的值为 8.0
```

开方运算：

```java
double sqrtValue = Math.sqrt(16); // sqrtValue 的值为 4.0
```

计算 e 的幂：

```java
double expValue = Math.exp(1); // expValue 的值为 2.718281828459045
```

计算以 e 为底的对数：

```java
double logValue = Math.log(Math.E); // logValue 的值为 1.0
```

计算以 10 为底的对数：

```java
double log10Value = Math.log10(100); // log10Value 的值为 2.0
```

一些数学常量：

```java
double pi = Math.PI; // pi 的值为 3.141592653589793
double e = Math.E; // e 的值为 2.718281828459045
```

生成随机数：

```java
double randomValue = Math.random(); // randomValue 的值在 0.0（包含）和 1.0（不包含）之间
```

### HexFormat

将 `byte[]` 转换为十六进制字符串：

```java
byte[] bytes = {0x01, 0x02, 0x03};
String hexString = HexFormat.of().formatHex(bytes); // hexString 的值为 "010203"
```

将十六进制字符串转换为 `byte[]`：

```java
String hexString = "010203";
byte[] bytes = HexFormat.of().parseHex(hexString); // bytes 的值为 {0x01, 0x02, 0x03}
```

如果要定制转换格式，使用定制的 HexFormat 实例：

```java
HexFormat hexFormat = HexFormat.ofDelimiter(":").withUpperCase();
byte[] bytes = {0x01, 0x02, 0x03};
String hexString = hexFormat.formatHex(bytes); // hexString 的值为 "01:02:03"
byte[] parsedBytes = hexFormat.parseHex(hexString); // parsedBytes 的值为 {0x01, 0x02, 0x03}
```

### Random

Random 用于生成伪随机数，所谓伪随机数是指只要给定相同的种子，产生的随机数序列是完全一样的。例如：

```java
Random random1 = new Random(12345); // 使用种子 12345 创建 Random 实例
Random random2 = new Random(12345); // 使用相同的种子创建另一个 Random 实例
System.out.println(random1.nextInt()); // 输出随机数，例如 -1188957731
System.out.println(random2.nextInt()); // 输出相同的随机数，例如 -1188957731
```

### SecureRandom

实际上的真随机数只能通过物理过程产生，例如通过测量放射性衰变、热噪声等自然现象来生成随机数。`SecureRandom` 类使用了更复杂的算法和更高质量的随机源来生成随机数，因此它比 `Random` 更适合用于安全相关的应用，例如密码学、密钥生成等。

```java
SecureRandom secureRandom = new SecureRandom();
byte[] randomBytes = new byte[16]; // 创建一个 16 字节的数组
secureRandom.nextBytes(randomBytes); // 填充数组 with 随机字节
String hexString = HexFormat.of().formatHex(randomBytes); // 将随机字节转换为十六进制字符串
System.out.println(hexString); // 输出随机十六进制字符串，例如 "9f86d081884c7d659a2feaa0c55aeed"
```

SecureRandom 无法指定种子，它使用 RNG（随机数生成器）来生成随机数，RNG 会从操作系统的随机源中获取随机数据，例如在 Unix/Linux 系统中，RNG 可能会从 `/dev/urandom` 或 `/dev/random` 中获取随机数据，在 Windows 系统中，RNG 可能会使用 CryptGenRandom 函数来获取随机数据。由于 RNG 从操作系统的随机源中获取随机数据，因此它可以提供更高质量的随机数，适合用于安全相关的应用。
