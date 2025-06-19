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

## 模型检索

只要声明了模型，就可以使用这个模型进行查询：

```php
Route::get('/tagGroups', function (Request $request) {
    $groups = MemberTagGroup::all();
    return response()->json($groups);
});
```

当然也可以构造条件查询，使用 `query` 方法即可获取一个 QueryBuilder，然后就能构造条件了：

```php
Route::get('/tagGroups', function (Request $request) {
    $groups = MemberTagGroup::query()->when($request->has('name'), function (EloquentBuilder $builder) use ($request) {
        $builder->where('name', 'like', '%'.$request->input('name').'%');
    })->get();
    return response()->json($groups);
});
```

一次性查询上万条数据容易导致 OOM，这种情况下可以使用 `chunk` 方法：

```php
Route::get('/tagGroups', function (Request $request) {
    $allGroups = [];
    MemberTagGroup::query()->chunk(2, function (Collection $groups) use(&$allGroups) {
       foreach ($groups as $group) {
           $allGroups[] = [
               'id' => $group->id,
               'name' => $group->name,
           ];
       }
    });
    return response()->json($allGroups);
});
```

或者使用游标遍历：

```php
Route::get('/tagGroups', function (Request $request) {
    $allGroups = [];
    MemberTagGroup::query()->cursor()->each(function (MemberTagGroup $group) use(&$allGroups) {
        $allGroups[] = [
            'id' => $group->id,
            'name' => $group->name,
        ];
    });
    return response()->json($allGroups);
});
```

::: tip

如果要遍历的数据量极大，建议优先考虑 `lazy`。

:::

使用 `find`、`first`、`firstWhere` 方法可以查询单条数据，这些方法将返回 Model 实例，例如给 Model 定义一个方法：

```php
class MemberTagGroup extends Model
{
    protected $table = 'member_tag_group';

    public function test()
    {
        return $this->name;
    }
}
```

然后就可以在单条数据上调用这个方法：

```php
MemberTagGroup::query()->first()->test();
```

有时可能希望在查询不到结果时执行一些操作，这时可以使用 `firstOr`、`findOr` 等方法：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::query()->findOr($id, function () {
        return [
            'message' => 'Not Found'
        ];
    });
    return response()->json($group);
});
```

::: tip

上面的闭包的返回值将赋值给 `findOr` 等方法的返回值。

:::

如果希望没有查询到数据时返回 404 错误，可以使用 `findOrFail`、`firstOrFail` 等方法，这些方法将在查询不到数据时抛出 `ModelNotFoundException` 异常，同时会返回 404 错误：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::query()->findOrFail($id);
    return response()->json($group);
});
```

如果希望查询不到结果时直接创建一个数据，可以使用 `firstOrNew`、`firstOrCreate`、`findOrNew` 等方法，这在初始化一些设置表时比较有用：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::query()->findOrNew($id);
    $group->name = 'new';
    $group->save();
    return response()->json($group);
});
```

::: tip

`OrNew` 方法如果未查询到数据将返回一个 Model 实例，但是并不会持久化到数据库，需要手动调用 `save` 方法。

:::

同样，Model 也提供了 `count`、`sum`、`avg`、`max`、`min` 等方法，用于查询数据：

```php
Route::get('/tagGroups', function () {
    return response()->json([
        'items' => MemberTagGroup::all(),
        'total' => MemberTagGroup::query()->count(),
    ]);
});
```

## 创建和更新

如果需要创建一条数据，可以先构造一个 Model 实例，然后调用 `save` 方法：

```php
Route::post('/tagGroups', function (Request $request) {
    $request->validate([
       'name' => 'required',
    ]);
    $group = new MemberTagGroup();
    $group->name = $request->input('name');
    $group->save();
    return response()->json([]);
});
```

`save` 方法同样可以用来更新数据：

```php
Route::put('/tagGroups/{id}', function (int $id, Request $request) {
    $request->validate([
        'name' => 'required',
    ]);
    $group = MemberTagGroup::query()->findOrFail($id);
    $group->name = $request->input('name');
    $group->save();
    return response()->json([]);
});
```

Eloquent 提供了 `isDirty`、`isClean`、`wasChanged` 方法用来检查 Model 的内部状态：

- `isDirty`：检查 Model 自从被检索以来属性是否被修改。
- `isClean`：检查 Model 自从被检索以来属性是否没有被修改。
- `wasChanged`：检查 Model 在最后一次保存时属性是否被修改。

```php
Route::put('/tagGroups/{id}', function (int $id, Request $request) {
    $request->validate([
        'name' => 'required',
    ]);
    $group = MemberTagGroup::query()->findOrFail($id);
    $group->name = $request->input('name');
    $group->save();
    return response()->json([
        'wasChanged' => $group->wasChanged('name'),
        'isDirty' => $group->isDirty('name'),
        'isClean' => $group->isClean('name'),
    ]);
});
```

此外还有一个 `getOriginal` 方法可以获取模型属性的原始值：

```php
$originalName = $group->getOriginal('name');
```

::: tip

`getOriginal` 方法需要在更新数据前调用才能拿到原始值。

:::

`getChanges` 方法返回一个数组，其中包含模型上次保存时发生更改的属性，此方法需要在更新数据后调用：

```php
'changes' => $group->getChanges(),
```

使用 `create` 方法也可以创建新数据，而且不需要预先构造 Model 实例：

```php
Route::post('/tagGroups', function (Request $request) {
    $request->validate([
       'name' => 'required',
    ]);
    MemberTagGroup::query()->create([
        'name' => $request->input('name'),
    ]);
    return response()->json([]);
});
```

在使用 `create` 方法前，需要先在关联的模型类中声明 `fillable` 或 `guarded` 属性，否则将无法保存，这是因为默认情况下所有的 Eloquent 模型都受到保护，防止用户输入的任意内容被保存到数据库中。

例如允许 `name` 属性被保存：

```php
protected $fillable = ['name'];
```

如果希望所有的属性都能被填充，那么可以将 `$guarded` 属性设置为空数组。

使用 `upsert` 方法可以更新或创建数据，此方法第一个参数包含要更新或创建的数据，第二个参数是唯一索引列，第三个参数是更新时需要更新的字段：

```php
Route::post('/members/upsert', function (Request $request) {
    $count = Member::query()->upsert([
        'name' => $request->input('name'),
        'phone' => $request->input('phone'),
    ], ['phone'], ['name']);
    return response()->json(['count' => $count]);
});
```

## 删除

调用模型实例上的 `delete` 方法可以删除当前模型实例对应的数据库中的记录：

```php
Route::delete('/tagGroups/{id}', function (int $id) {
   $group = MemberTagGroup::query()->find($id);
   $group->delete();
});
```

如果已经获取到了要删除的数据的主键，那么直接使用 `destroy` 方法即可：

```php
Route::delete('/tagGroups/{id}', function (int $id) {
   MemberTagGroup::destroy($id);
});
```

::: tip

`destroy` 方法会逐个加载符合条件的模型然后调用 `delete` 方法。

:::

如果希望使用软删除而不是物理删除，可以使用 `SoftDeletes` trait，这个 trait 会自动添加 `deleted_at` 字段值到模型中，同时，Laravel 的表迁移也能方便的设置软删除：

```php
    public function up(): void
    {
        $tables = [
            'member_address',
            'member_tag',
            'member_tag_group',
            'member_tag_value',
            'product'
        ];
        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->unique(['member_id', 'tag_id']);
                $table->dropUnique(['member_id', 'tag_id', 'is_deleted']);
                $table->dropColumn('is_deleted');
                $table->softDeletes();
            });
        }
    }
