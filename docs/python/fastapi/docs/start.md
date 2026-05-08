# 起步

## 安装 FastAPI

```bash
pip install "fastapi[standard]"
```

## Hello World

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def hello():
  return {
    "message": "Hello, World!"
  }
```

接下来启动服务器：

```bash
fastapi dev
```

访问 `http://127.0.0.1:8000/` 将会看到 JSON 响应。

访问 `http://127.0.0.1:8000/docs` 将会看到自动生成的 Swagger 文档。

## 多个 App

如果有多个 FastAPI 应用实例，可以创建 `pyproject.toml` 文件来指定应用的位置，例如：

```toml
[tool.fastapi]
entry = "main:app"
```

这等价于

```python
from main import app
```

或者给 `fastapi dev` 命令指定应用：

```bash
fastapi dev main.py
```
