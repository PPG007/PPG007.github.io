# MySQL

[install mysql on ubuntu20.04](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)。

```shell
# isntall mysql
sudo apt install mysql-server
# run security script and config root user
sudo mysql_secure_installation
# til now, command mysql must run with sudo, create a user to resolve this
# first connect to mysql server with root
# create user
CREATE USER 'koston'@'localhost' IDENTIFIED BY 'koston.localhost';
# grant all privileges
GRANT ALL PRIVILEGES ON *.* TO 'koston'@'localhost' WITH GRANT OPTION;
# flush
FLUSH PRIVILEGES;
# exit
exit;
```
