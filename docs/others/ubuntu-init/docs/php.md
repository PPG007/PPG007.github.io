# PHP

use [phpenv](https://github.com/phpenv/phpenv) to manage php versions

```shell
git clone git@github.com:phpenv/phpenv.git ~/.phpenv
echo 'export PATH="$HOME/.phpenv/bin:$PATH"' >> ~/.zshrc # for zsh
echo 'eval "$(phpenv init -)"' >> ~/.zshrc # for zsh
# restart shell
git clone https://github.com/php-build/php-build $(phpenv root)/plugins/php-build
phpenv install [any php version] # eg: phpenv install 8.1.0
phpenv rehash
phpenv global 8.1.0
```

Maybe there are several dependencies that your system not satisfied, just google. You can also try [phpenv-installer](https://github.com/phpenv/phpenv-installer).

There are some, maybe you need install more:

```shell
sudo apt \
	install \
	buildconf \
	autoconf \
	build-essential \
	bison \
	re2c \
	pkg-config \
	libxml2-dev \
	openssl \
	openssh-client \
	openssl \
	libssl-dev \
	sqlite3 \
	libsqlite3-dev \
	zlib1g-dev \
	libbz2-dev \
	libcurl4-openssl-dev \
	libpng-dev \
	libjpeg-dev
```
