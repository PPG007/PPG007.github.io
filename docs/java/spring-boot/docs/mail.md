# 邮件任务

## 相关依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

## 基础配置

```properties
#注意：QQ邮箱需要配置ssl，发件邮箱要开启SMTP服务
spring.mail.username=demo@163.com
spring.mail.password=YMIRUQKQUVHCVDOB
spring.mail.host=smtp.163.com
spring.mail.protocol=smtps
spring.mail.port=465
```

## 简单使用

```java
@Component
public class SendMail {

    // 静态变量如果直接@Autowired注入会报错，
    // 因为注入发生在实例化之后，
    // 静态变量不需要实例化，
    // 所以静态变量注入的时候容器中没有实例化的Bean可用
    // 但是可以通过非静态set方法进行注入
    private static MailMapper mailMapper;

    private static JavaMailSender javaMailSender;

    @Autowired
    public void setJavaMailSender(JavaMailSender javaMailSender){
        SendMail.javaMailSender=javaMailSender;
    }

    @Autowired
    public void setMailMapper(MailMapper mailMapper) {
        SendMail.mailMapper = mailMapper;
    }


    public static void send() throws MessagingException {
        List<String> list = mailMapper.queryAllMailAddress();

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        /**
        true:开启复杂邮件
        UTF-8：设置编码
        */
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,true,"UTF-8");
        mimeMessageHelper.setSubject("每日N石更");//主题
        mimeMessageHelper.setText("全都可以炸完");//正文
        mimeMessageHelper.setFrom("springbootforppg@163.com");//发件人
        mimeMessageHelper.addAttachment("很大.jpg",new File(ImageUrl.getImageUrl()));//添加附件


        for (String s : list) {
            // 设置收信人
            mimeMessageHelper.setTo(s);
            try{
                // 发送
                javaMailSender.send(mimeMessage);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
```
