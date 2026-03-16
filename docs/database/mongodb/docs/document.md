# 文档操作

## 查询

- 查询集合中的所有文档：

  ```javascript
  db.inventory.find({}); // 为 find 方法传入空对象即可。
  ```

- 根据文档的某个属性等值查询：

  为 find 方法传入一个对象，这个对象的键值对应着查询条件。

  ```javascript
  db.inventory.find({ status: 'D', item: 'paper' });
  ```

- 通过操作符查询：

  - 比较操作符：

    ```javascript
    // 相等比较，语法：{ <field>: { $eq: <value> } }
    db.user.find({ name: { $eq: 'koston' } });
    db.inventory.find({ size: { $eq: { h: 10, w: 15.25, uom: 'cm' } } });

    // 大于
    db.user.find({ age: { $gt: 25 } });

    // 大于等于
    db.user.find({ age: { $gte: 25 } });

    // 小于
    db.user.find({ age: { $lt: 25 } });

    // 小于等于
    db.user.find({ age: { $lte: 25 } });

    // in
    db.user.find({ age: { $in: [22, 24, 26, 28] } });

    // not in
    db.user.find({ age: { $nin: [22, 24, 26, 28] } });
    ```

  - 逻辑操作符：

    ```javascript
    // 与
    db.user.find({ $and: [{ name: 'koston' }, { age: 21 }] });
    db.user.find({ name: 'koston', age: 21 });

    // 或
    db.user.find({ $or: [{ name: 'koston' }, { age: 25 }] });

    // 否
    db.user.find({ name: { $not: { $eq: 'koston' } } });

    // 全不
    db.user.find({ $nor: [{ age: { $gte: 25 } }, { name: { $in: ['test1', 'test3'] } }] });
    ```

  - 元素查询操作符：

    ```javascript
    // 如果后面的布尔值为 true，将返回包含指定字段的文档，即使值为 null，如果是 false 将会只返回不包含这个字段的文档。
    db.user.find({ q: { $exists: true } });

    // 查找某个字段的值是指定类型的文档
    db.user.find({ age: { $type: 'double' } });
    ```

  - 数组查询操作符：

    ```javascript
    // 查找某个数组字段包含给定数组的全部元素的文档，如果元素是一个多属性对象，则属性的顺序不能换，或者将属性拆分判断。
    db.user.find({ grades: { $all: [{ english: 90 }, { math: 100 }] } });

    // 查找某个数组字段中至少一个元素满足后面的所有 query 条件的文档。
    db.user.find({ results: { $elemMatch: { $gte: 3, $lte: 6 } } });

    // 查找某个数组字段中元素个数等于指定值的文档。
    db.user.find({ results: { $size: 4 } });
    ```

- 查询某些字段：传入第二个参数，指定要查询的字段，赋值为 1 表示查询,为 0 表示不查询。如果有一个是 1 那么其他没有指明的字段不会返回，如果只有 0，那么只是不会返回指定的字段。

  ```javascript
  db.inventory.find({}, { item: 1, _id: 0 });
  ```

- 查询为 null 或者不存在的字段：
  - 如果 query 对象的字段值为 null，将会查找这个字段值为 null，以及没有这个字段的文档。
  - 使用 $type 查询值为 null 的字段。
  - 使用 $exists 查询不存在的字段。

## 增加

- insertOne() 方法：插入一条文档：

  ```javascript
  db.user.insertOne({ name: 'koston', age: 21 });
  ```

- insertMany() 方法，插入多条文档，数组形式。

  ```javascript
  db.user.insertMany([
    { name: 'test3', age: 24 },
    { name: 'test4', age: 25 },
  ]);
  ```

- insert() 方法，既可以插入一条也可以是数组多条。

  ```javascript
  db.user.insert({ name: 'test5', age: 26 });
  db.user.insert([
    { name: 'test6', age: 27 },
    { name: 'test7', age: 28 },
  ]);
  ```

## 删除

- deleteMany()：删除所有符合条件的文档。

  ```javascript
  db.inventory.deleteMany({ status: 'A' });
  ```

- deleteOne()：删除一个符合条件的文档。
- remove()：删除文档。

  ```javascript
  // 默认全部删除
  db.inventory.remove({ status: 'D' }, { justOne: true });
  ```

## 更新

- 更新方法：
  - updateOne()：更新一个文档。
  - updateMany()：更新多个文档。
  - replaceOne()：替换一个文档，不能用更新操作符。
