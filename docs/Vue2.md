---
description: Vue 2.X Doc
sidebarDepth: 3
---

# Vue 2.X :person_fencing:

## 第一个Vue程序

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
    <div id="root">
        Hello World
        {{name}}
        <hr>
        <a :href='url'>点击前往主页</a>
        <p>{{url.toUpperCase()}}</p>
    </div>

    <script>
        //关闭生产模式提醒(Vue全局配置)
        Vue.config.productionTip = false;
        //一对一
        const vm=new Vue({
            el:'#root',//el指定当前Vue实例为那个容器服务
            data:{//存储数据供el绑定的容器使用
                name:'ppg',
                age:21,
                url:'http://www.fenchingking.top'
            }
        });
    </script>
</body>
</html>
```

::: tip 初识Vue：

- 想让Vue工作，必须创建一个Vue实例，且要传入一个配置对象
- 容器(被绑定的HTML代码块)仍然符合HTML规范，混入了Vue语法
- Vue实例和容器只能是一对一的
- 实际开发中只会有一个Vue实例，并且会配合组件一起使用
- 双大括号({{}})中要写JavaScript表达式，例如{{1+1}}也是可以的，会显示2
- 一旦data中内容发生改变，容器中对应的位置也会改变

:::

### 模板指令

Vue模板有两大类语法：

- 插值语法：
    - 功能：用于解析标签体内容
    - 写法：{{xxx}}，xxx是JavaScript表达式，且可以获取data中的所有属性
- 指令语法：
    - 功能：用于解析标签(标签属性、标签体内容、绑定事件)
    - 举例：v-bind:href='xxx'或简写(仅有v-bind指令可以)为:href='xxx'，xxx同样是JavaScript表达式
    - Vue中有很多指令，形式都是v-xxx

## 数据绑定

Vue中有两种数据绑定方式：

- 单向绑定(v-bind)：数据只能从data流向页面
- 双向绑定(v-model)：数据既能从data流向页面，也能从页面流向data

::: warning 注意：

1. 双向绑定一般应用在表单类元素上
2. v-model:value可以简写成v-model，因为v-model默认收集的就是value的值

:::

### 单向绑定 v-bind

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
    <div id="root">
        单向数据绑定:<input type="text" v-bind:value='name'>
        <hr>
        双向数据绑定:<input type="text" v-model:value='name'>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data:{
                name:'ppg'
            }
        })
    </script>
</body>
</html>
```

### 双向绑定 v-model

> 双向数据绑定：
>
> ​	当数据发生变化，视图也发生变化，当视图发生变化，数据也会跟着变化

使用`v-mdoel`指令在表单input、select、textarea上创建双向数据绑定

**v-model只能用于绑定==表单类元素==**

- 绑定input

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>demo</title>
		<script src="./vue.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<div id="demo">
			<input type="text" name="text" id="text" value="" v-model="text"/>{{text}}
		</div>
		<script type="text/javascript">
			let vm=new Vue({
				el:"#demo",
				data:{
					text:""
				}
			})
		</script>
	</body>
</html>
```

- 绑定单选框

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>demo</title>
		<script src="./vue.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<div id="demo">
			<input type="radio" name="radio" id="radio1" value="A" v-model="choice"/>A
			<input type="radio" name="radio" id="radio2" value="B" v-model="choice"/>B
			<p>你选择了：{{choice}}</p>
		</div>
		<script type="text/javascript">
			let vm=new Vue({
				el:"#demo",
				data:{
					choice:""
				}
			})
		</script>
	</body>
</html>
```

- 绑定多个多选框

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>demo</title>
		<script src="./vue.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<div id="demo">
			<input type="checkbox" name="" id="c1" value="A" v-model="choices"/>A
			<input type="checkbox" name="" id="c2" value="B" v-model="choices"/>B
			<input type="checkbox" name="" id="c3" value="C" v-model="choices"/>C
			<input type="checkbox" name="" id="c4" value="D" v-model="choices"/>D
			<li v-for="choice in choices">
				{{choice}}
			</li>
		</div>
		<script type="text/javascript">
			let vm=new Vue({
				el:"#demo",
				data:{
					choices:[]
				}
			})
		</script>
	</body>
</html>
```

- 绑定select

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>demo</title>
		<script src="./vue.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<div id="demo">
			<select v-model="choice">
				<option value ="" disabled>请选择</option>
				<option value="A">A</option>
				<option value ="B">B</option>
				<option value ="C">C</option>
			</select>
			<p>你选择了：{{choice}}</p>
		</div>
		<script type="text/javascript">
			let vm=new Vue({
				el:"#demo",
				data:{
					choice:"123"
				}
			})
		</script>
	</body>
</html>
```

> 注意：
>
> ​		如果v-model表达式的初始值未能匹配任何选项，select元素将被渲染为未选中状态

#### v-model修饰符

- .lazy

> 在默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步 (除了输入法组织文字时)。你可以添加 `lazy` 修饰符，从而转为在 `change` 事件（失去焦点）_之后_进行同步：

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" />
```

- .number

> 如果想自动将用户的输入值转为数值类型，可以给 `v-model` 添加 `number` 修饰符：

```html
<input v-model.number="age" type="number" />
```

- .trim

> 如果要自动过滤用户输入的首尾空白字符，可以给 `v-model` 添加 `trim` 修饰符：

```html
<input v-model.trim="msg" />
```

#### 收集表单数据总结

> 如果输入框是text，则v-model绑定的就是value值，value值就是用户输入的值
>
> 如果输入框是radio，则v-model绑定的就是value值，要给标签配置value属性
>
> 如果是多选框，：
>
> 1. 没有配置input的value属性，那么v-model绑定的是checked，是布尔值
> 2. 配置了value属性：
>    1. 绑定的数据类型不是数组，那么收集的是checked
>    2. 如果是数组，那么收集的就是每个CheckBox的value

## el与data的两种写法

> 1. el有两种写法：
>    1. 创建Vue实例时指定el
>    2. 先创建Vue实例，通过Vue实例.$mount('#root')进行挂载指定el
> 2. data有两种写法：
>    1. 对象式
>    2. 函数式
>    3. 对象式函数式共存的时候，只有函数式才会生效

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
    <div id="root">
        <h1>Hello,{{name}}</h1>
    </div>

    <script>
        const vm=new Vue({
            // el:'#root',
            // data:{
            //     name:'PPG007'
            // }
            data() {
                return {
                    name:'PPG007'
                }
            },
        })
        vm.$mount('#root')
    </script>
</body>
</html>
```

## MVVM模型

### M

M(Model)模型：对应data中的数据

### V

V(View)视图：模板

### VM

VM(ViewModel)视图模型：Vue实例对象，进行数据绑定和DOM监听

> data所有的属性都出现在了VM实例上
>
> VM实例的所有属性都可以写在插值语句中

## 数据代理

### 数据代理基本原理

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

### 数据代理

> 数据代理：通过一个对象代理对另一个对象中属性的操作(读/写)

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

### Vue中的数据代理

> 1. Vue中的数据代理：
>
>    ​	通过Vue实例代理data对象中属性的操作
>
> 2. 数据代理的作用
>
>    ​	更加方便的操作data中的数据
>
> 3. 基本原理：
>
>    1. 通过Object.defineProperty()把data对象中的所有属性添加到Vue实例上(其实是先将Vue实例的_data属性赋值成data，\_data中也有相应的getter、setter，只做到这一步(\_data)只是完成了收集数据(数据劫持)，并没有进行数据代理，将\_data中的内容再代理到实例上，这样在访问data中的内容时就可以直接 Vue实例.属性名，而不需要Vue实例.\_data.属性名)
>    2. 为每一个添加到Vue实例的属性创建getter、setter
>    3. 在getter、setter中操作data中对应的属性
>
> 4. 数据劫持：
>
>       修改对象属性时调用setter进行修改并重新渲染模板

## 事件

### 事件处理

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
    <div id="root">
        <h2>Hello {{name}}</h2>
        <button v-on:click="showInfo($event,123)">点击提示信息</button>
        <button @click="showInfo($event,456)">点击提示信息</button>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    name:'PPG',
                }
            },
            methods: {
                showInfo(event,number){
                    console.log(event)
                    console.log(number)
                    alert("Hello");
                }
            },
        })
    </script>
</body>
</html>
```

>1. 使用v-on指令绑定事件，可以简写为@XXX，XXX是事件的名字
>2. 事件的毁掉需要配置在methods对象中
>3. methods中的函数不要使用箭头函数，否则this就不是Vue实例了
>4. methods中的函数都是被Vue所管理的函数，this指向是Vue实例或组件实例对象
>5. 为了防止事件对象丢失，要使用$event进行占位

### 事件修饰符

> Vue中的事件修饰符：
>
> 1. prevent：阻止默认事件，例如阻止a标签跳转
> 2. stop：阻止事件冒泡，例如div标签和内部的button同时有点击事件，使用stop修饰后，点击按钮只会执行按钮的点击事件
> 3. once：事件只触发一次，点击后在刷新前不能再次点击
> 4. capture：使用事件的捕获模式，捕获后立即执行(事件触发时，先从DOM根开始向下找到点击的元素，期间可能穿过了其他拥有点击事件的上层模块，向下的这个过程称为捕获，到达目标元素后开始向上执行点击事件称为冒泡，默认先执行内部元素的点击事件)
> 5. self：只有event.target是当前操作的元素时才触发事件，也能阻止冒泡
> 6. passive：事件将会被立即执行，默认情况下，先执行点击事件函数，然后才执行事件、
>
> ==修饰符可以连着写(.stop.once)==

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
        .demo1{
            height: 100px;
            background-color: aqua;
        }
        *{
            margin-top: 20px;
        }
        .box1{
            padding: 5px;
            background-color: skyblue;
        }
        .box2{
            padding: 5px;
            background-color: orange;
        }
        .list{
            width: 200px;
            height: 200px;
            background-color: peru;
            overflow: auto;
        }
        li{
            height: 100px;
        }
    </style>
</head>
<body>
    <div id="root">
        <h2>Hello {{name}}</h2>
        <a href="https://www.baidu.com" @click.prevent="showInfo">What's up</a>

        <div class="demo1" @click="showInfo">
            <button @click.stop="showInfo">点我</button>
        </div>

        <button @click.once="showInfo">点我</button>

        <div class="box1" @click.capture="showMsg(1)">
            div1
            <div class="box2" @click="showMsg(2)">
                div2
            </div>
        </div>

        <div class="demo1" @click.self="showInfo">
            <button @click="showInfo">点我</button>
        </div>
        <!-- @wheel鼠标滚轮 -->
        <!-- @scroll滚动条 -->
        <ul class="list" @wheel.passive="demo">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
        </ul>
    </div>
    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    name:'PPG'
                }
            },
            methods: {
                showInfo(event){
                    // event.preventDefault();
                    // event.stopPropagation();

                    alert("Hello");
                },
                showMsg(msg){
                    console.log(msg);
                },
                demo(){
                    for (let index = 0; index < 100000; index++) {
                        console.log("#");
                    }
                    console.log("over")
                }
            },
        })
    </script>
</body>
</html>
```

### 键盘事件

