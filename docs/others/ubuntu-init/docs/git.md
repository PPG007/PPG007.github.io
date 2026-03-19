---
prev:
  text: 首页
  link: /ubuntu-20.04-init
---

# git

```shell
# install git
sudo apt-get install git
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

# Git alias

```shell
git config --global alias.cl clone
git config --global alias.cm commit
git config --global alias.pl pull
git config --global alias.ps push
git config --global alias.rb rebase
git config --global alias.br branch
git config --global alias.sw switch
git config --global alias.cp cherry-pick
git config --global alias.ss status
git config --global alias.rs restore
```
