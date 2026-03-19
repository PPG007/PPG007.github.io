# 数据库

## 快速开始

Laravel 中的数据库配置都保存在 `config/database.php` 文件中，这个文件中的参数都可以通过 `.env` 文件来配置。

Laravel 默认提供了一个 `User` 表的 Seed 文件用来初始化一些数据，使用 `php artisan db:seed` 命令可以运行这个 Seed 文件。

### 执行查询

基础查询：

```php
<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
   $users = DB::select('SELECT * FROM users');
   return response()->json($users);
});
```

在需要动态构建 SQL 时，需要使用第二个参数传入一个数组来替换 SQL 中的占位符：

```php
Route::get('/users/{id}', function (int $id) {
    $user = DB::selectOne('SELECT * FROM users WHERE id = ?', [$id]);
    if (!$user) {
        abort(404, 'user not found');
    }
    return response()->json($user);
});
```

除了使用 `?` 作占位符之外，也可以使用命名占位符，例如：

```php
$user = DB::selectOne('SELECT * FROM users WHERE id = :idParam', ['idParam' => $id]);
```

使用 `insert` 方法可以插入数据：

```php
Route::post('/users', function (Request $request) {
    $params = $request->input();
    $success = DB::insert(
        'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)',
        $params,
    );
    return response()->json([
        'success' => $success,
    ]);
});
```

使用 `update` 方法可以更新数据：

```php
Route::put('/users/{id}', function (int $id, Request $request) {
    $updatedCount = DB::update('UPDATE users SET name = :name WHERE id = :id', ['name' => $request->input('name'), 'id' => $id]);
    return response()->json([
        'updatedCount' => $updatedCount,
    ]);
});
```

使用 `delete` 方法可以删除数据：

```php
Route::delete('/users/{id}', function (int $id) {
    $deletedCount = DB::delete('DELETE FROM users WHERE id = :idParam', ['idParam' => $id]);
    return response()->json([
        'deletedCount' => $deletedCount,
    ]);
});
```

有的语句不返回任何值，可以使用 `statement` 来执行这类操作：

```php
DB::statement('DROP TABLE users');
```

`statement` 允许使用占位符，如果一条语句一个占位符也没有那么可以使用 `unprepared` 来执行，但是要注意此方法容易受到 SQL 注入攻击。

### 查询监听

使用 `listen` 方法可以注册一个查询监听回调，这个回调将会在执行每个 SQL 查询时被调用，可以在 Service Provider 的 `boot` 方法中注册：

```php
public function boot(): void
{
    DB::listen(function (QueryExecuted $query) {
        Log::info('running sql query', [
            'sql' => $query->sql,
        ]);
    });
}
```

使用 `whenQueryingForLongerThan` 方法可以注册一个查询监听回调，这个回调将会在执行超过指定时间长度的 SQL 查询时被调用：

```php
public function boot(): void
{
    DB::whenQueryingForLongerThan(1000, function (Connection $conn ,QueryExecuted $query) {
        Log::info("Query took too long: " . $query->sql);
    });
}
```

### 事务

使用 `transaction` 方法可以执行一个事务，如果事务闭包内抛出异常事务将回滚，反之则事务将提交，使用此方法时不需要手动控制回滚和提交。

```php
Route::delete('/users/{id}', function (int $id) {
    DB::transaction(function () use ($id) {
        DB::delete('DELETE FROM users WHERE id = :idParam', ['idParam' => $id]);
        throw new Exception('demo');
    });
});
```

`transaction` 方法可以接收第二个参数作为最大重试次数，如果重试次数超出限制将抛出异常。

如果想完全手动控制事务，可以使用 `beginTransaction` 开启事务，`rollback` 回滚事务，`commit` 提交事务：

```php
Route::delete('/users/{id}', function (int $id) {
    DB::beginTransaction();
    DB::delete('DELETE FROM users WHERE id = :idParam', ['idParam' => $id]);
    $count = DB::scalar('SELECT COUNT(*) FROM users');
    Log::info('count', ['count' => $count]);
    if ($count === 0) {
        DB::rollBack();
    } else {
        DB::commit();
    }
});
```

