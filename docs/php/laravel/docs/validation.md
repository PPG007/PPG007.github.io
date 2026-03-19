# 参数校验

## Quick Start

使用 `Illuminate\Http\Request` 对象上的 `validate` 方法可以对传入的参数进行校验，如果参数验证通过，代码将继续执行，如果参数验证失败，则会抛出一个 `Illuminate\Validation\ValidationException` 异常，异常对象中包含错误信息。

第一个示例：要求传入的 `name` 参数不能为空，长度不能小于 3 个字符：

```php
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|min:3',
    ]);
    return '';
}
```

除了使用字符串来指定规则外，也可以使用数组来指定规则：

```php
public function store(Request $request)
{
    $request->validate([
        'name' => ['required', 'min:3', 'max:5'],
    ]);
    return '';
}
```

::: tip

对于浏览器的请求，Laravel 将会使用 `redirect()->back()` 方法重定向到上一页并将错误保存到 session；对于 API 的请求，Laravel 将返回 JSON 格式的错误并返回 422 状态码。

因此，如果使用 postman、axios 测试 api 接口的参数校验，需要在请求头内注明当前是 API 请求而不是浏览器请求，

添加以下任一请求头可以表明当前是 API 请求：

```text
Accept: application/json

# or

Content-Type: application/json
```

:::

当一个字段存在多个规则时，如果希望校验到第一个不符合条件的规则后立即停止校验，可以在规则中添加 `bail` ：

```php
public function store(Request $request)
{
    $request->validate([
        'email' => ['bail', 'required', 'min:5', 'ends_with:@gmail.com']
    ]);
    return '';
}
```

如上，如果传入的 email 长度小于 5，那么将不会继续校验 `ends_with` 规则，直接返回错误信息。

使用 `.` 可以为嵌套的参数指定规则：

```php
public function store(Request $request)
{
    $request->validate([
        'email' => ['bail', 'required', 'min:5', 'ends_with:@gmail.com'],
        'passwordSetting.min' => ['required', 'integer', 'min:8'],
        'passwordSetting.max' => ['required', 'integer', 'max:16'],
    ]);
    return '';
}
```

如果参数名称要包含 `.` ，可以使用 `\` 来转义：

```php
public function store(Request $request)
{
    $request->validate([
        'passwordSetting\.test' => ['required']
    ]);
    return '';
}
```

### 自定义错误信息

Laravel 内置的验证规则的错误信息可以在 `lang/en/validation.php` 文件中找到，如果没有此文件，可以使用 `php artisan lang:publish` 命令生成。

### 可选字段

由于 Laravel 默认包含 `Illuminate\Foundation\Http\Middleware\TrimStrings` 和 `Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull` 两个全局中间件，因此如果输入的参数为空字符串或 null 将不会通过校验，例如：

```php
public function store(Request $request)
{
    $request->validate([
        'test' => ['string']
    ]);
    return '';
}
```

如果希望字段为空字符串或 null 时通过校验，可以使用 `nullable` ：

```php
public function store(Request $request)
{
    $request->validate([
        'test' => ['string', 'nullable']
    ]);
    return '';
}
```

## 表单请求验证

### 创建表单请求类

使用 `make:request` 命令可以创建表单请求类，生成的类将位于 `app/Http/Requests` 目录下：

```shell
php artisan make:request CreateAccountRequest
```

创建的类中包含两个方法，`authorize` 方法用来验证当前用户是否有权限访问该请求，`rules` 方法用来定义验证规则：

```php
public function authorize(): bool
{
    return true;
}

