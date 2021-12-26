# 操作 MongoDB

这里使用 MongoDB 的官方驱动，也可以使用[Qmgo](https://github.com/qiniu/qmgo/blob/master/README_ZH.md)。

## 连接 MongoDB

```go
ctx, cancelFunc := context.WithTimeout(context.Background(), 10*time.Second)
defer cancelFunc()
client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
// 连通性测试
client.Ping(ctx, readpref.Primary())
if err != nil {
  fmt.Println(err)
  return
}
defer client.Disconnect(ctx)
collection := client.Database("local").Collection("member")
```

## 计数

```go
// 精确计数
fmt.Println(collection.CountDocuments(ctx, bson.D{{"age", bson.D{{"$gte", 30}}}}))
// 估算
fmt.Println(collection.EstimatedDocumentCount(ctx))
```

## 查询

```go
// bson.D 用来构造 JSON 查询，bson.A 相当于查询中的数组
filter := bson.D{
  {
    "$or", bson.A{
      bson.D{{"age", bson.D{{"$lt", 35}}}},
      bson.D{{"age", bson.D{{"$gte", 44}}}},
    },
  },
}
// 设置要返回的文档
projection := bson.D{{"name", 1}, {"_id", 0}, {"age", 1}, {"phone", 1}, {"number", 1}}
// 设置查询选项
opts := options.Find().SetLimit(10).SetSort(bson.D{{"age", 1}}).SetProjection(projection).SetSkip(1)
cursor, err := collection.Find(ctx, filter, opts)
if err != nil {
  fmt.Println(err)
  return
}
var result []bson.D
fmt.Println(cursor.All(ctx, &result))
for _, d := range result {
  fmt.Println(d)
}
```

## 聚合操作

```go
stages := []bson.D{
  {
    {Key: "$unwind", Value: "$tags",},
  },
  {
    {Key: "$group", Value: bson.D{
      {
        Key: "_id", Value: "$tags",
      },
      {
        Key: "peopleNumber", Value: bson.D{
          {
            Key: "$sum", Value: 1,
          },
        },
      },
      {
        Key: "avgAge", Value: bson.D{
          {
            Key: "$avg", Value: "$age",
          },
        },
      },
    },},
  },
  {
    {Key: "$project", Value: bson.D{
      {
        Key: "_id", Value: 0,
      },
    },},
  },
}
cursor, err := collection.Aggregate(ctx, stages)
if err != nil {
  fmt.Println(err)
  return
}
var result []bson.M
fmt.Println(cursor.All(ctx, &result))
for _, d := range result {
  fmt.Println("res:", d)
}
```