```

使用 `trashed` 方法可以判断当前模型实例是否已被软删除：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::query()->find($id);
    return response()->json([
        'trashed' => $group->trashed(),
    ]);
});
```

默认情况下，被软删除的数据不会被查询，如果需要同时查询被软删除的数据，可以使用 `withTrashed` 或 `onlyTrashed` 方法：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::onlyTrashed()->find($id);
    return response()->json([
        'trashed' => $group->trashed(),
    ]);
});
```

## Pruning Model

TODO：

## 查询作用域

TODO：

## 模型比较

使用 `is` 和 `isNot` 方法来比较两个模型是否相等：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group1 = MemberTagGroup::query()->find($id);
    $group2 = MemberTagGroup::query()->find($id+1);
    return response()->json([
        'is' => $group1->is($group2),
    ]);
});
```

## 模型事件

Eloquent 定义了若干事件，包含 `retrieved`、`creating`、`created`、`updating`、`updated`、`saving`、`saved`、`deleting`、`deleted`、`trashed`、`forceDeleting`、`forceDeleted`、`restoring`、`restored` 和 `replicating`。

要监听一个事件，需要将这个事件定义到模型类的 `$dispatchesEvents` 属性中：

```php
protected $dispatchesEvents = [
    'saved' => MemberTagGroupSaved::class,
];
```

这样 `saved` 事件将转发给指定的类来处理。

如果想直接在模型类里监听事件也不使用自定义的处理类，可以直接将闭包通过 `boot` 方法注册：

```php
protected static function boot()
{
    parent::boot();
    static::created(function (MemberTagGroup $group) {
        Log::info('member tag group created', [
            'name' => $group->name,
        ]);
    });
}
```

如果需要监听一个模型上的多个事件，可以将事件监听器组合到一个观察者类中，使用 `make:observer` 命令生成观察者类：

```php
php artisan make:observer MemberTagGroupObserver --model=MemberTagGroup
```

然后将事件监听逻辑写到对应的方法中，之后将观察者类注册到模型中：

```php
#[ObservedBy([MemberTagGroupObserver::class])]
class MemberTagGroup extends Model
```

或者也可以通过 `boot` 方法注册：

```php
protected static function boot()
{
    parent::boot();
    static::observe(MemberTagGroupObserver::class);
}
```

当模型处于事务中时，你可能希望观察者仅在事务提交后运行，此时可以在观察者类上实现 `ShouldHandleEventsAfterCommit` 接口。

有时可能希望当前操作不会触发事件，此时可以使用 `withoutEvents` 方法：

```php
Route::delete('/tagGroups/{id}', function (int $id) {
   MemberTagGroup::withoutEvents(function () use ($id) {
       MemberTagGroup::forceDestroy($id);
   });
});
```

或者使用 `Quietly` 方法，例如：

```php
MemberTagGroup::query()->createQuietly([
    'name' => $request->input('name'),
]);
```

## 模型关系

### 关系的定义

