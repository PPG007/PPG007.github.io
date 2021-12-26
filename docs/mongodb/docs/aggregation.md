# Aggregation

Aggregation 中可以将多个操作组合起来，每个操作就是一个 stage，数据像在管道中流动。

## stages

除了 $out、$merge、$geoNear，其他 stage 都可以在管道内出现多次。

- $addFields：为文档添加新字段，输出已经存在的所有字段和新添加的字段。

    ```javascript
    db.member.aggregate([{$addFields: {demo: "demo"}}])
    ```

- $bucket：将输入文档按规则进行划分。

    ```javascript
    db.artists.aggregate([{$bucket: {groupBy: "$year_born",boundaries: [1840, 1850, 1860, 1870, 1890]}}])
    ```

    其中 groupBy 和 boundaries 字段必须要有，groupBy 指明分组的依据字段，boundaries 是一个数组，用来将 groupBy 的字段进行范围划分，必须要将 groupBy 字段的最大最小值包含在内，且是同一类型。

- $bucketAuto：将文档分组，但是 boundaries 是自动的，不需要再指定。

    ```javascript
    db.artists.aggregate([{$bucketAuto: {groupBy: "$year_born", buckets: 4}}])
    ```

    需要同时指定 groupBy 和 buckets，buckets 用来决定分成几组。

- $count：将输入文档的数量输出。

    ```javascript
    db.member.aggregate([{$count: "demo"}])
    ```

    $count 后接一个字符串，这个字符串就是输出的数量的键，不能是空字符串，不能以 `$` 开头，不能包含 `.`。

- $facet：定义多个字段，每个字段可以使用各自的 stage，在输出中，每个字段一个键。

    ```javascript
    db.artists.aggregate([{$facet: {"add": [{$addFields: {add: "add"}}], "count": [{$count: "count"}], "groupBy": [{$bucketAuto: {groupBy: "$year_born", buckets: 5}}]}}])
    ```

- $group：分组，必须指定 `_id`，这个字段类似 groupBy。

    ```javascript
    // 计数
    db.artists.aggregate([{$group: {_id: null,count: {$sum: 1}}}])

    // 过滤重复值
    db.artists.aggregate([{$group: {_id: "$nationality"}}])
    ```

- $limit：限制输出结果数量。

    ```javascript
    db.artists.aggregate([{$limit: 2}])
    ```

- $lookup：执行连接操作。

    ```javascript
    // 等值连接，输出的每个文档有一个 inventory_docs 字段，是一个数组，里面是第二个集合中的内容。
    db.orders.aggregate([{$lookup: {from: "inventory", localField: "item", foreignField: "sku", as: "inventory_docs"}}])

    // 如果 localField 是一个数组，那么不需要 unwind 就能将数组中的每一个元素进行连接。
    ```

- $match：过滤。

    ```javascript
    db.artists.aggregate([{$match: {year_died: {$lte: 1920}}}])
    ```

- $project：决定要显示在结果中的字段。

    ```javascript
    db.artists.aggregate([{$match: {year_died: {$lte: 1920}}}, {$project: {last_name: 1, _id: 0}}])
    ```

- $sample：从输入中*随机*选几个文档输出。

    ```javascript
    db.artists.aggregate([{$sample: {size: 3}}])
    ```

- $set：添加、修改输入文档的字段值。

    ```javascript
    db.artists.aggregate([{$set: {time: new Date()}}])
    ```

- $skip：跳过指定数量的输入的文档，将剩余的文档输出。

    ```javascript
    db.artists.aggregate([{$skip: 5}, {$count: "num"}])
    ```

- $sorted：对输入的文档进行排序。

    ```javascript
    // 1 是升序排列，-1 是降序排列。
    db.artists.aggregate([{$sort: {year_born: 1, year_died: -1}}])
    ```

- sortByCount：将输入的文档根据规则分组，然后计算每个分组中的元素数量，输出的文档包含一个 `_id` 字段，其中是这个分组的分组依据的值，一个 `count` 字段，是这一组的元素个数。

    ```javascript
    db.artists.aggregate([{$sortByCount: "$nationality"}])
    ```

- $unset：从输入的文档中删除某个字段。

    ```javascript
    db.artists.aggregate([{$sortByCount: "$nationality"}, {$unset: "_id"}])
    ```

- unwind：解构一个数组字段。

    ```javascript
    db.member.aggregate([{$unwind:"$tags"}])
    ```
