# 使用注解进行参数配置

假设银行有个转账业务，转账的限额可能会根据汇率的变化而变化，我们可以利用注解灵活配置转账的限额，而不用每次都去修改我们的业务代码。

```java
/**定义限额注解
 * @author 16582*/
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface BankTransferMoney {
    double maxMoney() default 10000;
}
```

```java
/**转账处理业务类
 * @author 16582*/
public class BankService {
    /**
     * @param money 转账金额
     */
    @BankTransferMoney(maxMoney = 15000)
    public static void transferMoney(double money){
        System.out.println(processAnnotationMoney(money));

    }
    private static String processAnnotationMoney(double money) {
        try {
            Method transferMoney = BankService.class.getDeclaredMethod("transferMoney",double.class);
            boolean annotationPresent = transferMoney.isAnnotationPresent(BankTransferMoney.class);
            if(annotationPresent){
                BankTransferMoney annotation = transferMoney.getAnnotation(BankTransferMoney.class);
                double l = annotation.maxMoney();
                if(money>l){
                   return "转账金额大于限额，转账失败";
                }else {
                    return"转账金额为:"+money+"，转账成功";
                }
            }
        } catch ( NoSuchMethodException e) {
            e.printStackTrace();
        }
        return "转账处理失败";
    }
    public static void main(String[] args){
        transferMoney(10000);
    }
}
```