Eloquent 的关系通过模型类的方法来定义。

#### 一对一

这里假设每个 Member 只能有一个地址，将 Member 和 MemberAddress 通过一对一关联起来：

```php
class Member extends Model
{
    protected $table = 'member';

    public function address(): HasOne
    {
        return $this->hasOne(MemberAddress::class);
    }
}
```

`hasOne` 方法可以通过第二个和第三个参数指定外键和关联表的主键，默认情况下，Eloquent 假设通过蛇形命名 `xxx_id` 做外键，关联当前表 `id`。

定义好关系后，即可在模型实例上通过属性名访问关联数据：

```php
Route::get('/members/{id}', function (int $id) {
    $member = Member::query()->findOrFail($id);
    return response()->json([
        'memberName' => $member->name,
        'address' => $member->address,
    ]);
});
```

现在已经可以通过 Member 直接访问 MemberAddress 了，如果想通过 MemberAddress 访问 Member，可以在 MemberAddress 中定义归属关系：

```php
class MemberAddress extends Model
{
    protected $table = 'member_address';

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
```

然后即可通过 MemberAddress 实例上通过属性访问关联的 Member：

```php
Route::get('/memberAddresses', function () {
    $address = MemberAddress::all();
    $result = [];
    foreach ($address as $item) {
        $result[] = [
            'memberId' => $item->member->id,
            'city' => $item->city,
        ];
    }
    return response()->json($result);
});
```

#### 一对多

接下来使用标签组和标签的关系来示例，每个标签组可以有若干个标签，每个标签仅能属于一个标签组，这是一个一对多的关系。

接下来为标签组 MemberTagGroup 定义 `hasMany`：

```php
class MemberTagGroup extends Model
{
    protected $table = 'member_tag_group';

    protected $fillable = ['name'];

    use SoftDeletes;

    public function tags(): HasMany
    {
        return $this->hasMany(MemberTag::class, 'group_id');
    }
}
```

由于 member_tag 表是用的关联的外键名为 group_id 而不是 Eloquent 默认推断的 member_tag_group_id，因此需要通过第二个参数手动指定外键名。

接下来可以通过标签组实例的属性来访问关联的标签：

```php
Route::get('/memberAddresses', function () {
    $address = MemberAddress::all();
    $result = [];
    foreach ($address as $item) {
        $result[] = [
            'memberId' => $item->member->id,
            'city' => $item->city,
        ];
    }
    return response()->json($result);
});
```

同样也可以为 MemberTag 定义归属关系：

```php
class MemberTag extends Model
{
    protected $table = 'member_tag';

    public function group(): BelongsTo
    {
        return $this->belongsTo(MemberTagGroup::class);
    }
}
```

考虑以下场景，通过查询“一”后再通过“多”访问“一”，这会导致三次查询，第一次将查询 group 表，第二次根据 group 查询 tag 表，第三次根据 tag 查询 group 表。

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::query()->find($id);
    return response()->json(array_merge([
        'name' => $group->tags[0]->group->name,
        'tags' => $group->tags,
    ]));
});
```

如果希望 Eloquent 自动将“一”关联到“多”上，可以定义 `hasMany` 时使用 `chaperone` 方法：

```php
public function tags(): HasMany
{
    return $this->hasMany(MemberTag::class, 'group_id')->chaperone();
}
```

#### Has One of Many

如果希望检索一个模型关联的若干数据的最新、最早的一条，可以使用 `hasOne` 方法和 `ofMany` 结合：

```php
public function latestTag(): HasOne
{
    return $this->hasOne(MemberTag::class, 'group_id')->latestOfMany();
}
```

默认情况下，`latestOfMany` 和 `oldestOfMany` 是通过主键来决定排序的，如果需要通过其他方式排序，例如使用关联人数来排序，可以使用 `ofMany` 方法：

```php
public function maxMemberCountTag(): HasOne
{
    return $this->hasOne(MemberTag::class, 'group_id')->ofMany('member_count', 'MAX');
}
```

对于上面这种已经定义了一对多关系的模型，可以使用 `one` 方法定义 `ofMany`：

```php
public function tags(): HasMany
{
    return $this->hasMany(MemberTag::class, 'group_id');
}

