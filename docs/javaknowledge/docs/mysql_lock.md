# MySQL 锁的分类

## 基于属性分类

- 共享锁：

共享锁又称为读锁，简称 S 锁，当一个事务为数据加上读锁以后，其他事务只能对该数据加读锁，而不能对数据加写锁，直到所有的读锁释放之后其他事务才能进行加写锁，读取数据时不允许修改防止重复读。

- 排它锁：

又称写锁，简称 X 锁，当一个事务为数据加上写锁时，其它请求不能再为数据加任何锁，避免了出现脏数据和脏读的问题。

## 基于粒度分类

- 行级锁：

上锁的时候锁定的是表的某一行或多行，其他事务访问时，只有这些行才不能访问。

- 表级锁：

表锁是指上锁时锁定的对象是整个表，当下一个事务访问该表的时候，必须等待前一个事务释放锁才能进行访问。

- 页级锁：

粒度介于行级锁和表级锁之间，一次锁定相邻的一组记录，会出现死锁。

- 记录锁。
- 间隙锁

属于行锁的一种，锁住的是表记录的某一段区间，边界遵循左开右闭，只会出现在重复读的事务级别中，防止幻读问题。

- 临建锁：

是行锁的一种，是 INNODB 的行锁默认算法，是间隙锁和记录锁的组合，临建锁会把查询出来的记录锁住，同时把查询范围内的所有间隙控件锁住，把相邻的下一个区间也锁住；触发条件：_范围查询并命中，查询命中了索引_，避免了脏读、重复读、幻读问题。

## 基于状态分类

意向锁：让其他事务知道表中已经加锁。

- 意向共享锁：

  当一个事务试图对整个表进行加共享锁之前，首先需要获得这个表的意向共享锁。

- 意向排它锁：

  当一个事务试图对整个表加排它锁之前，首先需要获得这个表的意向排它锁。
