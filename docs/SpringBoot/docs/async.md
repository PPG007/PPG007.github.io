# 异步任务

## 开启异步支持

在要使用异步方法的类上(或主启动类上)添加 `@EnableAsync` 注解。

::: tip
`@EnableAsync` 注解主要是为了扫描范围包下的所有 `@Async` 注解。
:::

## 在方法上开启异步

```java
@Async
public void hello(){
    try{
        Thread.sleep(3000);
    } catch (Exception e){
        e.printStackTrace();
    }
    System.out.println("Processing");
}
```
