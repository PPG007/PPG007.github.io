# CRUD

连接数据库：

```go
var (
	db *gorm.DB
)
func initDB(ctx context.Context) {
	if db != nil {
		return
	}
	mysqlDB, err := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:password@tcp(127.0.0.1:9999)/todo?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db = mysqlDB
}
```

## 创建

创建：

```go
user := &User{
    Password: "1234567890",
    UserId:   "test user id",
}
initDB(ctx)
db.Create(user)
```

创建多条：

```go
users := []User{
    {
        UserId: "test user id1",
    },
    {
        UserId: "test user id2",
    },
}
initDB(ctx)
db.CreateInBatches(users, 100)
```

::: tip

如果创建的记录数量超过了 CreateInBatches 指定的值，那么会通过事务的方式执行。

:::

使用指定的字段创建：

```go
initDB(ctx)
user := &User{
    UserId:   "test user id1",
    Password: "123",
}
db.Select("UserId", "CreatedAt", "UpdatedAt").Create(user)
// 或者指定忽略的字段
db.Omit("Password").Create(user)
```

创建钩子：

```go
func (u *User) BeforeCreate(*gorm.DB) error {
	if u.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		u.Password = string(hashedPassword)
	}
	return nil
}
// 也可以跳过钩子
db.Session(&gorm.Session{SkipHooks: true}).Create(user)
```

关联创建：

```go
initDB(ctx)
id := primitive.NewObjectID().Hex()
todo := &Todo{
    Id:         id,
    UserId:     "test user id1",
    NeedRemind: true,
    Content:    "test",
    RemindSetting: RemindSetting{
        RemindAt:     func() *time.Time { temp := time.Now().AddDate(1, 0, 0); return &temp }(),
        LastRemindAt: nil,
        IsRepeatable: true,
        RepeatType:   "daily",
        DateOffset:   1,
        TodoId:       id,
    },
    Images: []Image{
        {
            Name:   "image1",
            TodoId: id,
        },
        {
            Name:   "image2",
            TodoId: id,
        },
    },
}
// Insert INTO 'todo'...
// Insert INTO 'remind_setting'...
// Insert INTO 'image'...
db.Create(todo)
```

默认值：

```go
type User struct {
  ID   int64
  Name string `gorm:"default:galeone"`
  Age  int64  `gorm:"default:18"`
}
```

::: warning

对于布尔、整型类型，默认值是 false 和 0，如果指定了默认值的情况下又需要有零值的情况，要使用指针。

:::

Upsert 及冲突：

```go
// 冲突时不做任何事，不会报错
db.Clauses(clause.OnConflict{
    DoNothing: true,
}).Create(user)
// 使用 MySQL ON DUPLICATE KEY UPDATE，冲突时执行更新
db.Clauses(clause.OnConflict{
    DoUpdates: clause.Assignments(map[string]interface{}{
        "password": 345,
    }),
}).Create(user)
// 冲突时设置指定的字段，这会触发创建钩子
user := &User{
    UserId:   "test user id1",
    Password: "123",
}
db.Clauses(clause.OnConflict{
    DoUpdates: clause.AssignmentColumns([]string{"Password"}),
}).Create(user)
// 冲突时更新所有字段
db.Clauses(clause.OnConflict{
    UpdateAll: true,
}).Create(user)
```

## 查询

### 检索单个对象

```go
user := &User{}
// SELECT * FROM user ORDER BY id LIMIT 1;
db.First(user)
// SELECT * FROM user LIMIT 1;
db.Take(user)
// SELECT * FROM USER ORDER BY id DESC LIMIT 1;
db.Last(user)
// 获取符合条件的记录条数和错误
result := db.Last(user)
log.Println(result.RowsAffected, result.Error, errors.Is(result.Error, gorm.ErrRecordNotFound))
```

根据主键检索：

```go
// SELECT * FROM user WHERE id = 10;
db.Find(user, 10)
user := User{
    Id: 10,
}
db.Find(&user)
// SELECT * FROM user WHERE id IN (9,10,11);
var users []User
db.Find(&users, []int{9, 10, 11})
```

### 检索全部对象

```go
var users []User
result := db.Find(&users)
log.Println(result.RowsAffected)
```

### 条件

String 条件：

```go
var users []User
db.Where("user_id = ?", "1658272229").Find(&users)
db.Where("user_id <> ?", "1658272229").Find(&users)
db.Where("user_id IN ?", []string{"test user id1"}).Find(&users)
db.Where("user_id LIKE ?", "%222%").Find(&users)
db.Where("user_id = ? AND created_at < ?", "1658272229", time.Now()).Find(&users)
db.Where("created_at BETWEEN ? AND ?", time.Now().AddDate(0, -1, 0), time.Now()).Find(&users)
```

::: warning

如果对象的主键被赋值了，那么查询条件中将不会覆盖这个值，例如：

```go
var user = User{ID: 10}
db.Where("id = ?", 20).First(&user)
// SELECT * FROM users WHERE id = 10 and id = 20 ORDER BY id ASC LIMIT 1
```

这会导致 not found error。

:::

Struct、Map 条件：

```go

```

指定结构体查询字段：

```go

```

内联条件：

```go

```

Not 条件：

```go

```

Or 条件：

```go

```

### 选择特定字段

### 排序

### 分页

### 分组

### distinct

### joins

### scan

## 高级查询

## 更新

## 删除
