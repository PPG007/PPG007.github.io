# 运算符的扩展

## 链判断运算符

```javascript
const message = {
  body: {
    user: {
      firstName: 'zhuang',
    },
  },
};
console.log(message?.body?.user?.firstName || 'null');
console.log(message?.body?.user?.lastName || 'null');
```

如果左侧对象为 null 或者 undefined，就不再往下运算而是返回 undefined。

## Null 判断运算符

只有运算符左侧的值为 null 或 undefined 时，才会返回右侧的值。

```javascript
console.log(message?.body?.demo ?? 'no');
```

## 逻辑赋值运算符

- 或赋值运算符：`||=`。
- 与赋值运算符：`&&=`。
- Null 赋值运算符：`??=`。

逻辑赋值运算符先进行逻辑运算，再根据情况进行赋值运算。