public function maxMemberCountTag(): HasOne
{
    return $this->tags()->one()->ofMany('member_count', 'MAX');
}
```

如果现在需要更复杂的条件，例如需要获取关联人数最少但是要大于 0，同时创建时间最早的关联标签，可以给 `ofMany` 方法传入数组和闭包函数解决：

```php
public function maxMemberCountTag(): HasOne
{
    return $this->tags()->one()->ofMany([
        'member_count' => 'min',
        'created_at' => 'min',
    ], function (Builder $builder) {
        $builder->where('member_count', '>', 0);
    });
}
```

#### Has One Through

此种关系仍然是一对一，但是关联的两个表不是直接关联，而是通过中间表关联的，接下来假设一个用户只能有一个标签，这样 member 表就能通过 member_tag_value 表关联到 member_tag 表（实际上这应该是多对多的关系）。

```php
public function tag(): HasOneThrough
{
    return $this->hasOneThrough(
        MemberTag::class, // 目标模型
        MemberTagValue::class, // 中间模型
        'member_id', // 中间模型与当前模型相关的外键，即 member_tag_value 表上的外键
        'id', // 目标模型上指向中间模型上的键
        'id', // 当前模型上的指向中间模型的键，默认是 id
        'tag_id', // 中间模型上与目标模型关联的键
    );
}
```

#### Has Many Through

这是一种一对多的关系，同样是两张表通过中间表关联，使用 `hasManyThrough` 方法，例如一个用户可以有多个标签：

```php
public function tags(): HasManyThrough
{
    return $this->hasManyThrough(
        MemberTag::class, // 目标模型
        MemberTagValue::class, // 中间模型
        'member_id', // 中间模型与当前模型相关的外键，即 member_tag_value 表上的外键
        'id', // 目标模型上指向中间模型上的键
        'id', // 当前模型上的指向中间模型的键，默认是 id
        'tag_id', // 中间模型上与目标模型关联的键
    );
}
```

#### 多对多

之前的客户和标签就是一个多对多的关系，一个客户可以有多个标签，一个标签也可以关联多个客户。

给 Member 定义多个标签：

```php
public function tags():BelongsToMany
{
    return $this->belongsToMany(
        MemberTag::class,
        'member_tag_value', // 中间表名
        'member_id', // 当前表主键关联的中间表的外键
        'tag_id', // 目标表主键关联的中间表的外键
    );
}
```

此方法第一个参数是要关联的模型，第二个参数是中间表表名，第三个参数是中间表与当前表关联的外键，第四个参数是中间表与要关联的模型相关的外键。

使用：

```php
Route::get('/members/{id}', function (int $id) {
    $member = Member::query()->findOrFail($id);
    return response()->json([
        'memberName' => $member->name,
        'tags' => $member->tags()->orderByDesc('member_count')->get(),
    ]);
});
```

反过来，给 MemberTag 定义多个客户：

```php
public function members():BelongsToMany
{
    return $this->belongsToMany(
        Member::class,
        'member_tag_value',
        'tag_id',
    );
}
```

如果要访问中间表的数据，可以使用 `pivot` 属性，例如要查看每个标签的打标时间：

```php
Route::get('/members/{id}', function (int $id) {
    $tags = Member::query()->findOrFail($id)->tags;
    $result = [];
    foreach ($tags as $tag) {
        $result[] = [
            'name' => $tag->name,
            'taggedAt' => $tag->pivot->updated_at,
        ];
    }
    return response()->json($result);
});
```

::: tip

默认情况下，使用 `pivot` 属性只能访问到用来关联的键列的值，如果需要访问中间表的其他列，需要在定义关联关系时指定 `withPivot` 方法：

```php
public function tags():BelongsToMany
{
    return $this->belongsToMany(
        MemberTag::class,
        'member_tag_value',
        relatedPivotKey: 'tag_id',
    )->withPivot('updated_at');
}
```

对于 `created_at` 和 `updated_at` 列，可以使用 `withTimestamps` 方法：

```php
public function tags():BelongsToMany
{
    return $this->belongsToMany(
        MemberTag::class,
        'member_tag_value',
        relatedPivotKey: 'tag_id',
    )->withTimestamps();
}
```

:::

如果不想通过 `pivot` 而是一个具有详细意义的属性来访问中间表数据，那么可以使用 `as` 方法来定义这样一个属性并替换 `pivot`，例如：

```php
public function tags():BelongsToMany
{
    return $this->belongsToMany(
        MemberTag::class,
        'member_tag_value',
        relatedPivotKey: 'tag_id',
    )->withTimestamps()->as('value');
}
```

调用处：

```php
'taggedAt' => $tag->value->updated_at,
```

如果希望关联中间表时也能进行一些条件限制，可以使用 `xxxPivotXxx` 的方法，例如限制只查询打标时间早于昨天且按打标时间倒序排列：

```php
public function tags():BelongsToMany
{
    return $this->belongsToMany(
        MemberTag::class,
        'member_tag_value',
        relatedPivotKey: 'tag_id',
    )
        ->withTimestamps()
        ->as('value')
        ->wherePivot('updated_at', '>', now()->addDays(-1))
        ->orderByPivot('updated_at', 'desc');
}
```

也可以为中间表也定义一个模型类，这样在 pivot 属性就能访问到这个类的实例，也就可以使用这个类的方法，使用 `using` 方法关联：

```php
public function tags():BelongsToMany
{
    return $this->belongsToMany(
        MemberTag::class,
        'member_tag_value',
        relatedPivotKey: 'tag_id',
    )->using(MemberTagValue::class);
}
```

如果 `belongsToMany` 的第二个参数使用的是类名而不是字符串表名，那么 `using` 方法可以省略：

```php
public function tags():BelongsToMany
{
    return $this->belongsToMany(
        MemberTag::class,
        MemberTagValue::class,
        relatedPivotKey: 'tag_id',
    );
}
```

中间表模型应该继承 `Illuminate\Database\Eloquent\Relations\Pivot` 类：

```php
class MemberTagValue extends Pivot
{
    protected $table = 'member_tag_value';
    public $incrementing = true;

