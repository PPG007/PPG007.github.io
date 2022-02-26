# Go

[gvm](https://github.com/moovweb/gvm)

install gvm:

```shell
# install requirements
sudo apt-get install curl git mercurial make binutils bison gcc build-essential
# install gvm
zsh < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
# to install high version go, you must install go1.4 first
gvm install go1.4 -B
gvm use go1.4
export GOROOT_BOOTSTRAP=$GOROOT
# install go 1.17.6
gvm install go1.17.6 -B
gvm use go1.17.6 --default
# then run
go env -w GOPROXY="https://goproxy.cn,direct" && go env -w GO111MODULE="on"
```
