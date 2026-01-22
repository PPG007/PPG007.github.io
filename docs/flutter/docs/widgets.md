# widgets

Flutter 从 React 中吸取灵感，通过现代化框架创建出精美的组件。它的核心思想是用 widget 来构建你的 UI 界面。 Widget 描述了在当前的配置和状态下视图所应该呈现的样子。当 widget 的状态改变时，它会重新构建其描述（展示的 UI），框架则会对比前后变化的不同，以确定底层渲染树从一个状态转换到下一个状态所需的最小更改。

[Widget 目录](https://flutter.cn/docs/reference/widgets)

[核心 Widget 目录](https://flutter.cn/docs/development/ui/widgets)

## Hello World

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    const Center(
      child: Text(
        'Hello, world!',
        textDirection: TextDirection.ltr,
      ),
    ),
  );
}
```

`runApp()` 函数会持有传入的 Widget，并且使它成为 widget 树中的根节点，在这个例子中，widget 树中有两个 widget，Center 及其子 widget，即 Text Widget，框架会强制让根 widget 铺满整个屏幕。

在写应用的过程中，根据是否需要管理状态通常会创建一个新的组件继承 StatelessWidget 或者 StatefulWidget。Widget 的主要工作是实现 `build()` 方法，该方法根据其他较低级别的 widget 来描述这个 widget，直到最底层的描述 widget 几何形状的 RenderObject。

## 基础 widgets

Flutter 自带了一套强大的 widgets，下面是一些常用的。

- Text。

    可以用来在应用内创建带有样式的文本。

- Row、Column。

    可以在水平和垂直方向创建灵活的布局，基于 web 的 flexbox 布局模型设计的。

- Stack。

    不是线性（水平或垂直）定位的，而是按照绘制顺序将 widget 堆叠在一起，是基于 web 中的绝对位置布局模型设计的。

- Container。

    可以用来创建一个可见的矩形元素。Container 可以使用 BoxDecoration 来进行装饰，如背景、边框、阴影等。Container 还可以设置外边距、内边距和尺寸的约束条件等。还可以使用矩阵在三维空间进行转换。

示例：

```dart
import 'package:flutter/material.dart';

class MyAppBar extends StatelessWidget {
  const MyAppBar({required this.title, Key? key}) : super(key: key);

  // Fields in a Widget subclass are always marked "final".

  final Widget title;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56.0, // in logical pixels
      padding: const EdgeInsets.symmetric(horizontal: 8.0),
      decoration: BoxDecoration(color: Colors.blue[500]),
      // Row is a horizontal, linear layout.
      child: Row(
        // <Widget> is the type of items in the list.
        children: [
          const IconButton(
            icon: Icon(Icons.menu),
            tooltip: 'Navigation menu',
            onPressed: null, // null disables the button
            hoverColor: Colors.red,
          ),
          // Expanded expands its child
          // to fill the available space.
          Expanded(
            child: title,
          ),
          const IconButton(
            icon: Icon(Icons.search),
            tooltip: 'Search',
            onPressed: null,
          ),
        ],
      ),
    );
  }
}