> 1. Vue中常用按键别名：
>    1. 回车：enter
>    2. 删除：delete，包含删除和退格
>    3. 退出：esc
>    4. 空格：space
>    5. 换行：tab，由于tab默认功能是切换焦点，如果绑定的是keyup事件，将不会出发，因此应当绑定keydown事件
>    6. 上：up
>    7. 下：down
>    8. 左：left
>    9. 右：right
>2. Vue中未提供别名的按键，可以使用按键原始的key值(调用==event.key==查看按键名，调用==event.keyCodes==查看按键编码)，使用按键名时要注意不能使用驼峰命名，而应当使用xxx-yyy且全为小写，这与Vue修改CSS中的修改属性名规则也是相同的
> 3. 系统修饰键：ctrl、alt、shift、meta(Windows中的win键)：
>   1. 配合keyup使用时，按下修饰键的同时，按下任意其他按键，随后释放其他按键事件才会被触发
>    2. 配合keydown使用：正常触发
>    3. 如果要指定keyup时的另一个按键，可以在这四个修饰符后再添加指定的按键==(.ctrl.y)指定ctrl+y才触发==
> 4. 可以使用keyCode指定具体按键(不推荐，逐渐失去浏览器支持)
> 5. 可以使用Vue.config.KeyCodes.自定义键名=按键编码定制按键别名
> 6. 添加exact修饰符，在有且只有操作指定按键时才会触发

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
    <div id="root">
        <h2>Hello,{{name}}</h2>
        <input type="text" placeholder="按下回车提示输入" @keyup.ppg="showInfo">
    </div>

    <script>
        Vue.config.keyCodes.ppg=13;
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    name:'PPG'
                }
            },
            methods: {
                showInfo(event){
                    // if(event.keyCode!==13) return
                    console.log(event.target.value);
                }
            },
        });
    </script>
</body>
</html>
```

### 鼠标按钮修饰符

鼠标按钮修饰符：

- .left
- .middle
- .right

```html
<input type="button" name="submit" id="submit" value="提交" @click.middle='submit'>
```

## 计算属性

>**methods和computed中方法不要重名**
>
>methods中定义的是方法，调用时要加括号，而且每次调用返回值是重新计算的
>
>computed中定义的是属性，调用时不加括号，每次调用返回值不会重新计算，除非它所依赖的内容发生改变
>
>计算属性相当于==缓存==

### 计算属性示例

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
    <div id="root">
        姓:<input type="text" v-model:value="firstName">
        <hr>
        名:<input type="text" v-model:value="lastName">
        <hr>
        <span>姓名：{{name}}</span>
        <hr>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    firstName:'',
                    lastName:'',

                }
            },
            computed:{
                name:{
                    // 初次读取
                    // 所依赖的数据发生变化
                    get(){
                        // 此处this是vm
                        return this.firstName+"-"+this.lastName;
                    }
                    //可以不写set方法，如果不写set方法，将不能修改对应的属性
                }
            }
        })
    </script>
</body>
</html>
```

#### get方法调用时机：
>
> - 初次读取时会执行一次
> - 当依赖的数据发生改变时会被再次调用
>
> 计算属性原理：
>
> - 与数据代理类似，借助getter、setter实现
>
> **计算属性最终会出现在Vue实例上，可以直接调用**

### 计算属性简写

```javascript
const vm=new Vue({
    el:'#root',
    data() {
        return {
            firstName:'',
            lastName:'',

        }
    },
    computed:{
        name(){
			//相当于getter
            return this.firstName+"-"+this.lastName;
        }
    }
})
```

**==一个计算属性中不能操作自己，包括调用和赋值，会无限递归出错==**

## 监视属性

### 基本用法

==handler==方法中第一个参数是新值，第二个是旧值，不可交换顺序

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
    <div id="root">
        <h2>今天天气很{{info}}</h2>
        <hr>
        <button @click="change">切换天气</button>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    isHot:true,
                }
            },
            computed:{
                info(){
                    return this.isHot?'炎热':'寒冷'
                }
            },
            methods: {
                change(){
                    this.isHot=!this.isHot
                }
            },
            watch:{
                isHot:{
                    immediate:false,//设为true时，初始化时就调用
                    handler(newValue,oldValue){
                        console.log("旧值："+oldValue)
                        console.log("新值："+newValue)
                    }
                }
            }
        })
        //监视属性的第二种写法
        // vm.$watch('isHot',{
        //         handler(newValue,oldValue){
        //         console.log("旧值："+oldValue)
        //         console.log("新值："+newValue)
        //     }
        // })
    </script>
</body>
</html>
```

> 监视属性watch
>
> 1. 当被监视的属性发生变化时，回调函数自动调用
> 2. 监视的属性必须存在
> 3. 监视的两种写法：
>    1. 创建Vue实例时传入watch配置
>    2. 通过vm.$watch监视，第一个参数是要监视的属性名，**要使用引号包裹**，第二个参数与第一种写法一致

### 深度监视

现在有如下HTML代码

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
    <div id="root">
        <h2>今天天气很{{info}}</h2>
        <hr>
        <button @click="change">切换天气</button>
        <hr>
        <h2>a:{{numbers.a}}</h2>
        <button @click="numbers.a++">点我加一</button>
        <hr>
        <h2>b:{{numbers.b}}</h2>
        <button @click="numbers.b++">点我加一</button>
    </div>
</body>
</html>
```

- 如果要只监视a的变化：

```javascript
// 监视多级结构中某个属性的变化
//这里必须加引号，平时不加是因为简写，但是多层次不连续的属性名不能简写
'numbers.a':{
    handler(newValue,oldValue){
        console.log("旧值："+oldValue)
        console.log("新值："+newValue)
    }
},
```

- 如果要能够监视numbers中任意值的变化：

```js
// 以下写法无法监视a、b
// numbers:{

// }
numbers:{
    //开启深度监视
    deep:true,
    handler(newValue,oldValue){
        console.log("旧值："+oldValue)
        console.log("新值："+newValue)
    }
}
```

> 深度监视
>
> 1. Vue中watch默认不监视对象的内部值的变化
> 2. 配置deep属性为true可以监测对象内部值的变化
> 3. Vue自身可以监测对象内部值的改变，但Vue提供的watch默认不可以
> 4. 使用watch时根据数据的具体结构决定是否采用深度监视

### 监视的简写形式

简写时，只有handler中的内容，不能配置其他参数

```javascript
watch:{
    isHot(newValue,oldValue){
        console.log("旧值："+oldValue)
        console.log("新值："+newValue)
    }
}
//或者
vm.$watch('isHot',function(newValue,oldValue){
    console.log("旧值："+oldValue)
    console.log("新值："+newValue)
})
```

### 计算属性与监视属性的区别与联系

> 区别：
>
> 1. 计算属性能完成的，监视属性一定也能完成
> 2. 监视属性能完成的，计算属性不一定能完成，例如异步操作
>
> 两个原则：
>
> 1. 所有被Vue管理的函数，最好写成普通函数，这样this的指向才是Vue实例或组件的实例对象‘
> 2. 所有不被Vue锁管理的函数(定时器回调函数，ajax回调函数)，最好写成箭头函数，这样其中的this的指向才是Vue实例或者组件实例对象

## 绑定class与style

### 绑定class样式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>

    <style>
        .basic{
            height: 100px;
            width: 500px;
            border: 2px;
            border-color: black;
            border-style: solid;
        }
        .a{
            background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
        }
        .b{
            background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
        }
        .c{
            background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
        }
        .font1{
            font-size: 30px;
            background-color: skyblue;
        }
        .font2{
            font-size: 50px;
            text-shadow: 10px 10px 10px;
            background-color: skyblue;
        }
        .font3{
            font-size: 50px;
            background-color: skyblue;
            border-radius: 20px;
        }
    </style>
</head>
<body>
    <div id="root">
        <div @click="changeStyle" :class="color" class="basic">
            {{name}}
        </div>
        <hr>
        <div :class="classes" class="basic">
            {{name}}
        </div>

        <hr>
        <div :class="classesObj" class="basic">
            {{name}}
        </div>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    name:"PPG",
                    color:"",
                    classes:['font1','font2','font3'],
                    classesObj:{
                        // 默认都是false
                        font1:false,
                        font2:true,
                        font3:true
                    }
                }
            },
            methods: {
                changeStyle(){
                    const arr=['a','b','c'];
                    this.color=arr[Math.floor(Math.random()*3)]
                }
            },
        })
    </script>
</body>
</html>
```

> 三种写法总结：
>
> 1. 字符串写法：适用于样式的类名不确定，需要动态指定
> 2. 数组写法：适用于要绑定的样式个数不确定，名字也不确定
> 3. 对象写法：适用于要绑定的样式个数确定，名字也确定，但要动态决定用不用

### 绑定style样式

```html
<div class="basic" v-bind:style='styleObj'>
    {{name}}
</div>
<div class="basic" v-bind:style='[styleObj,styleObj2]'>
    {{name}}
</div>

<script>
    const vm=new Vue({
        el:'#root',
        data() {
            return {
                name:"PPG",
                styleObj:{
                    //必须使用驼峰命名
                    backgroundImage: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)'
                },
                styleObj2:{
                    //必须使用驼峰命名
                    fontSize:'100px'
                }
            }
        },
    })
</script>
```

> 与绑定class样式类似，即可以使用字符串写法，也可以使用数组写法，但是要注意：
>
> 1. 写在Vue中的属性名必须采用==驼峰命名==
> 2. 属性值要使用引号

## 条件渲染v-if

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
    <div id="root">
        <h2 v-show="flag">欢迎{{name}}</h2>
        <h2 v-if="flag">欢迎{{name}}</h2>

        <h2>当前n的值为：{{n}}</h2>
        <button v-on:click='n++'>点我</button>
        <div v-if="n===1">C</div>
        <div v-else-if="n==2">C++</div>
        <div v-else>JAVA</div>

        <!--template只能使用v-if不能使用v-show，template不影响页面的结构，即template不会出现在渲染后的页面中而把内部元素直接暴露出来-->
        <template v-if="n===3">
            <h2>A</h2>
            <h2>B</h2>
            <h2>C</h2>
        </template>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    name:'PPG',
                    flag:true,
                    n:0
                }
            },
        })
    </script>
</body>
</html>
```

> 1. v-if：
>
>    写法：
>
>    1. v-if='表达式'
>    2. v-else-if='表达式'
>    3. v-else
>
>    适用于切换频率较低的场景
>
>    特点：不展示的DOM元素直接被移除
>
>    注意：v-if可以和v-else-if、v-else组合使用，但是其中结构不能被打断
>
> 2. v-show：
>
>    写法：
>
>    ​	v-show='表达式'
>
>    适用于切换频率较高的场景
>
>    特点：不显示的DOM元素没有被移除，只是设置了display:none
>
> 3. 使用v-if时，元素可能无法获取到，但使用v-show一定可以

## 列表渲染

### 基本列表

现有如下数据：

```js
const vm=new Vue({
    el:'#root',
    data() {
        return {
            persons:[
                {id:"1",name:"CTY"},
                {id:'2',name:'ZCH'},
                {id:'3',name:'ZZL'}
            ],
            admin:{
                name:"PPG",
                age:21,
                sex:'male'
            },
            str:'hello world'
        }
    },
})
```

遍历数组

```html
<!-- 遍历数组 -->
<h2>人员列表</h2>
<ul>
    <li v-for="(item,index) in persons" :key="index">
        {{item.id}}-{{item.name}}
    </li>
</ul>
```

遍历对象