- 更新操作符：

  - $inc：增加指定字段的值，可以是负数。

    ```javascript
    db.inventory.updateOne({ qty: 95 }, { $inc: { qty: 5, 'size.w': 1.5 } });
    ```

  - $min：只有指定值小于现有值才更新。

    ```javascript
    db.inventory.updateOne({ qty: 95, time: { $exists: true } }, { $min: { 'size.h': 21 } });
    ```

  - $max：只有指定值大于现有值才更新。

    ```javascript
    db.inventory.updateOne({ qty: 95, time: { $exists: true } }, { $max: { 'size.h': 29 } });
    ```

  - $mul：将指定字段乘以一个数。

    ```javascript
    db.inventory.updateOne({ qty: 95, time: { $exists: true } }, { $mul: { 'size.w': 2 } });
    ```

  - $rename：将字段重命名。

    ```javascript
    db.inventory.updateOne({ qty: 95, time: { $exists: true } }, { $rename: { time: 'date' } });
    ```

  - $set：将字段修改为指定值。

    ```javascript
    db.inventory.updateOne({ qty: 95, date: { $exists: true } }, { $set: { date: '2021-11-02' } });
    ```

  - $unset：删除指定的字段。

    ```javascript
    db.inventory.updateOne({ qty: 95, date: { $exists: true } }, { $unset: { date: '' } });
    ```

  - $pull：从一个数组中将指定元素删除。

    ```javascript
    // 删除 fruits 数组中的 apples 和 oranges，以及 vegetables 数组中的 carrots。
    db.stores.update(
      {},
      { $pull: { fruits: { $in: ['apples', 'oranges'] }, vegetables: 'carrots' } },
      { multi: true }
    );
    ```

  - $push：将元素添加到数组。

    ```javascript
    db.stores.update({}, { $push: { fruits: { $each: ['apples', 'banana'] } } });
    ```

  - $pop：从数组中删除第一个或者最后一个元素。

    ```javascript
    // 后面为 1 表示从末尾删，为 -1 表示从开头删
    db.stores.update({}, { $pop: { fruits: 1 } });
    ```

  - $pullAll：移除数组中与指定的全部元素。

    ```javascript
    db.stores.update({}, { $pullAll: { fruits: ['apples', 'bananas'] } });
    ```

  - $addToSet：向数组添加元素，除非这个元素已经存在。

    ```javascript
    db.stores.update({}, { $addToSet: { fruits: 'pears' } });
    ```

  - $each：可以结合 `$addToSet`和`$push`，能够将一个数组中的元素值展开。
  - $slice：必须和 `$each`同时出现，并和`$push` 配合使用。

    ```javascript
    // 负数：只保留 push 后的后几个元素。
    // 正数：只保留 push 后的前几个元素。
    // 0：将数组变为空数组。
    db.students.update({ _id: 1 }, { $push: { scores: { $each: [80, 78, 86], $slice: -5 } } });
    ```

  - $position：与 `$push`和`$each` 一起使用，表示插入的位置。
  - $sort：与 `$push`和`$each` 一起使用，指定数组的排序规则。

    ```javascript
    // 正数表示增序，负数表示降序，如果要排序的数组是一个对象数组，要根据对象的属性排序，sort 后就是一个对象，直接用属性名做键。
    db.stores.update({}, { $push: { fruits: { $each: [], $sort: 1 } } });
    ```

## Cursor

find 方法返回的就是 cursor 对象。

[Cursor Method](https://docs.mongodb.com/v4.2/reference/method/js-cursor/)

常见方法：

- close()：通知服务器关闭游标。
- isClosed()：判断是否关闭。
- count()：计数，即使游标位置改变也返回全部数量。
- forEach()：遍历，这个方法会导致游标移动到最后。

  ```javascript
  db.inventory.find().forEach(x => print(x.item));
  ```

- hasNext()：判断游标是否还有下一个元素。
- isExhausted()：如果游标被关闭且批处理中没有剩余对象就返回 true。
- itcount()：计数，但是会将游标移动到最后。
- limit()：限制查询结果数量，如果是 0，效果等同于没有限制。
- map()：将函数作用于游标的每个文档上，使用数字接受返回值。

  ```javascript
  const x = db.inventory.find().map(x => x.status);
  ```

- next()：向后移动游标。
- noCursorTimeout()：告知服务器不要设置超时时间。
- objsLeftInBatch()：返回当前游标剩余的文档数量。
- pretty()：让输出格式化。
- size()：计数，不受 skip() 方法和 limit() 方法的影响。
- skip()：从指定的位置开始返回结果，结合 limit 可以实现分页。

  ```javascript
  function printStudents(pageNumber, nPerPage) {
    print('Page: ' + pageNumber);
    db.students
      .find()
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .forEach(student => {
        print(student.name);
      });
  }
  ```

- sort()：根据指定的字段对结果进行排序，正数为递增，负数为递减。
- toArray()：将从游标当前位置开始到结束的文档以数组形式返回，且会将游标移动到最后。

## 集合方法

- countDocuments()：统计一个集合中符合条件的文档数量。

  ```javascript
  db.inventory.countDocuments({});
  ```

- estimatedDocumentCount()：计数。
- dataSize()：返回集合大小的字节数。
- distinct()：返回不重复的某个字段的值。

  ```javascript
  db.stores.distinct('fruits');
  ```

- findAndModify()：修改并返回一个文档，默认情况下返回的是没有修改的文档，键名是固定的。

  ```javascript
  db.collection.findAndModify({
  query: <document>,
  sort: <document>,
  remove: <boolean>,
  update: <document or aggregation pipeline>,
  new: <boolean>,
  fields: <document>,
  });
  ```

- findOneAndDelete()：删除一个文档，返回这个删除的文档。

  ```javascript
  db.stores.findOneAndDelete({ fruits: 'grapes' });
  ```

- findOneAndReplace()：替换第一个符合条件的文档，默认返回替换前的文档。

  ```javascript
  db.stores.findOneAndReplace({ fruits: 'plums' }, { fruits: 'none' }, { returnNewDocument: true });
  ```

- findOneAndUpdate()：更新一个文档，默认返回更新前的文档。

  ```javascript
  db.stores.findOneAndUpdate(
    { fruits: 'none' },
    { $set: { time: '2021-11-04' } },
    { returnNewDocument: true }
  );
  ```

- renameCollection()：重命名集合。

  ```javascript
  db.stores.renameCollection('test');
  ```

- save()：更新一个已经存在的文档或者插入一个新文档，如果传入的文档不包含 `_id` 字段将会生成一个 id 并插入，否则会根据这个 `_id` 进行更新，如果没有这个 id 对应的文档，那么还是插入。
