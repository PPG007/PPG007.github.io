# 聚合查询

## Bucket 聚合

[Bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket.html) 类似 SQL 中的 GROUP BY，是满足特定条件的文档的集合。

首先准备一些数据：

```js
POST /test-agg-cars/_bulk
{ "index": {}}
{ "price" : 10000, "color" : "red", "make" : "honda", "sold" : "2014-10-28" }
{ "index": {}}
{ "price" : 20000, "color" : "red", "make" : "honda", "sold" : "2014-11-05" }
{ "index": {}}
{ "price" : 30000, "color" : "green", "make" : "ford", "sold" : "2014-05-18" }
{ "index": {}}
{ "price" : 15000, "color" : "blue", "make" : "toyota", "sold" : "2014-07-02" }
{ "index": {}}
{ "price" : 12000, "color" : "green", "make" : "toyota", "sold" : "2014-08-19" }
{ "index": {}}
{ "price" : 20000, "color" : "red", "make" : "honda", "sold" : "2014-11-05" }
{ "index": {}}
{ "price" : 80000, "color" : "red", "make" : "bmw", "sold" : "2014-01-01" }
{ "index": {}}
{ "price" : 25000, "color" : "blue", "make" : "ford", "sold" : "2014-02-12" }
```

简单聚合，得出哪个颜色的销量最好：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "best sold colors": {
      "terms": {
        "field": "color.keyword",
        "size": 1
      }
    }
  }
}
```

多个聚合，统计颜色和制造商：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "best sold colors": {
      "terms": {
        "field": "color.keyword",
        "size": 1
      }
    },
    "make_by": {
      "terms": {
        "field": "make.keyword",
        "size": 1
      }
    }
  }
}
```

聚合嵌套，计算每个制造商产品的平均价格：

```js
GET /test-agg-cars/_search
{
   "size" : 0,
   "aggs": {
      "makers": {
         "terms": {
            "field": "make.keyword"
         },
         "aggs": {
            "avg_price": {
               "avg": {
                  "field": "price"
               }
            }
         }
      }
   }
}
```

前置条件的过滤，类似 MongoDB Aggregation 中的 $match：

```js
GET /test-agg-cars/_search
{
  "size": 0,
  "aggs": {
    "make_by": {
      "filter": { "term": { "make.keyword": "honda" } },
      "aggs": {
        "avg_price": { "avg": { "field": "price" } }
      }
    }
  }
}
```

对 filter 进行分组聚合：filters，先创建数据，模拟日志系统，每条日志都在文本中，包含 warning、info 等信息。

```js
PUT /test-agg-logs/_bulk?refresh
{ "index" : { "_id" : 1 } }
{ "body" : "warning: page could not be rendered" }
{ "index" : { "_id" : 2 } }
{ "body" : "authentication error" }
{ "index" : { "_id" : 3 } }
{ "body" : "warning: connection timed out" }
{ "index" : { "_id" : 4 } }
{ "body" : "info: hello pdai" }
```

对不同的日志类型进行分组，使用 filters：

```js
GET /test-agg-logs/_search
{
  "size": 0,
  "aggs" : {
    "messages" : {
      "filters" : {
        "other_bucket_key": "other_messages",
        "filters" : {
          "infos" :   { "match" : { "body" : "info"   }},
          "warnings" : { "match" : { "body" : "warning" }}
        }
      }
    }
  }
}
```

对 number 类型聚合，ranges 类似 MongoDB Aggregation 中的 $bucket 操作的 boundaries 字段：

```js
GET /test-agg-cars/_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 20000 },
          { "from": 20000, "to": 40000 },
          { "from": 40000 }
        ]
      }
    }
  }
}
```

::: waring

包含 from 值不包含 to 值。

::;

对 IP 类型聚合：

```js
PUT test-agg-ips
{
  "mappings": {
    "properties": {
      "ip_addr": {
        "type": "ip"
      }
    }
  }
}

PUT /test-agg-ips/_bulk?refresh
{ "index" : { "_id" : 1 } }
{ "ip" : "172.21.0.1 }
{ "index" : { "_id" : 2 } }
{ "ip" : "192.168.1.18" }
{ "index" : { "_id" : 3 } }
{ "ip" : "172.17.0.1" }
{ "index" : { "_id" : 4 } }
{ "ip" : "223.5.5.5" }

GET /test-agg-ips/_search
{
  "size": 10,
  "aggs": {
    "ip_ranges": {
      "ip_range": {
        "field": "ip_addr",
        "ranges": [
          { "to": "10.0.0.5" },
          { "from": "10.0.0.5" }
        ]
      }
    }
  }
}
```

对日期类型聚合：

```js
GET /test-agg-cars/_search
{
  "size": 0,
  "aggs": {
    "range": {
      "date_range": {
        "field": "sold",
        "format": "yyyy-MM-dd",
        "ranges": [
          { "from": "2014-01-01" },
          { "to": "2014-12-31" }
        ]
      }
    }
  }
}
```

## Metric 聚合

Mertics 聚合对 Bucket 内的文档进行统计计算。

### 单值分析

avg 平均值：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "avg_price": {
      "avg": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

max 最大值：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "max_price": {
      "max": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

min 最小值

```js
GET test-agg-cars/_search
{
  "aggs": {
    "min_price": {
      "min": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

sum 求和：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "total_price": {
      "sum": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

去重计数：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "total_maker": {
      "cardinality": {
        "field": "make.keyword"
      }
    }
  },
  "size": 0
}
```

中位数：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "middle_price": {
      "median_absolute_deviation": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

### 非单值分析

stats，计算总数、最小值、最大值、平均值、求和：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "stats": {
      "stats": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

extended_stats，信息量更大，同样用于数值计算：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "stats": {
      "extended_stats": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

string_stats，统计字符串信息：

```js
GET test-agg-cars/_search
{
  "aggs": {
    "stats": {
      "string_stats": {
        "field": "color.keyword"
      }
    }
  },
  "size": 0
}
```

percentiles 百分数范围：

```js
// 可以得到各个价位段及其比重
GET test-agg-cars/_search
{
  "aggs": {
    "stats": {
      "percentiles": {
        "field": "price"
      }
    }
  },
  "size": 0
}
```

percentile_ranks 百分数排行，计算一个或多个百分位等级：

```js
// 得到 23500 和 30000 以下价格的比例
GET test-agg-cars/_search
{
  "aggs": {
    "stats": {
      "percentile_ranks": {
        "field": "price",
        "values": [23500, 30000]
      }
    }
  },
  "size": 0
}
```

## Pipeline 聚合

TODO:
