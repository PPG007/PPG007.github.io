# 事件

## EventTarget 接口

- addEventListener()：用于当前节点或对象上，添加一个事件监听器，这个函数接受三个参数：
  - type：事件名称，大小写敏感。
  - listener：监听函数，事件发生时会被调用。
  - 一个监听器配置对象，该对象有以下属性：
    - capture：布尔值，设为 true 表示监听函数在捕获阶段就会触发，默认值为 false，在冒泡阶段触发。
    - once：布尔值，如果设置为 true，表示监听函数执行一次就会自动移除，默认为 false。
    - passive：布尔值，设为 true 时表示禁止监听函数调用 `preventDefault()` 方法，默认为 false。
    - signal：属性值为一个 AbortSignal 对象，为监听器设置了一个信号通道，用来在需要时发出信号，移除监听函数。
- removeEventListener()：移除添加的事件监听函数，接受的参数和 addEventListener() 一致，但是不能取消匿名函数的监听。
- dispatchEvent()：在当前节点上触发指定事件，从而触发监听函数的执行，参数是一个 Event 对象实例。

## 事件模型

事件的传播：

一个事件发生后，会在子元素和父元素之间传播，这个传播分为三个阶段：

- 从 window 对象传导到目标节点，称为*捕获阶段*。
- 在目标节点上触发，称为*目标阶段*。
- 从目标节点传导会 window 对象，称为*冒泡阶段*。

事件的代理：

由父节点的监听函数同一处理多个子元素的事件称为事件的代理。

如果希望事件到某个节点为止不再传播，可以使用事件对象的 `event.stopPropagation()` 方法阻止事件的传播。

如果想要彻底取消一个事件，使用 `stopImmediatePropagation()` 方法。

## Event 对象

Event 构造函数接受两个参数：

- 第一个参数 type 是字符串表示事件的名称。
- 第二个参数 options 是一个对象，表示事件对象的配置：
  - bubbles：布尔值，可选，默认 false，表示事件对象是否冒泡。
  - cancelable：布尔值，可选，默认 false，表示事件是否可以被取消，即 `Event.preventDefault()`。

实例方法：

- Event.preventDefault()：取消浏览器对当前事件的默认行为，前提是事件对象的 cancelable 属性为 true，此方法知识取消事件对当前元素的默认影响，不会阻止事件的传播。
- Event.stopPropagation()：阻止事件继续传播，防止再触发定义在别的节点上的监听函数，不包括在当前节点上其他事件监听函数。
- Event.stopImmediatePropagation()：阻止同一个事件的其他监听函数被调用，不管监听函数定义在当前节点还是其他节点。
- Event.composedPath()：返回一个数组，成员是事件的最底层节点和依次冒泡所经过的所有上层节点。
