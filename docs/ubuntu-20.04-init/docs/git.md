---
prev:
  text: 首页
  link: /Ubuntu20.04Init
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
# get the ssh key
cat .ssh/id_ed25519.pub
# copy ssh key to github
```