## 迁移

Laravel 中提供了 `Schema` 类来创建和修改数据库表结构，这些表结构保存在 `database/migrations` 目录下，这样即可管理数据库表结构。

### 生成迁移文件

使用 `make:migration` 命令即可生成迁移文件，如：

```shell
php artisan make:migration member
```

### 迁移结构

每个迁移类都包含两个方法：`up` 和 `down`，`up` 用于向数据库中添加新表、列或者索引，`down` 方法用来撤销 `up` 方法所执行的操作。

除了上面的两个方法之外，还可以定义一个 `public function shouldRun(): bool` 方法，当此方法返回 false 时，迁移类将不会被执行。

### 运行迁移

要运行所有未完成的迁移，需要执行 `migrate` 命令：

```shell
php artisan migrate
```

如果想查看已完成的迁移，可以使用 `migrate:status` 命令：

```shell
php artisan migrate:status
```

如果想查看迁移将执行的 SQL 但又不想运行迁移，可以为 `migrate` 命令添加 `--pretend` 选项：

```shell
php artisan migrate --pretend
```

在集群环境下，通常会存在若干个应用程序实例，每个实例如果都要执行迁移那么会有并发问题，为了避免这种情况，可以使用隔离选项：

```shell
php artisan migrate --isolated
```

这将使得应用程序在执行一个迁移之前会使用分布式锁，要使用此功能，所有的应用程序都需要连接到同一个 redis 等缓存服务器。

### 回滚迁移

使用 `migrate:rollback` 命令可以回滚最近一次迁移：

```shell
php artisan migrate:rollback
```

### 表结构

使用 `Schema::table` 方法可以创建和更新数据库表结构，这个方法的第二个参数接收一个闭包函数，在此函数中可以定义列和索引等，

例如，接下来要定义一个简易的带有商城功能的非多租户的 CRM 系统的表结构，分为多个表：

会员相关：

::: code-tabs#schema-member

@tab create_member.php

```php
public function up(): void
{
    Schema::create('member', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->string('name')->nullable();
        $table->string('phone')->unique()->nullable();
        $table->integer('score')->default(0);
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
}
```

@tab create_member_address.php

```php
public function up(): void
{
    Schema::create('member_address', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->boolean('isDefault')->default(false);
        $table->string('phone');
        $table->string('province');
        $table->string('city');
        $table->string('district');
        $table->text('detail');
        $table->foreignId('member_id')->constrained('member');
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->boolean('is_deleted')->default(false);
        $table->double('latitude');
        $table->double('longitude');
    });
}
```

@tab create_member_tag_group.php

```php
public function up(): void
{
    Schema::create('member_tag_group', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->string('name');
        $table->boolean('is_deleted')->default(false);
        $table->unique(['name', 'is_deleted']);
    });
}
```

@tab create_member_tag.php

```php
public function up(): void
{
    Schema::create('member_tag', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->string('name');
        $table->boolean('is_deleted')->default(false);
        $table->integer('member_count')->default(0);
        $table->unique(['name', 'is_deleted']);
        $table->foreignId('group_id')->constrained('member_tag_group');
    });
}
```

@tab create_member_tag_value.php

```php
public function up(): void
{
    Schema::create('member_tag_value', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->foreignId('member_id')->constrained('member');
        $table->string('name');
        $table->foreignId('tag_id')->constrained('member_tag');
        $table->boolean('is_deleted')->default(false);
        $table->unique(['member_id', 'tag_id', 'is_deleted']);
    });
}
```

@tab create_score_history.php

```php
public function up(): void
{
    Schema::create('score_history', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->integer('increment');
        $table->timestamp('expired_at');
        $table->integer('remaining_score');
        $table->text('description');
        $table->foreignId('member_id')->constrained('member');
    });
}
```

