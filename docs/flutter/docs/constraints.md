# 布局约束

::: tip 规则
首先，上层 widget 向下层 widget 传递约束条件；
然后，下层 widget 向上层 widget 传递大小信息。
最后，上层 widget 决定下层 widget 的位置。
:::

更多细节：

- Widget 会通过它的 父级 获得自身的约束。约束实际上就是 4 个浮点类型的集合：最大/最小宽度，以及最大/最小高度。
- 然后，这个 widget 将会逐个遍历它的 children 列表。向子级传递 约束（子级之间的约束可能会有所不同），然后询问它的每一个子级需要用于布局的大小。
- 然后，这个 widget 就会对它子级的 children 逐个进行布局。（水平方向是 x 轴，竖直是 y 轴）
- 最后，widget 将会把它的大小信息向上传递至父 widget（包括其原始约束条件）。

一些重要限制：

- 一个 widget 仅在其父级给其约束的情况下才能决定自身的大小。这意味着 widget 通常情况下 不能任意获得其想要的大小。
- 一个 widget 无法知道，也不需要决定其在屏幕中的位置。因为它的位置是由其父级决定的。
- 当轮到父级决定其大小和位置的时候，同样的也取决于它自身的父级。所以，在不考虑整棵树的情况下，几乎不可能精确定义任何 widget 的大小和位置。
- 如果子级想要拥有和父级不同的大小，然而父级没有足够的空间对其进行布局的话，子级的设置的大小可能会不生效。 这时请明确指定它的对齐方式。

## 样例

