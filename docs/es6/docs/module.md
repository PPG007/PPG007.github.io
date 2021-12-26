# Module 的语法

## export 命令

export 命令的常见写法：

- 逐个导出：

```javascript
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
```

- 合并导出：

```javascript
export { firstName, lastName, year };
```

- 重命名导出：

```javascript
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

- 默认导出：一个模块只能有一个默认导出，在 import 时可以不指定要引入的模块名。

```javascript
export default foo;
```
