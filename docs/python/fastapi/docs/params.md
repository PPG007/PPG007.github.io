# 参数

## 路径参数

定义路径参数：

```python
@app.get('/items/{id}')
async def get_item(id):
  return {
    "id": id,
    "name": f"Item {id}"
  }
```

然后访问 `http://127.0.0.1:8000/items/foo` 将会看到 JSON 响应：

```json
{
  "id": "foo",
  "name": "Item foo"
}
```

默认情况下的路径参数是字符串类型，可以使用类型注解来指定其他类型：

```python
@app.get('/items/{id}')
async def get_item(id: int):
  return {
    "id": id,
    "name": f"Item {id}",
    "type": type(id).__name__
  }
```

FastAPI 将会自动将路径参数进行转换，如果转换失败将报错。

### 路径匹配

路径匹配是根据顺序依次进行的，因此如果一个固定路径和一个路径参数存在冲突，固定路径应该放在前面：

```python
@app.get('/items/1')
async def get_items():
  return {"id": 1, "name": "Item 1"}

@app.get('/items/{id}')
async def get_item(id: int):
  return {
    "id": id,
    "name": f"Item {id}"
  }
```

同样的，也不能重复地定义路径操作，由于路径优先匹配，始终会使用第一个定义的路径操作。

### 使用枚举

路径参数可以是枚举类型，根据枚举值进行匹配：

```python
from enum import Enum

class ModelName(str, Enum):
  DEEP_SEEK_V4_PRO = "deep_seek_v4_pro"
  DEEP_SEEK_V4_FLASH = "deep_seek_v4_flash"

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
  if model_name == ModelName.DEEP_SEEK_V4_PRO:
    return {
      "model_name": model_name,
      "description": "Deep Seek V4 Pro is a powerful AI model designed for advanced natural language processing tasks."
    }
  elif model_name == ModelName.DEEP_SEEK_V4_FLASH:
    return {
      "model_name": model_name,
      "description": "Deep Seek V4 Flash is a lightweight version of the Deep Seek V4 Pro, optimized for speed and efficiency."
    }
```

上面的枚举类的值是字符串，也可以通过继承不同的类型来定义不通字面量的枚举。

### 带有路径的路径参数

如果路径参数中传入了带有路径的内容，默认情况下访问会报错 404，因为路径参数默认不匹配路径分隔符 `/`。

可以使用由 `Starlette` 提供的选项声明包含路径的路径参数：

```python
@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```

### 参数校验

使用 `Path` 和 `Annotated` 来声明路径参数的校验规则：

```python
@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=0, le=100)],
):
    results = {"item_id": item_id}
    return results
```

详情参考下面的 Query 参数的参数校验部分。

## Query 参数

Query 参数可以直接声明在函数的参数列表中，FastAPI 将会自动进行解析：

```python
@app.get("/search")
async def search(q: str, limit: int = 10):
    return {
        "query": q,
        "limit": limit,
        "results": [f"Result {i+1} for query '{q}'" for i in range(limit)]
    }
```

接下来访问 `http://localhost:8000/search?q=test&limit=3` 就会看到对应的响应。

声明 Query 参数的顺序并不重要，FastAPI 是通过参数名来进行匹配的。

而且也可以同时声明路径参数和 Query 参数：

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = ''):
    return {
        "item_id": item_id,
        "query": q
    }
```

### 必选参数

如果给一个参数设置了默认值，那么这个参数就不是必选的了。

如果只是想把参数设为可选，但又不想指定参数的值，那么就要把默认值设置为 `None`。

```python
@app.get("/items/{item_id}")
async def read_user_item(
  item_id: str, needy: str, skip: int = 0, limit: int | None = None
):
  item = {"item_id": item_id, "needy": needy, "skip": skip, "limit": limit}
  return item
```

### 使用 Pydantic 模型声明 Query 参数

Query 参数也可以是 `Pydantic` 模型类型的，例如一个通用的分页查询参数：

```python
from pydantic import BaseModel, Field
from typing import Literal

class ListRequest(BaseModel):
    page: int = Field(1, gt=0, le=100)
    page_size: int = Field(10, gt=0, le=100)
    order_by: Literal['created_at', 'updated_at'] = 'created_at'

@app.get("/items/")
async def list_items(request: Annotated[ListRequest, Query()]):
    return request
```

使用 `Pydantic` 模型时可以声明禁止接收额外查询参数：

```python
class ListRequest(BaseModel):
    model_config = {
        'extra': 'forbid'
    }
    page: int = Field(1, gt=0, le=100)
    page_size: int = Field(10, gt=0, le=100)
    order_by: Literal['created_at', 'updated_at'] = 'created_at'
```

### 参数校验

如果要给 Query 参数添加更多校验，例如限制字符串长度、数值范围等，可以使用 `Query` 和 `Annotated` 来进行类型声明：

```python
from typing import Annotated
from fastapi import Query

@app.get("/")
async def get_data(q: Annotated[str | None, Query(max_length=10)] = None):
  return {"message": "Hello World"}
```

对于老版本的 FastAPI，由于不支持 `Annotated`，可以直接在 `Query` 中声明默认值：

```python
from fastapi import Query
@app.get("/")
async def get_data(q: str | None = Query(default=None, max_length=10)):
  return {"message": "Hello World"}
