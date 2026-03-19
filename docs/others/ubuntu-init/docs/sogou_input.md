# sogou input

[sogou input](https://shurufa.sogou.com/)。

Ubuntu20.04 should download the version higher than 2.3

If your system has already installed fcitx, just install sogou deb package and config.

```shell
# update apt
sudo apt-get update
# install fcitx
sudo apt install fcitx
# config fcitx as system input
# then make fcitx start with system
sudo cp /usr/share/applications/fcitx.desktop /etc/xdg/autostart/
# remove ibus
sudo apt purge ibus
# install sogou input fron deb package
# then resolve dependencies
sudo apt install libqt5qml5 libqt5quick5 libqt5quickwidgets5 qml-module-qtquick2
sudo apt install libgsettings-qt1
# then reboot ubuntu
```
