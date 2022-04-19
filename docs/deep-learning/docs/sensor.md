---
prev:
  text: 首页
  link: /deep-learning
---
# 感知器

![图 5](/deep-learning/%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C.png)

上图每个圆圈都是一个神经元，每条线表示神经元之间的连接，上面的神经元被分成了多层，层与层之间有神经元有连接，层内之间的神经元没有连接，最左边的层叫做输入层，这层负责接收输入数据，最右边的层叫做输出层，输入层和输出层之间的层叫做隐藏层。

隐藏层大于 2 的神经网络叫做深度神经网络，深度学习就是使用深层架构的及其学习方法。

一个仅有一个隐藏层的神经网络就能拟合任意一个函数，但是需要很多神经元，。深度网络用少得多的神经元就能拟合同样的函数，也就是为了拟合一个函数，要么使用一个浅而宽的网络，要么使用一个深而窄的网络，后者往往更加节约资源，但是深层网络不太容易训练，需要大量的数据。

## 感知器

![图 7](/deep-learning/%E6%84%9F%E7%9F%A5%E5%99%A8.png)

感知器有以下组成部分：

- 输入权值：一个感知器可以接收多个输入，每个输入上有一个权值，此外还有一个偏置项 b 就是上图的 w0。
- 激活函数：感知器的激活函数可以有很多选择，比如可以使用下面这个阶跃函数来作为激活函数：

    ![图 9](/deep-learning/%E9%98%B6%E8%B7%83%E5%87%BD%E6%95%B0.png)

- 输出：感知器的输出有下面的这个公式来计算：

    ![$y=f(w \cdot x+b)$ 1](/deep-learning/%E6%84%9F%E7%9F%A5%E5%99%A8%E8%BE%93%E5%87%BA.png)

## 感知器示例

设计一个感知器实现与运算，这是一个二元运算，只有两个参数都为 1 才输出 1。这里只使用三个输入神经元，令 w0 = 0.5，w1 = 0.5，偏置项 b 取 -0.8，激活函数使用前面的阶跃函数，这时，根据上面的输出函数，可以得出：

![图 11](/deep-learning/%E4%B8%8E%E8%BF%90%E7%AE%97%E6%84%9F%E7%9F%A5%E5%99%A8%E8%AE%A1%E7%AE%97%E5%85%AC%E5%BC%8F.png)

将 x1、x2 的值带入上面的式子中，可以看到实现了与运算。

如果要实现或函数，只需要将偏置项设置为 -0.3 即可。

感知器不仅能实现简单的布尔运算，还可以拟合任意的线性函数，任何线性分类或线性回归的问题都可以用感知器来解决，上面的与运算就是一个线性分类问题。

::: tip
感知器不能实现异或运算，如下图所示，异或运算不是线性的，无法使用一条直线把分类 0 和 分类 1 分开：

![图 8](/deep-learning/%E5%BC%82%E6%88%96%E8%BF%90%E7%AE%97.png)
:::

## 感知器的训练

将权重项和偏置项初始化为 0，然后利用下面的感知器规则迭代修改 wi 和 b，直到训练完成：

![图 12](/deep-learning/%E6%84%9F%E7%9F%A5%E5%99%A8%E8%A7%84%E5%88%99.png)

其中：

![图 13](/deep-learning/%E6%84%9F%E7%9F%A5%E5%99%A8%E8%A7%84%E5%88%99%E5%8F%98%E9%87%8F%E5%80%BC.png)

wi 是与输入 xi 对应的权重项，b 是偏置项，可以把 b 看做是值永远为 1 的输入 xb 所对应的权重，t 是训练样本的实际值，一般称为 label，y 是感知器的输出值，使用之前感知器中的输出公式计算出来，η 是一个称为学习速率的常数，其作用是控制每一步调整权的幅度。

每次从训练数据中取出一个样本的输入向量，使用感知器计算其输出，再根据上面的规则来调整权重。每处理一个样本就调整一次权重。经过多轮迭代后（即全部的训练数据被反复处理多轮），就可以训练出感知器的权重，使之实现目标函数。

