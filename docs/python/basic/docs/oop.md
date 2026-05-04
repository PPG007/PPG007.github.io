# 面向对象

## 类和对象

Python 中使用 `class` 关键字来定义类：

```python
class Student:
  def study(self):
    print("I am studying.")
  def play(self):
    print("I am playing.")
```

定义好类之后，将它实例化为一个对象：

```python
s = Student()
```

调用对象的方法有两种方式，一种是通过对象实例调用：

```python
s.study()
```

另一种是通过类名调用并传入对象实例作为参数：

```python
Student.study(s)
```

但是这种写法的前提是函数定义时必须包含 `self` 参数，`self` 代表实例对象本身。

Python 中的类构造器是 `__init__` 方法：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def study(self):
    print(f"{self.name} is studying.")
  def play(self):
    print(f"{self.name} is playing.")

student = Student('Alice', 20)
student.study()
student.play()
```

## 访问限制

如果要让内部属性不被外部访问，可以在属性前加上两个下划线 `__`，这样就变成了私有属性：

```python
class Student:
  def __init__(self, name, age):
    self.__name = name
    self.__age = age
  def study(self):
    print(f"{self.__name} is studying.")
  def play(self):
    print(f"{self.__name} is playing.")
student = Student('Alice', 20)
student.study()
student.play()
```

可以通过对象设置 `__name` 和 `__age` 属性，但是这个 `__name` 和 `__age` 和类内部的 `__name` 和 `__age` 是两个不同的属性，内部的 `__name` 被改成了 `_Student__name`，外部的 `__name` 是一个新的属性。

Python 也没有真正限制访问权限的机制，私有属性只是通过名称重整来实现的，仍然可以通过 `_Student__name` 来访问。

## 继承和多态

Python 的类继承非常简单，子类只需要在定义时将父类作为参数传入即可：

```python
class Animal:
  def eat(self):
    print("Animal is eating.")

class Dog(Animal):
  def bark(self):
    print("Dog is barking.")
dog = Dog()
dog.eat()  # 继承了父类的方法
dog.bark()
```

由于 Python 创建对象时不需要指定类型，所以多态可能不太明显，可以使用类型检查来实现多态：

```python
class Animal:
  def eat(self):
    print("Animal is eating.")

class Dog(Animal):
  def eat(self):
    print("Dog is eating.")

class Cat(Animal):
  def eat(self):
    print("Cat is eating.")

def feed(animal):
  if isinstance(animal, Animal):
    animal.eat()
dog = Dog()
cat = Cat()
feed(dog)  # 输出：Dog is eating.
feed(cat)  # 输出：Cat is eating.
```

## 获取对象信息

可以使用 `type()` 函数来获取对象的类型：

```python
s = Student('Alice', 20)
print(type(s))  # 输出：<class '__main__.Student'>
```

`type` 函数返回的是 Class 类型，如果要在 `if` 语句中进行判断，可以用 `types` 模块中定义的常量来判断：

```python
import types

def is_function(obj):
  return type(obj) == types.FunctionType

def is_lambda(obj):
  return type(obj) == types.LambdaType

def is_generator(obj):
  return type(obj) == types.GeneratorType

def is_builtin_function(obj):
  return type(obj) == types.BuiltinFunctionType

def is_int(obj):
  return type(obj) == int

print(is_function(lambda x: x))  # 输出：True
print(is_lambda(lambda x: x))    # 输出：True
print(is_generator((x for x in range(10))))  # 输出：True
print(is_builtin_function(len))  # 输出：True
print(is_int(123))              # 输出：True
```

对于类来说，尤其是有继承的情况下，使用 `isinstance()` 函数更为常用：

```python
class Animal:
  pass
class Dog(Animal):
  pass
dog = Dog()
print(isinstance(dog, Dog))     # 输出：True
print(isinstance(dog, Animal))  # 输出：True
print(isinstance(dog, object))  # 输出：True
```

使用 `dir()` 函数可以获得一个对象的所有属性和方法：

```python
s = Student('Alice', 20)
print(dir(s))
```

这里将会看到很多 `__` 开头和结尾的属性和方法，这些都是有特殊用途的属性和方法，例如 `__len__` 方法返回长度，`len` 函数会调用对象的 `__len__` 方法来获取长度。如果要让上面的 `Student` 类支持 `len()` 函数，可以定义一个 `__len__` 方法：

```python
class Student:
  def __init__(self, name, age):
    self.__name = name
    self.__age = age
  def study(self):
    print(f"{self.__name} is studying.")
  def play(self):
    print(f"{self.__name} is playing.")
  def __len__(self):
    return self.__age