class MyScaffold extends StatelessWidget {
  const MyScaffold({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Material is a conceptual piece
    // of paper on which the UI appears.
    return Material(
      // Column is a vertical, linear layout.
      child: Column(
        children: [
          MyAppBar(
            title: Text(
              'Example title',
              style: Theme.of(context) //
                  .primaryTextTheme
                  .headline6,
            ),
          ),
          const Expanded(
            child: Center(
              child: Text('Hello, world!'),
            ),
          ),
        ],
      ),
    );
  }
}

void main() {
  runApp(
    const MaterialApp(
      title: 'My app', // used by the OS task switcher
      home: SafeArea(
        child: MyScaffold(),
      ),
    ),
  );
}
```

::: tip
请确保 pubspec.yaml 文件中的 flutter.uses-material-design 属性值为 true，这允许你使用预置的 Material icons。
:::

MyAppBar widget 创建了一个 56 像素高、左右内边距 8 像素的 Container。在容器内，MyAppBar 以 Row 布局来组织它的子元素，中间的子 widget 即 title widget 被标记为 Expanded，这表示它会扩展以填充其他子 widget 未使用的可用空间。可以定义多个 Expanded 子 widget 并使用 flex 参数确定它们占用可用空间的比例。

MyScaffold widget 将其子 widget 组织在垂直列中。在列的顶部，它放置一个 MyAppBar 实例，并把 Text widget 传给它来作为应用的标题，最后使用 Expanded 来填充剩余空间，其中包含一个居中的消息。

## 使用 Material 组件

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    const MaterialApp(
      title: 'Flutter Tutorial',
      home: TutorialHome(),
    ),
  );
}

class TutorialHome extends StatelessWidget {
  const TutorialHome({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Scaffold is a layout for
    // the major Material Components.
    return Scaffold(
      appBar: AppBar(
        leading: const IconButton(
          icon: Icon(Icons.menu),
          tooltip: 'Navigation menu',
          onPressed: null,
        ),
        title: const Text('Example title'),
        actions: const [
          IconButton(
            icon: Icon(Icons.search),
            tooltip: 'Search',
            onPressed: null,
          ),
        ],
      ),
      // body is the majority of the screen.
      body: const Center(
        child: Text('Hello, world!'),
      ),
      floatingActionButton: const FloatingActionButton(
        tooltip: 'Add', // used by assistive technologies
        child: Icon(Icons.add),
        onPressed: null,
      ),
    );
  }
}
```

Material 应用以 MaterialApp widget 开始，它在应用的底层下构建了许多有用的 widget。与上面的例子相比，这里的应用标题栏有了阴影，标题文本会自动继承正确的样式，还增加了一个浮动按钮。

## 处理手势

```dart
import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  const MyButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        print('MyButton was tapped!');
      },
      child: Container(
        height: 50.0,
        padding: const EdgeInsets.all(8.0),
        margin: const EdgeInsets.symmetric(horizontal: 8.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(5.0),
          color: Colors.lightGreen[500],
        ),
        child: const Center(
          child: Text('Engage'),
        ),
      ),
    );
  }
}

void main() {
  runApp(
    const MaterialApp(
      home: Scaffold(
        body: Center(
          child: MyButton(),
        ),
      ),
    ),
  );
}
```

许多 widget 使用 GestureDetector 为其他 widget 提供可选的回调，当用户点击 widget 时就会触发这些回调。

## 根据用户输入改变 widget

我们仅使用了无状态的 widget。无状态 widget 接收的参数来自于它的父 widget，它们储存在 final 成员变量中。当 widget 需要被 build() 时，就是用这些存储的变量为创建的 widget 生成新的参数。

为了构建更复杂的体验，例如，以更有趣的方式对用户输入做出反应—应用通常带有一些状态。 Flutter 使用 StatefulWidgets 来实现这一想法。 StatefulWidgets 是一种特殊的 widget，它会生成 State 对象，用于保存状态。

```dart
import 'package:flutter/material.dart';

class Counter extends StatefulWidget {
  // This class is the configuration for the state.
  // It holds the values (in this case nothing) provided
  // by the parent and used by the build  method of the
  // State. Fields in a Widget subclass are always marked
  // "final".

  const Counter({Key? key}) : super(key: key);

  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      // This call to setState tells the Flutter framework
      // that something has changed in this State, which
      // causes it to rerun the build method below so that
      // the display can reflect the updated values. If you
      // change _counter without calling setState(), then
      // the build method won't be called again, and so
      // nothing would appear to happen.
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called,
    // for instance, as done by the _increment method above.
    // The Flutter framework has been optimized to make
    // rerunning build methods fast, so that you can just
    // rebuild anything that needs updating rather than
    // having to individually changes instances of widgets.
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        ElevatedButton(
          onPressed: _increment,
          child: const Text('Increment'),
        ),
        const SizedBox(width: 16),
        Text('Count: $_counter'),
      ],
    );
  }
}

void main() {
  runApp(
    const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Counter(),
        ),
      ),
    ),
  );
}
```

widget 是临时对象，state 对象在每次调用 build 方法间都是持久的，以此来存储信息，二者具有不同的生命周期，因此上面的 StatefulWidget 和 State 是独立的对象。

下面是一个稍微复杂的例子：

```dart
import 'package:flutter/material.dart';

class CounterDisplay extends StatelessWidget {
  const CounterDisplay({required this.count, Key? key}) : super(key: key);

  final int count;

  @override
  Widget build(BuildContext context) {
    return Text('Count: $count');
  }
}

class CounterIncrementor extends StatelessWidget {
  const CounterIncrementor({required this.onPressed, Key? key})
      : super(key: key);

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      child: const Text('Increment'),
    );
  }
}

class Counter extends StatefulWidget {
  const Counter({Key? key}) : super(key: key);

  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      ++_counter;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        CounterIncrementor(onPressed: _increment),
        const SizedBox(width: 16),
        CounterDisplay(count: _counter),
      ],
    );
  }
}

void main() {
  runApp(
    const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Counter(),
        ),
      ),
    ),
  );
}
```

这个复杂的例子中，将计数器的显示和改变数值进行了分离，通过回调函数改变计数值，封装性更好。

## 整合在一起

下面是一个更完整的示例，汇集了上面介绍的概念：假定一个购物应用显示各种出售的产品，并在购物车中维护想购买的物品。

```dart
import 'package:flutter/material.dart';

class Product {
  const Product({required this.name});

  final String name;
}

typedef CartChangedCallback = Function(Product product, bool inCart);

class ShoppingListItem extends StatelessWidget {
  ShoppingListItem({
    required this.product,
    required this.inCart,
    required this.onCartChanged,
  }) : super(key: ObjectKey(product));

  final Product product;
  final bool inCart;
  final CartChangedCallback onCartChanged;

  Color _getColor(BuildContext context) {
    // The theme depends on the BuildContext because different
    // parts of the tree can have different themes.
    // The BuildContext indicates where the build is
    // taking place and therefore which theme to use.

    return inCart //
        ? Colors.black54
        : Theme.of(context).primaryColor;
  }

  TextStyle? _getTextStyle(BuildContext context) {
    if (!inCart) return null;

    return const TextStyle(
      color: Colors.black54,
      decoration: TextDecoration.lineThrough,
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () {
        onCartChanged(product, inCart);
      },
      leading: CircleAvatar(
        backgroundColor: _getColor(context),
        child: Text(product.name[0]),
      ),
      title: Text(
        product.name,
        style: _getTextStyle(context),
      ),
    );
  }
}

class ShoppingList extends StatefulWidget {
  const ShoppingList({required this.products, Key? key}) : super(key: key);

  final List<Product> products;

  // The framework calls createState the first time
  // a widget appears at a given location in the tree.
  // If the parent rebuilds and uses the same type of
  // widget (with the same key), the framework re-uses
  // the State object instead of creating a new State object.

  @override
  _ShoppingListState createState() => _ShoppingListState();
}

class _ShoppingListState extends State<ShoppingList> {
  final _shoppingCart = <Product>{};

  void _handleCartChanged(Product product, bool inCart) {
    setState(() {
      // When a user changes what's in the cart, you need
      // to change _shoppingCart inside a setState call to
      // trigger a rebuild.
      // The framework then calls build, below,
      // which updates the visual appearance of the app.

      if (!inCart) {
        _shoppingCart.add(product);
      } else {
        _shoppingCart.remove(product);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shopping List'),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        children: widget.products.map((Product product) {
          return ShoppingListItem(
            product: product,
            inCart: _shoppingCart.contains(product),
            onCartChanged: _handleCartChanged,
          );
        }).toList(),
      ),
    );
  }
}

void main() {
  runApp(const MaterialApp(
    title: 'Shopping App',
    home: ShoppingList(
      products: [
        Product(name: 'Eggs'),
        Product(name: 'Flour'),
        Product(name: 'Chocolate chips'),
      ],
    ),
  ));
}
```

ShoppingListItem widget 遵循无状态 widget 的通用模式。它将构造函数中接受到的值存储在 final 成员变量中，然后在 `build()` 函数中使用它们。例如，inCart 布尔值使两种样式进行切换：一个使用当前主题的主要颜色，另一个使用灰色。

当用户点击列表中的一项，widget 不会直接改变 inCart 的值，而是通过调用从父 widget 接收到的 onCartChanged 函数。这种方式可以在组件的生命周期中存储状态更长久，从而使状态持久化。甚至，widget 传给 runApp() 的状态可以持久到整个应用的生命周期。

当父级接收到 onCartChanged 回调时，父级会更新其内部状态，从而触发父级重建并使用新的 inCart 值来创建新的 ShoppingListItem 实例。尽管父级在重建时会创建 ShoppingListItem 的新实例，但是由于框架会将新构建的 widget 与先前构建的 widget 进行比较，仅将差异应用于底层的 RenderObject，这种代价是很小的。

ShoppingList 类继承自 StatefulWidget，这意味着这个 widget 存储着可变状态。当 ShoppingList 首次插入到 widget 树中时，框架调用 `createState()` 函数来创建 `_ShoppingListState` 的新实例，以与树中的该位置相关联。（注意，State 的子类通常以下划线开头进行命名，表示它们的实现细节是私有的）当该 widget 的父 widget 重建时，父 widget 首先会创建一个 ShoppingList 的实例，但是框架会复用之前创建的 `_ShoppingListState`，而不会重新调用 `createState`。

为了访问当前 ShoppingList 的属性， `_ShoppingListState` 可以使用它的 widget 属性。当父组件重建一个新的 ShoppingList 时， `_ShoppingListState` 会使用新的 widget 值来创建。如果希望在 widget 属性更改时收到通知，则可以重写 didUpdateWidget() 函数，该函数将 oldWidget 作为参数传递，以便将 oldWidget 与当前 widget 进行比较。

当处理 onCartChanged 回调时，`_ShoppingListState` 通过增加或删除 _shoppingCart 中的产品来改变其内部状态。为了通知框架它改变了它的内部状态，需要调用 setState()，将该 widget 标记为 dirty（脏标记），并且计划在下次应用需要更新屏幕时重新构建它。如果在修改 widget 的内部状态后忘记调用 setState，框架将不知道这个 widget 是 dirty（脏标记），并且可能不会调用 widget 的 build() 方法，这意味着用户界面可能不会更新以展示新的状态。通过以这种方式管理状态，你不需要编写用于创建和更新子 widget 的单独代码。相反，你只需实现 build 函数，它可以处理这两种情况。

## 响应 widget 的声明周期事件

在 StatefulWidget 上调用 `createState()` 之后，框架将新的状态对象插入到树中，然后在状态对象上调用 `initState()`。State 的子类可以重写 initState 来完成只需要发生一次的工作，实现 initState 需要先调用父类的 super.initState 方法来开始。

当不再需要状态对象时，框架会调用状态对象上的 `dispose()` 方法。可以重写dispose 方法来清理状态。例如，重写 dispose 以取消计时器或取消订阅平台服务。实现 dispose 时通常通过调用 super.dispose 来结束。

## Keys

使用 key 可以控制框架在 widget 重建时与哪些其他 widget 进行匹配。默认情况下，框架根据它们的 runtimeType 以及它们的显示顺序来匹配。使用 key 时，框架要求两个 widget 具有相同的 key 和 runtimeType。Key 在构建相同类型 widget 的多个实例时很有用。例如，ShoppingList widget，它只构建刚刚好足够的 ShoppingListItem 实例来填充其可见区域：

- 如果没有 key，当前构建中的第一个条目将始终与前一个构建中的第一个条目同步，在语义上，列表中的第一个条目如果滚动出屏幕，那么它应该不会再在窗口中可见。
- 通过给列表中的每个条目分配为“语义” key，无限列表可以更高效，因为框架将通过相匹配的语义 key 来同步条目，并因此具有相似（或相同）的可视外观。此外，语义上同步条目意味着在有状态子 widget 中，保留的状态将附加到相同的语义条目上，而不是附加到相同数字位置上的条目。

## 全局 key

全局 key 可以用来标识唯一子 widget。全局 key 在整个 widget 结构中必须是全局唯一的，而不像本地 key 只需要在兄弟 widget 中唯一。由于它们是全局唯一的，因此可以使用全局 key 来检索与 widget 关联的状态。
