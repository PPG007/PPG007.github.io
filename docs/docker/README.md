# Docker

[Docker文档](https://docs.docker.com/)

[DockerHub仓库](https://hub.docker.com/)

[Docker 从入门到实践](https://vuepress.mirror.docker-practice.com/)

[Ubuntu 基础镜像](https://github.com/phusion/baseimage-docker/blob/master/README_ZH_cn_.md)

基于 Ubuntu 基础镜像构建 MySQL 的 Dockerfile：

```docker
FROM phusion/baseimage:master

ENV HOME /root
ENV MYSQL_USERNAME root
ENV MYSQL_PASSWORD 123456
ENV MYSQL_DB_NAME my_db

CMD ["/sbin/my_init"]
RUN apt-get update && \
    apt-get -y install mysql-server
EXPOSE 3306
# 在基础镜像 /etc/my_init.d/ 中的脚本会在容器启动时执行
COPY ./my_init.d/start_mysql.sh /etc/my_init.d/start_mysql.sh
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
```

启动脚本：

```sh
#!/bin/bash
sed -i 's/127.0.0.1/0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
service mysql start
mysql -uroot -e "CREATE USER '${MYSQL_USERNAME}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';"
mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USERNAME}'@'%' WITH GRANT OPTION;"
mysql -uroot -e "CREATE DATABASE ${MYSQL_DB_NAME};"
service mysql restart
/bin/bash
```

基于 Ubuntu 基础镜像构建 PHP 的 Dockerfile：

```docker
FROM phusion/baseimage:master

ENV HOME /root

CMD ["/sbin/my_init"]
RUN apt-add-repository ppa:ondrej/php && \
    apt-get update && \
    apt-get install -y php7.0 && \
    apt-get install -y php7.0-mysql && \
    apt-get install -y php7.0-fpm && \
    apt-get install -y php7.0-gd
COPY my_init.d/start_php.sh /etc/my_init.d/start_php.sh
EXPOSE 9000
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
```

启动脚本：

```sh
#!/bin/bash
service php7.0-fpm start
```

基于 Ubuntu 基础镜像构建 Nginx 的 Dockerfile：

```docker
FROM phusion/baseimage:master

ENV HOME /root
CMD ["/sbin/my_init"]
RUN apt-get update && \
    apt-get install -y nginx
COPY my_init.d/start_nginx.sh /etc/my_init.d/start_nginx.sh
EXPOSE 80
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
```

启动脚本：

```sh
#!/bin/sh
service nginx start
```

使用 Ubuntu 基础镜像构建 Nginx，PHP，MySQL 镜像，并使用 Docker-Compose 构建一个 WordPress 站点的 `docker-compose.yml`：

```yaml
version: '3'
services:
  mysql:
    build:
      context: ./MySQL
      dockerfile: Dockerfile
    environment:
      MYSQL_DB_NAME: wordpress
      MYSQL_USERNAME: root
      MYSQL_PASSWORD: 123456
    ports:
      - '3306:3306'
    volumes:
      - ./MySQL/conf/my.cnf:/etc/mysql/my.cnf:ro # 挂载配置文件，允许简单密码。
  php:
    build:
      context: ./PHP
      dockerfile: Dockerfile
    ports:
      - '9000:9000'
    volumes:
      - ~/playground/wordpress:/var/www/html # 挂载 WordPress 静态文件
      - ./PHP/conf/www.conf:/etc/php/7.0/fpm/pool.d/www.conf:ro # 挂载 php-fpm 配置文件。
  nginx:
    build:
      context: ./Nginx
      dockerfile: Dockerfile
    ports:
      - '80:80'
    volumes:
      - ./Nginx/conf/nginx.conf:/etc/nginx/nginx.conf:ro # 挂载 Nginx 配置文件。
    volumes_from:
      - php # 共享 PHP 的数据卷。
    depends_on:
      - php
```

MySQL 配置文件：

```toml
[mysqld]
default_authentication_plugin= mysql_native_password
```

Nginx 配置文件：

```nginx
user root;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
include /usr/share/nginx/modules/*.conf;
events {
    worker_connections 1024;
}
http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;
    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;
    include /etc/nginx/conf.d/*.conf;
    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         	/var/www/html;
        index index.php;
        include /etc/nginx/default.d/*.conf;
	      location ~ .php$ {
          fastcgi_index index.php;
          fastcgi_pass php:9000;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          fastcgi_param PATH_INFO $fastcgi_path_info;
          fastcgi_intercept_errors on;
          include fastcgi_params;
	      }
        error_log    /usr/error_www.abc.com.log    error;
    }
}
```

PHP-FPM 配置文件，只修改 listen 属性值即可，要和 Nginx 的与 PHP 连接的配置相同：

```nginx
listen = 9000
```
