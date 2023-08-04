# 准备数据库

使用下面的脚本创建数据库：

```sql
create database todo;

use todo;

create table user (
    id bigint not null auto_increment,
    password varchar(20),
    user_id varchar(20),
    created_at timestamp,
    updated_at timestamp,
    primary key (`id`),
    unique (user_id)
);

create table todo(
    id varchar(24),
    user_id varchar(20),
    created_at timestamp,
    updated_at timestamp,
    need_remind boolean,
    content text,
    primary key (`id`),
    foreign key (user_id) references user(user_id)
);

create table remind_setting(
    id bigint not null auto_increment,
    remind_at timestamp,
    last_remind_at timestamp,
    is_repeatable boolean,
    repeat_type varchar(10),
    date_offset bigint,
    todo_id varchar(24),
    primary key (id),
    foreign key (todo_id) references todo(id)
);

create table todo_record(
    id varchar(24),
    todo_id varchar(24),
    created_at timestamp,
    updated_at timestamp,
    remind_at timestamp,
    has_been_done boolean,
    done_at timestamp,
    need_remind boolean,
    user_id varchar(20),
    has_been_reminded boolean,
    primary key (id),
    foreign key (todo_id) references todo(id),
    foreign key (user_id) references user(user_id)
);

create table image(
    id bigint not null auto_increment,
    name text,
    todo_id varchar(24),
    primary key (`id`),
    foreign key (todo_id) references todo(id)
);

create table china_holiday(
    id bigint not null auto_increment,
    date varchar(10),
    is_working_day boolean,
    primary key (id)
);
```

定义下面的结构体：

```go
type User struct {
	Id        int64     `gorm:"primaryKey"`
	Password  string    `gorm:"column:password"`
	UserId    string    `gorm:"column:user_id;unique"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt time.Time `gorm:"column:updated_at;autoUpdateTime"`
}

type Todo struct {
	Id            string    `gorm:"primaryKey"`
	CreatedAt     time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt     time.Time `gorm:"column:updated_at;autoUpdateTime"`
	UserId        string    `gorm:"column:user_id"`
	NeedRemind    bool      `gorm:"column:need_remind"`
	Content       string    `gorm:"column:content"`
	RemindSetting RemindSetting
	Images        []Image
}

type RemindSetting struct {
	Id           int64      `gorm:"primaryKey;autoIncrement"`
	RemindAt     *time.Time `gorm:"column:remind_at"`
	LastRemindAt *time.Time `gorm:"column:last_remind_at"`
	IsRepeatable bool       `gorm:"column:is_repeatable"`
	RepeatType   string     `gorm:"column:repeat_type"`
	DateOffset   int64      `gorm:"column:date_offset"`
	TodoId       string     `gorm:"column:todo_id"`
}

type Image struct {
	Id     int64  `gorm:"primaryKey;autoIncrement"`
	Name   string `gorm:"column:name"`
	TodoId string `gorm:"column:todo_id"`
}
```