public function rules(): array
{
    return [
        'name' => ['required', 'min:3', 'max:10'],
        'passwordSetting.min' => ['required', 'integer', 'min:8']
    ];
}
```

::: tip

`rules` 方法可以通过类型标注的形式来进行依赖注入：

```php
public function rules(AnimalService $animalService): array
{
    $animalService->run();
    return [
        'name' => ['required', 'min:3', 'max:10'],
        'passwordSetting.min' => ['required', 'integer', 'min:8']
    ];
}
```

:::

接下来，只需要在路由方法中使用类型标注将请求声明为上面创建的请求类即可，Laravel 将在路由方法调用前进行校验，因此不必再在控制器方法中重复进行参数校验。

### 额外校验

如果希望在基础校验完成后进行额外的校验，可以通过给表单请求类添加 `after` 方法来完成，此方法应该返回一个 callable 或者闭包的数组：

```php
public function after()
{
    return [
        function (Validator $validator) {
            if ($validator->errors()->has('name')) {
                $validator->errors()->forget('name');
            }
        }
    ];
}
```

`after` 方法返回的闭包数组中的闭包会接收一个 `Illuminate\Validation\Validator` 对象作为参数，此对象中包含错误信息，在传入 callable 对象时，这个对象的 `__invoke` 方法将会收到 `Validator` 对象作为参数并被执行，例如添加一个自定义验证器：

::: code-tabs#form-request-validate

@tab ValidateNothing.php

```php
class ValidateNothing
{
    public function __invoke(Validator $validator)
    {
        if ($validator->errors()->isNotEmpty()) {
            $validator->errors()->add('nothing', 'nothing validation');
        }
    }
}
```

@tab CreateAccountRequest.php

```php
public function after()
{
    return [
        new ValidateNothing(),
        function (Validator $validator) {
            if ($validator->errors()->has('name')) {
                $validator->errors()->forget('name');
            }
        }
    ];
}
```

:::

### 停止校验

表单请求类中，如果希望实现遇到第一个错误时就停止校验剩余字段，可以将 `stopOnFirstFailure` 设置为 true：

```php
protected $stopOnFirstFailure = true;
```

### 表单请求权限认证

`authorize` 方法可以用来限制当前用户是否可以访问该请求，考虑这样一个场景：每个每个用户关联一个角色，每个角色的权限各不相同，请求在前置转发时会设置一个角色请求头，如果希望某个接口只允许某些角色访问，可以在 `authorize` 方法中根据这个请求头判断返回 true 或 false ：

```php
public function authorize(Request $request): bool
{
    return $request->header('x-user-role') === 'manager';
}
```

::: tip

`authorize` 方法也可以通过类型标注的形式来进行依赖注入。

:::

### 自定义表单请求错误信息

可以在表单请求类中定义 `messages` 方法，此方法返回一个数组，数组的键为字段名，值为错误信息：

```php
public function messages()
{
    return [
        'name.required' => 'must provide name',
        'name.min' => 'name must be at least 3 characters',
    ];
}
```

许多 Laravel 内置的验证规则错误消息都包含一个 `:attribute` 占位符（这个占位符可以在自定义错误消息中使用），通过重写 attributes 方法可以将验证消息中的 `:attribute` 占位符替换为自定义属性名：

```php
public function attributes()
{
    return [
        'name' => 'name of account',
        'passwordSetting.min' => 'minimum length of password',
        'passwordSetting.max' => 'maximum length of password',
    ];
}
```

### 数据预处理

如果希望在表单请求数据校验前执行逻辑，可以重写 `prepareForValidation` 方法：

```php
protected function prepareForValidation()
{
    $this->merge([
        'prepare' => true,
    ]);
}
```

如果希望在表单请求数据校验后执行逻辑，可以重写 `passedValidation` 方法：

```php
protected function passedValidation()
{
    $this->merge([
        'passed' => true,
    ]);
}
```

## 手动验证控制

如果不想使用 `Request` 类上的 `validate` 方法，例如可能希望手动控制验证不通过时的行为，此时可以使用 `Validator` 门面类生成一个 validator 实例，使用这个实例手动验证：

```php
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => ['required', 'min:5'],
        'company' => ['required']
    ]);
    if ($validator->fails()) {
        return response()->json([
            'message' => $validator->errors()->all(),
        ], 400);
    }
    return $request->all();
}
```

传递给 `make` 方法的第一个参数是要验证的数据，第二个参数是应用于该数据的验证规则数组。

### 停止校验

在校验多个字段时，如果希望校验到第一个问题字段就停止校验，可以使用 `stopOnFirstFailure` 方法：

```php
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => ['required', 'min:5'],
        'company' => ['required']
    ]);
    if ($validator->stopOnFirstFailure()->fails()) {
        return response()->json([
            'message' => $validator->errors()->all(),
        ], 400);
    }
    return $request->all();
}
```

### 自定义错误信息

`make` 方法可以接收第三个参数来自定义错误信息，格式与表单请求类里的 `messages` 方法返回格式一致：

```php
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => ['required', 'min:5'],
        'company' => ['required']
    ], [
        'required' => ':attribute must set in request',
        'min' => ':attribute is too short'
    ]);
    if ($validator->fails()) {
        return response()->json([
            'message' => $validator->errors()->all(),
        ], 400);
    }
    return $request->all();
}
```

如果想对不同的字段的同一个错误分别自定义，可以使用 `.` 来将字段名与错误信息关联起来：

```php
$validator = Validator::make($request->all(), [
    'name' => ['required', 'min:5'],
    'company' => ['required']
], [
    'company.required' => 'must set company in request',
    'min' => ':attribute is too short'
]);
```

如果想实现表单请求中的 `attributes` 方法的效果，可以将字段映射作为第四个参数传递给 `make` 方法：

```php
$validator = Validator::make($request->all(), [
    'name' => ['required', 'min:5'],
    'company' => ['required']
], [
    'company.required' => 'must set company in request',
    'min' => ':attribute is too short'
], [
    'name' => 'name of the account'
]);
```

### 额外校验

在 `Validator` 实例上使用 after 方法并传入一个闭包或者是一个可执行类的数组，用法与表单请求里的 `after` 方法一致：

```php
$validator->after([
    new ValidateNothing(),
    function (\Illuminate\Validation\Validator $validator) {
        if ($validator->errors()->has('name')) {

        }
    }
]);
```

## 使用校验后的数据

使用  `Validator` 实例的 `validated` 方法，或者使用表单请求类实例的 `validated` 方法可以获取经过校验后的数据：

```php
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => ['required', 'min:5'],
        'company' => ['required']
    ]);
    return $validator->validated();
}
```

::: tip

`validated` 方法返回的字段仅包含被验证的字段，如果一个字段没有对应的校验规则，则不会被返回。

:::

调用 `safe` 方法返回一个 `Illuminate\Support\ValidatedInput` 实例。调用这个实例的 `only`、`except` 和 `all` 方法，以检索经过验证的数据子集或整个经过验证的数据数组：

```php
return $validator->safe()->except(['name']);
```

同时，`ValidatedInput` 实例可以直接用键值访问：

```php
return [
    'name' => $validator->safe()['name'],
];
```

## 错误处理

在 `Validator` 实例上使用 `errors` 方法可以获取一个 `Illuminate\Support\MessageBag` 实例，该实例包含所有验证失败的错误信息：

```php
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => ['required', 'min:5'],
        'company' => ['required']
    ]);
    Log::info('validate', $validator->errors()->all());
    return [
        'name' => $validator->safe()['name'],
    ];
}
```

## 可用的校验规则

[Available Validation Rules](https://laravel.com/docs/12.x/validation#available-validation-rules)

## 自定义校验规则

要创建自定义的校验规则需要创建一个类并继承 `Illuminate\Contracts\Validation\ValidationRule` 类，使用 `make:rule` 命令可以直接创建：

```shell
php artisan make:rule ObjectId
```

创建好的规则类将会保存在 `app/Rules` 目录下，接下来只要重写唯一的 `validate` 方法即可，此方法接收字段名、字段值、一个校验失败时应该调用的回调闭包：

```php
public function validate(string $attribute, mixed $value, Closure $fail): void
{
    if (is_string($value) && strlen($value) === 24 && ctype_xdigit($value)) {
        return;
    }
    $fail(':attribute is not a valid ObjectId');
}
```

接下来使用这个规则：

```php
public function show(Request $request, string $id)
{
    $validator = Validator::make(['id' => $id], [
        'id' => ['required', new ObjectId()],
    ]);
    return $validator->safe()->all();
}
```

如果不想在 `$fail` 闭包里使用错误信息，可以使用 `translate` 方法返回在国际化文件中对应的错误信息：

::: code-tabs#custom-validation-rules-translate

@tab ObjectId.php

```php
public function validate(string $attribute, mixed $value, Closure $fail): void
{
    if (is_string($value) && strlen($value) === 24 && ctype_xdigit($value)) {
        return;
    }
    $fail('validation.objectId')->translate();
}
```

@tab lang/en/validation.php

```php
// ....
'objectId' => 'The :attribute field must be a valid ObjectId.',
// ....
```

:::

如果自定义验证规则类需要访问正在进行验证的所有其他数据，可以实现 `Illuminate\Contracts\Validation\DataAwareRule` 接口。Laravel 会在验证开始前调用 `setData` 方法，并传入所有正在验证的数据：

```php
class ObjectId implements ValidationRule, DataAwareRule
{
    protected $data = [];

