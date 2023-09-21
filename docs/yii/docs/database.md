# 访问数据库

## MongoDB

### 安装

```php
composer require --prefer-dist yiisoft/yii2-mongodb
```

配置：

```php
'mongodb' => [
    'class' => '\yii\mongodb\Connection',
    'dsn' => 'mongodb://127.0.0.1:27018/todo',
]
```

### 活动记录

Active Record 提供了一个面向对象的接口， 用以访问和操作数据库中的数据。Active Record 类与数据库表关联，Active Record 实例对应于该表的一行，Active Record 实例的属性表示该行中特定列的值。

为了声明一个 Activate Record 类，需要继承 `yii\mongodb\ActiveRecord` 类并覆写 getCollection 和 `attributes` 两个方法。

```php
class Todo extends ActiveRecord
{
    public static function getCollection()
    {
        return 'todo';
    }

    public function attributes()
    {
        return [
            '_id',
            'content',
            'createdAt',
            'updatedAt',
            'userId',
            'isDeleted',
            'needRemind',
            'remindSetting',
        ];
    }
}
```

执行查询：

```php
public static function findByUserId($userId = '')
{
    $condition = [
        'userId' => $userId,
    ];
    return self::findAll($condition);
}
```

#### Active Record 的生命周期

实例化生命周期：

- 构造函数。
- init()，触发 EVENT_INIT 事件（在 BaseActivateRecord 基类里）。

查询生命周期：

- 构造函数。
- init()，触发 EVENT_INIT 事件。
- afterFind()，触发 EVENT_AFTER_FIND 事件。

保存数据生命周期：

通过 save 方法插入或更新 Activate Record 实例时，发生以下周期。

- beforeValidate()：触发 EVENT_BEFORE_VALIDATE 事件，如果方法返回 false 后面的步骤都会跳过。
- validate()：数据验证，返回 false 后面的步骤都会跳过。
- afterValidate()：触发 EVENT_AFTER_VALIDATE 事件。
- beforeSave()：触发 EVENT_BEFORE_INSERT 或者 EVENT_BEFORE_UPDATE 事件如果方法返回 false 跳过后面的步骤。
- 执行插入或者更新。
- afterSave()：触发 EVENT_AFTER_INSERT 或者 EVENT_AFTER_UPDATE 事件。

删除数据生命周期：

- beforeDelete()：触发 EVENT_BEFORE_DELETE 事件，如果返回 false 跳过后面的步骤。
- 执行删除。
- afterDelete()：触发 EVENT_AFTER_DELETE 事件。

::: tip

有的直接操作数据库的方法不会触发生命周期，例如 updateAll、deleteAll 等

:::

## Redis

### 安装

```php
composer require --prefer-dist yiisoft/yii2-redis
```

配置：

```php
'redis' => [
    'class' => \yii\redis\Connection::class,
    'hostname' => '127.0.0.1',
    'port' => '6379',
    'database' => 1,
]
```

### 使用

可以使用封装好的方法：

```php
$redis = Yii::$app->redis;
$redis->set('a', 123);
return $redis->get('a');
```

也可以直接执行命令：

```php
$redis = Yii::$app->redis;
$redis->executeCommand('SET', ['a', '123']);
return $redis->executeCommand('KEYS', ['*']);
```
