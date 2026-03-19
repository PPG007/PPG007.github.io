# 三目运算符

## 三目运算符返回值类型规则

- 若两个操作数不可转换，则不做转换，返回值为 Object 类型。
- 若两个操作数是明确类型的表达式（比如变量），则按照正常的二进制数字来转换，int 类型转换为 long 类型，long 类型转换为 float 类型等。
- 若两个操作数中有一个是数字 S,另外一个是表达式，且其类型标示为 T，那么，若数字 S 在 T 的范围内，则转换为 T 类型；若 S 超出了 T 类型的范围，则 T 转换为 S 类型。
- 若两个操作数都是直接量数字，则返回值类型为范围较大者。

```java
Object o1 = true? new Integer(1) : new Double(2.0);
```

上面的语句符合第四条，返回 double 类型。

```java
byte b = 1;
char c = 1;
short s = 1;
int i = 1;

// 三目，一边为byte另一边为char，结果为int
// 其它情况结果为两边中范围大的。适用包装类型
i = true ? b : c; // int
b = true ? b : b; // byte
s = true ? b : s; // short

// 表达式，两边为byte,short,char，结果为int型
// 其它情况结果为两边中范围大的。适用包装类型
i = b + c; // int
i = b + b; // int
i = b + s; // int

// 当 a 为基本数据类型时，a += b，相当于 a = (a) (a + b)
// 当 a 为包装类型时， a += b 就是 a = a + b
b += s; // 没问题
c += i; // 没问题

// 常量任君搞，long以上不能越
b = (char) 1 + (short) 1 + (int) 1; // 没问题
// i = (long) 1 // 错误
```