s = Student('Alice', 20)
print(len(s))
```

除了 `len`，Python 还有 `getattr()`、`setattr()` 和 `hasattr()` 函数来获取、设置和检查对象的属性：

```python
s = Student('Alice', 20)
print(getattr(s, '_Student__name'))  # 输出：Alice
setattr(s, '_Student__name', 'Bob')
print(getattr(s, '_Student__name'))  # 输出：Bob
print(hasattr(s, '_Student__name'))  # 输出：True
print(hasattr(s, '_Student__age'))   # 输出：True
print(hasattr(s, '_Student__gender'))  # 输出：False
```

## 实例属性和类属性

在类的方法外面定义的属性是类属性，所有实例共享这个属性：

```python
class Student:
  school = 'ABC University'  # 类属性
  def __init__(self, name, age):
    self.name = name  # 实例属性
    self.age = age    # 实例属性
s1 = Student('Alice', 20)
s2 = Student('Bob', 22)
print(s1.school)  # 输出：ABC University
print(s2.school)  # 输出：ABC University
print(Student.school)  # 输出：ABC University
```

这一部分与 Java 中的静态属性和实例属性类似，类属性在所有实例之间共享，而实例属性是每个实例独有的。

## __slots__

正常情况下，当创建出一个对象实例后，我们可以给这个实例绑定任何属性和方法，这就是动态语言的灵活性。

需要注意的是给一个对象绑定的属性和方法仅对该对象实例有效，其他对象实例是无法访问的。如果需要给所有的实例都绑定方法，需要给类绑定方法：

```python
def info(self):
  return f'{self.name} is {self.age} years old and studies at {self.school}.'

Student.info = info  # 将方法添加到类中
s1 = Student('Alice', 20)
s2 = Student('Bob', 22)
print(s1.info())
print(s2.info())
```

如果想要限制实例的属性，例如只允许给 `Student` 类绑定 `score` 属性和 `info` 方法，可以使用 `__slots__`：

```python
class Student:
  __slots__ = ('score', 'info', 'name', 'age')  # 定义允许的属性
  def __init__(self, name, age):
    self.name = name
    self.age = age

def info(self):
  return f'{self.name} is {self.age} years old and score is {self.score}'

Student.info = info
s1 = Student('Alice', 20)
s1.score = 90
print(s1.info())
```

::: tip

`__init__` 方法中的 `name` 和 `age` 属性也必须在 `__slots__` 中定义，否则会报错。

`__slots__` 只能对当前类起作用，对于继承的子类是无效的，因此除非子类也定义了 `__slots__`，否则子类实例仍然可以绑定任意属性。

:::

## @property

上面的代码中，Student 的 score 属性是直接暴露的，而且也没有任何校验，甚至可以设置负数，为了解决这个问题，可以将这个属性转为私有属性并提供 getter 和 setter 方法：

```python
class Student:
  __slots__ = ('name', 'age', '__score')  # 定义允许的属性
  def __init__(self, name, age):
    self.name = name
    self.age = age
    self.__score = 0  # 初始化私有属性
  def get_score(self):
    return self.__score;
  def set_score(self, score):
    if not isinstance(score, int):
      raise ValueError('score must be an integer!')
    if score < 0 or score > 100:
      raise ValueError('score must between 0 and 100!')
    self.__score = score

s1 = Student('Alice', 20)
s1.set_score(85)
print(s1.get_score())  # 输出: 85
```

但是这样的写法又有点复杂，Python 提供了 `@property` 装饰器来简化这个过程：

```python
class Student:
  __slots__ = ('name', 'age', '__score')  # 定义允许的属性
  def __init__(self, name, age):
    self.name = name
    self.age = age
    self.__score = 0  # 初始化私有属性
  @property
  def score(self):
    return self.__score

  @score.setter
  def score(self, score):
    if not isinstance(score, int):
      raise ValueError('score must be an integer!')
    if score < 0 or score > 100:
      raise ValueError('score must between 0 and 100!')
    self.__score = score

s1 = Student('Alice', 20)
s1.score = 85  # 设置成绩
print(s1.score)  # 输出: 85
```

这样，就可以直接通过 `s1.score` 来访问和设置 `score` 属性了，同时也保证了数据的合法性。

同时，还可以不定义 setter 实现只读属性。

::: danger

特别注意，属性的方法名不要和实例变量重名，例如：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  @property
  def name(self):
    return self.name
```

上面的代码在调用 `s.name` 时，首先转换为方法调用，在执行 `return self.name` 时又被视为访问 self 属性，于是又转换为方法调用，导致无限递归，最终导致栈溢出。

:::

## 多重继承

Python 中一个类可以继承多个类：

```python
class A:
  def method_a(self):
    print("Method A")

class B:
  def method_b(self):
    print("Method B")

class C(A, B):
  def method_c(self):
    print("Method C")

c = C()
c.method_a()  # 输出：Method A
c.method_b()  # 输出：Method B
c.method_c()  # 输出：Method C
```