```html
<!-- 遍历对象 -->
<h2>遍历对象</h2>
<ul>
    <li v-for="(value,key,index) in admin" v-bind:key='index'>
        {{value}}--{{key}}--{{index}}
    </li>
</ul>
```

遍历字符串

```html
<!-- 遍历字符串 -->
<h2>遍历字符串</h2>
<ul>
    <li v-for="(char,index) in str" :key='index'>
        {{char}}--{{index}}
    </li>
</ul>
```

遍历指定数

```html
<!-- 遍历指定次数 -->
<h2>遍历指定次数</h2>
<ul>
    <li v-for="(item,index) in 10">
        {{item}}--{{index}}
    </li>
</ul>
```

### key的作用和原理

#### 示例

现有如下界面:

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
    <div id="root">
        <!-- 遍历数组 -->
        <h2>人员列表</h2>
        <button @click.once="addOne">添加一个人</button>
        <ul>
            <li v-for="(item,index) in persons" :key="index">
                {{item.id}}-{{item.name}}
                <input type="text" >
            </li>
        </ul>
        <hr>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    persons:[
                        {id:"1",name:"CTY"},
                        {id:'2',name:'ZCH'},
                        {id:'3',name:'ZZL'}
                    ],
                    admin:{
                        name:"PPG",
                        age:21,
                        sex:'male'
                    },
                    str:'hello world'
                }
            },
            methods: {
                addOne(){
                    const p={id:'4',name:'TEST'};
                    this.persons.unshift(p)
                }
            },
        })
    </script>
</body>
</html>
```

点击按钮后添加一个人，添加函数是将新人添加到原数组的头部，此时数组中所有元素的下标都发生了改变，若使用遍历index做key值，且已经在每行的输入框中输入了内容，点击添加按钮后，经过重新渲染，新人出现在了头部，但是原先的input却没有发生改变：

添加前：

![添加前](/vue/image-20210725175433106.png)

添加后：

![添加后](/vue/image-20210725175456235.png)

原因分析：

> 用户操作的是真实DOM，Vue渲染时是从虚拟DOM转换为真实DOM，此时虚拟DOM中的input元素没有value值，使用index做key值的时候(key值只对Vue内部可见，用于DOM比较算法)，添加新人后进行DOM比较，此时新人的li标签的key值成了0，于是Vue去寻找此前的虚拟DOM中key值为0的元素，找到1-CTY这一条数据，经过比较，Vue认为人物信息发生了变化，所以人物信息使用了新的人，而li中的第二个元素input输入框由于都没有value属性，Vue认为输入框没有改变，于是使用之前的输入框，即不做修改直接保留，剩下的同理，也就是说更新DOM时只更新了一部分导致了问题，如果同样使用index做key值，但是添加的时候加在数组尾部就不会出现这个问题，因为其他元素没有受到影响

**注意：使用index做key值时==不一定会出问题==，但是要注意如果原数据排序因为新数据发生了修改就会出现上面的问题**

#### 总结

1. 虚拟DOM中key的作用：

   key值时虚拟DOM对象的标识，当数据发生变化时，Vue会根据==新数据==生成==新的虚拟DOM==，随后Vue进行==新虚拟DOM==与==旧虚拟DOM==的差异比较

2. 对比规则：

   1. 旧虚拟DOM中找到了与新虚拟DOM相同的key：
      1. 若虚拟DOM中的内容没变，直接使用之前已经渲染过的真实DOM
      2. 若虚拟DOM内容改变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM
   2. 旧虚拟DOM中未找到与新虚拟DOM相同的key：
      1. 创建新的真实DOM，渲染到页面

3. 用index做key会引发的问题：

   1. 如果对数据进行诸如逆序添加、逆序删除等破坏顺序的操作：

      ​	会产生没有必要的真实DOM更新==>页面效果正常，效率低

   2. 如果结构中还包含输入类DOM：

      ​	会产生错误的DOM更新==>页面有问题

4. 如何选择key？

   1. 最好使用每条数据的唯一标识做key，例如id、手机号、身份证号等
   2. 如果不存在对数据的逆序添加、逆序删除等破坏顺序的操作，仅用于渲染列表用于展示，使用index做为key也是可以的

### 列表过滤

有如下页面，输入字符，模糊搜索

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
    <div id="root">
        <!-- 列表过滤 -->
        <h2>人员列表</h2>
        <input type="text" placeholder="输入名字查询" v-model:value="keyWord">
        <ul>
            <li v-for="(item,index) in persons" :key="index">
                {{item.id}}-{{item.name}}

            </li>
        </ul>
        <hr>
    </div>
</body>
</html>
```

监视属性实现：

```js
const vm=new Vue({
    el:'#root',
    data() {
        return {
            persons_source:[
                {id:"1",name:"CTY"},
                {id:'2',name:'ZCH'},
                {id:'3',name:'ZZL'}
            ],
            keyWord:'',
            persons:[]
        }
    },
    methods: {
        addOne(){
            const p={id:'4',name:'TEST'};
            this.persons.unshift(p)
        }
    },
    watch:{
        keyWord:{
            immediate:true,
            handler(newValue,oldValue){
                if(newValue===""){
                    this.persons=this.persons_source;
                }
                this.persons=this.persons_source.filter((p)=>{
                    return p.name.indexOf(newValue)!==-1;
                })
            }
        }
    }
})
```

计算属性实现

```js
const vm=new Vue({
    el:'#root',
    data() {
        return {
            persons_source:[
                {id:"1",name:"CTY"},
                {id:'2',name:'ZCH'},
                {id:'3',name:'ZZL'}
            ],
            keyWord:'',
        }
    },
    computed:{
        persons:{
            get(){
                return this.persons_source.filter((p)=>{
                    return p.name.indexOf(this.keyWord)!==-1;
                });
            },
            set(){

            }
        }
    }
})
```

### 列表排序

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
    <div id="root">
        <!-- 列表过滤 -->
        <h2>人员列表</h2>
        <input type="text" placeholder="输入名字查询" v-model:value="keyWord">
        <button @click="sortByScore(1)">成绩升序</button>
        <button @click="sortByScore(-1)">成绩降序</button>
        <button @click="sortByScore(0)">默认顺序</button>
        <ul>
            <li>id-姓名-成绩</li>
            <li v-for="(item,index) in persons" :key="index">
                {{item.id}}-{{item.name}}-{{item.grade}}
            </li>
        </ul>
        <hr>
    </div>
</body>
</html>
```

JavaScript代码：

```js
const vm=new Vue({
    el:'#root',
    data() {
        return {
            persons_source:[
                {id:"1",name:"CTY",grade:"101"},
                {id:'2',name:'ZCH',grade:"80"},
                {id:'3',name:'ZZL',grade:"90"}
            ],
            keyWord:'',
            persons:[]
        }
    },
    methods: {
        sortByScore(a){
            if(a===0){
                this.persons=this.persons_source;
            }else if(a>0){
                this.persons=this.persons.sort((p1,p2)=>{
                    return p1.grade-p2.grade;
                })
            }else{
                this.persons=this.persons.sort((p1,p2)=>{
                    return p2.grade-p1.grade;
                })
            }
        }
    },
    watch:{
        keyWord:{
            immediate:true,
            handler(newValue,oldValue){
                if(newValue===""){
                    this.persons=this.persons_source;
                }
                this.persons=this.persons_source.filter((p)=>{
                    return p.name.indexOf(newValue)!==-1;
                })
            }
        }
    }
})
```

#### 变量更新时的一个问题

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
    <div id="root">
        <!-- 列表过滤 -->
        <h2>人员列表</h2>
        <button @click="updateCTY">更新CTY的信息</button>
        <ul>
            <li>id-姓名-成绩</li>
            <li v-for="(item,index) in persons_source" :key="index">
                {{item.id}}-{{item.name}}-{{item.grade}}
            </li>
        </ul>
        <hr>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    persons_source:[
                        {id:"1",name:"CTY",grade:"101"},
                        {id:'2',name:'ZCH',grade:"80"},
                        {id:'3',name:'ZZL',grade:"90"}
                    ],
                }
            },
            methods: {
                updateCTY(){
                    // 以下代码可以修改页面
                    // this.persons_source[0].name="陈天元"
                    // this.persons_source[0].grade="100"
                    // 以下代码不会修改页面，但是信息已被修改
                    this.persons_source[0]={id:"1",name:"陈天元",grade:"100"};
                }
            },
        })
    </script>
</body>
</html>
```

### Vue监视数据改变的原理

> 1. Vue会监视data中所有层次的数据
>
> 2. 如何监测`对象`中的数据？
>
>    1. 通过setter实现监视，且要在创建Vue实例时就传入要监测的数据
>
>       1. 对象中后追加的数据，Vue默认不进行响应式处理
>
>       2. 如果要为后追加的数据添加响应式，要使用Vue提供的两个API的其中一个
>
>          ```javascript
>          Vue.set(对象,属性,属性值);
>          this.$set(对象, 属性, 属性值);
>          ```
>
>    2. 如何监测`数组`中的数据？
>
>       1. 通过包裹了一部分数组更新方法，即使用了自己的数组修改方法，先修改数组，然后重新渲染界面，这些可以被监测到的被包裹方法包括：
>          - push()
>          - pop()
>          - shift()
>          - unshift()
>          - splice()
>          - sort()
>          - reverse()
>       2. 使用以下非变更方法时，可以将新数组赋值给原数组实现响应式
>          - filter()
>          - concat()
>          - slice()
>
> **特别注意：上文中Vue的两个API不能给==Vue实例==或==Vue实例根数据对象（vm._data或vm.data）==添加属性**

示例代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
        button{
            border-radius: 10px;
            margin: 10px;
            padding: 10px;
            background-color: skyblue;
        }
        button:hover{
            border-radius: 10px;
            margin: 10px;
            padding: 10px;
            background-color: red;
        }
    </style>
</head>
<body>
    <div id="root">
        <button @click="student.age++">age plus 1</button>
        <button @click="addSex">add age attribute</button>
        <button @click="addFriend">addFriend</button>
        <button @click="updateNameOfFirstFriend">change name of first friend</button>
        <button @click="addOneHobby">add a hobby</button>
        <button @click="updateTheFirstHobby">change the first hobby</button>
        <h2>姓名：{{student.name}}</h2>
        <h2>年龄：{{student.age}}</h2>
        <h2 v-if="student.sex">性别：{{student.sex}}</h2>
        <hr>
        <h3>hobbies:</h3>
        <ul>
            <li v-for="(hobby,index) in student.hobbies" :key='index'>
                {{hobby}}
            </li>
        </ul>
        <hr>
        <h3>friends</h3>
        <ul>
            <li v-for="(friend,index) in student.friends" :key="index">
                {{friend.name}}--{{friend.age}}
            </li>
        </ul>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    student:{
                        name:'PPG007',
                        age:21,
                        hobbies:['Java','Spring','Vue'],
                        friends:[
                            {name:'ZZL',age:'20'},
                            {name:'CTY',age:'22'}
                        ]
                        }
                }
            },
            methods: {
                addSex(){
                    // Vue.set(this.student,'sex','男');
                    this.$set(this.student, 'sex', '男');
                },
                addFriend(){
                    this.student.friends.unshift({name:'ABC',age:69})
                },
                updateNameOfFirstFriend(){
                    this.student.friends[0].name='张三';
                },
                addOneHobby(){
                    this.student.hobbies.unshift('TEST')
                },
                updateTheFirstHobby(){
                    // this.student.hobbies.splice(0,1,'hobby-after')
                    Vue.set(this.student.hobbies,0,'another hobby')
                }
            },
        })
    </script>
