# 浏览器本地存储

本地存储分为 `localStorage` 和 `sessionStorage`,前者持久保存(清除浏览器缓存可能导致失效)，后者关闭浏览器即清空，都是 `window` 的对象，二者 API 名字完全一致。

## localStorage

```js
function saveData() {
  let person = { name: 'PPG', age: 21 };
  window.localStorage.setItem('msg', JSON.stringify(person));
}
function readData() {
  alert(localStorage.getItem('msg'));
  console.log(JSON.parse(localStorage.getItem('msg')));
}
function deleteData() {
  console.log(localStorage.removeItem('msg'));
}
function deleteAll() {
  localStorage.clear();
}
```

## sessionStorage

```js
function saveData() {
  let person = { name: 'PPG', age: 21 };
  sessionStorage.setItem('msg', JSON.stringify(person));
}
function readData() {
  alert(sessionStorage.getItem('msg'));
  console.log(JSON.parse(sessionStorage.getItem('msg')));
}
function deleteData() {
  console.log(sessionStorage.removeItem('msg'));
}
function deleteAll() {
  sessionStorage.clear();
}
```

::: tip 浏览器本地存储：

- 存储内容大小一般为 5MB。
- 浏览器端通过 `sessionStorage` 或 `localStorage` 实现本地存储。
- 获取不存在的 key 得到的 value 为**null**。

:::
