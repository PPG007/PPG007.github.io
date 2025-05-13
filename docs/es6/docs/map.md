# Map

Map 可以设置任意类型的键，而不只是字符串。任何具有 Iterator 接口且每个成员都是一个双元素的数组的数据结构都可以当做 Map 构造函数的参数。

```javascript
map.set(['a'], 555);
console.log(map.get(['a'])); // undefined
```

如果键是对象类型，那么值相同的对象可能会被看作不同的键，因为它们在内存中的地址不一样。所有的 NaN 都是一个键。

## 与其他数据结构的互相转换

- Map 转数组：扩展运算符。
- 数组转 Map：将数组传入 Map 构造函数。
- Map 转为对象：如果所有的键都是字符串就可以无损的转换。
- 对象转为 Map：将对象传入 `Object.entries()` 方法并将返回值传入 Map 构造函数。
- Map 转 JSON：如果 Map 的键名都是字符串可以先转为对象再转为 JSON；如果键中存在非字符串可以选择转为数组 JSON。

  ```javascript
  const map = new Map();
  map.set('name', 'ppg');
  map.set(['a', 'b'], 555);
  map.set(message, true);
  console.log(JSON.stringify([...map])); // [["name","ppg"],[["a","b"],555],[{"body":{"user":{"firstName":"zhuang"}}},true]]
  ```

- JSON 转 Map：JSON 转对象然后再转为 Map。
