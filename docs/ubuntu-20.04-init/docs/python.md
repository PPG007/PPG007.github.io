# Python

```shell
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get install python3.7
sudo apt-get install python3-venv
sudo apt install python3-pip
# then config pip
mkdir ~/.pip
vim ~/.pip/pip.conf
```

add this to pip.conf:

```conf
[global]
index-url=http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host=mirrors.aliyun.com
```