    public function test()
    {
        return 'test';
    }
}
```

同时，如果中间表存在一个自增主键，那么 `$incrementing` 属性应该设置为 `true`。

Pivot 类不能使用软删除，如果需要软删除，那么考虑使用 Model 类。

### 多态映射

TODO:

### 查询

由于关系都是通过方法定义的，因此可以调用这些方法来获取关系实例，而且关系实例本身也可以作为查询构造器，因此也可以进行查询。

例如现在查询一个标签关联的，积分大于 0 的客户：

```php
Route::get('/memberTags/{id}', function (int $id) {
   $tag = MemberTag::query()->findOrFail($id);
   return response()->json([
       'name' => $tag->name,
       'members' => $tag->members()->where('score', '>', 0)->get(),
   ]);
});
```

上面的查询只是限制了关联关系表的条件，如果需要限制主表的条件，例如指向查询具有指定标签的标签组，那么需要通过 `has`、`orHas`、`whereHas`、`orWhereHas` 方法：

```php
Route::get('/tagGroups', function () {
   $searchKey = request()->query('searchKey');
   $query = MemberTagGroup::query();
   if (!empty($searchKey)) {
       $query->where('name', 'LIKE', "%$searchKey%")
           ->orWhereHas('tags', function (Builder $query) use ($searchKey) {
               $query->where('name', 'LIKE', "%$searchKey%");
           });
   }
   return response()->json($query->get());
});
```

对于多对多的场景，例如要查询具有指定标签的客户，也是可以使用上面的方法的，例如：

```php
Route::get('/members', function (Request $request) {
    $params = $request->query();
    $query = Member::query();
    if (isset($params['tags']) && is_array($params['tags'])) {
        $query->whereHas('tags', function (Builder $query) use ($params) {
            $tags = $params['tags'];
            $query->whereIn('member_tag.name', $tags);
        });
    }
    return response()->json($query->get());
});
```

或者使用 `whereAttachedTo` 方法：

```php
Route::get('/members', function (Request $request) {
    $params = $request->query();
    $query = Member::query();
    if (isset($params['tags']) && is_array($params['tags'])) {
        $tags = MemberTag::query()->whereIn('name', $params['tags'])->get();
        $query->whereAttachedTo($tags, 'tags');
    }
    return response()->json($query->get());
});
```

但是这样会多查一步，而且如果符合条件的 tag 过多还可能导致 OOM 等问题。

除了上面的方法外，还可以直接使用 `whereRelation` 方法：

```php
Route::get('/tagGroups', function () {
   $searchKey = request()->query('searchKey');
   $query = MemberTagGroup::query();
   if (!empty($searchKey)) {
       $query->where('name', 'LIKE', "%$searchKey%")
           ->orWhereRelation('tags', 'name', 'LIKE', "%$searchKey%");
   }
   return response()->json($query->get());
});
```

此方法也能接收闭包用于构造复杂条件：

```php
Route::get('/members', function (Request $request) {
    $params = $request->query();
    $query = Member::query();
    if (isset($params['tags']) && is_array($params['tags'])) {
        $query->whereRelation('tags', function (Builder $query) use ($params) {
            $query->whereIn('member_tag.name', $params['tags']);
        });
    }
    return response()->json($query->get());
});
```

上面是查询具有指定标签的客户，如果需要查询不具有指定标签的客户，也就是查询关联中间表中不存在特定条件的记录，那么可以使用 `doesntHave`、`whereDoesntHave` 方法：

```php
Route::get('/members', function (Request $request) {
    $params = $request->query();
    $query = Member::query();
    if (isset($params['excludeTags']) && is_array($params['excludeTags'])) {
        $query->whereDoesntHave('tags', function (Builder $query) use ($params) {
            $query->whereIn('member_tag.name', $params['excludeTags']);
        });
    }
    return response()->json($query->get());
});
```

### 聚合

#### COUNT

有时可能需要统计关联关系中满足条件的数据的数量，例如统计每个标签组所有的标签个数，此时可以使用 `withCount` 方法并通过 `{relation}_count` 属性获取，例如：

```php
Route::get('/tagGroups', function () {
   $groups = MemberTagGroup::query()->withCount('tags')->get();
   $result = [];
   foreach ($groups as $group) {
       $result[] = [
           'name' => $group->name,
           'tagCount' => $group->tags_count,
       ];
   }
   return response()->json($result);
});
```

`withCount` 方法也可以接收数组，同时统计多个关系的数据，也可以起别名：

```php
Route::get('/tagGroups', function () {
   $groups = MemberTagGroup::query()->withCount('tags as tags_count_result')->get();
   $result = [];
   foreach ($groups as $group) {
       $result[] = [
           'name' => $group->name,
           'tagCount' => $group->tags_count_result,
       ];
   }
   return response()->json($result);
});
```

还可以使用闭包构造条件：

```php
Route::get('/tagGroups', function () {
   $groups = MemberTagGroup::query()->withCount(['tags' =>  function (Builder $query){
       $query->where('member_count', '<>', 0);
   }])->get();
   $result = [];
   foreach ($groups as $group) {
       $result[] = [
           'name' => $group->name,
           'tagCount' => $group->tags_count,
       ];
   }
   return response()->json($result);
});
```

如果不使用 `withCount` 方法，那么可以在查询出结果后调用 `loadCount` 方法，此方法用法同 `withCount`：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::query()->find($id);
    $group->loadCount('tags');
    return response()->json(array_merge([
        'name' => $group->tags[0]->group->name,
        'tagsCount' => $group->tags_count,
    ]));
});
```

::: important

如果需要同时使用 `select` 和 `withCount` 方法，那么 `select` 方法必须在 `withCount` 方法之前调用。

