# 插入

插入单条数据：

```sql
INSERT INTO customers (CustomerName, ContactName, Address, City, PostalCode, Country)
VALUES ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');
```

插入多条：

```sql
INSERT INTO customers (CustomerName, ContactName, Address, City, PostalCode, Country)
VALUES
    ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway'),
    ('Greasy Burger', 'Per Olsen', 'Gateveien 15', 'Sandnes', '4306', 'Norway'),
    ('Tasty Tee', 'Finn Egan', 'Streetroad 19B', 'Liverpool', 'L1 0AA', 'UK');
```

插入制定列：

```sql
INSERT INTO customers (CustomerName, City, Country)
VALUES ('Cardinal', 'Stavanger', 'Norway');
```
