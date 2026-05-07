# 数据库

## SQLite

Python 内置了对 SQLite 数据库的支持，可以使用 `sqlite3` 模块来操作 SQLite 数据库。以下是一个简单的示例：

```python
import sqlite3

def get_conn():
    return sqlite3.connect('test.db')

def create_table():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def add_user(name, email):
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
        conn.commit()
        cursor.close()
        print("User added successfully.")
    except sqlite3.IntegrityError:
        print("Error: Email already exists.")

def get_users():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email FROM users")
    users = cursor.fetchall()
    for user in users:
        print(f"ID: {user[0]}, Name: {user[1]}, Email: {user[2]}")
    cursor.close()
    conn.close()

def delete_user(user_id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    print("User deleted successfully.")

if __name__ == "__main__":
    create_table()
    add_user("Alice", "alice@example.com")
    add_user("Bob", "bob@example.com")
    print("Current users:")
    get_users()
    delete_user(1)
    print("Users after deletion:")
    get_users()
```

## MySQL
