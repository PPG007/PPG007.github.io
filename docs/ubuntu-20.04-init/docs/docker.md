# docker

```shell
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get purge docker-ce docker-ce-cli containerd.io
```

```shell
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

```shell
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```shell
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

make docker run without sudo:

```shell
# normally, this group will already exist after docker installation
sudo groupadd docker
# add user to this group, eg: sudo gpasswd -a PPG007 docker
sudo gpasswd -a $USER docker
sudo service docker restart
# then log out and log in, this will work
```

change repository:

```shell
vim /etc/docker/daemon.json
```

add this to daemon.json:

```json
{
  "registry-mirrors": ["https://ustc-edu-cn.mirror.aliyuncs.com/"]
}
```

[docker-compose](https://github.com/docker/compose/releases)。

To install docker-compose, download from github release and move it to `/usr/bin` and rename it to docker-compose, then run `chmod +x /use/bin/docker-compose`。