@tab create_score_history_log.php

```php
public function up(): void
{
    Schema::create('score_history_log', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->foreignId('history_id')->constrained('score_history');
        $table->foreignId('change_history_id')->constrained('score_history');
        $table->integer('increment');
        $table->integer('origin_score');
    });
}
```

:::

订单、商品相关：

::: code-tabs#schema-order

@tab create_product.php

```php
public function up(): void
{
    Schema::create('product', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->boolean('is_deleted')->default(false);
        $table->string('name');
        $table->integer('sales');
        $table->integer('lowest_price');
        $table->enum('shelved_status', ['shelved', 'unshelved']);
    });
}
```

@tab create_product_sku.php

```php
public function up(): void
{
    Schema::create('product_sku', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->integer('stock')->default(0);
        $table->integer('price');
        $table->string('sku')->unique();
        $table->text('description');
        $table->foreignId('product_id')->constrained('product');
    });
}
```

@tab create_order.php

```php
public function up(): void
{
    Schema::create('order', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->string('number')->unique();
        $table->timestamp('paid_at');
        $table->timestamp('completed_at');
        $table->integer('total_amount');
        $table->integer('pay_amount');
        $table->enum('status', ['unpaid', 'paid', 'shipped', 'completed', 'canceled']);
        $table->text('remarks');
    });
}
```

@tab create_order_product.php

```php
public function up(): void
{
    Schema::create('order_product', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->foreignId('product_id')->constrained('product');
        $table->integer('total');
        $table->integer('price');
        $table->integer('total_amount');
        $table->integer('pay_amount');
        $table->string('out_trade_id')->unique();
        $table->string('sku');
        $table->foreignId('sku_id')->constrained('product_sku');
        $table->foreignId('order_id')->constrained('order');
        $table->enum('refund_status', ['pending', 'refunded', 'canceled', 'failed']);
    });
}
```

@tab create_order_log.php

```php
public function up(): void
{
    Schema::create('order_log', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->enum('status', ['unpaid', 'paid', 'shipped', 'completed', 'canceled']);
        $table->foreignId('order_id')->constrained('order');
    });
}
```

@tab create_order_contact.php

```php
public function up(): void
{
    Schema::create('order_contact', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->foreignId('order_id')->constrained('order');
        $table->foreignId('address_id')->constrained('member_address');
        $table->string('name');
        $table->string('phone');
        $table->string('province');
        $table->string('city');
        $table->string('district');
        $table->string('detail');
        $table->double('longitude');
        $table->double('latitude');
    });
}
```

@tab create_refund_order.php

```php
public function up(): void
{
    Schema::create('refund_order', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->foreignId('order_id')->constrained('order');
        $table->string('number')->unique();
        $table->integer('refund_amount');
        $table->text('reason');
        $table->enum('status', ['pending', 'refunded', 'canceled', 'failed']);
    });
}
```

@tab create_refund_order_product.php

```php
public function up(): void
{
    Schema::create('refund_order_product', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->foreignId('refund_id')->constrained('refund_order');
        $table->integer('total');
        $table->integer('price');
        $table->integer('pay_amount');
        $table->integer('refund_amount');
        $table->string('out_trade_id')->unique();
        $table->string('sku');
        $table->foreignId('sku_id')->constrained('product_sku');
    });
}
```

@tab create_refund_order_log.php

```php
public function up(): void
{
    Schema::create('refund_order_log', function (Blueprint $table) {
        $table->bigIncrements('id')->primary();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        $table->foreignId('refund_id')->constrained('refund_order');
        $table->enum('status', ['pending', 'refunded', 'canceled', 'failed']);
    });
}
```

:::