</body>
</html>
```

## 过滤器

通过管道符`|`使用过滤器

>    1. v-bind和插值语法可以使用过滤器
>    2. v-model不可以使用过滤器
>    3. 多个过滤器可以串联
>    4. 过滤器并没有修改源数据

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/dayjs.min.js"></script>
</head>
<body>

    <div id="root">
        <h2>Time</h2>
        <!-- 计算属性实现 -->
        <h2>{{fmtTime}}</h2>
        <!-- methods实现 -->
        <h2>{{getFormatTime()}}</h2>
        <!-- 过滤器实现 -->
        <h2>{{time|timeFormater('YYYY年MM月DD日')}}</h2>
        <h2>{{time|timeFormater('YYYY年MM月DD日')|mySlice}}</h2>
    </div>
    <script>
        Vue.filter('mySlice',function(val){
            return val.slice(0,4);
        })
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    time:1627296335622
                }
            },
            computed:{
                fmtTime(){
                    return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss');
                }
            },
            methods: {
                getFormatTime(){
                    return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss');
                }
            },
            filters:{
                // 局部过滤器
                timeFormater(val,formatStr='YYYY年MM月DD日 HH:mm:ss'){
                    return dayjs(val).format(formatStr);
                }
            }
        })
    </script>
</body>
</html>
```

## 内置指令

### v-text

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

    <div id="root">
        <h2>{{name}}</h2>
        <h2 v-text='name'></h2>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    name:'PPG',
                }
            },
        })
    </script>
</body>
</html>
```

> v-text指令：
>
> 1. 作用：向其所在节点渲染文本内容
> 2. 与插值语法的区别：v-text会替换掉节点中的内容，插值语法不会

### v-html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
        button{
            border-radius: 10px;
            background-color: skyblue;
        }
        button:hover{
            border-radius: 10px;
            background-color: red;
        }
    </style>
</head>
<body>

    <div id="root">
        <div v-html="str"></div>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    str:'<button>按钮</button>'
                }
            },
        })
    </script>
</body>
</html>
```

> v-html：
>
> 1. 作用：向指定节点渲染包含HTML结构的内容
> 2. 与插值语法的区别：
>    1. v-html会替换掉节点中所有的内容，插值语法则不会
>    2. v-html可以识别HTML结构
> 3. v-html存在安全问题：
>    1. 在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击
>    2. 一定要在可信的内容上使用v-html，永远不要用在用户提交的内容上

### v-cloak指令

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
        [v-cloak]{
            display: none;
        }
    </style>
</head>
<body>
    <div id="root">
        <h2 v-cloak>{{name}}</h2>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    name:'PPG'
                }
            },
        })
    </script>
</body>
</html>
```

> 通过v-cloak和CSS属性选择器配合，防止在网速过慢短时间内无法加载Vue时出现插值语法模板
>
> v-cloak本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性

### v-once

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
        [v-cloak]{
            display: none;
        }
    </style>
</head>
<body>
    <div id="root">
        <h2 v-once>n的初值为：{{n}}</h2>
        <h2 v-cloak>n:{{n}}</h2>
        <button @click="n++">点我n+1</button>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    n:1,
                }
            },
        })
    </script>
</body>
</html>
```

> v-once:
>
> 1. v-once所在节点在初次动态渲染后，就视为静态内容了
> 2. 以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能

### v-pre指令

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../js/vue.js"></script>
    <style>
        [v-cloak]{
            display: none;
        }
    </style>
</head>
<body>
    <div id="root">
        <h2 v-pre>李在干神魔</h2>
        <h2>n:{{n}}</h2>
        <button @click="n++">点我n+1</button>
    </div>

    <script>
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    n:1,
                }
            },
        })
    </script>
</body>
</html>
```

>v-pre:
>
>1. 跳过其所在节点的编译过程
>2. 可利用它跳过：没有使用指令语法，没有使用插值语法的节点，会加快编译

## 自定义指令

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

    <div id="root">
        <h2>n:{{n}}</h2>
        <hr>
        <h2>n*3=<span v-ppg='n'></span></h2>
        <hr>
        <button @click="n++">n++</button>
        <hr>
        <input type="text" v-fbind='n'>
    </div>

    <script>
        Vue.directive('fbing', {
            bind(el, binding, vnode) {},
            inserted(el, binding, vnode) {},
            update(el, binding, vnode, oldVnode) {},
            componentUpdated(el, binding, vnode) {},
            unbind(el, binding, vnode) {},
        });
        const vm=new Vue({
            el:'#root',
            data() {
                return {
                    n:1

                }
            },
            directives:{
                // 指令与元素成功绑定时调用
                // 指令所在模板被重新解析时调用
                ppg(element,binding){
                    element.innerText=binding.value*3
                },
                fbind:{
                    // 当指令与元素成功绑定时调用
                    bind(element,binding){
                        element.value=binding.value;

                    },
                    // 指令所在元素被插入页面时调用
                    inserted(element,binding){
                        element.focus();
                    },
                    // 指令所在模板被重新解析时调用
                    update(element,binding){
                        element.value=binding.value;
                        element.focus()
                    }
                }
            }
        })
    </script>
</body>
</html>
```

