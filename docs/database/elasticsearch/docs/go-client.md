# Go Client

[GitHub](https://github.com/elastic/go-elasticsearch)

新版 client 支持了 [TypedClient](https://www.elastic.co/guide/en/elasticsearch/client/go-api/current/runningqueries.html)，查询不再需要手动处理 JSON 字符串，下面都使用这个客户端。

创建客户端：

```go
var (
	config = elasticsearch.Config{
		Addresses: []string{"https://127.0.0.1:9200"},
		Username:  "elastic",
		Password:  "GwRCjIhuN1aByZvpPqxq",
	}

	esClient *elasticsearch.TypedClient
)

func ensureClient() {
	client, err := elasticsearch.NewTypedClient(config)
	if err != nil {
		panic(err)
	}
	esClient = client
}
```

布尔查询示例：

```go
func intPtr(i int) *int {
	return &i
}

func strPtr(s string) *string {
	return &s
}

func buildReq() *search.Request {
	return &search.Request{
		Query: &types.Query{
			Bool: &types.BoolQuery{
				Must: []types.Query{
					{
						Term: map[string]types.TermQuery{
							"isDeleted": {
								Value: false,
							},
						},
					},
					{
						Term: map[string]types.TermQuery{
							"isActivated": {
								Value: true,
							},
						},
					},
					{
						Range: map[string]types.RangeQuery{
							"activatedAt": types.DateRangeQuery{
								Lte: strPtr(time.Now().Format(time.RFC3339)),
							},
						},
					},
				},
			},
		},
		Size:           intPtr(1),
		TrackTotalHits: true,
	}
}

func Search() {
	ensureClient()
	ctx := context.Background()
	resp, err := esClient.Search().Index("member").Request(buildReq()).Do(ctx)
	if err != nil {
		panic(err)
	}
	total := resp.Hits.Total.Value
    // 查到 ids 可以再去 DB 查，确保数据最新，有索引的话速度很快
	ids := make([]string, 0, len(resp.Hits.Hits))
	for _, hit := range resp.Hits.Hits {
		ids = append(ids, hit.Id_)
	}
	log.Println(total)
	log.Println(ids)
}
```

search_after 遍历示例：

```go
func buildReq(pitId string, searchAfter []types.FieldValue) *search.Request {
	return &search.Request{
		Query: &types.Query{
			Exists: &types.ExistsQuery{
				Field: "activatedAt",
			},
		},
		Size:           intPtr(1000),
		TrackTotalHits: true,
		Sort: []types.SortCombinations{
			types.SortOptions{
				SortOptions: map[string]types.FieldSort{
					"activatedAt": {
						Order: &sortorder.Asc,
					},
				},
			},
		},
		Pit: &types.PointInTimeReference{
			Id:        pitId,
			KeepAlive: "120s",
		},
		SearchAfter: searchAfter,
	}
}

func getPITId(ctx context.Context) string {
	pit, err := esClient.OpenPointInTime("member").KeepAlive("120s").Do(ctx)
	if err != nil {
		panic(err)
	}
	return pit.Id
}

func arrUnique(arr []string) []string {
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

func Search() {
	ensureClient()
	ctx := context.Background()
	var ids []string
	pitId := getPITId(ctx)
	req := buildReq(pitId, nil)
	total := int64(0)
	for {
		resp, err := esClient.Search().Request(req).Do(ctx)
		if err != nil {
			panic(err)
		}
		log.Println("searching", len(ids))
		if len(resp.Hits.Hits) == 0 {
			break
		}
		var sa []types.FieldValue
		for i, hit := range resp.Hits.Hits {
			ids = append(ids, hit.Id_)
			if i == len(resp.Hits.Hits)-1 {
				sa = hit.Sort
			}
		}
		ids = arrUnique(ids)
		if total == 0 {
			total = resp.Hits.Total.Value
		}
		req = buildReq(pitId, sa)
	}
	log.Println(len(ids), total)
}
```
