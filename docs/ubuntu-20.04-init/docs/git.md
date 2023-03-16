---
prev:
  text: 首页
  link: /ubuntu-20.04-init
---

# git

```shell
# install git
sudo apt install git-all
# config git
git config --global user.name "<your name>"
git config --global user.email "<your email>"
git config --global core.editor "vim"
# generate ssh key
ssh-keygen -t ed25519 -C "<your email>"
# get the ssh key, then copy ssh key to github
cat .ssh/id_ed25519.pub
# add public key to a server
ssh-copy-id -i ${path to your public key} ${username}@${host}
```
