---
prev:
  text: 首页
  link: /javathread
---

# 实现多线程的基本方法

## 继承 Thread 类

继承 Thread 类，重写 run() 方法，调用 start 开启线程：

```java
public class ThreadTest extends Thread{
    @Override
    public void run() {
//        不一定立即执行
        for (int i = 0; i < 10; i++) {
            System.out.println("run Thread===>"+i);
        }
    }

    public static void main(String[] args) {
//        创建一个线程对象
        ThreadTest threadTest = new ThreadTest();
//        调用start()方法开启线程
        threadTest.start();
        for (int i = 0; i < 100; i++) {
            System.out.println("run main===>"+i);
        }

    }
}
```

## 实现 Runnable 接口

实现 runnable 接口，重写 run 方法，执行线程需要丢入 runnable 接口实现类，调用 start 方法。

```java
public class Test implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println("run Thread===>"+i);
        }
    }

    public static void main(String[] args) {
        Test test = new Test();
        Thread thread = new Thread(test);
        thread.start();
        for (int i = 0; i < 100; i++) {
            System.out.println("run main===>"+i);
        }
    }
}
```

## 实现 Callable 接口

实现 Callable 接口，重写 call 方法，通过线程池或 FutureTask 执行：

```java
public class CallableDownload implements Callable<String> {
    private String url;
    private String name;

    public CallableDownload(String url, String name) {
        this.url = url;
        this.name = name;
    }

    @Override
    public String call() throws Exception {
        Downloader downloader = new Downloader();
        downloader.download(url,name);
        System.out.println("From "+url+" download "+name);
        return "success";
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CallableDownload downloadImage = new CallableDownload("http://112.126.61.130/download/src/2021.jpg","1283.jpg");
        CallableDownload downloadImage1 = new CallableDownload("http://112.126.61.130/download/src/1.jpg","1.jpg");
//        创建执行服务
        ExecutorService executorService = Executors.newFixedThreadPool(3);
//        提交执行
        Future<String> submit = executorService.submit(downloadImage);
        Future<String> submit1 = executorService.submit(downloadImage1);
//        获取结果
        String result = submit.get();
        String result2 = submit1.get();
//        关闭服务
        executorService.shutdown();
    }
}
class Downloader{
    public void download(String url,String name){
        try {
            FileUtils.copyURLToFile(new URL(url),new File(name));
        } catch (IOException e) {
            System.out.println("thread.Downloader Error");
        }
    }
}
```

FutureTask：

```java
public class CallableDownload implements Callable<String> {
    private String url;
    private String name;

    public CallableDownload(String url, String name) {
        this.url = url;
        this.name = name;
    }

    @Override
    public String call() throws Exception {
        Downloader downloader = new Downloader();
        downloader.download(url,name);
        System.out.println("From "+url+" download "+name);
        return "success";
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CallableDownload downloadImage = new CallableDownload("http://112.126.61.130/download/src/2222.jpg","1283.jpg");
        CallableDownload downloadImage1 = new CallableDownload("http://112.126.61.130/download/src/1.jpg","1.jpg");

        FutureTask<String> stringFutureTask = new FutureTask<String>(downloadImage);
        FutureTask<String> stringFutureTask1 = new FutureTask<String>(downloadImage1);
        new Thread(stringFutureTask).start();
        new Thread(stringFutureTask1).start();
    }
}
class Downloader{
    public void download(String url,String name){
        try {
            FileUtils.copyURLToFile(new URL(url),new File(name));
        } catch (IOException e) {
            System.out.println("thread.Downloader Error");
        }
    }
}
```