> 自定义指令：
>
> 1. 定义：
>    1. 局部指令
>    2. 全局指令
> 2. 指令定义对象的钩子函数
>    - bind：只调用一次，指令第一次绑定到元素时调用，进行初始化设置
>    - inserted：被绑定元素插入父节点时调用
>    - update：所在组件的VNode更新时调用，但是可能发生在其子VNode更新之前
>    - componentUpdated：指令所在组件的 VNode **及其子 VNode** 全部更新后调用
>    - unbind：只调用一次，指令与元素解绑时调用
> 3. 钩子函数的参数：
>    1. el(element)：指令所绑定的元素，可以用来直接操作 DOM
>    2. binding：一个对象，包含：
>       1. `name`：指令名，不包括 `v-` 前缀。
>       2. `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
>       3. `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
>       4. `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
>       5. `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
>       6. `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
>    3. `vnode`：Vue 编译生成的虚拟节点
>    4. `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。
>    5. 除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 [`dataset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 来进行。
> 4. 注意事项：
>    1. 指令定义没有前缀`v-`，使用时要加前缀
>    2. 指令名如果是多个单词，要使用kebab-case命名方式，不要用驼峰命名

## 生命周期

![Vue生命周期](/vue/Vue生命周期.png)

> 常用生命周期钩子：
>
> 1. mounted：发送网络请求，启动定时器、绑定自定义事件、订阅消息等==初始化操作==
> 2. beforeDestroy：清除定时器、解绑自定义事件、取消订阅消息等==收尾工作==
>
> 关于`销毁`Vue实例：
>
> 1. 销毁后自定义事件会失效，但原生DOM时间依然有效
> 2. 在beforeDestroy中操作数据不会再出发更新流程
>
> 图中有三个钩子没有体现：
>
> 1. `activated`：VueRouter相关，激活组件对应路由时触发
> 2. `deactivated`：VueRouter相关，离开组件对应路由(失活)时触发
> 3. `$nextTick`：Vue渲染界面结束后调用，可以用来获取焦点等操作

## Vue组件

### 基本使用

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../../js/vue.js"></script>
</head>
<body>

    <div id="root">
        <student></student>
        <hr>
        <school></school>
    </div>

    <script>

    const school = Vue.extend({
        template:`
            <div>
                <h2>name:{{name}}</h2>
                <h2>address:{{address}}</h2>
            </div>
        `,
            data() {
                return {
                    name:'SDUST',
                    address:'QD'
                }
            },
        });
        const student=Vue.extend({
            template:`
            <div>
                <h2>name:{{name}}</h2>
                <h2>age:{{age}}</h2>
            </div>
        `,
            data() {
                return {
                    name:'PPG',
                    age:21
                }
            },
        })
        const vm=new Vue({
            el:'#root',
            components:{
                school,
                student
            }
        })
        // 全局注册
        Vue.component('school',school);

    </script>
</body>
</html>
```

> Vue使用组件三大步骤：
>
> 1. 定义组件
> 2. 注册组件
> 3. 使用组件
>
> 如何定义一个组件：
>
> 使用Vue.extend(options)创建，options与创建Vue实例对象时传入的几乎一致
>
> 1. 不要使用`el`
> 2. data必须写成函数
>
> 如何注册组件：
>
> 1. 局部注册：创建Vue实例对象时传入components选项，使用键值对注册
> 2. 全局注册：使用Vue.component('组件名',组件)

### 几个注意点

> 1. 关于组件名：
>
>    - 一个单词组成：
>      - 全小写
>      - 首字母大写
>    - 多个单词：
>      - kebab-case命名
>      - 驼峰命名(需要使用Vue脚手架)
>    - 备注：
>      - 组件名尽可能回避HTML中已有名称
>      - 可以使用name配置项指定组件在开发者工具中呈现的名字(定义组件时就起名字)
>
> 2. 关于组件标签：
>
>    - 第一种写法：`<school></school>`
>    - 第二种写法：`<school/>`
>    - 备注：不使用脚手架时，第二种写法会导致后续组件不能渲染
>
> 3. 一个简写方式：
>
>    const school=Vue.extend(options)可简写为const school=options

### 组件嵌套

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../../js/vue.js"></script>
</head>
<body>

    <div id="root">

    </div>

    <script>
        const student=Vue.extend({
            template:`
            <div>
                <h2>name:{{name}}</h2>
                <h2>age:{{age}}</h2>
            </div>
        `,
            data() {
                return {
                    name:'PPG',
                    age:21
                }
            },
        });
        const school = Vue.extend({
            template:`
                <div>
                    <h2>name:{{name}}</h2>
                    <h2>address:{{address}}</h2>
                    <student></student>
                </div>
            `,
            data() {
                return {
                    name:'SDUST',
                    address:'QD'
                }
            },
            components:{
                student
            }
        });
        const hello={
            template:`
                <div>
                    <h2>{{msg}}</h2>
                </div>
            `,
            data() {
                return {
                    msg:'Hello World'
                }
            },
        }
        const app={
            components:{
                school,
                hello
            },
            template:`
            <div>
                <school></school>
                <hello></hello>
            </div>
            `
        }
        const vm=new Vue({
            el:'#root',
            components:{
                app,

            },
            template:'<app></app>'
        })
    </script>
</body>
</html>
```

### 关于VueComponent

> 1. 上述代码中的school组件本质是一个名为VueComponent的构造函数，而且不是程序员定义的，是Vue.extend生成的
>
> 2. 我们只需要对应的标签，Vue解析时会创建响应组件的实例对象，即Vue执行了`new VueComponent(options)`
>
> 3. **特别注意：每次调用Vue.extend，返回的都是一个==全新==的VueComponent**
>
> 4. 关于this的指向：
>
>    1. 组件配置中：
>
>       data函数，methods中的函数、watch中的函数、computed中的函数，它们的this都是==VueComponent实例对象==
>
>    2. new Vue(options)配置中
>
>       data函数、methods函数、watch函数、computed函数，它们的this均是Vue实例对象
>
> 5. VueComponent的实例对象，简称vc(也可称为组件实例对象)，Vue实例对象简称vm
>
> 6. vm管理着所有的vc，每个vc管理着自己的子组件

### 一个重要的内置关系

**VueComponent.prototype.\_\_proto\_\_===Vue.prototype**

组件实例对象也可以使用Vue原型上的属性

![Vue一个重要关系](/vue/Vue一个重要关系.png)

### 单文件组件

单文件组件后缀名是`.vue`

定义两个组件：

School.vue

```vue
<template>
    <div class="demo">
        <h2>name:{{name}}</h2>
        <br>
        <h2>address:{{address}}</h2>
    </div>
</template>

<script>
// 分别暴露
 const school = Vue.extend({
    name:'School',
    data() {
        return {
            name:'SDUST',
            address:'QD'
        }
    },
});
// 统一暴露
// export{school}
// 默认暴露
export default school

</script>

<style>
.demo{
    color: skyblue;
    background-color: orange;
}
</style>
```

Student.vue

```vue
<template>
    <div>
        <h2>name:{{name}}</h2>
        <hr>
        <h2>age:{{age}}</h2>
    </div>
</template>

<script>
const student=Vue.extend({
    data() {
        return {
            name:'PPG',
            age:21
        }
    },
});
export default student
</script>
```

所有的组件通过一个`App.vue`进行统一管理

```vue
<template>
    <div>
        <Student></Student>
        <School></School>
    </div>
</template>

<script>
import School from './School'
import Student from './Student.vue'
export default {
    name:'App',
    components:{
        School,
        Student
    }
}
</script>

<style>

</style>
```

创建`main.js`以创建Vue实例

```js
import App from './App.vue'
new Vue({
    el:'#root',
    components:{
        App
    }
})
```

创建`index.html`做入口页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root">
        <App></App>
    </div>
    <script src="../../js/vue.js"></script>
    <script src="./main.js"></script>
</body>
</html>
```

## 使用Vue脚手架

### 安装Vue-CLI并创建Hello World

首先需要安装Node.js环境

成功安装Node.js后在命令行输入：

```powershell
npm install -g @vue/cli
```

如果安装过旧版本可以用这个命令卸载：

```powershell
npm uninstall vue-cli -g
```

如果安装太慢可以使用国内镜像：

```powershell
npm config set registry https://repo.huaweicloud.com/repository/npm/
npm cache clean -f
npm config set disturl https://repo.huaweicloud.com/nodejs
npm config set sass_binary_site https://repo.huaweicloud.com/node-sass
```

打开CMD，进入到想要创建项目的文件夹，执行：

```powershell
vue create [项目名]
#例如：
vue create demo
```

在可选项中根据实际情况选择Vue的版本等选项

创建结束后得到一个以项目名命名的文件夹，进入到这个文件夹中，执行：

```powershell
npm run serve
```

成功启动了Hello World项目

### render函数

`main.js`中有这样一行代码：

```js
import Vue from 'vue'
```

默认情况下引入的是`vue.runtime.esm.js`，不包含模板解析器，所以`main.js`的Vue实例中不能添加`template`属性，会报错

使用render可以在这个环境中完成模板渲染

```js
render(createElement){
    return createElement('h1','Hello Wrold');
}
```

可以简写成箭头函数：

```javascript
render:h=>h('h1',Hello World);
```

如果使用组件直接传入组件即可，不需要第二个参数

```js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

### 修改默认配置

使用如下命令将现有配置输出到指定文件：

```powershell
vue inspect > out.js
```

在`package.json`同级目录下创建`vue.config.js`，这个文件应该导出一个包含了选项的对象

```js
module.exports={

}
```

可选参考项：[Vue-CLI配置项](https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE)

示例：关闭保存时语法检查

```js
module.exports={
    lintOnSave:false
}
```

如果定义了一个配置项但是没有设置配置值，那么将会报错，而且如果要使配置生效要重新运行

```powershell
npm run serve
```

### ref属性

>ref属性：
>
>1. 用来给元素或子组件注册引用信息(id的替代者)
>2. 应用在HTML标签上获取的是真实DOM元素，应用在组件上是组件实例对象(vc)
>3. 获取：`vm.$refs.xxx`

```vue
<template>
    <div>
        <!-- <Student></Student> -->
        <h2 ref="title">Hello{{msg}}</h2>
        <button v-on:click="showDOM">点我输出上方DOM</button>
        <School></School>
    </div>
</template>

<script>
import School from './components/School'
import Student from './components/Student'
export default {
    name:'App',
    components:{
        School,

    },
    data() {
        return {
            msg:'World'
        }
    },
    methods: {
        showDOM(){
            console.log(this.$refs.title)
        }
    },
}
</script>

<style>

</style>
```

### props属性

> 功能：让组件接收外部传来的数据

#### 传递参数

```vue
<template>
    <div>
        <Student name='PPG' :age='21' sex='male'></Student>
    </div>
</template>
```

#### 接收参数

方式一：

```js
props:['name','age','sex']
```

方式二：

```js
props:{
    name:String,
    age:Number,
    sex:String
}
```

方式三：

```js
props:{
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        default:20
    },
    sex:{
        type:String,
        required:false
    }
},
```

> props是只读的，如果进行修改会产生警告，如果确实需要修改，要将props中的指定内容在data中复制一份，由于props优先级较高，所以不会出现字段未定义的错误

```javascript
const student=Vue.extend({
    data() {
        return {
            msg:'Hello Vue',
            studentAge:this.age
        }
    },
    props:{
        name:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            default:20
        },
        sex:{
            type:String,
            required:false
        }
    },
    methods:{
        changeAge(){
            this.studentAge++
        }
    }
});
```

### mixin混入

> 功能：可以把多个组件共用的配置提取成一个混入对象
>
> 使用方式：
>
> 1. 定义混合
>
> 2. 使用混合
>
>    1. 全局混入：
>
>       ​	`Vue.mixin(xxx)`
>
>    2. 局部混入：
>
>       ​	mixins:['xxx','xxx']

定义混合示例：

```js
"use strict";
export const mixin={
    methods: {
        showName() {
            alert(this.name)
        }
    }
}
```

在组件中引用混合

```html
<script>
import Vue from 'vue'
import {mixin} from '@/mixin'
const student = Vue.extend({
  data() {
    return {
      msg: 'Hello Vue',
      name: 'PPG',
      age: 21,
      sex: 'male'
    }
  },
  mixins:[mixin]
});
export default student
</script>
```

使用全局混合

```js
import {mixin} from "@/mixin";
Vue.mixin(mixin)
```

**如果一个组件内部定义了和混入中定义的相同的data、method，最后得到的是内部定义的，如果是钩子函数，那么内部和混合中定义的都会保留**

### 插件

> 插件
>
> ​	功能：用于增强Vue
>
> ​	本质：包含install方法的一个对象，install的第一个参数是Vue，第二个以后的参数是插件使用者传递的数据
>
> ​	使用插件：`Vue.use(xxx)`
>
> ​	应用举例：添加全局过滤器、添加全局指令、配置全局混入、在Vue的原型对象上定义全局方法

定义插件：

```js
"use strict";
const plugin1={
    install(vue,a,b){
        console.log("Plugin 1 installed");
        vue.prototype.hello=function () {
            console.log('Vue 全局方法');
            console.log('另外两个参数为',a,b)
        }
    }
}
export {plugin1}
```

使用插件：

```js
import {plugin1} from "@/plugins";
Vue.use(plugin1,Date.now(),"hello");
```

```vue
<template>
  <div class="demo">
    <h2 @click="showName">name:{{ name }}</h2>
    <br>
    <h2>address:{{ address }}</h2>
    <button @click="helloTest()">点我控制台输出</button>
  </div>
</template>

<script>
import Vue from 'vue'
const school = Vue.extend({
  name: 'School',
  data() {
    return {
      name: 'SDUST',
      address: 'QD'
    }
  },
  methods: {
    helloTest() {
      this.hello();
    }
  }
});
export default school
</script>
```

### scoped样式

每个组件中定义的style属性在编译后会混在一个文件中，如果存在重名CSS样式，后引入的组件中的会覆盖之前组件的CSS，为style标签添加`scoped`属性限定样式只在当前组件中可用

```html
<style scoped>
.demo {
  background-color: orange;
}
</style>
```

style的另一个属性`lang`可以选择`css`或`less`使Vue能够解析，如果选择less需要安装less-loader，要注意版本问题

## 浏览器本地存储

本地存储分为`localStorage`和`sessionStorage`,前者持久保存(清除浏览器缓存可能导致失效)，后者关闭浏览器即清空，都是`window`的对象，二者API名字完全一致

### localStorage

```js

// 读取不到就是null
function saveData(){
    let person={name:'PPG',age:21};
    window.localStorage.setItem('msg',JSON.stringify(person));
}
function readData(){

    alert(localStorage.getItem('msg'))
    console.log(JSON.parse(localStorage.getItem('msg')))
}
function deleteData(){

    console.log(localStorage.removeItem('msg'))
}
function deleteAll(){
    localStorage.clear();
}
```

### sessionStorage

```js
// 读取不到就是null
function saveData(){
    let person={name:'PPG',age:21};
    sessionStorage.setItem('msg',JSON.stringify(person));
}
function readData(){

    alert(sessionStorage.getItem('msg'))
    console.log(JSON.parse(sessionStorage.getItem('msg')))
}
function deleteData(){

    console.log(sessionStorage.removeItem('msg'))
}
function deleteAll(){
    sessionStorage.clear();
}
```

> webStorage
>
> 1. 存储内容大小一般为5MB
> 2. 浏览器端通过`sessionStorage`或`localStorage`实现本地存储
> 3. 获取不存在的key得到的value为==null==

## 组件自定义事件

### 绑定自定义事件

父组件定义一个方法

```js
demo(str){
    console.log(str);
}
```

父组件为子组件绑定事件：

写法一：

```vue
<Start :send="receive" v-on:demo="demo"/>
```

子组件：

```vue
<template>
  <div class="todo-header" @click="myEvent">
  </div>
