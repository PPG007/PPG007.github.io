# 入门

## 安装

首先需要安装包管理器 [Composer](https://getcomposer.org/download/)，Linux 中可以执行以下命令：

```shell
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```

然后使用下面的命令创建 Yii 应用程序模板：

```shell
composer create-project --prefer-dist yiisoft/yii2-app-basic backend
```

这个命令将会在当前路径的 backend 目录中安装 Yii 应用程序模板的最新稳定版本，如果超时报错可以参考[这里](https://developer.aliyun.com/composer?spm=a2c6h.13651102.0.0.1c881b11A391tF)换源或者使用代理：

```shell
HTTP_PROXY=http://127.0.0.1:8889 composer create-project --prefer-dist yiisoft/yii2-app-basic backend
```

执行下面的命令开启 server：

```shell
php yii serve --port=8888
```

## Hello World

首先在一个 controller 里编写一个接口：

```php
public function actionHello($message = 'Hello')
{
    return $message;
}
```

然后访问：`https://hostname/index.php?r=site/say&message=Hello+World` 即可获取返回值。

也可以直接返回视图：

```php
// 在 views/site 目录下创建一个 hello.php
<?php
use yii\helpers\Html;
?>
<?=Html::encode($message) ?>
// controller
public function actionHello($message = 'Hello')
{
    return $this->render('hello', ['message' => $message]);
}
```

## 表单

首先创建一个模型用于接收和校验数据：

```php
<?php
namespace app\models;

use yii\base\Model;

class EntryForm extends Model
{
    public $name;
    public $email;
    public function rules()
    {
        return [
            [['name', 'email'], 'required'],
            ['email', 'email'],
        ];
    }
}
```

上面 rules 限制了这个类的对象必须要有 name 和 email 属性，并且 email 需要是邮箱格式。

然后编写 controller：

```php
public function actionEntry()
{
    $model = new EntryForm();
    // 要么指定 form-data 的 EntryForm 字段，要么第二个参数传空，原因见 load 方法
    if ($model->load(Yii::$app->request->post(), '') && $model->validate()) {
        return 'ok';
    }
    throw new BadRequestHttpException('invalid params');
}
```

post 请求需要在 header 里加 X-CSRF-Token 字段，这个值可以通过 get 方法调用下面的 action 获取：

```php
public function actionGetToken()
{
    return Yii::$app->request->getCsrfToken();
}
```
