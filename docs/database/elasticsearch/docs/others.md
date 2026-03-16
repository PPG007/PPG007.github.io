# 其他

## 分页查询

### from、size

使用 from 和 size 即可控制分页：

```js
GET member/_search
{
  "query": {"match_all": {}},
  "from": 10,
  "size": 20,
  "track_total_hits": true
}
```

其中 track_total_hits 参数可以使 elasticsearch 返回当前查询条件匹配的文档的实际数量。

默认情况下，使用 from 和 size 不能遍历超过 10000 的文档，即 from + size 不能超过 10000，这个可以通过 `index.max_result_window` 进行设置。

### search_after

基于上面的原因，在遍历大量数据时，建议使用 search_after。

```js
GET member/_search
{
  "query": {"match_all": {}},
  "track_total_hits": true,
  "sort": [
    {
      "activatedAt": {
        "order": "asc"
      }
    }
  ]
}
```

指定了排序字段后，返回的 hits 中的每个文档都会有一个 sort 字段，此字段是个数组，再次查询时传入此字段。

```js
GET member/_search
{
  "query": {"match_all": {}},
  "sort": [
    {
      "activatedAt": {
        "order": "asc"
      }
    }
  ],
  "search_after": [1672502400000]
}
```

这样不停地更新 search_after 字段的值就能遍历全部数据了。

::: warning

使用 search_after 时应该确保排序字段的最后一个字段是一个唯一值字段，防止漏掉一些在排序字段上具有重复值的文档。

:::

使用上面的方法时，如果在遍历过程中数据发生了刷新，结果的顺序可能会发生改变，为了防止这种情况，可以创建一个时间点 Point In Time 即 PIT 来保留当前索引的状态。

```js
POST member/_pit?keep_alive=120s

GET _search
{
  "query": {"match_all": {}},
  "size": 1000,
  "sort": [
    {
      "activatedAt": {
        "order": "asc"
      }
    }
  ],
  "search_after": [1672502400000],
  "pit": {
    "id": "x5btAwEGbWVtYmVyFnpuTm9BZXFoVG1Pc1BWZHlhY2dmc0EAFnp3R1EwQUx5UzNpOUQwZnNLQ3VpZmcAAAAAAAAAMi8WZDR5QVZoNXBURVd5anMyTXVZeFIxUQABFnpuTm9BZXFoVG1Pc1BWZHlhY2dmc0EAAA==",
    "keep_alive": "120s"
  }
}
```

::: tip

使用 PIT 时不能指定任何索引。

:::

创建 PIT 时的 keep_alive 参数指定创建的 PIT 实例应该保持活动多长时间，在上面的例子中设置为 120 秒，如果超过 120 秒没有使用这个 PIT 的搜索，那么这个 PIT 将会被关闭。

搜索时指定的 pit.keep_alive 参数是用来延长一个 PIT 的活动时间的，如果指定为 10m，那么会将使用的 PIT 活动时间延长至 10 分钟。

### scroll

已不再推荐使用此方法遍历数据，如果需要遍历大量数据应该使用 search_after。

要使用 scroll，需要在第一次搜索时指定 scroll 参数：

```js
GET member/_search?scroll=120s
{
  "sort": [
    {
      "activatedAt": {
        "order": "desc"
      }
    }
  ],
  "query": {"match_all": {}},
  "size": 20
}
```

返回响应中会有一个 `_scroll_id` 字段，接下来使用这个字段进行遍历：

```js
POST _search/scroll
{
  "scroll": "120s",
  "scroll_id": "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFmQ0eUFWaDVwVEVXeWpzMk11WXhSMVEAAAAAAAA10xZ6d0dRMEFMeVMzaTlEMGZzS0N1aWZn"
}
```

scroll 返回的是在初始搜索请求时匹配搜索条件的所有文档。它忽略了对这些文档进行的任何后续更改。scroll_id 用于标识一个搜索上下文，该上下文跟踪 Elasticsearch 需要返回正确文档所需的一切信息。搜索上下文由初始请求创建，并通过后续请求保持活动状态。

由于 scroll 查询需要保留上下文快照，资源消耗相比 search_after 更大，而且查询结果中不会包含查询过程中发生更新的内容，此外默认 max_open_scroll_context 为 500，在高并发的时候会有问题，所以遍历大量数据更建议用 search_after。
