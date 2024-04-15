# 操作数据库

创建数据库：

```sql
CREATE DATABASE testDB;
```

删除数据库：

```sql
DROP DATABASE testDB;
```

创建表：

```sql
CREATE TABLE Persons (
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
```

根据查询结果创建表：

```sql
CREATE TABLE testTable AS
    (
        SELECT CustomerName, ContactName FROM customers
    )
```

删除表：

```sql
DROP TABLE testTable
```

删除表中的数据但是保留表：

```sql
TRUNCATE TABLE testTable
```

修改表：

```sql
-- 增加一列
ALTER TABLE testTable ADD newColumn int;
-- 删除一列
ALTER TABLE testTable DROP COLUMN newColumn
-- 重命名列
ALTER TABLE testTable RENAME COLUMN productID to id
-- 修改数据类型
ALTER TABLE testTable MODIFY Unit text;
-- 重命名表
ALTER TABLE testDB RENAME testTable
```

字段限制：

```sql
-- 不为 NULL
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255) NOT NULL,
    Age int
);
ALTER TABLE Persons MODIFY COLUMN Age int NOT NULL
-- 字段唯一
CREATE TABLE Persons (
    ID int NOT NULL UNIQUE,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int
);
ALTER TABLE Persons
ADD UNIQUE (ID);
-- 多字段唯一
ALTER TABLE Persons
ADD CONSTRAINT UC_Person UNIQUE (ID,LastName);
-- 主键
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    PRIMARY KEY (ID)
);
ALTER TABLE Persons
ADD PRIMARY KEY (ID);
-- 多字段主键
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    CONSTRAINT PK_Person PRIMARY KEY (ID,LastName)
);
ALTER TABLE Persons
ADD CONSTRAINT PK_Person PRIMARY KEY (ID,LastName);
-- 删除主键
ALTER TABLE Persons
DROP PRIMARY KEY;
-- 外键
CREATE TABLE Orders (
    OrderID int NOT NULL,
    OrderNumber int NOT NULL,
    PersonID int,
    PRIMARY KEY (OrderID),
    FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
);
ALTER TABLE Orders
ADD FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
-- 命名外键
CREATE TABLE Orders (
    OrderID int NOT NULL,
    OrderNumber int NOT NULL,
    PersonID int,
    PRIMARY KEY (OrderID),
    CONSTRAINT FK_PersonOrder FOREIGN KEY (PersonID)
    REFERENCES Persons(PersonID)
);
ALTER TABLE Orders
ADD CONSTRAINT FK_PersonOrder
FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
-- 删除外键
ALTER TABLE Orders
DROP FOREIGN KEY FK_PersonOrder;
-- check
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    CHECK (Age>=18)
);
ALTER TABLE Persons
ADD CHECK (Age>=18);
ALTER TABLE Persons
ADD CONSTRAINT CHK_PersonAge CHECK (Age>=18 AND City='Sandnes');
-- 删除 check
ALTER TABLE Persons
DROP CHECK CHK_PersonAge;
-- 默认值
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    City varchar(255) DEFAULT 'Sandnes'
);
-- 删除默认值
ALTER TABLE Persons
ALTER City DROP DEFAULT;
```

创建索引：

```sql
CREATE INDEX idx_lastname
ON Persons (LastName);
CREATE INDEX idx_pname
ON Persons (LastName, FirstName);
-- 唯一索引
CREATE UNIQUE INDEX idx_lastname
ON Persons (LastName);
```

删除索引：

```sql
ALTER TABLE Persons
DROP INDEX idx_lastname;
```

字段自增：

```sql
CREATE TABLE Persons (
    Personid int NOT NULL AUTO_INCREMENT,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    PRIMARY KEY (Personid)
);
```

设置自增步长：

```sql
ALTER TABLE Persons AUTO_INCREMENT=100;
```

MySQL 支持四种日期类型：

- `DATE`：YYYY-MM-DD
- `DATETIME`：YYYY-MM-DD HH:MM:SS
- `TIMESTAMP`：YYYY-MM-DD HH:MM:SS
- `YEAR`：YYYY 或 YY。

```sql
SELECT * FROM Orders WHERE OrderDate='2008-11-11'
```

创建视图：

```sql
CREATE VIEW BrazilCustomers AS
(SELECT CustomerName, ContactName
FROM customers
WHERE Country = 'Brazil')
```

修改视图：

```sql
CREATE OR REPLACE VIEW BrazilCustomers AS
(SELECT CustomerName, ContactName, City
FROM customers
WHERE Country = 'Brazil')
```

删除视图：

```sql
DROP VIEW BrazilCustomers
```
