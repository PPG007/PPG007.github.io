# 日期与时间

Java 标准库中提供了两套日期与时间 API：`java.util.Date` 和 `java.time`。前者较为古老，后者在 Java 8 中引入，提供了更丰富的功能和更好的设计。

::: tip

如果要获取当前时间戳，可以使用 `System.currentTimeMillis()`，它返回自 1970 年 1 月 1 日以来的毫秒数。

:::

## Date 和 Calendar

`java.util.Date` 是用于表示一个日期和时间的对象，实际上是通过保存一个毫秒级的时间戳来实现的。`java.util.Calendar` 则提供了更丰富的日期和时间操作功能，例如获取年、月、日等字段，以及进行日期计算。

Date 的基本用法：

```java
public static void main(String[] args) {
    // 获取当前时间:
    Date date = new Date();
    System.out.println(date.getYear() + 1900); // 必须加上1900
    System.out.println(date.getMonth() + 1); // 0~11，必须加上1
    System.out.println(date.getDate()); // 1~31，不能加1
    // 转换为String:
    System.out.println(date.toString());
    // 转换为GMT时区:
    System.out.println(date.toGMTString());
    // 转换为本地时区:
    System.out.println(date.toLocaleString());
}
```

如果要实现自定义格式化输出，可以使用 `SimpleDateFormat`：

```java
public static void main(String[] args) {
    Date date = new Date();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String formattedDate = sdf.format(date);
    System.out.println(formattedDate);
}
```

### Calendar

```java
public static void main(String[] args) {
    Calendar calendar = Calendar.getInstance();
    System.out.println(calendar.get(Calendar.YEAR));
    System.out.println(calendar.get(Calendar.MONTH) + 1); // 0~11，必须加上1
    System.out.println(calendar.get(Calendar.DATE));
}
```

::: tip

如果通过 `DAY_OF_WEEK` 获取星期几，返回值是 1~7，分别对应周日到周六。

:::

如果想修改一个 `Calendar` 对象的日期，可以使用 `set` 方法：

```java
public static void main(String[] args) {
    Calendar calendar = Calendar.getInstance();
    calendar.set(Calendar.YEAR, 2000);
    System.out.println(calendar.getTime());
}
```

### TimeZone

`Calendar` 支持时区，例如：

```java
public class Main {
    public static void main(String[] args) {
        Calendar now = Calendar.getInstance();
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(calendar.getTimeZone().getID());
        System.out.println(formatter.format(calendar.getTime()));
        calendar.clear();
        calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendar.set(
                now.get(Calendar.YEAR),
                now.get(Calendar.MONTH),
                now.get(Calendar.DAY_OF_MONTH),
                now.get(Calendar.HOUR_OF_DAY),
                now.get(Calendar.MINUTE),
                now.get(Calendar.SECOND)
        );
        System.out.println(calendar.getTimeZone().getID());
        System.out.println(formatter.format(calendar.getTime()));
    }
}
```

`Calendar` 还支持日期计算，例如：

```java
public class Main {
    public static void main(String[] args) {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        calendar.add(Calendar.YEAR, -1);
        System.out.println(formatter.format(calendar.getTime()));
    }
}
```

## LocalDateTime

从 Java 8 开始，`java.time` 提供了新的日期和时间 API，主要类型：

- 本地日期和时间：`LocalDateTime`、`LocalDate`、`LocalTime`。
- 带时区的日期和时间：`ZonedDateTime`。
- 时刻：`Instant`。
- 时区：`ZoneId`、`ZoneOffset`。
- 时间段：`Duration`、`Period`。
- 格式化：`DateTimeFormatter`。

新的 API 严格区分了时刻、本地日期、本地时间和带时区的日期时间，并且运算更加方便，并且修复了不合理的常量设计，例如月份的范围用 1~12 而不是 0~11、星期的范围用 1~7 而不是 0~6。

### LocalDateTime

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(LocalDate.now());
        System.out.println(LocalTime.now());
        System.out.println(LocalDateTime.now());
    }
}
```

`LocalDate`、`LocalTime` 和 `LocalDateTime` 默认都按照 ISO 8601 格式输出。

通过指定的日期和时间创建 `LocalDateTime` 可以使用 `of()` 方法：

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(LocalDate.of(2026, 4, 1));
        System.out.println(LocalTime.of(12, 0, 22));
        System.out.println(LocalDateTime.of(2026, 4, 1, 12, 0, 22));
    }
}
```

将 ISO 8601 字符串解析为 `LocalDateTime`：

```java
public class Main {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        System.out.println(LocalDateTime.parse(now.toString()));
    }
}
```

如果要自定义输出的格式，或者要把一个非 ISO 8601 格式的字符串解析成 `LocalDateTime`，可以使用新的 `DateTimeFormatter`：

```java
public class Main {
    public static void main(String[] args) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        System.out.println(LocalDateTime.parse("2026/04/01 12:00:22", formatter));
    }
}
```

加减操作可以通过链式调用实现了：

```java
public class Main {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime t = now.plusYears(10).minusMonths(6);
        System.out.println(t);
    }
}
```

