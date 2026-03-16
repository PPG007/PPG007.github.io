# Mapping

## 数据类型

alias:

定义一个当前索引中已经存在的字段的别名。

```js
PUT member/_mapping
{
  "properties": {
    "isDeleted2": {
      "type": "alias",
      "path": "isDeleted"
    }
  }
}
```

arrays:

在 elasticsearch 中没有明确的数组类型，任何字段默认情况下都能包含若干值，但是数组中的值必须都是同种类型的数据。

binary：

这种类型的字段接收 base64 编码的字符串，默认情况下这种字段不存储并且不能搜索。

boolean：

这种字段接收下面的取值：

- false、"false"、""（空字符串）；这些将被视为 false。
- true、"true"；这些将被视为 true。

completion:

此类型提供自动补全功能，搜索时使用 suggest 字段进行搜索。

```js
PUT complete-test
{
  "mappings": {
    "properties": {
      "suggest": {
        "type": "completion"
      }
    }
  }
}

POST complete-test/_doc
{
  "suggest": ["openai", "chatgpt", "chatbot"]
}

GET complete-test/_search
{
  "suggest": {
    "my-suggestion": {
      "text": "op",
      "completion": {
        "field": "suggest"
      }
    }
  }
}
```

date：

JSON 并不支持 date 类型字段，因此这种类型的字段在 elasticsearch 中可以有下面的取值：

- 格式化字符串，例如 YYYYMMDD、ISO8601 等标准的字符串。
- 自 1970 年来的秒级时间戳和毫秒级时间戳。

elasticsearch 会将日期转换为 UTC 时间（如果指定了时区），并以毫秒时间戳进行存储。

date_nanos：

这个类型是对 date 类型的补充，但是二者有很大的区别。date 类型以毫秒级时间戳存储数据，date_nanos 以纳秒（十亿分之一秒）存储，这会限制这种类型储存的时间是 1970 年到 2262 年。

flattened：

默认情况下，一个对象的每个字段都会被单独的索引，如果一个字段名字和类型事先不知道，他们将会被动态的映射。flattened 类型是一种特殊的数据类型，可以处理任意深度和结构的嵌套 JSON 对象，flattened 类型将整个 JSON 对象表示为单个值，然后对这个值进行索引，这种数据类型对于具有大量或未知数量的唯一键的对象进行索引非常有用，可以帮助防止由于拥有太多不同字段映射而导致的映射爆炸问题。

但是这种类型不支持范围查询和排序操作，因为它将整个 JSON 对象表示为单个值。

```js
PUT flattened-test
{
  "mappings": {
    "properties": {
      "data": {
        "type": "flattened"
      }
    }
  }
}

POST flattened-test/_doc
{
  "data": {
    "os": "ubuntu",
    "version": "20.04"
  }
}

GET flattened-test/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "data.os": {
              "value": "ubuntu"
            }
          }
        },
        {
          "exists": {
            "field": "data.version"
          }
        }
      ]
    }
  }
}
```

geo_point、point、geo_shape、shape：

分别存储一个经纬度坐标点和一个区域，参考：[地理坐标查询](./dsl.md#地理坐标查询)

ip：

存储 ipv4、ipv6 类型的地址：

```js
PUT ip-test
{
  "mappings": {
    "properties": {
      "ip": {
        "type": "ip"
      }
    }
  }
}

POST ip-test/_doc
{
  "ip": ["192.168.5.11", "192.168.1.4"]
}

GET ip-test/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "ip": {
              "value": "192.168.5.0/24"
            }
          }
        },
        {
          "term": {
            "ip": {
              "value": "192.168.1.0/24"
            }
          }
        }
      ]
    }
  }
}
```

join：

join 数据类型是一个特殊的字段，它在同一索引的文档中创建父子关系。relations 部分定义了文档内可能存在的一组关系，每个关系由一个父名称和一个子名称组成，参见[join 查询](./dsl.md#has-child)

keyword 类型族，包含下面三种类型：

- keyword：用于结构化数据，例如 ids、邮箱地址、主机名等。
- constant_keyword：用于永远包含相同值的字段。
- wildcard：用于非结构化字段。

constant_keyword：

```js
PUT logs-debug
{
  "mappings": {
    "properties": {
      "@timestamp": {
        "type": "date"
      },
      "message": {
        "type": "text"
      },
      "level": {
        "type": "constant_keyword",
        "value": "debug"
      }
    }
  }
}

POST logs-debug/_doc
{
  "date": "2019-12-12",
  "message": "Starting up Elasticsearch",
  "level": "debug"
}

POST logs-debug/_doc
{
  "date": "2019-12-12",
  "message": "Starting up Elasticsearch"
}
```

constant_keyword 字段可以提交没有字段值或者字段值等于映射配置的值的文档，但是不能提供不是设置的 value 值的文档，如果创建映射时 value 不赋值，那么将会以第一个创建的有这个字段的文档的此字段值做限制。

wildcard 类型主要用于存储需要频繁进行模式匹配即 wildcard 查询或者 regexp 查询的字段。wildcard 在建立索引时会将输入字符串分解为一个个更小的部分并对这些部分进行索引，这样能够提高查询性能，但这需要更多的存储空间，精度会比 keyword 差一些。

```js
PUT wildcard-test
{
  "mappings": {
    "properties": {
      "path": {
        "type": "wildcard"
      }
    }
  }
}

POST wildcard-test/_doc
{
  "path": "/home/user/workspace"
}

GET wildcard-test/_search
{
  "query": {
    "wildcard": {
      "path": {
        "value": "/home/*/workspace"
      }
    }
  }
}
```

nested：参见 [nested 查询](./dsl.md#nested)

数字类型：

- long：64 位有符号整型。
- integer：32 位有符号整型。
- short：16 位有符号整型。
- byte：8 位有符号整型。
- double：64 位浮点型。
- float：32 位浮点型。
- half_float：16 位浮点型。
- scaled_float：long 类型支持的，根据一个指定因数进行缩放的类型。
- unsigned_long：64 位无符号整型。

object 类型：nothing to say。

range：

这个类型的字段可以通过 lt、lte、gt、gte 指定一个的范围，支持的范围类型：

- integer_range。
- float_range。
- long_range。
- double_range。
- date_range。
- ip_range。

```js
PUT range-test
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer_range"
      }
    }
  }
}

POST range-test/_doc
{
  "age": {
    "lt": 30,
    "gte": 23
  }
}

GET range-test/_search
{
  "query": {
    "term": {
      "age": {
        "value": "25"
      }
    }
  }
}
```

text 类型族：

- text：传统的分词类型。
- match_only_text：一种优化空间的文本变体，禁用了评分并在需要位置信息的查询上执行较慢。它最适合用于索引日志消息。

token_count：

```js
PUT token-count-test
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "fields": {
          "length": {
            "type":     "token_count",
            "analyzer": "standard"
          }
        }
      }
    }
  }
}

PUT token-count-test/_doc/1
{ "name": "John Smith" }

PUT token-count-test/_doc/2
{ "name": "Rachel Alice Williams" }

GET token-count-test/_search
{
  "query": {
    "term": {
      "name.length": 3
    }
  }
}
```
