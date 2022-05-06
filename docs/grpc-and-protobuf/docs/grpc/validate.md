# 结合自定义 tag 实现 validate

首先定义下面这样一个请求：

```protobuf
message DemoRequest{
  string id = 1; // @gotags: valid:"required,objectId"
  string status = 2; // @gotags: valid:"in(succeed|failed|processing),required"
  repeated string ids = 3; // @gotags: valid:"required,objectIdList"
  bool containDeleted = 4;
  int64 option = 5;
}
```

这里我们使用一个 [govalidator](https://github.com/asaskevich/govalidator) 库：

```shell
go get github.com/asaskevich/govalidator
```

这个库本身具有一些内置的规则，可以在文档中找到，这里我们实现自定义验证，调用 `govalidator.CustomTypeTagMap.Set` 方法可以自定义验证：

```go
func init() {
	// govalidator.TagMap["objectId"] = govalidator.Validator(func(str string) bool {
	// 	_, err := primitive.ObjectIDFromHex(str)
	// 	return err == nil
	// })

	govalidator.CustomTypeTagMap.Set("objectId", func(i, o interface{}) bool {
		s := cast.ToString(i)
		_, err := primitive.ObjectIDFromHex(s)
		return err == nil
	})

	govalidator.CustomTypeTagMap.Set("objectIdList", func(i, o interface{}) bool {
		strs := cast.ToStringSlice(i)
		for _, str := range strs {
			_, err := primitive.ObjectIDFromHex(str)
			if err != nil {
				return false
			}
		}
		return true
	})
}
```

::: tip
注释中的方法也可以用来自定义规则，但是只适用于单一字符串验证，如果是数组或者其他类型还是不够灵活。
:::

接下来我们在接口实现中调用验证方法验证请求即可：

```go
func (ValidatorService) Demo(ctx context.Context, req *proto.DemoRequest) (*proto.EmptyResponse, error) {
	if _, err := govalidator.ValidateStruct(req); err != nil {
		return nil, err
	}
	return &proto.EmptyResponse{}, nil
}
```
