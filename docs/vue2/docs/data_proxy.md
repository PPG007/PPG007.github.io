# 数据代理

## 数据代理基本原理

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
</head>
<body>
    <script>
        let person={
            name:'PPG',
            sex:'male'
        }
        let number=21;
        //默认：不可枚举，不可修改，不可删除
        Object.defineProperty(person,'age',{
            // value:number,
            enumerable:true,//控制属性可枚举
            // writable:true,//控制属性是否能被修改
            configurable:true,//控制属性是否能被删除
            //get、set方法代理了修改、获取属性值，不能和value、writable属性共存
            // 任何获取age属性值的尝试都会走向get方法
            get(){
                return number;
            },
            // 任何修改age属性值的尝试都会走向set
            set(value){
                // 这里也不要添加this关键字
                number=value;
            },
        })
        console.log(person)
    </script>
</body>
</html>
```

## 数据代理

::: tip 数据代理
通过一个对象代理对另一个对象中属性的操作(读/写)。
:::

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        let obj={
            x:100
        };
        let obj2={
            y:200
        };
        //这样，通过obj2就可以获取、修改obj的x属性值了
        Object.defineProperty(obj2,'x',{
            get(){
                return obj.x;
            },
            set(x){
                obj.x=x;
            }
        })
    </script>
</body>
</html>
```

## Vue 中的数据代理

- Vue 中的数据代理：

    通过 Vue 实例代理 data 对象中属性的操作。

- 数据代理的作用：

    更加方便的操作 data 中的数据。

- 基本原理：

    - 通过 `Object.defineProperty()` 把 data 对象中的所有属性添加到 Vue 实例上(其实是先将 Vue 实例的 `_data` 属性赋值成data，`_data` 中也有相应的 getter、setter，只做到这一步(`_data`)只是完成了收集数据(数据劫持)，并没有进行数据代理，将 `_data` 中的内容再代理到实例上，这样在访问 data 中的内容时就可以直接 `Vue实例.属性名`，而不需要 `Vue实例._data.属性名`)。
    - 为每一个添加到 Vue 实例的属性创建 getter、setter。
    - 在 getter、setter 中操作 data 中对应的属性。

- 数据劫持：

    修改对象属性时调用 setter 进行修改并重新渲染模板。
