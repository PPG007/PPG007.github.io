# 显示数据

## 数据提供器

数据提供器是一个实现了 DataProviderInterface 接口的类，主要用于获取分页和数据排序，Yii 包含以下数据提供器：

- ActiveDataProvider：使用 Query 或者 ActiveQuery 从数据库查询数据以数组的方式或者 Active Record 实例的方式返回。
- SqlDataProvider：执行一段 SQL 语句并且将数据库数据作为数组返回。
- ArrayDataProvider：将一个大的数组依据分页和排序规则返回一部分数据。

这些数据提供者都遵守以下模式：

```php
// 根据配置的分页以及排序属性来创建一个数据提供者
$provider = new XyzDataProvider([
    'pagination' => [...],
    'sort' => [...],
]);

// 获取分页和排序数据
$models = $provider->getModels();

// 在当前页获取数据项的数目
$count = $provider->getCount();

// 获取所有页面的数据项的总数
$totalCount = $provider->getTotalCount();
```

pagination 和 sort 属性分别对应 `yii\data\Pagination` 和 `yii\data\Sort`，也可以配置成 false 禁用分页和排序。

### ActiveDataProvider

为了使用 yii\data\ActiveDataProvider，应该配置其 query 的属性。 它既可以是一个 yii\db\Query 对象，又可以是一个 yii\db\ActiveQuery 对象。假如是前者，返回的数据将是数组； 如果是后者，返回的数据可以是数组也可以是 Active Record 对象。

```php
$query = self::find()->where($condition)->orderBy(['createdAt' => -1]);
$pagination = new Pagination();
$pagination->setPage($page);
$pagination->setPageSize($pageSize);
return (new ActiveDataProvider([
    'query' => $query,
    'pagination' => $pagination,
]))->getModels();
```

### ArrayDataProvider

yii\data\ArrayDataProvider 非常适用于大的数组。数据提供者允许返回一个经过一个或者多个字段排序的数组数据页面。为了使用 yii\data\ArrayDataProvider，应该指定 allModels 属性作为一个大的数组。 这个大数组的元素既可以是一些关联数组，也可以是一些对象。

```php
$results = self::findAll($condition);
$pagination = new Pagination();
$pagination->setPageSize($pageSize);
$pagination->setPage($page);
$sorter = new Sort([
    'attributes' => [
        'createdAt',
    ],
    'defaultOrder' => [
        'createdAt' => SORT_DESC,
    ]
]);
return (new ArrayDataProvider([
    'allModels' => $results,
    'pagination' => $pagination,
    'sort' => $sorter,
]))->getModels();
```

### SqlDataProvider

TODO:
