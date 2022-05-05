# Flutter 中的布局

Flutter 布局的核心机制是 widgets。在 Flutter 中，几乎所有东西都是 widget —— 甚至布局模型都是 widgets。你在 Flutter 应用程序中看到的图像，图标和文本都是 widgets。此外不能直接看到的也是 widgets，例如用来排列、限制和对齐可见 widgets 的行、列和网格。

你可以通过组合 widgets 来构建更复杂的 widgets 来创建布局。

![layout-1](/flutter/layout-1.png)

上面这个界面的 widget 树形图如下：

![layout-2](/flutter/layout-2.png)

Container 是一个 widget，允许自定义其子 widget，例如如果要添加 padding、margin、边框或者背景颜色就可以使用 Container。

## 布局 widget

### 选择一个布局 widget

可以从[这里](https://flutter.cn/docs/development/ui/widgets/layout)选择。

### 创建一个可见 widget

创建 Text widget：

```dart
Text('Hello World'),
```

创建 Image widget：

```dart
Image.asset(
  'images/lake.jpg',
  fit: BoxFit.cover,
),
```

创建 Icon widget：

```dart
Icon(
  Icons.star,
  color: Colors.red[500],
),
```

### 将可见 widget 添加到布局 widget

所有布局 widgets 都具有以下任意一项：

- 一个 child 属性，如果它们只包含一个子项。
- 一个 children 属性，如果它们包含多个子项。

将 Text widget 添加到 Center widget：

```dart
const Center(
  child: Text('Hello World'),
),
```

### 将布局 widget 添加到页面

一个 Flutter app 本身就是一个 widget，大多数 widgets 都有一个 build() 方法，在 app 的 build() 方法中实例化和返回一个 widget 会让它显示出来。

对于 Material app，你可以使用 Scaffold widget，它提供默认的 banner 背景颜色，还有用于添加抽屉、提示条和底部列表弹窗的 API。你可以将 Center widget 直接添加到主页 body 的属性中。

```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter layout demo',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Flutter layout demo'),
        ),
        body: const Center(
          child: Text('Hello World'),
        ),
      ),
    );
  }
}

void main(List<String> args) {
  runApp(const MyApp());
}
```

对于非 Material apps 可以将 Center widget 添加到 app 的 build 方法里：

```dart
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(color: Colors.white),
      child: const Center(
        child: Text(
          'Hello World',
          textDirection: TextDirection.ltr,
          style: TextStyle(
            fontSize: 32,
            color: Colors.black87,
          ),
        ),
      ),
    );
  }
}

void main(List<String> args) {
  runApp(const MyApp());
}
```

## 横向或纵向布局多个 widgets

这里就实现最开始的三个图标的布局：

```dart
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      // padding: const EdgeInsets.only(top: 100),
      transformAlignment: Alignment.bottomCenter,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              const Icon(
                Icons.call,
                color: Colors.blue,
              ),
              Container(
                child: const Text('CALL'),
              ),
            ],
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              const Icon(
                Icons.route,
                color: Colors.blue,
              ),
              Container(
                child: const Text('ROUTE'),
              ),
            ],
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              const Icon(
                Icons.share,
                color: Colors.blue,
              ),
              Container(
                child: const Text('SHARE'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

void main(List<String> args) {
  runApp(MaterialApp(
    title: 'title',
    home: Scaffold(
      appBar: AppBar(
        title: const Text('appbar'),
      ),
      body: const MyApp(),
    ),
  ));
}
```

上面的 Row 和 Column 可以通过 MainAxisAlignment 和 CrossAxisAlignment 控制对齐：

![main-cross-axisAlignment](/flutter/main-cross-axisAlignment.png)

## 调整 widget 大小

例如在一个 Row 中放置多张图片，可能会出现图片总体大小溢出了显示区域，这时可以使用 Expanded 包裹 widget 解决：

```dart
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Expanded(child: Image.asset('images/1.jpg'), flex: 5,),
        Expanded(child: Image.asset('images/2.jpg')),
        Expanded(child: Image.asset('images/3.jpg')),
      ],
    );
  }
}

void main(List<String> args) {
  runApp(MaterialApp(
    title: 'title',
    home: Scaffold(
      appBar: AppBar(
        title: const Text('appbar'),
      ),
      body: const MyApp(),
    ),
  ));
}
```

其中可以指定 flex 的值来指定某个 widget 占用空间相比其他 widget 的比例。

::: warning
在 Flutter 中使用图片需要修改 pubspec.yaml 文件中的 asserts 配置项，将图片添加进去。
:::

## 通用布局 widgets

下面的 widget 会分为两类，widgets 库中的标准 widgets 和 Material 库中的 widgets，任何 app 都可以使用 widget 库，Material 库只能在 Material App 中使用。

标准 widgets：

- Container：向 widget 增加 padding、margins、borders、background color 或者其他的装饰。
- GridView：将 widget 展示为一个可滚动的网格。
- ListView：将 widget 展示为一个可滚动的列表。
- Stack：将 widget 覆盖在另一个的上面。

Material widgets：

- Card：将相关信息整理到一个有圆角和阴影的盒子中。
- ListTitle：将最多三行文本、可选的导语以及后面的图标组织在一行中。

### Container

下面将列的背景色改为了浅灰色并为边框增加了圆角效果：

```dart
import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
    home: Container(
      decoration: const BoxDecoration(
        color: Colors.black26,
      ),
      child: Column(children: [
        Expanded(
            child: Row(
          children: [
            Expanded(child: Container(
              decoration: BoxDecoration(
                  border: Border.all(width: 10, color: Colors.black38),
                  borderRadius: const BorderRadius.all(Radius.circular(8))),
              margin: const EdgeInsets.all(4),
              child: Image.asset('images/1.jpg'),
            )),
            Expanded(child: Container(
              decoration: BoxDecoration(
                  border: Border.all(width: 10, color: Colors.black38),
                  borderRadius: const BorderRadius.all(Radius.circular(8))),
              margin: const EdgeInsets.all(4),
              child: Image.asset('images/2.jpg'),
            ))
          ],
        )),
        Expanded(
            child: Row(
          children: [
            Expanded(child: Container(
              decoration: BoxDecoration(
                  border: Border.all(width: 10, color: Colors.black38),
                  borderRadius: const BorderRadius.all(Radius.circular(8))),
              margin: const EdgeInsets.all(4),
              child: Image.asset('images/3.jpg'),
            )),
            Expanded(child: Container(
              decoration: BoxDecoration(
                  border: Border.all(width: 10, color: Colors.black38),
                  borderRadius: const BorderRadius.all(Radius.circular(8))),
              margin: const EdgeInsets.all(4),
              child: Image.asset('images/4.jpg'),
            ))
          ],
        )),
      ]),
    ),
  ));
}
```

### GridView

使用 GridView 将 widget 作为二维列表展示。 GridView 提供两个预制的列表，或者你可以自定义网格。当 GridView 检测到内容太长而无法适应渲染盒时，它就会自动支持滚动。

使用 `GridView.count()` 允许你制定列的数量，使用 `GridView.extent()` 允许你制定单元格的最大宽度。

```dart
import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
      home: Scaffold(
          appBar: AppBar(
            title: const Text('appbar'),
          ),
          body: GridView.count(
            crossAxisCount: 3,

            children: getImages(30),
            padding: const EdgeInsets.all(4),
          ))));
}

List<Widget> getImages(int count) {
  List<Widget> result = [];
  for (var i = 0; i < count; i++) {
    result.add(Image.asset('images/2.jpg'));
  }
  return result;
}
```

### ListView

```dart
import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
      home: Scaffold(
          appBar: AppBar(
            title: const Text('appbar'),
          ),
          body: ListView(
            children: getImages(300),
          ))));
}

List<Widget> getImages(int count) {
  List<Widget> result = [];
  for (var i = 0; i < count; i++) {
    result.add(ListTile(
      title: const Text('title'),
      subtitle: const Text('subTitle'),
      leading: Image.asset('images/2.jpg'),
      trailing: const Icon(Icons.share),
    ));
  }
  return result;
}
```

### Stack

- 用于覆盖另一个 widget。
- 子列表中的第一个 widget 是基础 widget，后面的子项覆盖在基础 widget 的顶部。
- Stack 的内容是无法滚动的。
- 可以剪切掉超出渲染框的子项。

```dart
import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
      home: Scaffold(
          appBar: AppBar(
            title: const Text('appbar'),
          ),
          body: ListView(
            children: getImages(100),
          ))));
}

List<Widget> getImages(int count) {
  List<Widget> result = [];
  for (var i = 0; i < count; i++) {
    result.add(ListTile(
      title: const Text('title'),
      subtitle: const Text('subTitle'),
      leading: Stack(
        alignment: const Alignment(0.1, 0.1),
        children: [
        const CircleAvatar(
          backgroundImage: AssetImage('images/2.jpg'),
          radius: 100,
        ),
        Container(
          decoration: const BoxDecoration(
            color: Colors.black45,
          ),
          child: const Text(
            'JJ',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
      ]),
      trailing: const Icon(Icons.share),
    ));
  }
  return result;
}
```

### Card

通常和 ListTile 一起使用，Card 只有一个子项，默认情况下，Card 的大小是 0 * 0 像素，可以使用 SizedBox 控制 Card 的大小。

在 Flutter 中，Card 有轻微的圆角和阴影来使它具有 3D 效果。改变 Card 的 elevation 属性可以控制阴影效果。例如，把 elevation 设置为 24，可以从视觉上更多的把 Card 抬离表面，使阴影变得更加分散。关于支持的 elevation 的值的列表，参考[这里](https://material-io.cn/design/environment/elevation.html#elevation-in-material-design)。使用不支持的值则会使阴影无效。

```dart
import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
      home: Scaffold(
          appBar: AppBar(
            title: const Text('appbar'),
          ),
          body: SizedBox(
            height: 500,
            child: Card(
              color: Colors.grey,
              shadowColor: Colors.red,
              child: Column(
                children: [
                  Expanded(
                      child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('images/1.jpg'),
                    ],
                  )),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: const [
                      Text('Number 10'),
                      Text('Whiterhaven Beach'),
                      Text('Whitsunday Island, Whitsunday Islands')
                    ],
                  ),
                ],
              ),
            ),
          ))));
}
```

### ListTile

ListTile 是 Material 库 中专用的行 widget，它可以很轻松的创建一个包含三行文本以及可选的行前和行尾图标的行。 ListTile 在 Card 或者 ListView 中最常用，但是也可以在别处使用。

- 一个可以包含最多 3 行文本和可选的图标的专用的行。
- 比 Row 更少的配置，更容易使用。

```dart
import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
      home: Scaffold(
          appBar: AppBar(
            title: const Text('appbar'),
          ),
          body: SizedBox(
            height: 210,
            child: Card(
              child: Column(
                children: [
                  ListTile(
                    title: const Text(
                      '1625 Main Street',
                      style: TextStyle(fontWeight: FontWeight.w500),
                    ),
                    subtitle: const Text('My City, CA 99984'),
                    leading: Icon(
                      Icons.restaurant_menu,
                      color: Colors.blue[500],
                    ),
                  ),
                  const Divider(),
                  ListTile(
                    title: const Text(
                      '(408) 555-1212',
                      style: TextStyle(fontWeight: FontWeight.w500),
                    ),
                    leading: Icon(
                      Icons.contact_phone,
                      color: Colors.blue[500],
                    ),
                  ),
                  ListTile(
                    title: const Text('costa@example.com'),
                    leading: Icon(
                      Icons.contact_mail,
                      color: Colors.blue[500],
                    ),
                  ),
                ],
              ),
            ),
          ))));
}
```