## 使用 Python 实现感知器并实现与运算

代码如下：

```python
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from functools import reduce


# 定义感知器类
class Perceptron(object):
    def __init__(self, input_num, activator):
        # 激活函数
        self.activator = activator
        # 权重向量初始化为 0
        self.weights = [0.0 for _ in range(input_num)]
        # 偏置项初始化为 0
        self.bias = 0.0

    def __str__(self):
        return '权值\t:%s\n偏置项\t:%f\n' % (self.weights, self.bias)

    def predict(self, input_vec):
        """
        zip() 函数可以将多个可迭代对象（这里是两个长度相等的 list）对应下标将可迭代对象的值组合起来，
        这里就可以将权值 list 和输入 list 合并为一个list，内容类似于：[(x1,w1)...]

        此函数就是将输入和权值两个 list 合并之后再逐个相乘（x1*w1）再求和，再加上偏置项，再将结果传入激活函数。
        :param input_vec: 输入 list
        :return:
        """
        return self.activator(
            reduce(lambda a, b: a + b,
                   map(lambda xw: xw[0] * xw[1],
                       zip(input_vec, self.weights))
                   , 0.0) + self.bias)

    def train(self, input_vecs, labels, times, rate):
        """
        输入训练数据：一组向量、与每个向量对应的 label；以及训练轮数、学习率
        """
        for i in range(times):
            self._one_iteration(input_vecs, labels, rate)

    def _one_iteration(self, input_vecs, labels, rate):
        """
        一次迭代，把所有的训练数据过一遍
        """
        # 把输入和输出打包在一起，成为样本的列表[(input_vec, label), ...]
        # 而每个训练样本是(input_vec, label)
        samples = zip(input_vecs, labels)
        # 对每个样本，按照感知器规则更新权重
        for (input_vec, label) in samples:
            # 计算感知器在当前权重下的输出
            output = self.predict(input_vec)
            # 更新权重
            self._update_weights(input_vec, output, label, rate)

    def _update_weights(self, input_vec, output, label, rate):
        """
        按照感知器规则更新权重
        """
        # 把input_vec[x1,x2,x3,...]和weights[w1,w2,w3,...]打包在一起
        # 变成[(x1,w1),(x2,w2),(x3,w3),...]
        # 然后利用感知器规则更新权重
        delta = label - output
        self.weights = list(map(
            lambda xw: xw[1] + rate * delta * xw[0],
            zip(input_vec, self.weights)))
        # 更新bias
        self.bias += rate * delta


def f(x):
    """
    定义激活函数f
    """
    return 1 if x > 0 else 0


def get_training_dataset():
    """
    基于and真值表构建训练数据
    """
    # 构建训练数据
    # 输入向量列表
    input_vecs = [[1, 1], [0, 0], [1, 0], [0, 1]]
    # 期望的输出列表，注意要与输入一一对应
    # [1,1] -> 1, [0,0] -> 0, [1,0] -> 0, [0,1] -> 0
    labels = [1, 0, 0, 0]
    return input_vecs, labels


def train_and_perceptron():
    """
    使用and真值表训练感知器
    """
    # 创建感知器，输入参数个数为2（因为and是二元函数），激活函数为f
    p = Perceptron(2, f)
    # 训练，迭代10轮, 学习速率为0.1
    input_vecs, labels = get_training_dataset()
    p.train(input_vecs, labels, 10, 0.1)
    # 返回训练好的感知器
    return p


if __name__ == '__main__':
    # 训练and感知器
    and_perception = train_and_perceptron()
    # 打印训练获得的权重
    print(and_perception)
    # 测试
    print('1 and 1 = %d' % and_perception.predict([1, 1]))
    print('0 and 0 = %d' % and_perception.predict([0, 0]))
    print('1 and 0 = %d' % and_perception.predict([1, 0]))
    print('0 and 1 = %d' % and_perception.predict([0, 1]))
```