</template>
<script>
export default {
  name: "Start",
  methods:{
    myEvent(){
      this.$emit('demo','test');
    }
  }
}
</script>
```

调用`$emit()`方法，第一个参数是父组件给子组件绑定的事件的名字，后面参数为要传递给父组件中定义的方法的参数

使用修饰符

```html
@demo.once="demo"
```

写法二：使用`ref`属性

父组件：

```html
<Start :send="receive" ref="demo"/>
```

```js
mounted() {
    let temp = localStorage.getItem("todos");
    if (temp){
        this.todos=JSON.parse(temp).todos;
    }
    this.$refs.demo.$on('demo',this.demo);
},
```

使用修饰符

```js
this.$refs.demo.$once('demo',this.demo);
```

写法二虽然复杂，但是更加灵活，可以控制绑定的时机等等

### 解绑自定义事件

#### 解绑单个事件：

子组件中：

```js
mounted() {
    setTimeout(()=>{
        this.$off('demo')
        console.log('自定义事件解绑了')
    },10000);
}
```

10秒后事件被解绑

#### 解绑多个事件：

子组件中：

```js
mounted() {
    setTimeout(()=>{
        this.$off(['demo'])
        console.log('自定义事件解绑了')
    },5000);
}
```

使用数组传递所有要解绑的事件

#### 解绑所有事件

子组件中

```js
mounted() {
    setTimeout(()=>{
        this.$off()
        console.log('自定义事件解绑了')
    },5000);
}
```

解绑的是所有自定义事件，原有的鼠标点击事件等不会解绑

### 给组件绑定原生事件

使用`native`修饰符，绑定的原生事件解绑自定义事件后仍然有效

```html
<Start :send="receive" @click.native="demo('123')"/>
```

### 总结

> 组件自定义事件：
>
> 1. 一种组件间通信方式(子组件=>父组件)
>
> 2. 使用场景：A是父组件，B是子组件，B想给A传递数据，就要在A中为B绑定自定义事件，事件回调在A中定义
>
> 3. 绑定自定义事件：
>
>    1. 第一种方式：
>
>       ​	在父组件中使用`<Component v-on:自定义事件名="回调函数"></Component>`
>
>    2. 第二种方式：
>
>       ​	在父组件中：
>
>       使用ref属性
>
>       ```html
>       <Start ref="demo"/>
>       ```
>
>       ```js
>       mounted() {
>           this.$refs.demo.$on('demo',this.demo);
>       },
>       ```
>
>    3. 如果想让事件只触发一次或其他限制，使用`.once`修饰符或`$once()`方法或其他修饰符或方法
>
> 4. 子组件触发自定义事件
>
>    定义一个方法，使用原生事件触发这个事件并在这个方法中调用自定义的事件
>
>    ```js
>    myEvent(){
>        this.$emit('demo','test');
>    }
>    ```
>
> 5. 解绑自定义事件
>
>    子组件中：
>
>    ```js
>    //解绑一个事件
>    this.$off('demo');
>    //解绑多个事件
>    this.$off(['demo','demo2']);
>    //解绑所有自定义事件
>    this.$off();
>    ```
>
> 6. 组件绑定原生DOM事件：使用`.native`修饰符
>
> 7. **注意：通过`this.$refs.xxx.$on('event',callback)`绑定自定义事件时，如果把callback直接写成函数，要使用箭头函数，这样回调方法中this才是当前组件对象，如果是普通函数，this指向的是触发这个自定义事件的组件对象，即父组件对象，或者在methods中定义回调函数**

## 全局事件总线

> 全局事件总线：
>
> 1. 一种组件间通信方式，适用于==任意组件通信==
>
> 2. 设置全局总线：
>
>    main.js中通过为Vue原型对象添加属性实现创建总线，且该总线能够访问所有的Vue对象方法
>
>    ```js
>    new Vue({
>      render: h => h(App),
>      beforeCreate() {
>        Vue.prototype.$bus=this;
>      }
>    }).$mount('#app')
>    ```
>
> 3. 使用事件总线
>
>    1. 接收数据：A组件要接收数据，A组件中在总线上创建自定义事件
>
>       ```js
>       mounted() {
>           this.$bus.$on('getInfo',(student,school)=>{
>               if (school){
>                   this.school={'name':school.name,'address':school.address};
>               }
>               if (student){
>                   this.student={'name':student.name,'age':student.age};
>               }
>           })
>       }
>       ```
>
>    2. 发送数据：B组件要发送数据，B组件中调用`$emit()`方法调用其他组件创建的自定义事件并传递数据
>
>       ```js
>       methods:{
>           showAll(){
>               this.$bus.$emit('getInfo',{'name':this.name,'age':this.age});
>           }
>       }
>       ```
>
> 4. 最好在`beforeDestroy()`中解绑自己创建的事件
>
>    ```js
>      beforeDestroy() {
>        this.$bus.$off('getInfo');
>      }
>    ```

## 消息订阅与发布

**消息订阅与发布是一种思想**

这里使用`pubsub-js`库

### 安装`pubsub-js`

```powershell
npm i pubsub-js
```

### 引入`pubsub`

```js
import pubsub from 'pubsub-js'
```

### 接收数据

```js
mounted() {
    this.channel=pubsub.subscribe('test',(msg,data)=>{
        console.log("频道：" + msg);
        console.log(data);
    })
},
beforeDestroy() {
    pubsub.unsubscribe(this.channel);
}
```

调用pubsub的`subscribe()`方法订阅消息，返回一个ID，第一个参数是订阅的消息的名字，第二个参数是回调函数，此处回调函数如果写成普通函数，则回调函数中的`this`是undefined，应当写成箭头函数，或者在`methods`中定义函数并在`subscribe`中传入

### 发送数据

```js
pubsub.publish('test','发布成功')
```

调用pubsub的`publish()`方法发布消息，第一个参数是消息，对应订阅中的第一个参数，第二个参数是要传递的数据

## Vue脚手架配置代理

### 方式一

在`vue.config.js`中添加如下配置

```js
"use strict";
module.exports = {
    devServer: {
        //将请求代理到localhost的80端口
        proxy: 'http://localhost',
        //前端服务器端口号设置为90
        port:90
    }
}
```

> 1. 优点：配置简单，请求资源时直接发送给前端即可
> 2. 缺点：不能配置多个代理，不能灵活的控制请求是否走代理
> 3. 工作方式：当请求的资源在public夹(即前端服务器根目录)中找不到时，向代理目标发送请求

### 方式二

在`vue.config.js`中添加如下配置

```js
"use strict";
module.exports = {
    devServer: {
        port: 90,
        proxy: {
            //设置请求前缀，请求端口号后紧跟这个前缀才会被这条规则转发
            '/api': {
                //设置目标服务器
                target: 'http://localhost',
                //由于请求时要加前缀而服务器真实路径没有前缀，所以要去掉前缀
                pathRewrite: {'^/api': ''}
            },
        }
    }
}
```

> 优点：可以配置多个代理，且可以灵活的控制请求是否走代理
>
> 缺点：配置略繁琐，请求资源必须加前缀

### 进行请求

路径要变为请求代理服务器地址而不是被代理服务器

```js
axios.get('http://localhost:90/api/getAllStudents').then(
    response => {
        console.log(response.data);
    },
    error => {
        console.log(error.message);
    }
)
```

## vue-resource

### 安装vue-resource

```shell
npm install vue-resource
```

### 使用vue-resource

注册插件

```js
Vue.use(vueResource);
```

使用vue-resource

```js
this.$http.get('http://localhost:90/api/getAllStudents').then(
          response => {
            console.log(response.data);
          },
          error => {
            console.log(error.message);
          }
      )
```

> vue-resource与axios使用方法基本一致，发送请求要通过`$http`对象完成，但是vue-resource维护频率低，推荐使用axios

## 插槽

> 父组件可以在子组件指定位置插入HTML结构，也是一种组件间通信方式，父组件==>子组件，如果子组件中不包含插槽，父组件中写在子组件标签中的所有内容都会丢失，如果没有东西要插入插槽，则子组件中插槽标签中的内容会作为默认值出现

### 默认插槽

> 子组件中直接使用`<slot></slot>`标签，如果有多个插槽，则父组件中要插入的内容在每个插槽中都会重复出现

```vue
<template>
  <div class="container">
    <Category :listData="foods">
      <img src="http://fenchingking.top/source/src/1291.jpg" width="200" height="300">
    </Category>
    <Category :listData="games">

    </Category>
    <Category :listData="films">

    </Category>
  </div>
</template>
```

```vue
<template>
  <div class="category">
    <h3>{{listData.title}}分类</h3>

    <slot>
      <ul>
        <li v-for="(item,index) in listData.data" :key="index">
          {{item}}
        </li>
      </ul>
    </slot>
  </div>
</template>
```

### 具名插槽

>使用`slot`标签的name属性用来区分插槽，如果一个`slot`没有显式指定name属性，则默认name为`default`，父组件中可以在==任意标签==上使用`slot`属性指定插槽，从vue2.6.0起，这两个attribute已被废弃，应当使用`v-slot`指令指定插槽，但是这个指令==只能使用在`template`标签==上，且`v-slot`指令冒号后直接跟插槽名即可，不需要等号

```vue
<Category :listData="foods">
    <img src="http://fenchingking.top/source/src/1291.jpg" height="25%" width="100%" slot="slot1">
    <img src="http://fenchingking.top/source/src/1292.jpg" height="25%" width="100%" slot="slot2">
    <img src="http://fenchingking.top/source/src/1293.jpg" height="25%" width="100%" slot="slot2">
    <template v-slot:slot2>
		<img src="http://fenchingking.top/source/src/1293.jpg" height="25%" width="100%">
    </template>
</Category>
```

```vue
<template>
  <div class="category">
    <h3>{{listData.title}}分类</h3>

    <slot name="slot1">
      <ul>
        <li v-for="(item,index) in listData.data" :key="index">
          {{item}}
        </li>
      </ul>
    </slot>
    <slot name="slot2">

    </slot >
  </div>
</template>
```

> `v-slot:`可以简写成`#`，井号后接插槽名

### 作用域插槽

现有如下子模板：

```vue
<template>
  <div class="category">
    <h3>{{foods.title}}分类</h3>
    <slot>
      {{foods.title}}
    </slot>
  </div>
</template>

<script>
export default {
  name: "Category",
  // props:['listData'],
  data(){
    return{
      foods:{title:'foods','data':['foodA','foodB','foodC', 'foodD']}
    }
  }
}
</script>
```

子模板默认显示的是`foods.title`属性，如果在父组件中要使显示内容改变，变为`foods.data`应当使用作用域插槽

```vue
<slot :slotFoods="foods">
    {{foods.title}}
</slot>
```

使用`v-bind`指令将数据绑定到`slot`元素上，通过这种方式绑定的attribute称为==插槽prop==，接下来通过`slot-scope`属性或`v-slot`指令将包含所有插槽prop的对象起个名字，然后通过这个对象去访问所有插槽prop，`slot-scope`已过时，vue2.6.0后使用`v-slot`指令

```vue
<template>
  <div class="container">
    <Category>
      <template slot-scope="ppg">
        <ul>
          <li v-for="(item, index) in ppg.slotFoods.data" :key="index">{{item}}</li>
        </ul>
      </template>
    </Category>

    <Category>
      <template v-slot:default="ppg">
        <ol>
          <li v-for="(item, index) in ppg.slotFoods.data" :key="index">{{item}}</li>
        </ol>
      </template>
    </Category>
  </div>
</template>
```

> 上述写法中，子组件中的插槽是默认插槽(没有name属性)，所有父组件中`v-slot`指令冒号后跟的是default，如果子组件==仅有==默认插槽，则default也可不写，一旦子组件中包含具名插槽，则每个`template`都要指定插槽名，且如果`v-slot`使用简写形式，default不能省略

***只要出现多个插槽，请为所有的插槽使用完整的==template==语法***

## Vuex

### Vuex工作原理

![Vuex工作原理图](/vue/Vuex工作原理图.png)

### 配置Vuex环境

安装Vuex：

```shell
npm install vuex --save
```

在src文件夹中创建`store`文件夹，并在其中创建`index.js`文件，编写如下内容：

```js
"use strict";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);
const actions={}
const mutations={}
const state={}
export default new Vuex.Store({
    actions,
    mutations,
    state
})
```

> Vue.use必须要写在创建store对象前，如果写在main.js中然后引用index.js，且使用了Vue-CLI脚手架，则脚手架会先执行所有的import语句，导致导入index.js前没有执行Vue.use发生报错，所以要写在index.js中

main.js引入index.js：

```js
import Vue from 'vue'
import App from './App.vue'
import store from './store'
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
```

### 求和案例

求和子模块：

通过`store`的`dispatch`方法触发actions

