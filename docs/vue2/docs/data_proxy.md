# 数据代理

## 数据代理基本原理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../js/vue.js"></script>
  </head>
  <body>
    <script>
      let person = {
        name: 'PPG',
        sex: 'male',
      };
      let number = 21;
      //默认：不可枚举，不可修改，不可删除
      Object.defineProperty(person, 'age', {
        // value:number,
        enumerable: true, //控制属性可枚举
        // writable:true,//控制属性是否能被修改
        configurable: true, //控制属性是否能被删除
        //get、set方法代理了修改、获取属性值，不能和value、writable属性共存
        // 任何获取age属性值的尝试都会走向get方法
        get() {
          return number;
        },
        // 任何修改age属性值的尝试都会走向set
        set(value) {
          // 这里也不要添加this关键字
          number = value;
        },
      });
      console.log(person);
    </script>
  </body>
</html>
```

## 数据代理

::: tip 数据代理
通过一个对象代理对另一个对象中属性的操作(读/写)。
:::

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      let obj = {
        x: 100,
      };
      let obj2 = {
        y: 200,
      };
      //这样，通过obj2就可以获取、修改obj的x属性值了
      Object.defineProperty(obj2, 'x', {
        get() {
          return obj.x;
        },
        set(x) {
          obj.x = x;
        },
      });
    </script>
  </body>
</html>
```

## Vue 中的数据代理

- Vue 中的数据代理：

  通过 Vue 实例代理 data 对象中属性的操作。

- 数据代理的作用：

  更加方便的操作 data 中的数据。

- 基本原理：

  - 通过 `Object.defineProperty()` 把 data 对象中的所有属性添加到 Vue 实例上(其实是先将 Vue 实例的 `_data` 属性赋值成data，`_data` 中也有相应的 getter、setter，只做到这一步(`_data`)只是完成了收集数据(数据劫持)，并没有进行数据代理，将 `_data` 中的内容再代理到实例上，这样在访问 data 中的内容时就可以直接 `Vue实例.属性名`，而不需要 `Vue实例._data.属性名`)。
  - 为每一个添加到 Vue 实例的属性创建 getter、setter。
  - 在 getter、setter 中操作 data 中对应的属性。

- 数据劫持：

  修改对象属性时调用 setter 进行修改并重新渲染模板。

## 实现一个简单的数据双向绑定

首先编写一个简单的 HTML：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test</title>
  </head>
  <body>
    <div id="root">
      <span>姓名：{{ name }}</span>
      <input type="text" v-model="name" />
      <span>更多：{{ more.like }}</span>
      <input type="text" v-model="more.like" />
    </div>
    <script src="./myvue.js"></script>
    <script>
      const vm = new Vue({
        el: '#root',
        data: {
          name: 'ppg007',
          more: {
            like: 'test',
          },
        },
      });
    </script>
  </body>
</html>
```

然后开始编写 myvue.js，首先我们需要一个 Vue 类，并且其构造函数接收一个对象：

```javascript
class Vue {
  constructor(objInstance) {
    this.$data = objInstance.data;
    observer(this.$data);
    compile(objInstance.el, this);
  }
}
```

其中，将接收对象的 data 属性值赋值给 Vue 对象示例的 $data 属性，并且调用 observer 函数对数据进行监听，调用 compile 函数将数据渲染到页面上。

然后编写 observer 函数，这个函数接收一个 data 对象，通过 `Object.keys()` 函数遍历这个对象的所有第一层属性，这个方法无法为上面的 more.like 属性增加 getter setter，因此对于嵌套的对象，需要使用递归调用，递归终止条件为参数已经不是对象。注意 getter 中不能直接返回 dataInstance[key]，因为我们给这个属性添加了 getter，如果在 getter 中直接返回就会再次触发 getter，然后陷入死循环，这里在 `Object.defineProperty` 方法调用前增加一个 temp 中间变量，并且在 setter 中也是修改这个变量。

```javascript
function observer(dataInstance) {
  if (!dataInstance || typeof dataInstance !== 'object') return;
  Object.keys(dataInstance).forEach(key => {
    let temp = dataInstance[key];
    // 对于嵌套的对象，递归监听内部属性
    observer(temp);
    Object.defineProperty(dataInstance, key, {
      get() {
        return temp;
      },
      set(newValue) {
        temp = newValue;
        // 如果这里不调用 observer 函数会导致在将上面 data 中的属性修改为对象时，对象中的属性没有 getter、setter
        observer(newValue);
        // 这里 notifier 是一个全局变量，负责通知所有对应的节点更新视图，在下面会见到
        notifier.notifyAllSubscribers();
      },
    });
  });
}
```

到这里已经实现了通过 getter setter 代理数据，接下来编写 Notifier 和 Subscriber 类，实现修改数据时，对应的视图内容会被修改：

Notifier 类持有一个订阅者数组并在构造函数中初始化这个数组，addSubscribers 方法可以将指定的订阅者添加到数组中，notifyAllSubscribers 方法可以通过调用每个订阅者的 update 方法实现更新页面。

Subscriber 类构造器接收四个参数，vm 就是创建的 Vue 实例，key 就是插值表达式的内容（more.like），callback 是一个函数，将会在 update 方法中调用，notifier 是一个 Notifier 对象实例，通过调用其 addSubscribers 方法添加订阅者。

```javascript
class Notifier {
  constructor() {
    this.subscribers = [];
  }
  addSubscribers(subscriber) {
    this.subscribers.push(subscriber);
  }
  notifyAllSubscribers() {
    this.subscribers.forEach(subscriber => {
      subscriber.update();
    });
  }
}

