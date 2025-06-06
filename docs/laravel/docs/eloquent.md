# Eloquent ORM

## 生成 Model 类

Model 类都会放在 `app/Models` 目录下，且每个 Model 类都将继承 `Illuminate\Database\Eloquent\Model` 类。

使用 `make:model` 命令可以快速生成 Model 类：

```shell
php artisan make:model MemberTagGroup
```

如果想同步生成迁移类，可以添加 `--migration` 选项。此外还有 `--seed`、`--factory`、`--controller` 等选项。

## Model 约定

### 表名

Eloquent 默认情况下使用 Model 名称的蛇形命名复数作为表名，如果需要自定义表名，可以在这个类中定义一个 table 属性：

```php
class MemberTagGroup extends Model
{
    protected $table = 'member_tag_group';
}
```

### 主键

默认情况下 Eloquent 假定每个 Model 对应的表中都有一个 `id` 主键，如果表的主键不是 `id`，可以通过 `$primaryKey` 属性来定义：

```php
class MemberTagGroup extends Model
{
    protected $primaryKey = 'id2';
}
```

此外，Eloquent 假定主键是自增整数值，这意味着 Eloquent 会自动将主键转为整型，如果主键不是自增整数，需要通过设置 `public $incrementing` 属性为 false。

如果主键不是整型，可以通过设置 `protected $keyType = 'string';` 来指定主键的字段类型。

::: tip

Eloquent 要求每个 Model 都至少有一个唯一标识的 ID 作为主键，并且不支持复合主键，除了复合主键外，可以添加任意复合索引。

:::

### UUID

如果希望使用 UUID 而不是自增 id 作为主键，那么可以通过 `HasUuids` trait 来实现：

```php
class MemberTagGroup extends Model
{
    use HasUuids;
}
```

`HasUuids` 将为 Model 生成有序的 UUID，如果希望手动控制 UUID 的生成，可以通过在模型上定义一个 `public function newUniqueId(): string` 方法，来覆盖给定模型的 UUID 生成过程。此外，还可以通过在模型上定义一个 `uniqueIds(): array`方法，来指定哪些列应接收 UUID。

### 时间戳

默认情况下，Eloquent 期望模型对应的数据库表中存在 `created_at` 和 `updated_at` 字段。当模型被创建或更新时，Eloquent 会自动设置这些字段的值。如果不希望这些字段由 Eloquent 自动管理，应该在模型中定义一个 `$timestamps` 属性，并将其值设为 false。

如果需要自定义用于存储时间戳的列名，可以在模型上定义 `CREATED_AT` 和 `UPDATED_AT` 常量：

```php
<?php

class MemberTagGroup extends Model
{
    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'updated_date';
}
```

### 数据库连接

默认情况下，所有的 Model 都将使用默认的数据库连接，如果希望一个 Model 使用特定的数据库连接，则可以在 Model 的 `$connection` 属性中指定连接名称：

```php
class MemberTagGroup extends Model
{
    protected $connection = 'sqlite';
}
```

### 默认字段

默认情况下，新实例化的模型实例不会包含任何属性值。如果你想为模型的某些属性定义默认值，可以在模型上定义一个 `$attributes` 属性。放在 `$attributes` 数组中的属性值应该是其原始的、“可存储” 的格式，就好像它们刚从数据库中读取出来一样：

```php
protected $attributes = [
    'is_deleted' => false,
];
```

上面的代码将为 `is_deleted` 字段添加默认值为 `false`。