```vue
<template>
  <div>
    <h2>当前n为{{n}}</h2>
    <select v-model.number="step">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementOdd">当前求和为奇数才加</button>
    <button @click="incrementWait">延迟两秒加</button>
  </div>
</template>

<script>
export default {
  name: "Counter",
  data(){
    return{
      step:1,

    }
  },
  methods:{
    increment(){
      this.$store.dispatch('add',this.step);
    },
    decrement(){
      this.$store.dispatch('sub',this.step);
    },
    incrementOdd(){
      this.$store.dispatch('addOdd',this.step);
    },
    incrementWait(){
      this.$store.dispatch('addWait',this.step);
    }
  },
  computed:{
    n:{
      get(){
        return this.$store.state.n
      }
    }
  }
}
</script>
```

actions和mutations：

```js
const actions={
    // context与 store 实例具有相同方法和属性
    add(context,data) {
        context.commit('ADD',data);
    },
    sub(context,data) {
        context.commit('SUB',data);
    },
    addOdd(context,data) {
        //在actions中再次分发给其他action并接受返回值，返回值是promise类型
        context.dispatch('isOdd',context.state.n).then((result)=>{
            console.log(result);
            if (result){
                context.commit('ADD',data);
            }
        })
    },
    addWait(context,data) {
        setTimeout(()=>{
            context.commit('ADD',data);
        },2000);
    },
    isOdd(context,data) {
        return data % 2 !== 0;
    }
}


const mutations={
    ADD(state,data) {
        state.n+=data
    },
    SUB(state,data){
        state.n-=data;
    }
}
const state={
    n:0
}
```

### getters

> 当要获取加工后的state数据时使用

```vue
<h2>当前n的算术平方根为{{sqrtN}}</h2>
<script>
export default {
  name: "Counter",
  computed:{
    sqrtN:{
      get() {
        return this.$store.getters.process;
      }
    }
  }
}
</script>
```

index.js：

```js
const getters={
    process(state) {
        return Math.sqrt(state.n)
    }
}
export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})
```

> getters定义与计算属性类似，但是能做到全局复用，计算属性只能组件内复用，都通过返回值获取属性值

### mapState与mapGetters

在组件中频繁写`this.$store.state`过于繁琐，使用`mapState`与`mapGetters`可以简化代码

首先在组件中引入`mapState`和`mapGetters`

```js
import {mapState,mapGetters} from 'vuex'
```

在计算属性中应用：

前面加三个点表示以对象形式加入

```js
computed: {
    // 对象写法
    // ...mapState({n:'n',name:'name',age:'age'})
    // ...mapState({n:state => state.n,name:state => state.name,age:state => state.age})
    ...mapState({
      n(state) {
        return state.n;
      },
      name(state) {
        return state.name;
      },
      age(state) {
        return state.age*100;
      }
    }),


    // 数组写法
    // ...mapState(['n','name','age'])

    ...mapGetters({sqrtN:'process'})

    // ...mapGetters(['process'])

  }
```

`mapState`有四种写法

1. 对象写法，对象中是键值对，键为需要的计算属性名，==值必须用引号==，表示在`state`中对应数据的名字
2. 对象写法，对象中是键值对，键为需要计算的属性名，值为箭头函数，参数为`state`
3. 对象写法，对象中是函数，函数参数为`state`，可以进行复杂处理
4. 数组写法，仅适用于==需要的计算属性与`state`中属性重名==的情况

`mapGetters`有两种写法：

1. 数组写法，仅适用于需要的计算属性与`getters`中函数==重名==的情况
2. 对象写法，对象中是键值对，键为需要的计算属性，值为`getters`中对应函数的名字

### mapActions与mapMutations

在组件中频繁创建方法调用actions或mutations非常繁琐，使用`mapActions`和`mapMutations`可以简化代码

首先在组件中引入`mapActions`和`mapMutations`

```js
import {mapActions, mapMutations} from 'vuex'
```

在methods中应用：

```js
methods: {
	// 调用时传参
    ...mapMutations({increment:'ADD',decrement:'SUB'}),
    // 调用时传参
    // ...mapMutations(['ADD','SUB']),


    // 调用时要传参数
    ...mapActions({incrementOdd:'addOdd', incrementWait:'addWait'})
    // 调用时要传参数
    // ...mapActions(['addWait','addOdd'])
},
```

`mapActions`有两种写法：

1. 对象写法，键为要定义的方法名，值为actions中定义的方法
2. 数组写法，仅适用于要定义的方法名和定义在actions中的方法==同名==的情况

`mapMutations`有两种写法：

1. 对象写法，键为要定义的方法名，值为mutations中已定义的方法名
2. 数组写法，仅适用于要定义的方法名和定义在mutations中的方法==同名==的情况
**`mapActions`和`mapMutations`不论使用哪种写法，都必须在调用时传入参数，否则默认参数是event**

示例：

```html
    <button @click="incrementOdd(step)"></button>
    <button @click="incrementWait(step)"></button>
```

### 多组件共享数据

在此前计数器组件基础上，添加人员列表组件，完成人员列表组件能看到计数器当前值，计数器组件能看到人员列表长度

在index.js中给actions添加方法

```js
addPerson(context,data) {
	if (data.trim()===''){
	alert('请输入内容')
	}else {
	context.commit('ADD_PERSON',data)
	}
}
```

在mutations中添加：

```js
ADD_PERSON(state,data){
    state.people.unshift(data)
    alert('陈坤')
}
```

为state添加一个人员数组

```js
const state={
    n:0,
    name:'PPG',
    age:21,
    people:[]
}
```

在计数器组件模板中添加

```html
<h4>当前人员列表中人数为：{{number}}</h4>
```

其中`number`是计算属性，定义如下

```js
computed: {
    ...mapState({
      n(state) {
        return state.n;
      },
      name(state) {
        return state.name;
      },
      age(state) {
        return state.age;
      },
      number(state) {
        return state.people.length;
      }
    }),
```

创建人员列表组件

```vue
<template>
  <div>
    <div>
      <input v-model="temp" type="text" placeholder="输入姓名，回车确认" @keydown.enter="addPerson(temp)">
    </div>
    <ul>
      <li v-for="(item,index) in people" :key="index">
        {{item}}
      </li>
    </ul>
    <div>
      计数器组件的当前值为:{{n}}
    </div>
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
export default {
  name: "People",
  data(){
    return{
      temp:''
    }
  },
  methods:{
    ...mapActions(['addPerson'])
  },
  computed:{
    ...mapState(['people','n'])
  },
  //通过监视people数组变化清空输入框
  watch:{
    people:{
      deep:true,
      handler(){
        this.temp=''
      }
    }
  }
}
</script>
```

### 模块化

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割
将上一个部分中人员列表和计数器的vuex拆分：
可以写在index.js中，也可以每个模块拆分出一个文件然后index中进行引用

people.js

```js
"use strict";
export default {
    namespaced: true,
    actions: {
        addPerson(context, data) {
            if (data.trim() === '') {
                alert('请输入内容')
            } else {
                context.commit('ADD_PERSON', data)

            }
        }
    },
    mutations: {
        ADD_PERSON(state, data) {
            state.people.unshift(data)
            alert('陈坤')
        }
    },
    getters: {},
    state: {
        people: []
    }
};
```

counter.js

```js
"use strict";
export default {
 namespaced:true,
 actions: {
  addOdd(context, data) {
   context.dispatch('isOdd', context.state.n).then((result) => {
    if (result) {
     context.commit('ADD', data);
    }
   })
  },
  addWait(context, data) {
   setTimeout(() => {
    context.commit('ADD', data);
   }, 2000);
  },
  isOdd(context, data) {
   return data % 2 !== 0;
  },
 },
 mutations: {
  ADD(state, data) {
   state.n += data
  },
  SUB(state, data) {
   state.n -= data;
  },
 },
 getters: {
  process(state) {
   return Math.sqrt(state.n)
  }
 },
 state: {
  n: 0,
  name: 'PPG',
  age: 21,
 }
};
```

index.js

```js
"use strict";
import Vuex from "vuex";
import Vue from "vue";
import counterOptions from "@/store/counter";
import peopleOptions from "@/store/people";
Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        peopleOptions,
        counterOptions
    }
})
```

在分模块中添加`namespaced`属性开启命名空间，如果不写，默认为false，每个模块中的actions和mutations为全局可用，state不是全局可用，要访问可以使用模块名前缀
counter.vue

```vue
<script>
import {mapState, mapGetters} from 'vuex'
import {mapActions, mapMutations} from 'vuex'

export default {
  name: "Counter",
  data() {
    return {
      step: 1,

    }
  },
  methods: {
    ...mapMutations('counterOptions',{increment:'ADD',decrement:'SUB'}),
    ...mapActions('counterOptions',{incrementOdd:'addOdd', incrementWait:'addWait'})
  },
  computed: {
    ...mapState('counterOptions',{
      n(state) {
        return state.n;
      },
      name(state) {
        return state.name;
      },
      age(state) {
        return state.age;
      },

    }),
    ...mapState('peopleOptions',{
      number(state) {
        return state.people.length;
      }
    }),
    ...mapGetters('counterOptions',{sqrtN: 'process'})
  }
}
</script>
```

people.vue

```vue
<script>
import {mapActions,mapState} from 'vuex'
export default {
  name: "People",
  data(){
    return{
      temp:''
    }
  },
  methods:{
    ...mapActions('peopleOptions',['addPerson'])
  },
  computed:{
    ...mapState('peopleOptions',['people']),
    ...mapState('counterOptions',['n']),
  },
  watch:{
    people:{
      deep:true,
      handler(){
        this.temp=''
      }
    }
  }
}
</script>
```

在所有的map辅助函数中第一个参数传入在index.js中注册的模块名即可
如果不使用辅助函数，要注意访问的路径为`命名空间/getters方法名`
例如通过如下方式在counter.vue中访问

```js
//返回值就是getters对应函数的结果
this.$store.getters["counterOptions/process"]
```

对于模块内部的 action，局部状态通过 `context.state` 暴露出来，根节点状态则为 `context.rootState`

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来

## Vue Router

### 安装VueRouter

```shell
npm install vue-router
```

### 使用VueRouter

在`src`目录下创建`router`文件夹，并在其中创建`index.js`

```js
import VueRouter from "vue-router";
import Home from "@/components/Home";
import About from "@/components/About";
import News from "@/components/News";
import Message from "@/components/Message";
import Detail from "@/components/Detail";
export default new VueRouter({
    routes: [
        {
        	//指定路径
            path:'/home',
            //对应组件
            component:Home
        },
        {
            path:'/about',
            component:About,
        }
    ]
})
```

在`main.js`中引用VueRouter并使用上述配置

```js
import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import router from'./router'
Vue.config.productionTip = false
Vue.use(VueRouter);
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
```

在APP组件中添加超链接

```vue
<template>
  <div>
    <router-link active-class="active" to="/about">About</router-link>
    <router-link active-class="active" to="/home">Home</router-link>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
```

>通过`router-link`标签使用路由，`to`属性指定要跳转的目的地，`active-class`属性指定了当这个路径被触发时，这个超链接的样式，通>过`router-view`标签指定链接到的组件的显示位置

**切换时销毁前一个组件vc，嵌套时先销毁外层组件，再销毁内层组件**

### 多级路由