    public function setData(array $data)
    {
        $this->data = $data;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        Log::info('validate', $this->data);
        if (is_string($value) && strlen($value) === 24 && ctype_xdigit($value)) {
            return;
        }
        $fail('validation.objectId')->translate();
    }
}
```

如果想获取 Validator 实例，可以实现 `Illuminate\Contracts\Validation\ValidatorAwareRule` 接口：

```php
class ObjectId implements ValidationRule, DataAwareRule, ValidatorAwareRule
{
    protected $data = [];

    protected Validator $validator;

    public function setData(array $data)
    {
        $this->data = $data;
    }

    public function setValidator(Validator $validator)
    {
        $this->validator = $validator;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        Log::info('validate', $this->validator->getData());
        if (is_string($value) && strlen($value) === 24 && ctype_xdigit($value)) {
            return;
        }
        $fail('validation.objectId')->translate();
    }
}
```

默认情况下，当被验证的属性不存在或包含空字符串时，常规验证规则（包括自定义规则）不会运行，要使自定义规则在属性为空时也能运行，该规则必须暗示该属性是必需的，可以在自定义规则类中添加 `public $implicit = true;` 属性，或者在使用 `make:rule` 命令时添加 `--implicit` 选项。

## 条件校验

如果希望在某些情况下才使得一个字段上的校验规则生效，可以使用一些条件校验规则。

`exclude_if` 将在指定的条件满足时跳过校验，下面的校验中，如果 `name` 字段为空时，`company` 字段将不会被校验：

```php
$validator = Validator::make($request->all(), [
    'name' => ['nullable', 'min:5'],
    'company' => ['exclude_if:name,null', 'required']
]);
```

`exclude_unless` 将在指定的条件满足时进行校验，下面的校验中，如果 `name` 字段不为空时，`company` 字段将被校验：

```php
$validator = Validator::make($request->all(), [
    'name' => ['nullable', 'min:5'],
    'company' => ['exclude_unless:name,null', 'required']
]);
```

`sometimes` 将仅在字段存在时进行校验：

```php
$validator = Validator::make($request->all(), [
    'name' => ['nullable', 'min:5'],
    'company' => ['sometimes', 'required'],
]);
```

使用 `Validator` 实例的 `sometimes` 可以实现更复杂的校验逻辑：

```php
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => ['nullable', 'min:5'],
    ]);
    $validator->sometimes('company', ['required'], function (Fluent $input) {
        return strlen($input->get('name')) === 6;
    });
    $validator->validate();
    return $validator->safe()->all();
}
```