class Subscriber {
  constructor(vm, key, callback, notifier) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;
    notifier.addSubscribers(this);
  }
  update() {
    // 首先对形如 more.like 这样的属性链通过 . 分割，然后调用数组原型的 reduce 方法，这个方法第一个参数是一个函数，第二个参数
    // 是前面函数中 total 的初始值，然后 reduce 函数会将数组中的每个元素分多次传入 current 变量，然后将每次调用的结果作为下
    // 一次 total 的值，这样就能获取到对象中深层的属性值，这里就获取到了 vm.$data 对象对应属性的最新取值。
    const newValue = this.key.split('.').reduce((total, current) => total[current], this.vm.$data);
    // 然后调用传进来的回调函数更新 DOM 节点
    this.callback(newValue);
  }
}
// 这里就是上面 observer 函数中的全局变量。
const notifier = new Notifier();
```

然后编写页面的解析函数，负责将数据填充到插值表达式中：

```javascript
function compile(element, vm) {
  // 获取需要绑定的 DOM 容器
  vm.$el = document.querySelector(element);
  // 创建一个新的空白的文档片段
  const fragment = document.createDocumentFragment();
  //   下面将指定容器内的所有元素添加到 fragment 中
  let child;
  while ((child = vm.$el.firstChild)) {
    fragment.append(child);
  }
  //   然后调用下面的函数进行编译
  fragmentCompile(fragment, vm);
  //   将渲染后的内容添加到页面上
  vm.$el.appendChild(fragment);
}

function fragmentCompile(node, vm) {
  // 插值表达式的正则表达式
  const pattern = /\{\{\s*(\S+)\s*\}\}/;
  // nodeType 为 3 表示这是一个 text 节点，需要将其中的插值表达式渲染进数据。
  if (node.nodeType === 3) {
    // 使用中间变量存储此节点的内容，因为如果其中包含插值语法表达式的话后面更新时还要使用正则进行匹配，如果没有这个变量，第一次替
    // 换插值语法后，插值语法表达式就不存在了，也就无法使用上面的正则表达式进行匹配了，下面调用 replace 方法也就无效了。
    const sourceNodeValue = node.nodeValue;
    // 使用正则表达式对节点的内容进行匹配，结果是一个数组或者 null，数组的第二个元素是捕获到的插值表达式内容
    const result = pattern.exec(sourceNodeValue);
    if (result) {
      // 同样使用 reduce 方法获取深层属性值
      const array = result[1].split('.');
      const value = array.reduce((total, current) => total[current], vm.$data);
      //   这里是初始化时首先进行一次数据替换。
      node.nodeValue = sourceNodeValue.replace(pattern, value);
      //   创建订阅者，并在 callback 中传入一个更新函数，这里就是一个闭包
      new Subscriber(
        vm,
        result[1],
        newValue => {
          node.nodeValue = sourceNodeValue.replace(pattern, newValue);
        },
        notifier
      );
    }
    // 对于 input 表单：
  } else if (node.nodeType === 1 && node.nodeName === 'INPUT') {
    // 首先获取标签的属性
    const attributes = Array.from(node.attributes);
    // 遍历属性
    attributes.forEach(attribute => {
      // 如果属性名是 v-model 就进行绑定
      if (attribute.nodeName === 'v-model') {
        // 首先将对应的属性值渲染到表单中
        const value = attribute.nodeValue
          .split('.')
          .reduce((total, current) => total[current], vm.$data);
        node.value = value;
        // 然后需要为这个表单增加订阅者
        new Subscriber(
          vm,
          attribute.nodeValue,
          newValue => {
            node.value = newValue;
          },
          notifier
        );
        // 然后为 input 表单添加 input 事件监听器
        node.addEventListener('input', e => {
          // 下面使用 reduce 方法获取到属性链最后一个元素之前的属性，例如 more.like 在这里首先获取 more 属性值，是一个对
          // 象，然后再通过中括号访问 like 属性进行赋值操作。
          const sourcePropertiesArray = attribute.nodeValue.split('.');
          const propertiesArrayWithoutLast = sourcePropertiesArray.slice(
            0,
            sourcePropertiesArray.length - 1
          );
          propertiesArrayWithoutLast.reduce((total, current) => total[current], vm.$data)[
            sourcePropertiesArray[sourcePropertiesArray.length - 1]
          ] = e.target.value;
        });
      }
    });
  }
  //   对于参数节点的子节点递归渲染
  node.childNodes.forEach(child => {
    fragmentCompile(child, vm);
  });
}
```
