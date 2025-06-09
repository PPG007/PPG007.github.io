# 构建自适应的应用

## 构建自适应的布局

### 布局 widgets

部分最有用的布局 widgets：

single child：

- Align：让子级在其内部进行对齐。可使用 -1 至 1 之间的任意值在垂直和水平方向上进行对齐。
- AspectRatio：尝试让子级以指定的比例进行布局。
- ConstrainedBox：对子级施加尺寸限制，可以控制最小和最大的尺寸。
- CustomSingleChildLayout：使用代理方法对单个子级进行定位。代理方法可以为子级确定布局限制和定位。
- Expanded 和 Flexible：允许 Row 或 Column 的子级填充剩余空间或者尽可能地小。
- FractionallySizedBox：基于剩余空间的比例限定子级的大小。
- LayoutBuilder：让子级可以基于父级的尺寸重新调整其布局。
- SingleChildScrollView：为单一的子级添加滚动。通常配合 Row 或 Column 进行使用。

multi child：

- Column、Row 和 Flex： 在同一水平线或垂直线上放置所有子级。 Column 和 Row 都继承了 Flex widget。
- CustomMultiChildLayout： 在布局过程中使用代理方法对多个子级进行定位。
- Flow：相对于 CustomMultiChildLayout 更高效的布局方式。在绘制过程中使用代理方法对多个子级进行定位。
- ListView、GridView 和 CustomScrollView： 为所有子级增加滚动支持。
- Stack：基于 Stack 的边界对多个子级进行放置和定位。与 CSS 中的 position: fixed 功能类似。
- Table：使用经典的表格布局算法，可以组合多列和多行。
- Wrap：将子级顺序显示在多行或多列内。

### 视觉密度

不同的设备会提供不同级别的显示密度，使得操作的命中区域也要随之变化。 Flutter 的 VisualDensity 类可以让你快速地调整整个应用的视图密度，比如在可触控设备上放大一个按钮（使其更容易被点击）。

在你改变 MaterialApp 的 VisualDensity 时，已支持 VisualDensity 的 MaterialComponents 会以动画过渡的形式改变其自身的密度。水平和垂直方向的密度默认都为 0.0，你可以将它设置为任意的正负值，这样就可以通过调整密度轻松地调整你的 UI。

若想使用自定义的视觉密度，请在你的 MaterialApp 的主题中进行设置：

```dart
double densityAmt = touchMode ? 0.0 : -1.0;
VisualDensity density =
    VisualDensity(horizontal: densityAmt, vertical: densityAmt);
return MaterialApp(
  theme: ThemeData(visualDensity: density),
  home: MainAppScaffold(),
  debugShowCheckedModeBanner: false,
);
```

### 基于上下文的布局

#### 基于屏幕大小的分界点

```dart
class FormFactor {
  static double desktop = 900;
  static double tablet = 600;
  static double handset = 300;
}
ScreenType getFormFactor(BuildContext context) {
  // Use .shortestSide to detect device type regardless of orientation
  double deviceWidth = MediaQuery.of(context).size.shortestSide;
  if (deviceWidth > FormFactor.desktop) return ScreenType.Desktop;
  if (deviceWidth > FormFactor.tablet) return ScreenType.Tablet;
  if (deviceWidth > FormFactor.handset) return ScreenType.Handset;
  return ScreenType.Watch;
}
```

#### 使用 LayoutBuilder 提升布局灵活性

尽管对于全屏页面或者全局的布局决策而言，判断整个屏幕大小非常有效，但对于内嵌的子视图而言，并不一定是合理的方案。子视图通常有自己的分界点，并且只关心它们可用的渲染空间。

在 Flutter 内处理这类场景最简单的做法是使用 LayoutBuilder。 LayoutBuilder 让 widget 可以根据其父级的限制进行调整，相比依赖全局的尺寸限制而言更为通用。

```dart
Widget foo = LayoutBuilder(
    builder: (BuildContext context, BoxConstraints constraints) {
  bool useVerticalLayout = constraints.maxWidth < 400.0;
  return Flex(
    children: [
      Text("Hello"),
      Text("World"),
    ],
    direction: useVerticalLayout ? Axis.vertical : Axis.horizontal,
  );
});
```

#### 设备细分

想判断应用当前所处的平台，你可以使用 Platform API 和 kIsWeb 组合进行判断：

```dart
bool get isMobileDevice => !kIsWeb && (Platform.isIOS || Platform.isAndroid);
bool get isDesktopDevice =>
    !kIsWeb && (Platform.isMacOS || Platform.isWindows || Platform.isLinux);
bool get isMobileDeviceOrWeb => kIsWeb || isMobileDevice;
bool get isDesktopDeviceOrWeb => kIsWeb || isDesktopDevice;
```