### MixIn

为了将多个功能组合到一个类中，就可以使用上面的多重继承，这种设计被称为 MixIn。

MixIn 的设计原则是：单一职责，功能单一，尽量不和其他 MixIn 产生依赖关系，这样就可以灵活地组合不同的功能。

这样在设计类的时候，就可以优先考虑通过多重继承来组合不同的功能，而不是通过复杂的类层次结构来实现。

## 定制类

除了前面提到的 `__len__()` 方法之外，Python 的类中还有很多有特殊用途的函数，可以帮助我们定制类。

使用 `__str__()` 方法可以定义当使用 `print()` 函数输出对象时的字符串表示，类似于 Java 中的 `toString()` 方法：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __str__(self):
    return f'Student(name={self.name}, age={self.age})'

s = Student('Alice', 20)
print(s)  # 输出：Student(name=Alice, age=20)
```

`__repr__()` 方法定义了当使用 `repr()` 函数或者在交互式环境中直接输入对象时的字符串表示，通常应该返回一个合法的 Python 表达式：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __repr__(self):
    return f'Student(name={self.name!r}, age={self.age!r})'

s = Student('Alice', 20)
print(repr(s))  # 输出：Student(name='Alice', age=20)
```

也可以直接将 `__repr__` 方法定义为 `__str__` 方法的别名，这样在使用 `print()` 函数输出对象时也会调用 `__repr__()` 方法：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __repr__(self):
    return f'Student(name={self.name!r}, age={self.age!r})'
  __str__ = __repr__

s = Student('Alice', 20)
print(s)  # 输出：Student(name='Alice', age=20)
```

为了让对象支持迭代，可以定义 `__iter__()` 方法，这个方法返回一个迭代对象，然后 `for` 循环会不断调用该对象的 `__next__()` 方法来获取下一个元素，直到遇到 `StopIteration` 退出循环：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __iter__(self):
    return iter((self.name, self.age))
s = Student('Alice', 20)
for attr in s:
  print(attr)
```

如果想让对象通过索引来访问元素，可以定义 `__getitem__()` 方法：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __getitem__(self, index):
    if index == 0:
      return self.name
    elif index == 1:
      return self.age
    else:
      raise IndexError('Index out of range')

s = Student('Alice', 20)
print(s[0])  # 输出：Alice
print(s[1])  # 输出：20
```

由于切片的存在，所以 `__getitem__()` 方法中的 `index` 参数可能是一个整数，也可能是一个切片对象，因此需要进行判断：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __getitem__(self, index):
    if isinstance(index, int):
      if index == 0:
        return self.name
      elif index == 1:
        return self.age
      else:
        raise IndexError('Index out of range')
    elif isinstance(index, slice):
      return (self.name, self.age)[index]
    else:
      raise TypeError('Invalid index type')
s = Student('Alice', 20)
print(s[0])  # 输出：Alice
print(s[1])  # 输出：20
print(s[:])   # 输出：('Alice', 20)
```

与 `__getitem__()` 方法对应的还有 `__setitem__()` 方法，可以通过索引来设置元素，以及 `__delitem__()` 方法可以通过索引来删除元素：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __getitem__(self, index):
    if isinstance(index, int):
      if index == 0:
        return self.name
      elif index == 1:
        return self.age
      else:
        raise IndexError('Index out of range')
    elif isinstance(index, slice):
      return (self.name, self.age)[index]
    else:
      raise TypeError('Invalid index type')
  def __setitem__(self, index, value):
    if isinstance(index, int):
      if index == 0:
        self.name = value
      elif index == 1:
        self.age = value
      else:
        raise IndexError('Index out of range')
    else:
      raise TypeError('Invalid index type')
  def __delitem__(self, index):
    if isinstance(index, int):
      if index == 0:
        del self.name
      elif index == 1:
        del self.age
      else:
        raise IndexError('Index out of range')
    else:
      raise TypeError('Invalid index type')
s = Student('Alice', 20)
print(s[0])  # 输出：Alice
print(s[1])  # 输出：20
s[0] = 'Bob'
s[1] = 22
print(s[0])  # 输出：Bob
print(s[1])  # 输出：22
del s[0]
del s[1]
print(hasattr(s, 'name'))  # 输出：False
print(hasattr(s, 'age'))   # 输出：False
```

正常情况下，调用类的方法或者属性时，如果该方法或者属性不存在，Python 会抛出 `AttributeError` 异常，但是如果定义了 `__getattr__()` 方法，当访问一个不存在的属性时，Python 会调用该方法来处理：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __getattr__(self, attr):
    if attr == 'score':
      return 100  # 返回默认成绩
    raise AttributeError(f"'Student' object has no attribute '{attr}'")
s = Student('Alice', 20)
print(s.score)  # 输出：100
print(s.height)  # 输出：AttributeError: 'Student' object has no attribute 'height'
```