```js
import VueRouter from "vue-router";
import Home from "@/components/Home";
import About from "@/components/About";
import News from "@/components/News";
import Message from "@/components/Message";
import Detail from "@/components/Detail";
export default new VueRouter({
    routes: [
        {
            path:'/home',
            component:Home,
        },
        {
            path:'/about',
            component:About,
            children:[
                {
                    path:'news',
                    component:News,
                },
                {
                    path:'message',
                    component:Message,
                    children:[
                        {
                            path:'detail',
                            component:Detail,
                        }
                    ],
                }
            ]
        }
    ]
})
```

>使用`children`属性指定子路由，子路由path==不能==加斜线，`router-link`的to属性从根路径开始写到目的子路径

### query参数

通过将参数拼接在URL中传递参数：

写法一：

```vue
<router-link :to="`/about/message/detail?id=${msg.id}&title=${msg.title}`">{{ msg.id }}-{{ msg.title }}</router-link>
```

通过==`==符号并将to属性改为绑定形式，使用==${}==取得要传递的参数

写法二：

```vue
<router-link :to="{
            path:'/about/message/detail',
            query:{
              id:msg.id,
              title:msg.title
            }}">
          {{ msg.id }}-{{ msg.title }}
        </router-link>
```

to属性依然是绑定方式，写成对象形式

无论哪种写法，在目的组件中都要使用`$route.query.XXX`访问传递的参数

### 命名路由、重定向、别名、命名视图

#### 命名路由

可以在创建 Router 实例的时候，在 `routes` 配置中给某个路由设置名称

```js
routes: [
        {
            path:'/home',
            component:Home,
            name:'home'
        },
        {
            path:'/about',
            component:About,
            name:'about',
        }
    ]
```

在使用时通过绑定`to`属性并采用对象形式传递一个`name`参数指定要跳转到的路由

#### 重定向

从`/a`重定向到`/b`：

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

重定向到命名路由：

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

重定向到函数：

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```

#### 别名

**`/a` 的别名是 `/b`，意味着，当用户访问 `/b` 时，URL 会保持为 `/b`，但是路由匹配则为 `/a`，就像用户访问 `/a` 一样**

```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

#### 命名视图

你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 `router-view` 没有设置名字，那么默认为 `default`

```vue
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

多个视图需要多个组件，路由配置中使用配置项`components`

```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

### params参数(RestFul)

在`index.js`中修改：

```js
import VueRouter from "vue-router";
import Home from "@/components/Home";
import About from "@/components/About";
import News from "@/components/News";
import Message from "@/components/Message";
import Detail from "@/components/Detail";
export default new VueRouter({
    routes: [
        {
            path:'/home',
            component:Home,
            name:'home'
        },
        {
            path:'/about',
            component:About,
            name:'about',
            children:[
                {
                    path:'news',
                    component:News,
                    name:'news'
                },
                {
                    path:'message',
                    component:Message,
                    name:'message',
                    children:[
                        {
                            path:'detail/:id/:title',
                            component:Detail,
                            name:'detail',
                        }
                    ],
                }
            ]
        }
    ]
})
```

在`path`属性中的路径后使用`/`分隔参数，`:`后接参数键

传递参数：

```vue
<router-link :to="{
            name:'detail',
            params:{
              id:msg.id,
              title:msg.title
            }}">
          {{ msg.id }}-{{ msg.title }}
        </router-link>
```

**使用了`params`参数后必须使用`name`而不能使用`path`**

获取参数：

```js
$route.params.id
```

### props配置

#### 布尔模式

在params基础上，修改路由配置

```js
{
    path:'message',
        component:Message,
            name:'message',
                children:[
                    {
                        path:'detail/:id/:title',
                        component:Detail,
                        name:'detail',
                        props:true
                    }
                ],
}
```

`props`属性如果为true，则使用`params`传递的参数都将变成`props`形式传递到目的地，即`route.params`将变成组件的属性，`router-link`标签写法与params一致

目的组件修改为：

```vue
<template>
  <div>
    <h3>Detail</h3>
    <h5>{{id}}</h5>
    <h5>{{title}}</h5>
  </div>
</template>

<script>
export default {
  name: "Detail",
  mounted() {
    console.log(this.$route)
  },
  props:['id','title']
}
</script>
```

#### 对象模式

props写成：

```js
props:{id:'test',title:'test'}
```

此对象所有的键值对都会以`props`形式传递，当`props`是静态时是有用的，目的组件中用法与布尔模式相同

#### 函数模式

目的组件用法依然不变

修改props：

接收params：

```js
props(route){
    return{
        id:route.params.id,
        title:route.params.title
    }
}
```

接收query：

```js
props(route){
    return{
        id:route.query.id,
        title:route.query.title
    }
}
```

### router-link的replace属性

浏览器的历史记录分为两种模式：`push`模式和`replace`模式，`push`模式是每访问一个链接，就把这个链接入栈，所以能够一直返回直到最开始的链接，`replace`模式是每访问一个链接，就把这个链接替换掉上一条链接

开启`router-link`的replace模式

```vue
<router-link replace to="/about/news" active-class="active">News</router-link>
<router-link :replace="true" to="/about/message" active-class="active">Message</router-link>
```

开启replace模式后，后退跳转到的是最后一个不是replace的链接

### 编程式路由

为其他控件实现跳转、跳转前处理数据等需要使用编程式路由

#### push方法

用法如下，需要传递一个参数对象，参数对象与`router-link`标签`to`属性一致

```js
this.$router.push({
    name:'detail',
    query:{
        id:msg.id,
        title:msg.title
    }
})
```

#### replace方法

传递一个参数对象，参数对象与`router-link`标签`to`属性一致

```js
this.$router.replace({
    name:'detail',
    query:{
        id:msg.id,
        title:msg.title
    }
})
```

#### back方法

后退功能

```js
this.$router.back();
```

27.9.4 forward方法

前进功能

```js
this.$router.forward();
```

#### go方法

传递一个整数做参数，如果是正数就是前进对应的步数，负数则后退相应步数

```js
this.$router.go(5);
this.$router.go(-19);
```

### 缓存路由组件

使不展示的组件保持挂载不销毁

使用`keep-alive`标签

```vue
<keep-alive>
    <router-view></router-view>
</keep-alive>
```

要缓存哪个组件，就去哪个组件的对应的`router-view`组件，即最后这个组件的展示位置两边使用`keep-alive`标签

`keep-alive`默认缓存中间的所有组件，通过`include`属性指定仅缓存其中的某几个组件

使用`include`属性指定要缓存的组件，值为==组件名==，如果是多个组件，使用逗号`,`分隔，或者使用绑定传入数组

```vue
<keep-alive include="News,Message">
    <router-view></router-view>
</keep-alive>
<keep-alive :include="['News','Message']">
    <router-view></router-view>
</keep-alive>
```

### 两个新的生命周期钩子

#### activated

组件对应的路由被激活时触发，如果不使用缓存，这个钩子不会被执行，使用缓存后，一次激活对应路由以后`mounted`不会再次调用，但这个路由激活钩子会反复调用

#### deactivated

组件对应的路由失活时触发，如果不使用缓存，这个钩子不会被执行，使用缓存后，`beforeDestroy`不会调用

### 路由守卫

**参数或查询的改变并不会触发进入/离开的导航守卫**

**导航守卫是应用在==目标==上的**

#### 全局前置守卫

每次路由切换之前调用、初始化时被调用

```js
router.beforeEach((to, from, next)=>{
    if (to.meta.authRequired){
        if (localStorage.getItem('access')!=='admin'){
            alert('403 Forbidden')
        }else {
            next();
        }
    }else {
        next();
    }
});
```

> routers是创建的VueRouter对象，并在需要验证的路由规则的`meta`属性中使用标识符决定是否要进行鉴权
>
> to:目的地的路由对象
>
> from:起点的路由对象
>
> next:函数，执行效果依赖传入的参数
>
> 1. next()：进行下一个钩子，如果全部钩子执行完，就确认导航，达到目的地
> 2. next(false)：中断当前导航，如果URL改变，则会重置到from对应的地址
> 3. next('/')或next({path:'/'})：跳转到一个不同的地址，采用对象写法可以像编程式路由中的`push`等方法一样传递参数等
> 4. next(error)：传入Error实例，该导航被中断，错误被传递给`router.onError()`注册过的回调

#### 全局后置守卫

每次路由切换之后调用、初始化时被调用

接收两个参数，不接收`next`函数

```js
router.afterEach((to,from)=>{
    //用于修改界面标题
    document.title=to.meta.title||'VueRouter';
    console.log(from);
});
```

> 上述代码用于修改页面标题，每个路由规则的`meta`属性都配置一个title，进入不同路由显示不同标题

**meta称为==路由元数据==**

#### 独享路由守卫

**独享路由守卫只有前置路由守卫**

接收三个参数，和全局前置守卫相同

```js
routes: [
    {
        path:'/home',
        component:Home,
        name:'home',
        meta:{title: 'Home'},
        beforeEnter:((to, from, next) => {

        })
    }]
```

#### 组件内路由守卫

**三种守卫都接收`to`、`from`、`next`三个参数**

- `beforeRouteEnter`

> 在渲染该组件的对应路由被confirm之前(调用next()会导致confirm)，==不能获取组件实例this==，因为此时组件还没有被创建，undefined

- `beforeRouteUpdate` (2.2 新增)

> 当前路由改变但是该组件被复用时调用，举例来说，对于使用`params`动态路径传参，路径定义为'/test/:id'时，在'/test/1'和'/test/2'之间跳转时，由于渲染同样的组件，因此组件实例会被复用，这个钩子此时调用，==可以访问组件实例对象this==

- `beforeRouteLeave`

> 导航离开该组件的对应路由时调用，==可以访问组件实例对象this==

#### 全局解析守卫

在 2.5.0+ 你可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，区别是在导航被确认之前，**同时在所有组件内守卫和异步路由组件被解析之后**，解析守卫就被调用。

#### 完整的导航解析流程

![完整的导航解析流程](/vue/完整的导航解析流程-162997569061318.png)

### HTML5 History 模式

`vue-router` 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载

井号`#`后面的内容就是hash值

hash值不会包含在HTTP请求中，即hash值不会发送给服务器

切换模式：

配置VueRouter时除了传递`route`参数，还可以传递一个`mode`参数指定工作模式

```js
mode:'hash',
routes: []
```

history模式由于会将路径发送给服务器，所以在部署时需要后端具有全路径资源匹配能力，防止404问题

### 路由元信息

定义路由的时候可以配置 `meta` 字段

一个路由匹配到的所有路由记录会暴露为 `$route` 对象 (还有在导航守卫中的路由对象) 的 `$route.matched` 数组。因此，我们需要遍历 `$route.matched` 来检查路由记录中的 `meta` 字段

### 滚动行为

使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样

当创建一个 Router 实例，提供一个 `scrollBehavior` 方法

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```

返回值示例

- `{ x: number, y: number }`
- `{ selector: string, offset? : { x: number, y: number }}`

**平滑滚动：**

将 `behavior` 选项添加到 `scrollBehavior` 内部返回的对象中

```js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash,
      behavior: 'smooth',
    }
  }
}
```

### 导航故障

```js
router.onError(callback)
```

注册一个回调，该回调会在路由导航过程中出错时被调用。注意被调用的错误必须是下列情形中的一种：

- 错误在一个路由守卫函数中被同步抛出；
- 错误在一个路由守卫函数中通过调用 `next(err)` 的方式异步捕获并处理；
- 渲染一个路由的过程中，需要尝试解析一个异步组件时发生错误
