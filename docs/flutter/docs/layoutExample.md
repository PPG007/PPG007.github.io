# 布局构建示例

效果图：

![layoutExample-1.png](/flutter/layoutExample-1.png)

## 实现标题行

利用 Container 控制内外边距。

```dart
Widget title = Container(
  margin: const EdgeInsets.only(top: 20),
  padding: const EdgeInsets.only(left: 10, right: 10),
  child: Row(
    children: [
      Expanded(
          child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Oeschinen Lake Campground',
            style: TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            'Kandersteg, Switzerland',
            style: TextStyle(color: Colors.grey),
          )
        ],
      )),
      const Icon(
        Icons.star,
        color: Colors.red,
      ),
      const Text('41'),
    ],
  ),
);
```

## 实现按钮行

同样利用 Container 控制内外边距。

```dart
Widget button = Container(
  margin: const EdgeInsets.only(top: 30),
  child: Row(
    mainAxisAlignment: MainAxisAlignment.spaceAround,
    children: [
      Column(
        children: [
          const Icon(
            Icons.call,
            color: Colors.blue,
          ),
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 10),
            child: const Text(
              'CALL',
              style: TextStyle(
                  color: Colors.blue,
                  fontSize: 12,
                  fontWeight: FontWeight.w400),
            ),
          ),
        ],
      ),
      Column(
        children: [
          const Icon(
            Icons.near_me,
            color: Colors.blue,
          ),
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 10),
            child: const Text(
              'ROUTE',
              style: TextStyle(
                  color: Colors.blue,
                  fontSize: 12,
                  fontWeight: FontWeight.w400),
            ),
          ),
        ],
      ),
      Column(
        children: [
          const Icon(
            Icons.share,
            color: Colors.blue,
          ),
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 10),
            child: const Text(
              'SHARE',
              style: TextStyle(
                  color: Colors.blue,
                  fontSize: 12,
                  fontWeight: FontWeight.w400),
            ),
          ),
        ],
      ),
    ],
  ),
);
```

## 实现文本区域

```dart
Widget text = Container(
  padding: const EdgeInsets.all(20),
  margin: const EdgeInsets.only(top: 15),
  child: const Text(
    'Lake Oeschinen lies at the foot of the Blüemlisalp in the Bernese '
    'Alps. Situated 1,578 meters above sea level, it is one of the '
    'larger Alpine Lakes. A gondola ride from Kandersteg, followed by a '
    'half-hour walk through pastures and pine forest, leads you to the '
    'lake, which warms to 20 degrees Celsius in the summer. Activities '
    'enjoyed here include rowing, and riding the summer toboggan run.',
    softWrap: true,
  ),
);
```

## 实现图片区域

```dart
Widget image = Image.asset('images/1.jpg');
```

## 收尾

```dart
void main(List<String> args) {
  runApp(MaterialApp(
    title: 'example',
    home: Scaffold(
      appBar: AppBar(title: const Text('example')),
      body: ListView(
        children: [
          image,
          title,
          button,
          text,
        ],
      ),
    ),
  ));
}
```