本节所有 Widgets 可以在[这里](https://flutter.cn/docs/reference/widgets)找到。

样例 1：

```dart
Container(color: red)
```

整个屏幕作为 Container 的父级，并且强制 Container 变成和屏幕一样的大小，所以这个 Container 充满了整个屏幕并绘制成红色。

样例 2：

```dart
Container(width: 100, height: 100, color: red)
```

红色的 Container 想要变成 100 * 100 的大小，但是屏幕强制它变成和屏幕一样大小，所以 Container 充满了整个屏幕。

样例 3：

```dart
Center(
  child: Container(width: 100, height: 100, color: red),
)
```

屏幕强制 Center 和屏幕一样大，所以 Center 充满了屏幕，然后 Center 允许 Container 变成任意大小，但是不能超出屏幕，所以 Container 变成了 100 * 100 大小。

样例 4：

```dart
Align(
  alignment: Alignment.bottomRight,
  child: Container(width: 100, height: 100, color: red),
)
```

Align 同样被强制变为屏幕大小，，并且允许 Container 变成任意大小，但是如果放置 Container 之后还有空白空间会把 Container 放在右下角。

样例 5：

```dart
Center(
  child: Container(
      width: double.infinity, height: double.infinity, color: red),
)
```

Center 被强制和屏幕一样大小，所以 Center 充满了整个屏幕，然后 Center 告诉 Container 可以变成任意大小，但不能超出屏幕，而 Container 希望变成无限大，所以就充满了整个屏幕。

样例 6：

```dart
Center(
  child: Container(color: red),
)
```

Center 被强制变为屏幕大小，所以 Center 充满屏幕。然后 Center 告诉 Container 可以变成任意大小，但是不能超出屏幕。由于 Container 没有子级而且没有固定大小，所以它决定能多大就多大，所以它充满了整个屏幕。

样例 7：

```dart
Center(
  child: Container(
    color: red,
    child: Container(color: green, width: 30, height: 30),
  ),
)
```

Center 被强制变为屏幕大小，所以它充满了整个屏幕。然后 Center 告诉第一层 Container 可以变为任意大小但不能超出屏幕，由于第一层 Container 没有设置大小但是有子 Container，所以它决定变为子 Container 的大小，然后外层的 Container 允许子 Container 变为任意大小但是不能超出屏幕。而这个子 Container 是一个 30 \* 30 的绿色 Container，并且由于两个 Container 一样大，所以都是 30 \* 30，所以绿色完全覆盖红色。

样例 8：

```dart
Center(
  child: Container(
    padding: const EdgeInsets.all(20.0),
    color: red,
    child: Container(color: green, width: 30, height: 30),
  ),
)
```

Center 被强制变为屏幕大小，并允许红色 Container 任意大小但不能超出屏幕，由于红色 Container 没有指定大小但有子 Container，所以它决定变为子 Container 的大小，但是由于设置了 padding，所以可以看见红色。

样例 9：

```dart
ConstrainedBox(
  constraints: const BoxConstraints(
    minWidth: 70,
    minHeight: 70,
    maxWidth: 150,
    maxHeight: 150,
  ),
  child: Container(color: red, width: 10, height: 10),
)
```

ConstrainedBox 仅对其从父级接收到的约束下施加其他约束。ConstrainedBox 被强迫和屏幕大小相同，因此它告诉子 Container 也以屏幕大小作为约束，从而忽略了 constraints 参数带来的影响。

样例 10：

```dart
Center(
  child: ConstrainedBox(
    constraints: const BoxConstraints(
      minWidth: 70,
      minHeight: 70,
      maxWidth: 150,
      maxHeight: 150,
    ),
    child: Container(color: red, width: 10, height: 10),
  ),
)
```

Center 被强迫和屏幕一样大，并且允许 ConstrainedBox 可以是任意大小但不能超出屏幕。ConstrainedBox 将 constraint 参数带来的约束附加到其子对象上。Container 必须介于 70 到 150 像素之间，虽然它只希望拥有 10 个像素大小，但是最后获取了 70 个像素。

样例 11：

```dart
Center(
  child: ConstrainedBox(
    constraints: const BoxConstraints(
      minWidth: 70,
      minHeight: 70,
      maxWidth: 150,
      maxHeight: 150,
    ),
    child: Container(color: red, width: 1000, height: 1000),
  ),
)
```

现在，Center 允许 ConstrainedBox 达到屏幕可允许的任意大小。 ConstrainedBox 将 constraints 参数带来的约束附加到其子对象上。

Container 必须介于 70 到 150 像素之间。虽然它希望自己有 1000 个像素大小，但最终获得了 150 个像素（最大为 150）。

样例 12：

```dart
Center(
  child: ConstrainedBox(
    constraints: const BoxConstraints(
      minWidth: 70,
      minHeight: 70,
      maxWidth: 150,
      maxHeight: 150,
    ),
    child: Container(color: red, width: 100, height: 100),
  ),
)
```

现在，Center 允许 ConstrainedBox 达到屏幕可允许的任意大小。 ConstrainedBox 将 constraints 参数带来的约束附加到其子对象上。

Container 必须介于 70 到 150 像素之间。虽然它希望自己有 100 个像素大小，因为 100 介于 70 至 150 的范围内，所以最终获得了 100 个像素。

样例 13：

```dart
UnconstrainedBox(
  child: Container(color: red, width: 20, height: 50),
)
```

屏幕强制 UnconstrainedBox 变得和屏幕一样大，而 UnconstrainedBox 允许其子级的 Container 可以变为任意大小。

样例 14：

```dart
UnconstrainedBox(
  child: Container(color: red, width: 4000, height: 50),
)
```

屏幕强制 UnconstrainedBox 变得和屏幕一样大，而 UnconstrainedBox 允许其子级的 Container 可以变为任意大小。

不幸的是，在这种情况下，容器的宽度为 4000 像素，这实在是太大，以至于无法容纳在 UnconstrainedBox 中，因此 UnconstrainedBox 将显示溢出警告（overflow warning）。

样例 15：

```dart
OverflowBox(
  minWidth: 0.0,
  minHeight: 0.0,
  maxWidth: double.infinity,
  maxHeight: double.infinity,
  child: Container(color: red, width: 4000, height: 50),
)
```

屏幕强制 OverflowBox 变得和屏幕一样大，并且 OverflowBox 允许其子容器设置为任意大小。

OverflowBox 与 UnconstrainedBox 类似，但不同的是，如果其子级超出该空间，它将不会显示任何警告。

在这种情况下，容器的宽度为 4000 像素，并且太大而无法容纳在 OverflowBox 中，但是 OverflowBox 会全部显示，而不会发出警告。

样例 16：

```dart
UnconstrainedBox(
  child: Container(color: Colors.red, width: double.infinity, height: 100),
)
```

这将不会渲染任何东西，而且你能在控制台看到错误信息。

UnconstrainedBox 让它的子级决定成为任何大小，但是其子级是一个具有无限大小的 Container。

Flutter 无法渲染无限大的东西，所以它抛出以下错误： BoxConstraints forces an infinite width.（盒子约束强制使用了无限的宽度）

样例 17：

```dart
UnconstrainedBox(
  child: LimitedBox(
    maxWidth: 100,
    child: Container(
      color: Colors.red,
      width: double.infinity,
      height: 100,
    ),
  ),
)
```

这次你就不会遇到报错了。 UnconstrainedBox 给 LimitedBox 一个无限的大小；但它向其子级传递了最大为 100 的约束。

如果你将 UnconstrainedBox 替换为 Center，则LimitedBox 将不再应用其限制（因为其限制仅在获得无限约束时才适用），并且容器的宽度允许超过 100。

上面的样例解释了 LimitedBox 和 ConstrainedBox 之间的区别。

样例 18：

```dart
const FittedBox(
  child: Text('Some Example Text.'),
)
```

屏幕强制 FittedBox 变得和屏幕一样大，而 Text 则是有一个自然宽度（也被称作 intrinsic 宽度），它取决于文本数量，字体大小等因素。

FittedBox 让 Text 可以变为任意大小。但是在 Text 告诉 FittedBox 其大小后， FittedBox 缩放文本直到填满所有可用宽度。

样例 19：

```dart
const Center(
  child: FittedBox(
    child: Text('Some Example Text.'),
  ),
)
```

但如果你将 FittedBox 放进 Center widget 中会发生什么？ Center 将会让 FittedBox 能够变为任意大小，取决于屏幕大小。

FittedBox 然后会根据 Text 调整自己的大小，然后让 Text 可以变为所需的任意大小，由于二者具有同一大小，因此不会发生缩放。

样例 20：

```dart
const Center(
  child: FittedBox(
    child: Text(
        'This is some very very very large text that is too big to fit a regular screen in a single line.'),
  ),
)
```

然而，如果 FittedBox 位于 Center 中，但 Text 太大而超出屏幕，会发生什么？

FittedBox 会尝试根据 Text 大小调整大小，但不能大于屏幕大小。然后假定屏幕大小，并调整 Text 的大小以使其也适合屏幕。

样例 21：

```dart
const Center(
  child: Text(
      'This is some very very very large text that is too big to fit a regular screen in a single line.'),
)
```

然而，如果你删除了 FittedBox， Text 则会从屏幕上获取其最大宽度，并在合适的地方换行。

样例 22：

```dart
FittedBox(
  child: Container(
    height: 20.0,
    width: double.infinity,
    color: Colors.red,
  ),
)
```

FittedBox 只能在有限制的宽高中对子 widget 进行缩放（宽度和高度不会变得无限大）。否则，它将无法渲染任何内容，并且你会在控制台中看到错误。

样例 23：

```dart
Row(
  children: [
    Container(color: red, child: const Text('Hello!', style: big)),
    Container(color: green, child: const Text('Goodbye!', style: big)),
  ],
)
```

屏幕强制 Row 变得和屏幕一样大，所以 Row 充满屏幕。

和 UnconstrainedBox 一样， Row 也不会对其子代施加任何约束，而是让它们成为所需的任意大小。 Row 然后将它们并排放置，任何多余的空间都将保持空白。

样例 24：

```dart
Row(
  children: [
    Container(
      color: red,
      child: const Text(
        'This is a very long text that '
        'won\'t fit the line.',
        style: big,
      ),
    ),
    Container(color: green, child: const Text('Goodbye!', style: big)),
  ],
)
```

由于 Row 不会对其子级施加任何约束，因此它的 children 很有可能太大而超出 Row 的可用宽度。在这种情况下， Row 会和 UnconstrainedBox 一样显示溢出警告。

样例 25：

```dart
Row(
  children: [
    Expanded(
      child: Center(
        child: Container(
          color: red,
          child: const Text(
            'This is a very long text that won\'t fit the line.',
            style: big,
          ),
        ),
      ),
    ),
    Container(color: green, child: const Text('Goodbye!', style: big)),
  ],
)
```

当 Row 的子级被包裹在了 Expanded widget 之后， Row 将不会再让其决定自身的宽度了。

取而代之的是，Row 会根据所有 Expanded 的子级来计算其该有的宽度。

换句话说，一旦你使用 Expanded，子级自身的宽度就变得无关紧要，直接会被忽略掉。

样例 26：

```dart
Row(
  children: [
    Expanded(
      child: Container(
        color: red,
        child: const Text(
          'This is a very long text that won\'t fit the line.',
          style: big,
        ),
      ),
    ),
    Expanded(
      child: Container(
        color: green,
        child: const Text(
          'Goodbye!',
          style: big,
        ),
      ),
    ),
  ],
)
```

如果所有 Row 的子级都被包裹了 Expanded widget，每一个 Expanded 大小都会与其 flex 因子成比例，并且 Expanded widget 将会强制其子级具有与 Expanded 相同的宽度。

换句话说，Expanded 忽略了其子 Widget 想要的宽度。

样例 27：

```dart
Row(
  children: [
    Flexible(
      child: Container(
        color: red,
        child: const Text(
          'This is a very long text that won\'t fit the line.',
          style: big,
        ),
      ),
    ),
    Flexible(
      child: Container(
        color: green,
        child: const Text(
          'Goodbye!',
          style: big,
        ),
      ),
    ),
  ],
)
```

如果你使用 Flexible 而不是 Expanded 的话，唯一的区别是，Flexible 会让其子级具有与 Flexible 相同或者更小的宽度。而 Expanded 将会强制其子级具有和 Expanded 相同的宽度。但无论是 Expanded 还是 Flexible 在它们决定子级大小时都会忽略其宽度。

::: tip
这意味着，Row 要么使用子级的宽度，要么使用Expanded 和 Flexible 从而忽略子级的宽度。
:::

样例 28：

```dart
Scaffold(
  body: Container(
    color: blue,
    child: Column(
      children: const [
        Text('Hello!'),
        Text('Goodbye!'),
      ],
    ),
  ),
)
```

屏幕强制 Scaffold 变得和屏幕一样大，所以 Scaffold 充满屏幕。然后 Scaffold 告诉 Container 可以变为任意大小，但不能超出屏幕。

::: tip
当一个 widget 告诉其子级可以比自身更小的话，我们通常称这个 widget 对其子级使用 宽松约束（loose）。
:::

样例 29：

```dart
Scaffold(
  body: SizedBox.expand(
    child: Container(
      color: blue,
      child: Column(
        children: const [
          Text('Hello!'),
          Text('Goodbye!'),
        ],
      ),
    ),
  ),
)
```

如果你想要 Scaffold 的子级变得和 Scaffold 本身一样大的话，你可以将这个子级外包裹一个 SizedBox.expand。

::: tip
当一个 widget 告诉它的子级必须变成某个大小的时候，我们通常称这个 widget 对其子级使用 严格约束（tight）。
:::

## 严格约束（tight）与宽松约束（loose）

严格约束给你了一种获得确切大小的选择。换句话来说就是，它的最大/最小宽度是一致的，高度也一样。

一个 宽松 约束，换句话来说就是设置了最大宽度/高度，但是让允许其子 widget 获得比它更小的任意大小。换句话来说，宽松约束的最小宽度/高度为 0。

样例 2 中，它告诉我们屏幕强制 Container 变得和屏幕一样大。为何屏幕能够做到这一点，原因就是给 Container 传递了严格约束。

样例 3 中，它将会告诉我们 Center 让红色的 Container 变得更小，但是不能超出屏幕。Center 能够做到这一点的原因就在于给 Container 的是一个宽松约束。总的来说，Center 起的作用就是从其父级（屏幕）那里获得的严格约束，为其子级（Container）转换为宽松约束。
