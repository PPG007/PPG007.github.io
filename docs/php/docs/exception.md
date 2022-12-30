# 异常

like Java, try, catch, finally.

```php
<?php
function inverse($x) {
    if (!$x) {
        throw new Exception('Division by zero.');
    }
    return 1/$x;
}

try {
    echo inverse(5) . "\n";
} catch (Exception|InvalidArgumentException $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
} finally {
    echo "First finally.\n";
}

try {
    echo inverse(0) . "\n";
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
} finally {
    echo "Second finally.\n";
}

// 继续执行
echo "Hello World\n";
```

从 PHP 7.1.0 起 catch 可以用竖线符（|） 指定多个异常。 如果在不同的类层次结构中，不同异常的异常需要用同样的方式处理，就特别适用这种方式。

从 PHP 8.0.0 起，捕获的异常不再强制要求指定变量名。 catch 代码块会在未指定时继续执行，只是无法访问到抛出的对象。

PHP 8.0.0 起，throw 关键词现在开始是表达式，可用于任何表达式上下文。在此之前，它是语句，必须独占一行。

如果在 try 或 catch 里遇到 return，仍然会执行 finally 里的代码。 而且，遇到 return 语句时，会先执行 finally 再返回结果。 此外，如果 finally 里也包含了 return 语句，将返回 finally 里的值。

## 全局异常处理

```php
<?php
function inverse($x) {
    if (!$x) {
        throw new Exception('Division by zero.');
    }
    return 1/$x;
}
set_exception_handler(function (Throwable $e) {
    echo 'wuhu' . "\n";
});
inverse(0);
```

## 扩展异常处理类

::: danger

不能直接实现 Throwable 接口。

:::

继承 Exception 类：

```php
<?php
class MyException extends Exception
{
    public function __toString(): string
    {
        return self::class . ' ' . $this->message;
    }


}

try {
    throw new MyException("wuhu");
}catch (MyException $e) {
    echo $e . "\n";
}catch (Exception $e) {
    echo 'Exception' . "\n";
}finally {
    echo 'finally' . "\n";
}
```

::: warning

不能 复制 Exception 对象。尝试对 clone Exception 会导致 fatal E_ERROR 错误。

:::

## 错误

PHP 7 改变了大多数错误的报告方式。不同于传统（PHP 5）的错误报告机制，现在大多数错误被作为 Error 异常抛出。

这种 Error 异常可以像 Exception 异常一样被第一个匹配的 try / catch 块所捕获。如果没有匹配的 catch 块，则调用异常处理函数（事先通过 set_exception_handler() 注册）进行处理。 如果尚未注册异常处理函数，则按照传统方式处理：被报告为一个致命错误（Fatal Error）。

Error 类并非继承自 Exception 类，所以不能用 catch (Exception $e) 来捕获 Error。你可以用 catch (Error $e)，或者通过注册异常处理函数（ set_exception_handler()）来捕获 Error。
