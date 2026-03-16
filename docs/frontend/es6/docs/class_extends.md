# Class 的继承

使用 `extends` 关键字完成继承，子类必须在构造器中调用 super 方法，并且调用 super 之前不能使用 this，因为子类自己的 this 对象必须先通过父类的构造函数完成塑造然后再加工，super 中的 this 指的是子类的实例。

super 指向父类的原型对象，所以定义在父类实例上的方法或属性是无法通过 super 调用的。在子类普通方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类实例。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  show() {
    console.log(this.name);
  }
}
class Dog extends Animal {
  constructor(name, sound) {
    super(name);
    this.sound = sound;
  }
  show() {
    console.log(this.name, this.sound);
  }
}
```

从子类获取父类：`Object.getPrototypeOf()`：

```javascript
Object.getPrototypeOf(Dog);
```