具体的可用列类型参考：[Column Types](https://laravel.com/docs/12.x/migrations#available-column-types)。

### 事件

TODO:

## 数据填充

Laravel 提供了数据种子填充功能，所有的种子类都存在 `database/seeders` 目录中，Laravel 默认会创建一个 `DatabaseSeeder` 类，这个类中的 `call` 方法可以用来运行其他种子类并控制数据填充的顺序。

### 编写种子类

使用 `make:seeder` 命令可以创建一个种子类：

```shell
php artisan make:seeder MemberTagGroupSeeder
```

每个种子类都包含一个 `run` 方法，在执行种子数据填充时，此方法会被调用，因此在这个方法中可以构造 mock 数据，例如生成若干个标签组：

```php
public function run(): void
{
    for ($i = 0; $i < 10; $i++) {
        DB::table('member_tag_group')->insert([
            'name' => fake()->streetName(),
        ]);
    }
}
```

::: tip

`run` 方法也可以通过类型提示来注入依赖。

:::

此外，还可以使用 `call` 方法将多个种子类放在一起运行：

```php
public function run(): void
{
        $this->call([
            MemberTagGroupSeeder::class,
            MemberTagSeeder::class,
        ]);
}
```

### 运行种子填充

使用 `db:seed` 命令来运行种子数据填充：

```shell
php artisan db:seed
```

通过 `--class` 选项来指定要运行的种子类：

```shell
php artisan db:seed --class=UserSeeder
```

## 查询构造器

Laravel 的数据库查询构造器为创建和运行数据库查询提供了一个便捷、流畅的接口，Laravel 查询构造器使用 PDO 参数绑定来保护应用程序免受 SQL 注入攻击。

::: important

PDO 不支持动态绑定列名，因此不应该允许使用用户输入的参数作为查询的列名，也不能用作排序字段的列名。

:::

### 执行查询

使用 `table` 方法可以创建一个查询构造器，使用这个构造器可以链式构建 SQL，并最终通过 `get` 方法执行查询：

```php
Route::get('/users', function () {
   $users = DB::table('users')->get();
   return response()->json($users);
});
```

`get` 方法会返回一个 `Illuminate\Support\Collection` 实例。

如果只需要返回一个记录而不是数组，可以使用 `first` 或 `firstOrFail` 方法，后者将会在查询不到时抛出 `Illuminate\Database\RecordNotFoundException`，如果不处理这个异常，Laravel 会将 404 状态码返回给客户端：

```php
Route::get('/users/{id}', function (int $id) {
    $user = DB::table('users')->where('id', $id)->firstOrFail();
    if (!$user) {
        abort(404, 'user not found');
    }
    return response()->json($user);
});
```

如果不需要查询所有的列，可以在上面的方法中指定列名：

```php
$user = DB::table('users')->where('id', $id)->firstOrFail(['id', 'name', 'email']);
```

如果只需要查询某一列且不需要返回整个对象，可以使用 `value` 方法：

```php
$user = DB::table('users')->where('id', $id)->value('email');
```

如果是只根据 id 列查询，那么可以使用 `find` 方法：

```php
$user = DB::table('users')->find($id);
```

如果需要查询多个记录的某一列的值并作为一个数组，可以使用 `pluck` 方法：

```php
Route::get('/users', function () {
   return response()->json([
       'names' => DB::table('users')->pluck('name'),
   ]);
});
```

#### 分片

如果需要遍历大量数据，可以使用 `chunk` 方法，此方法每次查询一部分结果并传入到闭包中处理，如果闭包返回 false，那么查询将停止：

```php
Route::get('/users', function () {
   $names = [];
   DB::table('users')->orderBy('id', 'desc')->chunk(10, function (Collection $users) use (&$names) {
       $users->each(function ($user) use (&$names) {
           $names[] = $user->name;
       });
   });
   return $names;
});
```

::: tip

使用 `chunk` 方法时必须指定排序字段。

:::

如果在分块结果时更新数据库记录，分块结果可能会以意想不到的方式发生变化。如果计划在分块时更新检索到的记录，最好使用 `chunkById` 方法。此方法将根据记录的主键自动对结果进行分页。在分块回调函数中更新或删除记录时，主键或外键的任何更改都可能影响分块查询。这可能会导致某些记录未包含在分块结果中。

#### 懒加载

`lazy` 方法与 `chunk` 方法类似，都是以分块的方式执行查询。然而，`lazy()` 方法不会将每个分块传递给回调函数，而是返回一个 `LazyCollection`，让你可以将结果作为单个流进行交互：

```php
Route::get('/users', function () {
   $names = [];
   DB::table('users')->orderBy('id', 'desc')->lazy()->each(function ($user) use (&$names) {
       $names[] = $user->name;
   });
   return $names;
});
```

::: tip

`lazy` 方法同样需要指定排序字段。

:::

类似 `chunk` 方法，如果在 `lazy` 遍历过程中需要修改数据，那么最好使用 `lazyById` 或者 `lazyByIdDesc` 方法。

#### 聚合

查询构建器还提供了多种方法来检索聚合值，如 count、max、min、avg 和 sum。在构建查询后，可以调用这些方法中的任何一个：

```php
Route::get('/users', function () {
   $table = DB::table('users');
   return response()->json([
       'items' => $table->get(),
       'total' => $table->count(),
   ]);
});
```

此外还可以使用 `exists` 方法和 `doesntExist` 方法来检查给定查询是否返回任何结果：

```php
Route::get('/users/{id}', function (int $id) {
    $query = DB::table('users')->where('id', $id);
    if ($query->doesntExist()) {
        abort(404, 'user not found');
    }
    return response()->json($query->first());
});
```

### 选择语句

使用 `select` 方法可以指定要选择的字段：

```php
Route::get('/users', function () {
   $table = DB::table('users');
   return response()->json([
       'items' => $table->select('name', 'email as user_email')->get(),
       'total' => $table->count(),
   ]);
});
```

如果想向一个已有 select 语句的查询构造器中添加字段，可以使用 `addSelect` 方法：

```php
Route::get('/users', function () {
   $table = DB::table('users')->select('name');
   return response()->json([
       'items' => $table->addSelect('email as email_address')->get(),
       'total' => $table->count(),
   ]);
});
```

### 原生 SQL 表达式

有时可能需要使用原生 SQL 表达式，可以使用 `raw` 方法：

```php
Route::get('/users', function (Request $request) {
    $table = DB::table('users')->select(DB::raw('name as user_name'));
    return response()->json([
       'items' => $table->get(),
       'total' => $table->count(),
    ]);
});
```

::: danger

原生表达式将被作为字符串添加到 SQL 中，所以需要自己防范 SQL 注入。

:::

除了使用 `DB::raw()` 方法外，还可以使用 `selectRaw`、`whereRaw`、`orWhereRaw`、`havingRaw`、`orHavingRaw`、`orderByRaw`、`groupByRaw` 等方法。

### 连接查询

#### Inner Join

使用 `join` 方法可以构造内连接，此方法的第一个参数为要连接的表明，其余参数为连接条件，例如，查询具有 "Sammie Mountain" 这个标签的 member：

```php
Route::get('/members', function (Request $request) {
   $result = DB::table('member')
       ->join('member_tag_value', 'member.id', '=', 'member_tag_value.member_id')
       ->selectRaw('member.name as name, member.id as id')
       ->where('member_tag_value.name', '=', 'Sammie Mountain')
       ->get();
   return response()->json($result);
});
```

又或者查询具有 "Albina Mews" 标签组的任一标签的 member：

```php
Route::get('/members', function (Request $request) {
   $result = DB::table('member')
       ->join('member_tag_value', 'member.id', '=', 'member_tag_value.member_id')
       ->join('member_tag', 'member_tag.id', '=', 'member_tag_value.tag_id')
       ->join('member_tag_group', 'member_tag_group.id', '=', 'member_tag.group_id')
       ->selectRaw('member.*, member_tag_group.name as group_name, member_tag.name as tag_name')
       ->where('member_tag_group.name', '=', 'Albina Mews')
       ->get();
   return response()->json($result);
});
```

#### Left Join & Right Join

使用 `leftJoin` 和 `rightJoin` 方法可以构造左连接和右连接，用法与内连接相同，例如使用左连接统计每个 member 的标签数量：

```php
Route::get('/members', function (Request $request) {
   $result = DB::table('member')
       ->leftJoin('member_tag_value', 'member.id', '=', 'member_tag_value.member_id')
       ->groupBy('member.id')
       ->selectRaw('member.*, COUNT(*) as count')
       ->get();
   return response()->json($result);
});
```

#### 连接查询构造闭包

`join` 方法中除了使用字符串指定连接条件外，还可以使用闭包来指定连接条件：

```php
->leftJoin('member_tag_value', function (JoinClause $join) {
    $join->on('member_tag_value.member_id', '=', 'member.id');
})
```

#### 子查询 JOIN

有时需要比较复杂的 JOIN，需要使用子查询，这种情况下可以使用 `joinSub`、`leftJoinSub`、`rightJoinSub` 方法，例如统计每个标签组中所属标签关联的客户数：

```php
Route::get('/members', function (Request $request) {
    $memberTagValue = DB::table('member')
        ->leftJoin('member_tag_value', 'member.id', '=', 'member_tag_value.member_id')
        ->leftJoin('member_tag', 'member_tag.id', '=', 'member_tag_value.tag_id')
        ->select(['member.id', 'member_tag_value.name', 'member_tag_value.tag_id', 'member_tag.group_id']);
    $result = DB::table('member_tag_group')
        ->joinSub($memberTagValue, 'member_tag_stats', function (JoinClause $join) {
            $join->on('member_tag_stats.group_id', '=', 'member_tag_group.id');
        })
        ->selectRaw('member_tag_group.name, COUNT(DISTINCT member_tag_stats.id) as count')
        ->groupBy('member_tag_group.id')
        ->orderBy('count')
        ->get();
   return response()->json($result);
});
```

### UNION

```php
Route::get('/members', function (Request $request) {
    $tags = DB::table('member_tag')->select(['name']);
    $result = DB::table('member_tag_group')->select(['name'])->union($tags)->get();
   return response()->json($result);
});
```

关于 UNION 查询：[UNION](/sql/docs/select.html#union)

### WHERE 条件子句

基础用法：

```php
Route::get('/members', function (Request $request) {
    $result = DB::table('member')->where('score', '<>', 0)->get();
   return response()->json($result);
});
```

当 WHERE 子句中的操作符是 `=` 时，可以不写操作符：

```php
$result = DB::table('member')->where('score', 0)->get();
```

还可以传入一个数组，这个数组中包含若干个数组，每个数组又是一个条件：

```php
Route::get('/members', function (Request $request) {
    $params = $request->query();
    $conditions = [];
    if (isset($params['name'])) {
        $conditions[] = ['name', 'LIKE', '%'.$params['name'].'%'];
    }
    if (isset($params['phone'])) {
        $conditions[] = ['phone', $params['phone']];
    }
    $query = DB::table('member');
    if (count($conditions)) {
        $query->where($conditions);
    }
    return response()->json($query->get());
});
```

如果希望多个条件之间是 OR 关系，可以使用 `orWhere` 方法：

```php
if (count($conditions)) {
    $query->orWhere($conditions);
}
```

如果当前有三个条件 A、B、C，如果希望实现 A OR (B AND C)，那么 `orWhere` 中应该使用闭包来构造条件：

```php
$query = DB::table('member')->where('score', '>', 0);
if (count($conditions)) {
    $query->orWhere(function (Builder $builder) use ($conditions) {
        $builder->where($conditions);
    });
}
```

使用 `whereNot` 或 `orWhereNot` 方法可以构造 NOT 条件：

```php
$query = DB::table('member')->whereNot('score', 0);
```

也可以使用闭包构造嵌套的条件：

```php
$query = DB::table('member')->whereNot(function (Builder $query) {
    $query->where('score', '>', 0)
        ->where('score', '<', 100);
});
```

对应的 SQL 语句为：

```sql
SELECT * FROM `member` WHERE NOT (`score` > 0 AND `score` < 100)
```

`orWhereNot`：

```php
$query = DB::table('member')->where('score', '<', 0)->orWhereNot(function (Builder $query) {
    $query->where('score', '>', 0)
        ->where('score', '<', 100);
});
```

对应的 SQL 语句为：

```sql
SELECT * FROM `member` WHERE `score` < 0 OR NOT (`score` > 0 AND `score` < 100)
```

有时可能需要在多个不同的列上使用同一个条件，这时可以使用 `whereAll`、`whereAny`、`whereNone` 方法：

```php
$query = DB::table('member')->whereAny(['name', 'phone'], 'LIKE', 'A%');
```

对应的 SQL 语句为：

```sql
SELECT * FROM `member` WHERE (`name` LIKE 'A%' OR `phone` LIKE 'A%')
```

除了以上的方法外，还有 `whereLike`、`whereIn`、`whereBetween`、`whereNull`、`whereNotNull`、`whereDate`、`wherePast`、`whereColumn` 等已经封装好比较运算符的方法。

### ORDER BY

使用 `orderBy` 方法可以构造 ORDER BY 子句：

```php
Route::get('/members', function (Request $request) {
    $query = DB::table('member')->orderBy('id', 'desc');
    return response()->json($query->get());
});
```

使用 `latest` 或者 `oldest` 方法可以方便的根据某个字段排序，默认情况下，这个字段是 `created_at`：

```php
Route::get('/members', function (Request $request) {
    $query = DB::table('member')->latest('id');
    return response()->json($query->get());
});
```

如果希望能随机排序，那么可以使用 `inRandomOrder` 方法：

```php
Route::get('/members', function (Request $request) {
    $query = DB::table('member')->inRandomOrder();
    return response()->json($query->get());
});
```

对应的 SQL 语句为：

```sql
SELECT * FROM `member` ORDER BY RAND()
```

如果希望移除或者修改一个查询条件上的排序字段，可以使用 `reorder` 方法：

```php
Route::get('/members', function (Request $request) {
    $query = DB::table('member')->inRandomOrder();
    $query->reorder('id', 'asc');
    return response()->json($query->get());
});
```

### GROUP BY

使用 `groupBy` 方法可以构造 GROUP BY 子句：

```php
Route::get('/members', function (Request $request) {
    $query = DB::table('member')
        ->rightJoin('member_tag_value', 'member.id', '=', 'member_tag_value.member_id')
        ->select([DB::raw('COUNT(*) as count'), DB::raw('member_tag_value.name')])
        ->groupBy('member_tag_value.name');
    return response()->json($query->get());
});
```

结合 `having` 方法可以构造 HAVING 子句：

```php
Route::get('/members', function (Request $request) {
    $query = DB::table('member')
        ->rightJoin('member_tag_value', 'member.id', '=', 'member_tag_value.member_id')
        ->select([DB::raw('COUNT(*) as count'), DB::raw('member_tag_value.name')])
        ->having('count', '>', 1)
        ->groupBy('member_tag_value.name');
    return response()->json($query->get());
});
```

### LIMIT & OFFSET

使用 `skip` 或 `offset` 方法可以构造 OFFSET 子句，使用 `take` 或 `limit` 方法可以构造 LIMIT 子句：

```php
Route::get('/members', function (Request $request) {
    $params = $request->query();
    $query = DB::table('member');
    if (isset($params['page']) && isset($params['pageSize'])) {
        $query->skip(($params['page'] - 1) * $params['pageSize'])->limit($params['pageSize']);
    }
    return response()->json($query->get());
});
```

### 条件查询

有时只有在特定情况下需要构造一个查询条件，除了使用 if 控制之外，还可以使用 `when` 方法，此方法接收两个参数，只有第一个参数为 `true` 时才会执行第二个闭包：

```php
Route::get('/members', function (Request $request) {
    $params = $request->query();
    $query = DB::table('member')->when(isset($params['page'])&&isset($params['pageSize']), function (Builder $query) use($params) {
       $query->skip(($params['page']-1)*$params['pageSize']);
       $query->take($params['pageSize']);
    });
    return response()->json($query->get());
});
```

`when` 方法还可以接收第三个参数，当第一个参数为 `false` 时，才会执行第三个闭包。

### Insert & Upsert

使用 `insert` 方法可以插入一个数据，如果传入的是一个对象数组那么将会插入多条数据。

`insertOrIgnore` 方法在向数据库插入多条数据时会忽略错误。

如果是自增 id 的情况，可以使用 `insertGetId` 方法，此方法将返回插入数据的 id。

`upsert` 方法将插入不存在的数据，并使用指定的新值更新已存在的数据。此方法的第一个参数包含要插入或更新的值，而第二个参数列出了在相关表中唯一标识记录的列。该方法的第三个也是最后一个参数是一个列数组，如果数据库中已存在匹配的记录，则应更新这些列：

```php
Route::post('/members/upsert', function (Request $request) {
   $member = [
       'name' => $request->input('name'),
       'phone' => $request->input('phone'),
   ];
   DB::table('member')->upsert($member, ['phone'], ['name']);
});
```

上面的代码将会先试用 phone 查询 member，如果能查到，则更新 name，否则创建一条新数据。

::: tip

除了SQL Server之外，所有数据库都要求 `upsert` 方法第二个参数中的列具有“主键”或“唯一”索引。此外，MariaDB 和 MySQL 数据库驱动程序会忽略 `upsert` 方法的第二个参数，并且始终使用表的“主键”和“唯一”索引来检测现有记录。

:::

使用 `updateOrInsert` 也可以实现 upsert 功能：

```php
Route::post('/members/upsert', function (Request $request) {
   DB::table('member')->updateOrInsert(['name' => $request->input('name')], ['phone' => $request->input('phone')]);
});
```

### Update

使用 `update` 方法可以更新数据，例如更新手机号和姓名：

```php
Route::put('/members/{id}', function (int $id, Request $request) {
    $updater = [];
    if ($request->has('name')) {
        $updater['name'] = $request->input('name');
    }
    if ($request->has('phone')) {
        $updater['phone'] = $request->input('phone');
    }
    $updatedCount = DB::table('member')->where('id', $id)->update($updater);
    return response()->json(['updatedCount' => $updatedCount]);
});
```

如果要更新某个整数列，可以使用 `increment` 和 `decrement` 方法：

```php
Route::post('/members/{id}/rewardScore', function (int $id, Request $request) {
    $score = $request->input('score');
    $query = DB::table('member')->where('id', $id);
    if ($score > 0) {
        $query->increment('score', $score);
    } else if ($score < 0) {
        $query->decrement('score', abs($score));
    }
});
```

如果要对多个字段加或减，可以使用 `incrementEach` 和 `decrementEach` 方法：

```php
DB::table('users')->incrementEach([
    'votes' => 5,
    'balance' => 100,
]);
```

### Delete

使用 `delete` 方法即可删除数据：

```php
Route::delete('/members/{id}', function (int $id) {
   DB::table('member')->where('id', $id)->delete();
});
```

### 悲观锁

使用 `sharedLock` 方法可以创建共享锁，多个事务可以同时持有共享锁，如果一个事务正在持有共享锁，那么其他事务将可读但不可写，适用于读多写少的场景。

使用 `lockForUpdate` 方法可以创建排他锁，如果一个事务正在持有排他锁，那么其他事务将无法读写，适用于即将进行写操作的场景。

### Debug

使用 `dd`、`dump` 方法可以进行 debug，前者将会显示 debug 信息并终止请求运行，后者不会阻止请求运行，但会显示 debug 信息。
