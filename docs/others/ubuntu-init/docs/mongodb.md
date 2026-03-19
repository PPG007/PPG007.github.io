# MongoDB

install mongo:

```shell
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
# if error
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
# then
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

install compass:

```shell
sudo apt-get install -y libgconf-2-4
wget https://downloads.mongodb.com/compass/mongodb-compass_1.30.1_amd64.deb
sudo dpkg -i mongodb-compass_1.30.1_amd64.deb
```
