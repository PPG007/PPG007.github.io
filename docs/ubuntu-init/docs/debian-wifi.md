# Fix Debian wifi

[Link](https://www.cyberciti.biz/faq/intel-wifi-on-debian-linux-when-you-get-firmware-failed-to-load-iwlwifi-8265-36-error/)

```shell
sudo apt install firmware-iwlwifi
# Loading Intel WiFi device driver firemware
sudo modprobe -r iwlwifi
sudo modprobe iwlwifi
sudo dmesg
```