可以使用 `with` 系列方法设置时间：

```java
public class Main {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        System.out.println(now.withHour(10).withMinute(30));
        System.out.println(now.with(TemporalAdjusters.lastDayOfMonth()));
    }
}
```

### Duration&Period

`Duration` 表示两个时刻之间的时间间隔，`Period` 表示两个日期之间的天数：

```java
public class Main {
    public static void main(String[] args) {
        LocalDateTime start = LocalDateTime.of(2000, 7, 4, 5, 0);
        LocalDateTime now = LocalDateTime.now();
        System.out.println(Duration.between(start, now));
        System.out.println(start.until(now, ChronoUnit.DAYS));
    }
}
```

## ZonedDateTime

`LocalDateTime` 总是表示本地日期和时间，要表示一个带时区的日期和时间，可以使用 `ZonedDateTime`：

```java
public static void main() {
    ZonedDateTime now = ZonedDateTime.now();
    ZonedDateTime utc = ZonedDateTime.now(ZoneId.of("UTC"));
    System.out.println(now);
    System.out.println(utc);
}
```

还可以给 `LocalDateTime` 添加时区信息，转换成 `ZonedDateTime`：

```java
public static void main() {
    LocalDateTime now = LocalDateTime.now();
    ZonedDateTime zdt = now.atZone(ZoneId.of("UTC"));
    System.out.println(zdt);
}
```

### 时区转换

调用 `ZonedDateTime` 的 `withZoneSameInstant()` 方法可以在不改变时刻的情况下转换时区：

```java
public static void main() {
    ZonedDateTime now = ZonedDateTime.now();
    ZonedDateTime utc = now.withZoneSameInstant(ZoneId.of("UTC"));
    System.out.println(now);
    System.out.println(utc);
}
```

从 `ZonedDateTime` 转换为 `LocalDateTime` 可以使用 `toLocalDateTime()` 方法：

```java
public static void main() {
    ZonedDateTime now = ZonedDateTime.now();
    LocalDateTime local = now.toLocalDateTime();
    System.out.println(now);
    System.out.println(local);
}
```

## DateTimeFormatter

使用旧的 Date API 对象时，如果需要格式化需要使用 `SimpleDateFormat`，而新的 Date API 对象使用 `DateTimeFormatter`，与 `SimpleDateFormat` 不同，`DateTimeFormatter` 是不可变的，同时也是线程安全的。

除了手动指定格式之外，`DateTimeFormatter` 还提供了一些预定义的格式：

```java
System.out.println(DateTimeFormatter.ISO_DATE_TIME.format(LocalDateTime.now()));
```

## Instant

计算机中的时间通常是以一个时间点（时刻）来表示的，Java 中的 `Instant` 就是用来表示一个时间点的类，它表示自 1970 年 1 月 1 日以来的秒数和纳秒数：

```java
public static void main() {
    Instant now = Instant.now();
    System.out.println(now.getEpochSecond());
    System.out.println(now.toEpochMilli());
}
```

同时，`Instant` 还提供了与 `LocalDateTime` 和 `ZonedDateTime` 之间的转换方法：

```java
public static void main() {
    Instant now = Instant.now();
    LocalDateTime local = LocalDateTime.ofInstant(now, ZoneId.systemDefault());
    ZonedDateTime zoned = ZonedDateTime.ofInstant(now, ZoneId.systemDefault());
    System.out.println(now);
    System.out.println(local);
    System.out.println(zoned);
}
```

## 最佳实践

### 旧 API 转新 API

如果要将 `Date`、`Calendar` 转换为新的 API，可以先转换为 `Instant`，再转换为 `LocalDateTime` 或 `ZonedDateTime`：

```java
public static void main() {
    Date date = new Date();
    Instant instant = date.toInstant();
    LocalDateTime local = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    ZonedDateTime zoned = ZonedDateTime.ofInstant(instant, ZoneId.systemDefault());
    System.out.println(date);
    System.out.println(local);
    System.out.println(zoned);
}
```

### 新 API 转旧 API

新的时间需要通过获取时间戳的方式转换为旧的 API：

```java
public static void main() {
    LocalDateTime local = LocalDateTime.now();
    Instant instant = local.atZone(ZoneId.systemDefault()).toInstant();
    Date date = Date.from(instant);
    System.out.println(local);
    System.out.println(date);
}
```

新的 `ZoneId` 如果要转换为旧的 `TimeZone`，可以使用 `TimeZone.getTimeZone()` 方法：

```java
public static void main() {
    ZoneId zoneId = ZoneId.systemDefault();
    TimeZone timeZone = TimeZone.getTimeZone(zoneId);
    System.out.println(zoneId);
    System.out.println(timeZone.getID());
}
```

### 在数据库中存储日期和时间

|数据库|旧 API|新 API|
|-|-|-|
|`DATETIME`|`java.util.Date`|`java.time.LocalDateTime`|
|`DATE`|`java.sql.Date`|`java.time.LocalDate`|
|`TIME`|`java.sql.Time`|`java.time.LocalTime`|
|`TIMESTAMP`|`java.sql.Timestamp`|`java.time.LocalDateTime`|