:::

#### 其他聚合方法

除了 `withCount` 方法外，还有 `withMin`、`withMax`、`withAvg`、`withSum`、`withExists` 方法，这些方法的结果都可以在查询结果对象上的 `{relation}_{function}_{column}` 属性上获取到，例如现在查询每个标签组中所有的标签关联的客户数，可以使用 `withSum` 方法：

```php
Route::get('/tagGroups', function () {
   $groups = MemberTagGroup::query()->select(['name'])->withSum('tags', 'member_count')->get();
   $result = [];
   foreach ($groups as $group) {
       $result[] = [
           'name' => $group->name,
           'memberCount' => $group->tags_sum_member_count,
       ];
   }
   return response()->json($result);
});
```

这些方法同样有相应的 `load` 方法，同样支持重命名列，例如：

```php
Route::get('/tagGroups/{id}', function (int $id) {
    $group = MemberTagGroup::query()->find($id);
    $group->loadSum('tags as member_count', 'member_count');
    return response()->json(array_merge([
        'name' => $group->tags[0]->group->name,
        'memberCount' => $group->member_count,
    ]));
});
```

### 创建、更新

#### save

现在，如果需要给一个标签组添加一个新标签，可以选择直接操作 member_tag 表同时使用 group_id 关联到某个标签组，Eloquent 提供了更简便的方法，不需要手动设置 group_id，而是直接使用 `save` 方法创建一个标签：

```php
Route::post('/memberTags', function (Request $request) {
    $request->validate([
        'name' => 'required',
        'groupId' => 'required',
    ]);
    $group = MemberTagGroup::query()->findOrFail($request->input('groupId'));
    $tag = new MemberTag();
    $tag->name = $request->input('name');
    $result = $group->tags()->save($tag);
    return response()->json($result);
});
```

如果想覆盖所有关联的数据，可以使用 `push` 方法：

```php
Route::post('/memberTags', function (Request $request) {
    $request->validate([
        'name' => 'required',
        'groupId' => 'required',
    ]);
    $group = MemberTagGroup::query()->findOrFail($request->input('groupId'));
    $group->tags[0]->name = $request->input('name');
    $result = $group->push();
    return response()->json($result);
});
```

#### create

`create` 方法用法与 `save` 类似，区别在于 `save` 方法接收一个 Model 实例，而 `create` 方法接收一个数组。`create` 方法同样会返回创建的结果。

::: tip

与非关系的 `create` 用法一样，调用前需要确保模型已经定义了 `fillable` 属性或将 `guarded` 属性设置为空数组。

:::

#### 归属关系

如果想反过来，即通过子模型创建父模型，例如创建一个标签并关联到一个标签组，可以使用 `associate` 方法：

```php
$group = MemberTagGroup::query()->findOrFail($request->input('groupId'));
$tag = new MemberTag();
$tag->name = $request->input('name');
$tag->group()->associate($group);
$result = $tag->save();
```

如果希望移除关联关系，可以使用 `dissociate` 方法：

```php
$tag->group()->disassociate();
```

#### 多对多

现在需要给一个 member 打标签，可以使用 `attach` 方法：

```php
Route::put('/members/{id}/tags', function (int $id, Request $request) {
   $request->validate([
       'tagIds' => 'required|array',
   ]);
   $member = Member::query()->findOrFail($id);
   $member->tags()->attach($request->input('tagIds'));
   return response()->json($member->tags);
});
```

如果又需要从一个 member 中移除部分标签，可以使用 `detach` 方法：

```php
Route::delete('/members/{id}/tags', function (int $id, Request $request) {
    $request->validate([
        'tagIds' => 'required|array',
    ]);
    $member = Member::query()->findOrFail($id);
    $member->tags()->detach($request->input('tagIds'));
    return response()->json($member->tags);
});
```

::: tip

如果 `detach` 方法参数为空，那么将删除所有的中间表关联数据。

:::

如果希望全量覆盖，可以使用 `sync` 方法：

```php
Route::put('/members/{id}/tags', function (int $id, Request $request) {
   $request->validate([
       'tagIds' => 'required|array',
   ]);
   $member = Member::query()->findOrFail($id);
   $member->tags()->sync($request->input('tagIds'));
   return response()->json($member->tags);
});
```

如果希望全量覆盖时不删除没有在指定数组里的数据，可以使用 `syncWithoutDetaching` 方法：

```php
$member->tags()->syncWithoutDetaching($request->input('tagIds'));
```

此外 Eloquent 还提供了 `toggle` 方法，用法类似 `sync`，当给定的关联关系不存在时将会创建这些关系，当给定的关联关系存在时将会删除这些关系。

如果希望更新一个中间表的数据，可以使用 `updateExistingPivot` 方法：

```php
Route::delete('/members/{id}/tags', function (int $id, Request $request) {
    $request->validate([
        'tagIds' => 'required|array',
    ]);
    $member = Member::query()->findOrFail($id);
    $member->tags()->updateExistingPivot($request->input('tagIds'), ['deleted_at' => now()]);
    return response()->json($member->tags);
});
```

当更新子关联表时，如果希望更新父级关联表的 `updated_at`，可以在模型类中通过 `touches` 属性指定关联关系：

