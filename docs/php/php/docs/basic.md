# 基础语法

## PHP 标记

当解析一个文件时，PHP 会寻找起始和结束标记，也就是 `<?php` 和 `?>`，这告诉 PHP 开始和停止解析二者之间的代码，此种解析方式使得 PHP 可以被嵌入到各种不同的文档中去，而任何起始和结束标记之外的部分都会被 PHP 解析器忽略。

PHP 有一个 echo 标记简写 `<?=` 它是更完整的 `<?php echo` 的简写形式。

示例：

```php
<?php
echo "Hello World";
?>

<?= 'Hello World' ?>

<?echo 'this code is within short tags, but will only work '.
    'if short_open_tag is enabled'; ?>
```

第三种情况（短标记），默认是开启的，但是可以通过 php.ini 来禁用，如果 PHP 在被安装时使用了 `--disable-short-tags` 的配置，该功能则是被默认禁用的

::: tip

因为短标记可以被禁用，所以为了程序兼容性应当使用普通标记。

:::

如果文件内容仅仅包含 PHP 代码，最好在文件末尾删除 PHP 结束标记，这可以避免在 PHP 结束标记之后万一意外加入了空格或者换行符，会导致 PHP 输出这些空白，而脚本中此时并无输出的意图。

## 从 HTML 中分离

凡是在一对开始和结束标记之外的内容都会被 PHP 解析器忽略，这使得 PHP 文件可以具备混合内容。 可以使 PHP 嵌入到 HTML 文档中去。

```php
<p>This is going to be ignored by PHP and displayed by the browser.</p>
<?php echo 'While this is going to be parsed.'; ?>
<p>This will also be ignored by PHP and displayed by the browser.</p>
```

处于条件语句中间时，此时 PHP 解释器会根据条件判断来决定哪些输出，哪些跳过。

```php
<?php if ($expression == true): ?>
  This will show if the expression is true.
<?php else: ?>
  Otherwise this will show.
<?php endif; ?>
```

## 指令分隔符

一段 PHP 代码中的结束标记隐含表示了一个分号；在一个 PHP 代码段中的最后一行可以不用分号结束。如果后面还有新行，则代码段的结束标记包含了行结束。
