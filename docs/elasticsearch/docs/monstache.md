# Monstache

[monstache](https://rwynn.github.io/monstache-site/) 是一个将数据从 MongoDB 同步到 Elasticsearch 的工具，并支持改动实时同步，但是这需要 MongoDB 开启 oplog，也就是需要开启复制集，对于一个单机 MongoDB 节点，参照[此处](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/)开启复制集。

根据文档下载可执行文件后，修改配置文件：

```toml
# MongoDB 连接配置
# [mongo]
# MongoDB 的连接字符串
mongo-url = "mongodb://localhost:27018"

# Elasticsearch 连接配置
# [elasticsearch]
# Elasticsearch 的连接地址
elasticsearch-urls = ["https://localhost:9200"]
elasticsearch-validate-pem-file = false
elasticsearch-user = "elastic"
elasticsearch-password = "*****************8"
direct-read-namespaces = ["es.member"]
# 配置自己的插件
mapper-plugin-path = "/home/user/workspace/monstache/myplugin.so"
# 监控的数据库集合配置
[[mapping]]
# MongoDB 中表的 namespace
namespace = "es.member"
# elasticsearch 中索引的名字
index = "member"
```

其他配置项参照[此处](https://rwynn.github.io/monstache-site/config/)。

如果提供的配置不能满足需求或者希望对数据同步有更详细的控制，那么就需要自行编写插件了。

首先拉取 monstache GitHub [仓库](https://github.com/rwynn/monstache)，然后切换到下载的预构建版本对应的 tag，创建一个 my_plugin.go 文件，插件必须遵守下面的规范：

```go
// plugins must import this package
// import "github.com/rwynn/monstache/monstachemap"

// plugins must implement a function named "Map" with the following signature
// func Map(input *monstachemap.MapperPluginInput) (output *monstachemap.MapperPluginOutput, err error)

// plugins can be compiled using go build -buildmode=plugin -o myplugin.so myplugin.go
// to enable the plugin start with monstache -mapper-plugin-path /path/to/myplugin.so
```

我们首先编写一个程序来向 MongoDB 中插入 mock 数据：

```go
type Member struct {
	Id          primitive.ObjectID `bson:"_id"`
	Name        string             `bson:"name"`
	Email       string             `bson:"email"`
	Tags        []string           `bson:"tags"`
	Phone       string             `bson:"phone"`
	Birth       int                `bson:"birth"`
	IsDeleted   bool               `bson:"isDeleted"`
	IsActivated bool               `bson:"isActivated"`
	Properties  []Property         `bson:"properties"`
	ActivatedAt time.Time          `bson:"activatedAt,omitempty"`
}

type Property struct {
	PropertyName string      `bson:"propertyName"`
	Value        interface{} `bson:"value"`
}

var tags = []string{
	"A",
	"B",
	"C",
	"D",
}

func GetTags(count int) []string {
	result := make([]string, 0, count)
	for i := 0; i < count; i++ {
		result = append(result, tags[randomdata.Number(len(tags))])
	}
	return StrArrayUnique(result)
}

func StrArrayUnique(arr []string) []string {
	m := make(map[string]bool, len(arr))
	for _, v := range arr {
		m[v] = true
	}
	result := make([]string, 0, len(m))
	for k, _ := range m {
		result = append(result, k)
	}
	return result
}

func GenProperties(phone, email, name string) []Property {
	properties := []Property{
		{
			PropertyName: "name",
			Value:        name,
		},
		{
			PropertyName: "email",
			Value:        email,
		},
		{
			PropertyName: "phone",
			Value:        phone,
		},
		{
			PropertyName: "country",
			Value:        randomdata.Country(randomdata.ThreeCharCountry),
		},
		{
			PropertyName: "totalBuys",
			Value:        randomdata.Number(0, 100),
		},
		{
			PropertyName: "notDisturb",
			Value:        randomdata.Boolean(),
		},
		{
			PropertyName: "addresses",
			Value: []string{
				strings.ReplaceAll(randomdata.Address(), "\n", ""),
				randomdata.IpV4Address(),
				randomdata.IpV6Address(),
				randomdata.MacAddress(),
			},
		},
	}
	return properties
}

func NewRandomMember() Member {
	isActivated := randomdata.Boolean()
	phone := randomdata.PhoneNumber()
	phone = strings.ReplaceAll(phone, " ", "")
	phone = strings.TrimLeft(phone, "+")
	name := randomdata.SillyName()
	email := randomdata.Email()
	birth, _ := time.Parse(randomdata.DateOutputLayout, randomdata.FullDate())
	return Member{
		Id:          primitive.NewObjectID(),
		Name:        name,
		Email:       email,
		Tags:        GetTags(randomdata.Number(1, 4)),
		Phone:       phone,
		IsDeleted:   false,
		IsActivated: isActivated,
		Properties:  GenProperties(phone, email, name),
		ActivatedAt: func() time.Time {
			if !isActivated {
				return time.Time{}
			}
			date := randomdata.FullDate()
			t, _ := time.Parse(randomdata.DateOutputLayout, date)
			return t
		}(),
		Birth: cast.ToInt(strings.TrimLeft(birth.Format("0102"), "0")),
	}
}

func genDefaultData(ctx context.Context) {
	client := getMongoClient(ctx)
	col := client.Database("es").Collection("member")
	col.RemoveAll(ctx, primitive.M{})
	for i := 0; i < 40000; i++ {
		col.InsertOne(ctx, NewRandomMember())
	}
}

func getMongoClient(ctx context.Context) *qmgo.Client {
	client, err := qmgo.NewClient(ctx, &qmgo.Config{
		Uri: "mongodb://127.0.0.1:27018",
	})
	if err != nil {
		panic(err)
	}
	return client
}

func main() {
	genDefaultData(context.Background())
}
```

上面的代码使用了 `github.com/Pallinder/go-randomdata` 库来 mock 了数据，执行上面的程序就会在 MongoDB 中插入数据了。

下面开始编写自定义插件：

```go
package main

import (
	"fmt"
	"github.com/rwynn/monstache/v6/monstachemap"
)

func Map(input *monstachemap.MapperPluginInput) (output *monstachemap.MapperPluginOutput, err error) {
	doc := input.Document
	if properties, ok := doc["properties"].([]interface{}); ok {
		doc["properties"] = MapMemberProperties(properties)
	}
	output = &monstachemap.MapperPluginOutput{}
	output.Document = doc
	return
}

func MapMemberProperties(properties []interface{}) map[string]interface{} {
	propertiesMap := make(map[string]interface{}, len(properties))
	for _, property := range properties {
		if pm, ok := property.(map[string]interface{}); ok {
			if pm["propertyName"] == "" {
				continue
			}
			newPropertyMap := make(map[string]interface{})
			switch pm["value"].(type) {
			case int, int32, int64, float32, float64:
				newPropertyMap["doubleValue"] = pm["value"]
				newPropertyMap["type"] = "doubleValue"
			case bool:
				newPropertyMap["boolValue"] = pm["value"]
				newPropertyMap["type"] = "boolValue"
			case []interface{}:
				newPropertyMap["stringArrayValue"] = pm["value"]
				newPropertyMap["type"] = "stringArrayValue"
			default:
				newPropertyMap["stringValue"] = pm["value"]
				newPropertyMap["type"] = "stringValue"
			}
			propertiesMap[fmt.Sprintf("%s", pm["propertyName"])] = newPropertyMap
		}
	}
	return propertiesMap
}
```

在上面的代码中，对于 member 表的 properties 字段进行了重新处理。

然后执行下面的命令构建插件：

```shell
go build -buildmode=plugin -o myplugin.so myplugin.go
```

::: warning

自定义插件的 package 必须是 main。

:::

构建完成后，修改 monstache 配置文件的 `mapper-plugin-path` 的值为构建出的 so 文件的路径，然后执行下面的命令即可开启同步：

```shell
./monstache -f config.toml
```
