# docker

```shell
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

```shell
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

```shell
# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

make docker run without sudo:

```shell
# normally, this group will already exist after docker installation
sudo groupadd docker
# add user to this group, eg: sudo gpasswd -a PPG007 docker
sudo gpasswd -a $USER docker
sudo systemctl restart docker
newgrp docker
```

change repository:

```shell
vim /etc/docker/daemon.json
```

add this to daemon.json:

```json
{
  "proxies": {
    "http-proxy": "http://127.0.0.1:8889",
    "https-proxy": "http://127.0.0.1:8889",
    "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
  }
}
```

[docker-compose](https://github.com/docker/compose/releases)。

To install docker-compose, download from github release and move it to `/usr/bin` and rename it to docker-compose, then run `chmod +x /use/bin/docker-compose`。
