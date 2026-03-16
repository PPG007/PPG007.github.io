# 索引

## 创建索引

```js
PUT student
{
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "age": {
        "type": "integer"
      }
    }
  }
}
```

## 打开、关闭索引

```js
// 关闭
POST student/_close
// 打开
POST student/_open
```

一旦索引被关闭，那么这个索引只能显示元数据信息，不能进行读写操作。

## 查看索引

```js
// 只查看是否存在：
HEAD student
// 获取详情：
GET student
```

## 删除索引

```js
DELETE student
```

::: warning

已创建的索引不允许修改。

:::

## 索引模板

### 组件模板和索引模板

- 组件模板是可重用的构建块，用于配置映射、设置和别名，不会直接应用于一组索引。
- 索引模板可以包含组件模板的集合，也可以直接指定设置、映射和别名。

### 索引模板中的优先级

- 可组合模板优先于旧模板。如果没有可组合模板匹配给定索引，则旧版模板可能仍匹配并被应用。
- 如果使用显式设置创建索引并且该索引也与索引模板匹配，则创建索引请求中的设置将优先于索引模板及其组件模板中指定的设置。
- 如果新数据流或索引与多个索引模板匹配，则使用优先级最高的索引模板。

### 示例

创建两个索引组件模板：

```js
PUT _component_template/component_template1
{
  "template": {
    "mappings": {
      "properties": {
        "@timestamp": {
          "type": "date"
        }
      }
    }
  }
}

PUT _component_template/runtime_component_template
{
  "template": {
    "mappings": {
      "runtime": {
        "day_of_week": {
          "type": "keyword",
          "script": {
            "source": "emit(doc['@timestamp'].value.dayOfWeekEnum.getDisplayName(TextStyle.FULL, Locale.ROOT))"
          }
        }
      }
    }
  }
}
```

创建使用了上面组件模板的索引模板：

```js
PUT _index_template/template_1
{
  "index_patterns": ["bar*"],
  "template": {
    "settings": {
      "number_of_shards": 1
    },
    "mappings": {
      "_source": {
        "enabled": true
      },
      "properties": {
        "host_name": {
          "type": "keyword"
        },
        "created_at": {
          "type": "date",
          "format": "EEE MMM dd HH:mm:ss Z yyyy"
        }
      }
    },
    "aliases": {
      "mydata": { }
    }
  },
  "priority": 500,
  "composed_of": ["component_template1", "runtime_component_template"],
  "version": 3,
  "_meta": {
    "description": "my custom"
  }
}
```

接下来创建匹配 bar\* 的索引：

```js
PUT /bar-test

GET bar-test
```

::: warning

Elasticsearch 有内建索引模板，每个优先级都是 100，创建索引模板时注意匹配。

- `logs-*-*`
- `metrics-*-*`
- `synthetics-*-*`

:::

### 模拟某个索引创建后的结果

```js
POST _index_template/_simulate_index/bar-test2
```

### 模拟组件模板的结果

```js
POST _index_template/_simulate/template_1
```

### 模拟组件模板和自身模板结合后的结果

```js
PUT _index_template/template_1
{
  "index_patterns": ["bar*"],
  "template": {
    "settings": {
      "number_of_shards": 1
    },
    "mappings": {
      "_source": {
        "enabled": true
      },
      "properties": {
        "host_name": {
          "type": "keyword"
        },
        "created_at": {
          "type": "date",
          "format": "EEE MMM dd HH:mm:ss Z yyyy"
        }
      }
    },
    "aliases": {
      "mydata": { }
    }
  },
  "priority": 500,
  "composed_of": ["component_template1", "runtime_component_template"],
  "version": 3,
  "_meta": {
    "description": "my custom"
  }
}
```