如果是函数，那么 `__getattr__()` 方法应该返回一个函数对象：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __getattr__(self, attr):
    if attr == 'info':
      def info():
        return f'{self.name} is {self.age} years old.'
      return info
    raise AttributeError(f"'Student' object has no attribute '{attr}'")
s = Student('Alice', 20)
print(s.info())  # 输出：Alice is 20 years old.
print(s.height)  # 输出：AttributeError: 'Student' object has no attribute 'height'
```

如果想让一个类对象支持作为函数调用，可以定义 `__call__()` 方法：

```python
class Student:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  def __call__(self, greeting):
    return f'{greeting}, I am {self.name} and I am {self.age} years old.'
s = Student('Alice', 20)
print(s('Hello'))  # 输出：Hello, I am Alice and I am 20 years old.
```

同时，可以使用 `callable()` 函数来判断一个对象是否可调用：

```python
s = Student('Alice', 20)
print(callable(s))  # 输出：True
print(callable(Student))  # 输出：True
print(callable(s.name))  # 输出：False
```

## 枚举类

Python 中要想定义枚举类，需要导入 `enum` 模块，然后枚举类需要继承 `Enum` 类，同时使用 `@unique` 装饰器来保证枚举值的唯一性：

```python
from enum import Enum, unique

@unique
class Weekday(Enum):
  MONDAY = 1
  TUESDAY = 2
  WEDNESDAY = 3
  THURSDAY = 4
  FRIDAY = 5
  SATURDAY = 6
  SUNDAY = 7
```

访问枚举类的成员可以通过成员名称或者成员值来访问：

```python
print(Weekday.MONDAY)  # 输出：Weekday.MONDAY
print(Weekday.MONDAY.name)  # 输出：MONDAY
print(Weekday.MONDAY.value)  # 输出：1
print(Weekday(1))  # 输出：Weekday.MONDAY
print(Weekday['MONDAY'])  # 输出：Weekday.MONDAY
print(Weekday.MONDAY == Weekday(1))  # 输出：True
print(Weekday.MONDAY == Weekday.TUESDAY)  # 输出：False
```

## 元类

Python 作为一种动态语言，函数和类的定义不是编译时定义的，而是运行时动态创建的。

`type` 函数可以查看一个类型或者变量的类型，例如：

```python
class Student:
  def __init__(self, name):
    self.name = name

s = Student("Alice")
print(type(Student))
print(type(s))
```

由于 `Student` 是一个 class，它的类型就是 `type`，而 `s` 是一个实例，它的类型就是 class `Student`：

```text
<class 'type'>
<class '__main__.Student'>
```

`type` 函数既可以返回一个对象的类型，又可以创建出新的类型，例如：

```python
Student = type('Student', (object,), {
  '__init__': lambda self, name: setattr(self, 'name', name),
  '__str__': lambda self: f'Hello, I am a student named {self.name}'
})

s = Student("Alice")
print(s.name)
print(s)
```

要使用 `type` 来创建一个 class，必须传入 3 个参数：

- 第一个参数是 class 的名称。
- 第二个参数是 class 继承的父类集合，注意 Python 支持多重继承，如果只有一个父类，别忘了在 tuple 中加一个逗号，例如 `(object,)`。
- 第三个参数是 class 的方法名称与函数绑定。

### metaclass

除了使用 `type` 动态创建类之外，要控制类的创建行为，还可以使用 metaclass。

metaclass 允许创建类或者修改类，可以把类看作是 metaclass 创建出来的实例，metaclass 就是类的类。

例如，实现给自定义的 Student 类添加一个 `add` 方法：

```python
class StudentMetaclass(type):
  def __new__(cls, name, bases, attrs):
    attrs['add'] = lambda self, value: setattr(self, 'score', getattr(self, 'score', 0) + value)
    return type.__new__(cls, name, bases, attrs)

class Student(metaclass=StudentMetaclass):
  def __init__(self, name):
    self.name = name

s = Student('Alice')
print(s.name)  # Output: Alice
s.add(5)
print(s.score)  # Output: 5
s.add(10)
print(s.score)  # Output: 15
```

其中，metaclass 是类模板，必须继承自 `type`，同时，要应用 metaclass，需要在定义 class 时指定 `metaclass` 参数。

这样，当 Python 解释器在创建 `Student` 时，要通过 `StudentMetaclass.__new__()` 来创建。

`__new__()` 方法接收到的参数依次是：

- 当前准备创建的类的对象。
- 类的名字。
- 类继承的父类集合。
- 类的方法集合。

metaclass 更多的应用在框架设计中，例如 Django 的 ORM 就是通过 metaclass 来实现的。
