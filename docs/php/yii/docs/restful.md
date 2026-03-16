# Restful

## 快速开始

创建 controller：

```php
class TodoController extends ActiveController
{
    public $modelClass = Todo::class;
}
```

配置 URL：

```php
'urlManager' => [
    'enablePrettyUrl' => true,
    'rules' => [
        [
            'class' => 'yii\rest\UrlRule',
            'controller' => 'todo'
        ]
    ]
],
```

启用 JSON 输入：

```php
'request' => [
    'parsers' => [
        'application/json' => 'yii\web\JsonParser',
    ]
],
```

::: warning

UrlRule 中对 get sources/:id 这种情况的 id 参数使用的正则表达式匹配，只能匹配数字，所以不适用于 ObjectId。

:::

## 控制器

Yii 提供两个控制器基类 `yii\rest\Controller` 和 `yii\rest\ActiveController` 来简化创建 Restful，后者提供一系列将资源处理成 Active Record 的操作。

ActiveController 提供了 actionIndex、actionView、actionCreate、actionUpdate、actionDelete、actionOptions 方法，可以通过重写 actions 方法覆盖。

## 格式化响应

### 数据序列化

使用 `yii\rest\Controller` 可以通过 serializer 属性配置序列化，例如：

```php
class Serializer extends \yii\rest\Serializer
{
    protected function serializeModels(array $models)
    {
        list($fields, $expand) = $this->getRequestedFields();

        foreach ($models as $i => $model) {
            $model = $this->formatModel($model);
            if ($model instanceof Arrayable) {
                $models[$i] = $model->toArray($fields, $expand);
            } elseif (is_array($model)) {
                $models[$i] = ArrayHelper::toArray($model);
            }
        }

        return $models;
    }

    public function serialize($data)
    {
        if ($data instanceof Model && $data->hasErrors()) {
            return $this->serializeModelErrors($data);
        } else if ($data instanceof Arrayable) {
            return $this->serializeModel($data);
        } else if ($data instanceof DataProviderInterface) {
            return $this->serializeDataProvider($data);
        }
        return $this->formatModel($data);
    }

    private function formatModel($model)
    {
        if (is_object($model)) {
            foreach ($model as $key => $value) {
                $model->$key = $this->formatValue($value);
                if (is_array($model->$key) || is_object($model->$key)) {
                    $model->$key = $this->formatModel($model->$key);
                }
            }
        }
        if (is_array($model)) {
            foreach ($model as $key => $value) {
                $model[$key] = $this->formatValue($value);
                if (is_array($model[$key]) || is_object($model[$key])) {
                    $model[$key] = $this->formatModel($model[$key]);
                }
            }
        }
        return $model;
    }

    private function formatValue($value)
    {
        if ($value instanceof ObjectId)
        {
            return (string)$value;
        }
        if ($value instanceof UTCDateTime) {
            return $value->toDateTime()->format(DateTimeInterface::ATOM);
        }
        return $value;
    }
}
```

上面的自定义序列化主要是将 MongoDB ObjectId 转为 hex string 并将 MongoDB UTCDateTime 转为 ISO8601 字符串，然后在 controller 中配置序列化：

```php
class TodoController extends ActiveController
{
    public $serializer = [
        'class' => Serializer::class,
        'collectionEnvelope' => 'items',
    ];
}
```