```php
class MemberTag extends Model
{
    protected $touches = ['group'];

    public function group(): BelongsTo
    {
        return $this->belongsTo(MemberTagGroup::class);
    }
}
```

### 预加载

默认情况下，关联关系只有在被访问时才会从数据库中加载，对于循环访问一个数组中的关联关系时，会产生 N 次查询，如果希望一开始就查询出所有的关联关系，可以使用 `with` 方法：

```php
Route::get('/members', function (Request $request) {
    $members = Member::with(['tags'])->get();
    $result = [];
    foreach ($members as $member) {
        $result[] = [
            'name' => $member->name,
            'tags' => $member->tags,
        ];
    }
    return response()->json($result);
});
```

`with` 方法中的关系也可以通过闭包指定查询条件：

```php
use Illuminate\Contracts\Database\Eloquent\Builder;

Route::get('/members', function (Request $request) {
    $members = Member::with(['tags' => function (Builder $query) {
        $query->where('member_count', '>', 2);
    }])->get();
    $result = [];
    foreach ($members as $member) {
        $result[] = [
            'name' => $member->name,
            'tags' => $member->tags,
        ];
    }
    return response()->json($result);
});
```

除了使用 `with` 方法，也可以使用 `load` 方法：

```php
$members = Member::all();
$members->load(['tags' => function (Builder $query) {
    $query->where('member_count', '>', 2);
}]);
```

使用 `loadMissing` 方法可以只预加载还没加载的关联关系。

如果希望一个模型能始终加载某个关联关系，可以在这个模型类中通过 `$with` 属性指定这个关联关系：

```php
class Member extends Model
{
    protected $table = 'member';

    protected $with = ['tags'];
}
```

这种情况下，如果某次查询希望不加载关联关系，可以使用 `without` 方法：

```php
$members = Member::query()->without(['tags'])->get();
```

如果希望所有的模型都能自动加载关联关系，那么可以在 AppServiceProvider 的 `boot` 方法中开启自动预加载：

```php
use Illuminate\Database\Eloquent\Model;
public function boot(): void
{
    Model::automaticallyEagerLoadRelationships();
}
```

## 访问器与类型转换

### 访问器

访问器会在访问模型属性时对其进行转换，要定义一个访问器，可以在模型上创建一个方法，方法名应该是对应属性的驼峰命名，例如给 Member 定义一个 name 访问器：

```php
protected function name(): Attribute
{
    return Attribute::make(
        get: fn(string $value) => ucfirst($value),
    );
}
```

所有的访问器方法都返回一个 `Attribute` 实例，这个实例定义了如何访问和修改属性。传递给 `get` 属性的闭包方法还有第二个参数，用于接收当前表中的属性值：

```php
protected function name(): Attribute
{
    return Attribute::make(
        get: fn(string $value, array $attributes) => $attributes,
    );
}
```

向 `Attribute::make` 方法的 `set` 属性传递一个闭包，这个闭包会在为对应属性赋值时被调用，例如：

```php
protected function name(): Attribute
{
    return Attribute::make(
        get: fn(string $value, array $attributes) => $attributes,
        set: fn(string $value) => strtolower($value),
    );
}
```

### 类型转换

通过在模型类中定义一个 `casts` 方法或属性（返回数组），即可指定不同字段的类型转换，例如 member_address 表中有一个布尔字段 is_default，这个字段在数据库中存储的是 1 或 0，并且查询时也会被解析为整型，下面通过 `casts` 将这个字段转为布尔类型：

```php
class MemberAddress extends Model
{
    protected $table = 'member_address';

    protected $casts = [
        'is_default' => 'boolean',
    ];
}
```

如果需要运行时添加新的转换规则，可以使用 `mergeCasts` 方法：

```php
Route::get('/memberAddresses', function () {
    $address = MemberAddress::all();
    $result = [];
    foreach ($address as $item) {
        $item->mergeCasts([
            'is_default' => 'boolean',
        ]);
        $result[] = [
            'isDefault' => $item->is_default,
            'is_bool' => is_bool($item->is_default),
        ];
    }
    return response()->json($result);
});
```

::: important

值为 null 的属性不会进行类型转换，而且不应该为关系和主键定义转换。

:::