```

使用 `Annotated` 有以下优势：

- 更符合 Python 的类型注解规范，参数的类型和校验规则分开声明，更清晰。
- 可以在其他地方直接调用这个函数而不经过 FastAPI。
- 直接调用时仍然有参数校验的功能。

### 列表参数

Query 参数也可以是 list 类型的，例如：

```python
@app.get("/items")
async def get_data(q: Annotated[list[str] | None, Query(max_length=10)] = None):
  return {
    'items': q
  }
```

### 更多元数据

`Annotated` 还可以用来声明更多的元数据，例如 `title`、`description`、`example` 等，这些元数据将会在自动生成的文档中展示。

### 别名参数

如果一个 Query 参数在 URL 中的名字和函数参数的名字不一致，可以使用 `alias` 来声明别名：

```python
@app.get("/items")
async def get_data(q: Annotated[list[str] | None, Query(max_length=10, alias='items')] = None):
  return {
    'items': q
  }
```

### 自定义校验

如果内置的校验选项不能满足需求，可以通过 `Annotated` 使用 `Pydantic` 的 `AfterValidator` 或者 `BeforeValidator` 来实现自定义校验：

```python
from pydantic import AfterValidator

def is_valid_item(item: list[str]) -> list[str]:
  return [i for i in item if i.startswith('item-')]

@app.get("/items")
async def get_data(q: Annotated[list[str] | None, Query(max_length=10, alias='items'), AfterValidator(is_valid_item)] = None):
  return {
    'items': q
  }
```

## Body 参数

### 使用 `Pydantic`

使用 `Pydantic` 模型来声明请求体可以提供更好的数据验证和自动生成文档：

```python
from pydantic import BaseModel

class User(BaseModel):
  name: str
  age: int
  email: str

@app.post('/users')
async def create_user(user: User):
  return {
    "message": "User created successfully",
    "user": user
  }
```

如果请求体类型的某个参数不是必选的，可以通过 `Optional` 来声明：

```python
from typing import Optional

class User(BaseModel):
  name: str
  age: int
  email: Optional[str] = None
```

或者更简单的添加默认值：

```python
class User(BaseModel):
  name: str
  age: int
  email: str | None = None
```

### 混合使用请求体参数、路径参数和查询参数

一个函数可以同时声明请求体参数、路径参数和查询参数，FastAPI 将按照以下规则解析：

- 如果一个参数在路径中声明了，那么它就是路径参数。
- 如果一个参数是 int、float、str、bool 等单一类型，那么就会被当作查询参数。
- 如果一个参数的类型是 `Pydantic` 模型，那么它会被当作请求体。

### 多请求体

FastAPI 也支持在一个函数中声明多个请求体参数：

```python
class Item(BaseModel):
  name: str
  price: float

class User(BaseModel):
  name: str
  age: int

@app.post('/items/')
async def create_item(item: Item, user: User):
  return {
    "item": item,
    "user": user
  }
```

这种情况下，FastAPI 期望有以下格式的请求体：

```json
{
  "item": {
    "name": "Item Name",
    "price": 9.99
  },
  "user": {
    "name": "User Name",
    "age": 30
  }
}
```

### 请求体中的单一值

如果希望用一个基础类型接受请求体中的一个字段，可以使用 `Body` 来声明：

```python
class User(BaseModel):
    name: str
    age: int

@app.post('/items2/')
async def create_item(user: Annotated[User, Body()], name: Annotated[str, Body()]):
  return {
    "name": name
  }
```

FastAPI 期望有以下格式的请求体：

```json
{
  "name": "Item Name",
  "user": {
    "name": "User Name",
    "age": 30
  }
}
```

注意，如果希望不使用 `Pydantic` 模型，直接通过基础类型来声明请求体参数，需要使用 `Any` 类型接受：

```python
from typing import Any
@app.post('/items3/')
async def create_item(name: Annotated[Any, Body()]):
  return {
    "name": name
  }
```

### 嵌入单个请求体参数

如果只有一个请求体参数，但是也希望像上面多请求体一样在请求体中嵌套一个字段，可以使用 `embed` 选项：

```python
@app.post('/items/')
async def create_item(item: Annotated[Item, Body(embed=True)]):
  return {
    "item": item
  }
```

### 字段

通过 `Pydantic` 的 `Field` 来声明请求体参数的字段属性，例如默认值、校验规则、元数据等：

```python
from pydantic import BaseModel, Field
class Item(BaseModel):
  name: str
  description: str | None = Field(default=None, title="The description of the item", max_length=300)
  price: float = Field(gt=0, description="The price must be greater than zero")
  tax: float | None
```

Field 可以用来声明请求体参数的默认值、校验规则、元数据等，这些信息将会在自动生成的文档中展示。

### 嵌套模型

请求体参数也可以是嵌套的 `Pydantic` 模型：

```python
class Address(BaseModel):
  city: str
  country: str

class User(BaseModel):
  name: str
  age: int
  address: Address
```

通过 `Pydantic` 声明嵌套模型，将会自动获得编辑器支持、数据转换、数据校验、自动生成文档等功能。

## Cookie

## Header