可选的转换规则：[casts](https://laravel.com/docs/12.x/eloquent-mutators#attribute-casting)。

如果一个属性在数据库中是以 JSON 或 TEXT 类型存储的且包含序列化的 JSON，那么可以将这个属性转为 `array` 或者 `AsArrayObject`，在访问该属性时 Eloquent 会自动反序列化，修改属性后会自动序列化。

枚举转换：

TODO：

### 自定义类型转换

TODO：

## 工厂

本地测试场景中，经常需要生成一些测试数据，使用模型工厂可以方便的批量生成测试数据。

### 创建工厂

使用 `make:factory` 命令可以创建一个模型工厂：

```shell
php artisan make:factory MemberFactory
```

定义的模型工厂会保存在 `database/factories` 目录下。当为一个模型定义了对应的模型工厂时，只要在模型上使用 `HasFactory` trait 即可使用 `factory` 静态方法实例化一个工厂：

```php
class MemberTag extends Model
{
    use HasFactory;
}
```

默认情况下，模型对应的工厂的匹配规则是在 `Database\Factories` 命名空间内使用 `{ModelName}Factory` 尝试匹配一个类，如果希望自定义这个行为，可以重写模型类上的 `newFactory` 方法并直接返回指定的工厂类实例：

```php
class ProductSku extends Model
{
    use HasFactory;

    protected $table = 'product_sku';

    protected static function newFactory()
    {
        return ProductSkuFactory::new();
    }
}
```

然后在工厂类上使用 `$model` 属性设置关联的模型类：

```php
protected $model = MemberTag::class;
```

### 使用工厂创建数据

在工厂类的 `definition` 方法中可以定义数据的赋值规则：

```php
class MemberTagFactory extends Factory
{

    protected $model = MemberTag::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->colorName(),
        ];
    }
}
```

使用 `make` 方法可以创建数据，使用 `create` 方法可以创建并持久化：

```php
MemberTag::factory()->count(fake()->randomDigitNotZero())->create();
```

在使用 `make` 或 `create` 方法时，可以传入一个数组来覆盖属性值。

::: tip

使用工厂创建模型时，批量赋值保护将被禁用，所有的属性都可以赋值。

:::

批量创建模型时，可能希望每个创建的模型的一个属性值交替出现，使用 `sequence` 方法可以实现，例如为每个 member 创建两个地址，一个设置为默认地址，另一个是普通地址：

```php
class MemberSeeder extends Seeder
{
    public function run(): void
    {
        Member::factory()
            ->count(20)
            ->hasAttached(MemberTag::query()->inRandomOrder()->limit(3)->get(), relationship: 'tags')
            ->has(MemberAddress::factory()->count(2)->sequence(
                ['is_default' => true],
                ['is_default' => false]
            ), 'address')
            ->create();
    }
}
```

### 工厂与映射关系

#### 一对多

使用工厂构造链上的 `has` 方法可以为当前当前模型创建关联数据，例如为创建商品时同步创建商品的属性：

```php
class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()
            ->has(ProductProperty::factory()->count(fake()->randomElement([2, 3])), 'properties')
            ->count(10)
            ->create();
    }
}
```

此方法的第二个参数是关系的名字，也就是在模型中定义的关系方法的名称，如果关系名无法被默认推断，可以通过这个参数指定。

#### 归属

如果希望从子模型创建父模型，可以在构造子模型时使用 `for` 方法：

```php
class MemberTagSeeder extends Seeder
{
    public function run(): void
    {
        $groups = MemberTagGroup::all();
        $groups->each(function ($group) {
           MemberTag::factory()->for($group, 'group')->count(fake()->randomDigitNotZero())->create();
        });
    }
}
```

`for` 方法既可以接收工厂构造链，也可以将已有的模型实例传入，如果传入构造链那么构造链的结果也会被创建，同样可以使用第二个参数指定关系名。

#### 多对多

与一对多类似，还是使用 `has` 方法即可同时创建多对多关系的中间表数据：

```php
Member::factory()
    ->count(20)
    ->hasAttached(MemberTag::query()->inRandomOrder()->limit(3)->get(), relationship: 'tags')
    ->has(MemberAddress::factory()->count(2)->sequence(
        ['is_default' => true],
        ['is_default' => false]
    ), 'address')
    ->create();
```

`has` 方法只能传入构造链，不能传入实例，如果需要传入实例，请使用 `hasAttached` 方法。

#### 内部关系

在归属的场景下，可以在 `definition` 方法中定义内部关系：

```php
public function definition(): array
{
    return [
        'name' => fake()->unique()->colorName(),
        'group_id' => MemberTagGroup::factory(),
    ];
}
```

## 序列化

使用 `toArray` 方法可以将模型和关联的关系转为数组，使用 `attributesToArray` 方法也能将模型转为数组，但是不包含关联关系。

使用 `toJson` 方法可以将模型和关联关系转为 JSON 字符串，在 Laravel 路由中返回模型对象时，Laravel 会自动将它们序列化为 JSON。

::: tip

尽管关联关系在模型类中是以小驼峰命名的，但是在 JSON 序列化后，关联关系的属性名将使用蛇形命名。

:::

有时可能希望返回的 JSON 中不包含一些字段，例如密码等，可以通过在模型类中定义 `hidden` 属性来指定隐藏的字段：

```php
class Member extends Model
{
    use HasFactory;

    protected $table = 'member';

    protected $hidden = ['deleted_at'];
}
```

关系同样也能隐藏，例如：

```php
class Member extends Model
{
    use HasFactory;

    protected $table = 'member';

    protected $with = ['addresses'];

    protected $hidden = ['deleted_at', 'addresses'];

    public function addresses(): HasMany
    {
        return $this->hasMany(MemberAddress::class);
    }
}
```

或者反过来，通过 `visible` 属性来指定包含的字段，用法同 `hidden`。

如果需要临时设置可见性，可以使用 `makeHidden` 或 `setHidden` 方法，后者将覆盖模型上的 `hidden` 属性：

```php
Route::get('/members', function () {
    return Member::all()->makeHidden(['deleted_at']);
});
```

这两个方法同样有对应的方法，`makeVisible` 和 `setVisible`。

通过重写 `serializeDate` 方法可以设置日期的序列化格式：

```php
protected function serializeDate(DateTimeInterface $date)
{
    return $date->format(DateTimeInterface::RFC3339);
}
```

要指定日期的序列化格式，还可以使用之前的 `casts` 方法设置。
